# Bubbles.space: Offline-First DB Migration Plan

This document outlines the strategic waves to migrate Bubbles from a purely `localStorage` spatial canvas into a robust, offline-first application backed by PostgreSQL & Drizzle ORM, while maintaining 0-latency optimistic UI updates.

## Architecture Philosophy
- **Local-First**: The UI reads and writes to Pinia/`localStorage` instantly. There is zero network latency when dragging or typing.
- **Eventual Consistency**: Changes are debounced and synced to PostgreSQL in the background.
- **Source of Truth on Boot**: When the app starts, it fetches the latest state from Postgres and reconciles it with `localStorage`.

---

## Wave 1: Database Foundation & API Layer

**Goal:** Establish the PostgreSQL tables and the API routes required to read/write workspace data securely.

### Tasks
1. **Schema Definition**: 
   - Add `workspaces` table (`id`, `user_id`, `label`, `canvas_state`, `created_at`, `updated_at`).
   - Add `widgets` table (`id`, `workspace_id`, `type`, `x`, `y`, `width`, `height`, `data`, `is_archived`, `created_at`, `updated_at`).
2. **Migrations**: 
   - Run `npx drizzle-kit push` to apply the schema to Neon.
3. **N-Tier Architecture (per AGENTS.md)**:
   - **Repositories**: Create `server/repositories/workspace.repository.ts` and `widget.repository.ts` strictly for database operations.
   - **Services**: Create `server/services/workspace.service.ts` to handle the business logic of syncing, validations, and mapping.
   - **API Routes**: Create thin wrappers `GET /api/sync` and `POST /api/sync` that solely parse input, call the Service, and return standardized responses.

### Validation Loop 1
- [ ] Schema applies successfully.
- [ ] Manually hit `POST /api/sync` via a script or curl to inject dummy data.
- [ ] Hit `GET /api/sync` and verify the data returns correctly structured and bound to the correct `userId`.

---

## Wave 2: Store Refactoring & Optimistic Sync

**Goal:** Connect the Vue frontend to the new API without sacrificing the instantaneous feel of the canvas.

### Tasks
1. **Init Logic Rewrite**:
   - Update `app/stores/widgets.ts` `init()` function. Note: As per AGENTS.md, we will use `shallowRef` for heavy widget data to prevent VDOM thrashing.
   - Flow: Load from `localStorage` instantly (to render the UI immediately) -> Fetch `GET /api/sync` in the background -> Reconcile state (DB wins if newer) -> Overwrite `localStorage` and Pinia.
2. **The Sync Engine (Debouncer)**:
   - Create a background sync queue in the store.
   - Whenever a widget is moved/edited, Pinia and `localStorage` are updated immediately.
   - A debounced function (e.g., 2 seconds after the last interaction) fires `POST /api/sync` to flush all local changes to Postgres via the Service layer. *Future-proofing: the service layer will be designed so we can easily swap or augment Postgres with Redis for extremely high-frequency syncs if needed.*
3. **Legacy Migration**:
   - If a user logs in and their `localStorage` has legacy widgets but Postgres is empty, push the legacy data to Postgres automatically so they don't lose their old work.

### Validation Loop 2
- [ ] Open the app, drag a widget, and wait 2 seconds. Check the Neon DB console to verify the new coordinates were saved.
- [ ] Refresh the page. The widget should appear exactly where you left it.
- [ ] Hard-clear `localStorage` in the browser devtools and refresh. The app should pull the state perfectly from Postgres.

---

## Wave 3: Real-time Multi-device & Edge Cases

**Goal:** Ensure the app doesn't break if the user opens Bubbles on their laptop and phone simultaneously, or loses internet connection.

### Tasks
1. **Timestamping**: 
   - Add `updated_at` to the local store widgets. Only sync widgets to the DB if the local `updated_at` is newer than the DB's.
2. **Offline Mode handling**: 
   - If the `POST /api/sync` fails (no internet), keep the changes marked as "dirty" in `localStorage` and retry the sync exponentially.
3. **Global Saving Indicator**: 
   - Add a subtle cloud icon to the HUD. 
   - Gray = Offline, Spinning = Syncing, Green Check = All changes saved to cloud.

### Validation Loop 3
- [ ] Disconnect internet, move widgets around (HUD shows Offline). Reconnect internet, HUD spins, data saves to DB.
- [ ] Open the app in two different browsers (simulating two devices). Make a change in Browser A. Refresh Browser B and see the changes propagate.
