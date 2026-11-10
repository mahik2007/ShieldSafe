# ShieldSafe Architecture & Security Specification

## 1. Overview
ShieldSafe is a unified, privacy-first personal safety and digital protection platform designed to provide practical tools for everyday commuters, women, teenagers, and guardians without reliance on third-party cloud trackers, paid AI APIs, or centralized surveillance.

## 2. Core Pillars & Architecture

### 2.1 Deterministic Harassment Defender
- **Mechanism**: Local rules-based string & regex pattern matching.
- **Privacy Boundary**: No message, context, or excerpt leaves the host machine.
- **Categorization**: Direct threats, coercive demands, intimate material pressure, phishing, impersonation, and unwanted repeated contact.
- **Explainability**: Every detected pattern provides verbatim excerpts and plain-language reasoning.

### 2.2 Local Safety Map
- **Tile Provider**: OpenStreetMap via Leaflet.
- **Failure Resilience**: If tile servers are unreachable, an accessible and interactive List View ensures hazard information remains 100% usable.
- **Community Confirmations**: Multiple reports from distinct browser sessions verify hazards before status transitions from 'unverified' to 'community-confirmed'.
- **Routing**: Safe external links to OpenStreetMap directions without fabricated artificial ETA claims.

### 2.3 Journey Guardian & Cryptographic Sharing
- **Check-in Timer**: Client-side countdown with overdue status tracking.
- **Cryptographic Share Links**: Generates unpredictable 256-bit random tokens, hashed via SHA-256 for secure storage.
- **Access Revocation**: Tokens can be revoked instantly by the user or expire automatically after 24 hours.

### 2.4 Incident Evidence Vault & PDF Generation
- **Persistence**: SQLite database with foreign keys and write-ahead logging (WAL).
- **Client-Side Export**: Real-time PDF compilation via `jspdf` without cloud rendering services.
- **Objective Timelines**: Chronological notes and quote logs designed for consultations with legal aid or cybercrime reporting authorities.
