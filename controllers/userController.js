const { z } = require('zod');
const db = require('../services/db');
const authService = require('../services/authService');
const mailer = require('../services/mailer');
const logger = require('../services/logger');

// GOOD PATTERN: parameterized query, no string concatenation.
async function getUserProfile(req, res, next) {
  try {
    const { id } = req.params;
    const query = 'SELECT id, name, email, role FROM users WHERE id = $1 AND active = true';
    const result = await db.raw(query, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// GOOD PATTERN: replaces eval() with a fixed whitelist of filterable
// fields and operators, no arbitrary code execution surface.
const ALLOWED_FIELDS = ['role', 'active', 'department'];

// GOOD PATTERN: awaits the async database call instead of using a
// synchronous method, so this route no longer blocks the event loop.
// GOOD PATTERN: paginates results with a bounded page size instead of
// loading every user into memory before filtering.
const MAX_PAGE_SIZE = 50;

async function searchUsers(req, res, next) {
  try {
    const { field, value } = req.query;
    if (!ALLOWED_FIELDS.includes(field)) {
      return res.status(400).json({ error: 'Invalid filter field' });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.min(parseInt(req.query.pageSize, 10) || 20, MAX_PAGE_SIZE);

    const users = await db.getUsersPageAsync({ field, value, page, pageSize });
    res.json({ page, pageSize, results: users });
  } catch (err) {
    next(err);
  }
}

// GOOD PATTERN: strict schema validation on all registration input.
const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

// GOOD PATTERN: mailer call is properly awaited and wrapped so a
// failed send can't become an unhandled rejection; a failure is
// logged but doesn't block the successful registration response.
async function registerUser(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { name, email, password } = parsed.data;
    const passwordHash = await authService.hashPassword(password);
    const user = await db.insertUser({ name, email, passwordHash });

    try {
      await mailer.sendWelcomeEmail(user.email);
    } catch (mailErr) {
      logger.error('Welcome email failed to send', {
        email: user.email,
        error: mailErr.message,
      });
    }

    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUserProfile, searchUsers, registerUser };
