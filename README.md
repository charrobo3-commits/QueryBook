# QueryBook
A clean, modern book discovery app built with React. Search millions of books, explore authors, and save titles to a personal reading list — all powered by the free Open Library API.

Features

Live search — debounced search as you type, querying title, author, ISBN, and more
Sort options — order results by relevance, newest, oldest, or top rated
Book covers — fetched from the Open Library Covers CDN, with a graceful fallback placeholder
Rich metadata — first publish year, edition count, and free-to-read availability shown on each card
Personal reading list — save and remove books with one click; list persists across sessions
List filtering — search within your saved books by title or author
Staggered animations — cards animate in with a subtle fade-up on each search


Tech stack
ConcernChoiceFrameworkReact (functional components + hooks)Data sourceOpen Library Search APICover imagesOpen Library Covers APIPersistencewindow.storage (key-value, session-scoped)FontsFraunces + DM Sans via Google FontsStylingInline styles with a shared color token object

Color palette — Citrus & Ink
TokenHexUsageCream#FFF8F0App backgroundNavy#1A1A2EHeader, titles, primary textTangerine#FF6B35Primary actions, focus rings, badgesPeach#F5E6D3Metadata chips (year, editions)Teal#4ECDC4"Free to read" badge, header accent

Project structure
book-finder.jsx        # Single-file React component (self-contained)
README.md              # This file
The entire app lives in one .jsx file, organised into four components:

BookFinder — root component; owns all state and data-fetching logic
BookCard — renders a single search result or saved book
CoverPlaceholder — fallback when a cover image is unavailable or fails to load
EmptyState — reusable empty/zero-state display


How it works
Search
Queries are sent to the Open Library Search API with a 480 ms debounce to avoid hammering the endpoint on every keystroke. Only the fields the UI actually needs are requested via the fields parameter, keeping response payloads small:
https://openlibrary.org/search.json
  ?q=<query>
  &fields=key,title,author_name,cover_i,first_publish_year,edition_count,has_fulltext
  &limit=20
  &sort=<relevance|new|old|rating>
Reading list
The reading list is stored via window.storage under the key reading-list-v2 as a JSON array. Books are prepended (newest saved first) and the list is re-persisted on every toggle.

API notes
The Open Library Search API is free and requires no authentication or API key. A few things worth knowing:

Results are works (a canonical book record), not individual editions. One work may have hundreds of editions.
The fields parameter is strongly recommended — omitting it returns a large default payload that can slow responses.
There is no official rate limit documented, but the API is a shared public resource; the debounce helps be a good citizen.
Cover images are served from a separate CDN (covers.openlibrary.org) and may not exist for every book — the app handles missing covers gracefully.


Possible extensions

Author detail pages using the Authors API
"Read" / "Want to read" / "Currently reading" status tags on saved books
Export reading list as CSV or JSON
Subject/genre filtering via the Subjects API
Dark mode toggle


License
Open Library data is provided under the Open Data Commons Open Database License (ODbL). This project's source code is MIT licensed.
