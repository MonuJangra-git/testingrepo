const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me_in_production';

/**
 * Middleware that verifies the JWT stored in the httpOnly cookie ("token").
 * If valid, attaches the decoded payload to req.user and calls next().
 * If missing or invalid, responds with 401 Unauthorized.
 */
function auth(req, res, next) {
  const token = req.cookies && req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

module.exports = auth;
module.exports.JWT_SECRET = JWT_SECRET;
