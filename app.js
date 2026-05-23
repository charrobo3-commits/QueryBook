import { searchBooks } from './api.js';
import { addBookToReadingList, loadReadingList, removeBookFromReadingList } from './storage.js';
import { createBookCard } from './components/bookCard.js';
import { createEmptyState } from './components/emptyState.js';

const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const resultsContainer = document.getElementById('results-container');
const readingListContainer = document.getElementById('reading-list-container');
const resultsSummary = document.getElementById('results-summary');

let searchResults = [];
let readingList = loadReadingList();
let currentQuery = '';
let currentSort = sortSelect.value;

function debounce(callback, delay) {
  let timeoutId = null;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), delay);
  };
}

function isSaved(bookKey) {
  return readingList.some((item) => item.key === bookKey);
}

function updateResultsSummary(text) {
  resultsSummary.textContent = text;
}

function renderSearchResults(books) {
  resultsContainer.innerHTML = '';

  if (!currentQuery.trim()) {
    resultsContainer.appendChild(createEmptyState({
      title: 'Start your search',
      message: 'Type a title, author, or keyword to find books.',
    }));
    updateResultsSummary('Enter a query to begin.');
    return;
  }

  if (books.length === 0) {
    resultsContainer.appendChild(createEmptyState({
      title: 'No matches found',
      message: 'Try a different query or clear the sort filter.',
    }));
    updateResultsSummary('No results for your search.');
    return;
  }

  books.forEach((book, index) => {
    const card = createBookCard(book, {
      actionText: isSaved(book.key) ? 'Saved' : 'Save',
      actionName: 'save',
      isSaved: isSaved(book.key),
      delay: index * 40,
    });
    resultsContainer.appendChild(card);
  });

  updateResultsSummary(`${books.length} result${books.length === 1 ? '' : 's'} found.`);
}

function renderReadingList(list) {
  readingListContainer.innerHTML = '';

  if (list.length === 0) {
    readingListContainer.appendChild(createEmptyState({
      title: 'Your reading list is empty',
      message: 'Save books from search results to keep them here.',
    }));
    return;
  }

  list.forEach((book, index) => {
    const card = createBookCard(book, {
      actionText: 'Remove',
      actionName: 'remove',
      showSavedAt: true,
      delay: index * 40,
    });
    readingListContainer.appendChild(card);
  });
}

async function performSearch() {
  const query = currentQuery.trim();
  if (!query) {
    renderSearchResults([]);
    return;
  }

  updateResultsSummary('Searching…');
  try {
    const response = await searchBooks(query, currentSort);
    searchResults = response.docs;
    renderSearchResults(searchResults);
  } catch (error) {
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(createEmptyState({
      title: 'Search failed',
      message: 'Unable to fetch results. Please try again later.',
    }));
    updateResultsSummary('Search failed.');
    console.error(error);
  }
}

const debouncedSearch = debounce(performSearch, 480);

searchInput.addEventListener('input', (event) => {
  currentQuery = event.target.value;
  debouncedSearch();
});

sortSelect.addEventListener('change', (event) => {
  currentSort = event.target.value;
  if (currentQuery.trim()) {
    debouncedSearch();
  }
});

resultsContainer.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action="save"]');
  if (!button) {
    return;
  }

  const bookKey = button.dataset.key;
  const book = searchResults.find((item) => item.key === bookKey);
  if (!book || isSaved(bookKey)) {
    return;
  }

  readingList = addBookToReadingList(book);
  renderReadingList(readingList);
  renderSearchResults(searchResults);
});

readingListContainer.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action="remove"]');
  if (!button) {
    return;
  }

  const bookKey = button.dataset.key;
  readingList = removeBookFromReadingList(bookKey);
  renderReadingList(readingList);
  renderSearchResults(searchResults);
});

renderSearchResults([]);
renderReadingList(readingList);
