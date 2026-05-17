const DATA_URL = 'data/security-acronyms.json';
const THEME_KEY = 'security-acronym-decoder-theme';
const PINNED_KEY = 'security-acronym-decoder-pinned';

const state = {
  acronyms: [],
  query: '',
  categories: new Set(),
  selectedIndex: 0,
  pinned: new Set(),
  statusMessage: '',
};

const searchInput = document.querySelector('#search-input');
const categoryChips = document.querySelector('#category-chips');
const resultCount = document.querySelector('#result-count');
const status = document.querySelector('#status');
const results = document.querySelector('#results');
const emptyState = document.querySelector('#empty-state');
const pinnedList = document.querySelector('#pinned-list');
const pinnedEmpty = document.querySelector('#pinned-empty');
const clearPinsButton = document.querySelector('#clear-pins');
const dailyCard = document.querySelector('#daily-card');
const helpOverlay = document.querySelector('#help-overlay');
const helpButton = document.querySelector('#help-button');
const closeHelp = document.querySelector('#close-help');
const themeToggle = document.querySelector('#theme-toggle');

let syncingHash = false;
let filteredCache = [];

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
  }
  updateThemeToggle();
}

function updateThemeToggle() {
  const theme = document.documentElement.dataset.theme || 'system';
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  themeToggle.innerHTML = `<span aria-hidden="true">${isDark ? '🌙' : '☀️'}</span><span>${theme === 'system' ? 'Theme' : theme === 'dark' ? 'Dark' : 'Light'}</span>`;
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme || 'system';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
  updateThemeToggle();
}

function loadPinned() {
  try {
    const saved = JSON.parse(localStorage.getItem(PINNED_KEY) || '[]');
    state.pinned = new Set(saved);
  } catch {
    state.pinned = new Set();
  }
}

function savePinned() {
  localStorage.setItem(PINNED_KEY, JSON.stringify([...state.pinned]));
}

function normalize(text) {
  return text.toLowerCase();
}

function isSubsequence(query, text) {
  let position = 0;
  for (const char of text) {
    if (char === query[position]) position += 1;
    if (position === query.length) return true;
  }
  return query.length === 0;
}

function categoriesInOrder() {
  return [...new Set(state.acronyms.map((item) => item.category))];
}

function parseHash() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  state.query = params.get('q') || '';
  state.categories = new Set((params.get('category') || '').split(',').filter(Boolean));
  state.selectedIndex = 0;
}

function syncHash() {
  const params = new URLSearchParams();
  if (state.query) params.set('q', state.query);
  if (state.categories.size) params.set('category', [...state.categories].join(','));
  syncingHash = true;
  history.replaceState(null, '', params.toString() ? `#${params.toString()}` : window.location.pathname);
  syncingHash = false;
}

function scoreItem(item, query) {
  if (!query) return 0;
  const acronym = normalize(item.acronym);
  const expansion = normalize(item.expansion);
  if (acronym === query) return 0;
  if (acronym.startsWith(query)) return 1;
  if (expansion.startsWith(query)) return 2;
  if (acronym.includes(query)) return 3;
  if (expansion.includes(query)) return 4;
  return 5;
}

function filteredItems() {
  const query = normalize(state.query.trim());
  return state.acronyms
    .filter((item) => {
      const haystack = normalize(`${item.acronym} ${item.expansion} ${item.definition} ${item.related_acronyms.join(' ')}`);
      const matchesQuery = !query || haystack.includes(query) || isSubsequence(query, normalize(item.acronym)) || isSubsequence(query, normalize(item.expansion));
      const matchesCategory = !state.categories.size || state.categories.has(item.category.toLowerCase());
      return matchesQuery && matchesCategory;
    })
    .sort((left, right) => scoreItem(left, query) - scoreItem(right, query) || left.acronym.localeCompare(right.acronym));
}

function renderChips() {
  categoryChips.innerHTML = '';
  for (const category of categoriesInOrder()) {
    const key = category.toLowerCase();
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = category;
    chip.setAttribute('aria-pressed', String(state.categories.has(key)));
    chip.addEventListener('click', () => {
      if (state.categories.has(key)) state.categories.delete(key); else state.categories.add(key);
      state.selectedIndex = 0;
      state.statusMessage = '';
      syncHash();
      render();
    });
    categoryChips.append(chip);
  }
}

function renderPinned() {
  const pinnedItems = state.acronyms.filter((item) => state.pinned.has(item.acronym)).sort((a, b) => a.acronym.localeCompare(b.acronym));
  pinnedList.innerHTML = '';
  pinnedEmpty.hidden = pinnedItems.length !== 0;
  for (const item of pinnedItems) {
    const card = document.createElement('div');
    card.className = 'pinned-item';
    card.innerHTML = `<strong>${item.acronym}</strong><div class="pinned-meta">${item.expansion}</div>`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'ghost-button';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      state.pinned.delete(item.acronym);
      savePinned();
      render();
    });
    card.append(remove);
    pinnedList.append(card);
  }
}

function pinAcronym(acronym) {
  if (!acronym) return;
  state.pinned.add(acronym);
  savePinned();
  state.statusMessage = `${acronym} pinned to your study list.`;
  render();
}

function openHelp(forceOpen = true) {
  helpOverlay.hidden = !forceOpen;
  if (forceOpen) closeHelp.focus();
}

function dailyEntry() {
  const dateString = new Intl.DateTimeFormat('en-CA').format(new Date());
  const seed = [...dateString].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return state.acronyms[seed % (state.acronyms.length || 1)];
}

function renderDailyCard() {
  const shouldShow = !state.query.trim() && !state.categories.size;
  dailyCard.hidden = !shouldShow;
  if (!shouldShow) return;
  const item = dailyEntry();
  if (!item) return;
  dailyCard.innerHTML = `
    <p class="section-label">Acronym of the day</p>
    <h2>${item.acronym} · ${item.expansion}</h2>
    <p class="definition-copy">${item.definition}</p>
    <p class="definition-context">${item.context}</p>
  `;
}

function renderResults(items) {
  filteredCache = items;
  if (state.selectedIndex >= items.length) state.selectedIndex = Math.max(items.length - 1, 0);
  results.innerHTML = '';

  for (const [index, item] of items.entries()) {
    const article = document.createElement('article');
    article.className = `acronym-card${state.selectedIndex === index ? ' is-active' : ''}`;
    article.tabIndex = state.selectedIndex === index ? 0 : -1;
    article.dataset.index = String(index);
    article.innerHTML = `
      <div class="card-topline">
        <div>
          <div class="acronym-word">${item.acronym}</div>
          <div class="expansion">${item.expansion}</div>
        </div>
        <span class="category-badge">${item.category}</span>
      </div>
      <p class="definition-copy">${item.definition}</p>
      <p class="definition-context">${item.context}</p>
      <div>
        <p class="related-heading">Related acronyms</p>
        <div class="related-list"></div>
      </div>
    `;

    const relatedList = article.querySelector('.related-list');
    for (const related of item.related_acronyms) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'related-chip';
      button.textContent = related;
      button.addEventListener('click', () => {
        state.query = related;
        state.selectedIndex = 0;
        state.statusMessage = '';
        syncHash();
        render();
        searchInput.focus();
      });
      relatedList.append(button);
    }

    const pinButton = document.createElement('button');
    pinButton.type = 'button';
    pinButton.className = 'pin-button';
    pinButton.textContent = state.pinned.has(item.acronym) ? 'Pinned' : 'Pin acronym';
    pinButton.addEventListener('click', () => pinAcronym(item.acronym));
    article.append(pinButton);

    article.addEventListener('focus', () => {
      state.selectedIndex = index;
    });

    results.append(article);
  }
}

function render() {
  renderChips();
  renderPinned();
  renderDailyCard();
  searchInput.value = state.query;
  const items = filteredItems();
  resultCount.textContent = `${items.length} result${items.length === 1 ? '' : 's'} shown`;
  status.textContent = state.statusMessage || `${state.acronyms.length} acronyms loaded.`;
  emptyState.hidden = items.length !== 0 || (!state.query.trim() && !state.categories.size);
  renderResults(items);
}

async function loadAcronyms() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    state.acronyms = payload.acronyms;
    parseHash();
    render();
  } catch (error) {
    status.textContent = 'Failed to load acronyms.';
    resultCount.textContent = '0 results shown';
    console.error(error);
  }
}

searchInput.addEventListener('input', (event) => {
  state.query = event.target.value;
  state.selectedIndex = 0;
  state.statusMessage = '';
  syncHash();
  render();
});

clearPinsButton.addEventListener('click', () => {
  state.pinned.clear();
  state.statusMessage = '';
  savePinned();
  render();
});

themeToggle.addEventListener('click', toggleTheme);
helpButton.addEventListener('click', () => openHelp(true));
closeHelp.addEventListener('click', () => {
  openHelp(false);
  searchInput.focus();
});
helpOverlay.addEventListener('click', (event) => {
  if (event.target === helpOverlay) openHelp(false);
});

window.addEventListener('hashchange', () => {
  if (syncingHash) return;
  parseHash();
  state.statusMessage = '';
  render();
});

window.addEventListener('keydown', (event) => {
  const tagName = document.activeElement?.tagName;
  const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName);

  if (event.key === '?' && !isTyping) {
    event.preventDefault();
    openHelp(true);
    return;
  }

  if (event.key === 'Escape' && !helpOverlay.hidden) {
    event.preventDefault();
    openHelp(false);
    searchInput.focus();
    return;
  }

  if (event.key === '/' && !isTyping) {
    event.preventDefault();
    searchInput.focus();
    searchInput.select();
    return;
  }

  if (isTyping || !filteredCache.length) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    state.selectedIndex = Math.min(state.selectedIndex + 1, filteredCache.length - 1);
    render();
    results.querySelector(`[data-index="${state.selectedIndex}"]`)?.focus();
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    state.selectedIndex = Math.max(state.selectedIndex - 1, 0);
    render();
    results.querySelector(`[data-index="${state.selectedIndex}"]`)?.focus();
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    pinAcronym(filteredCache[state.selectedIndex]?.acronym);
  }
});

loadTheme();
loadPinned();
loadAcronyms();
