// IndexedDB-backed persistent storage for mock interview video blobs.
// Videos live locally on the user's device only - they are NOT synced to the
// cloud, since video blobs are large (5-50 MB each) and would consume significant
// bandwidth. Object URLs created from these blobs only exist in browser memory,
// so we re-create them on each page load from the persisted blob data.
//
// Fail-safe behavior: if IndexedDB is unavailable (private browsing, old browser,
// quota exceeded), every function silently fails. The mock interview feature
// degrades to session-only video behavior (the previous behavior).

const DB_NAME = 'offerbell_mock_videos';
const STORE = 'videos';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Persist a video blob keyed by entry ID. Returns true on success, false on any failure. */
export async function saveVideoBlob(id: string, blob: Blob): Promise<boolean> {
  try {
    const db = await openDB();
    return await new Promise<boolean>((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      const store = tx.objectStore(STORE);
      const req = store.put(blob, id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/** Load a video blob by entry ID. Returns null if missing or on error. */
export async function loadVideoBlob(id: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return await new Promise<Blob | null>((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const store = tx.objectStore(STORE);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result instanceof Blob ? req.result : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/** Delete a single video blob. Silently no-ops on failure. */
export async function deleteVideoBlob(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
  } catch {}
}

/** List all video IDs currently stored. */
export async function listVideoIds(): Promise<string[]> {
  try {
    const db = await openDB();
    return await new Promise<string[]>((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).getAllKeys();
      req.onsuccess = () => resolve((req.result as IDBValidKey[]).map(k => String(k)));
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/** Delete videos whose IDs aren't in the valid set. Cleans up after deleted responses. */
export async function pruneOrphanedVideos(validIds: Set<string>): Promise<void> {
  const stored = await listVideoIds();
  for (const id of stored) {
    if (!validIds.has(id)) {
      await deleteVideoBlob(id);
    }
  }
}
