// middleware/rateLimit.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
//
// Kung wala to, pwedeng subukan-subukan ng iba yung password sa login kasing
// bilis ng network. Bagal ng bcrypt sa pag-verify kada guess, pero hindi
// niya pinipigilan yung paulit-ulit na pagsubok.
//
// Dati, per IP address lang lahat. Problema yun sa school wifi: iisang IP
// ang buong klase. Sa final test, isang user lang ang nag-browse at naubos
// na ang 300 kada 15 minuto; 25 tester na sabay mag-login ay maba-block
// pagdating sa ika-21. Ngayon, binibilang kada TAO kung saan kaya:
//
//   - login, register, reset: kada IP + email (20), at may mas maluwag na
//     kisame kada IP (100) para hindi pa rin masubukan ang maraming account
//     mula sa iisang lugar
//   - OTP: kada pending login (10), at kada IP (50)
//   - lahat ng iba at ang chat: kada account kapag naka-login, kada IP
//     kapag bisita
//
// Tinitingnan talaga ang token (jwt.verify) bago ito gamiting susi. Kung
// hindi, makakagawa ang umaatake ng pekeng token kada request para
// magkaroon ng bagong budget sa bawat isa.

const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/env').jwtSecret;

const WINDOW = 15 * 60 * 1000;
const ip = (req) => ipKeyGenerator(req.ip || '');

function verifiedUserId(token) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload && payload.user_id ? String(payload.user_id) : null;
  } catch {
    return null;
  }
}

function bearer(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

// Naka-login: ang account. Bisita: ang IP.
const personKey = (req) => {
  const userId = verifiedUserId(bearer(req));
  return userId ? `user:${userId}` : `ip:${ip(req)}`;
};

// Login at iba pa: IP + email, para hindi magkahati sa iisang budget ang
// mga magkaklase sa iisang wifi.
const ipEmailKey = (req) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase().slice(0, 254) : '';
  return `${ip(req)}|${email}`;
};

// OTP: kada pending login (galing sa /login), hindi kada IP.
const pendingKey = (req) => {
  const userId = verifiedUserId(req.body?.pendingToken);
  return userId ? `otp:${userId}` : `ip:${ip(req)}`;
};

const common = { windowMs: WINDOW, standardHeaders: true, legacyHeaders: false };

const authLimiter = rateLimit({
  ...common,
  max: 20,
  keyGenerator: ipEmailKey,
  message: { error: 'Too many attempts for this account. Please wait a few minutes and try again.' },
});

// Mas maluwag, pero kada IP: pumipigil sa pagsubok ng maraming account mula
// sa iisang lugar.
const authIpLimiter = rateLimit({
  ...common,
  max: 100,
  keyGenerator: (req) => ip(req),
  message: { error: 'Too many attempts from this network. Please wait a few minutes and try again.' },
});

// Mas mahigpit pa ito sa OTP verify, kasi 6-digit lang naman yung code at
// meron nang sariling attempt counter sa row.
const otpLimiter = rateLimit({
  ...common,
  max: 10,
  keyGenerator: pendingKey,
  message: { error: 'Too many verification attempts. Please request a new code.' },
});

const otpIpLimiter = rateLimit({
  ...common,
  max: 50,
  keyGenerator: (req) => ip(req),
  message: { error: 'Too many verification attempts from this network. Please wait a few minutes.' },
});

// Chat. Bukas sya sa lahat kahit walang account, at bawat tanong ay tawag sa
// AI na may sariling limit, kaya kailangan may sariling hadlang.
const chatLimiter = rateLimit({
  ...common,
  max: 60,
  keyGenerator: personKey,
  message: { error: 'You have sent a lot of messages in a short time. Please wait a few minutes before asking CyberWise again.' },
});

// Yung iba pang endpoints, para walang isang client na mag-flood sa API.
// Mas mataas para sa mga bisitang magkakasama sa iisang IP.
const generalLimiter = rateLimit({
  ...common,
  max: (req) => (verifiedUserId(bearer(req)) ? 600 : 1500),
  keyGenerator: personKey,
  message: { error: 'Too many requests. Please slow down.' },
});

// Pag-checkout: kada account (laging naka-login dito).
const checkoutLimiter = rateLimit({
  ...common,
  max: 20,
  keyGenerator: personKey,
  message: { error: 'Too many checkout attempts. Please wait a few minutes and try again.' },
});

module.exports = { authLimiter, authIpLimiter, otpLimiter, otpIpLimiter, chatLimiter, generalLimiter, checkoutLimiter };
