const API_BASE = 'https://openlibrary.org/search.json';
const FIELDS = 'key,title,author_name,cover_i,first_publish_year,edition_count,has_fulltext';

export async function searchBooks(query, sort = 'relevance') {
  if (!query.trim()) {
    return { numFound: 0, docs: [] };
  }

  const params = new URLSearchParams({
    q: query,
    fields: FIELDS,
    limit: '20',
  });

  if (sort && sort !== 'relevance') {
    params.set('sort', sort);
  }

  const response = await fetch(`${API_BASE}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Search request failed');
  }

  const data = await response.json();
  return {
    numFound: data.numFound ?? 0,
    docs: Array.isArray(data.docs) ? data.docs : [],
  };
}

export function coverUrl(coverId) {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;
}
