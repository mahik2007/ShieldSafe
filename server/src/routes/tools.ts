import { Router, Request, Response, NextFunction } from 'express';
import { getDb } from '../database/db';
import { validate } from '../middleware/validation';
import { AnalyzeMessageSchema, ChecklistUpdateSchema } from '../validation/schemas';
import { analyzeMessage, SAMPLE_MESSAGES } from '../services/analyzer';

const router = Router();

// POST /api/analyze — analyze message
router.post(
  '/analyze',
  validate(AnalyzeMessageSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message, context } = req.body;
      const result = analyzeMessage(message, context);
      res.json({ result });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/analyze/samples — get predefined sample messages
router.get('/analyze/samples', (_req: Request, res: Response) => {
  res.json({ samples: SAMPLE_MESSAGES });
});

// GET /api/checklist — get checklist items filtered by safety mode
router.get('/checklist', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mode } = req.query;
    const db = getDb();

    let query = 'SELECT * FROM checklist_items WHERE 1=1';
    const params: any[] = [];

    if (mode && typeof mode === 'string' && mode !== 'all') {
      query += ' AND (safety_mode = ? OR safety_mode = "all")';
      params.push(mode);
    }

    query += ' ORDER BY order_index ASC';

    const rows = db.prepare(query).all(...params);

    const items = rows.map((r: any) => ({
      id: r.id,
      category: r.category,
      title: r.title,
      description: r.description,
      safetyMode: r.safety_mode,
      completed: Boolean(r.completed),
      note: r.note,
      completedAt: r.completed_at,
      orderIndex: r.order_index,
    }));

    res.json({ items });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/checklist/:id — update completion status and note
router.patch(
  '/checklist/:id',
  validate(ChecklistUpdateSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid checklist item ID' });
        return;
      }

      const { completed, note } = req.body;
      const db = getDb();

      const existing = db.prepare('SELECT id FROM checklist_items WHERE id = ?').get(id);
      if (!existing) {
        res.status(404).json({ error: 'Checklist item not found' });
        return;
      }

      const completedAt = completed ? new Date().toISOString() : null;

      db.prepare(`
        UPDATE checklist_items
        SET completed = ?, note = ?, completed_at = ?
        WHERE id = ?
      `).run(completed ? 1 : 0, note || null, completedAt, id);

      const updated = db.prepare('SELECT * FROM checklist_items WHERE id = ?').get(id) as any;

      res.json({
        message: 'Checklist item updated',
        item: {
          id: updated.id,
          category: updated.category,
          title: updated.title,
          description: updated.description,
          safetyMode: updated.safety_mode,
          completed: Boolean(updated.completed),
          note: updated.note,
          completedAt: updated.completed_at,
          orderIndex: updated.order_index,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/checklist/reset — reset all checklist completions
router.post('/checklist/reset', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();
    db.prepare('UPDATE checklist_items SET completed = 0, completed_at = NULL, note = NULL').run();
    res.json({ message: 'Safety checklist reset successfully.' });
  } catch (err) {
    next(err);
  }
});

// GET /api/stats/summary — dashboard stats
router.get('/stats/summary', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();

    const hazardCount = db.prepare('SELECT COUNT(*) as c FROM hazards').get() as any;
    const incidentCount = db.prepare('SELECT COUNT(*) as c FROM incidents').get() as any;
    const activeJourneys = db.prepare("SELECT COUNT(*) as c FROM journeys WHERE status = 'active'").get() as any;
    const completedTasks = db.prepare('SELECT COUNT(*) as c FROM checklist_items WHERE completed = 1').get() as any;
    const totalTasks = db.prepare('SELECT COUNT(*) as c FROM checklist_items').get() as any;

    res.json({
      totalHazards: hazardCount.c,
      totalIncidents: incidentCount.c,
      activeJourneys: activeJourneys.c,
      checklistProgress: {
        completed: completedTasks.c,
        total: totalTasks.c,
        percentage: totalTasks.c > 0 ? Math.round((completedTasks.c / totalTasks.c) * 100) : 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
