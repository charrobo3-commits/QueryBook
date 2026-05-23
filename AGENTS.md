This file guides AI coding agents working on the BookFinder project. Read it fully before making any changes.

Project overview
BookFinder is a single-page book discovery app. Users search for books and authors via the Open Library API and save results to a personal reading list. There is no build step, no framework, and no package manager. Everything runs directly in the browser.

Stack

HTML5 — semantic markup, one index.html entry point
CSS3 — custom properties for theming, no utility frameworks
Vanilla JS (ES2020+) — modules via <script type="module">, no bundler
Open Library Search API — free, no authentication required
Open Library Covers CDN — https://covers.openlibrary.org/b/id/{id}-M.jpg
localStorage — reading list persistence (key: bookfinder-reading-list)

No npm. No node_modules. No TypeScript. No JSX. Do not introduce any of these.

File structure
index.html          # App shell, imports CSS and JS
style.css           # All styles; uses CSS custom properties for the design system
app.js              # Entry point; initialises the app and wires up event listeners
api.js              # Open Library fetch helpers (search, cover URL)
storage.js          # localStorage read/write helpers for the reading list
components/
  bookCard.js       # Returns a DOM node for a single book result
  emptyState.js     # Returns a DOM node for zero-state displays
If you need to add a file, follow this structure. Do not create a src/ directory or add a build config.

Design system
All visual decisions come from CSS custom properties defined in :root inside style.css. Do not hardcode colour values or font sizes anywhere in HTML or JS — reference variables only.
Colour palette — Citrus & Ink
css--color-cream:           #FFF8F0;   /* page background */
--color-peach:           #F5E6D3;   /* card surfaces, metadata chips */
--color-tangerine:       #FF6B35;   /* primary actions, focus rings, badges */
--color-tangerine-dark:  #E85A25;   /* tangerine hover state */
--color-tangerine-light: #FFF0EA;   /* tangerine tint, error backgrounds */
--color-navy:            #1A1A2E;   /* header background, headings, body text */
--color-navy-mid:        #2D2D45;   /* secondary text on light backgrounds */
--color-teal:            #4ECDC4;   /* "Free to read" badge, accents */
--color-teal-light:      #E8F8F7;   /* teal chip background */
--color-teal-dark:       #2A9D96;   /* teal chip text */
--color-border:          rgba(26,26,46,0.12);
--color-border-strong:   rgba(26,26,46,0.22);
--color-muted:           rgba(26,26,46,0.45);
Typography
css--font-display: 'Fraunces', Georgia, serif;   /* headings, book titles */
--font-body:    'DM Sans', system-ui, sans-serif;  /* all UI text */
Both fonts are loaded from Google Fonts in index.html. Do not add other font imports.
Spacing scale
css--space-xs:  4px;
--space-sm:  8px;
--space-md:  16px;
--space-lg:  24px;
--space-xl:  40px;

API usage
All Open Library requests go through api.js. Do not call fetch directly in other files.
Search endpoint
GET https://openlibrary.org/search.json
  ?q={query}
  &fields=key,title,author_name,cover_i,first_publish_year,edition_count,has_fulltext
  &limit=20
  &sort={relevance|new|old|rating}
Always include the fields parameter. Omitting it returns a large payload that slows responses and strains the public API.
The response shape:
json{
  "numFound": 1240,
  "start": 0,
  "docs": [
    {
      "key": "/works/OL27448W",
      "title": "The Lord of the Rings",
      "author_name": ["J. R. R. Tolkien"],
      "cover_i": 258027,
      "first_publish_year": 1954,
      "edition_count": 120,
      "has_fulltext": true
    }
  ]
}
Cover images
https://covers.openlibrary.org/b/id/{cover_i}-M.jpg
Not every book has a cover. Always handle the case where cover_i is absent or the image request fails (onerror on the <img> element). Show a CoverPlaceholder in that case — the first letter of the title on a --color-tangerine-light background.
Debounce
Search input must be debounced at 480 ms before firing a request. The debounce utility lives in app.js.

Reading list
Stored in localStorage under the key bookfinder-reading-list as a JSON-serialised array. Each entry is the full book object from the API response plus a savedAt timestamp (Unix ms).
All reads and writes go through storage.js. Do not call localStorage directly anywhere else.
New saves are prepended (most recently saved first).

DOM conventions

Build DOM nodes with helper functions that return elements — do not use innerHTML for dynamic user data to avoid XSS. Use textContent for any text that comes from the API or user input.
Use innerHTML only for static template structure where no user data is interpolated.
Book cards use data-key attributes (e.g. data-key="/works/OL27448W") to identify books in event delegation.
All interactive state lives in JS — do not store app state in the DOM or data attributes beyond identifiers.


Event handling
Use event delegation on container elements rather than attaching listeners to individual cards. The search results container and reading list container each get one delegated listener for the save/remove button clicks, keyed off data-key.

Animations
Card entry animation is CSS-only:
css@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
Applied to .book-card with staggered animation-delay set via inline style (style="animation-delay: Xms"). Delay increments by 40 ms per card. Do not use JS animation libraries.

What to avoid

Do not introduce a framework (React, Vue, Svelte, etc.)
Do not add a bundler (Vite, Webpack, Parcel, etc.)
Do not add TypeScript
Do not use innerHTML with API-sourced or user-sourced strings
Do not hardcode colours or font names outside style.css
Do not call localStorage outside storage.js
Do not call fetch outside api.js
Do not add external CSS libraries (Bootstrap, Tailwind, etc.)
Do not add a CSS reset beyond a minimal one already in style.css


Checklist before committing

 No new npm install or package.json changes
 All colours reference CSS custom properties
 User/API data set via textContent, not innerHTML
 Search is debounced at 480 ms
 Cover image onerror fallback is handled
 Reading list reads/writes go through storage.js
 New components return DOM nodes from a function in components/
 CSS additions use existing spacing and colour variables
