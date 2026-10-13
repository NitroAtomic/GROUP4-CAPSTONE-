// scripts/preview-premium.cjs
//
// .cjs ang dulo, hindi .js: naka-"type": "module" ang package.json sa
// ugat, kaya ESM ang bawat .js doon at walang require() -- at ang
// script na ito ay tumatakbo sa labas ng bundle.
// IamAtomic — Group 4 Capstone 2, SE-AWARE
//
//   npm run preview:premium
//
// Binubuksan ang apat na bayad na aral sa browser nang walang server,
// walang login, at walang deploy.
//
// ANG PROBLEMA
//
// Noong inilipat ang mga aral ng Premium palabas ng frontend --
// backend-node/content/premium/*.html -- naging tama ang paywall pero
// naging mabigat ang pag-eedit: para lang makita ang isang pagbabago sa
// teksto, kailangan pang mag-deploy at mag-login bilang Premium.
//
// Ito ang katumbas na paraan: kinukuha ang parehong CSS na ginagamit ng
// totoong site, binabalot ang aral sa parehong mga klase ng module page,
// at isinusulat bilang ordinaryong .html na puwedeng i-double click.
//
// Hindi nito pinapalitan ang totoong pagsubok. Walang login dito, kaya
// hindi mo masusubukan ang gate. Ang anyo lang ng aral ang nakikita --
// na siya namang inaayos kapag nag-eedit ng nilalaman.

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LESSONS = path.join(ROOT, 'backend-node', 'content', 'premium');
const OUT = path.join(ROOT, 'dist', 'premium-preview');

// Pamagat at panimula, kapareho ng nasa PremiumModule.js.
const META = {
  'invoice-scams': 'Invoice and Payment Scams',
  'client-data': 'Secure Client Data Handling',
  'client-impersonation': 'Client Impersonation',
  'fake-recruiters': 'Fake Job and Recruiter Offers',
};

function buildCss() {
  /* Tinatakbo ang build dahil tinatanggal ng Tailwind ang mga klaseng
     hindi nito nakikita. Kapag nagdagdag ka ng bagong klase sa aral,
     wala iyon sa lumang CSS -- at mukhang sira ang preview kahit tama
     ang sinulat mo. */
  process.stdout.write('Building the stylesheet... ');
  execFileSync('npx', ['vite', 'build'], { cwd: ROOT, stdio: 'pipe' });
  const assets = path.join(ROOT, 'dist', 'assets');
  const css = fs.readdirSync(assets).filter((f) => f.endsWith('.css'));
  if (!css.length) throw new Error('No stylesheet in dist/assets after the build.');
  console.log('done.');
  return css.map((f) => fs.readFileSync(path.join(assets, f), 'utf8')).join('\n');
}

function page(slug, title, lesson, css, siblings) {
  const nav = siblings
    .map((s) => `<a href="./${s}.html"${s === slug ? ' aria-current="page"' : ''}>${META[s]}</a>`)
    .join('');

  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — preview</title>
<style>${css}</style>
<style>
  .pv-bar { position: sticky; top: 0; z-index: 50; display: flex; flex-wrap: wrap;
    align-items: center; gap: 8px; padding: 10px 16px; background: var(--card-bg);
    border-bottom: 1px solid var(--border); font: 600 13px/1.4 Arial, sans-serif; }
  .pv-bar a { padding: 5px 10px; border: 1px solid var(--border); border-radius: 7px;
    color: var(--heading); text-decoration: none; }
  .pv-bar a[aria-current] { background: var(--surface-2); border-color: var(--accent-text); }
  .pv-bar button { margin-left: auto; padding: 5px 12px; border: 1px solid var(--border);
    border-radius: 7px; background: var(--card-bg); color: var(--heading);
    font: inherit; cursor: pointer; }
  .pv-note { padding: 10px 16px; color: var(--muted); background: var(--bg);
    border-bottom: 1px solid var(--border); font: 400 12.5px/1.5 Arial, sans-serif; }
  /* Ang pamagat ay galing sa shell (PremiumModule.vue), wala sa file ng
     aral. Nakasulat dito para may makita, at nasa anyong katulad noon --
     pero ang laman lang sa ilalim nito ang talagang ineedit mo. */
  .pv-title { max-width: 980px; margin: 28px auto 4px; padding: 0 16px;
    font: 700 30px/1.2 Arial, sans-serif; color: var(--heading); }
  .pv-title + .pv-sub { max-width: 980px; margin: 0 auto 18px; padding: 0 16px;
    color: var(--muted); font: 400 13px/1.5 Arial, sans-serif; }
</style>
</head>
<body>
  <div class="pv-bar">${nav}
    <button type="button" onclick="document.documentElement.dataset.theme =
      document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'">Light / dark</button>
  </div>
  <p class="pv-note">Local preview of
    backend-node/content/premium/${slug}.html — edit that file and run
    <code>npm run preview:premium</code> again. No server, no login, nothing deployed.</p>

  <h1 class="pv-title">${title}</h1>
  <p class="pv-sub">The heading and breadcrumb above the lesson come from the page
    shell, not from this file. Everything below is the lesson itself.</p>

  <main class="module-page">
    <div class="module-container">
      ${lesson}
    </div>
  </main>
</body>
</html>`;
}

try {
  if (!fs.existsSync(LESSONS)) throw new Error(`No lessons at ${LESSONS}`);
  const slugs = fs.readdirSync(LESSONS).filter((f) => f.endsWith('.html')).map((f) => f.replace(/\.html$/, ''));
  if (!slugs.length) throw new Error('No lesson files found.');

  const css = buildCss();
  fs.mkdirSync(OUT, { recursive: true });

  for (const slug of slugs) {
    const lesson = fs.readFileSync(path.join(LESSONS, `${slug}.html`), 'utf8');
    const title = META[slug] || slug;
    fs.writeFileSync(path.join(OUT, `${slug}.html`), page(slug, title, lesson, css, slugs));
  }

  console.log(`\n${slugs.length} lesson(s) written to dist/premium-preview/\n`);
  for (const slug of slugs) {
    console.log(`  ${path.join(OUT, `${slug}.html`)}`);
  }
  console.log('\nOpen any of those in a browser. Edit the lesson, run this again, refresh.\n');
} catch (err) {
  console.error('\nCould not build the preview:', err.message, '\n');
  process.exitCode = 1;
}
