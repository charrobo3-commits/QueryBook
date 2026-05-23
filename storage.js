import { 
  fetchReadingListFromCloud, 
  saveReadingListToCloud 
} from './firebase.js';

const STORAGE_KEY = 'bookfinder-reading-list';
let cloudSyncEnabled = false;

export function enableCloudSync() {
  cloudSyncEnabled = true;
}

export function loadReadingList() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to load reading list', error);
    return [];
  }
}

export async function syncReadingListFromCloud() {
  try {
    const cloudList = await fetchReadingListFromCloud();
    if (cloudList.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudList));
      return cloudList;
    }
    return loadReadingList();
  } catch (error) {
    console.error('Failed to sync from cloud', error);
    return loadReadingList();
  }
}

export function saveReadingList(list) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    
    // Sync to cloud if enabled
    if (cloudSyncEnabled) {
      saveReadingListToCloud(list).catch(error => {
        console.warn('Cloud sync failed (local save succeeded)', error);
      });
    }
  } catch (error) {
    console.error('Failed to save reading list', error);
  }
}

export function addBookToReadingList(book) {
  const current = loadReadingList();
  const exists = current.some((item) => item.key === book.key);
  if (exists) {
    return current;
  }

  const saved = [{ ...book, savedAt: Date.now() }, ...current];
  saveReadingList(saved);
  return saved;
}

export function removeBookFromReadingList(key) {
  const current = loadReadingList();
  const updated = current.filter((book) => book.key !== key);
  saveReadingList(updated);
  return updated;
}
