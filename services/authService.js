const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// GOOD PATTERN: secret loaded from environment, never hardcoded.
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// MINOR NITPICK (low severity): salt rounds is a magic number inline
// rather than a named, documented constant. Not a real risk, just a
// small readability/maintainability improvement.
async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 12);
}

async function verifyPassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

function issueToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { hashPassword, verifyPassword, issueToken };
