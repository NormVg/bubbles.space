import { WorkspaceRepository, NewWorkspaceRecord, NewWidgetRecord } from '../repositories/workspace.repository';

export class WorkspaceService {
  /**
   * Retrieves all workspaces and widgets for a user and formats them
   * into the nested structure expected by the frontend Pinia store.
   */
  static async getSyncData(userId: string) {
    const { workspaces, widgets } = await WorkspaceRepository.getByUserId(userId);

    // Format into frontend structure
    const formattedWorkspaces = workspaces.map((ws) => {
      const wsWidgets = widgets.filter((w) => w.workspaceId === ws.id && !w.isArchived);
      const wsArchivedWidgets = widgets.filter((w) => w.workspaceId === ws.id && w.isArchived);

      return {
        id: ws.id,
        label: ws.label,
        canvasState: ws.canvasState,
        widgets: wsWidgets.map(w => ({
          id: w.id,
          type: w.type,
          x: w.x,
          y: w.y,
          width: w.width,
          height: w.height,
          title: w.title ?? undefined,
          data: w.data,
        })),
        archivedWidgets: wsArchivedWidgets.map(w => ({
          id: w.id,
          type: w.type,
          x: w.x,
          y: w.y,
          width: w.width,
          height: w.height,
          title: w.title ?? undefined,
          data: w.data,
        })),
      };
    });

    return formattedWorkspaces;
  }

  /**
   * Receives the full frontend state, flattens it, and syncs to Postgres.
   * Note: In a future iteration, Redis could be added here to buffer 
   * extremely high-frequency syncs before flushing to Postgres.
   */
  static async syncData(userId: string, frontendWorkspaces: any[]) {
    const workspacesMap = new Map<string, NewWorkspaceRecord>();
    const widgetsMap = new Map<string, NewWidgetRecord>();

    for (const ws of frontendWorkspaces) {
      workspacesMap.set(ws.id, {
        id: ws.id,
        userId,
        label: ws.label,
        canvasState: ws.canvasState || { x: 0, y: 0, scale: 1 },
      });

      // Flatten active widgets
      if (ws.widgets && Array.isArray(ws.widgets)) {
        for (const w of ws.widgets) {
          widgetsMap.set(w.id, {
            id: w.id,
            workspaceId: ws.id,
            type: w.type,
            x: w.x,
            y: w.y,
            width: w.width,
            height: w.height,
            title: w.title || null,
            data: w.data || {},
            isArchived: false,
          });
        }
      }

      // Flatten archived widgets
      if (ws.archivedWidgets && Array.isArray(ws.archivedWidgets)) {
        for (const w of ws.archivedWidgets) {
          // Archived overrides active if it exists in both (failsafe)
          widgetsMap.set(w.id, {
            id: w.id,
            workspaceId: ws.id,
            type: w.type,
            x: w.x,
            y: w.y,
            width: w.width,
            height: w.height,
            title: w.title || null,
            data: w.data || {},
            isArchived: true,
          });
        }
      }
    }

    const workspacesToUpsert = Array.from(workspacesMap.values());
    const widgetsToUpsert = Array.from(widgetsMap.values());

    await WorkspaceRepository.sync(userId, workspacesToUpsert, widgetsToUpsert);
    
    return { success: true, timestamp: new Date().toISOString() };
  }
}
