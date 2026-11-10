# 🛡️ ShieldSafe — Personal Safety & Digital Protection Platform

> **"Know the risks. Choose the safer way. Stay connected."**

ShieldSafe is a unified, privacy-first personal safety and digital protection web application designed for women, commuters, teenagers, and guardians. It integrates community physical hazard reporting, deterministic digital harassment analysis, incident evidence preservation with PDF generation, and active journey tracking with cryptographic share links.

---

## 🌟 Key Features

1. **Three Tailored Safety Modes**:
   - **Everyday Safety**: Commute-focused road alerts, trip check-in timers, and digital scam filters.
   - **Women's Safety**: Guidance for well-lit routes, harassment defense against blackmail, and rapid ride verification.
   - **Child & Teen Safety**: Age-appropriate privacy hygiene, anti-oversharing checklists, and family check-ins.

2. **Local Safety Map (OpenStreetMap & Leaflet)**:
   - Interactive markers for broken streetlights, road construction, closures, blocked footpaths, and stray dogs.
   - Community verification workflow to confirm reports.
   - Accessible **List View Fallback** ensuring 100% usability when map tile networks are unreachable.
   - Direct OpenStreetMap navigation links without fabricated routing ETA claims.

3. **Digital Harassment Defender**:
   - **Deterministic, rules-based pattern analyzer** (no external AI API keys or third-party cloud models required).
   - Identifies coercion, direct threats, intimate material blackmail, credential phishing, and stalker language.
   - Provides verbatim excerpts, transparent explanations, practical next steps, and instant conversion to an **Incident Evidence Record**.

4. **Incident Evidence Vault & Client-Side PDF Export**:
   - Complete incident lifecycle (Create, Edit, Note, Delete, Filter, and Search).
   - Chronological action timeline and verbatim evidence quote logs.
   - Local PDF report generation via `jspdf` for discussions with legal aid or cybercrime reporting authorities.

5. **Journey Guardian**:
   - Active commute countdown timer with configurable check-in intervals and overdue warnings.
   - 256-bit cryptographically secure sharing tokens with SHA-256 database hashing.
   - Read-only public contact view (`/journey/share/:token`) that can be revoked immediately with one click.

6. **Safety Action Planner**:
   - Interactive, category-grouped checklist with persistence and custom notes.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v20.x, v22.x, or v24.x (uses built-in `node:sqlite`, zero native C++ compiler or Python build tools required!)
- **npm** v10+

### One-Command Startup
Clone or open the workspace and launch both frontend and backend concurrently:

```bash
# 1. Install root dependencies
npm install

# 2. Run both Client (Port 5173) and Server (Port 3001) concurrently
npm run dev
```

The application will be accessible at:
👉 **Local Web Interface**: [http://localhost:5173](http://localhost:5173)  
👉 **Backend API**: [http://localhost:3001](http://localhost:3001)  
👉 **API Health Endpoint**: [http://localhost:3001/health](http://localhost:3001/health)

---

## 🧪 Testing & Verification

Run the automated backend integration test suite:

```bash
npm run test --prefix server
```

Run client build and type checking:

```bash
npm run build --prefix client
```

---

## 🔒 Privacy & Architecture Guarantees

- **Zero Paid API Keys**: No Google Maps, Mapbox, OpenAI, Firebase, or Supabase credentials needed.
- **Local SQLite Persistence**: Data resides in `server/data/shieldsafe.db`.
- **No Background Tracking**: GPS coordinates are requested strictly on-demand.
- **Honest Disclaimers**: ShieldSafe does not claim to prevent crime, replace 112/911 emergency services, or predict human criminal behaviour.
