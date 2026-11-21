const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
}

async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 12);
}

async function verifyPassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

function issueToken(userId) {
  return jwt.sign({ sub: userId }, getJwtSecret(), {
    expiresIn: '7d',
    algorithm: 'HS256',
  });
}

module.exports = { hashPassword, verifyPassword, issueToken };
