import { coverUrl } from '../api.js';

function createCoverElement(title, coverId) {
  if (!coverId) {
    const fallback = document.createElement('div');
    fallback.className = 'cover-fallback';
    fallback.textContent = title.charAt(0).toUpperCase();
    return fallback;
  }

  const image = document.createElement('img');
  image.className = 'book-cover';
  image.src = coverUrl(coverId);
  image.alt = `${title} cover`;
  image.loading = 'lazy';
  image.onerror = () => {
    const placeholder = document.createElement('div');
    placeholder.className = 'cover-fallback';
    placeholder.textContent = title.charAt(0).toUpperCase();
    image.replaceWith(placeholder);
  };

  return image;
}

function createMetaChip(content) {
  const chip = document.createElement('span');
  chip.className = 'book-meta';
  chip.textContent = content;
  return chip;
}

export function createBookCard(book, options = {}) {
  const { actionText, actionName, showSavedAt = false, isSaved = false, delay = 0 } = options;

  const card = document.createElement('article');
  card.className = 'book-card';
  card.dataset.key = book.key;
  card.style.animationDelay = `${delay}ms`;

  const cover = createCoverElement(book.title, book.cover_i);
  const details = document.createElement('div');
  details.className = 'book-details';

  const title = document.createElement('h3');
  title.className = 'book-title';
  title.textContent = book.title;

  const authors = document.createElement('p');
  authors.className = 'book-authors';
  authors.textContent = Array.isArray(book.author_name) ? book.author_name.join(', ') : 'Unknown author';

  const meta = document.createElement('div');
  meta.className = 'book-meta';

  if (book.first_publish_year) {
    meta.append(createMetaChip(String(book.first_publish_year)));
  }

  if (book.edition_count) {
    meta.append(createMetaChip(`${book.edition_count} editions`));
  }

  if (book.has_fulltext) {
    const badge = document.createElement('span');
    badge.className = 'book-badge';
    badge.textContent = 'Free to read';
    meta.append(badge);
  }

  const actions = document.createElement('div');
  actions.className = 'book-actions';

  if (actionText) {
    const button = document.createElement('button');
    button.className = 'action-button';
    if (isSaved) {
      button.disabled = true;
      button.classList.add('secondary');
    }
    button.type = 'button';
    button.dataset.key = book.key;
    button.dataset.action = actionName;
    button.textContent = actionText;
    actions.append(button);
  }

  if (showSavedAt && book.savedAt) {
    const savedAt = document.createElement('p');
    savedAt.className = 'book-meta';
    savedAt.textContent = `Saved ${new Date(book.savedAt).toLocaleDateString()}`;
    actions.append(savedAt);
  }

  details.append(title, authors, meta, actions);
  card.append(cover, details);
  return card;
}
