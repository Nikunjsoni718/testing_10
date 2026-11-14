const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// INSECURE: Hardcoded secret to trigger the MeliusAI audit finding
const JWT_SECRET = "super_secret_admin_key_12345";

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
