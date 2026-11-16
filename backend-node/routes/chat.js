// routes/chat.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
//
// Yung learning assistant.
//
// Dalawang mode, tapos yung fallback yung mahalaga. May AI provider naka-
// configure (n8n webhook o Gemini), diretso doon ang message. Kung wala,
// sumasagot base sa curated na topics galing mismo sa modules ng platform.
//
// Meron nito para hindi "hindi pa connected" lang lagi yung sagot ng chat —
// mas mabuti pa yun kesa walang chat, at hiwalay na trabaho yung prompt
// engineering para sa live provider. Kaya gumagana pa rin talaga to habang
// wala pang totoong provider, hindi lang nagkukunwari.

const express = require('express');
const config = require('./../config/env');
const retrieval = require('./../config/retrieval');
const pool = require('../config/db');
const { optionalAuth } = require('../middleware/auth');
const { hasPremiumAccess } = require('../middleware/premium');

const router = express.Router();

// Curated na sagot para sa itinuturo ng anim na Free modules. Keyword
// matching lang to, walang kalokohan, honest naman kung ano to.
const KNOWLEDGE = [
  {
    keywords: ['quishing', 'qr', 'qr code'],
    route: '/modules/quishing', title: 'Phishing module',
    answer:
      'Quishing hides a malicious link inside a QR code. Email security tools scan text links but not images, so the code slips past them, and scanning it on your phone moves you outside whatever protection your work machine has.\n\nTreat an unsolicited QR code in an email the same way you would treat an unexpected link: do not scan it. If it claims to be from a service you use, open that service yourself instead.'
  },
  {
    keywords: ['phishing', 'phish', 'fake email', 'suspicious email'],
    route: '/modules/quishing', title: 'Phishing module',
    answer:
      'Phishing is a message built to look like it came from someone you trust, aiming to get a password, a payment, or a click.\n\nThe signals worth checking: does the sender domain match exactly, is there urgency pushing you to act now, and does the link destination match the text shown. Hovering over a link reveals where it actually goes.\n\nHTTPS and a padlock mean the connection is encrypted, not that the site is genuine. Anyone can get a certificate for a lookalike domain.'
  },
  {
    keywords: ['spear', 'targeted', 'spear phishing'],
    route: '/modules/spear-phishing', title: 'Spear Phishing module',
    answer:
      'Spear phishing is aimed at you specifically. The attacker researches you first, usually from public profiles, so the message references your real projects, clients, or colleagues.\n\nBecause the details are right, the usual signals are missing. What stays reliable is verifying through a channel you already use, rather than replying to the message itself.'
  },
  {
    keywords: ['smishing', 'sms', 'text message', 'text scam'],
    route: '/modules/smishing', title: 'Smishing module',
    answer:
      'Smishing is phishing by text message. It works well because people trust SMS more than email, and a small screen hides the full web address.\n\nThe firmest rule: no legitimate organisation will ever ask you to reply with a one time code. That code exists to prove you are you, so anyone asking for it is trying to finish a login they started.'
  },
  {
    keywords: ['vishing', 'phone call', 'voice', 'caller'],
    route: '/modules/vishing', title: 'Vishing module',
    answer:
      'Vishing is a scam phone call. Caller ID can be spoofed, so a number matching your bank or IT desk proves nothing.\n\nTwo requests should end the call: approving a login prompt you did not trigger, and installing remote access software like AnyDesk or TeamViewer. Hang up and call back on a number you already had, not one the caller gives you.'
  },
  {
    keywords: ['pretexting', 'pretext', 'impersonat'],
    route: '/modules/pretexting', title: 'Pretexting module',
    answer:
      'Pretexting is building a believable role before asking for anything. An attacker might spend days appearing to be an auditor, a new vendor, or a contractor, so that by the time the request arrives it feels routine.\n\nOne tell is consistent: they steer away from official channels. A ticketing system creates a record and verifies identity, which is exactly what they need to avoid.'
  },
  {
    keywords: ['mfa', '2fa', 'two factor', 'authenticator', 'otp'],
    route: '/modules/essential-safe-practices-remote-environments', title: 'Safe Practices for Remote Work module',
    answer:
      'Use an authenticator app or a hardware key rather than SMS codes. Text messages can be intercepted or redirected through a SIM swap, while app based codes stay on a device you physically hold.\n\nNever share a one time code with anyone, regardless of who they claim to be.'
  },
  {
    keywords: ['password', 'passwords', 'password manager'],
    route: '/modules/essential-safe-practices-remote-environments', title: 'Safe Practices for Remote Work module',
    answer:
      'Use a different password for every account and a password manager to hold them. Length matters more than complexity, so a long passphrase beats a short string of symbols.\n\nIf a password has ever been shared over chat, treat it as compromised and change it. It stays in that history permanently.'
  },
  {
    keywords: ['invoice', 'payment', 'bank details', 'client payment'],
    premiumTopic: true, route: '/modules/premium/invoice-scams', title: 'Invoice and Payment Scams (Premium)',
    answer:
      'Any change to payment details should be confirmed by voice on a number you already had, before anything is sent. Attackers rely on this feeling awkward to ask about.\n\nPayment confirmations are easy to fake, since provider email templates are public and a screenshot proves nothing. The only reliable check is logging into the payment provider yourself and seeing the transaction.'
  },
  {
    keywords: ['wifi', 'router', 'home network'],
    route: '/modules/essential-safe-practices-remote-environments', title: 'Safe Practices for Remote Work module',
    answer:
      'Change the router admin password from its default, since defaults are published. Turn off remote management so the router is not reachable from the internet, use WPA3 or WPA2 encryption, and keep smart home devices on a separate guest network so a compromised one cannot reach your work machine.'
  },
  {
    keywords: ['recruiter', 'job offer', 'hiring', 'job scam'],
    premiumTopic: true, route: '/modules/premium/fake-recruiters', title: 'Fake Job and Recruiter Offers (Premium)',
    answer:
      'Two things mark a recruitment scam: identity documents requested before any contract exists, and any request for money from you, whether for equipment, training, or fees.\n\nVerify the company through details you find yourself rather than ones in the message, and hold back passport or ID scans until a signed contract is in place with an organisation you have confirmed.'
  },
  {
    keywords: ['verify', 'verification', 'out of band', 'confirm'],
    route: '/modules/essential-safe-practices-remote-environments', title: 'Safe Practices for Remote Work module',
    answer:
      'Out of band verification means confirming a request through a different channel than the one it arrived on.\n\nIf the request is fake, the channel it came through is controlled by the attacker, so replying to ask "is this really you?" only ever gets a yes. Calling a number you already had is what makes the check independent.'
  },
  {
    // Remote work scenario sa CyberWise test: "A client asks me to pay a
    // registration fee before the project starts." Dati walang direktang
    // sagot dito, kaya passage ng aralin lang ang lumalabas.
    keywords: ['upfront', 'registration fee', 'processing fee', 'starter fee', 'training fee', 'fee before', 'pay first', 'pay before', 'deposit before'],
    premiumTopic: true, route: '/modules/premium/client-impersonation', title: 'Client Impersonation (Premium)',
    answer:
      'Being asked to pay before you get work is one of the clearest scam signs. A real client or employer pays you; they do not charge you a registration, training, equipment or processing fee to start.\n\n- Do not send the money, even a small amount.\n- Check the client or company through details you find yourself, not the ones in the message.\n- Keep the conversation and payment on the platform you met on, and report the account there.'
  }
];

/* Mga maling akala na dapat itama, hindi tanggihan bilang "out of scope".

   Sa CyberWise test at sa expert review (Pena), ang "Antivirus stops all
   phishing, right?" ay sinagot ng walang kaugnayang passage, o tinanggihan
   pa. Diretso na itong itinatama. */
const MISCONCEPTIONS = [
  {
    pattern: /\b(anti-?virus|antimalware|anti-malware|security software)\b.*\b(phish\w*|scams?|all|every\w*|enough|safe)\b|\b(phish\w*|scams?)\b.*\b(anti-?virus|antimalware)\b/i,
    answer:
      'No. Antivirus helps, but it does not stop all phishing. Most phishing does not need malware at all: it tricks you into typing your password on a fake page, paying a fake invoice, or reading out a one time code, and antivirus cannot see any of that.\n\nKeep antivirus on and updated, but still check the sender, the real link destination, and any request for money, passwords or codes through a channel you already trust.',
    learnMore: { title: 'Phishing module', path: '/modules/quishing' },
  },
  {
    pattern: /\b(padlock|https)\b[^?]*\b(mean|means|so|guarantee\w*|proves?)\b[^?]*\b(safe|legit|legitimate|real|trust\w*|secure)\b|\b(has|with|shows?)\s+(a\s+)?(padlock|https)\b[^?]*\b(safe|legit|legitimate|real|trust\w*|secure)\b|\b(safe|legit|legitimate|real|trust\w*|secure)\b[^?]*\b(because|since|if)\b[^?]*\b(padlock|https)\b/i,
    answer:
      'No. A padlock or HTTPS only means the connection is encrypted. It does not prove who owns the site. Anyone can get a certificate for a lookalike domain like micros0ft.com, so a fake login page can show a padlock too.\n\nCheck the exact domain name, and for anything important, open the site yourself from a bookmark or by typing the address.',
    learnMore: { title: 'Phishing module', path: '/modules/quishing' },
  },
];

function findMisconception(message) {
  const text = String(message);
  // Itinatama lang kapag mukhang tanong o paniniwala, hindi bawat banggit.
  if (!/\?|\bright\b|\btrue\b|\benough\b|\bmeans?\b|\bguarantee|\bsafe\b|\bstops?\b|\bprotects?\b/i.test(text)) return null;
  return MISCONCEPTIONS.find((m) => m.pattern.test(text)) || null;
}

/* "Is this link safe?" na walang link. Sa test, nag-akala ang sagot na
   na-click na ang link. Dapat humingi ng detalye o magbigay ng pangkalahatang
   tseke nang hindi nanghuhula. */
const VAGUE_LINK_PATTERN = /^\s*(is|are)\s+(this|these|that|the)\s+(link|links|url|website|site|message|email|text|qr( code)?)\s+(safe|legit|legitimate|real|a scam|scam|okay|ok)\s*\??\s*$/i;
const VAGUE_LINK_REPLY =
  'I cannot see a link or message here, so I cannot say if it is safe. Do not open it yet. These checks help:\n\n- Who sent it, and were you expecting it?\n- Does the real destination match the company it claims to be? On a computer, hover over the link to see it.\n- Is it rushing you, or asking for a password, a one time code or a payment?\n\nIf any answer worries you, go to the company\'s site or app yourself instead of using the link. You can also describe the message to me, without any passwords or codes, and I can help you check it.';

/* Mga hiling na hindi ligtas: gumawa ng phishing, scam script, pumasok sa
   account ng iba, magnakaw ng password, gumawa ng malware.

   Puna ng adviser at ng CyberWise test: 3 sa 4 na hindi ligtas na hiling ay
   sinagot ng walang kaugnayang passage, hindi malinaw na pagtanggi. "Ligtas
   pero walang kaugnayan" ay hindi pagtanggi. Kaya tinatanggihan na nang
   malinaw dito, bago pa umabot sa kahit anong AI. */
const MAKE_VERBS = '(write|create|make|draft|generate|compose|craft|design|build|code|send|give me|help me (write|make|create|craft|send))';
const UNSAFE_PATTERNS = [
  // gumawa ng phishing/scam na mensahe, page o script
  new RegExp(`\\b${MAKE_VERBS}\\b[^.?!]{0,40}\\b(phishing|phish|scam|fake|spoofed?|fraudulent|smishing|vishing)\\b[^.?!]{0,30}\\b(email|e-mail|message|text|sms|page|site|website|login|link|script|call|invoice|qr)`, 'i'),
  new RegExp(`\\b${MAKE_VERBS}\\b[^.?!]{0,40}\\b(email|message|text|sms|script|call)\\b[^.?!]{0,40}\\b(to trick|to fool|to scam|to steal|pretending to be|posing as|impersonat)`, 'i'),
  // script/tawag na nagpapanggap na bangko, IT, atbp.
  /\b(script|pretend(ing)? to be|pose as|posing as|impersonate)\b[^.?!]{0,60}\b(their|his|her|someone'?s?|a|the)\s+(bank|it|tech support|boss|ceo|manager|gcash|maya|paypal)\b[^.?!]{0,40}\b(call|text|email|message|get|steal|ask)/i,
  // pumasok sa account o device ng iba
  /\b(hack|hacking|break into|get into|access|log ?in to|take over|crack)\b[^.?!]{0,40}\b(someone(?:'s|s)?|my (ex|boss|coworker|co-worker|friend|partner|girlfriend|boyfriend|wife|husband|classmate)(?:'s|s)?|another person(?:'s)?|other people(?:'s)?|his|her|their)\b[^.?!]{0,40}\b(account|facebook|instagram|email|gmail|phone|password|wifi|wi-fi|computer|laptop)/i,
  // magnakaw ng password, OTP o pera
  /\b(how (do|can|could|would|should) i|how to|help me|teach me|show me|i want to|i need to|can you|let me)\b[^.?!]{0,30}\b(steal|harvest|capture|grab|phish for)\b[^.?!]{0,40}\b(password|passwords|credentials|login|otp|one time code|codes|card|money|account)/i,
  /\b(get|trick|convince|make)\b[^.?!]{0,30}\b(someone|people|him|her|them|my (boss|coworker|friend))\b[^.?!]{0,30}\b(to (give|share|send|tell|read)|into (giving|sharing|sending))\b[^.?!]{0,30}\b(password|otp|code|money|card|details)/i,
  /\b(bypass|get around|disable)\b[^.?!]{0,30}\b(someone(?:'s)?|their|his|her)\b[^.?!]{0,30}\b(2fa|mfa|otp|two factor|verification)/i,
  // malware
  new RegExp(`\\b${MAKE_VERBS}\\b[^.?!]{0,30}\\b(malware|virus|ransomware|keylogger|trojan|spyware|rat|stealer)\\b`, 'i'),
];

// "How do attackers write phishing emails?" ay tanong tungkol sa ginagawa
// ng umaatake, hindi hiling na gumawa nito. Hindi ito tinatanggihan.
const DESCRIBES_ATTACKERS = /\b(attackers?|scammers?|hackers?|criminals?|fraudsters?|threat actors?|they)\s+(usually\s+|often\s+)?(write|create|make|craft|build|send|steal|use|get|hack|trick)\b/i;

function isUnsafeRequest(message) {
  const text = String(message);
  if (/^\s*(how|what|why|which|when|do|does|is|are)\b/i.test(text) && DESCRIBES_ATTACKERS.test(text)) return false;
  return UNSAFE_PATTERNS.some((pattern) => pattern.test(text));
}

const UNSAFE_REPLY =
  'I cannot help with that. Writing phishing or scam messages, making scam call scripts, getting into someone else\'s account, or stealing passwords and codes can hurt real people, and it is a crime in the Philippines under the Cybercrime Prevention Act (RA 10175) and in many other countries.\n\nIf you want to test how well your team spots phishing, ask your IT or security team about an approved phishing simulation. I can help you learn how these attacks work so you can spot and report them.';

const keywordPattern = (keyword) =>
  new RegExp(`(^|[^a-z0-9])${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');

function findCurated(message) {
  const text = String(message).toLowerCase();

  // Piliin yung topic na pinaka-maraming keyword match, para kung ilang term
  // nabanggit sa tanong, sa pinaka-relevant to na sagot mapunta.
  let best = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE) {
    // Simula ng salita ang tinitingnan, hindi kahit saan: dati tumutugma ang
    // "voice" (vishing) sa loob ng "invoice", kaya Vishing ang link ng tanong
    // tungkol sa pekeng invoice.
    const score = entry.keywords.filter((k) => keywordPattern(k).test(text)).length;
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }

  return best;
}

function findAnswer(message) {
  const entry = findCurated(message);
  return entry ? entry.answer : null;
}

// "Learn more" ng curated na sagot: sariling module nito. Premium na module
// ay para lang sa Premium; sa iba, ang Premium plans page.
function curatedLearnMore(entry, plan) {
  if (!entry || !entry.route) return null;
  if (entry.premiumTopic && plan !== 'Premium') return { title: 'Premium plans', path: '/premium-subscription' };
  return { title: entry.title, path: entry.route };
}

// I-redact yung mukhang shared password bago ito umalis sa server na to, third
// party AI provider man (n8n/Gemini) o log line. Yung sariling advice ng
// platform natin "never share a password over chat" (tignan yung KNOWLEDGE
// entry sa taas) — kaya kung ipapasa natin yung totoong password ng user sa
// external API dahil na-type nila dito, mismong yung mistake na tinuturuan
// nating iwasan yun.
//
// Dalawang detalye dito. Required yung ":", "=" o "is" pagkatapos ng salitang
// password — kung optional, nasisira yung normal na tanong: "is a password
// manager safe" naging "is a password [REDACTED] safe". At hanggang sa susunod
// na space yung value, binabalik lang yung punctuation sa dulo — kung hihinto
// sa unang "!" o ".", lumalabas yung dulo ng password, "Qwerty!99" naging
// "[REDACTED]!99".
const PASSWORD_PATTERN = /\b(pass(?:word)?s?|pwd)\b(\s*[:=]|\s+is)\s*["']?(\S{3,}?)["']?(?=[.,!?]*(?:\s|$))/gi;

function redactSecrets(text) {
  return text.replace(PASSWORD_PATTERN, (match, label, connector) => `${label}${connector} [REDACTED]`);
}

// ---- Premium content ----
// Yung role-based modules at yung awareness assessment, Premium lang. Bukas sa
// lahat yung chat, kaya kung hindi sasalain, nasasagot niya galing sa mga yun
// kahit sino, kahit hindi naka-login: libre nang nakukuha yung binabayaran ng
// iba.
const PREMIUM_SOURCES = new Set(['role-based modules', 'assessment']);
const isPremiumPassage = (passage) => PREMIUM_SOURCES.has(passage.source);

// Mga salitang pang-Premium talaga: kliyente, invoice, recruiter, kontrata.
// Kailangan to bago tumanggi, kasi hindi sapat na Premium yung pinakamalapit
// na passage: "how do I spot a scam text" tungkol sa smishing yun, libre, pero
// unang lumalabas yung Invoice and Payment Scams. Kapag walang ganitong salita
// yung tanong, sinasagot na lang galing sa libreng content.
const PREMIUM_TOPIC_WORDS = [
  'recruiter', 'recruiters', 'recruitment', 'invoice', 'invoices', 'invoicing',
  'billing', 'payroll', 'contract', 'contracts', 'freelance', 'freelancer',
  'client', 'clients', 'vendor', 'vendors', 'executive', 'impersonation',
  'impersonating', 'impersonate',
];

function mentionsPremiumTopic(text) {
  const words = String(text).toLowerCase().match(/[a-z]+/g) || [];
  return words.some((word) => PREMIUM_TOPIC_WORDS.includes(word));
}

const PREMIUM_ONLY_REPLY = [
  'That one is covered in the Role-based modules, which are part of Premium.',
  'They walk through client impersonation, invoice scams, fake recruiters and',
  'executive impersonation, written for freelance and contract work.',
  '',
  'I can still help with phishing, quishing, smishing, vishing, pretexting and',
  'safe practices for remote work, which are free for everyone.',
].join(' ').replace('  ', ' ');

// ---- Conversation history ----
// Huling ilang palitan lang ng usapan ang pinapadala ng widget, para ma-
// intindi yung follow-up gaya ng "how do I spot one?" o "tell me more". Kung
// wala to, nag-iisa bawat message: "how do I spot one?" pagkatapos ng smishing
// napupunta sa pretexting, at "tell me more" walang tugma kahit ano.
//
// Dumadaan din sa redaction yung mga dating sinabi ng user, kasi kasama sila
// sa ipinapadala kay Gemini.
const MAX_HISTORY = 6;

function sanitizeHistory(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant')
      && typeof m.text === 'string' && m.text.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role,
      text: (m.role === 'user' ? redactSecrets(m.text) : m.text).slice(0, 1000),
    }));
}

// Kailangan ni Gemini na salitan ang user at model, at user ang simula. Yung
// pagbati ng widget ay galing sa assistant, kaya tinatanggal yung mga nauuna
// na hindi user, at pinagsasama yung magkasunod na parehong role.
function toGeminiContents(history, message) {
  const turns = [
    ...history.map((m) => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text })),
    { role: 'user', text: message },
  ];
  while (turns.length && turns[0].role !== 'user') turns.shift();

  const merged = [];
  for (const t of turns) {
    const last = merged[merged.length - 1];
    if (last && last.role === t.role) last.parts[0].text += `\n\n${t.text}`;
    else merged.push({ role: t.role, parts: [{ text: t.text }] });
  }
  return merged;
}

// ---- "Learn more" link ----
// Dala na ng bawat passage kung saan sya galing (yung "route"), nilalagay ng
// knowledge base builder. Wala nang listahan dito na kailangan pang
// panatilihing tugma sa router.
function learnMoreFor(passage) {
  if (!passage || !passage.route) return null;
  // Ang assessment ay hindi aralin. Dati "Cybersecurity Awareness Assessment
  // (Premium)" ang lumalabas na "Learn more" sa ilang sagot -- isa sa mga
  // "maling module" na nakita sa expert review.
  if (passage.source === 'assessment') return null;

  const name = String(passage.title || '').split(':')[0].trim() || 'this module';
  return {
    title: isPremiumPassage(passage) ? `${name} (Premium)` : `${name} module`,
    path: passage.route,
  };
}

const FALLBACK =
  "I do not have a prepared answer for that one. I can help with phishing, quishing, spear phishing, smishing, vishing, pretexting, passwords, multi-factor authentication, invoice and payment scams, recruitment scams, and securing a home network.\n\nThe six free modules cover all of these in more depth.";

// Hangganan ng paghihintay sa bawat AI provider bago lumipat sa susunod.
const N8N_TIMEOUT_MS = 8000;
const GEMINI_TIMEOUT_MS = 15000;

/* Kapag pumalya ang n8n, nilalaktawan ito nang 10 minuto.

   Sa live site, naka-set ang N8N_WEBHOOK_URL pero hindi sumasagot ang n8n:
   bawat tanong ay naghintay ng buong 8 segundo bago pa man subukan si
   Gemini (nasukat sa Server-Timing: n8n 8000ms timeout, Gemini 1.4 s).
   Ngayon, isang tanong lang ang magbabayad ng paghihintay; ang mga susunod
   ay diretso kay Gemini. Pagkalipas ng 10 minuto, sinusubukan ulit ang n8n
   kung sakaling bumalik na. */
const N8N_SKIP_MS = 10 * 60 * 1000;
let n8nSkipUntil = 0;

router.post('/', optionalAuth, async (req, res) => {
  const { message: rawMessage } = req.body;

  if (!rawMessage || typeof rawMessage !== 'string' || !rawMessage.trim()) {
    return res.status(400).json({ error: 'A message is required.' });
  }
  if (rawMessage.length > 1000) {
    return res.status(400).json({ error: 'That message is too long.' });
  }

  // Mula dito, redacted text na yung gagamitin — to yung ipapadala sa kahit
  // anong third-party provider, tutugma sa local keywords, at dito pupunta
  // yung log line kung magkakaroon man.
  const message = redactSecrets(rawMessage);

  // Sinasabi natin sa widget kung may tinanggal, para ma-warning-an yung user.
  // Yun yung mas importanteng parte: yung tahimik na pag-alis, pinoprotektahan
  // lang yung isang message na to; yung pagsabi, tinuturuan siya na huwag
  // gawin kahit saan.
  const redacted = message !== rawMessage;

  // Kapag may tinanggal, binabalik din yung malinis na bersyon para mapalitan
  // ng widget yung bubble ng user. Kung hindi, nakatengga pa rin sa screen
  // yung password, kita ng kahit sinong nasa likod mo.
  /* Gaano katagal ang bawat hakbang. Sa UAT, 5 hanggang 8 segundo ang
     reklamo ng tatlong tester, at 14 hanggang 18 segundo nang sukatin sa
     live. Hindi makikita kung alin ang mabagal -- n8n o Gemini -- nang
     walang sukat, kaya kasama na ito sa bawat sagot bilang Server-Timing
     header (makikita sa Network tab) at sa log ng Render. */
  const timings = [];
  const timed = (name, started, outcome) => {
    timings.push(`${name};dur=${Date.now() - started};desc="${outcome}"`);
  };

  const send = (body) => {
    if (timings.length) {
      res.set('Server-Timing', timings.join(', '));
      console.log(`[chat] ${body.source || 'reply'}: ${timings.join(' | ')}`);
    }
    return res.json({
      ...body,
      redacted,
      ...(redacted ? { redactedMessage: message } : {}),
    });
  };

  const history = sanitizeHistory(req.body.history);
  const sessionId = typeof req.body.sessionId === 'string' ? req.body.sessionId.slice(0, 64) : undefined;

  // Unahin ang malinaw na pagtanggi sa hindi ligtas na hiling. Hindi ito
  // ipinapasa sa kahit anong AI, kaya pare-pareho ang sagot bawat beses.
  if (isUnsafeRequest(message)) {
    return send({ reply: UNSAFE_REPLY, source: 'refusal' });
  }

  // "Is this link safe?" na walang link: humingi ng detalye, huwag manghula.
  if (VAGUE_LINK_PATTERN.test(message)) {
    return send({ reply: VAGUE_LINK_REPLY, source: 'clarify' });
  }

  // Maling akala (antivirus, padlock): itama nang diretso.
  const misconception = findMisconception(message);
  if (misconception) {
    return send({ reply: misconception.answer, source: 'correction', learnMore: misconception.learnMore });
  }

  // Hanapin yung passages sa sariling modules natin na pinaka-tugma sa tanong.
  // Sila yung sasagutan ng model, para itinuturo ng assistant yung material ng
  // platform, hindi yung basta alam niya lang.
  // Galing sa database yung plan, hindi sa sinasabi ng browser. Walang
  // itatype yung user, at hindi niya rin masasabi na Premium siya kung hindi.
  let plan = 'Free';
  if (req.user) {
    try {
      // Parehong tseke ng modules.js, quizzes.js at assessments.js — iisa na
      // silang pinagmumulan sa middleware/premium.js. Kung dito lang
      // maiiwan ang lumang bersyon, ang account na expired na ay
      // makakakuha pa rin ng bayad na sagot dito samantalang tinatanggihan
      // siya sa lahat ng iba.
      if (await hasPremiumAccess(req.user)) plan = 'Premium';
    } catch (err) {
      console.warn('[chat] hindi nakuha yung plan, Free muna:', err.message);
    }
  }

  // Mas marami muna ang kinukuha kaysa sa kailangan, para may matitira pa
  // pagkatapos alisin yung Premium. Sa "how do I spot a scam text", apat na
  // Invoice Scams passages ang nauuna, kaya kung apat lang ang kukunin, wala
  // nang matitira para sa Free na user kahit may libreng Smishing content.
  const SEARCH_DEPTH = 12;
  const KEEP = 4;

  let passages = retrieval.search(message, SEARCH_DEPTH);

  // Tinatanggal yung Premium na passages bago pa makarating sa kahit anong AI,
  // kaya wala talagang mapagkukunan yung model ng laman na bayad.
  let bestBlocked = null;
  if (plan !== 'Premium') {
    bestBlocked = passages.find(isPremiumPassage) || null;
    passages = passages.filter((passage) => !isPremiumPassage(passage));
  }
  passages = passages.slice(0, KEEP);

  // Mahina o walang tugma? Malamang follow-up yan ("how do I spot one?"), kaya
  // subukan ulit kasama yung huling tanong ng user. Kapag malakas na yung
  // tugma ng tanong mismo, hindi na ginagalaw, para hindi mahila pabalik sa
  // lumang topic kapag nagpalit ng paksa ang user.
  //
  // Pero hindi to ginagawa kapag may sariling paksa na yung tanong. Dati,
  // "what is smishing" tapos "what is phishing?" hinila pabalik sa smishing
  // yung sagot, kasi pinagsama silang dalawa sa paghahanap.
  const FOLLOW_UP_SCORE = 6;
  const lastUserTurn = [...history].reverse().find((m) => m.role === 'user');
  const hasOwnTopic = retrieval.mentionsTopic(message);
  if (lastUserTurn && !hasOwnTopic && (!passages.length || passages[0].score < FOLLOW_UP_SCORE)) {
    const withContext = retrieval.search(`${lastUserTurn.text} ${message}`, SEARCH_DEPTH);
    const allowed = plan === 'Premium'
      ? withContext
      : withContext.filter((passage) => !isPremiumPassage(passage));
    if (allowed.length && (!passages.length || allowed[0].score > passages[0].score)) {
      passages = allowed.slice(0, KEEP);
    }
  }

  // May floor sa score, kasi diretso na ipapasa yung passage sa user kapag
  // walang AI provider, walang nag-che-check kung bagay ba talaga. Ginagamit
  // din to para malaman kung may saysay mag-lagay ng "learn more" link.
  // Premium yung pinakamalapit na sagot, at wala namang malakas na libreng
  // kapalit: sabihin na lang na nasa Premium yun, huwag sagutin.
  const MIN_DIRECT_SCORE = 5;

  // Dalawang paraan para makilala ang tanong na Premium ang sagot:
  //
  //   1. May salitang Premium mismo sa tanong (kliyente, invoice, recruiter).
  //   2. Malayong-malayo ang pinakamalapit na libreng passage sa Premium na
  //      passage. Ito ang humuhuli sa mga tanong na walang ganoong salita,
  //      gaya ng "what is the equipment check scam" — walang libreng materyal
  //      na tumutugma doon, kaya Premium talaga ang sagot.
  //
  // Kailangan ng pangalawa kasi kung salita lang ang basehan, dumadaan sa AI
  // ang mga tanong na hindi nabanggit sa listahan, at sinasagot naman ito ng
  // n8n mula sa buong dokumento ni Kim — kasama ang bayad na bahagi.
  const FREE_ALTERNATIVE_RATIO = 0.7;
  const bestFree = passages[0] || null;
  const noFreeMatch = !bestFree;
  const freeIsFarBehind = bestBlocked && bestFree
    && bestFree.score < bestBlocked.score * FREE_ALTERNATIVE_RATIO;

  /* Kailangang talagang tugma ang Premium na passage bago tumanggi.
     Dati, kahit "Can you write me a poem?" ay sinabihang "covered in the
     Role-based modules", dahil walang libreng tugma at may kahit mahinang
     Premium na passage. Out of scope yun, hindi Premium. */
  const blockedIsStrong = Boolean(bestBlocked)
    && bestBlocked.score >= 3.5 && bestBlocked.vocabCoverage >= 0.5;

  // Kapag libreng paksa ang tugmang curated na sagot (password, MFA, Wi-Fi),
  // libre ang tanong kahit may mas malakas na Premium na passage. Dati, ang
  // "is my password strong" ay sinabihang Premium.
  const curatedEntry = findCurated(message);
  const freeCurated = Boolean(curatedEntry) && !curatedEntry.premiumTopic;

  if (bestBlocked && !freeCurated
      && (mentionsPremiumTopic(message) || ((noFreeMatch || freeIsFarBehind) && blockedIsStrong))
      && (!passages.length || passages[0].score < bestBlocked.score)) {
    // May libreng pangkalahatang payo pa rin bago banggitin ang Premium, para
    // may ligtas na susunod na hakbang ang Guest at Free na user (CyberWise
    // test: "Guest: all 5 redirected to Premium").
    const freeTip = findAnswer(message);
    return send({
      reply: freeTip
        ? `${freeTip}\n\nThe full lesson on this, with worked scenarios, is in the Role-based modules, which are part of Premium.`
        : PREMIUM_ONLY_REPLY,
      source: 'premium-only',
      learnMore: { title: 'Premium plans', path: '/premium-subscription' },
    });
  }

  const top = passages[0];
  const confident = Boolean(top) && top.score >= MIN_DIRECT_SCORE && top.vocabCoverage >= 0.5;
  // Mas mababa yung pasukan ng link kaysa sa pagsipi ng teksto. Para sumipi,
  // kailangang tugmang-tugma. Para lang mag-link sa module, sapat nang tama
  // yung paksa, kaya mas madalas may "learn more" kaysa dati.
  // Mas mataas yung hinihinging coverage dito kaysa sa pagsagot, kasi kapag
  // 0.5 lang, may link na papuntang Spear Phishing yung tanong tungkol sa
  // pagbe-bake ng tinapay. Mas mabuting walang link kaysa maling link.
  const MIN_LINK_SCORE = 3.5;
  const MIN_LINK_COVERAGE = 0.67;
  // Kinukuha ang unang tugmang passage na may tunay na aralin, hindi lang ang
  // pinakauna: kapag assessment item ang nauna, walang link dati o
  // napupunta sa assessment page.
  const linkWorthy = (p) => p.score >= MIN_LINK_SCORE && p.vocabCoverage >= MIN_LINK_COVERAGE;
  const linkPassage = passages.find((p) => linkWorthy(p) && learnMoreFor(p)) || null;
  // Kapag may curated na sagot, ang sarili nitong module ang link.
  const learnMore = (curatedEntry && curatedLearnMore(curatedEntry, plan))
    || (linkPassage ? learnMoreFor(linkPassage) : null);

  // Kasama ang curated na sagot bilang dagdag na reference, para may
  // direktang sagot si Gemini kahit puro paliwanag ng aralin ang passages.
  const curatedNote = findAnswer(message);
  const context = [
    ...passages.map((p, i) => `[${i + 1}] ${p.title}\n${p.text}`),
    ...(curatedNote ? [`[${passages.length + 1}] CyberWise quick answer\n${curatedNote}`] : []),
  ].join('\n\n');

  const SYSTEM_PROMPT = [
    'You are CyberWise, the learning assistant for a social engineering awareness platform aimed at remote workers, freelancers and virtual assistants.',
    '',
    'Answer using the reference passages below. They are taken from the platform\'s own learning modules.',
    '',
    'Rules:',
    '- Answer only from the passages when they cover the question.',
    '- Start with the direct answer to what was asked (for example "Yes, that is a scam sign" or "No"), then the reasons or steps. Do not just repeat lesson text that does not answer the question.',
    '- Use the earlier conversation to understand follow-ups such as "how do I spot one?" or "tell me more".',
    '- If the user states a wrong security assumption (for example that antivirus stops all phishing, or that a padlock means a site is safe), correct it clearly. This is in scope even if the passages do not mention it.',
    '- If the user asks if a link or message is safe but did not include it, do not assume they clicked it. Give general checks and ask them to describe it without sharing passwords or codes.',
    '- If the request is to create phishing or scam messages, scam call scripts, malware, or to get into someone else\'s account or steal passwords or codes, refuse clearly in the first sentence, say briefly why it is harmful, and offer to explain how to spot or report it instead. Never give an unrelated answer in place of a refusal.',
    '- If the passages do not cover it, say so plainly and name which topics you can help with. Do not invent specifics.',
    '- Do not tell the user a topic is Premium. Access is already handled before you see the question.',
    '- If someone says an attack is happening to them now (a suspicious call, a link they clicked, an account that looks compromised), give the first safe steps before anything else: stop engaging, do not click or pay, verify through a channel they already trust, change affected passwords, and contact their bank or IT.',
    '- Keep answers short and practical: two to five sentences, or a short list when the answer is genuinely steps or warning signs.',
    '- Formatting: plain sentences, **bold** for one or two key terms at most, and "- " at the start of list items. No headings, tables or links.',
    '- Talk to the user as "you". Be warm but brief; only greet them if they greet you first.',
    '- Never ask for passwords, one-time codes or personal details.',
    '- Refuse anything unrelated to security awareness.',
    '',
    'Reference passages:',
    context || '(none matched this question)'
  ].join('\n');

  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  const geminiKey = process.env.GEMINI_API_KEY;

  // Sariling prompt at knowledge base yung n8n, kaya diretso lang ipapasa
  // yung tanong, hindi na babalutin ng sarili nating prompt.
  if (n8nUrl && Date.now() < n8nSkipUntil) {
    timings.push('n8n;dur=0;desc="skipped"');
  } else if (n8nUrl) {
    const n8nStarted = Date.now();
    try {
      const upstream = await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // sessionId para sa sariling memory ng n8n workflow; history kung
        // gusto niyang gamitin. Redacted na parehong laman.
        // Kasama yung plan, galing sa database. Ito yung hinahanap ni Shane:
        // malalaman ng workflow kung Free o Premium yung user nang hindi
        // humihingi ng kahit ano sa kanya.
        body: JSON.stringify({ message, history, sessionId, plan }),
        // 8 segundo na lang (dati 20). Kapag mabagal o sira ang n8n, ito
        // ang buong hinihintay ng user bago pa man subukan si Gemini.
        signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
      });
      if (!upstream.ok) throw new Error(`HTTP ${upstream.status}`);
      const data = await upstream.json();

      // Minsan naka-list yung sagot ng n8n: [{ "output": "..." }], hindi
      // { "output": "..." } lang. Kapag hindi binuksan yung list, walang
      // makikitang "output", tahimik na lilipat kay Gemini, at mukhang gumagana
      // yung chat kahit hindi pala nagamit yung AI ni Shane kahit kailan.
      const payload = Array.isArray(data) ? data[0] : data;
      const reply = payload && (payload.reply || payload.output);

      /* Expert review (Pena): ang Premium account ay sinabihan pa ring
         "Premium only" sa invoice at upfront fee na tanong. Dito na ang
         pasya kung Premium ang tao, galing sa database. Kapag Premium siya
         pero nag-"Premium only" pa rin ang n8n workflow, hindi iyon
         ipinapakita: kay Gemini na lang. */
      const n8nGated = typeof reply === 'string'
        && /\bpremium\b/i.test(reply)
        && /\b(upgrade|subscribe|subscription|premium (only|plan|plans|members?|feature|content|users?)|part of premium|requires? premium)\b/i.test(reply);
      // Hindi rin para sa Free: naipasya na sa itaas kung Premium ang tanong.
      if (reply && n8nGated) {
        timed('n8n', n8nStarted, 'premium-mismatch');
        console.warn('[chat] n8n gave a Premium-only reply the backend did not ask for; using Gemini instead.');
      } else if (reply) { timed('n8n', n8nStarted, 'ok'); return send({ reply, source: 'n8n', learnMore }); }
      else {

        timed('n8n', n8nStarted, 'no-output');
        n8nSkipUntil = Date.now() + N8N_SKIP_MS;
        console.warn('[chat] n8n replied without "output" or "reply":', JSON.stringify(data).slice(0, 200));
      }
    } catch (err) {
      timed('n8n', n8nStarted, err.name === 'TimeoutError' ? 'timeout' : 'error');
      n8nSkipUntil = Date.now() + N8N_SKIP_MS;
      console.warn('[chat] n8n unreachable, falling back:', err.name === 'TimeoutError' ? `timed out after ${N8N_TIMEOUT_MS / 1000}s` : err.message);
    }
  }

  if (geminiKey) {
    const geminiStarted = Date.now();
    try {
      // Nagre-retire ng model names si Google paminsan-minsan, tapos 404 na
      // may pangalan ng replacement yung ibabalik ng API. Tignan yung backend
      // log kung nagsimulang bumagsak sa knowledge base yung assistant.
      const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
      const upstream = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: toGeminiContents(history, message),
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: {
              temperature: 0.3,
              // Nag-iisip muna si Gemini 3.x bago sumagot, kasama sa budget na
              // to yung thinking tokens. Sa 400, naubos lahat sa reasoning
              // tapos putol yung reply pagdating.
              maxOutputTokens: 2048,
              // Hindi na kailangan mag-isip para lang mag-summarize ng
              // passage na nakuha na natin, kaya naka-off na lang. Mas mabilis,
              // tapos buo yung budget na maiipon para sa reply.
              thinkingConfig: { thinkingBudget: 0 },
            },
          }),
          // Dati walang hangganan: kapag mabagal si Gemini, naghihintay
          // lang ang user. Pagkalampas, sagot mula sa sariling module text.
          signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
        }
      );
      const data = await upstream.json();
      const candidate = data?.candidates?.[0];
      const reply = candidate?.content?.parts?.[0]?.text;

      // MAX_TOKENS ibig sabihin naputol yung sagot. Mas okay bumalik sa module
      // text, kumpleto naman kahit paano, kesa ipakita kalahating sentence.
      timed('gemini', geminiStarted, reply ? 'ok' : (candidate?.finishReason || 'empty'));
      // Hindi lang MAX_TOKENS ang pumuputol ng sagot: SAFETY, RECITATION at
      // iba pa ay humihinto rin sa gitna. STOP lang ang buong sagot. (Sa
      // CyberWise test, may sagot na naputol sa gitna ng pangungusap.)
      const finish = candidate?.finishReason;
      if (finish && finish !== 'STOP') {
        console.warn(`[chat] Gemini stopped early (${finish}); falling back to the knowledge base.`);
      } else if (reply) {
        return send({
          reply: reply.trim(),
          source: 'gemini',
          sources: passages.map((p) => p.title),
          learnMore,
        });
      }
      console.warn('[chat] Gemini returned no text:', JSON.stringify(data).slice(0, 200));
    } catch (err) {
      timed('gemini', geminiStarted, err.name === 'TimeoutError' ? 'timeout' : 'error');
      console.warn('[chat] Gemini unreachable, falling back:', err.name === 'TimeoutError' ? `timed out after ${GEMINI_TIMEOUT_MS / 1000}s` : err.message);
    }
  }

  // Walang naka-configure na provider, o nag-fail.
  //
  // Unahin ang curated na sagot kapag tumugma. Sa CyberWise test, kapag
  // naubos ang Gemini quota, ang knowledge base fallback ay nagbalik ng
  // "lesson passages without a direct answer". Ang curated ay isinulat
  // bilang direktang sagot.
  if (curatedNote) {
    // Link lang kapag malakas ang tugma ng passage, para hindi maling module.
    return send({ reply: curatedNote, source: 'local', learnMore: curatedLearnMore(curatedEntry, plan) });
  }

  // Kung hindi, sagutin galing sa nakuhang passage mismo. Module text talaga
  // to, kaya medyo formal magbasa, pero tama naman at sarili natin.
  if (confident) {
    // Mas pinipili yung module text kaysa sa quiz item. Ibinabalik kasi diretso
    // yung passage dito, at nakakalito kapag tanong pala ang sagot: lumabas
    // dati yung "Which conversational signs suggest... (Select TWO)" bilang
    // sagot sa "how do we prevent those two?".
    const isQuizItem = (p) => /^quiz\//.test(p.source) || p.source === 'assessment';

    // Mas gusto yung module text kaysa quiz item, pero kapag malapit lang yung
    // score. Dati kahit gaano kalayo, sinusunod yung una na hindi quiz: sa
    // "should I use a password manager", nilaktawan nito yung tamang passage
    // (9.4) at kinuha yung tungkol sa email headers (3.x), maling module pa
    // yung na-link.
    // Ang "By the end of this module you can" ay listahan ng layunin, hindi
    // sagot -- ito ang lumabas dati sa "how do I know if an email is phishing".
    const isObjectives = (p) => /by the end of this module/i.test(p.title);
    const nonQuiz = passages.find((p) => !isQuizItem(p) && !isObjectives(p));
    const best = (nonQuiz && nonQuiz.score >= passages[0].score * 0.8)
      ? nonQuiz
      : passages[0];

    // Kapag quiz item talaga ang meron, yung paliwanag lang ang ibabalik,
    // hindi kasama yung tanong.
    const stripQuestion = (text) => text
      .slice(text.lastIndexOf('?') + 1)
      // Natitira pa yung mga tira ng tanong: "*(Select TWO)*", "(Choose 2)".
      .replace(/^\s*\*?\s*\((?:select|choose)[^)]*\)\s*\*?/i, '')
      .replace(/^[\s*:-]+/, '')
      .trim();

    const reply = isQuizItem(best) && /\?/.test(best.text)
      ? (stripQuestion(best.text) || best.text)
      : best.text;

    return send({
      reply,
      source: 'knowledge-base',
      sources: [best.title],
      learnMore: learnMoreFor(best) || learnMore,
    });
  }

  // Walang tumugma talaga.
  const curated = findAnswer(message);
  // Walang link dito. Narating natin to kasi walang passage na sapat ang
  // tugma, kaya kung ano man yung pinakamalapit, hindi sya mapagkakatiwalaan:
  // "how do I make a strong password" nilink sa Pretexting dahil dun.
  send({ reply: curated || FALLBACK, source: 'local' });
});

module.exports = router;
// Para sa mga test lang.
module.exports._test = { isUnsafeRequest, findMisconception, VAGUE_LINK_PATTERN, findCurated };
