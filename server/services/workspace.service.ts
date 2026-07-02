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
          data: w.data,
        })),
        archivedWidgets: wsArchivedWidgets.map(w => ({
          id: w.id,
          type: w.type,
          x: w.x,
          y: w.y,
          width: w.width,
          height: w.height,
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
    const workspacesToUpsert: NewWorkspaceRecord[] = [];
    const widgetsToUpsert: NewWidgetRecord[] = [];

    for (const ws of frontendWorkspaces) {
      workspacesToUpsert.push({
        id: ws.id,
        userId,
        label: ws.label,
        canvasState: ws.canvasState || { x: 0, y: 0, scale: 1 },
      });

      // Flatten active widgets
      if (ws.widgets && Array.isArray(ws.widgets)) {
        for (const w of ws.widgets) {
          widgetsToUpsert.push({
            id: w.id,
            workspaceId: ws.id,
            type: w.type,
            x: w.x,
            y: w.y,
            width: w.width,
            height: w.height,
            data: w.data || {},
            isArchived: false,
          });
        }
      }

      // Flatten archived widgets
      if (ws.archivedWidgets && Array.isArray(ws.archivedWidgets)) {
        for (const w of ws.archivedWidgets) {
          widgetsToUpsert.push({
            id: w.id,
            workspaceId: ws.id,
            type: w.type,
            x: w.x,
            y: w.y,
            width: w.width,
            height: w.height,
            data: w.data || {},
            isArchived: true,
          });
        }
      }
    }

    await WorkspaceRepository.sync(userId, workspacesToUpsert, widgetsToUpsert);
    
    return { success: true, timestamp: new Date().toISOString() };
  }
}
