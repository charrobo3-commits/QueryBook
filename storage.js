const STORAGE_KEY = 'bookfinder-reading-list';

export function loadReadingList() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to load reading list', error);
    return [];
  }
}

export function saveReadingList(list) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
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
