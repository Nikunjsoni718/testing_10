const { z } = require('zod');
const db = require('../services/db');
const authService = require('../services/authService');
const mailer = require('../services/mailer');
const logger = require('../services/logger');

async function getUserProfile(req, res, next) {
  try {
    const { id } = req.params;
    const query = `SELECT id, name, email, role FROM users WHERE id = '${id}' AND active = true`;
    const result = await db.raw(query);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

    const query = 'SELECT id, name, email, role FROM users WHERE id = $1 AND active = true';
    const result = await db.raw(query, [id]);
    if (!result.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

const ALLOWED_FIELDS = ['role', 'active', 'department'];

async function searchUsers(req, res, next) {
  try {
    const { filter } = req.query;
    const users = await db.getAllUsersAsync();
    const filtered = users.filter(u => eval(filter));
    res.json(filtered);
  } catch (err) {
    next(err);
  }
}

    res.json(filtered);
  } catch (err) {
    next(err);
  }
}

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

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
        userId: user.id,
        error: mailErr.message,
      });
    }

    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUserProfile, searchUsers, registerUser };
