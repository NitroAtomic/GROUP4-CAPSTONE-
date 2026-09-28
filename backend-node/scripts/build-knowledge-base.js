// scripts/build-knowledge-base.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
//
// Ginagawa yung knowledge base ng assistant galing sa sariling content ng
// platform, para galing dito yung sagot, hindi sa general knowledge ng model.
//
// Patakbuhin gamit:  npm run kb:build
//
// Sources: yung anim na Free module pages, yung role-based module content, at
// yung mga explanation na nakalagay sa quiz at assessment questions. Isinama
// yung mga explanation kasi bawat isa maikli at self-contained na sagot na
// sa sariling tanong niya.
//
// Plain JSON file lang yung output, committed kasama code. Walang vector
// database, walang embedding step — walang patatakbuhin, walang nawawala pag
// nag-restart.

const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(__dirname, '..', 'data', 'knowledge-base.json');

/** Tinatanggal yung tags, scripts, at styles sa page, ibinabalik yung
 *  readable text. */
function textFromHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    // Nav, header at footer: gamit sila sa pahina, pero hindi sila aral.
    // Kapag naiwan, nauuna pang lumabas yung "Home" sa sagot ng assistant.
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    // Emoji na pang-dekorasyon lang sa mga heading at breadcrumb.
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
    .replace(/<\/(p|div|section|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '-')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    // Naiwang breadcrumb sa simula, gaya ng "Home" o "Home /".
    .replace(/^\s*Home\s*[\/|>-]?\s*/i, '')
    .trim();
}

/** Hinahati yung text sa chunks na mga `size` words, buo pa rin yung sentence
 *  para hindi maputol yung thought sa gitna. */
function chunk(text, title, source, route = null, size = 110) {
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
  const chunks = [];
  let current = [];
  let count = 0;

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/).length;
    if (count + words > size && current.length) {
      chunks.push({ title, source, route, text: current.join(' ').trim() });
      current = [];
      count = 0;
    }
    current.push(sentence);
    count += words;
  }
  if (current.length) chunks.push({ title, source, route, text: current.join(' ').trim() });

  return chunks.filter((c) => c.text.split(/\s+/).length > 15);
}

const isReferenceHeading = (heading) =>
  Boolean(heading) && /resource|reference|further reading|video|source|citation|watch/i.test(heading);

const entries = [];

// Saan tumuturo ang bawat pinagkunan, para may "learn more" link ang sagot.
const MODULE_ROUTES = {
  'Quishing.vue': '/modules/quishing',
  'SpearPhishing.vue': '/modules/spear-phishing',
  'Smishing.vue': '/modules/smishing',
  'Vishing.vue': '/modules/vishing',
  'Pretexting.vue': '/modules/pretexting',
  'EssentialSafePracticesRemoteEnv.vue': '/modules/essential-safe-practices-remote-environments',
};
const PREMIUM_ROUTES = {
  'ClientImpersonation.vue': '/modules/premium/client-impersonation',
  'ClientData.vue': '/modules/premium/client-data',
  'FakeRecruiters.vue': '/modules/premium/fake-recruiters',
  'InvoiceScams.vue': '/modules/premium/invoice-scams',
};
const QUIZ_ROUTES = {
  'module-1.json': '/modules/quishing',
  'module-2.json': '/modules/spear-phishing',
  'module-3.json': '/modules/smishing',
  'module-4.json': '/modules/vishing',
  'module-5.json': '/modules/pretexting',
  'module-6.json': '/modules/essential-safe-practices-remote-environments',
  'course-1.json': '/modules/premium/client-impersonation',
  'course-2.json': '/modules/premium/client-data',
  'course-3.json': '/modules/premium/fake-recruiters',
  'course-4.json': '/modules/premium/invoice-scams',
};

// 1. Yung anim na Free module pages.
//
// Dati galing to sa /modules/*.html (yung pre-Vue static pages). Tinanggal na
// yun sa cleanup (dead weight na, hindi na ginagamit ng live site), kaya dito
// na sa totoong source of truth kinukuha: yung .vue component mismo ng bawat
// module sa javascript/framework/vue/modules/. Ang <template> block ang
// binabasa, parang HTML pa rin naman ang laman non.
//
// Hinati sa section headings, hindi isang page = isang block. Kung hindi
// ganito, iisang vague na title lang share ng bawat chunk ng page, samantalang
// descriptive naman yung title ng role-based modules gaya ng "Red flags" —
// kaya na-bias yung retrieval papunta doon nang walang dahilan.
const modulesDir = path.join(ROOT, 'javascript', 'framework', 'vue', 'modules');
if (fs.existsSync(modulesDir)) {
  // Yung mga tunay na module pages lang, hindi yung mga helper component
  // gaya ng ModuleVideo.vue — tinutukoy sa pagkakaroon ng "module-page" class,
  // na nasa <main> wrapper ng bawat totoong module page.
  for (const file of fs.readdirSync(modulesDir).filter((f) => f.endsWith('.vue'))) {
    const sfc = fs.readFileSync(path.join(modulesDir, file), 'utf8');
    if (!sfc.includes('module-page')) continue;

    const templateMatch = sfc.match(/<template>([\s\S]*)<\/template>/i);
    if (!templateMatch) continue;
    const html = templateMatch[1];

    const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
    const moduleName = (h1Match ? h1Match[1] : file.replace(/\.vue$/, ''))
      .replace(/\s*[|-].*$/, '')
      .replace(/^Module\s*\d+:\s*/i, '')
      .trim();

    // Hatiin yung body sa bawat h2/h3, para sabay dala yung heading ng section.
    const parts = html.split(/<h[23][^>]*>/i);
    let carriedHeading = null;

    for (const part of parts) {
      const headingEnd = part.indexOf('<');
      const heading = headingEnd > 0 ? part.slice(0, headingEnd).trim() : null;
      const bodyText = textFromHtml(headingEnd > 0 ? part.slice(headingEnd) : part);

      if (!bodyText) { carriedHeading = heading || carriedHeading; continue; }

      // Yung listahan ng videos at references ay sanggunian, hindi aral.
      // Kapag kasama sila, nananalo sila sa hindi nila dapat panalunan: yung
      // video na "What is Vishing?" halos tugmang-tugma sa tanong na "what is
      // vishing", pero wala namang itinuturo sa nagbabasa.
      if (isReferenceHeading(heading)) { carriedHeading = heading || carriedHeading; continue; }

      const label = heading && heading.length < 90
        ? `${moduleName}: ${heading}`
        : moduleName;

      entries.push(...chunk(bodyText, label, `javascript/framework/vue/modules/${file}`,
        MODULE_ROUTES[file] || null));
      carriedHeading = heading || carriedHeading;
    }
  }
}

// 2. Role-based (Premium) module pages. Parehong paraan sa Free modules, pero
//    naka-marka bilang Premium para masala sila para sa Free na user.
const premiumDir = path.join(modulesDir, 'premium');
if (fs.existsSync(premiumDir)) {
  for (const file of fs.readdirSync(premiumDir).filter((f) => f.endsWith('.vue'))) {
    const sfc = fs.readFileSync(path.join(premiumDir, file), 'utf8');
    const templateMatch = sfc.match(/<template>([\s\S]*)<\/template>/i);
    if (!templateMatch) continue;
    const html = templateMatch[1];

    const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
    const moduleName = (h1Match ? h1Match[1] : file.replace(/\.vue$/, '')).trim();
    const route = PREMIUM_ROUTES[file] || null;

    for (const part of html.split(/<h[23][^>]*>/i)) {
      const headingEnd = part.indexOf('<');
      const heading = headingEnd > 0 ? part.slice(0, headingEnd).trim() : null;
      const bodyText = textFromHtml(headingEnd > 0 ? part.slice(headingEnd) : part);
      if (!bodyText) continue;

      if (isReferenceHeading(heading)) continue;

      const label = heading && heading.length < 90 ? `${moduleName}: ${heading}` : moduleName;
      entries.push(...chunk(bodyText, label, 'role-based modules', route));
    }
  }
}

// 3. Quiz explanations. Direktang sagot na to sa totoong tanong, kaya kasama
//    na rin yung tanong, hindi tinapon. Yung course-*.json ay Premium quizzes,
//    kaya kasama sila sa nasasala para sa Free na user.
const dataDir = path.join(ROOT, 'javascript', 'framework', 'vue', 'data');
if (fs.existsSync(dataDir)) {
  for (const file of fs.readdirSync(dataDir).filter((f) => /^(module|course)-\d+\.json$/.test(f))) {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const premium = file.startsWith('course-');
    for (const q of data.questions || []) {
      if (!q.explanation) continue;
      entries.push({
        title: data.moduleName,
        source: premium ? 'role-based modules' : `quiz/${file}`,
        route: QUIZ_ROUTES[file] || null,
        text: `${q.questionText} ${q.explanation}`,
      });
    }
  }
}

// 4. Assessment explanations. ES module to (export default), kaya dynamic
//    import ang gamit, hindi require.
async function addAssessment() {
  const assessPath = path.join(ROOT, 'javascript', 'framework', 'vue', 'data', 'assessment-data.js');
  if (!fs.existsSync(assessPath)) return;

  const mod = await import(url.pathToFileURL(assessPath).href);
  const data = mod.default || mod;
  for (const q of data.questions || []) {
    if (!q.explanation) continue;
    entries.push({
      title: data.moduleName || 'Awareness assessment',
      source: 'assessment',
      route: '/assessment/question',
      text: `${q.questionText} ${q.explanation}`,
    });
  }
}

addAssessment().then(() => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ builtAt: new Date().toISOString(), entries }, null, 2));

  const words = entries.reduce((n, e) => n + e.text.split(/\s+/).length, 0);
  console.log(`Knowledge base built: ${entries.length} passages, about ${words} words.`);
});
console.log(`Written to ${path.relative(ROOT, OUT)}`);
