import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { getDb } from '../database/db';

const router = Router();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_shecurity_salt_2026').digest('hex');
}

// Register
router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, safetyMode = 'everyday' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = hashPassword(password);
    const result = db.prepare(
      'INSERT INTO users (name, email, password_hash, safety_mode) VALUES (?, ?, ?, ?)'
    ).run(name.trim(), email.toLowerCase().trim(), passwordHash, safetyMode);

    const user = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      safetyMode,
    };

    const token = crypto.randomBytes(32).toString('hex');

    res.status(201).json({
      message: 'Account created successfully',
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = getDb();
    const user = db.prepare(
      'SELECT id, name, email, password_hash, safety_mode FROM users WHERE email = ?'
    ).get(email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordHash = hashPassword(password);
    if (user.password_hash !== passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = crypto.randomBytes(32).toString('hex');

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        safetyMode: user.safety_mode,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// Update user safety profile mode
router.patch('/profile', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, safetyMode } = req.body;
    if (!email || !safetyMode) {
      return res.status(400).json({ error: 'Email and safetyMode are required.' });
    }

    const db = getDb();
    db.prepare('UPDATE users SET safety_mode = ?, updated_at = datetime("now") WHERE email = ?').run(
      safetyMode,
      email.toLowerCase().trim()
    );

    res.json({ message: 'Profile safety mode updated', safetyMode });
  } catch (err) {
    next(err);
  }
});

export default router;

