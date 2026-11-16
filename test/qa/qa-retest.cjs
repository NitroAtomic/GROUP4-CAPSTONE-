// test/qa/qa-retest.cjs
// Pinalitan ang apat na "Outdated test" sa QA Checks sheet (Nobyembre 16, 2026).
// Hindi naka-commit ang mga lumang suite, kaya isinulat muli ayon sa kasalukuyang
// asal ng system, saka pinatakbo.
//
//   npm run build && node test/qa/qa-retest.cjs
//
// QA-1 Billing: ang cancel ay hindi agad tinatapos ang Premium.
// QA-2 Funnel at dashboard: bagong dashboard, totoong browser.
// QA-3 Premium lesson shell: walang bayad na aral sa public files; bagong size limit.
// QA-4 Premium shell sa totoong browser (dati pekeng Vue na walang $nextTick).
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

// ---------- QA-1 ----------
function qa1() {
  require.cache[require.resolve(path.join(ROOT, 'backend-node/config/db.js'))] = { exports: {} };
  const { isActivePremium } = require(path.join(ROOT, 'backend-node/middleware/premium.js'));
  const day = 24 * 3600 * 1000;
  const future = new Date(Date.now() + 10 * day);
  const past = new Date(Date.now() - day);
  const cases = [
    ['active, no end date', { subscription_type: 'Premium', subscription_status: 'active', subscription_expires_at: null }, true],
    ['active, end date ahead', { subscription_type: 'Premium', subscription_status: 'active', subscription_expires_at: future }, true],
    ['cancelled, end date ahead (keeps Premium)', { subscription_type: 'Premium', subscription_status: 'cancelled', subscription_expires_at: future }, true],
    ['cancelled, end date passed', { subscription_type: 'Premium', subscription_status: 'cancelled', subscription_expires_at: past }, false],
    ['cancelled, no end date', { subscription_type: 'Premium', subscription_status: 'cancelled', subscription_expires_at: null }, false],
    ['active, end date passed', { subscription_type: 'Premium', subscription_status: 'active', subscription_expires_at: past }, false],
    ['Free account', { subscription_type: 'Free', subscription_status: 'active', subscription_expires_at: future }, false],
    ['no account row', undefined, false],
  ];
  const failed = cases.filter(([, row, want]) => isActivePremium(row) !== want).map(([n]) => n);
  record('QA-1', 'Older billing suite (updated)', 'Cancel keeps Premium until the end date, then ends it', failed.length ? `Failed: ${failed.join('; ')}` : `${cases.length} of ${cases.length} cases passed`, !failed.length);
}

// ---------- static server for dist with API mocks ----------
function serve(mocks) {
  const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2' };
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = req.url.split('?')[0];
      if (url.startsWith('/api/')) {
        const key = Object.keys(mocks).find((k) => url === k);
        res.writeHead(key ? 200 : 404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(key ? mocks[key] : { error: 'not mocked' }));
      }
      let file = path.join(DIST, url);
      if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, 'index.html');
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, () => resolve(server));
  });
}

const PREMIUM_USER = { user_id: 1, first_name: 'QA', last_name: 'Tester', email: 'qa@example.test', role: 'user', subscription_type: 'Premium', subscription_status: 'active', subscription_expires_at: new Date(Date.now() + 30 * 864e5).toISOString() };

async function withPage(server, fn) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const base = `http://127.0.0.1:${server.address().port}`;
  try { return await fn(page, base, errors); } finally { await browser.close(); }
}

async function login(page, base, user) {
  await page.goto(base + '/');
  await page.evaluate((u) => { sessionStorage.setItem('se_auth_token', 'qa-token'); sessionStorage.setItem('se_auth_user', JSON.stringify(u)); }, user);
}

// ---------- QA-2 ----------
async function qa2() {
  const server = await serve({
    '/api/auth/me': PREMIUM_USER,
    '/api/dashboard': { assessment: { score: 18, total: 21, awareness_level: 'Advanced', by_topic: { vishing: { correct: 1, total: 3 }, smishing: { correct: 2, total: 3 } }, weak_areas: ['vishing'], assessment_date: '2026-11-16' }, progress: [{ slug: 'vishing', completion_status: 'in_progress' }], quiz_history: [{ slug: 'smishing', module_title: 'Smishing', score: 8, total: 10 }] },
    '/api/modules': [],
    '/api/dashboard/recommendations': [{ slug: 'vishing', module_title: 'Vishing', description: 'Voice phishing' }],
  });
  try {
    await withPage(server, async (page, base, errors) => {
      // Funnel: guest sees the plans page and reaches account creation with the plan kept.
      await page.goto(base + '/premium-subscription');
      await page.waitForTimeout(800);
      const plansShown = /monthly/i.test(await page.content()) && /yearly/i.test(await page.content());
      await login(page, base, PREMIUM_USER);
      await page.goto(base + '/dashboard');
      await page.waitForSelector('text=Welcome back', { timeout: 8000 });
      await page.waitForTimeout(800);
      const text = await page.innerText('body');
      const ok = plansShown && /Weak areas found/i.test(text) && /Vishing/.test(text) && /Advanced/.test(text) && errors.length === 0;
      await page.screenshot({ path: path.join(__dirname, 'qa2-dashboard.png') });
      record('QA-2', 'Older funnel suite (updated to the new dashboard)', 'Plans page shows Monthly and Yearly; new dashboard loads with level, weak area and recommendation, no console errors',
        `plans shown: ${plansShown}; dashboard shows Advanced, Weak areas found and Vishing: ${/Vishing/.test(text)}; console errors: ${errors.length}`, ok);
    });
  } finally { server.close(); }
}

// ---------- QA-3 ----------
function qa3() {
  const assets = path.join(DIST, 'assets');
  const publicText = fs.readdirSync(assets).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(assets, f), 'utf8')).join('\n');
  const lessonDir = path.join(ROOT, 'backend-node', 'content', 'premium');
  const strip = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ');
  let checked = 0; const leaked = [];
  for (const f of fs.readdirSync(lessonDir).filter((x) => x.endsWith('.html'))) {
    for (const s of strip(fs.readFileSync(path.join(lessonDir, f), 'utf8')).split(/(?<=[.!?])\s+/)) {
      if (s.length < 60) continue;
      checked++;
      if (publicText.includes(s.slice(0, 60))) leaked.push(`${f}: ${s.slice(0, 50)}`);
    }
  }
  const shell = fs.readdirSync(assets).filter((f) => /^PremiumModule-.*\.js$/.test(f));
  const sizeKb = shell.length ? Math.round(fs.statSync(path.join(assets, shell[0])).size / 1024) : null;
  const LIMIT_KB = 40; // dating 12 KB, bago bumalik ang buong layout ng aralin (23 KB noon)
  // Isang pamagat ng sanggunian ang sadyang nasa libreng module din (QA Checks, Oct 24).
  const ok = leaked.length <= 1 && sizeKb !== null && sizeKb <= LIMIT_KB;
  record('QA-3', 'Premium lesson shell size and leak check (updated limit)', `No paid lesson sentence in public JavaScript; lesson shell at most ${LIMIT_KB} KB`,
    `${checked} paid sentences checked, ${leaked.length} found in public files${leaked.length ? ' (' + leaked.join('; ') + ')' : ''}; shell ${sizeKb} KB`, ok);
}

// ---------- QA-4 ----------
async function qa4() {
  const html = fs.readFileSync(path.join(ROOT, 'backend-node/content/premium/client-data.html'), 'utf8');
  const server = await serve({ '/api/auth/me': PREMIUM_USER, '/api/modules/client-data/content': { html } });
  try {
    await withPage(server, async (page, base, errors) => {
      await login(page, base, PREMIUM_USER);
      await page.goto(base + '/modules/premium/client-data');
      await page.waitForSelector('.premium-step-content', { timeout: 10000 });
      await page.waitForTimeout(800);
      const steps = await page.locator('.premium-lesson-menu li').count();
      const h1 = await page.locator('h1').first().innerText();
      const before = await page.locator('.premium-step-eyebrow').first().innerText();
      const next = page.locator('.premium-step-navigation button').last();
      if (await next.count()) await next.click();
      await page.waitForTimeout(500);
      const after = await page.locator('.premium-step-eyebrow').first().innerText();
      await page.screenshot({ path: path.join(__dirname, 'qa4-premium-shell.png') });
      const ok = steps > 1 && before !== after && /Executive Impersonation and Client Data/.test(h1) && errors.length === 0;
      record('QA-4', 'Older premium shell suite (moved to a real browser)', 'Lesson loads, shows its steps, Next moves to the next step, no console errors',
        `title "${h1}"; ${steps} steps; step changed from "${before}" to "${after}"; console errors: ${errors.length}${errors.length ? ' (' + errors.slice(0, 2).join(' | ') + ')' : ''}`, ok);
    });
  } finally { server.close(); }
}

(async () => {
  qa1();
  await qa2();
  qa3();
  await qa4();
  fs.writeFileSync(path.join(__dirname, 'qa-retest-results.json'), JSON.stringify({ ranAt: new Date().toISOString(), results }, null, 2));
  process.exit(results.every((r) => r.status === 'Pass') ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
