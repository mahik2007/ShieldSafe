import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/index';

describe('ShieldSafe Backend API Integration Tests', () => {
  it('GET /health returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('GET /api/hazards retrieves seeded demo hazards', async () => {
    const res = await request(app).get('/api/hazards');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.hazards)).toBe(true);
    expect(res.body.hazards.length).toBeGreaterThan(0);
  });

  it('POST /api/hazards validates input and creates a community hazard', async () => {
    const newHazard = {
      category: 'broken-streetlight',
      title: 'Dark footpath near bus stop',
      description: 'The pole lights are completely broken and sidewalk is unlit at night.',
      latitude: 12.98,
      longitude: 77.61,
    };

    const res = await request(app).post('/api/hazards').send(newHazard);
    expect(res.status).toBe(201);
    expect(res.body.hazard.title).toBe(newHazard.title);
    expect(res.body.hazard.status).toBe('unverified');
  });

  it('POST /api/analyze performs deterministic rules-based evaluation', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({ message: 'I know where you live. You will regret ignoring me.' });

    expect(res.status).toBe(200);
    expect(res.body.result.severity).toBe('urgent');
    expect(res.body.result.flags.length).toBeGreaterThan(0);
  });

  it('Incidents CRUD workflow works seamlessly', async () => {
    // 1. Create
    const createRes = await request(app)
      .post('/api/incidents')
      .send({
        title: 'Test Incident Log',
        category: 'online-harassment',
        description: 'Received intimidating messages via Instagram direct message.',
        evidenceExcerpts: ['You will regret this'],
      });

    expect(createRes.status).toBe(201);
    const incidentId = createRes.body.incident.id;

    // 2. Add Note
    const noteRes = await request(app)
      .post(`/api/incidents/${incidentId}/notes`)
      .send({ content: 'Blocked user profile.' });
    expect(noteRes.status).toBe(201);

    // 3. Retrieve
    const getRes = await request(app).get(`/api/incidents/${incidentId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.incident.notes.length).toBe(1);

    // 4. Delete
    const delRes = await request(app).delete(`/api/incidents/${incidentId}`);
    expect(delRes.status).toBe(200);
  });

  it('Journey Guardian handles creation and share token lifecycle', async () => {
    // Start journey
    const arrival = new Date(Date.now() + 3600000).toISOString();
    const journeyRes = await request(app)
      .post('/api/journeys')
      .send({
        destination: 'Airport Terminal 2',
        startLocation: 'Hotel Lobby',
        plannedArrivalTime: arrival,
        checkInIntervalMinutes: 15,
      });

    expect(journeyRes.status).toBe(201);
    const journeyId = journeyRes.body.journey.id;

    // Generate Share Token
    const shareRes = await request(app).post(`/api/journeys/${journeyId}/share`);
    expect(shareRes.status).toBe(200);
    const token = shareRes.body.token;
    expect(typeof token).toBe('string');

    // Access Shared Read-Only View
    const sharedViewRes = await request(app).get(`/api/journeys/shared/${token}`);
    expect(sharedViewRes.status).toBe(200);
    expect(sharedViewRes.body.sharedJourney.destination).toBe('Airport Terminal 2');

    // Revoke Share Token
    const revokeRes = await request(app).post(`/api/journeys/${journeyId}/revoke-share`);
    expect(revokeRes.status).toBe(200);

    // Access after revocation should fail
    const sharedRevokedRes = await request(app).get(`/api/journeys/shared/${token}`);
    expect(sharedRevokedRes.status).toBe(404);
  });
});
