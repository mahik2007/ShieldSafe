import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { getDb } from '../database/db';
import { validate } from '../middleware/validation';
import { CreateHazardSchema, ConfirmHazardSchema } from '../validation/schemas';

const router = Router();

// Rate limiting for hazard submissions: 15 per 15 minutes per IP
const hazardSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'Too many hazard reports submitted. Please wait a few minutes before submitting another report.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /api/hazards — list all hazards with optional category filter
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();
    const { category, status } = req.query;

    let query = 'SELECT * FROM hazards WHERE 1=1';
    const params: any[] = [];

    if (category && typeof category === 'string' && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status && typeof status === 'string' && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params);

    const hazards = rows.map((r: any) => ({
      id: r.id,
      category: r.category,
      title: r.title,
      description: r.description,
      latitude: r.latitude,
      longitude: r.longitude,
      status: r.status,
      confirmationCount: r.confirmation_count,
      isDemoData: Boolean(r.is_demo_data),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    res.json({ hazards });
  } catch (err) {
    next(err);
  }
});

// GET /api/hazards/:id — single hazard
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid hazard ID' });
      return;
    }

    const db = getDb();
    const row = db.prepare('SELECT * FROM hazards WHERE id = ?').get(id) as any;
    if (!row) {
      res.status(404).json({ error: 'Hazard not found' });
      return;
    }

    res.json({
      hazard: {
        id: row.id,
        category: row.category,
        title: row.title,
        description: row.description,
        latitude: row.latitude,
        longitude: row.longitude,
        status: row.status,
        confirmationCount: row.confirmation_count,
        isDemoData: Boolean(row.is_demo_data),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/hazards — create a new hazard
router.post(
  '/',
  hazardSubmitLimiter,
  validate(CreateHazardSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, title, description, latitude, longitude } = req.body;
      const db = getDb();

      const stmt = db.prepare(`
        INSERT INTO hazards (category, title, description, latitude, longitude, status, confirmation_count, is_demo_data)
        VALUES (?, ?, ?, ?, ?, 'unverified', 0, 0)
      `);

      const result = stmt.run(category, title, description, latitude, longitude);
      const newHazard = db.prepare('SELECT * FROM hazards WHERE id = ?').get(result.lastInsertRowid) as any;

      res.status(201).json({
        message: 'Hazard report submitted successfully',
        hazard: {
          id: newHazard.id,
          category: newHazard.category,
          title: newHazard.title,
          description: newHazard.description,
          latitude: newHazard.latitude,
          longitude: newHazard.longitude,
          status: newHazard.status,
          confirmationCount: newHazard.confirmation_count,
          isDemoData: Boolean(newHazard.is_demo_data),
          createdAt: newHazard.created_at,
          updatedAt: newHazard.updated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/hazards/:id/confirm — confirm an existing hazard
router.post(
  '/:id/confirm',
  validate(ConfirmHazardSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid hazard ID' });
        return;
      }

      const { sessionId } = req.body;
      const db = getDb();

      // Check hazard exists
      const hazard = db.prepare('SELECT * FROM hazards WHERE id = ?').get(id) as any;
      if (!hazard) {
        res.status(404).json({ error: 'Hazard not found' });
        return;
      }

      // Check if this session already confirmed
      const existing = db
        .prepare('SELECT id FROM hazard_confirmations WHERE hazard_id = ? AND session_id = ?')
        .get(id, sessionId);

      if (existing) {
        res.status(409).json({ error: 'You have already confirmed this hazard report in this session.' });
        return;
      }

      const confirmTx = db.transaction(() => {
        db.prepare('INSERT INTO hazard_confirmations (hazard_id, session_id) VALUES (?, ?)').run(
          id,
          sessionId
        );
        const newCount = hazard.confirmation_count + 1;
        const newStatus = newCount >= 3 ? 'community-confirmed' : hazard.status;
        db.prepare(
          "UPDATE hazards SET confirmation_count = ?, status = ?, updated_at = datetime('now') WHERE id = ?"
        ).run(newCount, newStatus, id);
        return { confirmationCount: newCount, status: newStatus };
      });

      const updated = confirmTx();

      res.json({
        message: 'Hazard confirmed successfully',
        confirmationCount: updated.confirmationCount,
        status: updated.status,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
