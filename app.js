let keywords = {};
let active = new Map();
let pinned = new Map();

/* ---------------- LOAD DATA ---------------- */

async function loadKeywords() {
  const res = await fetch('./content/keywords.json');
  keywords = await res.json();
}

async function loadPage(file) {
  const res = await fetch('./content/' + file);
  const md = await res.text();

  renderBook(md);
}

/* ---------------- RENDER MARKDOWN ---------------- */

function renderBook(md) {
  let html = marked.parse(md);

  html = html.replace(/\[\[kw:(.+?)\]\]/g, (m, key) => {
    return `<span class="kw" data-key="${key}" onclick="onKwClick('${key}')">${key}</span>`;
  });

  document.getElementById('book').innerHTML = html;

  refreshKwState();
}

/* ---------------- KEYWORDS ---------------- */

function onKwClick(key) {
  if (active.has(key)) return;

  const data = keywords[key];
  if (!data) return;

  active.set(key, data);
  renderActive();
  refreshKwState();
}

function refreshKwState() {
  document.querySelectorAll('.kw').forEach(el => {
    const key = el.dataset.key;
    el.classList.toggle('disabled', active.has(key));
  });
}

/* ---------------- SIDEBAR ---------------- */

function renderActive() {
  const container = document.getElementById('active');
  container.innerHTML = '';

  for (const [key, data] of active.entries()) {
    container.appendChild(createCard(key, data, false));
  }
}

function renderPinned() {
  const container = document.getElementById('pinned');
  container.innerHTML = '';

  for (const [key, data] of pinned.entries()) {
    container.appendChild(createCard(key, data, true));
  }
}

function createCard(key, data, isPinned) {
  const div = document.createElement('div');
  div.className = 'card' + (isPinned ? ' pinned' : '');

  div.innerHTML = `
    <div class="card-header">
      <span>${key}</span>
      <span class="pin">${isPinned ? '📌' : '📍'}</span>
    </div>
    <div>${data.description || ''}</div>
  `;

  div.querySelector('.pin').onclick = () => togglePin(key, data);

  return div;
}

/* ---------------- PIN SYSTEM ---------------- */

function togglePin(key, data) {
  if (pinned.has(key)) {
    pinned.delete(key);
  } else {
    pinned.set(key, data);
  }
  savePinned();
  renderPinned();
}

function savePinned() {
  localStorage.setItem('sb_pinned', JSON.stringify([...pinned]));
}

function loadPinned() {
  const raw = localStorage.getItem('sb_pinned');
  if (!raw) return;

  pinned = new Map(JSON.parse(raw));
}

/* ---------------- INIT ---------------- */

(async function init() {
  await loadKeywords();
  loadPinned();
  renderPinned();
  loadPage('book.md');
})();
