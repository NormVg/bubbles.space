import { eq, sql, asc, and, notInArray, inArray } from 'drizzle-orm';
import { db } from '../db';
import { workspace, widget } from '../db/schema';

export type WorkspaceRecord = typeof workspace.$inferSelect;
export type WidgetRecord = typeof widget.$inferSelect;
export type NewWorkspaceRecord = typeof workspace.$inferInsert;
export type NewWidgetRecord = typeof widget.$inferInsert;

export class WorkspaceRepository {
  /**
   * Fetches all workspaces and their associated widgets for a given user.
   */
  static async getByUserId(userId: string) {
    const workspaces = await db.query.workspace.findMany({
      where: eq(workspace.userId, userId),
      orderBy: [asc(workspace.sortOrder), asc(workspace.createdAt)],
    });

    const workspaceIds = workspaces.map((w) => w.id);

    let widgets: WidgetRecord[] = [];
    if (workspaceIds.length > 0) {
      widgets = await db.query.widget.findMany({
        where: (widget, { inArray }) => inArray(widget.workspaceId, workspaceIds),
      });
    }

    return { workspaces, widgets };
  }

  /**
   * Upserts multiple workspaces in a single transaction.
   */
  static async upsertWorkspaces(tx: any, workspacesData: NewWorkspaceRecord[]) {
    if (workspacesData.length === 0) return;
    await tx
      .insert(workspace)
      .values(workspacesData)
      .onConflictDoUpdate({
        target: workspace.id,
        set: {
          label: sql`excluded.label`,
          canvasState: sql`excluded.canvas_state`,
          sortOrder: sql`excluded.sort_order`,
          updatedAt: new Date(),
        },
      });
  }

  /**
   * Upserts multiple widgets in a single transaction.
   */
  static async upsertWidgets(tx: any, widgetsData: NewWidgetRecord[]) {
    if (widgetsData.length === 0) return;
    await tx
      .insert(widget)
      .values(widgetsData)
      .onConflictDoUpdate({
        target: widget.id,
        set: {
          workspaceId: sql`excluded.workspace_id`,
          type: sql`excluded.type`,
          x: sql`excluded.x`,
          y: sql`excluded.y`,
          width: sql`excluded.width`,
          height: sql`excluded.height`,
          zIndex: sql`excluded.z_index`,
          title: sql`excluded.title`,
          data: sql`excluded.data`,
          isArchived: sql`excluded.is_archived`,
          updatedAt: new Date(),
        },
      });
  }

  /**
   * Performs a full sync within a transaction
   */
  static async sync(userId: string, workspacesData: NewWorkspaceRecord[], widgetsData: NewWidgetRecord[]) {
    await db.transaction(async (tx) => {
      // Upsert workspaces first to satisfy foreign key constraints
      await this.upsertWorkspaces(tx, workspacesData);
      
      // Upsert widgets
      await this.upsertWidgets(tx, widgetsData);

      // Delete widgets that are no longer in the payload
      const incomingWorkspaceIds = workspacesData.map(w => w.id);
      const incomingWidgetIds = widgetsData.map(w => w.id);

      if (incomingWorkspaceIds.length > 0) {
        if (incomingWidgetIds.length > 0) {
          await tx.delete(widget).where(
            and(
              inArray(widget.workspaceId, incomingWorkspaceIds),
              notInArray(widget.id, incomingWidgetIds)
            )
          );
        } else {
          await tx.delete(widget).where(
            inArray(widget.workspaceId, incomingWorkspaceIds)
          );
        }

        // Delete workspaces that are no longer in the payload
        await tx.delete(workspace).where(
          and(
            eq(workspace.userId, userId),
            notInArray(workspace.id, incomingWorkspaceIds)
          )
        );
      } else {
        // If empty payload, delete all workspaces for this user (cascades to widgets)
        await tx.delete(workspace).where(eq(workspace.userId, userId));
      }
    });
  }
}
