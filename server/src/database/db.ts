// Database wrapper using Node's native built-in node:sqlite (DatabaseSync)
// Perfectly compatible with Node 22+ & 24, zero external compilation or native gyp build required.

import path from 'path';
import fs from 'fs';

// @ts-ignore - node:sqlite is built-in in Node v22+
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.env.DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : path.resolve(process.cwd(), 'data', 'shieldsafe.db');

// Ensure directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dbInstance: any = null;

export interface DBWrapper {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...params: any[]): { changes: number; lastInsertRowid: number | bigint };
    get(...params: any[]): any;
    all(...params: any[]): any[];
  };
  transaction<T>(fn: (...args: any[]) => T): (...args: any[]) => T;
}

export function getDb(): DBWrapper {
  if (!dbInstance) {
    const rawDb = new DatabaseSync(DB_PATH);
    rawDb.exec('PRAGMA foreign_keys = ON;');

    dbInstance = {
      exec(sql: string) {
        return rawDb.exec(sql);
      },
      prepare(sql: string) {
        const stmt = rawDb.prepare(sql);
        return {
          run(...params: any[]) {
            return stmt.run(...params);
          },
          get(...params: any[]) {
            return stmt.get(...params);
          },
          all(...params: any[]) {
            return stmt.all(...params);
          },
        };
      },
      transaction<T>(fn: (...args: any[]) => T) {
        return (...args: any[]) => {
          rawDb.exec('BEGIN TRANSACTION;');
          try {
            const res = fn(...args);
            rawDb.exec('COMMIT;');
            return res;
          } catch (e) {
            rawDb.exec('ROLLBACK;');
            throw e;
          }
        };
      },
    };
  }
  return dbInstance;
}

export function initializeDatabase(): void {
  const database = getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS hazards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'unverified',
      confirmation_count INTEGER NOT NULL DEFAULT 0,
      is_demo_data INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS hazard_confirmations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hazard_id INTEGER NOT NULL REFERENCES hazards(id) ON DELETE CASCADE,
      session_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(hazard_id, session_id)
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      incident_date TEXT,
      source_label TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      evidence_excerpts TEXT NOT NULL DEFAULT '[]',
      is_demo_data INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS incident_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS journeys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination TEXT NOT NULL,
      start_location TEXT NOT NULL,
      planned_arrival_time TEXT NOT NULL,
      ride_provider TEXT,
      driver_name TEXT,
      vehicle_registration TEXT,
      booking_reference TEXT,
      check_in_interval_minutes INTEGER NOT NULL DEFAULT 30,
      status TEXT NOT NULL DEFAULT 'active',
      share_token_hash TEXT,
      share_token_expires_at TEXT,
      location_sharing_enabled INTEGER NOT NULL DEFAULT 0,
      last_latitude REAL,
      last_longitude REAL,
      last_check_in TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS checklist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      safety_mode TEXT NOT NULL DEFAULT 'all',
      completed INTEGER NOT NULL DEFAULT 0,
      note TEXT,
      completed_at TEXT,
      order_index INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  console.log('✅ Native SQLite Database initialized at', DB_PATH);
}

export function seedDemoData(): void {
  const database = getDb();

  // Check if already seeded
  const existing = database.prepare('SELECT COUNT(*) as count FROM hazards WHERE is_demo_data = 1').get() as { count: number };
  if (existing && existing.count > 0) {
    console.log('ℹ️  Demo data already present, skipping seed.');
    return;
  }

  // Seed demo hazards
  const hazardInsert = database.prepare(`
    INSERT INTO hazards (category, title, description, latitude, longitude, status, confirmation_count, is_demo_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const demoHazards = [
    ['broken-streetlight', 'Streetlight out — MG Road', 'Two consecutive streetlights non-functional between Anil Kumble Circle and Trinity Metro station. Area is dark after 8 PM.', 12.9758, 77.6011, 'community-confirmed', 4],
    ['road-construction', 'Road digging — Koramangala 5th Block', 'Open trench along the footpath outside Forum Mall. No barricades visible on the footpath side.', 12.9352, 77.6244, 'unverified', 1],
    ['stray-dog', 'Stray dog pack — HSR Layout Sector 2', 'A pack of 6-8 stray dogs near the park entrance. Residents report aggressive behaviour in the evenings.', 12.9116, 77.6412, 'community-confirmed', 7],
    ['blocked-footpath', 'Footpath blocked — Indiranagar 100ft Road', 'Construction material stored on the footpath near 12th Main junction. Pedestrians forced onto road.', 12.9719, 77.6412, 'unverified', 2],
    ['road-closure', 'Road closure — Cubbon Park area', 'Sunday pedestrian zone active until 12 PM. Vehicle access restricted.', 12.9766, 77.5993, 'resolved', 0],
    ['other', 'Poor visibility — Whitefield ITPL Road', 'Overhead trees blocking streetlights. Several potholes visible only when you are close. Reported by local resident.', 12.9850, 77.7272, 'unverified', 3],
  ];

  for (const h of demoHazards) {
    hazardInsert.run(...h);
  }

  // Seed demo incidents
  const incidentInsert = database.prepare(`
    INSERT INTO incidents (title, category, description, incident_date, source_label, status, evidence_excerpts, is_demo_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const demoIncidents = [
    [
      'Repeated threatening messages — WhatsApp',
      'online-harassment',
      'An unknown number sent increasingly aggressive messages over three days. Messages contained threats related to sharing private photographs.',
      '2026-10-15',
      'WhatsApp chat export',
      'in-progress',
      JSON.stringify([
        '"I know where you live. You will regret ignoring me."',
        '"Send me what I want or everyone will see what I have."',
      ]),
    ],
    [
      'Suspicious account impersonating employer',
      'impersonation',
      'A fake LinkedIn profile using my employer\'s name and logo sent connection requests and asked for my login credentials under the guise of an internal audit.',
      '2026-10-20',
      'LinkedIn screenshot',
      'open',
      JSON.stringify([
        '"Please verify your credentials at the link below to complete the internal security audit."',
      ]),
    ],
  ];

  for (const inc of demoIncidents) {
    const result = incidentInsert.run(...inc);
    if (inc[0] === demoIncidents[0][0]) {
      database.prepare(`
        INSERT INTO incident_notes (incident_id, content) VALUES (?, ?)
      `).run(Number(result.lastInsertRowid), 'Reported to local cybercrime helpline. Reference number pending.');
    }
  }

  // Seed default checklist items
  const checklistInsert = database.prepare(`
    INSERT INTO checklist_items (category, title, description, safety_mode, order_index)
    VALUES (?, ?, ?, ?, ?)
  `);

  const checklistItems = [
    ['Digital Safety', 'Preserve original messages', 'Take screenshots and export chat logs with timestamps intact before blocking a sender.', 'all', 1],
    ['Digital Safety', 'Do not respond to threats', 'Avoid engaging with threatening messages. Responses can escalate the situation.', 'all', 2],
    ['Digital Safety', 'Block and report the account', 'Use the platform\'s built-in reporting tools to report abusive accounts.', 'all', 3],
    ['Digital Safety', 'Review account privacy settings', 'Audit who can see your profile, posts, and contact information on each platform you use.', 'all', 4],
    ['Digital Safety', 'Enable two-factor authentication', 'Secure your accounts with a second verification step to prevent unauthorised access.', 'all', 5],
    ['Physical Safety', 'Share your journey plan', 'Tell a trusted person your destination, route, and expected arrival time before travelling.', 'everyday', 6],
    ['Physical Safety', 'Verify hazard reports locally', 'Check community reports before relying on them. Conditions change and reports may be outdated.', 'everyday', 7],
    ['Emergency Preparedness', 'Know your local emergency numbers', 'Keep local police, ambulance, and women\'s helpline numbers accessible on your phone.', 'all', 8],
    ['Emergency Preparedness', 'Identify trusted contacts', 'Designate two or three people who can be contacted in an emergency.', 'all', 9],
    ['Women\'s Safety', 'Use well-lit routes after dark', 'Plan routes that pass through populated, well-lit areas especially during evening and night travel.', 'womens', 10],
    ['Women\'s Safety', 'Keep emergency contacts on speed dial', 'Set up quick-dial or SOS shortcuts on your phone for key contacts.', 'womens', 11],
    ['Child & Teen Safety', 'Discuss online safety with a trusted adult', 'Talk to a parent or guardian about any uncomfortable online messages or requests.', 'child-teen', 12],
    ['Child & Teen Safety', 'Never share personal information online', 'Do not share your school, address, phone number, or schedule with people you have not met in person.', 'child-teen', 13],
    ['Child & Teen Safety', 'Tell an adult about anything upsetting', 'If anything online or in person makes you feel unsafe or uncomfortable, tell a trusted adult immediately.', 'child-teen', 14],
  ];

  for (const item of checklistItems) {
    checklistInsert.run(...item);
  }

  console.log('✅ Demo data seeded successfully.');
}
