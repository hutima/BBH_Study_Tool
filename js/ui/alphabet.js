// Lesson 1 (alphabet) / Lesson 2 (vowel marks) practice, PLUS a combined
// Lessons 1-2 deck (task #18). Displayed to users as "Lesson 1 · Alphabet" /
// "Lesson 2 · Vowel marks" / "Lessons 1-2 · Letters + vowels (combined)"
// (matching the textbook's own Lesson 1 "The Consonants" / Lesson 2 "The
// Vowels") — internal naming (module/file name, deckKind
// 'letters'/'vowels'/'combined', runtime.alphabet.letters/vowels, ids) is
// unchanged.
//
// A lightweight, standalone flip/shuffle practice trio, COMPLETELY separate
// from the vocabulary flashcard machinery: own in-flow section (task #18 —
// see below), own module-local view state, own runtime.alphabet subtree
// (schemaVersion 1, { letters: {known,seen}, vowels: {known,seen} } — the
// combined deck reuses these SAME two maps, keyed by each card's own kind,
// rather than adding a third map). No SRS, no XP/streaks/achievements,
// never touches runtime.selectedKeys/presets, and is never folded into
// vocab stats or export vocab counts — see docs/bbh-conversion-plan.md
// "Lesson 0 — Alphabet practice", "PR H punch-list item 3", and task #18's
// addendum.
//
// ─── Task #18: overlay → in-flow section, NOT a new studyMode ─────────────
// Through task #16 this module owned a standalone modal overlay
// (#alphabetOverlay). Task #18 converts it to an in-flow section
// (#alphabetSection) shown/hidden by the SAME syncLayoutVisibility()
// mechanism js/app/main.js already uses for #parsingSection/#grammarSection/
// #readerSection — but WITHOUT adding a fourth studyMode value. Deliberate
// choice: this module keeps its own module-local `sectionActive` flag
// (exposed via isAlphabetSectionActive()) instead of runtime.studyMode
// ever becoming 'alphabet'. runtime.studyMode stays 'vocab' the entire
// time a practice deck is open — main.js's syncLayoutVisibility() checks
// isAlphabetSectionActive() as an override INSIDE its vocab branch (not a
// new top-level mode branch), so none of the vocab mode/state machinery
// (setStudyMode, splitSelection, spacedByMode, deck rebuild, …) needs to
// know this section exists. Opening a deck (openAlphabetSection) and
// closing it (closeAlphabetSection) only flip that local flag + this
// module's own view state; main.js's pickAlphabetDeck()/
// alphabetBackToVocab() wrappers call syncLayoutVisibility() afterward to
// actually swap what's on screen. The old overlay open/close exports
// (isAlphabetOverlayOpen/openAlphabetOverlay/closeAlphabetOverlay) are kept
// below, UNCHANGED, as inert no-ops now that #alphabetOverlay no longer
// exists in index.html (they already null-check `if (!el) return`) — see
// the CLAUDE.md "ES-module imports are NOT cache-busted" rule: an existing
// shipped module's export list must never drop a name an older cached
// main.js might still import during a service-worker update window.
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

// ─── Grapheme-cluster splitting (task #16 — the addendum's root-cause
// hypothesis for the "misplaced vowel marks" report was that span-splitting
// could orphan a combining mark from its base; the confirmed cause turned
// out to be a highlight decoration colliding visually with sub-linear
// niqqud (see the .alphabet-vowel-cluster-hit comment in styles.css), but
// this module still switches to true Unicode grapheme segmentation per the
// addendum, so a span can never split mid-grapheme in ANY browser/font, now
// or in the future.
// Uses the platform's Unicode grapheme-cluster algorithm (Intl.Segmenter)
// when available — this is what correctly keeps a base consonant fused
// with ALL of its trailing combining marks (niqqud, dagesh, cantillation,
// sin/shin dots) as one indivisible unit, and also keeps every OTHER
// character (spaces, maqaf, parens, …) as its own cluster instead of the
// old custom split's behavior of silently DROPPING any character that was
// neither a consonant nor a recognized mark. Falls back to an equivalent
// regex for browsers without Intl.Segmenter.
// SYNC: tools/gen_bbh_alphabet_data.mjs has the authoritative copy of this
// same split (used at generation time to compute each vowel's stored
// clusterIndex) — keep the two in sync if either changes. This module
// can't import that generator (no cross-module imports allowed here), so
// the logic is duplicated deliberately.
const HEBREW_SEGMENTER = (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function')
  ? (() => { try { return new Intl.Segmenter('he', { granularity: 'grapheme' }); } catch (e) { return null; } })()
  : null;
// Fallback: a Hebrew consonant plus any trailing combining marks (full
// niqqud/cantillation/dagesh block, U+0591-U+05C7) as one cluster, OR any
// single other character (space, maqaf, punctuation, Latin, …) as its own
// one-character cluster — so nothing is ever silently dropped.
const GRAPHEME_FALLBACK_RE = /[\u05D0-\u05EA][\u0591-\u05C7]*|[\s\S]/gu;
function splitGraphemes(word) {
  const str = String(word ?? '');
  if (!str) return [];
  if (HEBREW_SEGMENTER) return Array.from(HEBREW_SEGMENTER.segment(str), (s) => s.segment);
  return str.match(GRAPHEME_FALLBACK_RE) || [];
}

function renderClusterSpans(word, highlightIdx) {
  const clusters = splitGraphemes(word);
  if (!clusters.length) return escapeHtml(word);
  return clusters
    .map((cl, i) => {
      const text = escapeHtml(cl);
      return i === highlightIdx
        ? `<span class="alphabet-vowel-cluster-hit">${text}</span>`
        : `<span>${text}</span>`;
    })
    .join('');
}

// ─── Deck selection ─────────────────────────────────────────────────────
// 'letters' = Lesson 1 Alphabet (23-letter deck); 'vowels' = Lesson 2 Vowel
// marks (12-entry deck); 'combined' = Lessons 1-2, all 35 cards shuffled
// together (task #18 item 3). All three share this one section/module —
// only the data source(s), state subtree key(s), and a few render/label
// details differ.
let deckKind = 'letters';

// Whether the in-flow #alphabetSection is currently the thing showing in
// place of the vocab card area (task #18 item 1). Owned entirely by this
// module; main.js reads it via isAlphabetSectionActive() from inside
// syncLayoutVisibility()'s vocab branch — see the header comment above.
let sectionActive = false;

function getLetters() {
  return (window.BBH_ALPHABET && Array.isArray(window.BBH_ALPHABET.letters)) ? window.BBH_ALPHABET.letters : [];
}
function getVowels() {
  return (window.BBH_ALPHABET && Array.isArray(window.BBH_ALPHABET.vowels)) ? window.BBH_ALPHABET.vowels : [];
}
function getShevaRules() {
  return (window.BBH_ALPHABET && Array.isArray(window.BBH_ALPHABET.shevaRules)) ? window.BBH_ALPHABET.shevaRules : [];
}

// Every entry in the CURRENT deck's walk order, tagged with its own kind
// ('letters' or 'vowels') so a combined-deck card always knows which
// runtime.alphabet map (and which card-face renderer) it belongs to,
// independent of the deck-level `deckKind`.
function letterEntries() {
  return getLetters().map((item) => ({ kind: 'letters', item }));
}
function vowelEntries() {
  return getVowels().map((item) => ({ kind: 'vowels', item }));
}
function getEntries() {
  if (deckKind === 'vowels') return vowelEntries();
  if (deckKind === 'combined') return letterEntries().concat(vowelEntries());
  return letterEntries();
}
function itemId(item) {
  return String(item.order);
}

// The live state subtree for a given KIND ('letters'/'vowels') — { known,
// seen } — a reference into runtime.alphabet.letters or runtime.alphabet.
// vowels. Takes the kind explicitly (not the deck-level `deckKind`) so the
// combined deck can resolve each card to the correct map regardless of
// which deck is currently open (task #18 item 3: "known-marking writes to
// the SAME letters/vowels maps by item kind — no third map").
function getDeckStateForKind(kind) {
  const state = host.getState();
  if (!state) return null;
  if (kind === 'vowels') {
    if (!state.vowels || typeof state.vowels !== 'object') state.vowels = { known: {}, seen: {} };
    return state.vowels;
  }
  if (!state.letters || typeof state.letters !== 'object') state.letters = { known: {}, seen: {} };
  return state.letters;
}

// ─── Module-local (non-persisted) view state ───────────────────────────────
// The current shuffled walk order (array of indices into getEntries()), the
// position within it, and whether the current card is flipped. None of this
// is persisted — (re)opening a deck always starts a fresh shuffle, same
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
  const idxs = getEntries().map((_, i) => i);
  for (let i = idxs.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = idxs[i];
    idxs[i] = idxs[j];
    idxs[j] = tmp;
  }
  order = idxs;
}

function ensureOrder() {
  const entries = getEntries();
  if (!order.length || order.length !== entries.length) shuffleOrder();
  if (posIdx >= order.length) posIdx = 0;
}

function currentEntry() {
  const entries = getEntries();
  ensureOrder();
  const idx = order[posIdx];
  return (idx != null && entries[idx]) ? entries[idx] : null;
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
      <div class="alphabet-vowel-meta-grid">
        <div class="alphabet-vowel-meta-cell">
          <span class="alphabet-vowel-meta-label">Sound class</span>
          <span class="alphabet-vowel-meta-value">${escapeHtml(vowel.soundClass)}</span>
        </div>
        <div class="alphabet-vowel-meta-cell">
          <span class="alphabet-vowel-meta-label">Length</span>
          <span class="alphabet-vowel-meta-value">${escapeHtml(vowel.length)}</span>
        </div>
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

function renderCardFace(entry) {
  if (!entry) {
    const label = deckKind === 'vowels' ? 'Vowel' : deckKind === 'combined' ? 'Alphabet/vowel' : 'Alphabet';
    return `<div class="alphabet-empty-state">${label} data isn&rsquo;t available yet.</div>`;
  }
  const state = getDeckStateForKind(entry.kind);
  return entry.kind === 'vowels' ? renderVowelCardFace(entry.item, state) : renderLetterCardFace(entry.item, state);
}

function countKnown(state) {
  if (!state || !state.known) return 0;
  return Object.keys(state.known).filter((id) => state.known[id]).length;
}

function renderProgressLine() {
  if (deckKind === 'combined') {
    const totalL = getLetters().length;
    const totalV = getVowels().length;
    const known = countKnown(getDeckStateForKind('letters')) + countKnown(getDeckStateForKind('vowels'));
    return `${known} of ${totalL + totalV} marked known`;
  }
  const total = getEntries().length;
  const known = countKnown(getDeckStateForKind(deckKind === 'vowels' ? 'vowels' : 'letters'));
  return `${known} of ${total} marked known`;
}

function renderShevaFooter() {
  const el = document.getElementById('alphabetShevaFooter');
  if (!el) return;
  // Shown for the vowels deck AND the combined deck (both contain vowel
  // cards this quick-reference is useful for); hidden for the pure letters
  // deck, unchanged from pre-task-#18 behavior.
  if (deckKind === 'letters') {
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
  const cardArea = document.getElementById('alphabetCardArea');
  const progressEl = document.getElementById('alphabetProgressLine');
  const titleEl = document.getElementById('alphabetSectionTitle');
  const labelEl = document.getElementById('alphabetSectionLabel');
  if (cardArea) cardArea.innerHTML = renderCardFace(currentEntry());
  if (progressEl) progressEl.textContent = renderProgressLine();
  if (titleEl) {
    titleEl.textContent = deckKind === 'vowels' ? 'Vowel marks practice'
      : deckKind === 'combined' ? 'Letters + vowels practice'
      : 'Alphabet practice';
  }
  // Display-only labels: these decks ARE the textbook's own Lesson 1 (The
  // Consonants) and Lesson 2 (The Vowels) content, so they're labeled
  // "Lesson 1"/"Lesson 2"/"Lessons 1-2" to match — internal naming
  // (deckKind 'letters'/'vowels'/'combined', runtime.alphabet.letters/
  // vowels, ids) is unchanged (task #16 display-rename + task #18 combined
  // deck addenda).
  if (labelEl) {
    labelEl.textContent = deckKind === 'vowels' ? 'Lesson 2'
      : deckKind === 'combined' ? 'Lessons 1-2'
      : 'Lesson 1';
  }
  renderShevaFooter();
}

// ─── Public entry point (task #18: renders the in-flow #alphabetSection —
// called from main.js's syncLayoutVisibility() whenever
// isAlphabetSectionActive() is true, the same way renderParsingPanel() /
// renderGrammarPanel() / renderReaderPanel() are called for their modes) ──
export function renderAlphabetSection() {
  render();
}

export function isAlphabetSectionActive() {
  return sectionActive;
}

// `kind` is 'letters' (Lesson 1), 'vowels' (Lesson 2), or 'combined'
// (Lessons 1-2, task #18 item 3). Always starts a fresh shuffle — no
// persistence implications, matching the pre-task-#18 overlay's own
// "reopening always starts a fresh shuffle" behavior.
export function openAlphabetSection(kind) {
  deckKind = kind === 'vowels' ? 'vowels' : kind === 'combined' ? 'combined' : 'letters';
  sectionActive = true;
  order = [];
  posIdx = 0;
  flipped = false;
  ensureOrder();
  render();
}

// Flips the module-local "which deck is showing" flag back off. Does NOT
// touch the DOM itself (no #alphabetSection show/hide here) — main.js's
// alphabetBackToVocab() wrapper calls syncLayoutVisibility() right after
// this, which is what actually restores the vocab card area (see the
// header comment's "task #18" note on why this stays a plain module-local
// flag instead of a new studyMode).
export function closeAlphabetSection() {
  sectionActive = false;
}

// ─── Legacy overlay API (kept, unchanged, per the CLAUDE.md "never remove
// an export an older shipped main.js still imports" rule — #alphabetOverlay
// no longer exists in index.html as of task #18, so these are now inert
// no-ops; each already null-checks `if (!el) return`, so they degrade
// safely rather than throwing) ──────────────────────────────────────────
export function isAlphabetOverlayOpen() {
  const el = document.getElementById('alphabetOverlay');
  return !!el && el.classList.contains('show');
}

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
  if (!currentEntry()) return;
  flipped = !flipped;
  render();
}

function markCurrent(gotIt) {
  const entry = currentEntry();
  if (!entry) return;
  const state = getDeckStateForKind(entry.kind);
  if (!state) return;
  const id = itemId(entry.item);
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
  if (deckKind === 'combined') {
    if (!confirm('Reset all Lessons 1-2 progress? This clears every letter and vowel marked known.')) return;
    const sL = getDeckStateForKind('letters');
    if (sL) { sL.known = {}; sL.seen = {}; }
    const sV = getDeckStateForKind('vowels');
    if (sV) { sV.known = {}; sV.seen = {}; }
    host.saveState();
    render();
    return;
  }
  const label = deckKind === 'vowels' ? 'Lesson 2 vowel marks' : 'Lesson 1 alphabet';
  if (!confirm(`Reset all ${label} progress? This clears every ${deckKind === 'vowels' ? 'vowel' : 'letter'} marked known.`)) return;
  const state = getDeckStateForKind(deckKind);
  if (!state) return;
  state.known = {};
  state.seen = {};
  host.saveState();
  render();
}
