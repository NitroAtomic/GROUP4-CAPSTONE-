// test/qa/qa-checklist-retest.cjs
// Muling pagsubok ng mga row sa QA TEST CHECKLIST na luma na ang tala
// (Nobyembre 17, 2026). Totoong browser sa build ng frontend; ang API ay
// pekeng sagot lang, kaya ang sinusubok ay ang asal ng frontend.
//
//   npm run build && node test/qa/qa-checklist-retest.cjs
//
// TC-ASSESS-02  Hindi matatapos ang assessment kapag may tanong na walang sagot.
// TC-ASSESS-04  Lahat tama sa 21 tanong: 100%, Advanced, walang weak area.
// TC-AUTH-07    Log out: nabubura ang session at napupunta sa /login.
// TC-MOD-01/03  Libreng module bukas sa guest, may naka-embed na video.
// TC-CHAT-01    May CyberWise sa home, wala sa assessment question page.
// TC-CHAT-03    Napapalitan ng [REDACTED] ang password bago ipadala.
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const DIST = path.join(ROOT, 'dist');
const results = [];
const record = (id, name, expected, actual, pass) => {
  results.push({ id, name, expected, actual, status: pass ? 'Pass' : 'Fail' });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id} ${name}: ${actual}`);
};

const PREMIUM_USER = { user_id: 1, first_name: 'QA', last_name: 'Tester', email: 'qa@example.test', role: 'user', subscription_type: 'Premium', subscription_status: 'active', subscription_expires_at: new Date(Date.now() + 30 * 864e5).toISOString() };

function serve(mocks, log) {
  const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2' };
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = req.url.split('?')[0];
      if (url.startsWith('/api/')) {
        let body = '';
        req.on('data', (c) => { body += c; });
        req.on('end', () => {
          log.push({ method: req.method, url, body });
          const key = Object.keys(mocks).find((k) => url === k);
          const value = key ? (typeof mocks[key] === 'function' ? mocks[key](body) : mocks[key]) : { error: 'not mocked' };
          res.writeHead(key ? 200 : 404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(value));
        });
        return;
      }
      let file = path.join(DIST, url);
      if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, 'index.html');
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, () => resolve(server));
  });
}

async function run() {
  const assessmentData = (await import(path.join(ROOT, 'javascript/framework/vue/data/assessment-data.js'))).default;
  const byText = {};
  for (const q of assessmentData.questions) {
    const correct = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
    byText[q.questionText] = correct.map((v) => q.options.find((o) => String(o.value) === String(v)).text);
  }

  const log = [];
  const server = await serve({
    '/api/auth/me': PREMIUM_USER,
    '/api/auth/logout': { ok: true },
    '/api/assessment/submit': { ok: true },
    '/api/dashboard': { progress: [], quiz_history: [], latest_assessment: null },
    '/api/chat': { reply: 'Never share a password, even to check it. A strong one is long and unique.', source: 'local' },
  }, log);
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const shots = path.join(__dirname, 'shots');
  fs.mkdirSync(shots, { recursive: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('dialog', (d) => d.accept());

    // ---- Guest checks first ----
    await page.goto(base + '/modules/quishing');
    await page.waitForLoadState('networkidle');
    const guestText = (await page.locator('main').innerText()).length;
    let iframes = 0;
    for (let i = 0; i < 20 && !(iframes = await page.locator('iframe[src*="youtube"]').count()); i++) {
      const next = page.getByRole('button', { name: /^Next/ });
      if (!(await next.count()) || !(await next.first().isEnabled())) break;
      await next.first().click();
      await page.waitForTimeout(150);
    }
    if (iframes) await page.locator('iframe[src*="youtube"]').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(shots, 'tc-mod-03.png') });
    record('TC-MOD-01/03', 'Guest opens a Free module with its video', 'Module text loads without login; an embedded YouTube video is on the page',
      `Loaded as a guest, ${guestText} characters of lesson text, ${iframes} embedded YouTube video(s)`, guestText > 1000 && iframes > 0);

    await page.goto(base + '/');
    await page.waitForLoadState('networkidle');
    const widgetHome = await page.locator('.chatbot-widget').isVisible();

    // ---- Premium session ----
    await page.evaluate((u) => { sessionStorage.setItem('se_auth_token', 'qa-token'); sessionStorage.setItem('se_auth_user', JSON.stringify(u)); }, PREMIUM_USER);

    // TC-CHAT-03
    await page.goto(base + '/dashboard');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Open CyberWise learning assistant' }).click();
    await page.locator('#chatbot-message-input').fill('My password is MyP@ssword123. Is it strong?');
    await page.locator('.chatbot-send-button').click();
    await page.waitForTimeout(1500);
    const chatReq = log.filter((r) => r.url === '/api/chat').pop();
    const sent = chatReq ? chatReq.body : '';
    const shown = await page.locator('.chatbot-conversation').innerText();
    record('TC-CHAT-03', 'Password typed into CyberWise is hidden', 'The password is replaced with [REDACTED] before sending, and in the chat',
      `Request body ${sent.includes('MyP@ssword123') ? 'CONTAINED' : 'did not contain'} the password and ${sent.includes('[REDACTED]') ? 'contained' : 'did not contain'} [REDACTED]; chat shows ${shown.includes('MyP@ssword123') ? 'the password' : '[REDACTED]'}`,
      !!chatReq && !sent.includes('MyP@ssword123') && sent.includes('[REDACTED]') && !shown.includes('MyP@ssword123'));
    await page.screenshot({ path: path.join(shots, 'tc-chat-03.png') });

    // TC-ASSESS-02 and TC-ASSESS-04
    await page.goto(base + '/assessment/question');
    await page.waitForSelector('.quiz-question-text');
    const widgetAssess = await page.locator('.chatbot-widget').isVisible();
    record('TC-CHAT-01', 'CyberWise shown on learner pages, hidden during the assessment', 'Widget visible on Home, hidden on /assessment/question',
      `Home: ${widgetHome ? 'visible' : 'hidden'}; assessment question page: ${widgetAssess ? 'visible' : 'hidden'}`, widgetHome && !widgetAssess);

    const checkDisabledBefore = await page.locator('.quiz-check-button').isDisabled();
    let total = 0;
    for (;;) {
      const q = (await page.locator('.quiz-question-text').innerText()).trim();
      const want = byText[q];
      if (!want) throw new Error('Unknown question: ' + q);
      total += 1;
      for (const label of await page.locator('.quiz-answer-option').all()) {
        const t = (await label.innerText()).trim();
        if (want.includes(t)) await label.locator('input').check();
      }
      await page.locator('.quiz-check-button').click();
      if (await page.locator('.quiz-submit-button').count()) { await page.locator('.quiz-submit-button').click(); break; }
      await page.locator('.quiz-next-button').click();
    }
    record('TC-ASSESS-02', 'Assessment cannot go on with an unanswered question', 'Check Answer stays disabled until an answer is chosen',
      `Check Answer was ${checkDisabledBefore ? 'disabled' : 'ENABLED'} before an answer was chosen`, checkDisabledBefore);

    await page.waitForURL('**/assessment/results');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(shots, 'tc-assess-04.png'), fullPage: false });
    const saved = JSON.parse(await page.evaluate(() => sessionStorage.getItem('assessment-results')));
    const submit = log.filter((r) => r.url === '/api/assessment/submit').pop();
    const body = submit ? JSON.parse(submit.body) : {};
    record('TC-ASSESS-04', 'Perfect score classification (21-question assessment)', '100%, Advanced, no weak areas, result sent to the server',
      `${total} questions answered; ${saved.score}/${saved.totalPoints} = ${saved.percentageScore}%, ${saved.level}, weak areas: ${(saved.weak_areas || []).length}; submit sent: ${submit ? `score ${body.score}/${body.total}, ${body.level}` : 'no'}`,
      total === 21 && saved.percentageScore === 100 && saved.level === 'Advanced' && (saved.weak_areas || []).length === 0 && !!submit && body.score === 21);

    // TC-AUTH-07
    await page.goto(base + '/dashboard');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Log out' }).first().click();
    await page.waitForURL('**/login');
    const tokenAfter = await page.evaluate(() => sessionStorage.getItem('se_auth_token'));
    await page.goto(base + '/dashboard');
    await page.waitForTimeout(800);
    const afterUrl = new URL(page.url()).pathname;
    const loggedOut = log.some((r) => r.url === '/api/auth/logout' && r.method === 'POST');
    record('TC-AUTH-07', 'Log out clears the session', 'Logout request sent, token removed from sessionStorage, /login opens, /dashboard no longer opens',
      `Logout request ${loggedOut ? 'sent' : 'NOT sent'}; token after logout: ${tokenAfter === null ? 'removed' : 'still there'}; opening /dashboard went to ${afterUrl}`,
      loggedOut && tokenAfter === null && afterUrl === '/login');

    if (errors.length) console.log('Page errors:', errors);
  } finally {
    await browser.close();
    server.close();
  }
}

run().then(() => {
  fs.writeFileSync(path.join(__dirname, 'qa-checklist-results.json'), JSON.stringify({ ranAt: new Date().toISOString(), results }, null, 2));
  process.exit(results.every((r) => r.status === 'Pass') ? 0 : 1);
}).catch((e) => { console.error(e); process.exit(1); });
