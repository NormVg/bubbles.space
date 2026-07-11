import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'

// The global document
export const ydoc = new Y.Doc()

// We store widgets and workspaces as flat maps keyed by their IDs.
// The values will be plain JSON objects (shallow CRDT resolution).
export const yWidgets = ydoc.getMap<any>('widgets')
export const yWorkspaces = ydoc.getMap<any>('workspaces')

export let idbProvider: IndexeddbPersistence | null = null

/**
 * Initializes the local IndexedDB persistence for the Yjs document.
 * @param userId We namespace the DB by userId to prevent cross-account leakage on shared devices.
 */
export const initLocalSync = (userId: string): Promise<void> => {
  return new Promise((resolve) => {
    if (idbProvider) {
      resolve()
      return
    }
    
    idbProvider = new IndexeddbPersistence(`bubbles-crdt-${userId}`, ydoc)
    
    idbProvider.once('synced', () => {
      console.log('[Yjs] IndexedDB state fully loaded into memory.')
      resolve()
    })
  })
}
