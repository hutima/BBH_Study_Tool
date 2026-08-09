// Lesson 0 — Alphabet (0A) + Vowel marks (0B) practice (Phase 2 PR E,
// user-requested addendum; split into two decks by PR H punch-list item 3).
// A lightweight, standalone flip/shuffle practice pair, COMPLETELY separate
// from the vocabulary flashcard machinery: own overlay, own module-local
// view state, own runtime.alphabet subtree (schemaVersion 1,
// { letters: {known,seen}, vowels: {known,seen} }). No SRS, no XP/streaks/
// achievements, never touches runtime.selectedKeys/presets, and is never
// folded into vocab stats or export vocab counts — see
// docs/bbh-conversion-plan.md "Lesson 0 — Alphabet practice" and "PR H
// punch-list item 3" addenda.
//
// Hard boundary: this module imports NOTHING from other app modules or
// utils — same isolation rule as js/ui/grammar.js and js/ui/reader.js (see
// their header comments). Everything it needs (the live runtime.alphabet
// reference, persistence) comes in via configureAlphabet(deps), the same
// "runtime dependency injection" pattern every other UI module uses.
//
// Reads its letter/vowel inventory from window.BBH_ALPHABET (classic script
// global, same idiom as window.SETS / window.BBH_PARSING / window.BBH_GRAMMAR
// / window.BBH_READER — see js/data/bbh_alphabet.js's header).
//
// Unaffected by the vocab display toggles (pointed/unpointed, transliteration
// show/hide, required-only): letters/vowels are rendered exactly as
// authored, always pointed, and this module never reads
// runtime.showPoints / runtime.showTranslit / runtime.requiredOnly.

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

// ─── Grapheme-cluster splitting (consonant + its trailing combining marks)
// SYNC: tools/gen_bbh_alphabet_data.mjs has the authoritative copy of this
// same split (used at generation time to compute each vowel's stored
// clusterIndex) — keep the two in sync if either changes. This module can't
// import that generator (no cross-module imports allowed here), so the
// logic is duplicated deliberately.
const CONSONANT_RE = /[\u05D0-\u05EA]/;
const MARK_RE = /[\u0591-\u05AF\u05B0-\u05BC\u05C1\u05C2\u05C7]/;
function splitHebrewClusters(word) {
  const clusters = [];
  let current = null;
  for (const ch of String(word)) {
    if (CONSONANT_RE.test(ch)) {
      current = { base: ch, marks: '' };
      clusters.push(current);
    } else if (current && MARK_RE.test(ch)) {
      current.marks += ch;
    } else {
      current = null;
    }
  }
  return clusters;
}

function renderClusterSpans(word, highlightIdx) {
  const clusters = splitHebrewClusters(word);
  if (!clusters.length) return escapeHtml(word);
  return clusters
    .map((cl, i) => {
      const text = escapeHtml(cl.base + cl.marks);
      return i === highlightIdx
        ? `<span class="alphabet-vowel-cluster-hit">${text}</span>`
        : `<span>${text}</span>`;
    })
    .join('');
}

// ─── Deck selection ─────────────────────────────────────────────────────
// 'letters' = Lesson 0A Alphabet (existing 23-letter deck); 'vowels' =
// Lesson 0B Vowel marks (12-entry deck, PR H item 3). Both share this one
// overlay/module — only the data source, state subtree key, and a few
// render/label details differ.
let deckKind = 'letters';

function getLetters() {
  return (window.BBH_ALPHABET && Array.isArray(window.BBH_ALPHABET.letters)) ? window.BBH_ALPHABET.letters : [];
}
function getVowels() {
  return (window.BBH_ALPHABET && Array.isArray(window.BBH_ALPHABET.vowels)) ? window.BBH_ALPHABET.vowels : [];
}
function getShevaRules() {
  return (window.BBH_ALPHABET && Array.isArray(window.BBH_ALPHABET.shevaRules)) ? window.BBH_ALPHABET.shevaRules : [];
}
function getItems() {
  return deckKind === 'vowels' ? getVowels() : getLetters();
}
function itemId(item) {
  return String(item.order);
}
// The live state subtree for the active deck — { known, seen } — a
// reference into runtime.alphabet.letters or runtime.alphabet.vowels.
function getDeckState() {
  const state = host.getState();
  if (!state) return null;
  if (deckKind === 'vowels') {
    if (!state.vowels || typeof state.vowels !== 'object') state.vowels = { known: {}, seen: {} };
    return state.vowels;
  }
  if (!state.letters || typeof state.letters !== 'object') state.letters = { known: {}, seen: {} };
  return state.letters;
}

// ─── Module-local (non-persisted) view state ───────────────────────────────
// The current shuffled walk order (array of indices into getItems()), the
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
  const idxs = getItems().map((_, i) => i);
  for (let i = idxs.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = idxs[i];
    idxs[i] = idxs[j];
    idxs[j] = tmp;
  }
  order = idxs;
}

function ensureOrder() {
  const items = getItems();
  if (!order.length || order.length !== items.length) shuffleOrder();
  if (posIdx >= order.length) posIdx = 0;
}

function currentItem() {
  const items = getItems();
  ensureOrder();
  const idx = order[posIdx];
  return (idx != null && items[idx]) ? items[idx] : null;
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

function renderLetterCardFace(letter, state) {
  const id = itemId(letter);
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

function renderVowelCardFace(vowel, state) {
  const id = itemId(vowel);
  const isKnown = !!(state && state.known && state.known[id]);
  const exampleHtml = vowel.example
    ? `<div class="alphabet-vowel-example hebrew-text" dir="rtl" lang="he">${renderClusterSpans(vowel.example.word, vowel.example.clusterIndex)}</div>`
    : '<div class="alphabet-vowel-example-none">No vocab example yet — shown on its printed carrier only</div>';
  const front = `
    <div class="alphabet-glyph-row hebrew-text" dir="rtl" lang="he">
      <span class="alphabet-glyph alphabet-vowel-glyph">${escapeHtml(vowel.sign)}</span>
    </div>
    ${exampleHtml}
    <div class="alphabet-front-hint">Tap the card to reveal the name and sound</div>`;
  const back = flipped ? `
    <div class="alphabet-back">
      <div class="alphabet-name-row">
        <span class="alphabet-name-hebrew hebrew-text" dir="rtl" lang="he">${escapeHtml(vowel.nameHebrew)}</span>
        <span class="alphabet-name-english">${escapeHtml(vowel.nameEnglish)}</span>
      </div>
      <div class="alphabet-vowel-meta-row">
        <span class="alphabet-vowel-meta-label">Sound class</span>
        <span class="alphabet-vowel-meta-value">${escapeHtml(vowel.soundClass)}</span>
      </div>
      <div class="alphabet-vowel-meta-row">
        <span class="alphabet-vowel-meta-label">Length</span>
        <span class="alphabet-vowel-meta-value">${escapeHtml(vowel.length)}</span>
      </div>
      <div class="alphabet-sound">${escapeHtml(vowel.sound)}</div>
      ${vowel.notes ? `<div class="alphabet-notes">${escapeHtml(vowel.notes)}</div>` : ''}
    </div>` : '';
  return `
    <div class="alphabet-card${flipped ? ' alphabet-card-flipped' : ''}${isKnown ? ' alphabet-card-known' : ''}" role="button" tabindex="0" onclick="alphabetFlip()">
      ${front}
      ${back}
    </div>`;
}

function renderCardFace(item, state) {
  if (!item) {
    return `<div class="alphabet-empty-state">${deckKind === 'vowels' ? 'Vowel' : 'Alphabet'} data isn&rsquo;t available yet.</div>`;
  }
  return deckKind === 'vowels' ? renderVowelCardFace(item, state) : renderLetterCardFace(item, state);
}

function renderProgressLine(state) {
  const total = getItems().length;
  const known = state ? Object.keys(state.known || {}).filter((id) => state.known[id]).length : 0;
  return `${known} of ${total} marked known`;
}

function renderShevaFooter() {
  const el = document.getElementById('alphabetShevaFooter');
  if (!el) return;
  if (deckKind !== 'vowels') {
    el.style.display = 'none';
    el.innerHTML = '';
    return;
  }
  const rules = getShevaRules();
  el.style.display = rules.length ? '' : 'none';
  el.innerHTML = rules.length
    ? `
      <div class="alphabet-sheva-footer-title">Shəva rules — quick reference</div>
      <ul class="alphabet-sheva-footer-list">
        ${rules.map((r) => `<li dir="auto">${escapeHtml(r.rule)}</li>`).join('')}
      </ul>`
    : '';
}

function render() {
  const state = getDeckState();
  const cardArea = document.getElementById('alphabetCardArea');
  const progressEl = document.getElementById('alphabetProgressLine');
  const titleEl = document.getElementById('alphabetOverlayTitle');
  const labelEl = document.getElementById('alphabetOverlayLabel');
  if (cardArea) cardArea.innerHTML = renderCardFace(currentItem(), state);
  if (progressEl) progressEl.textContent = renderProgressLine(state);
  if (titleEl) titleEl.textContent = deckKind === 'vowels' ? 'Vowel marks practice' : 'Alphabet practice';
  if (labelEl) labelEl.textContent = deckKind === 'vowels' ? 'Lesson 0B' : 'Lesson 0A';
  renderShevaFooter();
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

// `kind` is 'letters' (0A, default) or 'vowels' (0B).
export function openAlphabetOverlay(kind) {
  const el = document.getElementById('alphabetOverlay');
  if (!el) return;
  deckKind = kind === 'vowels' ? 'vowels' : 'letters';
  order = [];
  posIdx = 0;
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
  if (!currentItem()) return;
  flipped = !flipped;
  render();
}

function markCurrent(gotIt) {
  const item = currentItem();
  const state = getDeckState();
  if (!item || !state) return;
  const id = itemId(item);
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
  const label = deckKind === 'vowels' ? 'Lesson 0B vowel marks' : 'Lesson 0A alphabet';
  if (!confirm(`Reset all ${label} progress? This clears every ${deckKind === 'vowels' ? 'vowel' : 'letter'} marked known.`)) return;
  const state = getDeckState();
  if (!state) return;
  state.known = {};
  state.seen = {};
  host.saveState();
  render();
}
