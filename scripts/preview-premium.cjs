// Local preview: npm run preview:premium. Never deploy dist/premium-preview.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const LESSONS = path.join(ROOT, 'backend-node', 'content', 'premium');
const OUT = path.join(ROOT, 'dist', 'premium-preview');
const CONTROLLER = path.join(ROOT, 'javascript/framework/vue/modules/premium/PremiumModule.js');
const META = {
  'invoice-scams': { title: 'Invoice and Payment Scams', intro: 'How attackers redirect a real payment to their own account — by changing bank details on an invoice, or a payroll record — and the two checks that stop it.' },
  'client-data': { title: 'Secure Client Data Handling', intro: 'You hold the client files, the passwords and the access. The usual way all three get exposed is someone posing as your boss — here is how that works, and the one check that stops it whatever rank is on the message.' },
  'client-impersonation': { title: 'Client Impersonation', intro: 'How a fake client takes your login, your work, or your money — and the checks that keep a new project from costing you.' },
  'fake-recruiters': { title: 'Fake Job and Recruiter Offers', intro: 'How a fake recruiter collects your passport scan, your bank details and an upfront payment — and what a real employer never asks for.' },
};
function escapeHtml(value) { return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function buildCss() {
  process.stdout.write('Building the stylesheet... ');
  const vitePath = path.join(ROOT, 'node_modules/vite/bin/vite.js');
  if (!fs.existsSync(vitePath)) throw new Error('Vite is not installed. Run npm install first.');
  execFileSync(process.execPath, [vitePath, 'build'], { cwd: ROOT, stdio: 'pipe' });
  const assets = path.join(ROOT, 'dist/assets');
  if (!fs.existsSync(assets)) throw new Error('Build assets folder was not created.');
  const files = fs.readdirSync(assets).filter(file => file.endsWith('.css'));
  if (!files.length) throw new Error('No CSS files found in dist/assets.');
  console.log('done.');
  return files.map(file => fs.readFileSync(path.join(assets, file), 'utf8')).join('\n');
}
function sharedHelpers() {
  const source = fs.readFileSync(CONTROLLER, 'utf8');
  const start = source.indexOf('// BEGIN PREMIUM HELPERS');
  const end = source.indexOf('// END PREMIUM HELPERS');
  if (start < 0 || end <= start) throw new Error('The shared lesson helpers are missing from PremiumModule.js. Replace that file first.');
  return source.slice(start, end);
}
function page(slug, lesson, css, siblings) {
  const meta = META[slug] || { title: slug, intro: '' };
  const title = escapeHtml(meta.title);
  const navigation = siblings.map(item => `<a href="./${encodeURIComponent(item)}.html"${item === slug ? ' aria-current="page"' : ''}>${escapeHtml(META[item]?.title || item)}</a>`).join('\n');
  // Embedded JSON cannot terminate the script element even if a lesson contains </script>.
  const payload = JSON.stringify(lesson).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return `<!doctype html>
<html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — Premium Preview</title>
<style>${css}</style>
<style>
body { margin:0; font-family:Arial,sans-serif; background:var(--bg,#080f1d); color:var(--text,#e3eaf5); }
.pv-bar { display:flex; flex-wrap:wrap; align-items:center; gap:8px; padding:10px 16px; background:var(--card-bg,#101c2e); border-bottom:1px solid var(--border,#263752); font:600 13px/1.4 Arial,sans-serif; }
.pv-bar a,.pv-bar button { padding:7px 12px; border:1px solid var(--border,#263752); border-radius:8px; color:var(--heading,#fff); text-decoration:none; background:transparent; font:inherit; }
.pv-bar a[aria-current] { border-color:var(--teal,#28b1a6); }
.pv-bar button { margin-left:auto; cursor:pointer; }
.pv-note { padding:9px 16px; margin:0; background:var(--bg,#080f1d); color:var(--muted,#93a9c8); border-bottom:1px solid var(--border,#263752); font:400 12px/1.5 Arial,sans-serif; }
@media(max-width:640px){.pv-bar{gap:6px;padding:8px}.pv-bar a{font-size:11px}.pv-bar button{margin-left:0}}
</style></head><body>
<div class="pv-bar">${navigation}<button type="button" id="pv-theme">Light / dark</button></div>
<p class="pv-note">Preview revision: Phishing Match 2. Navigation and practice work here. Assessment and the application’s AI widget require the actual Vue app. Edit the source files and rerun npm run preview:premium. Progress is saved locally for this preview. Dashboard and Modules buttons demonstrate leaving; they do not open the authenticated app.</p>
<div class="module-page premium-role-module premium-step-module">
<header class="module-header page-band"><nav class="premium-header-navigation" aria-label="Course navigation"><button type="button" class="premium-location-button" data-leave="Dashboard"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" /></svg>Dashboard</button><button type="button" class="premium-location-button" data-leave="Modules"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3zM12 6v16" /></svg>Modules</button></nav><h1>${title}</h1><p>${escapeHtml(meta.intro)}</p><div class="premium-course-meta"><div class="premium-badge">♛ Premium Course</div><span id="pv-step-count"></span></div></header>
<div class="premium-progress-band"><div class="premium-progress-inner"><div class="premium-progress-label"><strong><span class="premium-progress-book" aria-hidden="true">📖</span>${title} Module Progress</strong><span id="pv-progress-text"></span></div><div class="premium-progress-track" id="pv-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="Learning sections reviewed"><span id="pv-progress-fill"></span></div></div></div>
<div class="premium-learning-layout" id="pv-layout"><aside class="premium-lesson-menu" id="pv-lesson-menu"><div class="premium-menu-heading"><strong>In this module</strong><span class="premium-mini-badge">Premium</span></div><div id="pv-menu-details"><p class="premium-menu-estimate" id="pv-estimate"></p><nav id="pv-menu" aria-label="Lesson sections"><ol id="pv-menu-items"></ol></nav></div><div class="premium-menu-footer"><p id="pv-current-step"></p><div class="premium-progress-track" aria-hidden="true"><span id="pv-menu-progress"></span></div><button type="button" id="pv-toggle" class="premium-menu-toggle" aria-expanded="true" aria-controls="pv-menu-details">‹ Hide menu</button></div></aside><div class="premium-step-main"><h2 id="pv-heading" class="premium-step-eyebrow" tabindex="-1"></h2><div class="premium-module-body premium-step-content" id="pv-content"></div><p id="pv-completion-note" class="premium-completion-note" role="status" hidden>✓ All learning sections reviewed</p><div class="premium-step-navigation" id="pv-nav"></div></div></div><div class="premium-references" id="pv-references"></div>
<section id="pv-preview-exit" class="module-quiz-section" hidden><h2>Local preview: module left</h2><p id="pv-exit-text"></p><button type="button" class="take-quiz-button" id="pv-return">Return to course</button></section>
<button type="button" class="premium-floating-menu-button" id="pv-show-menu" aria-label="Show module menu" aria-expanded="false" hidden>☰ Menu</button><dialog id="pv-dialog" class="premium-dialog" aria-labelledby="premium-dialog-title" aria-describedby="premium-dialog-description"></dialog></div>
<script>
${sharedHelpers()}
const lesson = parsePremiumLesson(${payload});
const steps = lesson.steps;
let current = 0, menuOpen = true, dialogKind = '', focusBeforeDialog = null, destination = '';
const reviewed = new Set(); let answers = {}, tabs = {};
const storageKey = 'se-aware:premium-preview:v2:${escapeHtml(slug)}';
const el = id => document.getElementById(id);
const estimate = ${JSON.stringify(slug)} === 'client-impersonation' ? '10–14 min total (includes interactive scenarios)' : premiumEstimate(steps);
let saved = null, progressSaved = false;
try { saved = premiumReadProgress(localStorage,storageKey,steps); } catch {}
function textEscape(value) { const element = document.createElement('span'); element.textContent = value; return element.innerHTML; }
function save() {
 if(dialogKind === 'resume') return progressSaved;
 try {progressSaved = premiumWriteProgress(localStorage,storageKey,steps,{activeStep:current,reviewed:[...reviewed],answers,tabs});} catch {progressSaved=false;}
 return progressSaved;
}
function applySaved() {
 if(!saved) return;
 current=saved.activeStep;reviewed.clear();saved.reviewed.forEach(i=>reviewed.add(i));answers=saved.answers;tabs=saved.tabs;saved=null;
}
function closeDialog(resume=true) {
 const previousKind=dialogKind;
 if(previousKind==='resume' && resume) applySaved();
 el('pv-dialog').close(); dialogKind='';if(previousKind==='resume')render();save();focusBeforeDialog?.focus({preventScroll:true});
}
function openDialog(kind,term='',definition='') {
 focusBeforeDialog=document.activeElement;dialogKind=kind;
 const actions=kind==='definition' ? '<button type="button" class="premium-dialog-primary" data-dialog-close autofocus>Got it ✓</button>' : kind==='leave' ? '<div class="two-columns"><button type="button" class="premium-dialog-secondary" data-dialog-close autofocus>Stay here</button><button type="button" class="premium-dialog-primary" data-confirm-leave>Leave module</button></div>' : '<button type="button" class="premium-dialog-primary" data-continue autofocus>Continue Progress</button><div class="two-columns"><button type="button" class="premium-dialog-secondary" data-restart>Start Over</button><button type="button" class="premium-dialog-secondary" data-assessment>Take/Retake Assessment</button></div>';
 const heading=kind==='definition' ? term : kind==='leave' ? 'Leave this module?' : 'Welcome back!';
 const eyebrow=kind==='definition' ? 'Quick definition' : kind==='leave' ? 'Learning progress' : 'Pick up where you left off';
 const description=kind==='definition' ? definition : kind==='leave' ? 'You’re on step ' + (current+1) + ' of ' + (steps.length+1) + '. ' + (progressSaved ? 'Your progress is saved in this browser, so you can pick up where you left off when you return.' : 'Progress could not be saved in this browser. Leaving may reset your current lesson progress.') : 'You previously reached Step ' + ((saved?.activeStep || 0)+1) + ' of ' + (steps.length+1) + '. What would you like to do?';
 el('pv-dialog').innerHTML='<div class="premium-dialog-icon ' + (kind==='leave' ? 'is-gold' : '') + '">' + (kind==='definition' ? '?' : kind==='leave' ? '↗' : '↻') + '</div><p class="premium-dialog-eyebrow">'+eyebrow+'</p><h2 id="premium-dialog-title">'+textEscape(heading)+'</h2><p id="premium-dialog-description">'+textEscape(description)+'</p>'+ (kind==='definition' ? '<div class="premium-dialog-divider"></div>' : '') +'<div class="premium-dialog-actions">'+actions+'</div>';
 if(!el('pv-dialog').open) el('pv-dialog').showModal();
}
function render() {
 const total = steps.length + 1, assessment = current === steps.length;
 const percent = steps.length ? Math.round(reviewed.size / steps.length * 100) : 0;
 el('pv-step-count').textContent = estimate;
 el('pv-progress-text').textContent = 'Step ' + (current + 1) + ' of ' + total;
 el('pv-progress').setAttribute('aria-valuenow', percent);
 el('pv-progress-fill').style.width = percent + '%'; el('pv-menu-progress').style.width=percent+'%';
 el('pv-estimate').textContent=estimate+' · '+total+' short steps';
 el('pv-current-step').textContent='Step '+(current+1)+' of '+total;
 el('pv-menu-items').innerHTML = [...steps, {label:'Assessment'}].map((step,index) => '<li><button type="button" data-step="' + index + '" class="' + (current === index ? 'is-current' : '') + '"' + (current === index ? ' aria-current="step"' : '') + '><span class="premium-step-number">' + String(index + 1).padStart(2,'0') + ' ·</span><span>' + textEscape(step.label) + '</span>' + (reviewed.has(index) ? '<span class="premium-step-check" aria-label="Reviewed">✓</span>' : '') + '</button></li>').join('');
 el('pv-heading').textContent = 'Step ' + (current + 1) + ' of ' + total + ' · ' + (assessment ? 'Assessment' : steps[current].label);
 el('pv-content').innerHTML = assessment ? '<section class="module-quiz-section premium-assessment-card"><h2>Course Assessment</h2><p>Test your knowledge with the 10-question assessment for this course.</p><div class="premium-assessment-actions"><button type="button" class="take-quiz-button" disabled title="Assessments are not available in preview mode">Take Assessment</button><button type="button" class="module-home-button" data-leave="Modules">Back to Modules</button></div></section>' : renderPremiumStep(steps[current].html, answers[current] || {}, tabs[current] || {});
 el('pv-completion-note').hidden=!(assessment && reviewed.size===steps.length);
 el('pv-nav').innerHTML = (current > 0 ? '<button type="button" class="premium-previous" data-prev>← ' + textEscape(steps[current - 1].label) + '</button>' : '') + (!assessment ? '<button type="button" class="premium-next" data-next>Next: ' + textEscape(current + 1 === steps.length ? 'Assessment' : steps[current + 1].label) + ' →</button>' : '');
}
function go(index) {
 if (index < 0 || index > steps.length) return;
 current = index; render();save();el('pv-heading').focus({preventScroll:true});
 el('pv-heading').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'start'});
}
el('pv-menu').addEventListener('click', event => { const button = event.target.closest('[data-step]'); if (button) go(Number(button.dataset.step)); });
el('pv-nav').addEventListener('click', event => { if(event.target.closest('[data-next]')) {reviewed.add(current); go(current + 1);} else if(event.target.closest('[data-prev]')) go(current - 1); });
el('pv-content').addEventListener('click', event => {
 const term=event.target.closest('button[data-term]');
 if(term){openDialog('definition',term.dataset.term,term.dataset.definition);return;}
 answers[current] ||= {}; tabs[current] ||= {};
 const button = event.target.closest('button'), question = button?.closest('[data-question]')?.dataset.question;
 const choice = button?.dataset.choice, tab = button?.dataset.tab;
 if (premiumInteraction(event,el('pv-content'),answers[current],tabs[current])) {
   render();save();const buttons = el('pv-content').querySelectorAll('button');
   for (const next of buttons) { if ((choice !== undefined && next.dataset.choice === choice && next.closest('[data-question]')?.dataset.question === question) || (tab && next.dataset.tab === tab)) { next.focus({preventScroll:true}); break; } }
 }
});
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-leave]');if(button){destination=button.dataset.leave;save();openDialog('leave');}
});
el('pv-dialog').addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
el('pv-dialog').addEventListener('click',event=>{
 if(event.target.closest('[data-dialog-close]')||event.target.closest('[data-continue]'))closeDialog();
 if(event.target.closest('[data-restart]')){saved=null;closeDialog(false);reviewed.clear();answers={};tabs={};go(0);}
 if(event.target.closest('[data-assessment]')){closeDialog();go(steps.length);}
 if(event.target.closest('[data-confirm-leave]')){closeDialog();el('pv-layout').hidden=true;el('pv-references').hidden=true;el('pv-preview-exit').hidden=false;el('pv-exit-text').textContent=destination+' opens in the actual Vue app. This local preview demonstrates leaving and returning to the lesson.';el('pv-return').focus();}
});
el('pv-return').addEventListener('click',()=>{el('pv-layout').hidden=false;el('pv-references').hidden=false;el('pv-preview-exit').hidden=true;try{saved=premiumReadProgress(localStorage,storageKey,steps);}catch{} if(saved)openDialog('resume');else go(0);});
function setMenuVisible(visible) {
 menuOpen=visible;
 el('pv-lesson-menu').hidden=!visible;
 el('pv-show-menu').hidden=visible;
 el('pv-layout').classList.toggle('menu-collapsed',!visible);
 if(!visible)el('pv-show-menu').focus({preventScroll:true});
 else el('pv-toggle').focus({preventScroll:true});
}
el('pv-toggle').addEventListener('click',()=>setMenuVisible(false));
el('pv-show-menu').addEventListener('click',()=>setMenuVisible(true));
el('pv-theme').addEventListener('click', () => {document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';});
window.addEventListener('pagehide',save);
el('pv-references').innerHTML = '<div class="premium-references-inner"><h2>References used in this module</h2>' + lesson.references + '</div>';
render();
if(saved && (saved.activeStep>0||saved.reviewed.length||Object.keys(saved.answers).length))openDialog('resume');else save();
</script></body></html>`;
}
function main() {
  try {
    if (!fs.existsSync(LESSONS)) throw new Error('Premium lesson folder not found: ' + LESSONS);
    const slugs = fs.readdirSync(LESSONS).filter(file => file.endsWith('.html')).map(file => file.replace(/\.html$/, ''));
    if (!slugs.length) throw new Error('No Premium lesson HTML files found.');
    const css = buildCss();
    fs.mkdirSync(OUT, { recursive: true });
    for (const slug of slugs) {
      const lesson = fs.readFileSync(path.join(LESSONS, slug + '.html'), 'utf8');
      fs.writeFileSync(path.join(OUT, slug + '.html'), page(slug, lesson, css, slugs), 'utf8');
    }
    console.log('\n' + slugs.length + ' Premium lesson previews created.\n');
    slugs.forEach(slug => console.log(path.join(OUT, slug + '.html')));
    console.log('\nOpen a preview in your browser. Rerun npm run preview:premium after editing.');
    console.log('Local only: never upload dist/premium-preview; it contains paid lesson content.');
  } catch (error) {
    console.error('\nCould not build the Premium preview:', error.message, '\n');
    process.exitCode = 1;
  }
}
if (require.main === module) main();
module.exports = { page, sharedHelpers };
