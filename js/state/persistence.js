// State persistence: save/restore the runtime to localStorage, plus
// JSON export/import (with the Transfer modal UI for paste/share/file-pick).
//
// The deck-state bank (per-selection deck IDs + cursor) and the per-direction
// stores live on runtime.* and are written/read here. Host helpers (the deck
// builders, render hooks, study-mode normalizer, scheduler primitives) come
// in via configurePersistence — same pattern as the other UI modules.

import { runtime } from './runtime.js';
import { isPlainObject, shuffleArray } from '../utils/helpers.js';
import { getStorage, isLikelyIOS } from '../utils/storage.js';
import { shieldClicksBriefly } from '../utils/clickShield.js';
import { sortSetKeys } from '../domain/deck/ordering.js';
import { filterHardVocabCards, IRREGULAR_CARD_CONFIGS } from '../domain/deck/filters.js';
import { SESSION_IDLE_RESET_MS, SRS_CADENCE_PRESETS, DEFAULT_SRS_CADENCE } from '../domain/srs/constants.js';
import { STATE_MIGRATIONS, summarizePersistedState, formatPersistedStateSummary, compactPersistedState, compactRuntimeStores } from './migrations.js';
import {
  sanitizeGamificationState,
  STORAGE_KEY,
  CONSENT_STORAGE_KEY,
  PROGRESS_EXPORT_FORMAT,
  PROGRESS_EXPORT_VERSION,
  EXPORT_MAX_DECK_STATE_ENTRIES
} from './store.js';
import { isAnalyticsModalOpen, isDisclaimerModalOpen } from '../ui/modals.js';
import {
  setActiveSessionButton,
  setActiveSetButtons
} from '../ui/selectors.js';
import { renderCard } from '../ui/render.js';
import { renderProgress, renderReview } from '../ui/progress.js';
import {
  computeXpAndLevel,
  maybeCelebrateLevelUp,
  maybeCelebrateAchievements
} from '../ui/analytics.js';

let host = {
  ensureUsageStats: () => runtime.appUsageStats,
  normalizeStudyMode: (m) => m,
  ensureDirectionalStores: () => {},
  getDirectionalMarksStore: () => ({}),
  getStudyStoreKey: () => 'g2e',
  accumulateUsageTime: () => {},
  accumulateActiveStudyTime: () => {},
  getSessions: () => [],
  getSelectedCards: () => [],
  buildStudyDeck: () => [],
  getDueCount: () => 0,
  resetMorphAnswerState: () => {},
  resetUnspacedCycleState: () => {},
  clearSpacedUndoSnapshot: () => {},
  syncToggleButtons: () => {},
  syncLayoutVisibility: () => {},
  getDirectionalProgressStore: () => ({}),
  isReaderMode: () => false,
  renderReaderModule: () => {},
  maybeAutoResetUnspacedArchives: () => false
};

export function configurePersistence(deps) {
  host = { ...host, ...deps };
}

// Per-section spaced-repetition preference. Newer saves carry a `spacedByMode`
// object; legacy saves only have the single global `spacedRepetition`, which
// maps onto vocab (the only section it ever governed in practice). Grammar
// (morph) defaults to unspaced for everyone — it's the new section default.
function sanitizeSpacedByMode(input, legacySpaced) {
  const legacyVocab = legacySpaced !== false;
  const src = (input && typeof input === 'object') ? input : {};
  return {
    vocab: typeof src.vocab === 'boolean' ? src.vocab : legacyVocab,
    morph: typeof src.morph === 'boolean' ? src.morph : false
  };
}

// SRS spacing-cadence preset. Validate against the known presets so an old
// save (no field) or a bad value falls back to the 2-month intensive default
// rather than handing the scheduler an undefined preset.
function sanitizeSpacingCadence(value) {
  return (typeof value === 'string' && SRS_CADENCE_PRESETS[value]) ? value : DEFAULT_SRS_CADENCE;
}

// Legacy supplemental-set key splits. Same idea as the lemma rename but
// for `selectedKeys` entries: the old combined W5_POLIS_BASILEUS vocab/
// morphology set is replaced by two separate sets, so a saved selection
// that listed the combined key expands to both successors.
const LEGACY_SELECTION_KEY_SPLITS = {
  'W5_POLIS_BASILEUS': ['W5_POLIS', 'W5_BASILEUS']
};

function migrateSelectionKeys(keys) {
  if (!Array.isArray(keys)) return keys;
  const out = [];
  const seen = new Set();
  keys.forEach((k) => {
    const s = String(k);
    const successors = LEGACY_SELECTION_KEY_SPLITS[s] || [s];
    successors.forEach((sk) => {
      if (seen.has(sk)) return;
      seen.add(sk);
      out.push(sk);
    });
  });
  return out;
}

// Normalizes the per-concept irregular "… as cards" override map. Only
// explicit true/false survive (a missing key stays "auto" — on when the
// concept's chapter is selected). Migrates the legacy boolean
// `secondAoristCards`: a user who had it on keeps the 2nd-aorist split on
// explicitly; off/absent falls through to the new auto default.
function sanitizeIrregularCards(candidate) {
  const src = (candidate && candidate.irregularCards && typeof candidate.irregularCards === 'object')
    ? candidate.irregularCards
    : {};
  const out = {};
  IRREGULAR_CARD_CONFIGS.forEach(({ tag }) => {
    if (src[tag] === true) out[tag] = true;
    else if (src[tag] === false) out[tag] = false;
  });
  if (out['2aor'] === undefined && candidate && candidate.secondAoristCards === true) {
    out['2aor'] = true;
  }
  return out;
}

// ── Parsing state sanitize (Phase 2 PR B) ─────────────────────────────────
// runtime.parsing is owned/mutated by js/ui/parsing.js, but persistence.js
// (like every other persisted subtree) is responsible for validating it on
// the way in from localStorage or an imported JSON file — never trust
// disk/import data structurally. Backward compatible: a v2 export or a save
// from before this landed has no `parsing` key at all, which sanitizes to
// the v1 default shape below (see store.js PROGRESS_EXPORT_VERSION comment).
const PARSING_DIM_KEYS = ['binyan', 'conjugation', 'person', 'gender', 'number', 'suffix', 'state'];

function sanitizeParsingDims(input) {
  const src = isPlainObject(input) ? input : {};
  const out = {};
  PARSING_DIM_KEYS.forEach((key) => { out[key] = src[key] !== false; }); // default ON
  return out;
}

function sanitizeParsingCustomSet(input) {
  const src = isPlainObject(input) ? input : {};
  const out = {};
  Object.keys(src).forEach((paradigmId) => {
    if (src[paradigmId] === true) out[paradigmId] = true;
  });
  return out;
}

function sanitizeParsingAttemptEntries(list, cap) {
  return (Array.isArray(list) ? list : [])
    .filter((entry) => isPlainObject(entry) && isPlainObject(entry.dims))
    .map((entry) => ({
      at: Number.isFinite(entry.at) ? entry.at : 0,
      dims: { ...entry.dims }
    }))
    .slice(-cap);
}

function sanitizeParsingAttempts(input) {
  const src = isPlainObject(input) ? input : {};
  const out = {};
  Object.keys(src).forEach((formId) => {
    const rec = src[formId];
    if (!isPlainObject(rec)) return;
    out[formId] = {
      seen: Number.isFinite(rec.seen) ? rec.seen : 0,
      recent: sanitizeParsingAttemptEntries(rec.recent, 2),
      history: sanitizeParsingAttemptEntries(rec.history, 50)
    };
  });
  return out;
}

function sanitizeParsingState(candidate) {
  const src = isPlainObject(candidate) ? candidate : {};
  const lesson = Number.isInteger(src.lesson) && src.lesson >= 1 && src.lesson <= 50 ? src.lesson : 1;
  return {
    schemaVersion: 1,
    lesson,
    focusedParadigmId: (typeof src.focusedParadigmId === 'string' && src.focusedParadigmId) ? src.focusedParadigmId : null,
    direction: src.direction === 'build' ? 'build' : src.direction === 'mixed' ? 'mixed' : 'parse',
    shuffleAll: !!src.shuffleAll,
    customSetOn: !!src.customSetOn,
    customSet: sanitizeParsingCustomSet(src.customSet),
    excludeKnown: !!src.excludeKnown,
    includeAppendix: !!src.includeAppendix,
    dims: sanitizeParsingDims(src.dims),
    attempts: sanitizeParsingAttempts(src.attempts),
    initializedFromVocab: !!src.initializedFromVocab
  };
}

// ── Grammar Quiz state sanitize (Phase 2 PR C) ────────────────────────────
// runtime.grammar is owned/mutated by js/ui/grammar.js, but persistence.js
// (like every other persisted subtree) is responsible for validating it on
// the way in from localStorage or an imported JSON file. Backward
// compatible: a v3 export or a save from before this landed has no
// `grammar` key at all, which sanitizes to the v1 default shape below (see
// store.js PROGRESS_EXPORT_VERSION comment).
function sanitizeGrammarAttemptRecent(list) {
  return (Array.isArray(list) ? list : [])
    .filter((v) => v === 0 || v === 1)
    .slice(-5);
}

function sanitizeGrammarAttempts(input) {
  const src = isPlainObject(input) ? input : {};
  const out = {};
  Object.keys(src).forEach((qid) => {
    const rec = src[qid];
    if (!isPlainObject(rec)) return;
    const seen = Number.isFinite(rec.seen) ? Math.max(0, Math.round(rec.seen)) : 0;
    const correct = Number.isFinite(rec.correct) ? Math.max(0, Math.min(seen, Math.round(rec.correct))) : 0;
    out[qid] = {
      seen,
      correct,
      recent: sanitizeGrammarAttemptRecent(rec.recent),
      lastAt: Number.isFinite(rec.lastAt) ? rec.lastAt : 0
    };
  });
  return out;
}

function sanitizeGrammarState(candidate) {
  const src = isPlainObject(candidate) ? candidate : {};
  const lesson = Number.isInteger(src.lesson) && src.lesson >= 1 && src.lesson <= 50 ? src.lesson : 1;
  return {
    schemaVersion: 1,
    lesson,
    reviewMissed: !!src.reviewMissed,
    difficulty: src.difficulty === 'core' ? 'core' : 'all',
    attempts: sanitizeGrammarAttempts(src.attempts),
    initializedFromVocab: !!src.initializedFromVocab
  };
}

// ── Reader state sanitize (Phase 2 PR D) ──────────────────────────────────
// runtime.reader is owned/mutated by js/ui/reader.js, but persistence.js
// (like every other persisted subtree) is responsible for validating it on
// the way in from localStorage or an imported JSON file. Backward
// compatible: a v2/v3/v4 export or a save from before this landed has no
// `reader` key at all, which sanitizes to the v1 default shape below (see
// store.js PROGRESS_EXPORT_VERSION comment). NO SRS interaction of any kind
// — there is no attempts/confidence shape to sanitize here, only plain
// read-status and self-review flags.
function sanitizeReaderPassageIdSet(input) {
  const src = isPlainObject(input) ? input : {};
  const out = {};
  Object.keys(src).forEach((id) => {
    if (src[id] === true) out[id] = true;
  });
  return out;
}

function sanitizeReaderReadOrder(input, readPassages) {
  const src = Array.isArray(input) ? input : [];
  const out = [];
  const seen = new Set();
  src.forEach((id) => {
    const key = String(id);
    if (seen.has(key) || !readPassages[key]) return;
    seen.add(key);
    out.push(key);
  });
  return out.slice(0, 20);
}

function sanitizeReaderMarks(input) {
  const src = isPlainObject(input) ? input : {};
  const out = {};
  Object.keys(src).forEach((key) => {
    if (src[key] === true) out[key] = true;
  });
  return out;
}

function sanitizeReaderState(candidate) {
  const src = isPlainObject(candidate) ? candidate : {};
  const lesson = Number.isInteger(src.lesson) && src.lesson >= 1 && src.lesson <= 50 ? src.lesson : 1;
  const readPassages = sanitizeReaderPassageIdSet(src.readPassages);
  return {
    schemaVersion: 1,
    lesson,
    tier: src.tier === 'strict' ? 'strict' : 'both',
    readPassages,
    readOrder: sanitizeReaderReadOrder(src.readOrder, readPassages),
    marks: sanitizeReaderMarks(src.marks),
    lastPassageId: (typeof src.lastPassageId === 'string' && src.lastPassageId) ? src.lastPassageId : null,
    initializedFromVocab: !!src.initializedFromVocab
  };
}

// ── Alphabet practice state sanitize (Phase 2 PR E — Lesson 0) ───────────
// runtime.alphabet is owned/mutated by js/ui/alphabet.js, but persistence.js
// (like every other persisted subtree) is responsible for validating it on
// the way in from localStorage or an imported JSON file. Backward
// compatible: a v2-v5 export or a save from before this landed has no
// `alphabet` key at all, which sanitizes to the v1 default shape below (see
// store.js PROGRESS_EXPORT_VERSION comment). Completely independent of the
// vocab SRS/marks/progress and the parsing/grammar/reader subtrees — no XP,
// no streaks, no achievements, and never folded into any vocab count.
function sanitizeAlphabetKnown(input) {
  const src = isPlainObject(input) ? input : {};
  const out = {};
  Object.keys(src).forEach((id) => {
    if (src[id] === true) out[id] = true;
  });
  return out;
}

function sanitizeAlphabetSeen(input) {
  const src = isPlainObject(input) ? input : {};
  const out = {};
  Object.keys(src).forEach((id) => {
    const n = Number(src[id]);
    if (Number.isFinite(n) && n > 0) out[id] = Math.round(n);
  });
  return out;
}

function sanitizeAlphabetState(candidate) {
  const src = isPlainObject(candidate) ? candidate : {};
  return {
    schemaVersion: 1,
    known: sanitizeAlphabetKnown(src.known),
    seen: sanitizeAlphabetSeen(src.seen)
  };
}

// ── Persisted-state payload + sanitization for import ────────────────────

export function buildPersistedStatePayload(options = {}) {
  saveCurrentDeckStateToBank();
  // Keep the active mode's selection snapshot fresh before persisting.
  if (runtime.splitSelection && runtime.studyMode === 'vocab') {
    runtime.modeSelections[runtime.studyMode] = {
      selectedKeys: [...runtime.selectedKeys],
      currentSessionId: runtime.currentSession ? runtime.currentSession.id : null
    };
  }
  // spacedRepetition is the live mirror of the current section's setting —
  // fold it back into spacedByMode so the per-section preference persists.
  if (runtime.studyMode === 'vocab') {
    runtime.spacedByMode[runtime.studyMode] = runtime.spacedRepetition;
  }
  const usage = host.ensureUsageStats();
  // Trim the live runtime stores first (in place, so references like
  // runtime.marks stay valid): getWordProgress re-seeds a default entry for
  // every card rendered, so the in-memory state must be compacted too or it
  // regrows across a session. compactPersistedState then guarantees the
  // serialized payload is compact regardless of how it was sourced.
  compactRuntimeStores(runtime);
  return compactPersistedState({
    currentSessionId: runtime.currentSession ? runtime.currentSession.id : null,
    selectedKeys: [...runtime.selectedKeys],
    splitSelection: runtime.splitSelection,
    modeSelections: runtime.modeSelections,
    shuffled: runtime.shuffled,
    requiredOnly: runtime.requiredOnly,
    requiredOnlyDefaultedV1: true,
    srsIntervalCapAlignedV1: true,
    directionToGreek: runtime.directionToGreek,
    spacedRepetition: runtime.spacedRepetition,
    spacedByMode: runtime.spacedByMode,
    spacingCadence: runtime.spacingCadence,
    hardVocabReviewMode: runtime.hardVocabReviewMode,
    studyMode: runtime.studyMode,
    appProfile: runtime.appProfile,
    stemNotes: runtime.stemNotes,
    irregularCards: runtime.irregularCards,
    irregularTense: runtime.irregularTense,
    analyticsVocabDirection: runtime.analyticsVocabDirection,
    analyticsVocabScope: runtime.analyticsVocabScope,
    analyticsCollapsed: runtime.analyticsCollapsed,
    gamification: sanitizeGamificationState(runtime.appGamification),
    deckStates: runtime.deckStates,
    globalWordMarks: runtime.globalWordMarks,
    globalWordProgress: runtime.globalWordProgress,
    appUsageStats: {
      totalMs: usage.totalMs,
      dailyMs: usage.dailyMs,
      activeStudyMs: usage.activeStudyMs,
      activeDailyMs: usage.activeDailyMs,
      firstStudyAt: usage.firstStudyAt,
      studySessionHistory: usage.studySessionHistory,
      cardXpEarned: usage.cardXpEarned,
      lastActiveAt: 0,
      lastStudyInteractionAt: 0,
      lastStudyCountedAt: 0,
      currentStudySession: null
    },
    unspacedRoundSize: Number.isFinite(runtime.unspacedRoundSize) ? runtime.unspacedRoundSize : 0,
    unspacedRoundMarks: Number.isFinite(runtime.unspacedRoundMarks) ? runtime.unspacedRoundMarks : 0,
    unspacedAutoResetEnabled: !!runtime.unspacedAutoResetEnabled,
    lastUnspacedArchiveDayKey: typeof runtime.lastUnspacedArchiveDayKey === 'string' ? runtime.lastUnspacedArchiveDayKey : '',
    // Three-deck session state — saved so a reload within SESSION_IDLE_RESET_MS
    // (5 h) lands the user back in the middle of the same session instead of
    // forcing a fresh shuffle. The middle decks are intentionally kept
    // separate between spaced (spacedActiveIds tracks the *active* half) and
    // unspaced (unspacedMiddleIds tracks the *middle* half).
    lastStudyActivityAt: Number(runtime.lastStudyActivityAt) || 0,
    spacedActiveIds: Array.isArray(runtime.spacedActiveIds) ? runtime.spacedActiveIds.slice(0, 1000) : [],
    unspacedMiddleIds: runtime.unspacedMiddleIds ? Array.from(runtime.unspacedMiddleIds).slice(0, 1000) : [],
    // Parsing mode (Phase 2 PR B) — fully independent subtree, never touches
    // vocab SRS/marks/progress fields above. Re-sanitized on the way out so
    // a save is never persisted in a structurally-broken shape.
    parsing: sanitizeParsingState(runtime.parsing),
    // Grammar Quiz mode (Phase 2 PR C) — likewise fully independent, never
    // touches vocab SRS/marks/progress or the parsing subtree above.
    grammar: sanitizeGrammarState(runtime.grammar),
    // Reader mode (Phase 2 PR D) — likewise fully independent, never
    // touches vocab SRS/marks/progress or the parsing/grammar subtrees
    // above. No SRS interaction of any kind.
    reader: sanitizeReaderState(runtime.reader),
    // Lesson 0 Alphabet practice (Phase 2 PR E) — likewise fully
    // independent, never touches vocab SRS/marks/progress or the parsing/
    // grammar/reader subtrees above, and never contributes to any vocab
    // count in `summary` below.
    alphabet: sanitizeAlphabetState(runtime.alphabet)
  }, options);
}

function sanitizeImportedState(candidate) {
  if (!isPlainObject(candidate)) return null;
  // These are persisted-JSON property names — they must stay as the bare
  // identifiers used in saveState's payload, not the runtime.* references.
  const hasRecognizedStateShape = ['selectedKeys', 'deckStates', 'globalWordMarks', 'globalWordProgress', 'appUsageStats']
    .some(key => key in candidate);
  if (!hasRecognizedStateShape) return null;

  const state = { ...candidate };
  state.selectedKeys = Array.isArray(candidate.selectedKeys) ? migrateSelectionKeys(candidate.selectedKeys.map(String)) : [];
  state.deckStates = isPlainObject(candidate.deckStates) ? candidate.deckStates : {};
  state.globalWordMarks = isPlainObject(candidate.globalWordMarks) ? candidate.globalWordMarks : {};
  state.globalWordProgress = isPlainObject(candidate.globalWordProgress) ? candidate.globalWordProgress : {};
  state.studyMode = host.normalizeStudyMode(candidate.studyMode);
  state.appProfile = 'vocab_grammar';
  state.gamification = sanitizeGamificationState(candidate.gamification);
  state.shuffled = candidate.shuffled !== false;
  state.requiredOnly = candidate.requiredOnly !== false;
  state.directionToGreek = !!candidate.directionToGreek;
  state.spacedRepetition = candidate.spacedRepetition !== false;
  state.spacedByMode = sanitizeSpacedByMode(candidate.spacedByMode, candidate.spacedRepetition);
  state.spacingCadence = sanitizeSpacingCadence(candidate.spacingCadence);
  state.hardVocabReviewMode = !!candidate.hardVocabReviewMode;
  state.splitSelection = !!candidate.splitSelection;
  state.modeSelections = isPlainObject(candidate.modeSelections) ? candidate.modeSelections : {};
  // Vocab-card stem/declension notes default to true.
  state.stemNotes = candidate.stemNotes !== false;
  // …and the irregular-card tense caption.
  state.irregularTense = candidate.irregularTense !== false;
  // Irregular "… as cards" overrides: explicit true/false only; missing keys
  // stay auto. Migrates the legacy secondAoristCards boolean.
  state.irregularCards = sanitizeIrregularCards(candidate);
  // Parsing mode (Phase 2 PR B). A v2 export predates this field entirely —
  // sanitizeParsingState defaults it, matching a fresh install.
  state.parsing = sanitizeParsingState(candidate.parsing);
  // Grammar Quiz mode (Phase 2 PR C). A v2/v3 export predates this field
  // entirely — sanitizeGrammarState defaults it, matching a fresh install.
  state.grammar = sanitizeGrammarState(candidate.grammar);
  // Reader mode (Phase 2 PR D). A v2/v3/v4 export predates this field
  // entirely — sanitizeReaderState defaults it, matching a fresh install.
  state.reader = sanitizeReaderState(candidate.reader);
  // Lesson 0 Alphabet practice (Phase 2 PR E). A v2-v5 export predates this
  // field entirely — sanitizeAlphabetState defaults it, matching a fresh
  // install.
  state.alphabet = sanitizeAlphabetState(candidate.alphabet);

  const usage = host.ensureUsageStats(candidate.appUsageStats);
  state.appUsageStats = {
    totalMs: usage.totalMs,
    dailyMs: usage.dailyMs,
    activeStudyMs: usage.activeStudyMs,
    activeDailyMs: usage.activeDailyMs,
    firstStudyAt: usage.firstStudyAt,
    studySessionHistory: usage.studySessionHistory,
    cardXpEarned: usage.cardXpEarned,
    lastActiveAt: 0,
    lastStudyInteractionAt: 0,
    lastStudyCountedAt: 0,
    currentStudySession: null
  };

  // Imported files (the committed bug-repro save is one) can be multi-megabyte
  // legacy exports. Compact before it is written to localStorage so the import
  // itself can't trip the iOS quota.
  return compactPersistedState(state);
}

function applyImportedState(state, options = {}) {
  const storage = getStorage();
  if (!storage) return false;

  const sanitized = sanitizeImportedState(state);
  if (!sanitized) return false;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    // sanitized is already compacted; if it still won't fit, persist without
    // the deck-state bank (a pure resume convenience) rather than failing the
    // whole import.
    sanitized.deckStates = {};
    storage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  }
  if (options.disclaimerAccepted) {
    storage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    runtime.hasAcceptedDisclaimer = true;
  }

  const restored = restoreState();
  if (!restored) {
    runtime.currentSession = null;
    runtime.selectedKeys = [];
    runtime.deck = [];
    runtime.originalDeck = [];
    runtime.currentIdx = 0;
    runtime.isFlipped = false;
    runtime.marks = host.getDirectionalMarksStore();
    host.resetMorphAnswerState();
    host.resetUnspacedCycleState();
    runtime.unspacedPendingRecycle = false;
    runtime.activeDeckCount = 0;
    setActiveSessionButton();
    setActiveSetButtons();
    host.syncToggleButtons();
    host.syncLayoutVisibility();
    renderCard();
    renderProgress();
    renderReview();
    if (host.isReaderMode()) host.renderReaderModule();
  } else {
    host.syncLayoutVisibility();
  }

  saveState();
  return true;
}

// ── Progress export (JSON) ───────────────────────────────────────────────

function buildProgressExportPayload() {
  const storage = getStorage();
  if (!storage) return null;

  // Flush any uncounted time so the export captures the latest totals
  host.accumulateUsageTime();
  host.accumulateActiveStudyTime();

  // Exports carry full study history but only a handful of resume cursors —
  // those are 30 KB apiece and rarely useful after a device transfer.
  const appState = buildPersistedStatePayload({ maxDeckStates: EXPORT_MAX_DECK_STATE_ENTRIES });

  // The persisted payload zeros currentStudySession. If there was an
  // in-progress session, push a snapshot into the exported history so
  // session time is not lost on import.
  const liveSession = runtime.appUsageStats.currentStudySession;
  if (liveSession && liveSession.startedAt && liveSession.durationMs > 0) {
    const sessionSnapshot = {
      startedAt: liveSession.startedAt,
      endedAt: runtime.appUsageStats.lastStudyCountedAt || Date.now(),
      durationMs: liveSession.durationMs,
      interactionCount: liveSession.interactionCount || 0
    };
    if (!appState.appUsageStats.studySessionHistory) appState.appUsageStats.studySessionHistory = [];
    appState.appUsageStats.studySessionHistory.push(sessionSnapshot);
  }

  return {
    format: PROGRESS_EXPORT_FORMAT,
    version: PROGRESS_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    disclaimerAccepted: storage.getItem(CONSENT_STORAGE_KEY) === 'accepted',
    summary: summarizePersistedState(appState),
    appState
  };
}

function createProgressExportBundle() {
  const payload = buildProgressExportPayload();
  if (!payload) return null;
  const jsonText = JSON.stringify(payload, null, 2);
  const stamp = payload.exportedAt.slice(0, 19).replace(/[:T]/g, '-');
  return {
    payload,
    jsonText,
    filename: `bbh-study-tool-progress-${stamp}.json`
  };
}

async function copyTextToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {}
  return false;
}

// ── Transfer modal (paste/copy UI) ───────────────────────────────────────

function setTransferModalContent({ label = 'Progress tools', title = '', copy = '', textareaValue = '', textareaPlaceholder = '', primaryText = 'Close', secondaryText = '', showTextarea = false }) {
  const labelEl = document.getElementById('transferLabel');
  const titleEl = document.getElementById('transferTitle');
  const copyEl = document.getElementById('transferCopy');
  const textarea = document.getElementById('transferTextarea');
  const primaryBtn = document.getElementById('transferPrimaryBtn');
  const secondaryBtn = document.getElementById('transferSecondaryBtn');

  if (labelEl) labelEl.textContent = label;
  if (titleEl) titleEl.textContent = title;
  if (copyEl) copyEl.textContent = copy;
  if (textarea) {
    textarea.value = textareaValue;
    textarea.placeholder = textareaPlaceholder;
    textarea.style.display = showTextarea ? 'block' : 'none';
  }
  if (primaryBtn) {
    primaryBtn.textContent = primaryText;
    primaryBtn.style.display = primaryText ? 'inline-flex' : 'none';
  }
  if (secondaryBtn) {
    secondaryBtn.textContent = secondaryText;
    secondaryBtn.style.display = secondaryText ? 'inline-flex' : 'none';
  }
}

function openTransferModal(config) {
  const overlay = document.getElementById('transferOverlay');
  if (!overlay) return;

  runtime.transferModalMode = config?.mode || '';
  runtime.transferPrimaryAction = typeof config?.primaryAction === 'function' ? config.primaryAction : null;
  runtime.transferSecondaryAction = typeof config?.secondaryAction === 'function' ? config.secondaryAction : null;
  setTransferModalContent(config || {});
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  const textarea = document.getElementById('transferTextarea');
  if (config?.showTextarea && textarea) {
    setTimeout(() => textarea.focus(), 0);
  }
}

export function closeTransferModal() {
  const overlay = document.getElementById('transferOverlay');
  if (!overlay) return;
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  runtime.transferModalMode = '';
  runtime.transferPrimaryAction = null;
  runtime.transferSecondaryAction = null;
  if (!isDisclaimerModalOpen() && !isAnalyticsModalOpen()) document.body.classList.remove('modal-open');
  shieldClicksBriefly();
}

export function handleTransferPrimaryAction() {
  if (typeof runtime.transferPrimaryAction === 'function') runtime.transferPrimaryAction();
}

export function handleTransferSecondaryAction() {
  if (typeof runtime.transferSecondaryAction === 'function') runtime.transferSecondaryAction();
}

function tryDownloadProgressJsonFile(jsonText, filename) {
  if (isLikelyIOS()) return false;

  try {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    return true;
  } catch (err) {
    return false;
  }
}

async function tryShareProgressJsonFile(jsonText, filename) {
  if (!navigator.share || typeof File === 'undefined') return false;

  try {
    const file = new File([jsonText], filename, { type: 'application/json' });
    if (navigator.canShare && !navigator.canShare({ files: [file] })) return false;
    await navigator.share({
      title: 'BBH Study Tool progress export',
      text: 'Progress backup exported from the BBH Study Tool app.',
      files: [file]
    });
    return true;
  } catch (err) {
    return err?.name === 'AbortError' ? true : false;
  }
}

function showExportFallbackModal(jsonText, filename) {
  openTransferModal({
    mode: 'export',
    label: 'Progress export',
    title: 'Save your progress JSON',
    copy: 'iPhone Safari and standalone web apps are temperamental about file downloads. Use the button below to copy the JSON, then paste it into a new plain-text file in Files, Notes, or another app.',
    textareaValue: jsonText,
    primaryText: 'Copy JSON',
    secondaryText: '',
    showTextarea: true,
    primaryAction: async () => {
      const textarea = document.getElementById('transferTextarea');
      const text = textarea?.value || jsonText;
      let copied = await copyTextToClipboard(text);
      if (!copied && textarea) {
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        try { copied = document.execCommand('copy'); } catch (err) {}
      }
      window.alert(copied
        ? `JSON copied. Save it as ${filename} somewhere you can reach from your iPhone.`
        : 'Copy did not complete automatically. The JSON is shown in the box so you can select and copy it manually.');
    }
  });
}

export async function exportProgressJson() {
  const storage = getStorage();
  if (!storage) {
    window.alert('Local storage is unavailable, so progress export cannot run on this device.');
    return;
  }

  const bundle = createProgressExportBundle();
  if (!bundle) {
    window.alert('Progress export could not be prepared on this device.');
    return;
  }

  const { jsonText, filename } = bundle;

  if (await tryShareProgressJsonFile(jsonText, filename)) return;
  if (tryDownloadProgressJsonFile(jsonText, filename)) return;

  showExportFallbackModal(jsonText, filename);
}

// Returns the import summary, or null if the user declined the confirmation.
// Throws when the payload is not a recognizable progress export.
function importProgressFromJsonText(rawText, options = {}) {
  const parsed = JSON.parse(String(rawText || '{}'));
  // This is a fresh deployment with a new export format id and no migration
  // path from the old Greek-app export — refuse it outright with a clear
  // message rather than trying (and likely failing/corrupting) a shape-based
  // import of Greek-flashcards data.
  if (typeof parsed?.format === 'string' && parsed.format.startsWith('greek-flashcards')) {
    throw new Error('This file is a progress export from the old Greek flashcards app and cannot be imported into BBH Study Tool.');
  }
  const wrappedState = parsed?.format === PROGRESS_EXPORT_FORMAT && isPlainObject(parsed.appState)
    ? parsed.appState
    : parsed;
  const disclaimerAccepted = parsed?.format === PROGRESS_EXPORT_FORMAT
    ? !!parsed.disclaimerAccepted
    : !!options.disclaimerAccepted;
  const summary = parsed?.format === PROGRESS_EXPORT_FORMAT && isPlainObject(parsed.summary)
    ? parsed.summary
    : summarizePersistedState(wrappedState);

  // Reject unrecognizable payloads before asking for confirmation. This is a
  // shape check only (mirrors sanitizeImportedState's gate) — the full
  // sanitizer must not run before the user confirms, because it routes
  // through host.ensureUsageStats which can replace the live usage stats.
  const looksLikeProgressState = isPlainObject(wrappedState)
    && ['selectedKeys', 'deckStates', 'globalWordMarks', 'globalWordProgress', 'appUsageStats']
      .some(key => key in wrappedState);
  if (!looksLikeProgressState) throw new Error('Invalid progress file shape.');

  const confirmed = window.confirm(
    `Importing will replace all progress saved on this device.\n\nIncoming data: ${formatPersistedStateSummary(summary)}\n\nContinue?`
  );
  if (!confirmed) return null;

  const success = applyImportedState(wrappedState, { disclaimerAccepted });
  if (!success) throw new Error('Invalid progress file shape.');
  return summary;
}

function openNativeImportPicker() {
  try {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    input.style.width = '1px';
    input.style.height = '1px';
    input.style.opacity = '0';

    const cleanup = () => {
      if (input.parentNode) input.parentNode.removeChild(input);
    };

    input.addEventListener('change', event => {
      handleImportedProgressFile(event);
      setTimeout(cleanup, 0);
    }, { once: true });

    document.body.appendChild(input);
    if (typeof input.showPicker === 'function') {
      input.showPicker();
    } else {
      input.click();
    }
    return true;
  } catch (err) {
    return false;
  }
}

export function triggerImportProgress() {
  openTransferModal({
    mode: 'import',
    label: 'Progress import',
    title: 'Import saved progress',
    copy: 'Choose a progress JSON file. If your iPhone does not open the file picker, paste the exported JSON into the box below instead.',
    textareaValue: '',
    textareaPlaceholder: 'Paste exported progress JSON here…',
    primaryText: 'Import pasted JSON',
    secondaryText: 'Choose JSON file',
    showTextarea: true,
    primaryAction: () => {
      const textarea = document.getElementById('transferTextarea');
      const rawText = textarea?.value?.trim() || '';
      if (!rawText) {
        window.alert('Paste the exported JSON into the box first, or use “Choose JSON file.”');
        return;
      }

      try {
        const summary = importProgressFromJsonText(rawText);
        if (!summary) return; // user declined the confirmation
        closeTransferModal();
        window.alert(`Progress imported successfully. ${formatPersistedStateSummary(summary)}`);
      } catch (err) {
        window.alert(err?.message || 'Import failed. Please paste a valid progress JSON exported from this app.');
      }
    },
    secondaryAction: () => {
      const opened = openNativeImportPicker();
      if (!opened) {
        window.alert('This device would not open the file picker. Please paste the exported JSON into the box instead.');
      }
    }
  });
}

function handleImportedProgressFile(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const summary = importProgressFromJsonText(reader.result);
      if (summary) {
        closeTransferModal();
        window.alert(`Progress imported successfully. ${formatPersistedStateSummary(summary)}`);
      }
    } catch (err) {
      window.alert(err?.message || 'Import failed. Please choose a valid progress JSON exported from this app.');
    } finally {
      if (event?.target) event.target.value = '';
    }
  };
  reader.onerror = () => {
    window.alert('Import failed because the selected file could not be read.');
    if (event?.target) event.target.value = '';
  };
  reader.readAsText(file);
}

// ── Deck state bank + save/restore ───────────────────────────────────────

export function getDeckStateKey(keys = runtime.selectedKeys, requiredFlag = runtime.requiredOnly, spacedFlag = runtime.spacedRepetition) {
  const normalizedKeys = sortSetKeys((keys || []).map(String));
  return JSON.stringify({
    keys: normalizedKeys,
    requiredOnly: !!requiredFlag,
    spacedRepetition: !!spacedFlag,
    hardVocabReviewMode: !!runtime.hardVocabReviewMode,
    direction: host.getStudyStoreKey(),
    mode: runtime.studyMode
  });
}

// Snapshot which deck-state-bank entry the current runtime.deck belongs to.
// Call this whenever a deck is freshly built so saveCurrentDeckStateToBank can
// file it correctly. Recomputing the key from live runtime state at save time
// is unsafe: setStudyMode / toggleDirection / loadDeckFromKeys mutate the
// key-relevant fields (studyMode, direction, selectedKeys) *before* the new
// deck is built, so a save in that window would file the stale deck under the
// new deck's key and corrupt it.
export function markActiveDeckRef() {
  if (!runtime.selectedKeys.length) {
    runtime.activeDeckRef = null;
    return;
  }
  runtime.activeDeckRef = {
    key: getDeckStateKey(runtime.selectedKeys, runtime.requiredOnly),
    selectedKeys: [...runtime.selectedKeys],
    currentSessionId: runtime.currentSession ? runtime.currentSession.id : null
  };
}

export function saveCurrentDeckStateToBank() {
  const ref = runtime.activeDeckRef;
  if (!ref || !runtime.deck.length) return;

  runtime.deckStates[ref.key] = {
    currentSessionId: ref.currentSessionId,
    selectedKeys: ref.selectedKeys,
    deckIds: runtime.deck.map(card => card.id),
    currentIdx: runtime.currentIdx,
    unspacedPendingRecycle: !!runtime.unspacedPendingRecycle,
    // Per-deck pile membership for the three-deck layout, so switching back
    // to this deck (mode/toggle round-trip) can resume its in-flight session
    // instead of force-shuffling. Both fields are written unconditionally:
    // during a mode transition the live spacedRepetition flag may already
    // belong to the *next* mode while runtime.deck still holds the deck
    // being banked, so gating on the flag here would wipe the wrong field.
    // Each restorer reads only the field matching the deck's own spaced
    // flag (it's part of the bank key), so stale cross-data is ignored.
    spacedActiveIds: Array.isArray(runtime.spacedActiveIds) ? runtime.spacedActiveIds.slice(0, 1000) : [],
    unspacedMiddleIds: runtime.unspacedMiddleIds ? Array.from(runtime.unspacedMiddleIds).slice(0, 1000) : [],
    // Recency stamp so compaction can keep the most recently used selections
    // and evict stale ones instead of letting the bank grow unbounded. Also
    // gates session resume: a bank entry older than SESSION_IDLE_RESET_MS
    // restores as a fresh shuffle rather than a stale mid-session pile.
    savedAt: Date.now()
  };
}

export function saveState() {
  const storage = getStorage();
  if (!storage) return;
  maybeCelebrateLevelUp();
  maybeCelebrateAchievements();
  // saveState runs at the top of renderCard(): a throw here (iOS localStorage
  // QuotaExceededError is the common one) would abort the re-render and leave
  // the current card frozen. The payload is already compacted; if it still
  // won't fit, retry without the deck-state bank, then give up silently —
  // losing a resume cursor is far better than a frozen UI.
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(buildPersistedStatePayload()));
  } catch (err) {
    // Almost always QuotaExceededError on iOS. Drop the deck-state bank (a
    // pure resume convenience) and try once more.
    try {
      const payload = buildPersistedStatePayload();
      payload.deckStates = {};
      storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err2) {
      console.warn('saveState: unable to persist progress to localStorage.', err2);
    }
  }
}

export function clearSavedState() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(STORAGE_KEY);
}

export function reorderDeckFromIds(cards, deckIds) {
  if (!Array.isArray(deckIds) || !deckIds.length) return null;
  const byId = new Map(cards.map(card => [card.id, card]));
  const ordered = [];
  deckIds.forEach(id => {
    const match = byId.get(id);
    if (match) {
      ordered.push(match);
      byId.delete(id);
    }
  });
  // Zero overlap means these ids belong to a different deck entirely — e.g. a
  // stale cross-mode bank entry. Signal "no usable saved order" so callers
  // fall back to a fresh deck instead of trusting its currentIdx.
  if (!ordered.length) return null;
  ordered.push(...byId.values());
  return ordered;
}

export function restoreState() {
  const storage = getStorage();
  if (!storage) return false;

  // Fresh deployment, new key namespace — no fallback to any older
  // Greek-app save format (see store.js STORAGE_KEY comment).
  let raw = storage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    let saved = JSON.parse(raw);

    // Run any applicable migrations.
    for (const migration of STATE_MIGRATIONS) {
      try {
        if (migration.match(saved)) saved = migration.migrate(saved);
      } catch (err) {
        console.warn(`Migration "${migration.name}" failed:`, err);
      }
    }

    // Drop legacy/default bloat (empty progress entries, dead direction
    // buckets, an overgrown deck-state bank) before it is loaded into runtime,
    // so an oversized legacy save shrinks on first load instead of repeatedly
    // failing to persist.
    saved = compactPersistedState(saved);

    runtime.selectedKeys = Array.isArray(saved.selectedKeys) ? sortSetKeys(migrateSelectionKeys(saved.selectedKeys.map(String))) : [];
    runtime.requiredOnly = saved.requiredOnly !== false;
    runtime.directionToGreek = !!saved.directionToGreek;
    runtime.spacedRepetition = saved.spacedRepetition !== false;
    runtime.hardVocabReviewMode = !!saved.hardVocabReviewMode;
    runtime.splitSelection = !!saved.splitSelection;
    runtime.modeSelections = saved.modeSelections && typeof saved.modeSelections === 'object' ? saved.modeSelections : {};
    // Apply the same legacy-key rename to any per-mode selection snapshot so
    // a round-trip through a since-removed mode restores a deck with the two
    // successor keys, not the dropped combined key.
    Object.keys(runtime.modeSelections).forEach((mode) => {
      const entry = runtime.modeSelections[mode];
      if (entry && Array.isArray(entry.selectedKeys)) {
        entry.selectedKeys = migrateSelectionKeys(entry.selectedKeys.map(String));
      }
    });
    runtime.appProfile = 'vocab_grammar';
    const hadSavedAchievementSnapshot = Array.isArray(saved?.gamification?.lastEarnedAchievementIds);
    runtime.appGamification = sanitizeGamificationState(saved.gamification);
    runtime.studyMode = host.normalizeStudyMode(saved.studyMode);
    // Per-section spaced flag: restore both sections' settings, then mirror the
    // active mode's value into the live `spacedRepetition` the rest of the load
    // (deck build, cursor clamp) reads below.
    runtime.spacedByMode = sanitizeSpacedByMode(saved.spacedByMode, saved.spacedRepetition);
    runtime.spacingCadence = sanitizeSpacingCadence(saved.spacingCadence);
    if (runtime.studyMode === 'vocab') {
      runtime.spacedRepetition = runtime.spacedByMode[runtime.studyMode];
    }
    runtime.stemNotes = saved.stemNotes !== false;
    runtime.irregularTense = saved.irregularTense !== false;
    runtime.irregularCards = sanitizeIrregularCards(saved);
    runtime.analyticsVocabDirection = saved.analyticsVocabDirection === 'e2g' ? 'e2g' : 'g2e';
    runtime.analyticsVocabScope = saved.analyticsVocabScope === 'all' ? 'all' : 'required';
    if (saved.analyticsCollapsed && typeof saved.analyticsCollapsed === 'object') {
      Object.keys(runtime.analyticsCollapsed).forEach(key => {
        if (typeof saved.analyticsCollapsed[key] === 'boolean') {
          runtime.analyticsCollapsed[key] = saved.analyticsCollapsed[key];
        }
      });
    }
    runtime.shuffled = saved.shuffled !== false;
    // 5 AM auto-reset is opt-in: archived Easy cards persist by default so
    // returning to the deck the next day finds them still archived. Older
    // saves predate this field and load with the default-off state.
    runtime.unspacedAutoResetEnabled = saved.unspacedAutoResetEnabled === true;
    runtime.lastUnspacedArchiveDayKey = typeof saved.lastUnspacedArchiveDayKey === 'string' ? saved.lastUnspacedArchiveDayKey : '';
    // Restore the three-deck session state only if the saved activity
    // timestamp is within the 5 h session window. Past that, force a fresh
    // session — leave spacedActiveIds/unspacedMiddleIds at their defaults
    // (empty) so the next buildStudyDeck rebuilds from scratch and the user
    // gets a freshly-shuffled active pile.
    const savedActivityAt = Number(saved.lastStudyActivityAt) || 0;
    const withinSessionWindow = savedActivityAt > 0 && (Date.now() - savedActivityAt) <= SESSION_IDLE_RESET_MS;
    if (withinSessionWindow) {
      runtime.lastStudyActivityAt = savedActivityAt;
      // previousStudyActivityAt seeds equal to lastStudyActivityAt so the
      // first post-restore noteStudyInteraction snapshots the right gap
      // into the idle check.
      runtime.previousStudyActivityAt = savedActivityAt;
      runtime.spacedActiveIds = Array.isArray(saved.spacedActiveIds) ? saved.spacedActiveIds.slice() : [];
      runtime.unspacedMiddleIds = new Set(Array.isArray(saved.unspacedMiddleIds) ? saved.unspacedMiddleIds : []);
    } else {
      runtime.lastStudyActivityAt = 0;
      runtime.previousStudyActivityAt = 0;
      runtime.spacedActiveIds = [];
      runtime.unspacedMiddleIds = new Set();
    }
    runtime.deckStates = saved.deckStates && typeof saved.deckStates === 'object' ? saved.deckStates : {};
    runtime.globalWordMarks = saved.globalWordMarks && typeof saved.globalWordMarks === 'object' ? saved.globalWordMarks : {};
    runtime.globalWordProgress = saved.globalWordProgress && typeof saved.globalWordProgress === 'object' ? saved.globalWordProgress : {};
    runtime.appUsageStats = host.ensureUsageStats(saved.appUsageStats);
    runtime.appUsageStats.lastActiveAt = 0;
    const restoredLevel = computeXpAndLevel(runtime.appUsageStats).currentLevel.level;
    if (!Number.isFinite(runtime.appGamification.lastCelebratedLevel) || runtime.appGamification.lastCelebratedLevel < 1 || runtime.appGamification.lastCelebratedLevel > restoredLevel) {
      runtime.appGamification.lastCelebratedLevel = restoredLevel;
    }
    if (runtime.appGamification.lastCelebratedBadgeDay && !/^\d{4}-\d{2}-\d{2}$/.test(runtime.appGamification.lastCelebratedBadgeDay)) {
      runtime.appGamification.lastCelebratedBadgeDay = null;
    }
    host.ensureDirectionalStores();
    // Run the 5 AM auto-clear (if the toggle is on and the day key rolled)
    // before any deck build sees the marks — otherwise we'd build the deck
    // with stale archives and only refresh after the user interacts.
    host.maybeAutoResetUnspacedArchives();
    if (hadSavedAchievementSnapshot && !Array.isArray(runtime.appGamification.lastEarnedAchievementIds)) {
      runtime.appGamification.lastEarnedAchievementIds = [];
    }

    // Parsing mode (Phase 2 PR B) — fully independent of the vocab deck
    // below, so it restores unconditionally, before the "nothing selected"
    // early return that only concerns the vocab deck/cursor.
    runtime.parsing = sanitizeParsingState(saved.parsing);
    // Grammar Quiz mode (Phase 2 PR C) — likewise fully independent of the
    // vocab deck below; restores unconditionally for the same reason.
    runtime.grammar = sanitizeGrammarState(saved.grammar);
    // Reader mode (Phase 2 PR D) — likewise fully independent of the vocab
    // deck below; restores unconditionally for the same reason.
    runtime.reader = sanitizeReaderState(saved.reader);
    // Lesson 0 Alphabet practice (Phase 2 PR E) — likewise fully
    // independent of the vocab deck below; restores unconditionally for the
    // same reason.
    runtime.alphabet = sanitizeAlphabetState(saved.alphabet);

    if (!runtime.selectedKeys.length) {
      host.clearSpacedUndoSnapshot();
      host.syncToggleButtons();
      return false;
    }

    runtime.currentSession = saved.currentSessionId ? host.getSessions().find(s => s.id === saved.currentSessionId) || null : null;

    const selectedCards = host.getSelectedCards(runtime.selectedKeys);
    let scopedCards = runtime.requiredOnly ? selectedCards.filter(card => card.required) : selectedCards;
    if (runtime.hardVocabReviewMode && runtime.studyMode === 'vocab') {
      scopedCards = filterHardVocabCards(scopedCards, host.getDirectionalProgressStore());
    }
    runtime.originalDeck = scopedCards;
    host.resetMorphAnswerState();
    const savedDeckState = runtime.deckStates[getDeckStateKey(runtime.selectedKeys, runtime.requiredOnly)] || null;
    runtime.marks = host.getDirectionalMarksStore();
    const restoredDeck = savedDeckState ? reorderDeckFromIds(runtime.originalDeck, savedDeckState.deckIds) : null;
    // A bank entry whose ids don't line up with the current deck is a stale
    // cross-mode save — ignore its cursor entirely rather than clamp a
    // meaningless index onto a different deck.
    const usableDeckState = restoredDeck ? savedDeckState : null;
    if (runtime.spacedRepetition && restoredDeck) {
      runtime.deck = restoredDeck;
      runtime.activeDeckCount = restoredDeck.length;
      // Don't force a shuffle here — if spacedActiveIds was restored within
      // the 5 h session window, buildStudyDeck's "continue session" branch
      // preserves the in-flight active order. If the session expired,
      // spacedActiveIds is empty and freshStart fires naturally (which also
      // honours runtime.shuffled).
      runtime.deck = host.buildStudyDeck(runtime.originalDeck);
    } else if (restoredDeck) {
      // Unspaced: partition into [active, middle, archived]. Middle is the
      // subset of unmarked cards whose IDs are in unspacedMiddleIds — restored
      // intact within 5 h of last activity, empty Set otherwise. Saved
      // active order is preserved; active gets reshuffled only when we're
      // outside the session window (a fresh round), or in parsing mode,
      // which deliberately resamples its deck on every load.
      const middleIds = runtime.unspacedMiddleIds || new Set();
      const restoredActive = restoredDeck.filter(card => runtime.marks[card.id] !== 'known' && !middleIds.has(card.id));
      const restoredMiddle = restoredDeck.filter(card => runtime.marks[card.id] !== 'known' && middleIds.has(card.id));
      const restoredKnown = restoredDeck.filter(card => runtime.marks[card.id] === 'known');
      const freshUnspacedRound = !withinSessionWindow || runtime.studyMode === 'parsing';
      const orderedActive = (runtime.shuffled && freshUnspacedRound) ? shuffleArray([...restoredActive]) : [...restoredActive];
      runtime.deck = [...orderedActive, ...restoredMiddle, ...restoredKnown];
      runtime.unspacedMiddleCount = restoredMiddle.length;
    } else {
      runtime.deck = host.buildStudyDeck(runtime.originalDeck, { preserveUnspacedRound: true });
    }
    host.resetUnspacedCycleState();
    // Restore unspaced round counters AFTER any deck build so a mid-round
    // reload doesn't lose the user's position. Clamp size to the current
    // active count, since the persisted deck might have drifted.
    // Unspaced activeDeckCount excludes the middle section so end-of-round
    // detection (activeDeckCount === 0) fires correctly when only active is
    // drained and middle still has cards waiting. Spaced mode keeps the
    // active-section count buildStudyDeck just computed — overwriting it
    // with the total due count (active + middle) would let the cursor and
    // the end-of-active splash bleed into the middle section after a
    // continue-session restore.
    if (!runtime.spacedRepetition) {
      const unspacedMiddleSet = runtime.unspacedMiddleIds || new Set();
      runtime.activeDeckCount = runtime.originalDeck.filter(card => runtime.marks[card.id] !== 'known' && !unspacedMiddleSet.has(card.id)).length;
    }
    if (!runtime.spacedRepetition) {
      const savedRoundSize = Number(saved.unspacedRoundSize);
      const savedRoundMarks = Number(saved.unspacedRoundMarks);
      if (Number.isFinite(savedRoundSize) && savedRoundSize >= 0) {
        runtime.unspacedRoundSize = Math.min(savedRoundSize, runtime.activeDeckCount);
      } else {
        runtime.unspacedRoundSize = runtime.activeDeckCount;
      }
      if (Number.isFinite(savedRoundMarks) && savedRoundMarks >= 0) {
        runtime.unspacedRoundMarks = Math.min(savedRoundMarks, runtime.unspacedRoundSize);
      } else {
        runtime.unspacedRoundMarks = 0;
      }
    } else {
      runtime.unspacedRoundSize = 0;
      runtime.unspacedRoundMarks = 0;
    }
    // The saved cursor only means something while the saved order survives:
    // outside the session window (or in parsing mode) the active pile was
    // just rebuilt fresh, so a mid-deck cursor would skip a random prefix.
    // A fresh start begins at 0 — except an unspaced deck whose active pile
    // is empty (everything archived), which parks at the end so renderCard
    // shows the "all confirmed" state instead of an archived card. (Spaced
    // parks naturally: 0 >= activeDeckCount when nothing is due.)
    const cursorMeaningful = withinSessionWindow && runtime.studyMode !== 'parsing';
    const freshStartIdx = (!runtime.spacedRepetition && runtime.activeDeckCount === 0) ? runtime.deck.length : 0;
    runtime.currentIdx = usableDeckState && cursorMeaningful && Number.isInteger(usableDeckState.currentIdx)
      ? Math.min(Math.max(usableDeckState.currentIdx, 0), runtime.spacedRepetition ? runtime.activeDeckCount : runtime.deck.length)
      : freshStartIdx;
    runtime.unspacedPendingRecycle = !runtime.spacedRepetition && !!(usableDeckState && usableDeckState.unspacedPendingRecycle);
    runtime.isFlipped = false;
    host.clearSpacedUndoSnapshot();
    markActiveDeckRef();

    setActiveSessionButton();
    setActiveSetButtons();
    host.syncToggleButtons();
    renderCard();
    renderProgress();
    renderReview();
    // Reader mode owns the cardArea; renderCard above drew a vocab card into
    // it, so re-render the reader UI on top, otherwise an imported/restored
    // reader-mode save shows a stale vocab card with the nav/mark rows hidden.
    if (host.isReaderMode()) host.renderReaderModule();
    return true;
  } catch (err) {
    // Never delete the saved payload here: this catch also covers migrations
    // and the render calls above, so a transient bug in either would destroy
    // the user's study history. Fall back to a clean in-memory baseline and
    // leave storage untouched — a later fixed build can still restore it.
    console.warn('Could not restore saved study state; starting fresh without deleting saved data.', err);
    runtime.currentSession = null;
    runtime.selectedKeys = [];
    runtime.deck = [];
    runtime.originalDeck = [];
    runtime.currentIdx = 0;
    runtime.activeDeckCount = 0;
    runtime.isFlipped = false;
    runtime.unspacedPendingRecycle = false;
    host.clearSpacedUndoSnapshot();
    return false;
  }
}
