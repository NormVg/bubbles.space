# Background Tasks & Dynamic Scheduling Architecture

## Problem Statement
Currently, Bubbles uses `localStorage` for its widget and workspace state. This means the backend AI has no awareness of the canvas unless the user is online with the app open. If we want to support dynamic background tasks (e.g., an agent waking up at 3 AM to create a report or a widget), the AI needs a way to update the user's canvas even when their browser is closed.

## Proposed Cloud-First Architecture

To enable offline background tasks and dynamic scheduling without high CPU polling, we must migrate the state layer to the cloud.

### 1. Zero-CPU Serverless Scheduling (Upstash QStash)
- **Why:** Polling a database every minute using Eve's static cron is CPU-intensive and inefficient.
- **How:** Use Upstash QStash (a serverless message queue). The AI uses a tool to call the QStash API: *"Wait exactly 3 hours, then POST to `/api/webhooks/background-task`."*
- **Result:** Zero CPU usage during the wait time. The Nitro server sleeps until the exact moment the task is due.

### 2. Cloud Database Migration (PostgreSQL / Supabase)
- **Why:** `localStorage` is completely isolated from the backend.
- **How:** Migrate Workspaces and Widgets from the client-side Pinia store to a remote database (e.g., PostgreSQL using Drizzle ORM, or Supabase).
- **Result:** The backend becomes the **Source of Truth**. When QStash wakes up the AI agent overnight, the AI writes the new widget directly into the user's database row.

### 3. Sync on Open & Real-Time Delivery
- **Offline Delivery:** When the user wakes up and opens the Bubbles app, the Nuxt frontend queries the database. The widget the AI created in the background is immediately fetched and rendered on the canvas.
- **Online Delivery (WebSockets):** If the user happens to be staring at the screen when the background task fires, the backend will update the database AND push a WebSocket/SSE event to the frontend: `"NEW_WIDGET_ADDED"`. The canvas will instantly render the new widget live.

## Execution Path (Future Migration)
1. Set up a PostgreSQL database and configure Drizzle ORM.
2. Build API routes to sync the Pinia `widgetStore` to the cloud.
3. Integrate QStash into the Eve agent's toolset for background scheduling.
4. Update the Eve agent to interact with the database instead of relying solely on the frontend's `<system_context>`.
