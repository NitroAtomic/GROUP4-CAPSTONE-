// middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// Verifies the request has a valid token, attaches req.user = { user_id, role }
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not logged in.' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { user_id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

// Same as requireAuth, but also requires role === 'admin' (FR-17/18/19)
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    next();
  });
}

// Attaches req.user if a valid token is present, but doesn't block the
// request if there isn't one — used for endpoints that behave differently
// for logged-in vs anonymous visitors (e.g. Free vs Premium module content).
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(header.slice(7), JWT_SECRET);
    } catch (err) {
      // invalid token on an optional route: just treat as anonymous
    }
  }
  next();
}

module.exports = { requireAuth, requireAdmin, optionalAuth, JWT_SECRET };
