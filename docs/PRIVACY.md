# ShieldSafe Privacy & Data Governance

## Data Storage
- All records (incidents, notes, hazards, journeys) are stored locally in `data/shieldsafe.db` on your computer using SQLite.
- No third-party analytics, tracking cookies, or advertising pixels exist in this application.

## Location & GPS Policy
- Location coordinates are only retrieved when the user explicitly triggers the "Locate Me" or GPS sharing buttons in the browser.
- Background location collection is never performed.

## Journey Sharing Privacy
- Public journey sharing URLs contain high-entropy tokens.
- Shared views are strictly read-only and display only transit metadata, not unrelated user records or incident logs.
- Revoking a share token immediately invalidates access for any recipient.
