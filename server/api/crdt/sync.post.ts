import { auth } from '../../utils/auth'
import { db } from '../../db'
import { crdtSyncState, workspace, widget } from '../../db/schema'
import { eq, sql } from 'drizzle-orm'
import * as Y from 'yjs'

export default defineEventHandler(async (event) => {
  // 1. Authenticate user
  const session = await auth.api.getSession({
    headers: event.headers
  })

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const userId = session.user.id

  // 2. Read payload
  const body = await readBody<{ stateVector?: string, update?: string }>(event)
  const clientVector = body?.stateVector ? Buffer.from(body.stateVector, 'base64') : new Uint8Array(0)
  const clientUpdate = body?.update ? Buffer.from(body.update, 'base64') : new Uint8Array(0)

  // 3. Load server state
  const records = await db.select().from(crdtSyncState).where(eq(crdtSyncState.userId, userId)).limit(1)
  const ydoc = new Y.Doc()
  
  const record = records[0]
  if (record && record.state) {
    Y.applyUpdate(ydoc, new Uint8Array(record.state as unknown as ArrayBuffer))
  }

  // 4. Apply client update to server
  if (clientUpdate.length > 0) {
    try {
       Y.applyUpdate(ydoc, clientUpdate, 'server')
    } catch (e) {
       console.error("Yjs server update error:", e)
    }
  }

  // 5. Compute what the client is missing
  const serverUpdateForClient = Y.encodeStateAsUpdate(ydoc, clientVector)

  // 6. Save back to DB if client changed something
  if (clientUpdate.length > 0) {
      const newFullState = Buffer.from(Y.encodeStateAsUpdate(ydoc))
      
      await db.insert(crdtSyncState)
        .values({ userId, state: newFullState as any }) // `bytea` type in drizzle is fine with Buffer/Uint8Array
        .onConflictDoUpdate({
          target: crdtSyncState.userId,
          set: { state: newFullState as any, updatedAt: new Date() }
        })
        
      // Extract yWidgets and yWorkspaces to standard SQL for AI read APIs
      // Note: Full relational sync is optional and can be run asynchronously
      event.waitUntil(syncSQLTables(userId, ydoc).catch(e => console.error("SQL Sync failed:", e)))
  }

  return {
    update: Buffer.from(serverUpdateForClient).toString('base64')
  }
})

// Async Upsert to SQL for AI readability
async function syncSQLTables(userId: string, ydoc: Y.Doc) {
  const yWorkspaces = ydoc.getMap<any>('workspaces')
  const yWidgets = ydoc.getMap<any>('widgets')
  
  const workspacesArr = Array.from(yWorkspaces.values())
  const widgetsArr = Array.from(yWidgets.values())
  
  if (workspacesArr.length > 0) {
    await db.insert(workspace)
      .values(workspacesArr.map(ws => ({
         id: ws.id,
         userId,
         label: ws.label,
         canvasState: ws.canvasState,
         sortOrder: ws.sortOrder
      })))
      .onConflictDoUpdate({
         target: workspace.id,
         set: {
            label: sql`EXCLUDED.label`,
            canvasState: sql`EXCLUDED.canvas_state`,
            sortOrder: sql`EXCLUDED.sort_order`,
            updatedAt: new Date()
         }
      })
  }

  if (widgetsArr.length > 0) {
    await db.insert(widget)
      .values(widgetsArr.map(w => ({
         id: w.id,
         workspaceId: w.workspaceId,
         type: w.type,
         x: w.x,
         y: w.y,
         width: w.width,
         height: w.height,
         zIndex: w.zIndex || 0,
         title: w.title,
         data: w.data,
         isArchived: w.isArchived || false
      })))
      .onConflictDoUpdate({
         target: widget.id,
         set: {
            workspaceId: sql`EXCLUDED.workspace_id`,
            type: sql`EXCLUDED.type`,
            x: sql`EXCLUDED.x`,
            y: sql`EXCLUDED.y`,
            width: sql`EXCLUDED.width`,
            height: sql`EXCLUDED.height`,
            zIndex: sql`EXCLUDED.z_index`,
            title: sql`EXCLUDED.title`,
            data: sql`EXCLUDED.data`,
            isArchived: sql`EXCLUDED.is_archived`,
            updatedAt: new Date()
         }
      })
  }
}
