// Firebase Realtime Database REST API configuration
const FIREBASE_CONFIG = {
  projectId: 'querybook-dc5a2',
  apiKey: 'AIzaSyBYcQT-AV-_v9fA8uhZtSnzVdVie9Ml_No',
  databaseURL: 'https://querybook-dc5a2-default-rtdb.firebaseio.com'
};

/**
 * Fetch reading list from Firebase
 * @returns {Promise<Array>} Array of book objects
 */
export async function fetchReadingListFromCloud() {
  try {
    const url = `${FIREBASE_CONFIG.databaseURL}/reading-list.json?auth=${FIREBASE_CONFIG.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('Failed to fetch reading list from cloud:', response.statusText);
      return [];
    }
    
    const data = await response.json();
    return data ? Object.values(data) : [];
  } catch (error) {
    console.error('Cloud fetch error:', error);
    return [];
  }
}

/**
 * Save reading list to Firebase
 * @param {Array} books - Array of book objects
 * @returns {Promise<boolean>} Success status
 */
export async function saveReadingListToCloud(books) {
  try {
    const url = `${FIREBASE_CONFIG.databaseURL}/reading-list.json?auth=${FIREBASE_CONFIG.apiKey}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(books)
    });
    
    if (!response.ok) {
      console.warn('Failed to save reading list to cloud:', response.statusText);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Cloud save error:', error);
    return false;
  }
}

/**
 * Remove a book from Firebase
 * @param {string} bookKey - The book's Open Library key
 * @returns {Promise<boolean>} Success status
 */
export async function removeBookFromCloud(bookKey) {
  try {
    const books = await fetchReadingListFromCloud();
    const updated = books.filter(book => book.key !== bookKey);
    return await saveReadingListToCloud(updated);
  } catch (error) {
    console.error('Cloud remove error:', error);
    return false;
  }
}
