// middleware/auth.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
const jwt = require('jsonwebtoken');

// Galing sa config/env.js, na ayaw mag-start sa production kung wala o
// mahina yung JWT_SECRET. Kung nakuha to ng iba, pwede na sila mag-forge ng
// token kahit anong account, pati admin.
const JWT_SECRET = require('../config/env').jwtSecret;
const pool = require('../config/db');

// Tinitignan kung valid yung token, ilalagay sa req.user = { user_id, role }
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not logged in.' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);

    /* Yung pendingToken ay HINDI login. Binibigay yan pagkatapos ng password
       pero bago yung one-time code, at pareho lang ng secret ang pirma kaya
       pasado siya dito. Kung tatanggapin natin, pwedeng basahin na lang yung
       pendingToken sa sagot ng /login at ipadala bilang Bearer token —
       malalampasan na yung code, at pampalamuti na lang yung buong OTP. */
    if (payload.otp_pending) {
      return res.status(401).json({ error: 'Finish verifying your login first.' });
    }

    req.user = payload; // { user_id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

/* Pareho ng requireAuth, pero kailangan din role === 'admin' (FR-17/18/19)

   Sa talaan tinitingnan ang role, hindi sa token. Nakasulat sa token yung
   role noong nag-login, at pitong araw bago mag-expire — kaya ang
   UPDATE user SET role='user' (yung dokumentadong pag-demote sa
   sql/02-backend-additions.sql) ay walang bisa hangga't hindi naaabot yun.
   Admin pa rin ang na-demote sa buong linggo na yun.

   Ganito na rin ginagawa ng lahat ng Premium na check (modules.js,
   quizzes.js, assessments.js): isang indexed lookup lang, at ang mga
   admin route ay bihirang tawagin. */
function requireAdmin(req, res, next) {
  requireAuth(req, res, async () => {
    try {
      const [rows] = await pool.query('SELECT role FROM user WHERE user_id = ?', [req.user.user_id]);
      if (!rows.length || rows[0].role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required.' });
      }
      req.user.role = rows[0].role;
      next();
    } catch (err) {
      // Hindi na-verify, kaya hindi pinapayagan. Mas mabuti nang tumanggi
      // kaysa magbigay ng admin access habang may problema ang database.
      console.error('[auth] admin role lookup failed:', err.message);
      return res.status(503).json({ error: 'Could not verify your access just now.' });
    }
  });
}

// Ilalagay yung req.user kung may valid token, pero hindi hinaharang yung
// request kung wala. Gamit sa mga endpoint na iba behavior depende kung
// naka-login o hindi (hal. Free vs Premium module content).
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), JWT_SECRET);
      // Pareho ng patakaran sa requireAuth: hindi pa tapos ang login, hindi
      // pa login. Dito ibig sabihin guest, hindi Premium — kundi mabubuksan
      // ng pendingToken ang bayad na content nang walang code.
      if (!payload.otp_pending) req.user = payload;
    } catch (err) {
      // invalid token pero optional lang naman, treat as guest na lang
    }
  }
  next();
}

module.exports = { requireAuth, requireAdmin, optionalAuth, JWT_SECRET };
