// middleware/premium.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
//
// Isang lugar lang kung saan napagpapasyahan kung Premium ang isang tao.
//
// Dati, limang magkakahiwalay na kopya ng parehong tseke: sa modules.js,
// quizzes.js (dalawang beses), assessments.js at chat.js. Gumagana naman,
// pero kapag nadagdagan ng kondisyon ang panuntunan -- gaya ng petsa ng
// pagtatapos ngayon -- kailangang maalala lahat ng lima. Yung isang
// makakalimutan ang magiging butas.
//
// Ngayon, isang sagot lang ang pinagmumulan ng lahat.

const pool = require('../config/db');

/* Tatlong kondisyon, hindi dalawa:

     1. Premium yung type
     2. 'active' yung status
     3. hindi pa lampas sa petsa ng pagtatapos

   Yung pangatlo ang bago. Yung NULL na expiry ay itinuturing na walang
   takda -- ganoon yung mga account bago pa naidagdag ang bayad (mga
   demo at admin-made na account), at ayaw nating biglang mawalan sila
   ng access sa gitna ng UAT. */
const PREMIUM_SQL = `
  SELECT subscription_type, subscription_status, subscription_expires_at
    FROM user
   WHERE user_id = ?`;

function isActivePremium(row) {
  if (!row) return false;
  if (row.subscription_type !== 'Premium') return false;
  if (row.subscription_status !== 'active') return false;
  if (row.subscription_expires_at && new Date(row.subscription_expires_at) <= new Date()) {
    return false;
  }
  return true;
}

// Para sa mga route na may user object na (galing requireAuth o
// optionalAuth). Dumadaan ang admin para matingnan nila yung mga bayad na
// module nang hindi kailangang bumili.
async function hasPremiumAccess(user) {
  if (!user) return false;
  if (user.role === 'admin') return true;

  const [rows] = await pool.query(PREMIUM_SQL, [user.user_id]);
  return isActivePremium(rows[0]);
}

// Gate na bersyon, para sa mga route na puro Premium.
async function requirePremium(req, res, next) {
  try {
    if (await hasPremiumAccess(req.user)) return next();
    return res.status(403).json({ error: 'This feature requires a Premium subscription.' });
  } catch (err) {
    console.error('[premium] check failed:', err.message);
    return res.status(500).json({ error: 'Failed to verify Premium access.' });
  }
}

module.exports = { hasPremiumAccess, requirePremium, isActivePremium };
