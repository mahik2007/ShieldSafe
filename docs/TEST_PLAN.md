# ShieldSafe Automated Verification & Test Plan

## 1. Test Architecture
- **Unit & Integration Suite**: Backend HTTP integration tests via Vitest & Supertest (`server/src/index.test.ts`).
- **Database Engine**: Built-in `node:sqlite` in-memory and persistent tests.
- **Frontend Type Safety**: React 18 + Vite strict TypeScript checks (`tsc --noEmit`).

## 2. Test Execution Commands

```bash
# Run server test suite
npm run test --prefix server

# Run client type check
npm run typecheck --prefix client

# Run client build verification
npm run build --prefix client
```

## 3. Verified Scenarios
1. Health endpoint (`/health`) returns status 200 and healthy metadata.
2. Demo hazards are seeded and retrievable via `GET /api/hazards`.
3. New hazard submissions are validated and saved to SQLite with rate limiting.
4. Harassment Defender identifies direct threats and flags text patterns deterministically.
5. Incidents CRUD workflow (creation, chronological note insertion, single retrieval, deletion).
6. Journey Guardian session initiation, check-in, share link generation, read-only viewing, and instant revocation.
