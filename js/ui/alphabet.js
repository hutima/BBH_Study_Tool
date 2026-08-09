// Lesson 0 — Alphabet practice (Phase 2 PR E, user-requested addendum).
// A lightweight, standalone flip/shuffle practice deck for the 23 Hebrew
// consonants, COMPLETELY separate from the vocabulary flashcard machinery:
// own overlay, own module-local view state, own runtime.alphabet subtree
// (schemaVersion 1, { known: {}, seen: {} }). No SRS, no XP/streaks/
// achievements, never touches runtime.selectedKeys/presets, and is never
// folded into vocab stats or export vocab counts — see
// docs/bbh-conversion-plan.md "Lesson 0 — Alphabet practice" addendum.
//
// Hard boundary: this module imports NOTHING from other app modules or
// utils — same isolation rule as js/ui/grammar.js and js/ui/reader.js (see
// their header comments). Everything it needs (the live runtime.alphabet
// reference, persistence) comes in via configureAlphabet(deps), the same
// "runtime dependency injection" pattern every other UI module uses.
//
// Reads its letter inventory from window.BBH_ALPHABET (classic script
// global, same idiom as window.SETS / window.BBH_PARSING / window.BBH_GRAMMAR
// / window.BBH_READER — see js/data/bbh_alphabet.js's header).
//
// Unaffected by the vocab display toggles (pointed/unpointed, transliteration
// show/hide, required-only): letters are rendered exactly as authored,
// always pointed, and this module never reads runtime.showPoints /
// runtime.showTranslit / runtime.requiredOnly.

// ─── Host (runtime dependency injection) ───────────────────────────────────
let host = {
  // Returns the LIVE runtime.alphabet object (mutated in place, same
  // pattern every other UI module uses for its slice of runtime.*).
  getState: () => null,
  saveState: () => {}
};

export function configureAlphabet(deps) {
  host = { ...host, ...deps };
}

// ─── Small local utilities (no imports allowed) ────────────────────────────
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getLetters() {
  return (window.BBH_ALPHABET && Array.isArray(window.BBH_ALPHABET.letters)) ? window.BBH_ALPHABET.letters : [];
}

function letterId(letter) {
  return String(letter.order);
}

// ─── Module-local (non-persisted) view state ───────────────────────────────
// The current shuffled walk order (array of indices into getLetters()), the
// position within it, and whether the current card is flipped. None of this
// is persisted — reopening the overlay always starts a fresh shuffle, same
// idiom as js/ui/reader.js's openPassageId/activeTokenIdx being session-local.
let order = [];
let posIdx = 0;
let flipped = false;

// Never Math.random for anything PERSISTED (CLAUDE.md-style project rule) —
// this shuffle order is intentionally transient/non-persisted view state
// only (never written to runtime.alphabet or saved), so a plain Fisher-Yates
// with Math.random is fine here, same as the base deck shuffle elsewhere in
// the app uses for its own non-persisted-seed shuffles.
function shuffleOrder() {
  const idxs = getLetters().map((_, i) => i);
  for (let i = idxs.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = idxs[i];
    idxs[i] = idxs[j];
    idxs[j] = tmp;
  }
  order = idxs;
}

function ensureOrder() {
  const letters = getLetters();
  if (!order.length || order.length !== letters.length) shuffleOrder();
  if (posIdx >= order.length) posIdx = 0;
}

function currentLetter() {
  const letters = getLetters();
  ensureOrder();
  const idx = order[posIdx];
  return (idx != null && letters[idx]) ? letters[idx] : null;
}

function advance() {
  if (!order.length) return;
  posIdx = (posIdx + 1) % order.length;
  flipped = false;
}

// ─── Rendering ──────────────────────────────────────────────────────────
function badgeHtml(label, on) {
  return `<span class="alphabet-badge${on ? ' alphabet-badge-on' : ' alphabet-badge-off'}">${escapeHtml(label)}: ${on ? 'Yes' : 'No'}</span>`;
}

function renderCardFace(letter, state) {
  if (!letter) {
    return '<div class="alphabet-empty-state">Alphabet data isn&rsquo;t available yet.</div>';
  }
  const id = letterId(letter);
  const isKnown = !!(state && state.known && state.known[id]);
  const finalHtml = letter.finalForm
    ? `<span class="alphabet-final-form" dir="rtl" lang="he" title="Final form">${escapeHtml(letter.finalForm)}</span>`
    : '';
  const front = `
    <div class="alphabet-glyph-row hebrew-text" dir="rtl" lang="he">
      <span class="alphabet-glyph">${escapeHtml(letter.letter)}</span>
      ${finalHtml}
    </div>
    <div class="alphabet-front-hint">Tap the card to reveal the name and sound</div>`;
  const back = flipped ? `
    <div class="alphabet-back">
      <div class="alphabet-name-row">
        <span class="alphabet-name-hebrew hebrew-text" dir="rtl" lang="he">${escapeHtml(letter.nameHebrew)}</span>
        <span class="alphabet-name-english">${escapeHtml(letter.nameEnglish)}</span>
      </div>
      <div class="alphabet-sound">${escapeHtml(letter.sound)}</div>
      <div class="alphabet-badge-row">
        ${badgeHtml('Begadkefat', !!letter.begadkefat)}
        ${badgeHtml('Guttural', !!letter.guttural)}
      </div>
      ${letter.notes ? `<div class="alphabet-notes">${escapeHtml(letter.notes)}</div>` : ''}
    </div>` : '';
  return `
    <div class="alphabet-card${flipped ? ' alphabet-card-flipped' : ''}${isKnown ? ' alphabet-card-known' : ''}" role="button" tabindex="0" onclick="alphabetFlip()">
      ${front}
      ${back}
    </div>`;
}

function renderProgressLine(state) {
  const total = getLetters().length;
  const known = state ? Object.keys(state.known || {}).filter((id) => state.known[id]).length : 0;
  return `${known} of ${total} marked known`;
}

function render() {
  const state = host.getState();
  const cardArea = document.getElementById('alphabetCardArea');
  const progressEl = document.getElementById('alphabetProgressLine');
  if (cardArea) cardArea.innerHTML = renderCardFace(currentLetter(), state);
  if (progressEl) progressEl.textContent = renderProgressLine(state);
}

// ─── Public entry point ───────────────────────────────────────────────────
export function renderAlphabetOverlay() {
  render();
}

// ─── Overlay open/close (this module owns its own overlay, mirroring the
// existing consent-overlay pattern index.html already uses elsewhere) ─────
export function isAlphabetOverlayOpen() {
  const el = document.getElementById('alphabetOverlay');
  return !!el && el.classList.contains('show');
}

export function openAlphabetOverlay() {
  const el = document.getElementById('alphabetOverlay');
  if (!el) return;
  ensureOrder();
  flipped = false;
  el.classList.add('show');
  el.setAttribute('aria-hidden', 'false');
  render();
}

export function closeAlphabetOverlay() {
  const el = document.getElementById('alphabetOverlay');
  if (!el) return;
  el.classList.remove('show');
  el.setAttribute('aria-hidden', 'true');
}

// ─── Click/change handlers (wired onto GLOBAL_CLICK_HANDLERS by main.js) ──
export function alphabetFlip() {
  if (!currentLetter()) return;
  flipped = !flipped;
  render();
}

function markCurrent(gotIt) {
  const letter = currentLetter();
  const state = host.getState();
  if (!letter || !state) return;
  const id = letterId(letter);
  if (!state.known || typeof state.known !== 'object') state.known = {};
  if (!state.seen || typeof state.seen !== 'object') state.seen = {};
  state.seen[id] = (Number.isFinite(state.seen[id]) ? state.seen[id] : 0) + 1;
  if (gotIt) state.known[id] = true;
  else delete state.known[id];
  host.saveState();
  advance();
  render();
}

export function alphabetMarkAgain() {
  markCurrent(false);
}

export function alphabetMarkGotIt() {
  markCurrent(true);
}

export function alphabetShuffle() {
  shuffleOrder();
  posIdx = 0;
  flipped = false;
  render();
}

export function alphabetResetProgress() {
  if (!confirm('Reset all Lesson 0 alphabet progress? This clears every letter marked known.')) return;
  const state = host.getState();
  if (!state) return;
  state.known = {};
  state.seen = {};
  host.saveState();
  render();
}
