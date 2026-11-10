import { Router, Request, Response, NextFunction } from 'express';
import { getDb } from '../database/db';
import { validate } from '../middleware/validation';
import {
  CreateIncidentSchema,
  UpdateIncidentSchema,
  CreateIncidentNoteSchema,
} from '../validation/schemas';

const router = Router();

// GET /api/incidents — list incidents with filtering and search
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();
    const { category, status, search } = req.query;

    let query = 'SELECT * FROM incidents WHERE 1=1';
    const params: any[] = [];

    if (category && typeof category === 'string' && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status && typeof status === 'string' && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params);

    const incidents = rows.map((r: any) => {
      let evidenceExcerpts: string[] = [];
      try {
        evidenceExcerpts = JSON.parse(r.evidence_excerpts || '[]');
      } catch {
        evidenceExcerpts = [];
      }

      const notes = db
        .prepare('SELECT * FROM incident_notes WHERE incident_id = ? ORDER BY created_at ASC')
        .all(r.id)
        .map((n: any) => ({
          id: n.id,
          incidentId: n.incident_id,
          content: n.content,
          createdAt: n.created_at,
        }));

      return {
        id: r.id,
        title: r.title,
        category: r.category,
        description: r.description,
        incidentDate: r.incident_date,
        sourceLabel: r.source_label,
        status: r.status,
        evidenceExcerpts,
        notes,
        isDemoData: Boolean(r.is_demo_data),
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    });

    res.json({ incidents });
  } catch (err) {
    next(err);
  }
});

// GET /api/incidents/:id — single incident detail
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid incident ID' });
      return;
    }

    const db = getDb();
    const row = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id) as any;
    if (!row) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    let evidenceExcerpts: string[] = [];
    try {
      evidenceExcerpts = JSON.parse(row.evidence_excerpts || '[]');
    } catch {
      evidenceExcerpts = [];
    }

    const notes = db
      .prepare('SELECT * FROM incident_notes WHERE incident_id = ? ORDER BY created_at ASC')
      .all(row.id)
      .map((n: any) => ({
        id: n.id,
        incidentId: n.incident_id,
        content: n.content,
        createdAt: n.created_at,
      }));

    res.json({
      incident: {
        id: row.id,
        title: row.title,
        category: row.category,
        description: row.description,
        incidentDate: row.incident_date,
        sourceLabel: row.source_label,
        status: row.status,
        evidenceExcerpts,
        notes,
        isDemoData: Boolean(row.is_demo_data),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/incidents — create new incident
router.post(
  '/',
  validate(CreateIncidentSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, category, description, incidentDate, sourceLabel, status, evidenceExcerpts } =
        req.body;
      const db = getDb();

      const stmt = db.prepare(`
        INSERT INTO incidents (title, category, description, incident_date, source_label, status, evidence_excerpts, is_demo_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
      `);

      const result = stmt.run(
        title,
        category,
        description,
        incidentDate || null,
        sourceLabel || null,
        status || 'open',
        JSON.stringify(evidenceExcerpts || [])
      );

      const created = db.prepare('SELECT * FROM incidents WHERE id = ?').get(result.lastInsertRowid) as any;

      res.status(201).json({
        message: 'Incident recorded successfully',
        incident: {
          id: created.id,
          title: created.title,
          category: created.category,
          description: created.description,
          incidentDate: created.incident_date,
          sourceLabel: created.source_label,
          status: created.status,
          evidenceExcerpts: JSON.parse(created.evidence_excerpts || '[]'),
          notes: [],
          isDemoData: false,
          createdAt: created.created_at,
          updatedAt: created.updated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/incidents/:id — update incident
router.put(
  '/:id',
  validate(UpdateIncidentSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid incident ID' });
        return;
      }

      const db = getDb();
      const existing = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id) as any;
      if (!existing) {
        res.status(404).json({ error: 'Incident not found' });
        return;
      }

      const updates = req.body;
      const title = updates.title ?? existing.title;
      const category = updates.category ?? existing.category;
      const description = updates.description ?? existing.description;
      const incidentDate = updates.incidentDate !== undefined ? updates.incidentDate : existing.incident_date;
      const sourceLabel = updates.sourceLabel !== undefined ? updates.sourceLabel : existing.source_label;
      const status = updates.status ?? existing.status;
      const evidenceExcerpts = updates.evidenceExcerpts
        ? JSON.stringify(updates.evidenceExcerpts)
        : existing.evidence_excerpts;

      db.prepare(`
        UPDATE incidents
        SET title = ?, category = ?, description = ?, incident_date = ?, source_label = ?, status = ?, evidence_excerpts = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(title, category, description, incidentDate, sourceLabel, status, evidenceExcerpts, id);

      const updated = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id) as any;
      const notes = db
        .prepare('SELECT * FROM incident_notes WHERE incident_id = ? ORDER BY created_at ASC')
        .all(id)
        .map((n: any) => ({
          id: n.id,
          incidentId: n.incident_id,
          content: n.content,
          createdAt: n.created_at,
        }));

      res.json({
        message: 'Incident updated successfully',
        incident: {
          id: updated.id,
          title: updated.title,
          category: updated.category,
          description: updated.description,
          incidentDate: updated.incident_date,
          sourceLabel: updated.source_label,
          status: updated.status,
          evidenceExcerpts: JSON.parse(updated.evidence_excerpts || '[]'),
          notes,
          isDemoData: Boolean(updated.is_demo_data),
          createdAt: updated.created_at,
          updatedAt: updated.updated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/incidents/:id — delete incident
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid incident ID' });
      return;
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM incidents WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    db.prepare('DELETE FROM incidents WHERE id = ?').run(id);

    res.json({ message: 'Incident deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/incidents/:id/notes — add note to incident
router.post(
  '/:id/notes',
  validate(CreateIncidentNoteSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid incident ID' });
        return;
      }

      const { content } = req.body;
      const db = getDb();

      const existing = db.prepare('SELECT id FROM incidents WHERE id = ?').get(id);
      if (!existing) {
        res.status(404).json({ error: 'Incident not found' });
        return;
      }

      const stmt = db.prepare('INSERT INTO incident_notes (incident_id, content) VALUES (?, ?)');
      const result = stmt.run(id, content);

      // touch updated_at
      db.prepare("UPDATE incidents SET updated_at = datetime('now') WHERE id = ?").run(id);

      const note = db.prepare('SELECT * FROM incident_notes WHERE id = ?').get(result.lastInsertRowid) as any;

      res.status(201).json({
        message: 'Note added successfully',
        note: {
          id: note.id,
          incidentId: note.incident_id,
          content: note.content,
          createdAt: note.created_at,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/incidents/demo/clear — clear only demo incidents
router.delete('/demo/clear', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM incidents WHERE is_demo_data = 1').run();
    res.json({ message: `Cleared ${result.changes} demo incident(s)` });
  } catch (err) {
    next(err);
  }
});

export default router;
