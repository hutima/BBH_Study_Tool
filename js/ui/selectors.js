// Selectors panel: builds the Sessions / Lessons buttons inside the Study
// Selector overlay, and owns the toggle/deselect/load flow that drives
// runtime.selectedKeys → runtime.deck.
//
// The module reads/writes runtime state directly. Host callbacks cover the
// deck-building primitives and rendering hooks that live in main.js
// (saveState, buildStudyDeck, getSelectedCards, etc.).

import { runtime } from '../state/runtime.js';
import { shuffleArray } from '../utils/helpers.js';
import { SESSION_IDLE_RESET_MS } from '../domain/srs/constants.js';
import {
  isChapterKey, sortSetKeys, expandSessionSets,
  isAdvancedVocabKey, parseAdvancedSubKey, isBookVocabKey
} from '../domain/deck/ordering.js';
import { CHAPTER_TITLES } from '../data/setMeta.js';
import { filterHardVocabCards } from '../domain/deck/filters.js';
import { renderCard, renderChooseSessionEmptyState } from './render.js';
import { renderProgress, renderReview } from './progress.js';

let host = {
  getSessions: () => [],
  getSelectedCards: () => [],
  getDirectionalMarksStore: () => ({}),
  getDirectionalProgressStore: () => ({}),
  getDeckStateKey: () => '',
  reorderDeckFromIds: () => null,
  buildStudyDeck: () => [],
  getDueCount: () => 0,
  resetUnspacedCycleState: () => {},
  resetStudyState: () => {},
  syncToggleButtons: () => {},
  clearSpacedUndoSnapshot: () => {},
  saveCurrentDeckStateToBank: () => {},
  markActiveDeckRef: () => {},
  saveState: () => {}
};

export function configureSelectors(deps) {
  host = { ...host, ...deps };
}

export function isSessionFullySelected(session, keys = runtime.selectedKeys) {
  const sessionKeys = expandSessionSets(session);
  return sessionKeys.length > 0 && sessionKeys.every(key => keys.includes(String(key)));
}

export function findExactSessionMatch(keys = runtime.selectedKeys) {
  const normalizedKeys = sortSetKeys((keys || []).map(String));
  return host.getSessions().find(session => {
    const sessionKeys = expandSessionSets(session);
    return sessionKeys.length === normalizedKeys.length && sessionKeys.every((key, idx) => key === normalizedKeys[idx]);
  }) || null;
}

export function setActiveSessionButton() {
  document.querySelectorAll('.session-btn').forEach(btn => {
    const session = host.getSessions().find(s => s.id === btn.dataset.sessionId);
    btn.classList.toggle('active', !!session && isSessionFullySelected(session));
  });
}

export function setActiveSetButtons() {
  document.querySelectorAll('.chapter-btn').forEach(btn => {
    const key = btn.dataset.key;
    btn.classList.toggle('active', runtime.selectedKeys.includes(key));
  });
}

export function buildSessions() {
  const grid = document.getElementById('sessionsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  host.getSessions().forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'session-btn';
    btn.id = 'sess-' + s.id;
    btn.dataset.sessionId = s.id;
    btn.innerHTML = `<span class="session-tag">${s.tag}</span>${s.label}`;
    btn.onclick = () => toggleSession(s);
    grid.appendChild(btn);
  });

  const deselectBtn = document.createElement('button');
  deselectBtn.type = 'button';
  deselectBtn.className = 'chapter-btn supplemental-deselect-all';
  deselectBtn.textContent = 'Deselect all sessions';
  deselectBtn.onclick = () => deselectAllChapters();
  grid.appendChild(deselectBtn);

  setActiveSessionButton();
}

// Lesson selector — data-driven off window.SETS + CHAPTER_TITLES. Lessons
// 3..50 are shown, including the 9 with no vocabulary yet (their count
// reads "0 vocab") so the rest of the course stays browsable/selectable.
// Lessons 1-2 are deliberately EXCLUDED from this vocab chapter grid (user
// addendum to task #16): they have zero vocab cards, and their textbook
// content (The Consonants / The Vowels) is now the "Lesson 1 · Alphabet"
// and "Lesson 2 · Vowel marks" practice decks surfaced by the buttons
// above this grid (js/ui/alphabet.js), not a vocab chapter. This filter is
// scoped to THIS grid only — Parsing/Grammar/Reader's own lesson selects
// and the Units session presets are untouched and still start at lesson 1.
const VOCAB_CHAPTER_GRID_EXCLUDED_LESSONS = new Set(['1', '2']);
export function buildChapterSelector() {
  const grid = document.getElementById('chaptersGrid');
  if (!grid) return;
  grid.innerHTML = '';
  grid.classList.add('chapters-grid');

  const sets = window.SETS && typeof window.SETS === 'object' ? window.SETS : {};
  const chapterKeys = Object.keys(sets)
    .filter(isChapterKey)
    .filter((key) => !VOCAB_CHAPTER_GRID_EXCLUDED_LESSONS.has(key))
    .sort((a, b) => Number(a) - Number(b));

  const deselectBtn = document.createElement('button');
  deselectBtn.type = 'button';
  deselectBtn.className = 'chapter-btn supplemental-deselect-all';
  deselectBtn.textContent = 'Deselect all lessons';
  deselectBtn.onclick = () => deselectAllChapters();
  grid.appendChild(deselectBtn);

  chapterKeys.forEach(key => {
    const set = sets[key];
    if (!set) return;
    const vocabCount = Array.isArray(set.cards) ? set.cards.length : 0;

    const btn = document.createElement('button');
    btn.className = 'chapter-btn';
    btn.dataset.key = key;
    const countLabel = `${vocabCount} vocab`;
    const subject = CHAPTER_TITLES[Number(key)] || '';
    const subtitleHtml = subject ? `<span class="chapter-subtitle">${subject}</span>` : '';
    btn.innerHTML = `${set.label}${subtitleHtml}<span class="chapter-count">${countLabel}</span>`;
    btn.onclick = () => toggleSet(key);
    grid.appendChild(btn);
  });

  setActiveSetButtons();
}

// ─── Advanced vocabulary + Book Vocab selectors (task #20) ────────────────
// Reworked to match the ORIGINAL GREEK APP's design (ad1547e
// advancedSection/bookVocabSection, js/ui/selectors.js's
// buildAdvancedSelector/buildBookVocabSelector) — see docs/
// bbh-conversion-plan.md's task-20 addendum. Two independent collapsible
// sections, rendered AFTER the manual lesson selection list:
//   - Advanced vocabulary: corpus-wide descending-frequency buckets of
//     100 ("ADV<NN>" keys, registered into window.SETS by js/app/main.js's
//     mergeAdvancedVocabDecks), each with selectable sub-groups of 25 via
//     the pseudo-key "ADV<NN>::sub::<label>" (js/domain/deck/filters.js's
//     getSelectedVocabCards / ordering.js's parseAdvancedSubKey).
//   - Book Vocab: per-book LINKED sets of 50 via the pseudo-key
//     "BKV::<book>::g::<N>" (never registered into window.SETS — resolved
//     to existing lesson/advanced card ids at deck-build time by
//     js/domain/deck/filters.js's resolveBookVocabCards).

function getAdvancedSubGroups(set) {
  const cards = Array.isArray(set?.cards) ? set.cards : [];
  if (!cards.length) return [];
  const groups = new Map();
  cards.forEach((card, index) => {
    const sub = card && card.sub ? String(card.sub) : 'group';
    if (!groups.has(sub)) groups.set(sub, { sub, count: 0, firstIndex: index });
    groups.get(sub).count += 1;
  });
  return [...groups.values()].sort((a, b) => a.firstIndex - b.firstIndex);
}

export function toggleAdvancedSubGroup(key, sub) {
  toggleSet(`${key}::sub::${sub}`);
}

export function buildAdvancedVocabSelector() {
  const list = document.getElementById('advancedGrid');
  if (!list) return;
  list.innerHTML = '';

  const sets = window.SETS && typeof window.SETS === 'object' ? window.SETS : {};
  const advancedKeys = Object.keys(sets).filter(isAdvancedVocabKey).sort();

  const meta = document.getElementById('advancedSectionMeta');
  if (meta) {
    if (!advancedKeys.length) {
      meta.textContent = '';
    } else {
      const totalCards = advancedKeys.reduce((sum, key) => sum + (Array.isArray(sets[key]?.cards) ? sets[key].cards.length : 0), 0);
      meta.textContent = `${advancedKeys.length} buckets · ${totalCards.toLocaleString()} words`;
    }
  }

  if (!advancedKeys.length) {
    const empty = document.createElement('div');
    empty.className = 'advanced-empty';
    empty.textContent = 'Advanced vocabulary data has not loaded yet.';
    list.appendChild(empty);
    return;
  }

  const deselectBtn = document.createElement('button');
  deselectBtn.type = 'button';
  deselectBtn.className = 'chapter-btn supplemental-deselect-all';
  deselectBtn.textContent = 'Deselect all advanced';
  deselectBtn.onclick = () => deselectAllAdvanced();
  list.appendChild(deselectBtn);

  const body = document.createElement('div');
  body.className = 'advanced-week-body';

  advancedKeys.forEach(key => {
    const set = sets[key];
    if (!set) return;
    const cardCount = Array.isArray(set.cards) ? set.cards.length : 0;
    if (!cardCount) return;
    const subGroups = getAdvancedSubGroups(set);

    const details = document.createElement('details');
    details.className = 'supplemental-set advanced-set';
    details.open = runtime.selectedKeys.includes(String(key));

    const summary = document.createElement('summary');
    summary.className = 'supplemental-summary advanced-summary';
    summary.innerHTML = `<span>${set.label || key}</span><span class="chapter-count">${cardCount} words</span>`;
    details.appendChild(summary);

    if (set.notes) {
      const notes = document.createElement('div');
      notes.className = 'advanced-notes';
      notes.textContent = set.notes;
      details.appendChild(notes);
    }

    const controls = document.createElement('div');
    controls.className = 'supplemental-paradigm-list advanced-sub-list';

    const allBtn = document.createElement('button');
    allBtn.className = 'chapter-btn supplemental-all-btn';
    allBtn.dataset.key = key;
    allBtn.innerHTML = `All of ${set.label || key}<span class="chapter-count">${cardCount} words</span>`;
    allBtn.onclick = () => toggleSet(key);
    controls.appendChild(allBtn);

    subGroups.forEach(group => {
      const btn = document.createElement('button');
      btn.className = 'chapter-btn supplemental-paradigm-btn advanced-sub-btn';
      btn.dataset.key = `${key}::sub::${group.sub}`;
      btn.innerHTML = `${group.sub}<span class="chapter-count">${group.count} word${group.count === 1 ? '' : 's'}</span>`;
      btn.onclick = () => toggleAdvancedSubGroup(key, group.sub);
      controls.appendChild(btn);
    });

    details.appendChild(controls);
    body.appendChild(details);
  });

  list.appendChild(body);
  setActiveSetButtons();
}

export function deselectAllAdvanced() {
  const advancedBaseKey = (k) => {
    const sub = parseAdvancedSubKey(k);
    return sub ? sub.baseKey : k;
  };
  const remaining = runtime.selectedKeys.filter(k => !isAdvancedVocabKey(advancedBaseKey(k)));
  if (remaining.length === runtime.selectedKeys.length) return;
  host.saveCurrentDeckStateToBank();
  runtime.currentSession = null;
  runtime.selectedKeys = remaining;
  if (!runtime.selectedKeys.length) {
    clearAndRenderEmpty();
    return;
  }
  loadDeckFromKeys(runtime.selectedKeys, null, { clearUnspacedMarks: true });
}

// ── Book Vocab selector ─────────────────────────────────────────────────
const BOOK_VOCAB_GROUP_SIZE_DEFAULT = 50;
function getBookVocabData() {
  const data = window.BBH_BOOK_VOCAB;
  const books = data && Array.isArray(data.books) ? data.books : [];
  const size = (data && Number(data.groupSize)) || BOOK_VOCAB_GROUP_SIZE_DEFAULT;
  return { books, size };
}

function getBookVocabGroups(refsLength, size) {
  const groups = [];
  for (let start = 0; start < refsLength; start += size) {
    const end = Math.min(start + size, refsLength);
    groups.push({ group: groups.length + 1, start, end, count: end - start });
  }
  return groups;
}

export function toggleBookVocabGroup(bookKey, groupNum) {
  toggleSet(`BKV::${bookKey}::g::${groupNum}`);
}

export function deselectAllBookVocab() {
  const remaining = runtime.selectedKeys.filter((k) => !isBookVocabKey(k));
  if (remaining.length === runtime.selectedKeys.length) return;
  host.saveCurrentDeckStateToBank();
  runtime.currentSession = null;
  runtime.selectedKeys = remaining;
  if (!runtime.selectedKeys.length) {
    clearAndRenderEmpty();
    return;
  }
  loadDeckFromKeys(runtime.selectedKeys, null, { clearUnspacedMarks: true });
}

export function buildBookVocabSelector() {
  const list = document.getElementById('bookVocabGrid');
  if (!list) return;
  list.innerHTML = '';

  const { books, size } = getBookVocabData();
  const ordered = [...books].sort((a, b) => (a.order || 0) - (b.order || 0));

  const meta = document.getElementById('bookVocabSectionMeta');
  if (meta) {
    if (!ordered.length) {
      meta.textContent = '';
    } else {
      // The sum over books counts a shared card once PER BOOK it appears in
      // (a common lemma like elohim is in nearly every book's list), so it
      // dwarfs the distinct-card count. Label the two numbers honestly:
      // every ref is a LINK to one shared Strong's-keyed card, never a
      // duplicate (user report 2026-08-09: "28,000 words" read as if Book
      // Vocab carried that many separate words).
      const totalLinks = ordered.reduce((sum, b) => sum + (Array.isArray(b.refs) ? b.refs.length : 0), 0);
      const distinct = new Set(ordered.flatMap((b) => Array.isArray(b.refs) ? b.refs : [])).size;
      meta.textContent = `${ordered.length} books · ${distinct.toLocaleString()} words · ${totalLinks.toLocaleString()} links`;
    }
  }

  if (!ordered.length) {
    const empty = document.createElement('div');
    empty.className = 'advanced-empty';
    empty.textContent = 'Book Vocab data has not loaded yet.';
    list.appendChild(empty);
    return;
  }

  const deselectBtn = document.createElement('button');
  deselectBtn.type = 'button';
  deselectBtn.className = 'chapter-btn supplemental-deselect-all';
  deselectBtn.textContent = 'Deselect all book vocab';
  deselectBtn.onclick = () => deselectAllBookVocab();
  list.appendChild(deselectBtn);

  const body = document.createElement('div');
  body.className = 'advanced-week-body';

  ordered.forEach(book => {
    const refs = Array.isArray(book.refs) ? book.refs : [];
    const count = refs.length;
    if (!count) return;
    const bookKey = `BKV::${book.key}`;
    const groups = getBookVocabGroups(count, size);

    const details = document.createElement('details');
    details.className = 'supplemental-set advanced-set book-vocab-set';
    details.open = runtime.selectedKeys.some(k => k === bookKey || k.startsWith(`${bookKey}::g::`));

    const summary = document.createElement('summary');
    summary.className = 'supplemental-summary advanced-summary';
    summary.innerHTML = `<span>${book.name}</span><span class="chapter-count">${count.toLocaleString()} words</span>`;
    details.appendChild(summary);

    const controls = document.createElement('div');
    controls.className = 'supplemental-paradigm-list advanced-sub-list';

    const allBtn = document.createElement('button');
    allBtn.className = 'chapter-btn supplemental-all-btn';
    allBtn.dataset.key = bookKey;
    allBtn.innerHTML = `All of ${book.name}<span class="chapter-count">${count.toLocaleString()} words</span>`;
    allBtn.onclick = () => toggleSet(bookKey);
    controls.appendChild(allBtn);

    groups.forEach(group => {
      const btn = document.createElement('button');
      btn.className = 'chapter-btn supplemental-paradigm-btn advanced-sub-btn';
      btn.dataset.key = `${bookKey}::g::${group.group}`;
      const label = `${group.start + 1}-${group.end}`;
      btn.innerHTML = `${label}<span class="chapter-count">${group.count} word${group.count === 1 ? '' : 's'}</span>`;
      btn.onclick = () => toggleBookVocabGroup(book.key, group.group);
      controls.appendChild(btn);
    });

    details.appendChild(controls);
    body.appendChild(details);
  });

  list.appendChild(body);
  setActiveSetButtons();
}

// Shared empty-state path used when a deselect leaves no selected keys.
function clearAndRenderEmpty() {
  // Deselecting everything is a "new session" event for the unspaced flow:
  // wipe the archive marks for the cards we were just studying so the next
  // selection starts fresh.
  if (!runtime.spacedRepetition) {
    const directionalMarks = host.getDirectionalMarksStore();
    (runtime.originalDeck || []).forEach(card => {
      if (card && card.id) delete directionalMarks[card.id];
    });
  }
  setActiveSessionButton();
  setActiveSetButtons();
  runtime.deck = [];
  runtime.originalDeck = [];
  runtime.activeDeckRef = null;
  runtime.marks = {};
  runtime.currentIdx = 0;
  runtime.unspacedRoundSize = 0;
  runtime.unspacedRoundMarks = 0;
  renderChooseSessionEmptyState();
  host.clearSpacedUndoSnapshot();
  host.syncToggleButtons();
  renderReview();
  host.saveState();
}

export function deselectAllChapters() {
  const remaining = runtime.selectedKeys.filter(k => !isChapterKey(k));
  const sessionWasActive = !!runtime.currentSession;
  if (remaining.length === runtime.selectedKeys.length && !sessionWasActive) return;
  host.saveCurrentDeckStateToBank();
  runtime.currentSession = null;
  runtime.selectedKeys = remaining;
  if (!runtime.selectedKeys.length) {
    clearAndRenderEmpty();
    return;
  }
  loadDeckFromKeys(runtime.selectedKeys, null, { clearUnspacedMarks: true });
}

export function deselectAll() {
  if (!runtime.selectedKeys.length && !runtime.currentSession) return;
  host.saveCurrentDeckStateToBank();
  runtime.currentSession = null;
  runtime.selectedKeys = [];
  clearAndRenderEmpty();
}

export function loadDeckFromKeys(keys, sessionId = null, options = {}) {
  host.saveCurrentDeckStateToBank();
  host.clearSpacedUndoSnapshot();

  // "New session selected" path: clear unspaced archive marks for the cards
  // we were just studying so the next deck starts fresh. The first request
  // explicitly asked for marks to persist until reset or a new session, and
  // session-selection callers pass clearUnspacedMarks: true for that. Spaced
  // mode is intentionally exempt; it derives behaviour from SRS progress, not
  // these marks.
  if (options.clearUnspacedMarks && !runtime.spacedRepetition) {
    const directionalMarks = host.getDirectionalMarksStore();
    (runtime.originalDeck || []).forEach(card => {
      if (card && card.id) delete directionalMarks[card.id];
    });
    runtime.marks = directionalMarks;
  }

  runtime.selectedKeys = sortSetKeys(keys.map(String));
  runtime.currentSession = sessionId
    ? host.getSessions().find(s => s.id === sessionId) || findExactSessionMatch(runtime.selectedKeys)
    : findExactSessionMatch(runtime.selectedKeys);

  const selectedCards = host.getSelectedCards(runtime.selectedKeys);
  let scopedCards = runtime.requiredOnly ? selectedCards.filter(card => card.required) : selectedCards;
  if (runtime.hardVocabReviewMode && runtime.studyMode === 'vocab') {
    scopedCards = filterHardVocabCards(scopedCards, host.getDirectionalProgressStore());
  }
  runtime.originalDeck = scopedCards;

  const savedDeckState = runtime.deckStates[host.getDeckStateKey(runtime.selectedKeys, runtime.requiredOnly)] || null;
  runtime.marks = host.getDirectionalMarksStore();
  const restoredDeck = savedDeckState ? host.reorderDeckFromIds(runtime.originalDeck, savedDeckState.deckIds) : null;
  // A bank entry whose ids don't line up with the current deck is a stale
  // cross-mode save — ignore its cursor rather than clamp a meaningless index.
  if (restoredDeck) {
    // Resume this deck's banked three-pile session when the user is merely
    // coming back to it — a mode switch or an option toggle — within the 5 h
    // session window. The due/middle pile then keeps waiting (it only joins
    // active when active drains, on a manual reshuffle, or after the idle
    // gap) instead of being reshuffled into active on every switch.
    // An explicit session/chapter pick (clearUnspacedMarks) starts fresh, as
    // does a bank entry older than the idle window (stale session).
    const savedAtMs = Number(savedDeckState.savedAt) || 0;
    const resumeSession = options.clearUnspacedMarks !== true
      && savedAtMs > 0
      && (Date.now() - savedAtMs) <= SESSION_IDLE_RESET_MS;
    if (runtime.spacedRepetition) {
      // Hand buildStudyDeck the banked active pile (and the banked order via
      // runtime.deck): its continue-session branch preserves the active
      // section as-is, with everything else due waiting in middle. When not
      // resuming, the cleared id list makes freshStart fire naturally, which
      // collapses all due cards into active and honours the shuffle toggle.
      runtime.deck = restoredDeck;
      runtime.spacedActiveIds = resumeSession && Array.isArray(savedDeckState.spacedActiveIds)
        ? [...savedDeckState.spacedActiveIds]
        : [];
      runtime.deck = host.buildStudyDeck(runtime.originalDeck);
    } else {
      // Unspaced: partition into [active, middle, archived]. Within the
      // session window the banked middle membership and active order are
      // restored intact; otherwise the round resets — middle collapses back
      // into active and the unmarked pile reshuffles.
      runtime.unspacedMiddleIds = resumeSession && Array.isArray(savedDeckState.unspacedMiddleIds)
        ? new Set(savedDeckState.unspacedMiddleIds)
        : new Set();
      const middleIds = runtime.unspacedMiddleIds;
      const restoredActive = restoredDeck.filter(card => runtime.marks[card.id] !== 'known' && !middleIds.has(card.id));
      const restoredMiddle = restoredDeck.filter(card => runtime.marks[card.id] !== 'known' && middleIds.has(card.id));
      const restoredKnown = restoredDeck.filter(card => runtime.marks[card.id] === 'known');
      const orderedActive = (runtime.shuffled && !resumeSession) ? shuffleArray([...restoredActive]) : [...restoredActive];
      runtime.deck = [...orderedActive, ...restoredMiddle, ...restoredKnown];
      runtime.unspacedMiddleCount = restoredMiddle.length;
      runtime.activeDeckCount = restoredActive.length;
    }
    // The saved cursor only means something while the banked order survives;
    // against a fresh build it would just skip a random prefix of the pile.
    // A fresh start begins at 0 — except an unspaced deck whose active pile
    // is empty (everything archived), which parks at the end so renderCard
    // shows the "all confirmed" state instead of an archived card. (Spaced
    // parks naturally: 0 >= activeDeckCount when nothing is due.)
    const freshStartIdx = (!runtime.spacedRepetition && runtime.activeDeckCount === 0) ? runtime.deck.length : 0;
    runtime.currentIdx = resumeSession && Number.isInteger(savedDeckState.currentIdx)
      ? Math.min(Math.max(savedDeckState.currentIdx, 0), runtime.spacedRepetition ? runtime.activeDeckCount : runtime.deck.length)
      : freshStartIdx;
    runtime.unspacedPendingRecycle = resumeSession && !runtime.spacedRepetition && !!savedDeckState.unspacedPendingRecycle;
    host.resetUnspacedCycleState();
    runtime.isFlipped = false;
  } else {
    host.resetStudyState();
    runtime.deck = host.buildStudyDeck(runtime.originalDeck);
  }
  host.markActiveDeckRef();

  setActiveSessionButton();
  setActiveSetButtons();

  host.syncToggleButtons();

  renderCard();
  renderProgress();
  renderReview();
  host.saveState();
}

export function loadSession(session) {
  runtime.currentSession = session;
  loadDeckFromKeys(expandSessionSets(session), session.id, { clearUnspacedMarks: true });
}

export function toggleSession(session) {
  host.saveCurrentDeckStateToBank();

  const sessionKeys = expandSessionSets(session);
  if (!sessionKeys.length) return;

  const alreadySelected = isSessionFullySelected(session);
  const nextKeys = alreadySelected
    ? runtime.selectedKeys.filter(key => !sessionKeys.includes(key))
    : sortSetKeys([...new Set([...runtime.selectedKeys, ...sessionKeys])]);

  runtime.currentSession = null;

  if (!nextKeys.length) {
    runtime.selectedKeys = [];
    runtime.marks = host.getDirectionalMarksStore();
    clearAndRenderEmpty();
    return;
  }

  loadDeckFromKeys(nextKeys, null, { clearUnspacedMarks: true });
}

export function toggleSet(key) {
  host.saveCurrentDeckStateToBank();
  runtime.currentSession = null;
  const raw = String(key);
  runtime.selectedKeys = runtime.selectedKeys.includes(raw)
    ? runtime.selectedKeys.filter(k => k !== raw)
    : [...runtime.selectedKeys, raw];

  if (!runtime.selectedKeys.length) {
    clearAndRenderEmpty();
    return;
  }

  loadDeckFromKeys(runtime.selectedKeys, null, { clearUnspacedMarks: true });
}
