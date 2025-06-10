import { openDB } from 'idb';

const DB_NAME = 'fileStorage';
const STORE_NAME = 'csvFiles';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const storeFileInIndexedDB = async (key, blob) => {
  const db = await initDB();
  await db.put(STORE_NAME, blob, key);
};

export const getFileFromIndexedDB = async (key) => {
  const db = await initDB();
  return await db.get(STORE_NAME, key);
};


export const deleteFileFromIndexedDB = async (key) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.delete(key);
  await tx.done;
};

