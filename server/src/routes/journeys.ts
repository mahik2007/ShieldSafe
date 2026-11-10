import crypto from 'crypto';
import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { getDb } from '../database/db';
import { validate } from '../middleware/validation';
import { CreateJourneySchema, UpdateJourneyLocationSchema } from '../validation/schemas';

const router = Router();

// Rate limiting for public share token access
const shareTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { error: 'Too many requests for shared journey view. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// GET /api/journeys — list all journeys
router.get('/', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM journeys ORDER BY created_at DESC').all();

    const journeys = rows.map((r: any) => ({
      id: r.id,
      destination: r.destination,
      startLocation: r.start_location,
      plannedArrivalTime: r.planned_arrival_time,
      rideProvider: r.ride_provider,
      driverName: r.driver_name,
      vehicleRegistration: r.vehicle_registration,
      bookingReference: r.booking_reference,
      checkInIntervalMinutes: r.check_in_interval_minutes,
      status: r.status,
      shareToken: r.share_token_hash ? 'active' : undefined,
      shareTokenExpiresAt: r.share_token_expires_at,
      locationSharingEnabled: Boolean(r.location_sharing_enabled),
      lastLatitude: r.last_latitude,
      lastLongitude: r.last_longitude,
      lastCheckIn: r.last_check_in,
      completedAt: r.completed_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    res.json({ journeys });
  } catch (err) {
    next(err);
  }
});

// GET /api/journeys/active — get current active journey if any
router.get('/active', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const db = getDb();
    const row = db
      .prepare("SELECT * FROM journeys WHERE status = 'active' ORDER BY created_at DESC LIMIT 1")
      .get() as any;

    if (!row) {
      res.json({ journey: null });
      return;
    }

    res.json({
      journey: {
        id: row.id,
        destination: row.destination,
        startLocation: row.start_location,
        plannedArrivalTime: row.planned_arrival_time,
        rideProvider: row.ride_provider,
        driverName: row.driver_name,
        vehicleRegistration: row.vehicle_registration,
        bookingReference: row.booking_reference,
        checkInIntervalMinutes: row.check_in_interval_minutes,
        status: row.status,
        shareTokenExpiresAt: row.share_token_expires_at,
        locationSharingEnabled: Boolean(row.location_sharing_enabled),
        lastLatitude: row.last_latitude,
        lastLongitude: row.last_longitude,
        lastCheckIn: row.last_check_in,
        completedAt: row.completed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/journeys/:id — get specific journey
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid journey ID' });
      return;
    }

    const db = getDb();
    const row = db.prepare('SELECT * FROM journeys WHERE id = ?').get(id) as any;
    if (!row) {
      res.status(404).json({ error: 'Journey not found' });
      return;
    }

    res.json({
      journey: {
        id: row.id,
        destination: row.destination,
        startLocation: row.start_location,
        plannedArrivalTime: row.planned_arrival_time,
        rideProvider: row.ride_provider,
        driverName: row.driver_name,
        vehicleRegistration: row.vehicle_registration,
        bookingReference: row.booking_reference,
        checkInIntervalMinutes: row.check_in_interval_minutes,
        status: row.status,
        shareTokenExpiresAt: row.share_token_expires_at,
        locationSharingEnabled: Boolean(row.location_sharing_enabled),
        lastLatitude: row.last_latitude,
        lastLongitude: row.last_longitude,
        lastCheckIn: row.last_check_in,
        completedAt: row.completed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/journeys — start a new journey
router.post(
  '/',
  validate(CreateJourneySchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        destination,
        startLocation,
        plannedArrivalTime,
        rideProvider,
        driverName,
        vehicleRegistration,
        bookingReference,
        checkInIntervalMinutes,
        locationSharingEnabled,
      } = req.body;

      const db = getDb();

      // Check if there's already an active journey and complete or notify
      const active = db.prepare("SELECT id FROM journeys WHERE status = 'active'").get();
      if (active) {
        // Automatically complete the previous active journey
        db.prepare("UPDATE journeys SET status = 'completed', completed_at = datetime('now') WHERE status = 'active'").run();
      }

      const stmt = db.prepare(`
        INSERT INTO journeys (
          destination, start_location, planned_arrival_time,
          ride_provider, driver_name, vehicle_registration, booking_reference,
          check_in_interval_minutes, status, location_sharing_enabled, last_check_in
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, datetime('now'))
      `);

      const result = stmt.run(
        destination,
        startLocation,
        plannedArrivalTime,
        rideProvider || null,
        driverName || null,
        vehicleRegistration || null,
        bookingReference || null,
        checkInIntervalMinutes,
        locationSharingEnabled ? 1 : 0
      );

      const created = db.prepare('SELECT * FROM journeys WHERE id = ?').get(result.lastInsertRowid) as any;

      res.status(201).json({
        message: 'Journey started successfully',
        journey: {
          id: created.id,
          destination: created.destination,
          startLocation: created.start_location,
          plannedArrivalTime: created.planned_arrival_time,
          rideProvider: created.ride_provider,
          driverName: created.driver_name,
          vehicleRegistration: created.vehicle_registration,
          bookingReference: created.booking_reference,
          checkInIntervalMinutes: created.check_in_interval_minutes,
          status: created.status,
          locationSharingEnabled: Boolean(created.location_sharing_enabled),
          lastCheckIn: created.last_check_in,
          createdAt: created.created_at,
          updatedAt: created.updated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/journeys/:id/checkin — record a check-in
router.post('/:id/checkin', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid journey ID' });
      return;
    }

    const db = getDb();
    const journey = db.prepare('SELECT * FROM journeys WHERE id = ?').get(id) as any;
    if (!journey) {
      res.status(404).json({ error: 'Journey not found' });
      return;
    }

    if (journey.status !== 'active') {
      res.status(400).json({ error: 'Cannot check in on an inactive journey' });
      return;
    }

    db.prepare("UPDATE journeys SET last_check_in = datetime('now'), updated_at = datetime('now') WHERE id = ?").run(id);

    res.json({
      message: 'Check-in confirmed successfully',
      lastCheckIn: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/journeys/:id/location — update location
router.post(
  '/:id/location',
  validate(UpdateJourneyLocationSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid journey ID' });
        return;
      }

      const { latitude, longitude } = req.body;
      const db = getDb();

      const journey = db.prepare('SELECT id, status, location_sharing_enabled FROM journeys WHERE id = ?').get(id) as any;
      if (!journey) {
        res.status(404).json({ error: 'Journey not found' });
        return;
      }

      if (journey.status !== 'active') {
        res.status(400).json({ error: 'Cannot update location on an inactive journey' });
        return;
      }

      db.prepare(`
        UPDATE journeys
        SET last_latitude = ?, last_longitude = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(latitude, longitude, id);

      res.json({ message: 'Location updated successfully' });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/journeys/:id/share — create a shareable token
router.post('/:id/share', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid journey ID' });
      return;
    }

    const db = getDb();
    const journey = db.prepare('SELECT * FROM journeys WHERE id = ?').get(id) as any;
    if (!journey) {
      res.status(404).json({ error: 'Journey not found' });
      return;
    }

    // Generate high-entropy token
    const rawToken = generateSecureToken();
    const hashed = hashToken(rawToken);

    // 24 hours expiry
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    db.prepare(`
      UPDATE journeys
      SET share_token_hash = ?, share_token_expires_at = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(hashed, expiryDate, id);

    res.json({
      message: 'Share link generated',
      token: rawToken,
      expiresAt: expiryDate,
      warning:
        'Anyone with this link can view this specific journey until it expires or is revoked. Do not share publicly.',
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/journeys/:id/revoke-share — revoke sharing token
router.post('/:id/revoke-share', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid journey ID' });
      return;
    }

    const db = getDb();
    db.prepare(`
      UPDATE journeys
      SET share_token_hash = NULL, share_token_expires_at = NULL, updated_at = datetime('now')
      WHERE id = ?
    `).run(id);

    res.json({ message: 'Journey sharing access has been revoked immediately.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/journeys/:id/complete — mark journey as completed
router.post('/:id/complete', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid journey ID' });
      return;
    }

    const db = getDb();
    db.prepare(`
      UPDATE journeys
      SET status = 'completed', completed_at = datetime('now'), share_token_hash = NULL, updated_at = datetime('now')
      WHERE id = ?
    `).run(id);

    res.json({ message: 'Journey completed safely. Share link has been deactivated.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/journeys/:id/cancel — cancel journey
router.post('/:id/cancel', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid journey ID' });
      return;
    }

    const db = getDb();
    db.prepare(`
      UPDATE journeys
      SET status = 'cancelled', share_token_hash = NULL, updated_at = datetime('now')
      WHERE id = ?
    `).run(id);

    res.json({ message: 'Journey cancelled.' });
  } catch (err) {
    next(err);
  }
});

// GET /api/journeys/shared/:token — public read-only view for contacts with rate-limiting
router.get('/shared/:token', shareTokenLimiter, (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = String(req.params.token);
    if (!token || token.length < 32) {
      res.status(400).json({ error: 'Invalid share token format.' });
      return;
    }

    const hashed = hashToken(token);
    const db = getDb();

    const row = db
      .prepare('SELECT * FROM journeys WHERE share_token_hash = ?')
      .get(hashed) as any;

    if (!row) {
      res.status(404).json({ error: 'Shared journey not found or link has expired/been revoked.' });
      return;
    }

    // Check expiration
    if (row.share_token_expires_at) {
      const expiresAt = new Date(row.share_token_expires_at).getTime();
      if (Date.now() > expiresAt) {
        res.status(410).json({ error: 'This journey sharing link has expired.' });
        return;
      }
    }

    // Return strictly non-sensitive read-only view
    res.json({
      sharedJourney: {
        id: row.id,
        destination: row.destination,
        startLocation: row.start_location,
        plannedArrivalTime: row.planned_arrival_time,
        rideProvider: row.ride_provider,
        driverName: row.driver_name,
        vehicleRegistration: row.vehicle_registration,
        status: row.status,
        lastCheckIn: row.last_check_in,
        // Only provide location if user explicitly enabled it
        location: row.location_sharing_enabled && row.last_latitude && row.last_longitude
          ? { latitude: row.last_latitude, longitude: row.last_longitude }
          : null,
        locationSharingEnabled: Boolean(row.location_sharing_enabled),
        expiresAt: row.share_token_expires_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
