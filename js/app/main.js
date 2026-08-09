// ═══════════════════════════════════════════════════════
//  GREEK FLASHCARDS — Modular Entry Point
// ═══════════════════════════════════════════════════════
//
// ┌─ LLM ORIENTATION ─ READ FIRST ──────────────────────────────────────┐
// │                                                                     │
// │ This file (main.js) is the entry point + glue. Most logic lives in  │
// │ modules under js/ui/, js/state/, and js/domain/. For most changes   │
// │ you do NOT need to load this file — load the relevant module(s)     │
// │ and js/state/runtime.js, that's it. See the task-to-files map below.│
// │                                                                     │
// │ STATE                                                               │
// │   All cross-module state lives in js/state/runtime.js as a single   │
// │   mutable `runtime` object. Modules `import { runtime }` and        │
// │   mutate properties directly (runtime.deck = ..., runtime.marks[id] │
// │   = 'known'). main.js does NOT own any module-level state.          │
// │                                                                     │
// │ WIRING                                                              │
// │   This file imports each module, then calls configure*(deps) at the │
// │   top to inject host callbacks the module needs. New host callbacks │
// │   go in the matching configure* block; new modules add their own    │
// │   configure call here. GLOBAL_CLICK_HANDLERS at the bottom is the   │
// │   onclick="..." surface used by index.html — every name there must  │
// │   resolve to either a local function or a named import.             │
// │                                                                     │
// │ MODULE MAP (load these, not this file, for the matching task)       │
// │   js/state/runtime.js       all shared mutable state                │
// │   js/state/persistence.js   save/restore, JSON export/import,       │
// │                             Transfer modal, deck-state bank         │
// │   js/state/store.js         storage keys, gamification sanitize     │
// │   js/state/migrations.js    versioned state migrations              │
// │   js/domain/srs/*           SRS scheduler, confidence, constants    │
// │   js/domain/deck/*          deck ordering + filters (pure)          │
// │   js/domain/gamification/   XP math, levels, usage-stats primitives │
// │   js/domain/grammar/        grammar-support HTML                    │
// │   js/ui/reader.js           Reader tab (drills + verses)            │
// │   js/ui/alphabet.js         Lesson 0 Alphabet practice (own overlay,│
// │                             own runtime.alphabet subtree)           │
// │   js/ui/keyboard.js         keyboard shortcuts                      │
// │   js/ui/toast.js            level-up / badge toast queue            │
// │   js/ui/touchTapBridge.js   iOS synthetic-tap polyfill              │
// │   js/ui/modals.js           disclaimer, what's new, study selector, │
// │                             shortcuts, analytics open/close,        │
// │                             startStudying, isXxxOpen predicates     │
// │   js/ui/charts.js           pure SVG/HTML builders (histogram,      │
// │                             line, heatmap, ring, word stat card)    │
// │   js/ui/progress.js         progress bar + Review panel +           │
// │                             returnSeenCardToDeck                    │
// │   js/ui/render.js           renderCard, flipCard (vocab + grammar)  │
// │   js/ui/selectors.js        Study Selector overlay + load flow      │
// │                             (buildSessions/Chapter/Suppl/Advanced,  │
// │                             toggle/deselect, loadDeckFromKeys)      │
// │   js/ui/navigation.js       navigate, markCard, setStudyMode,       │
// │                             toggles (shuffle/required/direction/    │
// │                             spaced/morphSelfCheck), reshuffle,      │
// │                             fastForward, resetCurrentDeck,          │
// │                             resetAllStats                           │
// │   js/ui/analytics.js        renderAnalyticsOverlay + ~16 helpers,   │
// │                             runtime-bound XP wrappers, celebrate-   │
// │                             on-level-up/badge plumbing              │
// │   js/utils/*                helpers, time, storage, Greek sort      │
// │   js/logic/pos_logic.js     parsing helpers                         │
// │                                                                     │
// │ WHAT STAYS IN main.js (you only need this file for these)           │
// │   - Theme bootstrap (resolve/applyThemeMode, sync*Buttons, init)    │
// │   - Usage tracking (accumulate*, noteStudyInteraction,              │
// │     startUsageTracking, updateUsageMeta)                            │
// │   - Deck primitives: buildStudyDeck, applySpacedReview,             │
// │     getDueCount, getKnownCount, getHighConfidenceCount,             │
// │     getRemainingCards, moveCardToBackOfActivePile, reshuffle*,      │
// │     maybe*, capture/restore SpacedUndoSnapshot,                     │
// │     applyUnspacedSharedSchedule, recordStudyOutcome,                │
// │     advanceScheduledCards, getWordProgress, getDeckAggregateStats   │
// │   - Morphology answer flow (answerMorphologyChoice,                 │
// │     revealMorphologyAnswer, rateMorphologySelfCheck,                │
// │     markMorphologyDontKnow)                                         │
// │   - Mode predicates (isMorphologyMode, isReaderMode,                │
// │     canAccessGrammarUi, getDirectionalMarksStore, etc.)             │
// │   - startNextCycle, resetStudyState, resetUnspacedCycleState        │
// │   - GLOBAL_CLICK_HANDLERS, init at bottom                           │
// │                                                                     │
// │ TASK → MINIMAL FILE SET                                             │
// │   "fix a card-render bug"           render.js + runtime.js          │
// │   "fix an analytics chart"          analytics.js + charts.js +      │
// │                                       runtime.js                    │
// │   "tweak SRS scheduling"            domain/srs/scheduler.js +       │
// │                                       main.js (applySpacedReview,   │
// │                                       buildStudyDeck) + runtime.js  │
// │   "change progress-bar text"        progress.js + runtime.js        │
// │   "add a new toggle"                navigation.js + runtime.js +    │
// │                                       main.js (configureNavigation, │
// │                                       GLOBAL_CLICK_HANDLERS,        │
// │                                       syncToggleButtons) +          │
// │                                       index.html                    │
// │   "add a new onclick handler"       owning module + main.js         │
// │                                       (GLOBAL_CLICK_HANDLERS) +     │
// │                                       index.html                    │
// │   "add a Study Selector section"    selectors.js + runtime.js +     │
// │                                       index.html                    │
// │   "tweak export/import JSON shape"  persistence.js + runtime.js +   │
// │                                       state/migrations.js (if       │
// │                                       schema-breaking)              │
// │   "add a new XP source"             domain/gamification/levels.js + │
// │                                       domain/gamification/xp.js +   │
// │                                       maybe analytics.js            │
// │   "fix a modal close bug"           modals.js                       │
// │   "fix the reader drill flow"       reader.js                       │
// │                                                                     │
// │ WHEN TO LOAD THIS FILE                                              │
// │   - Wiring a brand-new module (you need to add a configure* call)   │
// │   - A bug in one of the deck primitives or morphology answer flow   │
// │   - A bug in the boot sequence (init at bottom of file)             │
// │   - Adding a new onclick handler (GLOBAL_CLICK_HANDLERS)            │
// │   In all other cases, prefer the relevant module(s). main.js is     │
// │   ~1,450 lines; loading it for a small change wastes tokens.        │
// │                                                                     │
// │ DEPLOY                                                              │
// │   Bump the version in CACHE_NAME in sw.js (e.g. v1 → v2) AND every  │
// │   ?v=1 in sw.js + index.html + pages/*.html + styles.css. New js/*  │
// │   files must be added to                                            │
// │   APP_SHELL_PATHS in sw.js.                                         │
// │                                                                     │
// │ VERIFICATION                                                        │
// │   Strict-import parse catches more than `node --check`:             │
// │     node --input-type=module -e \                                   │
// │       "import('./js/app/main.js').catch(e=>{                        │
// │         console.error(e.message); process.exit(1);})"               │
// │   `document is not defined` is a successful parse (DOM unavailable  │
// │   in Node) — only treat actual SyntaxError / Invalid… as failures.  │
// │                                                                     │
// │ HISTORY                                                             │
// │   See REFACTOR_PLAN.txt for module-by-module rationale, the         │
// │   runtime-sweep methodology, and patterns to follow for future      │
// │   extractions.                                                      │
// └─────────────────────────────────────────────────────────────────────┘

// Utils
import { clamp, isPlainObject, shuffleArray, escapeHtml, cloneForUndo } from '../utils/helpers.js';
import { formatUsageDuration, formatAnalyticsDate, formatAnalyticsDateTime, getUsageDayKey, getUnspacedArchiveDayKey } from '../utils/time.js';
import { getStorage, isLikelyIOS } from '../utils/storage.js';

// Domain — SRS
import { SRS_NEAR_WINDOW_MS, SRS_CYCLE_ADVANCE_MS, SESSION_IDLE_RESET_MS, getCadencePreset,
         SRS_UNCERTAIN_MIN_MS, SRS_VARIANT_HOLD_MS, SRS_RELEARN_STEP_DAYS, SRS_HARD_RELEARN_STEPS,
         LEECH_LAPSE_THRESHOLD, LEECH_UNPIN_STREAK, LEECH_DRILL_DAYS } from '../domain/srs/constants.js';
import { msFromDays, daysFromMs, setProgressDelay,
         getSrsEase, getSrsStage, getLastEasyIntervalDays, getNextEasyIntervalDays,
         formatRemainingForTable } from '../domain/srs/scheduler.js';
import { recordConfidenceSample, getConfidencePct, computeCardXpAward,
         addVariantFaceSample, recordVariantRoundConfidence } from '../domain/srs/confidence.js';

// Domain — Gamification
import { XP_LEVELS, REVIEW_XP_SCHEDULE } from '../domain/gamification/levels.js';
import {
  sanitizeUsageStats,
  accumulateUsageTime as accumulateUsageTimeForStats,
  accumulateActiveStudyTime as accumulateActiveStudyTimeForStats,
  finalizeStudySession as finalizeStudySessionForStats,
  noteStudyInteraction as noteStudyInteractionForStats,
  getUsageMsForDay,
  getActiveStudyMsForDay
} from '../domain/gamification/usageStats.js';
// xp.js wrappers are exposed by analytics.js (which owns the runtime-bound
// versions). Importing them here keeps existing call sites in main.js working.

// Domain — Deck
import { SESSION_WEEK_META } from '../data/setMeta.js';
import { getSelectedVocabCards, expandIrregularCards, irregularEnabledTags, progressCardId, derivedCardFaceKey } from '../domain/deck/filters.js';

// Domain — Grammar/Reader modules were deleted in the Hebrew conversion
// (Vocabulary + Reference only for Phase 1 — see CLAUDE.md /
// docs/bbh-conversion-plan.md). A large amount of morph/reader code below
// still references the names these used to import (recordParadigmAttempt,
// listAvailableParadigms, renderReaderModule, etc.); it is unreachable dead
// code gated behind isMorphologyMode()/isReaderMode(), which always return
// false, so it never executes. Parsing (Phase 2 PR B) is a NEW, separate,
// self-contained module (js/ui/parsing.js) — see below.

// UI — Parsing (Phase 2 PR B). New file; imports ONLY from
// js/domain/parsing/{gates,drill}.js. Configured like every other UI module
// via configureParsing(deps); its click/change handlers are added to
// GLOBAL_CLICK_HANDLERS below, same as every other onclick="..." surface.
import {
  configureParsing,
  renderParsingPanel,
  renderParsingAnalytics,
  parsingSetLesson, parsingSetParadigm,
  parsingToggleShuffleAll, parsingToggleCustomSet, parsingToggleCustomSetParadigm, parsingToggleCustomSetGroup,
  parsingToggleExcludeKnown, parsingToggleAppendix, parsingSetDirection, parsingToggleDim,
  parsingPickDimensionValue, parsingSubmitDontKnow, parsingPickBuildChoice,
  parsingToggleBuildPick, parsingCheckBuildPicks, parsingNextCard,
  parsingResetKnownForms, parsingClearStats, parsingClearFormAttempt
} from '../ui/parsing.js';

// UI — Grammar Quiz (Phase 2 PR C). New file; imports NOTHING from other
// app modules (see js/ui/grammar.js header). Configured like every other UI
// module via configureGrammar(deps); its click/change handlers are added to
// GLOBAL_CLICK_HANDLERS below, same as every other onclick="..." surface.
import {
  configureGrammar,
  renderGrammarPanel,
  renderGrammarAnalytics,
  grammarSetLesson, grammarToggleReviewMissed, grammarSetDifficulty,
  grammarSelectChoice, grammarNextQuestion
} from '../ui/grammar.js';

// UI — Reader (Phase 2 PR D). New file; imports NOTHING from other app
// modules (see js/ui/reader.js header) — same isolation as grammar.js.
// Configured like every other UI module via configureReader(deps); its
// click/change handlers are added to GLOBAL_CLICK_HANDLERS below, same as
// every other onclick="..." surface.
import {
  configureReader,
  renderReaderPanel,
  renderReaderAnalytics,
  readerSetLesson, readerSetTier,
  readerOpenPassage, readerBackToList, readerToggleToken,
  readerToggleMarkForReview, readerToggleReadStatus
} from '../ui/reader.js';

// UI — Lesson 0 Alphabet practice (Phase 2 PR E). New file; imports NOTHING
// from other app modules (see js/ui/alphabet.js header) — same isolation as
// grammar.js/reader.js. Owns its own overlay (open/close live here, not in
// modals.js) and its own runtime.alphabet subtree, fully independent of
// vocab/parsing/grammar/reader. Configured like every other UI module via
// configureAlphabet(deps); its click/change handlers are added to
// GLOBAL_CLICK_HANDLERS below, same as every other onclick="..." surface.
import {
  configureAlphabet,
  isAlphabetOverlayOpen, openAlphabetOverlay, closeAlphabetOverlay,
  alphabetFlip, alphabetMarkAgain, alphabetMarkGotIt,
  alphabetShuffle, alphabetResetProgress
} from '../ui/alphabet.js';

// UI
import { installKeyboardShortcuts } from '../ui/keyboard.js';
import { showLevelToast, showBadgeToast } from '../ui/toast.js';
import {
  initPwaInstall,
  maybeScheduleInstallPrompt,
  triggerInstall,
  closeInstallInstructions,
  isInstallInstructionsOpen,
  dontShowInstallAgain
} from '../ui/pwaInstall.js';
import { installTouchSafeTapBridge } from '../ui/touchTapBridge.js';
import { installClickShield, shieldClicksBriefly } from '../utils/clickShield.js';
import {
  configureModals,
  updateConsentButtonState,
  openDisclaimerModal,
  closeDisclaimerModal,
  handleConsentAction,
  initializeConsentGate,
  showDisclaimerModal,
  isDisclaimerModalOpen,
  isTransferModalOpen,
  isStudySelectorOpen,
  openStudySelector,
  closeStudySelector,
  isShortcutsModalOpen,
  openShortcutsModal,
  closeShortcutsModal,
  isAnalyticsModalOpen,
  openAnalyticsOverlay,
  closeAnalyticsOverlay,
  startStudying
} from '../ui/modals.js';
import {
  configureProgress,
  renderProgress,
  renderReview,
  returnSeenCardToDeck,
  setReviewSortMode
} from '../ui/progress.js';
import { configureRender, renderCard, flipCard } from '../ui/render.js';
import {
  configureSelectors,
  isSessionFullySelected,
  findExactSessionMatch,
  setActiveSessionButton,
  setActiveSetButtons,
  buildSessions,
  buildChapterSelector,
  deselectAllChapters,
  deselectAll,
  loadDeckFromKeys,
  loadSession,
  toggleSession,
  toggleSet
} from '../ui/selectors.js';
import {
  configureNavigation,
  navigate,
  markCard,
  setStudyMode,
  setAppProfile,
  toggleShuffle,
  toggleRequiredOnly,
  toggleHardVocabReview,
  toggleDirection,
  toggleSpacedRepetition,
  toggleSpacingCadence,
  toggleUnspacedDailyReset,
  reshuffleEligible,
  fastForwardOneDay,
  fastForwardOneWeek,
  resetCurrentDeck,
  resetRequiredOnly,
  closeResetSpacedModal,
  updateResetSpacedScopeLabels,
  confirmResetSpacedTimingOnly,
  confirmResetSpacedProgress,
  confirmResetSpacedSmooth,
  closeResetUnspacedModal,
  confirmResetUnspacedMarks,
  openResetStatsModal,
  closeResetStatsModal,
  confirmResetStatsKeepSettings,
  confirmResetToStart,
  resetAllStats
} from '../ui/navigation.js';
import {
  configureAnalytics,
  migrateLegacyXp,
  computeXpAndLevel,
  computeAchievements,
  syncEarnedAchievementSnapshot,
  maybeCelebrateLevelUp,
  maybeCelebrateAchievements,
  renderAnalyticsOverlay
} from '../ui/analytics.js';
import {
  configurePersistence,
  closeTransferModal,
  handleTransferPrimaryAction,
  handleTransferSecondaryAction,
  exportProgressJson,
  triggerImportProgress,
  getDeckStateKey,
  saveCurrentDeckStateToBank,
  markActiveDeckRef,
  saveState,
  clearSavedState,
  reorderDeckFromIds,
  restoreState,
  buildPersistedStatePayload
} from '../state/persistence.js';
import {
  backfillConfirmedMilestones,
  buildDailyCumulativeSeriesFromMap,
  buildCumulativeConfirmationSeries,
  getCertaintyBucketForCard,
  buildCertaintyBuckets,
  buildConfirmationHistogram,
  buildHistogramSvg,
  buildLineChartSvg,
  buildBarChartSvg,
  buildHeatmapSvg,
  buildCircularProgressSvg,
  buildLevelBarHtml,
  buildTitleLadderHtml,
  buildWordStatCardHtml
} from '../ui/charts.js';

// State
import { runtime } from '../state/runtime.js';
import { STATE_MIGRATIONS, summarizePersistedState, formatPersistedStateSummary } from '../state/migrations.js';
import {
  sanitizeGamificationState,
  STORAGE_KEY,
  CONSENT_STORAGE_KEY,
  THEME_STORAGE_KEY,
  FONT_FAMILY_STORAGE_KEY,
  TEXT_SIZE_STORAGE_KEY,
  SHOW_POINTS_STORAGE_KEY,
  SHOW_TRANSLIT_STORAGE_KEY,
  PROGRESS_EXPORT_FORMAT,
  PROGRESS_EXPORT_VERSION,
  STUDY_IDLE_MS,
  STUDY_SESSION_BREAK_MS,
  MAX_STUDY_SESSION_HISTORY
} from '../state/store.js';

// A single seed captured once at session init — never Math.random, never a
// fresh `Date.now()` at individual call sites (see CLAUDE.md-adjacent note
// in js/domain/parsing/drill.js). Used only as a deterministic shuffle seed
// for js/ui/parsing.js's drill-pool ordering and Build-mode choice sets;
// never persisted. Also handed to js/ui/grammar.js (Phase 2 PR C) as its
// own session seed — sharing the one process-lifetime value is harmless
// since the two modules shuffle disjoint id namespaces (form ids vs.
// question ids), and it keeps "one seed captured once at session init" true
// app-wide rather than minting a second independent one.
const PARSING_SESSION_SEED = Date.now() & 0x7fffffff;

// Wire UI modules with the host helpers they call back into.
// Function declarations are hoisted; getter/setter closures defer reads to
// invocation time, so let-binding values are valid by the time they're called.
configureModals({
  renderAnalyticsOverlay: () => renderAnalyticsOverlay(),
  buildSessions: () => buildSessions(),
  buildChapterSelector: () => buildChapterSelector(),
  getHasAcceptedDisclaimer: () => runtime.hasAcceptedDisclaimer,
  setHasAcceptedDisclaimer: (v) => { runtime.hasAcceptedDisclaimer = v; },
  getDisclaimerModalRequiresAgreement: () => runtime.disclaimerModalRequiresAgreement,
  setDisclaimerModalRequiresAgreement: (v) => { runtime.disclaimerModalRequiresAgreement = v; },
  hasSelectedKeys: () => runtime.selectedKeys.length > 0,
  setSpacingCadence: (cadence) => {
    if (cadence !== 'relaxed' && cadence !== 'intensive') return;
    runtime.spacingCadence = cadence;
    syncToggleButtons();
    saveState();
  },
  // New-users-only: schedule the PWA install nudge right after the first-run
  // consent flow opens the study selector.
  onDisclaimerAccepted: () => maybeScheduleInstallPrompt()
});
configureProgress({
  accumulateUsageTime: () => accumulateUsageTime(),
  accumulateActiveStudyTime: () => accumulateActiveStudyTime(),
  updateUsageMeta: () => updateUsageMeta(),
  getKnownCount: () => getKnownCount(),
  getDueCount: (cards) => getDueCount(cards),
  getRemainingCards: () => getRemainingCards(),
  getHighConfidenceCount: () => getHighConfidenceCount(),
  getWordProgress: (id, opts) => getWordProgress(id, opts),
  renderAnalyticsOverlay: () => renderAnalyticsOverlay(),
  moveCardToBackOfActivePile: (card) => moveCardToBackOfActivePile(card),
  buildStudyDeck: (cards, opts) => buildStudyDeck(cards, opts),
  renderCard: () => renderCard(),
  saveState: () => saveState()
});
configureRender({
  saveState: () => saveState(),
  syncLayoutVisibility: () => syncLayoutVisibility(),
  noteStudyInteraction: () => noteStudyInteraction(),
  getNearDueCount: () => getNearDueCount(),
  maybeReturnKnownCardToActivePile: () => maybeReturnKnownCardToActivePile()
});
configureSelectors({
  getSessions: () => getSessions(),
  getSelectedCards: (keys) => getSelectedCards(keys),
  getDirectionalMarksStore: () => getDirectionalMarksStore(),
  getDirectionalProgressStore: () => getDirectionalProgressStore(),
  getDeckStateKey: (keys, req, spaced) => getDeckStateKey(keys, req, spaced),
  reorderDeckFromIds: (cards, ids) => reorderDeckFromIds(cards, ids),
  buildStudyDeck: (cards, opts) => buildStudyDeck(cards, opts),
  getDueCount: (cards) => getDueCount(cards),
  resetUnspacedCycleState: () => resetUnspacedCycleState(),
  resetStudyState: () => resetStudyState(),
  syncToggleButtons: () => syncToggleButtons(),
  clearSpacedUndoSnapshot: () => clearSpacedUndoSnapshot(),
  saveCurrentDeckStateToBank: () => saveCurrentDeckStateToBank(),
  markActiveDeckRef: () => markActiveDeckRef(),
  saveState: () => saveState()
});
configureNavigation({
  noteStudyInteraction: () => noteStudyInteraction(),
  normalizeStudyMode: (m) => normalizeStudyMode(m),
  isParsingMode: () => isParsingMode(),
  isGrammarMode: () => isGrammarMode(),
  isReaderMode: () => isReaderMode(),
  renderReaderModule: () => renderReaderModule(),
  ensureDirectionalStores: () => ensureDirectionalStores(),
  getDirectionalMarksStore: () => getDirectionalMarksStore(),
  getDirectionalProgressStore: () => getDirectionalProgressStore(),
  syncToggleButtons: () => syncToggleButtons(),
  syncLayoutVisibility: () => syncLayoutVisibility(),
  startNextCycle: (mode, opts) => startNextCycle(mode, opts),
  getKnownCount: () => getKnownCount(),
  advanceScheduledCards: (cards, ms) => advanceScheduledCards(cards, ms),
  buildStudyDeck: (cards, opts) => buildStudyDeck(cards, opts),
  captureSpacedUndoSnapshot: () => captureSpacedUndoSnapshot(),
  applySpacedReview: (card, outcome) => applySpacedReview(card, outcome),
  clearSpacedUndoSnapshot: () => clearSpacedUndoSnapshot(),
  restoreSpacedUndo: () => restoreSpacedUndo(),
  pushUnspacedHistory: (type) => pushUnspacedHistory(type),
  restoreUnspacedHistoryStep: () => restoreUnspacedHistoryStep(),
  clearSavedState: () => clearSavedState(),
  maybeReturnConfirmedDeferredCard: () => maybeReturnConfirmedDeferredCard(),
  maybePeriodicReshuffle: () => maybePeriodicReshuffle(),
  recordStudyOutcome: (id, outcome, at) => recordStudyOutcome(id, outcome, at),
  applyUnspacedSharedSchedule: (card, outcome, at) => applyUnspacedSharedSchedule(card, outcome, at),
  getRemainingCards: () => getRemainingCards(),
  resetUnspacedCycleState: () => resetUnspacedCycleState(),
  noteUnspacedArchiveActivity: () => noteUnspacedArchiveActivity(),
  saveCurrentDeckStateToBank: () => saveCurrentDeckStateToBank(),
  markActiveDeckRef: () => markActiveDeckRef(),
  saveState: () => saveState(),
  getDeckStateKey: (keys, req, spaced) => getDeckStateKey(keys, req, spaced),
  getSessions: () => getSessions(),
  getSelectedCards: (keys) => getSelectedCards(keys)
});
configureAnalytics({
  ensureUsageStats: () => ensureUsageStats(),
  accumulateActiveStudyTime: () => accumulateActiveStudyTime(),
  saveState: () => saveState(),
  renderParsingSection: () => renderParsingAnalytics(),
  renderGrammarSection: () => renderGrammarAnalytics(),
  renderReaderSection: () => renderReaderAnalytics()
});
configureParsing({
  getState: () => runtime.parsing,
  // The live vocab selection: parsing mode's own setStudyMode transition
  // (js/ui/navigation.js) always stashes the outgoing vocab selection into
  // modeSelections.vocab before overwriting runtime.selectedKeys with its
  // own chapter scope, so that (not the live selectedKeys, which parsing
  // mode reuses for unrelated legacy bookkeeping) is the source of truth
  // for "highest selected vocab lesson" on first-ever-use.
  getSelectedVocabKeys: () => (
    isPlainObject(runtime.modeSelections?.vocab) && Array.isArray(runtime.modeSelections.vocab.selectedKeys)
  ) ? runtime.modeSelections.vocab.selectedKeys
    : (runtime.studyMode === 'vocab' ? runtime.selectedKeys : []),
  getSessionSeed: () => PARSING_SESSION_SEED,
  saveState: () => saveState()
});
configureGrammar({
  getState: () => runtime.grammar,
  // Grammar mode never overwrites runtime.selectedKeys (unlike Parsing's
  // legacy runtime.parsingChapter bookkeeping — see navigation.js's
  // setStudyMode), so the live vocab selection is simply whatever
  // modeSelections.vocab has stashed, falling back to the live
  // selectedKeys when in vocab mode. Same "highest selected vocab lesson"
  // first-ever-use rule as Parsing.
  getSelectedVocabKeys: () => (
    isPlainObject(runtime.modeSelections?.vocab) && Array.isArray(runtime.modeSelections.vocab.selectedKeys)
  ) ? runtime.modeSelections.vocab.selectedKeys
    : (runtime.studyMode === 'vocab' ? runtime.selectedKeys : []),
  getSessionSeed: () => PARSING_SESSION_SEED,
  saveState: () => saveState()
});
configureReader({
  getState: () => runtime.reader,
  // Reader mode never overwrites runtime.selectedKeys (same as Grammar), so
  // the live vocab selection is simply whatever modeSelections.vocab has
  // stashed, falling back to the live selectedKeys when in vocab mode. Same
  // "highest selected vocab lesson" first-ever-use rule as Parsing/Grammar.
  getSelectedVocabKeys: () => (
    isPlainObject(runtime.modeSelections?.vocab) && Array.isArray(runtime.modeSelections.vocab.selectedKeys)
  ) ? runtime.modeSelections.vocab.selectedKeys
    : (runtime.studyMode === 'vocab' ? runtime.selectedKeys : []),
  saveState: () => saveState()
});
configureAlphabet({
  getState: () => runtime.alphabet,
  saveState: () => saveState()
});
configurePersistence({
  ensureUsageStats: (stats) => ensureUsageStats(stats),
  normalizeStudyMode: (m) => normalizeStudyMode(m),
  ensureDirectionalStores: () => ensureDirectionalStores(),
  getDirectionalMarksStore: () => getDirectionalMarksStore(),
  getStudyStoreKey: () => getStudyStoreKey(),
  accumulateUsageTime: () => accumulateUsageTime(),
  accumulateActiveStudyTime: () => accumulateActiveStudyTime(),
  getSessions: () => getSessions(),
  getSelectedCards: (keys) => getSelectedCards(keys),
  buildStudyDeck: (cards, opts) => buildStudyDeck(cards, opts),
  getDueCount: (cards) => getDueCount(cards),
  resetUnspacedCycleState: () => resetUnspacedCycleState(),
  clearSpacedUndoSnapshot: () => clearSpacedUndoSnapshot(),
  syncToggleButtons: () => syncToggleButtons(),
  syncLayoutVisibility: () => syncLayoutVisibility(),
  getDirectionalProgressStore: () => getDirectionalProgressStore(),
  maybeAutoResetUnspacedArchives: () => maybeAutoResetUnspacedArchives(),
  // Reader mode (Phase 2 PR D) — persistence.js already carried these two
  // host hooks (defaulting to a no-op false/noop) from before Reader
  // existed; wiring them here is the only change persistence.js itself
  // needs (see js/state/persistence.js's restoreState()/applyImportedState()
  // call sites).
  isReaderMode: () => isReaderMode(),
  renderReaderModule: () => renderReaderModule()
});


function getDirectionKey() {
  return runtime.directionToGreek ? 'e2g' : 'g2e';
}

function getStudyStoreKey() {
  return getDirectionKey();
}

function ensureDirectionalStores() {
  if (!runtime.globalWordMarks || typeof runtime.globalWordMarks !== 'object' || Array.isArray(runtime.globalWordMarks)) runtime.globalWordMarks = {};
  if (!runtime.globalWordProgress || typeof runtime.globalWordProgress !== 'object' || Array.isArray(runtime.globalWordProgress)) runtime.globalWordProgress = {};

  const migrateLegacyBucket = (bucketObj) => {
    const keys = Object.keys(bucketObj || {});
    if (keys.length && !('g2e' in bucketObj) && !('e2g' in bucketObj)) {
      return { g2e: { ...bucketObj }, e2g: {} };
    }
    return bucketObj;
  };

  runtime.globalWordMarks = migrateLegacyBucket(runtime.globalWordMarks);
  runtime.globalWordProgress = migrateLegacyBucket(runtime.globalWordProgress);

  if (!runtime.globalWordMarks.g2e || typeof runtime.globalWordMarks.g2e !== 'object') runtime.globalWordMarks.g2e = {};
  if (!runtime.globalWordMarks.e2g || typeof runtime.globalWordMarks.e2g !== 'object') runtime.globalWordMarks.e2g = {};
  if (!runtime.globalWordProgress.g2e || typeof runtime.globalWordProgress.g2e !== 'object') runtime.globalWordProgress.g2e = {};
  if (!runtime.globalWordProgress.e2g || typeof runtime.globalWordProgress.e2g !== 'object') runtime.globalWordProgress.e2g = {};
}

function getDirectionalMarksStore() {
  ensureDirectionalStores();
  return runtime.globalWordMarks[getStudyStoreKey()];
}

function getDirectionalProgressStore() {
  ensureDirectionalStores();
  return runtime.globalWordProgress[getStudyStoreKey()];
}


// Fixed 1-in-N chance per flip (not scaled by pool size) to return one
// random known card to the active pile. 50 → ~1 return per 50 flips (2%).
const KNOWN_CARD_RANDOM_RETURN_FLIP_ODDS = 50;


function isMorphologyMode() {
  return runtime.studyMode === 'morph';
}

function isParsingMode() {
  return runtime.studyMode === 'parsing';
}

// Grammar Quiz mode (Phase 2 PR C) — see js/ui/grammar.js.
function isGrammarMode() {
  return runtime.studyMode === 'grammar';
}

function isReaderMode() {
  return runtime.studyMode === 'reader';
}

// Reader mode (Phase 2 PR D) — see js/ui/reader.js. Thin wrapper so the
// navigation.js/persistence.js host hooks (renderReaderModule) — both
// pre-existing no-op defaults from before Reader existed — have something
// real to call.
function renderReaderModule() {
  renderReaderPanel();
}

function isCardStudyMode() {
  return runtime.studyMode === 'vocab' || runtime.studyMode === 'morph' || runtime.studyMode === 'parsing' || runtime.studyMode === 'reader';
}

// Parsing and Grammar are deliberately NOT "review deck" modes: neither
// ever uses runtime.deck/navigate()/markCard() (each owns its own
// step-walk/quiz UI — js/ui/parsing.js, js/ui/grammar.js), so both must
// stay out of this list — otherwise the keyboard shortcuts in
// installKeyboardShortcuts (arrows, space, 1/2/3, k, r) would fire
// vocab-deck card semantics against the (unused, hidden) legacy per-mode
// deck parsing mode still carries for backward-compat bookkeeping — see
// setStudyMode in js/ui/navigation.js.
function isReviewDeckMode() {
  return runtime.studyMode === 'vocab' || runtime.studyMode === 'morph';
}

// Phase 1 of the Hebrew conversion is Vocabulary + Reference only (see
// CLAUDE.md / docs/bbh-conversion-plan.md) — Grammar, Parsing, and Reader
// study modes were removed from the live app; runtime.studyMode is always
// 'vocab' (see normalizeStudyMode below) and this app is permanently
// vocab-only. isVocabOnlyProfile / canAccessGrammarUi remain as the documented
// lock — other modules still call them defensively.
function isVocabOnlyProfile() {
  return true;
}

function canAccessGrammarUi() {
  return !isVocabOnlyProfile();
}

// Sessions are the six lesson-range presets (Lessons 1-10 / 11-20 / … / All)
// from js/data/setMeta.js, not a legacy window.SESSIONS data-file global.
function getSessions() {
  return Object.keys(SESSION_WEEK_META).map(id => {
    const meta = SESSION_WEEK_META[id] || {};
    const lessons = Array.isArray(meta.lessons) ? meta.lessons : [];
    const tag = id === 'all' ? 'All' : `${lessons[0]}–${lessons[lessons.length - 1]}`;
    return { id, tag, label: meta.label || id, sets: lessons.map(String), special: false };
  });
}

function getProfileDescription() {
  return 'Vocabulary flashcards for Cook & Holmstedt, Beginning Biblical Hebrew.';
}

// Phase 2 PR B/C/D: Parsing, Grammar Quiz, and Reader are now real,
// selectable modes. Grammar-as-in-morph remains deferred (no UI reaches
// 'morph', so this never returns it) — see CLAUDE.md /
// docs/bbh-conversion-plan.md.
function normalizeStudyMode(mode) {
  if (mode === 'parsing') return 'parsing';
  if (mode === 'grammar') return 'grammar';
  if (mode === 'reader') return 'reader';
  return 'vocab';
}

function getModeDescription() {
  if (runtime.studyMode === 'parsing') return 'Parsing Practice';
  if (runtime.studyMode === 'grammar') return 'Grammar Quiz';
  if (runtime.studyMode === 'reader') return 'Reader';
  return 'Vocabulary Flashcards';
}


function resolveThemeMode(mode = runtime.themeMode) {
  if (mode === 'light' || mode === 'dark') return mode;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function applyThemeMode(mode = runtime.themeMode, persist = true) {
  runtime.themeMode = mode === 'light' || mode === 'dark' ? mode : 'system';
  const resolved = resolveThemeMode(runtime.themeMode);
  document.documentElement.setAttribute('data-theme', resolved);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', resolved === 'light' ? '#f4efe3' : '#0e0f14');

  const storage = getStorage();
  if (persist && storage) storage.setItem(THEME_STORAGE_KEY, runtime.themeMode);
  syncThemeButtons();
}

function syncThemeButtons() {
  const systemBtn = document.getElementById('themeSystemBtn');
  const darkBtn = document.getElementById('themeDarkBtn');
  const lightBtn = document.getElementById('themeLightBtn');
  if (systemBtn) systemBtn.classList.toggle('active', runtime.themeMode === 'system');
  if (darkBtn) darkBtn.classList.toggle('active', runtime.themeMode === 'dark');
  if (lightBtn) lightBtn.classList.toggle('active', runtime.themeMode === 'light');
}

function setThemeMode(mode) {
  applyThemeMode(mode, true);
}

function initializeThemeMode() {
  const storage = getStorage();
  const savedMode = storage ? storage.getItem(THEME_STORAGE_KEY) : null;
  runtime.themeMode = savedMode === 'light' || savedMode === 'dark' || savedMode === 'system' ? savedMode : 'system';
  applyThemeMode(runtime.themeMode, false);

  if (window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (runtime.themeMode === 'system') applyThemeMode('system', false);
    };
    if (typeof media.addEventListener === 'function') media.addEventListener('change', handleChange);
    else if (typeof media.addListener === 'function') media.addListener(handleChange);
  }
}

const FONT_FAMILY_OPTIONS = ['serif', 'sans'];
const TEXT_SIZE_OPTIONS = ['medium', 'large', 'x-large'];

function applyFontFamily(value = runtime.fontFamily, persist = true) {
  runtime.fontFamily = FONT_FAMILY_OPTIONS.includes(value) ? value : 'serif';
  document.documentElement.setAttribute('data-font-family', runtime.fontFamily);
  const storage = getStorage();
  if (persist && storage) storage.setItem(FONT_FAMILY_STORAGE_KEY, runtime.fontFamily);
  syncFontFamilyButtons();
}

function syncFontFamilyButtons() {
  const serifBtn = document.getElementById('fontSerifBtn');
  const sansBtn = document.getElementById('fontSansBtn');
  if (serifBtn) serifBtn.classList.toggle('active', runtime.fontFamily === 'serif');
  if (sansBtn) sansBtn.classList.toggle('active', runtime.fontFamily === 'sans');
}

function setFontFamily(value) {
  applyFontFamily(value, true);
  // Swapping serif/sans changes glyph metrics, so the layout reflows and a
  // button can slide under the finger before the iOS ghost click lands. Same
  // document-wide guard the modal closers use.
  shieldClicksBriefly();
}

function initializeFontFamily() {
  const storage = getStorage();
  const saved = storage ? storage.getItem(FONT_FAMILY_STORAGE_KEY) : null;
  runtime.fontFamily = FONT_FAMILY_OPTIONS.includes(saved) ? saved : 'serif';
  applyFontFamily(runtime.fontFamily, false);
}

function applyTextSize(value = runtime.textSize, persist = true) {
  runtime.textSize = TEXT_SIZE_OPTIONS.includes(value) ? value : 'medium';
  document.documentElement.setAttribute('data-text-size', runtime.textSize);
  const storage = getStorage();
  if (persist && storage) storage.setItem(TEXT_SIZE_STORAGE_KEY, runtime.textSize);
  syncTextSizeButtons();
}

function syncTextSizeButtons() {
  const map = {
    'medium': 'textSizeMediumBtn',
    'large': 'textSizeLargeBtn',
    'x-large': 'textSizeXLargeBtn'
  };
  for (const [size, id] of Object.entries(map)) {
    const btn = document.getElementById(id);
    if (btn) btn.classList.toggle('active', runtime.textSize === size);
  }
}

function setTextSize(value) {
  applyTextSize(value, true);
  // Changing text size grows the glyphs and reflows spacing, so a button can
  // slide under the finger between the tap and the iOS ghost click ~300 ms
  // later. Shield clicks document-wide to absorb that stray press.
  shieldClicksBriefly();
}

function initializeTextSize() {
  const storage = getStorage();
  const saved = storage ? storage.getItem(TEXT_SIZE_STORAGE_KEY) : null;
  runtime.textSize = TEXT_SIZE_OPTIONS.includes(saved) ? saved : 'medium';
  applyTextSize(runtime.textSize, false);
}

// ── Hebrew display prefs: vowel points + transliteration ───────────────────
// Same standalone-localStorage-key pattern as theme/font/text-size above
// (not part of the STATE_KEY JSON blob) — see SHOW_POINTS_STORAGE_KEY /
// SHOW_TRANSLIT_STORAGE_KEY in js/state/store.js.
const SHOW_POINTS_OPTIONS = ['pointed', 'unpointed'];
const SHOW_TRANSLIT_OPTIONS = ['show', 'hide'];

function applyShowPoints(value = runtime.showPoints, persist = true) {
  runtime.showPoints = SHOW_POINTS_OPTIONS.includes(value) ? value : 'pointed';
  const storage = getStorage();
  if (persist && storage) storage.setItem(SHOW_POINTS_STORAGE_KEY, runtime.showPoints);
  syncShowPointsButtons();
}

function syncShowPointsButtons() {
  const pointedBtn = document.getElementById('pointsShowBtn');
  const unpointedBtn = document.getElementById('pointsHideBtn');
  if (pointedBtn) pointedBtn.classList.toggle('active', runtime.showPoints === 'pointed');
  if (unpointedBtn) unpointedBtn.classList.toggle('active', runtime.showPoints === 'unpointed');
}

function setShowPoints(value) {
  applyShowPoints(value, true);
  // Points affect the rendered headword text itself (stripHebrewPoints is
  // applied in render.js), so the current card must be redrawn immediately
  // — unlike font/text-size, which are pure CSS and update reactively.
  renderCard();
}

function initializeShowPoints() {
  const storage = getStorage();
  const saved = storage ? storage.getItem(SHOW_POINTS_STORAGE_KEY) : null;
  runtime.showPoints = SHOW_POINTS_OPTIONS.includes(saved) ? saved : 'pointed';
  applyShowPoints(runtime.showPoints, false);
}

function applyShowTranslit(value = runtime.showTranslit, persist = true) {
  runtime.showTranslit = SHOW_TRANSLIT_OPTIONS.includes(value) ? value : 'show';
  document.documentElement.setAttribute('data-show-translit', runtime.showTranslit);
  const storage = getStorage();
  if (persist && storage) storage.setItem(SHOW_TRANSLIT_STORAGE_KEY, runtime.showTranslit);
  syncShowTranslitButtons();
}

function syncShowTranslitButtons() {
  const showBtn = document.getElementById('translitShowBtn');
  const hideBtn = document.getElementById('translitHideBtn');
  if (showBtn) showBtn.classList.toggle('active', runtime.showTranslit === 'show');
  if (hideBtn) hideBtn.classList.toggle('active', runtime.showTranslit === 'hide');
}

function setShowTranslit(value) {
  applyShowTranslit(value, true);
}

function initializeShowTranslit() {
  const storage = getStorage();
  const saved = storage ? storage.getItem(SHOW_TRANSLIT_STORAGE_KEY) : null;
  runtime.showTranslit = SHOW_TRANSLIT_OPTIONS.includes(saved) ? saved : 'show';
  applyShowTranslit(runtime.showTranslit, false);
}

// ── Per-toggle info modal ────────────────────────────────────────────────
// Each Advanced-settings master toggle gets a small (i) button that opens a
// modal describing what it does — sourced from the toggle's own `title`, so
// there's one description that also serves as the desktop tooltip and, more
// importantly, surfaces on touch devices where hover tooltips never appear.
// The per-value exclude sub-filters (dimValueFilter_* / optionalFilter_*) are
// skipped: their labels already name the value (e.g. "Aorist (Ch. 6)").
function installToggleInfoButtons() {
  // The Advanced-settings master toggles live in two containers: most in the
  // controls bar, plus the promoted Lookup-mode toggle that now sits up under
  // Text size. Both get the same (i) button + capture-phase text guard.
  [document.getElementById('controlsBar'), document.getElementById('parsingLookupRow')]
    .filter(Boolean)
    .forEach(installToggleInfoForContainer);
}

function installToggleInfoForContainer(bar) {
  bar.querySelectorAll('.toggle-label').forEach(label => {
    if (/^(dimValueFilter_|optionalFilter_)/.test(label.id)) return;
    if (!label.getAttribute('title')) return;
    if (label.querySelector('.toggle-info')) return; // idempotent
    const info = document.createElement('span');
    info.className = 'toggle-info';
    info.setAttribute('role', 'button');
    info.setAttribute('tabindex', '0');
    info.setAttribute('aria-label', 'What this setting does');
    info.textContent = 'i';
    const open = (e) => { e.preventDefault(); e.stopPropagation(); showToggleInfo(label); };
    info.addEventListener('click', open);
    info.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') open(e); });
    const textEl = label.querySelector('.toggle-text');
    if (textEl) textEl.insertAdjacentElement('afterend', info);
    else label.appendChild(info);
  });

  // Only the switch should flip a toggle — a tap on the label *text* must not,
  // so the small (i) sitting in that text run is easy to hit without catching
  // the toggle. A capture-phase guard swallows clicks that land on a
  // `.toggle-text` before the toggle's own inline onclick runs. The (i) keeps
  // its own handler (we bail for it), and keyboard activation (Enter/Space,
  // whose target is the button itself, not the text) still toggles.
  if (!bar.dataset.textGuard) {
    bar.dataset.textGuard = '1';
    bar.addEventListener('click', (e) => {
      if (e.target.closest('.toggle-info')) return;
      const text = e.target.closest('.toggle-text');
      if (text && bar.contains(text)) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, true);
  }
}

function showToggleInfo(label) {
  const overlay = document.getElementById('toggleInfoOverlay');
  if (!label || !overlay) return;
  const textEl = label.querySelector('.toggle-text');
  const titleEl = document.getElementById('toggleInfoTitle');
  const bodyEl = document.getElementById('toggleInfoBody');
  if (titleEl) titleEl.textContent = textEl ? textEl.textContent.trim() : 'Setting';
  if (bodyEl) bodyEl.textContent = label.getAttribute('title') || '';
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeToggleInfoModal() {
  const overlay = document.getElementById('toggleInfoOverlay');
  if (!overlay) return;
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.consent-overlay.show')) document.body.classList.remove('modal-open');
  // Absorb the iOS ghost click (~300 ms after the "Got it" tap) so it can't
  // land on the Advanced-settings toggle now sitting under the finger. Same
  // guard every other modal close handler uses.
  shieldClicksBriefly();
}

function isToggleInfoModalOpen() {
  const overlay = document.getElementById('toggleInfoOverlay');
  return !!overlay && overlay.classList.contains('show');
}

function openContactAuthorModal() {
  const overlay = document.getElementById('contactAuthorOverlay');
  if (!overlay) return;
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeContactAuthorModal() {
  const overlay = document.getElementById('contactAuthorOverlay');
  if (!overlay) return;
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.consent-overlay.show')) document.body.classList.remove('modal-open');
  // Absorb the iOS ghost click after the "Close" tap, same guard every other
  // modal close handler uses.
  shieldClicksBriefly();
}

function isContactAuthorModalOpen() {
  const overlay = document.getElementById('contactAuthorOverlay');
  return !!overlay && overlay.classList.contains('show');
}

// Open a "Contact the author" link reliably from an installed PWA. Two things
// break a plain <a target="_blank"> there:
//   1. In a standalone/installed PWA (notably iOS home-screen apps) WebKit
//      silently swallows the "open in a new tab" default of a target="_blank"
//      link — there's no browser tab to open into — so the tap does nothing.
//   2. The touch-tap bridge (touchTapBridge.js) treats only buttons and
//      [onclick] elements as tap targets. A bare link in the modal matches
//      neither, so the bridge routed the synthetic tap up to the nearest
//      match — the overlay's [onclick] close handler — and tapping a link
//      CLOSED the modal instead of following it (while suppressing the link's
//      own native click).
// Giving each link its own onclick makes it a first-class tap target (fixes 2)
// and routes the open through window.open() from inside the tap gesture, which
// iOS honours where the bare target="_blank" default does not (fixes 1). http
// links open in a new context; mailto:/tel: hand off to the OS handler in place.
// Modified / non-primary clicks fall through to the browser's native handling.
function openExternalLink(anchor, event) {
  if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0)) {
    return true; // let the browser open-in-new-tab / save-link / etc. natively
  }
  const href = anchor && anchor.href;
  if (!href) return true;
  if (event && typeof event.preventDefault === 'function') event.preventDefault();
  if (/^https?:/i.test(href)) {
    let opened = null;
    try { opened = window.open(href, '_blank'); } catch (_) {}
    if (opened) {
      try { opened.opener = null; } catch (_) {} // reverse-tabnabbing guard
    } else {
      window.location.href = href; // popup blocked → open in place (swipe back to return)
    }
  } else {
    // mailto:, tel:, etc. — hand off to the OS handler without leaving the page.
    window.location.href = href;
  }
  return false;
}

// Persist the review-panel due-histogram's collapsed state. Reuses the
// already-persisted runtime.analyticsCollapsed map (so no extra save field is
// needed); the analytics-overlay copy is handled by that overlay's own
// collapse-sync. Called from the histogram <details>'s inline ontoggle.
function onDueHistogramToggle(key, el) {
  if (!key || !el) return;
  if (!runtime.analyticsCollapsed || typeof runtime.analyticsCollapsed !== 'object') runtime.analyticsCollapsed = {};
  runtime.analyticsCollapsed[key] = !el.open;
  saveState();
}

function syncToggleButtons() {
  const shuffleSwitch   = document.getElementById('shuffleBtn');
  const directionSwitch = document.getElementById('directionBtn');
  const spacedSwitch    = document.getElementById('spacedBtn');
  const hardReviewSwitch = document.getElementById('hardReviewBtn');
  const dailyResetSwitch = document.getElementById('unspacedDailyResetBtn');
  const shuffleToggle   = document.getElementById('shuffleToggle');
  const directionToggle = document.getElementById('directionToggle');
  const spacedToggle    = document.getElementById('spacedToggle');
  const hardReviewToggle = document.getElementById('hardReviewToggle');
  const dailyResetToggle = document.getElementById('unspacedDailyResetToggle');
  const modeShortcutVocabBtn = document.getElementById('modeShortcutVocabBtn');
  const resetDeckBtn = document.getElementById('resetDeckBtn');

  if (shuffleSwitch)   shuffleSwitch.classList.toggle('on',   !!runtime.shuffled);
  if (directionSwitch) directionSwitch.classList.toggle('on', !!runtime.directionToGreek);
  if (spacedSwitch)    spacedSwitch.classList.toggle('on',    !!runtime.spacedRepetition);
  if (hardReviewSwitch) hardReviewSwitch.classList.toggle('on', !!runtime.hardVocabReviewMode);
  // Spacing cadence (inverted toggle): ON = intensive (2-month course),
  // OFF = relaxed (8-month, the default for new users). Old users keep
  // intensive via their persisted value / the DEFAULT_SRS_CADENCE fallback.
  const cadenceIntensive = runtime.spacingCadence === 'intensive';
  const cadenceSwitch = document.getElementById('cadenceBtn');
  if (cadenceSwitch) cadenceSwitch.classList.toggle('on', cadenceIntensive);
  const cadenceToggleEl = document.getElementById('cadenceToggle');
  if (cadenceToggleEl) cadenceToggleEl.setAttribute('aria-checked', cadenceIntensive ? 'true' : 'false');
  if (dailyResetSwitch) dailyResetSwitch.classList.toggle('on', !!runtime.unspacedAutoResetEnabled);
  if (shuffleToggle)   shuffleToggle.setAttribute('aria-checked',   runtime.shuffled ? 'true' : 'false');
  if (directionToggle) directionToggle.setAttribute('aria-checked', runtime.directionToGreek ? 'true' : 'false');
  if (spacedToggle)    spacedToggle.setAttribute('aria-checked',    runtime.spacedRepetition ? 'true' : 'false');
  if (hardReviewToggle) hardReviewToggle.setAttribute('aria-checked', runtime.hardVocabReviewMode ? 'true' : 'false');
  if (dailyResetToggle) dailyResetToggle.setAttribute('aria-checked', runtime.unspacedAutoResetEnabled ? 'true' : 'false');

  if (directionToggle) {
    const directionLabel = directionToggle.querySelector('.toggle-text');
    if (directionLabel) {
      directionLabel.textContent = 'English → Hebrew';
    }
  }
  if (modeShortcutVocabBtn) modeShortcutVocabBtn.classList.toggle('active', runtime.studyMode === 'vocab');
  const modeShortcutParsingBtn = document.getElementById('modeShortcutParsingBtn');
  if (modeShortcutParsingBtn) modeShortcutParsingBtn.classList.toggle('active', runtime.studyMode === 'parsing');
  const modeShortcutGrammarBtn = document.getElementById('modeShortcutGrammarBtn');
  if (modeShortcutGrammarBtn) modeShortcutGrammarBtn.classList.toggle('active', runtime.studyMode === 'grammar');
  const modeShortcutReaderBtn = document.getElementById('modeShortcutReaderBtn');
  if (modeShortcutReaderBtn) modeShortcutReaderBtn.classList.toggle('active', runtime.studyMode === 'reader');
  syncThemeButtons();
  if (resetDeckBtn) {
    resetDeckBtn.textContent = runtime.spacedRepetition ? 'Reset spaced' : 'Reset unspaced';
    resetDeckBtn.title = runtime.spacedRepetition
      ? 'Choose to set every card due now or fully reset SRS progress for this deck'
      : 'Reset unspaced marks for this deck only';
  }

  const subtitle = document.getElementById('appSubtitle');
  if (subtitle) subtitle.textContent = getModeDescription();

  syncLayoutVisibility();
}

function syncLayoutVisibility() {
  // Phase 2 PR B/C: Parsing and Grammar Quiz each own an entirely separate
  // UI (js/ui/parsing.js, js/ui/grammar.js) and never touch
  // runtime.deck/navigate()/markCard() — short-circuit here before any of
  // the vocab-specific layout below runs, so vocab behavior stays
  // pixel-identical when studyMode==='vocab' (the only path that falls
  // through past this block).
  const parsingSectionEl = document.getElementById('parsingSection');
  const grammarSectionEl = document.getElementById('grammarSection');
  const readerSectionEl = document.getElementById('readerSection');
  if (isParsingMode()) {
    const advancedSettingsEl = document.getElementById('advancedSettingsDetails');
    const resetActionsEl = document.getElementById('resetActionsDetails');
    const cardAreaEl = document.getElementById('cardArea');
    const navRowEl = document.getElementById('navRow');
    const markRowEl = document.getElementById('markRow');
    const ffRowEl = document.getElementById('ffRow');
    const reviewShellEl = document.querySelector('.review-shell');
    if (parsingSectionEl) parsingSectionEl.style.display = '';
    if (grammarSectionEl) grammarSectionEl.style.display = 'none';
    if (readerSectionEl) readerSectionEl.style.display = 'none';
    if (advancedSettingsEl) advancedSettingsEl.style.display = 'none';
    if (resetActionsEl) resetActionsEl.style.display = 'none';
    if (cardAreaEl) cardAreaEl.style.display = 'none';
    if (navRowEl) navRowEl.style.display = 'none';
    if (markRowEl) markRowEl.style.display = 'none';
    if (ffRowEl) ffRowEl.style.display = 'none';
    if (reviewShellEl) reviewShellEl.style.display = 'none';
    renderParsingPanel();
    return;
  }
  if (isGrammarMode()) {
    const advancedSettingsEl = document.getElementById('advancedSettingsDetails');
    const resetActionsEl = document.getElementById('resetActionsDetails');
    const cardAreaEl = document.getElementById('cardArea');
    const navRowEl = document.getElementById('navRow');
    const markRowEl = document.getElementById('markRow');
    const ffRowEl = document.getElementById('ffRow');
    const reviewShellEl = document.querySelector('.review-shell');
    if (grammarSectionEl) grammarSectionEl.style.display = '';
    if (parsingSectionEl) parsingSectionEl.style.display = 'none';
    if (readerSectionEl) readerSectionEl.style.display = 'none';
    if (advancedSettingsEl) advancedSettingsEl.style.display = 'none';
    if (resetActionsEl) resetActionsEl.style.display = 'none';
    if (cardAreaEl) cardAreaEl.style.display = 'none';
    if (navRowEl) navRowEl.style.display = 'none';
    if (markRowEl) markRowEl.style.display = 'none';
    if (ffRowEl) ffRowEl.style.display = 'none';
    if (reviewShellEl) reviewShellEl.style.display = 'none';
    renderGrammarPanel();
    return;
  }
  if (isReaderMode()) {
    const advancedSettingsEl = document.getElementById('advancedSettingsDetails');
    const resetActionsEl = document.getElementById('resetActionsDetails');
    const cardAreaEl = document.getElementById('cardArea');
    const navRowEl = document.getElementById('navRow');
    const markRowEl = document.getElementById('markRow');
    const ffRowEl = document.getElementById('ffRow');
    const reviewShellEl = document.querySelector('.review-shell');
    if (readerSectionEl) readerSectionEl.style.display = '';
    if (parsingSectionEl) parsingSectionEl.style.display = 'none';
    if (grammarSectionEl) grammarSectionEl.style.display = 'none';
    if (advancedSettingsEl) advancedSettingsEl.style.display = 'none';
    if (resetActionsEl) resetActionsEl.style.display = 'none';
    if (cardAreaEl) cardAreaEl.style.display = 'none';
    if (navRowEl) navRowEl.style.display = 'none';
    if (markRowEl) markRowEl.style.display = 'none';
    if (ffRowEl) ffRowEl.style.display = 'none';
    if (reviewShellEl) reviewShellEl.style.display = 'none';
    renderReaderPanel();
    return;
  }
  if (parsingSectionEl) parsingSectionEl.style.display = 'none';
  if (grammarSectionEl) grammarSectionEl.style.display = 'none';
  if (readerSectionEl) readerSectionEl.style.display = 'none';
  const advancedSettingsEl = document.getElementById('advancedSettingsDetails');
  if (advancedSettingsEl) advancedSettingsEl.style.display = '';

  const controlsBar = document.getElementById('controlsBar');
  const navRow = document.getElementById('navRow');
  const markRow = document.getElementById('markRow');
  const ffRow = document.getElementById('ffRow');
  const prevBtn = navRow ? navRow.querySelector('.nav-prev') : null;
  const nextBtn = navRow ? navRow.querySelector('.nav-next') : null;
  const undoBtn = document.getElementById('spacedUndoBtn');
  const navResetBtn = document.getElementById('navResetBtn');
  const directionToggle = document.getElementById('directionToggle');
  const hardReviewToggle = document.getElementById('hardReviewToggle');
  const shuffleToggle = document.getElementById('shuffleToggle');
  const spacedToggle = document.getElementById('spacedToggle');
  const dailyResetToggle = document.getElementById('unspacedDailyResetToggle');
  const cardArea = document.getElementById('cardArea');
  const reviewShell = document.querySelector('.review-shell');

  if (controlsBar) controlsBar.style.display = 'flex';
  const resetActionsSection = document.getElementById('resetActionsDetails')
    || document.querySelector('.reset-actions-grid');
  if (resetActionsSection) resetActionsSection.style.display = '';
  if (cardArea) cardArea.style.display = '';
  if (reviewShell) reviewShell.style.display = '';
  if (navRow) navRow.style.display = runtime.selectedKeys.length ? 'flex' : 'none';
  if (markRow) markRow.style.display = runtime.selectedKeys.length ? 'flex' : 'none';
  if (ffRow) ffRow.style.display = runtime.selectedKeys.length && runtime.spacedRepetition ? 'flex' : 'none';
  if (directionToggle) directionToggle.style.display = 'flex';
  // Spacing cadence only affects the spaced scheduler, so show it only when
  // spaced review is on.
  const cadenceToggle = document.getElementById('cadenceToggle');
  if (cadenceToggle) cadenceToggle.style.display = runtime.spacedRepetition ? 'flex' : 'none';
  if (hardReviewToggle) hardReviewToggle.style.display = 'flex';
  if (shuffleToggle) shuffleToggle.style.display = 'flex';
  // Spaced repetition writes confidence stats.
  if (spacedToggle) spacedToggle.style.display = 'flex';
  if (dailyResetToggle) dailyResetToggle.style.display = !runtime.spacedRepetition ? 'flex' : 'none';

  const unspacedVocab = !runtime.spacedRepetition;
  const unspacedHistoryTop = unspacedVocab ? getUnspacedHistoryTopType() : null;
  const unspacedHasHistory = !!unspacedHistoryTop;
  if (prevBtn) {
    // Spaced review keeps its dedicated Undo button (Prev stays hidden). In
    // unspaced vocab Prev is always present — a constant anchor in the nav
    // row — and walks the history stack. Label flips to "↶ Undo" when the
    // next pop will roll back a confidence-impacting mark so the user sees
    // the warning at exactly that step. The button is functionally disabled
    // (CSS keeps the Reset-like swatch instead of greying out) when there's
    // nothing to undo or step back.
    const atStart = !runtime.deck.length || runtime.currentIdx <= 0;
    prevBtn.style.display = runtime.spacedRepetition ? 'none' : '';
    const prevDisabled = unspacedVocab ? (!unspacedHasHistory && atStart) : atStart;
    prevBtn.disabled = prevDisabled;
    prevBtn.classList.toggle('nav-disabled', prevDisabled);
    prevBtn.textContent = (unspacedVocab && unspacedHistoryTop === 'mark') ? '↶ Undo' : '← Prev';
  }
  if (undoBtn) {
    const vocabUndoActive = runtime.spacedRepetition && !!runtime.spacedUndoSnapshot;
    // Unspaced now routes undo through the Prev button, so the separate
    // Undo control only shows for spaced review.
    undoBtn.style.display = vocabUndoActive ? '' : 'none';
  }
  if (navResetBtn) {
    // Unspaced vocab keeps the inline Reset visible at all times so the
    // user has a one-tap escape from the all-archived "Session Confirmed"
    // state without Next having to do it.
    navResetBtn.style.display = unspacedVocab && runtime.selectedKeys.length > 0 ? '' : 'none';
  }
  if (nextBtn) {
    if (runtime.spacedRepetition) {
      nextBtn.textContent = 'Again →';
      nextBtn.classList.toggle('spaced-again', true);
      nextBtn.classList.remove('nav-next-as-reset');
    } else {
      nextBtn.textContent = 'Next →';
      nextBtn.classList.remove('spaced-again', 'nav-next-as-reset');
    }
  }
}

function ensureUsageStats(stats = runtime.appUsageStats) {
  const safe = sanitizeUsageStats(stats, MAX_STUDY_SESSION_HISTORY);
  if (stats !== safe) runtime.appUsageStats = safe;
  return safe;
}

function accumulateUsageTime(now = Date.now()) {
  const usage = ensureUsageStats();
  return accumulateUsageTimeForStats(usage, now);
}

function accumulateActiveStudyTime(now = Date.now()) {
  const usage = ensureUsageStats();
  return accumulateActiveStudyTimeForStats(usage, STUDY_IDLE_MS, now);
}

function finalizeStudySession(now = Date.now()) {
  const usage = ensureUsageStats();
  finalizeStudySessionForStats(usage, STUDY_IDLE_MS, MAX_STUDY_SESSION_HISTORY, now);
}

function noteStudyInteraction(now = Date.now()) {
  const usage = ensureUsageStats();
  noteStudyInteractionForStats(usage, {
    now,
    documentHidden: document.hidden,
    hasSelectedCards: runtime.selectedKeys.length > 0,
    studyIdleMs: STUDY_IDLE_MS,
    studySessionBreakMs: STUDY_SESSION_BREAK_MS,
    maxStudySessionHistory: MAX_STUDY_SESSION_HISTORY
  });
  // Session-boundary clock for the three-deck flow. Snapshot the previous
  // value into previousStudyActivityAt BEFORE updating lastStudyActivityAt,
  // so buildStudyDeck (called later in the same flip handler) sees the
  // timestamp of the PREVIOUS activity, not the one we just recorded. Any
  // study event (vocab mark, grammar mark, reader interaction) updates
  // both; persistence saves lastStudyActivityAt to gate session-state
  // restore across reloads.
  if (!document.hidden) {
    runtime.previousStudyActivityAt = runtime.lastStudyActivityAt || 0;
    runtime.lastStudyActivityAt = now;
  }
}

function getTodayUsageMs() {
  const usage = ensureUsageStats();
  return getUsageMsForDay(usage, getUsageDayKey());
}

function getTodayActiveStudyMs() {
  const usage = ensureUsageStats();
  return getActiveStudyMsForDay(usage, getUsageDayKey());
}

function updateUsageMeta() {
  const el = document.getElementById('progressMeta');
  if (!el) return;
  const usage = ensureUsageStats();
  el.textContent = `Today ${formatUsageDuration(getTodayActiveStudyMs())} · Study ${formatUsageDuration(usage.activeStudyMs)} · Total ${formatUsageDuration(usage.totalMs)}`;
}

function startUsageTracking() {
  ensureUsageStats();
  if (!document.hidden && !runtime.appUsageStats.lastActiveAt) {
    runtime.appUsageStats.lastActiveAt = Date.now();
  }

  if (!runtime.usageVisibilityBound) {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const now = Date.now();
        accumulateUsageTime(now);
        finalizeStudySession(now);
        runtime.appUsageStats.lastActiveAt = 0;
        updateUsageMeta();
        saveState();
      } else {
        runtime.appUsageStats.lastActiveAt = Date.now();
        updateUsageMeta();
        maybeAutoResetUnspacedArchivesAndRefresh();
      }
    });

    window.addEventListener('pagehide', () => {
      const now = Date.now();
      accumulateUsageTime(now);
      finalizeStudySession(now);
      runtime.appUsageStats.lastActiveAt = 0;
      saveState();
    });

    runtime.usageVisibilityBound = true;
  }

  if (!runtime.usageTickHandle) {
    runtime.usageTickHandle = window.setInterval(() => {
      if (document.hidden) return;
      const now = Date.now();
      const delta = accumulateUsageTime(now);
      const activeDelta = accumulateActiveStudyTime(now);
      if (delta > 0 || activeDelta > 0) {
        updateUsageMeta();
        if (isAnalyticsModalOpen()) renderAnalyticsOverlay();
        runtime.usageTickCounter += 1;
        if (runtime.usageTickCounter >= 4) {
          runtime.usageTickCounter = 0;
          saveState();
        }
      }
    }, 15000);
  }
}


// ── Unspaced cycle state helpers (state-coupled) ──

function resetUnspacedCycleState() {
  runtime.unspacedCycleState = {};
  runtime.unspacedDeferredIds = new Set();
  runtime.flipsSinceReshuffle = 0;
  runtime.lastPeriodicReshuffleAt = 0;
}

// Stamp the current archive day so subsequent auto-reset checks know the
// "current batch" started today. Called whenever an archive (Easy mark in
// unspaced vocab) is created.
function noteUnspacedArchiveActivity() {
  runtime.lastUnspacedArchiveDayKey = getUnspacedArchiveDayKey();
}

// Clears all unspaced 'known' marks across g2e and e2g when the local
// archive-day key has rolled past the 5 AM cutoff since the last archive
// activity. Morph marks are untouched. Returns true if anything was
// cleared so callers can rebuild the active deck.
function maybeAutoResetUnspacedArchives() {
  if (!runtime.unspacedAutoResetEnabled) return false;
  const todayKey = getUnspacedArchiveDayKey();
  const lastKey = runtime.lastUnspacedArchiveDayKey || '';
  if (!lastKey) {
    runtime.lastUnspacedArchiveDayKey = todayKey;
    return false;
  }
  if (lastKey === todayKey) return false;

  ensureDirectionalStores();
  let didClear = false;
  ['g2e', 'e2g'].forEach(dirKey => {
    const bucket = runtime.globalWordMarks[dirKey];
    if (!bucket) return;
    Object.keys(bucket).forEach(cardId => {
      if (bucket[cardId] === 'known') {
        delete bucket[cardId];
        didClear = true;
      }
    });
  });
  runtime.lastUnspacedArchiveDayKey = todayKey;
  runtime.marks = getDirectionalMarksStore();
  return didClear;
}

// Wrapper that runs the auto-reset and, if it actually cleared archives,
// rebuilds the active vocab unspaced deck + repaints so the freshly
// restored cards show up immediately.
function maybeAutoResetUnspacedArchivesAndRefresh() {
  const didClear = maybeAutoResetUnspacedArchives();
  if (!didClear) return;
  if (!runtime.selectedKeys.length) return;
  if (runtime.spacedRepetition) return;
  runtime.deck = buildStudyDeck(runtime.originalDeck);
  runtime.currentIdx = 0;
  runtime.isFlipped = false;
  renderCard();
  renderProgress();
  renderReview();
  saveState();
}

function getUnspacedCycleEntry(cardId) {
  if (!runtime.unspacedCycleState[cardId] || typeof runtime.unspacedCycleState[cardId] !== 'object') {
    runtime.unspacedCycleState[cardId] = { wrongThisCycle: false, correctCount: 0, lastOutcome: null };
  }
  return runtime.unspacedCycleState[cardId];
}

function applyUnspacedSharedSchedule(card, outcome, _reviewedAt = Date.now()) {
  // Unspaced reviews update only the unspaced cycle bookkeeping. The spaced
  // SRS schedule (progress.dueAt / intervalDays) is intentionally NOT touched
  // here, so flipping into spaced-repetition mode later finds untouched
  // schedules that reflect only previous spaced reviews.
  const cycleEntry = getUnspacedCycleEntry(card.id);
  const normalizedOutcome = outcome === 'easy' ? 'easy' : outcome === 'pass' ? 'pass' : 'again';

  if (normalizedOutcome === 'again') {
    cycleEntry.wrongThisCycle = true;
    cycleEntry.lastOutcome = 'again';
    return;
  }

  cycleEntry.correctCount += 1;
  cycleEntry.lastOutcome = normalizedOutcome;
}

// ── Card selection wrapper (state-coupled) ──

function getSelectedCards(keys) {
  const vocabCards = getSelectedVocabCards(keys, false);
  // Irregular "… as cards" toggles (advanced settings, vocab-only): each
  // enabled concept's non-present principal part joins the deck as its own
  // card. A toggle defaults on when its concept's chapter is selected, unless
  // the user has overridden it manually.
  const tags = irregularEnabledTags(runtime.selectedKeys, runtime.irregularCards);
  return tags.length ? expandIrregularCards(vocabCards, tags) : vocabCards;
}

function advanceScheduledCards(cards = runtime.originalDeck, advanceMs = SRS_CYCLE_ADVANCE_MS) {
  const now = Date.now();
  // A base card and its derived second-aorist card share one progress entry;
  // advance it once, not once per face.
  const advanced = new Set();
  (cards || []).forEach(card => {
    const progressId = progressCardId(card.id);
    if (advanced.has(progressId)) return;
    advanced.add(progressId);
    const progress = getWordProgress(card.id);
    if (progress.dueAt && progress.dueAt > now) {
      progress.dueAt = Math.max(now, progress.dueAt - advanceMs);
      progress.intervalDays = Math.max(0, daysFromMs(progress.dueAt - now));
    }
  });
}

// Read-only callers (deck building, review list, analytics, scheduling
// queries) far outnumber the handful that actually record progress. Only the
// latter pass { persist: true }; everyone else gets a throwaway default object
// and the store is never polluted with no-information entries — which is what
// kept bloating both the in-memory state and the saved payload.
function getWordProgress(cardId, { persist = false } = {}) {
  // A derived card (none exist in the current BBH data — see
  // IRREGULAR_CARD_CONFIGS) would share its base card's progress entry.
  // Deck mechanics (marks, cycle state, deck order) keep the suffixed id;
  // only this progress-store identity is normalized.
  cardId = progressCardId(cardId);
  const progressStore = getDirectionalProgressStore();
  const existing = progressStore[cardId];
  if (existing && typeof existing === 'object') {
    existing.seenCount = Number.isFinite(existing.seenCount) ? Math.max(0, existing.seenCount) : 0;
    existing.passCount = Number.isFinite(existing.passCount) ? Math.max(0, existing.passCount) : 0;
    existing.failCount = Number.isFinite(existing.failCount) ? Math.max(0, existing.failCount) : 0;
    existing.streak = Number.isFinite(existing.streak) ? Math.max(0, existing.streak) : 0;
    existing.easyStreak = Number.isFinite(existing.easyStreak) ? Math.max(0, existing.easyStreak) : 0;
    existing.srsStage = Number.isFinite(existing.srsStage) ? Math.max(0, Math.floor(existing.srsStage)) : 0;
    existing.ease = clamp(Number.isFinite(existing.ease) ? existing.ease : 2.3, 1.3, 3.0);
    existing.intervalDays = Number.isFinite(existing.intervalDays) ? Math.max(0, existing.intervalDays) : 0;
    existing.lastEasyIntervalDays = Number.isFinite(existing.lastEasyIntervalDays) ? Math.max(0, existing.lastEasyIntervalDays) : 0;
    existing.dueAt = Number.isFinite(existing.dueAt) ? Math.max(0, existing.dueAt) : 0;
    existing.lastReviewedAt = Number.isFinite(existing.lastReviewedAt) ? Math.max(0, existing.lastReviewedAt) : 0;
    existing.firstSeenAt = Number.isFinite(existing.firstSeenAt) ? Math.max(0, existing.firstSeenAt) : 0;
    existing.firstConfirmedAt = Number.isFinite(existing.firstConfirmedAt) ? Math.max(0, existing.firstConfirmedAt) : 0;
    existing.confidence = Number.isFinite(existing.confidence) ? Math.max(0, existing.confidence) : 0;
    existing.confidenceHistory = Array.isArray(existing.confidenceHistory) ? existing.confidenceHistory.filter(value => Number.isFinite(value)).slice(-10) : [];
    // Lapse / relearn ladder + leech + variant-cycle bookkeeping (see
    // applySpacedReview). All default to a no-lapse, no-cycle state so legacy
    // entries keep their current schedule.
    existing.inRelearn = existing.inRelearn === true;
    existing.relearnLeft = Number.isFinite(existing.relearnLeft) ? Math.max(0, Math.floor(existing.relearnLeft)) : 0;
    existing.preLapseIntervalDays = Number.isFinite(existing.preLapseIntervalDays) ? Math.max(0, existing.preLapseIntervalDays) : 0;
    existing.lapseCount = Number.isFinite(existing.lapseCount) ? Math.max(0, Math.floor(existing.lapseCount)) : 0;
    existing.leechDrill = existing.leechDrill === true;
    existing.leechStreak = Number.isFinite(existing.leechStreak) ? Math.max(0, Math.floor(existing.leechStreak)) : 0;
    existing.cycleFacesPassed = Array.isArray(existing.cycleFacesPassed) ? existing.cycleFacesPassed.filter(f => typeof f === 'string') : [];
    existing.cycleFacesUncertain = Array.isArray(existing.cycleFacesUncertain) ? existing.cycleFacesUncertain.filter(f => typeof f === 'string') : [];
    existing.cycleFacesHeld = (existing.cycleFacesHeld && typeof existing.cycleFacesHeld === 'object' && !Array.isArray(existing.cycleFacesHeld)) ? existing.cycleFacesHeld : {};
    existing.cycleStartedAt = Number.isFinite(existing.cycleStartedAt) ? Math.max(0, existing.cycleStartedAt) : 0;
    existing.cycleFaceSamples = (existing.cycleFaceSamples && typeof existing.cycleFaceSamples === 'object' && !Array.isArray(existing.cycleFaceSamples)) ? existing.cycleFaceSamples : {};
    return existing;
  }
  const fresh = {
    seenCount: 0,
    passCount: 0,
    failCount: 0,
    streak: 0,
    easyStreak: 0,
    srsStage: 0,
    ease: 2.3,
    intervalDays: 0,
    lastEasyIntervalDays: 0,
    dueAt: 0,
    lastReviewedAt: 0,
    firstSeenAt: 0,
    firstConfirmedAt: 0,
    confidence: 0,
    confidenceHistory: [],
    inRelearn: false,
    relearnLeft: 0,
    preLapseIntervalDays: 0,
    lapseCount: 0,
    leechDrill: false,
    leechStreak: 0,
    cycleFacesPassed: [],
    cycleFacesUncertain: [],
    cycleFacesHeld: {},
    cycleStartedAt: 0,
    cycleFaceSamples: {}
  };
  if (persist) progressStore[cardId] = fresh;
  return fresh;
}

function isCardDue(card) {
  if (!runtime.spacedRepetition) return true;
  const progress = getWordProgress(card.id);
  const naturallyDue = !progress.dueAt || progress.dueAt <= Date.now();

  // Variant-form round model: cards that share one progress entry — a base verb
  // and its derived principal-part faces (the "… as cards" toggles) — run as a
  // ROUND, one attempt at the whole set bounded by a 2 h window from when its
  // first face is seen (progress.cycleStartedAt). Each face is marked until it
  // reaches a FINAL disposition this round — Easy (cycleFacesPassed) or Uncertain
  // (cycleFacesUncertain); a Hard just requeues the face (no final mark). A face
  // that is final is parked OUT of "Due now" (deferred until the round resolves);
  // a face still pending (unreached, or Hard-requeued) stays due so it keeps
  // surfacing. The set only advances its shared schedule when EVERY face is
  // cleared Easy in one round (see applySpacedReview); any Uncertain in the mix —
  // or the 2 h window elapsing with faces still pending — resets the whole set so
  // it can be re-attempted. Each round close records one confidence sample (mean
  // across faces, an unreached form counting 0%). See applySpacedReview /
  // getVariantCycleInfo / endVariantRound.
  const info = getVariantCycleInfo(card);
  if (info) {
    const passed = progress.cycleFacesPassed;
    const uncertain = progress.cycleFacesUncertain || [];
    const inProgress = progress.cycleStartedAt > 0
      || passed.length > 0
      || uncertain.length > 0
      || (progress.cycleFacesHeld && Object.keys(progress.cycleFacesHeld).length > 0);
    if (naturallyDue) {
      // The shared 2 h round window has elapsed (or a fresh sitting): close out
      // any in-progress round — recording its confidence with unreached faces at
      // 0% — then put the WHOLE set due-now so a fresh round begins cleanly with
      // every face surfaceable again (an incomplete set, where not all faces were
      // cleared in time, isn't left half-done — all forms reset to due now).
      if (inProgress) {
        endVariantRound(progress, info.siblingFaces);
        progress.dueAt = Date.now();
        progress.intervalDays = 0;
      }
      return true;
    }
    if (!inProgress) return false;                   // set scheduled out, not mid-round
    if (passed.includes(info.face)) return false;    // Easy-cleared this round → parked
    if (uncertain.includes(info.face)) return false; // Uncertain this round → parked (deferred)
    return true;                                     // pending face → due now (unreached / Hard-requeued)
  }
  return naturallyDue;
}

// Close out a variant set's current round: record its confidence (mean across
// all active faces, a face never reached this round counting 0%) and clear the
// per-round bookkeeping so the next review opens a fresh round. The confidence
// is only recorded for a real, post-change round (cycleStartedAt set) — a legacy
// mid-cycle entry with no start stamp is just reset, never scored a spurious 0.
function endVariantRound(progress, siblingFaces) {
  if (progress.cycleStartedAt > 0) recordVariantRoundConfidence(progress, siblingFaces);
  progress.cycleFacesPassed = [];
  progress.cycleFacesUncertain = [];
  progress.cycleFacesHeld = {};
  progress.cycleStartedAt = 0;
  progress.cycleFaceSamples = {};
}

// Map of shared-progress id → set of face keys currently in the deck, memoized
// against runtime.originalDeck (which already reflects the "… as cards" toggles,
// so a face only appears here while its toggle is on). A progress id with two+
// faces is a variant set subject to all-forms gating.
let variantFacesCache = { deck: null, map: new Map() };
function getVariantFacesMap() {
  const deck = runtime.originalDeck || [];
  if (variantFacesCache.deck === deck) return variantFacesCache.map;
  const map = new Map();
  deck.forEach(card => {
    const face = derivedCardFaceKey(card);
    if (!face) return;
    const pid = progressCardId(card.id);
    if (!map.has(pid)) map.set(pid, new Set());
    map.get(pid).add(face);
  });
  variantFacesCache = { deck, map };
  return map;
}

// For a card that belongs to a multi-face variant set, its own face key plus the
// set of sibling faces in play. Returns null for ordinary single-face cards
// (and for variant lemmas whose derived toggles are all off, so only the base
// face is in the deck) — those have no all-forms gating.
function getVariantCycleInfo(card) {
  // Cheap reject first: only cards whose shared id has 2+ faces in the deck can
  // be gated, so skip the flip-set scan in derivedCardFaceKey for everyone else.
  const faces = getVariantFacesMap().get(progressCardId(card.id));
  if (!faces || faces.size <= 1) return null;
  const face = derivedCardFaceKey(card);
  if (!face) return null;
  return { face, siblingFaces: faces, siblingCount: faces.size };
}

function sortCardsByDue(cards) {
  return [...cards].sort((a, b) => {
    const aDue = getWordProgress(a.id).dueAt || 0;
    const bDue = getWordProgress(b.id).dueAt || 0;
    if (aDue !== bDue) return aDue - bDue;
    return a.id.localeCompare(b.id);
  });
}

function clearSpacedUndoSnapshot() {
  // Clears both the single-level spaced/morph snapshot and the unspaced
  // history stack. The two share the same "the deck context just
  // changed, drop any pending undo" invalidation points (mode toggles,
  // deck rebuilds, resets, selection changes), so collapsing them into
  // one clear keeps every call site honest.
  runtime.spacedUndoSnapshot = null;
  runtime.unspacedHistory = [];
}

// Snapshot of everything markCard / applyUnspacedMark / a reshuffle can
// mutate. Used by both the single-shot spaced/morph undo and the
// multi-step unspaced history stack.
function buildUndoSnapshot(extra = {}) {
  return {
    selectedKeys: cloneForUndo(runtime.selectedKeys),
    currentSessionId: runtime.currentSession ? runtime.currentSession.id : null,
    studyMode: runtime.studyMode,
    directionToGreek: runtime.directionToGreek,
    requiredOnly: runtime.requiredOnly,
    shuffled: runtime.shuffled,
    spacedRepetition: runtime.spacedRepetition,
    currentIdx: runtime.currentIdx,
    activeDeckCount: runtime.activeDeckCount,
    isFlipped: runtime.isFlipped,
    unspacedPendingRecycle: runtime.unspacedPendingRecycle,
    unspacedRoundSize: runtime.unspacedRoundSize,
    unspacedRoundMarks: runtime.unspacedRoundMarks,
    unspacedMiddleIds: Array.from(runtime.unspacedMiddleIds || []),
    unspacedMiddleCount: runtime.unspacedMiddleCount || 0,
    // Three-deck spaced state — captured here so the 2% revival (which can
    // fire between the snapshot and the next user action) doesn't leave
    // stale spacedActiveIds/middleDeckCount lying around after an undo.
    // Without this, the visible card is correct after undo but the next
    // navigation can mis-route end-of-active or treat a card as middle when
    // it should be active.
    spacedActiveIds: Array.isArray(runtime.spacedActiveIds) ? [...runtime.spacedActiveIds] : [],
    middleDeckCount: runtime.middleDeckCount || 0,
    lastStudyActivityAt: runtime.lastStudyActivityAt || 0,
    unspacedCycleState: cloneForUndo(runtime.unspacedCycleState),
    lastUnspacedArchiveDayKey: runtime.lastUnspacedArchiveDayKey,
    deck: cloneForUndo(runtime.deck),
    originalDeck: cloneForUndo(runtime.originalDeck),
    marksStore: cloneForUndo(getDirectionalMarksStore()),
    progressStore: cloneForUndo(getDirectionalProgressStore()),
    appUsageStats: cloneForUndo(runtime.appUsageStats),
    appGamification: cloneForUndo(runtime.appGamification),
    ...extra
  };
}

// Restore runtime.* from a previously built snapshot. Returns false if
// the snapshot is incompatible with the current selection/mode (in
// which case the caller should discard it rather than apply).
function applyUndoSnapshot(snapshot) {
  if (!snapshot) return false;
  if (runtime.studyMode !== snapshot.studyMode) return false;
  if (runtime.directionToGreek !== snapshot.directionToGreek) return false;
  if (runtime.requiredOnly !== snapshot.requiredOnly) return false;
  if (runtime.shuffled !== snapshot.shuffled) return false;
  if (runtime.spacedRepetition !== snapshot.spacedRepetition) return false;
  if (JSON.stringify(runtime.selectedKeys) !== JSON.stringify(snapshot.selectedKeys || [])) return false;
  if ((runtime.currentSession ? runtime.currentSession.id : null) !== (snapshot.currentSessionId || null)) return false;

  const marksStore = getDirectionalMarksStore();
  Object.keys(marksStore).forEach(key => delete marksStore[key]);
  Object.assign(marksStore, cloneForUndo(snapshot.marksStore) || {});

  const progressStore = getDirectionalProgressStore();
  Object.keys(progressStore).forEach(key => delete progressStore[key]);
  Object.assign(progressStore, cloneForUndo(snapshot.progressStore) || {});

  runtime.marks = marksStore;
  runtime.originalDeck = cloneForUndo(snapshot.originalDeck) || [];
  runtime.deck = cloneForUndo(snapshot.deck) || [];
  runtime.appUsageStats = ensureUsageStats(cloneForUndo(snapshot.appUsageStats));
  runtime.appGamification = sanitizeGamificationState(cloneForUndo(snapshot.appGamification));
  const restoredLevel = computeXpAndLevel(runtime.appUsageStats).currentLevel.level;
  if (!Number.isFinite(runtime.appGamification.lastCelebratedLevel) || runtime.appGamification.lastCelebratedLevel < 1 || runtime.appGamification.lastCelebratedLevel > restoredLevel) {
    runtime.appGamification.lastCelebratedLevel = restoredLevel;
  }
  // Reshuffle entries park the cursor at deck.length, so clamp to deck.length
  // (inclusive) rather than deck.length - 1.
  const maxIdx = runtime.deck.length;
  runtime.currentIdx = Math.max(0, Math.min(snapshot.currentIdx || 0, maxIdx));
  runtime.activeDeckCount = Math.max(0, snapshot.activeDeckCount || 0);
  runtime.isFlipped = !!snapshot.isFlipped;
  runtime.unspacedPendingRecycle = !!snapshot.unspacedPendingRecycle;
  if (Number.isFinite(snapshot.unspacedRoundSize)) runtime.unspacedRoundSize = snapshot.unspacedRoundSize;
  if (Number.isFinite(snapshot.unspacedRoundMarks)) runtime.unspacedRoundMarks = snapshot.unspacedRoundMarks;
  if (Array.isArray(snapshot.unspacedMiddleIds)) runtime.unspacedMiddleIds = new Set(snapshot.unspacedMiddleIds);
  if (Number.isFinite(snapshot.unspacedMiddleCount)) runtime.unspacedMiddleCount = snapshot.unspacedMiddleCount;
  if (Array.isArray(snapshot.spacedActiveIds)) runtime.spacedActiveIds = [...snapshot.spacedActiveIds];
  if (Number.isFinite(snapshot.middleDeckCount)) runtime.middleDeckCount = snapshot.middleDeckCount;
  if (Number.isFinite(snapshot.lastStudyActivityAt)) runtime.lastStudyActivityAt = snapshot.lastStudyActivityAt;
  if (snapshot.unspacedCycleState) runtime.unspacedCycleState = cloneForUndo(snapshot.unspacedCycleState);
  if (typeof snapshot.lastUnspacedArchiveDayKey === 'string') runtime.lastUnspacedArchiveDayKey = snapshot.lastUnspacedArchiveDayKey;
  return true;
}

function captureSpacedUndoSnapshot() {
  if (!runtime.selectedKeys.length || !runtime.deck[runtime.currentIdx]) {
    runtime.spacedUndoSnapshot = null;
    return;
  }
  if (runtime.spacedRepetition && runtime.currentIdx >= runtime.activeDeckCount) {
    runtime.spacedUndoSnapshot = null;
    return;
  }
  runtime.spacedUndoSnapshot = buildUndoSnapshot();
}

// Capacity cap on the unspaced history stack — full snapshots aren't
// tiny, and the user gets multi-step Prev without keeping every
// breadcrumb from a long session in memory.
const UNSPACED_HISTORY_MAX = 30;

// Push a snapshot tagged with the kind of action it's the inverse of.
// 'mark' entries roll back a confidence-impacting Hard/Uncertain/Easy
// (Prev label shows "↶ Undo"); 'next' entries roll back the neutral
// pass; 'reshuffle' entries roll back the end-of-deck shuffle.
function pushUnspacedHistory(entryType) {
  if (!Array.isArray(runtime.unspacedHistory)) runtime.unspacedHistory = [];
  if (!runtime.selectedKeys.length) return;
  // Reshuffles capture from the end-of-deck parked state, where
  // deck[currentIdx] is undefined; everything else needs a real card.
  if (entryType !== 'reshuffle' && (runtime.currentIdx >= runtime.deck.length || !runtime.deck[runtime.currentIdx])) return;

  const snapshot = buildUndoSnapshot({ entryType });
  runtime.unspacedHistory.push(snapshot);
  if (runtime.unspacedHistory.length > UNSPACED_HISTORY_MAX) {
    runtime.unspacedHistory.splice(0, runtime.unspacedHistory.length - UNSPACED_HISTORY_MAX);
  }
}

function restoreUnspacedHistoryStep() {
  if (!Array.isArray(runtime.unspacedHistory) || !runtime.unspacedHistory.length) return false;
  const snapshot = runtime.unspacedHistory.pop();
  const restored = applyUndoSnapshot(snapshot);
  if (!restored) {
    // Snapshot from a different mode/selection — discard the whole stack
    // rather than leaving incompatible entries to surface later.
    runtime.unspacedHistory = [];
    return false;
  }
  renderCard();
  renderReview();
  renderProgress();
  syncLayoutVisibility();
  saveState();
  return true;
}

function getUnspacedHistoryTopType() {
  if (!Array.isArray(runtime.unspacedHistory) || !runtime.unspacedHistory.length) return null;
  return runtime.unspacedHistory[runtime.unspacedHistory.length - 1].entryType || null;
}

function restoreSpacedUndo() {
  if (!runtime.spacedUndoSnapshot) return;
  const restored = applyUndoSnapshot(runtime.spacedUndoSnapshot);
  if (!restored) return;
  clearSpacedUndoSnapshot();
  renderCard();
  renderReview();
  renderProgress();
  syncLayoutVisibility();
  saveState();
}

// Returns a deck where deck[0] is guaranteed not to equal avoidHeadId — used
// to prevent a card the user just saw at the end of one cycle from appearing
// first in the very next cycle. Mutates the input array in place.
function avoidHeadCollision(deck, avoidHeadId) {
  if (!avoidHeadId || !Array.isArray(deck) || deck.length < 2) return deck;
  if (!deck[0] || deck[0].id !== avoidHeadId) return deck;
  // Pick a random later slot to swap into; the original head moves elsewhere
  // in the deck rather than being deferred to the very end (which would be
  // predictable). With ≥ 2 cards there's always at least one valid swap.
  const swapIdx = 1 + Math.floor(Math.random() * (deck.length - 1));
  [deck[0], deck[swapIdx]] = [deck[swapIdx], deck[0]];
  return deck;
}

function buildStudyDeck(cards, options = {}) {
  if (!runtime.spacedRepetition) {
    // Unspaced flip deck has three sections: [active..., middle..., known...].
    //   active — cards not yet seen this round (the in-flight pile).
    //   middle — cards Hard/Uncertain-marked this round, parked until the
    //            next reshuffle so they don't reappear before the round ends.
    //   known  — Easy-archived cards; stay out until the user resets.
    // Default: every fresh build starts a new round, so middle clears and
    // every unmarked card collapses back into active. Callers that need to
    // preserve mid-round middle membership pass preserveUnspacedRound: true.
    if (options.preserveUnspacedRound !== true) {
      runtime.unspacedMiddleIds = new Set();
    }
    const middleIds = runtime.unspacedMiddleIds || new Set();
    const active = cards.filter(card => runtime.marks[card.id] !== 'known' && !middleIds.has(card.id));
    const middle = cards.filter(card => runtime.marks[card.id] !== 'known' && middleIds.has(card.id));
    const known = cards.filter(card => runtime.marks[card.id] === 'known');
    runtime.activeDeckCount = active.length;
    runtime.unspacedMiddleCount = middle.length;
    const orderedActive = runtime.shuffled ? shuffleArray([...active]) : [...active];
    avoidHeadCollision(orderedActive, options.avoidHeadId);
    if (options.preserveUnspacedRound !== true) {
      runtime.unspacedRoundSize = orderedActive.length;
      runtime.unspacedRoundMarks = 0;
    }
    return [...orderedActive, ...middle, ...known];
  }

  // Three-section spaced deck: [active..., middle..., deferred...].
  //   active  — due-now cards already in the in-flight rotation. Drains as
  //             the user reviews; preserved in order across rebuilds.
  //   middle  — due-now cards that weren't in active when the session
  //             started (their dueAt timer expired mid-session, OR they got
  //             pushed back to due by ✕-return). Doesn't interrupt the
  //             active rotation; only joins active when active drains,
  //             when the user hits the Reshuffle button, on a 2% revival,
  //             or after a ≥ 5 h idle gap.
  //   deferred — dueAt in the future, sorted by dueAt.
  // runtime.spacedActiveIds is the source of truth for who lives in active;
  // it's filtered on every rebuild against the currently-due set, so reviewed
  // cards (now scheduled forward) drop out automatically.
  const forceShuffle = !!options.forceShuffle;
  const shuffleActive = !!options.shuffleActive;
  const now = Date.now();
  let promotedNearCards = false;
  let dueCards = cards.filter(isCardDue);

  // Backstop: if nothing is due but cards are deferred within 30 minutes,
  // promote them to due immediately so the user never hits a dead deck.
  if (!dueCards.length) {
    const nearCards = cards.filter(card => {
      const p = getWordProgress(card.id);
      return p.dueAt && p.dueAt > now && p.dueAt <= now + SRS_NEAR_WINDOW_MS;
    });
    if (nearCards.length) {
      nearCards.forEach(card => {
        const progress = getWordProgress(card.id);
        progress.dueAt = now;
        progress.intervalDays = 0;
      });
      promotedNearCards = true;
      dueCards = cards.filter(isCardDue);
    }
  }

  const deferredCards = cards.filter(card => !isCardDue(card));
  const dueIds = new Set(dueCards.map(c => c.id));

  // Drop any carry-over IDs that aren't due anymore (reviewed cards that
  // got bumped to deferred, or stale IDs from a different deck after a
  // mode/chapter switch).
  const carriedActiveIds = (runtime.spacedActiveIds || []).filter(id => dueIds.has(id));

  // Treat as a fresh start when:
  //  - the caller asked for it (forceShuffle: manual reshuffle, active-drain
  //    dump, or restore path),
  //  - the near-due backstop just fired (no real active to carry forward),
  //  - the last card flip was ≥ 5 h ago (genuine idle gap), or
  //  - there's no carry-over at all (initial build, post-reload, post-reset,
  //    or deck-identity change so no previous active IDs match the new deck).
  // Use the previous-activity snapshot (taken at the start of the current
  // noteStudyInteraction call) so the idle gap reflects time since the
  // PREVIOUS activity, not the one we just recorded a millisecond ago.
  const lastActivityAt = Number(runtime.previousStudyActivityAt) || 0;
  const idleReset = lastActivityAt && (now - lastActivityAt > SESSION_IDLE_RESET_MS);
  const freshStart = forceShuffle || promotedNearCards || idleReset || carriedActiveIds.length === 0;

  let activeDue;
  let middleDue;
  if (freshStart) {
    // Everything currently due collapses into active; middle clears.
    activeDue = runtime.shuffled ? shuffleArray([...dueCards]) : sortCardsByDue(dueCards);
    avoidHeadCollision(activeDue, options.avoidHeadId);
    middleDue = [];
  } else {
    // Continue session: preserve the in-flight active order from the
    // previous deck where possible; anything else due lives in middle.
    const carriedSet = new Set(carriedActiveIds);
    const seen = new Set();
    const orderedFromPrev = [];
    (runtime.deck || []).forEach(card => {
      if (!card || !carriedSet.has(card.id) || seen.has(card.id)) return;
      const match = dueCards.find(d => d.id === card.id);
      if (match) {
        orderedFromPrev.push(match);
        seen.add(card.id);
      }
    });
    const orphans = carriedActiveIds
      .filter(id => !seen.has(id))
      .map(id => dueCards.find(d => d.id === id))
      .filter(Boolean);
    activeDue = [...orderedFromPrev, ...orphans];
    if (shuffleActive) activeDue = shuffleArray(activeDue);
    middleDue = sortCardsByDue(dueCards.filter(c => !carriedSet.has(c.id)));
  }

  runtime.spacedActiveIds = activeDue.map(c => c.id);
  runtime.activeDeckCount = activeDue.length;
  runtime.middleDeckCount = middleDue.length;
  const orderedDeferred = sortCardsByDue(deferredCards);
  return [...activeDue, ...middleDue, ...orderedDeferred];
}

// `skipConfidence` is set by the variant-set path (spaced mode): those cards
// score confidence once per ROUND from the mean of their faces, not once per
// face review, so the per-review rolling sample is suppressed here and the
// round sample is recorded by endVariantRound instead.
function recordStudyOutcome(cardId, outcome, reviewedAt = Date.now(), { skipConfidence = false } = {}) {
  const progress = getWordProgress(cardId, { persist: true });
  const isFirstConfirmation = !progress.firstConfirmedAt;
  const xpAward = computeCardXpAward(outcome, isFirstConfirmation, runtime.spacedRepetition);
  const usage = ensureUsageStats();
  if (usage.cardXpEarned < 0) migrateLegacyXp(usage);
  usage.cardXpEarned = (usage.cardXpEarned || 0) + xpAward;
  progress.seenCount += 1;
  progress.lastReviewedAt = reviewedAt;
  progress.firstSeenAt = progress.firstSeenAt || reviewedAt;
  if (!skipConfidence) recordConfidenceSample(progress, outcome);
  if (!progress.firstConfirmedAt) {
    const pct = getConfidencePct(progress);
    if (pct !== null && pct >= 70) progress.firstConfirmedAt = reviewedAt;
  }
  if (outcome === 'easy' || outcome === 'known') {
    progress.passCount += 1;
    progress.firstConfirmedAt = progress.firstConfirmedAt || reviewedAt;
  } else {
    progress.failCount += 1;
  }
  return progress;
}

// Active SRS spacing-cadence preset (2-month intensive vs 8-month). Read by
// the schedulers so the same flip lands a shorter or longer next interval
// depending on the course-length toggle in Advanced settings.
function getActiveCadence() {
  return getCadencePreset(runtime.spacingCadence);
}

function getDeckAggregateStats(cards = runtime.originalDeck) {
  // Shared base/second-aorist progress entries count once, not per face.
  const counted = new Set();
  return (cards || []).reduce((totals, card) => {
    const progressId = progressCardId(card.id);
    if (counted.has(progressId)) return totals;
    counted.add(progressId);
    const progress = getWordProgress(card.id);
    totals.seenCount += progress.seenCount || 0;
    totals.passCount += progress.passCount || 0;
    totals.failCount += progress.failCount || 0;
    return totals;
  }, { seenCount: 0, passCount: 0, failCount: 0 });
}

// Pre-lapse interval to resume at half of: the largest "real" spacing the card
// had before it slipped (its last easy step or its current interval), captured
// before the lapse resets the live interval.
function preLapseIntervalDays(progress) {
  return Math.max(getLastEasyIntervalDays(progress), Number(progress.intervalDays) || 0);
}

// Normal "easy" growth: confidence/ease-scaled step up the cadence ramp.
function applyEasyGrowth(progress, cadence, now) {
  const nextIntervalDays = getNextEasyIntervalDays(progress, cadence);
  progress.streak += 1;
  progress.easyStreak = (progress.easyStreak || 0) + 1;
  progress.srsStage = getSrsStage(progress) + 1;
  progress.ease = clamp(getSrsEase(progress) + 0.08, 1.3, 3.0);
  progress.lastEasyIntervalDays = nextIntervalDays;
  progress.firstConfirmedAt = progress.firstConfirmedAt || now;
  setProgressDelay(progress, msFromDays(nextIntervalDays), now);
}

// Resume after a relearn ladder (or leech unpin): pick up at HALF the pre-lapse
// interval, capped per cadence and floored at one relearn step, so weeks of
// spacing aren't lost to a single slip.
function resumeAfterLapse(progress, cadence, now) {
  const resumeDays = clamp(preLapseIntervalDays(progress) * 0.5, SRS_RELEARN_STEP_DAYS, cadence.lapseResumeCapDays);
  progress.inRelearn = false;
  progress.relearnLeft = 0;
  progress.streak += 1;
  progress.easyStreak = (progress.easyStreak || 0) + 1;
  progress.lastEasyIntervalDays = resumeDays;
  setProgressDelay(progress, msFromDays(resumeDays), now);
}

// Hard lapse: drop ease, count the lapse, and either start the leech drill
// (8-month, once a card has lapsed too many times) or the in-session relearn
// ladder (due now → two 1-day passes → resume at ½). The pre-lapse interval is
// preserved on the entry so the ladder's short steps don't erase it. Returns
// true if the card should also be dropped from the active carry-over (it's
// due-now and should route through the middle pile in-session).
function applyHardLapse(progress, cadence, now) {
  progress.streak = 0;
  progress.easyStreak = 0;
  progress.srsStage = Math.max(0, getSrsStage(progress) - 1);
  progress.ease = clamp(getSrsEase(progress) - 0.2, 1.3, 3.0);
  progress.lapseCount = (progress.lapseCount || 0) + 1;

  // Leech (8-month only): a card that keeps failing is pinned to a 1-day drill
  // until it earns a clean streak, rebuilding from the bottom.
  if (cadence.leechEnabled && (progress.leechDrill || progress.lapseCount >= LEECH_LAPSE_THRESHOLD)) {
    progress.leechDrill = true;
    progress.leechStreak = 0;
    progress.inRelearn = false;
    progress.relearnLeft = 0;
    progress.lastEasyIntervalDays = LEECH_DRILL_DAYS;
    setProgressDelay(progress, msFromDays(LEECH_DRILL_DAYS), now);
    return false;
  }

  // Capture the pre-lapse spacing once (a re-lapse mid-relearn keeps the
  // original, not the now-tiny, interval).
  if (!progress.inRelearn) progress.preLapseIntervalDays = preLapseIntervalDays(progress);
  progress.inRelearn = true;
  progress.relearnLeft = SRS_HARD_RELEARN_STEPS;
  setProgressDelay(progress, 0, now); // due now — relearn in-session
  return true;
}

// Uncertain lapse: one confirming pass in 2h, then resume at ½ previous. Ease
// unchanged. (relearnLeft 0 → the next correct answer resumes directly.)
function applyUncertainLapse(progress, now) {
  if (!progress.inRelearn) progress.preLapseIntervalDays = preLapseIntervalDays(progress);
  progress.inRelearn = true;
  progress.relearnLeft = 0;
  progress.streak += 1;
  progress.easyStreak = 0;
  setProgressDelay(progress, SRS_UNCERTAIN_MIN_MS, now); // 2h confirming pass
}

// A correct answer (Easy or Uncertain) while a card is mid-relearn or
// mid-leech, or starting/continuing those ladders. Returns nothing; mutates
// the schedule on `progress`.
function applyCorrectOutcome(progress, cadence, now, ratedOutcome) {
  // Leech drill: stay pinned at 1 day until LEECH_UNPIN_STREAK clean reviews,
  // then rejoin normal growth (fall through to the easy ramp from a 1-day base).
  if (progress.leechDrill) {
    progress.leechStreak = (progress.leechStreak || 0) + 1;
    if (progress.leechStreak < LEECH_UNPIN_STREAK) {
      progress.streak += 1;
      setProgressDelay(progress, msFromDays(LEECH_DRILL_DAYS), now);
      return;
    }
    progress.leechDrill = false;
    progress.leechStreak = 0;
    progress.lapseCount = 0;
    progress.lastEasyIntervalDays = LEECH_DRILL_DAYS;
    applyEasyGrowth(progress, cadence, now);
    return;
  }

  // Relearn ladder: spend the remaining 1-day steps, then resume at ½ previous.
  if (progress.inRelearn) {
    if ((progress.relearnLeft || 0) > 0) {
      progress.relearnLeft -= 1;
      progress.streak += 1;
      setProgressDelay(progress, msFromDays(SRS_RELEARN_STEP_DAYS), now);
      return;
    }
    resumeAfterLapse(progress, cadence, now);
    return;
  }

  // Not in any ladder. An Uncertain on an established card IS a lapse — start
  // the short uncertain relearn (ease unchanged, per spec). An Easy grows.
  if (ratedOutcome === 'pass') {
    applyUncertainLapse(progress, now);
    return;
  }
  applyEasyGrowth(progress, cadence, now);
}

function applySpacedReview(card, outcome) {
  const now = Date.now();
  const ratedOutcome = outcome === 'pass' ? 'pass' : outcome === 'easy' ? 'easy' : 'again';
  const cadence = getActiveCadence();
  // Variant-form set this card belongs to (null for ordinary single-face cards).
  const variant = getVariantCycleInfo(card);
  // Variant sets score confidence once per round (mean of the faces), so the
  // per-face rolling sample is suppressed here; addVariantFaceSample collects
  // the face's sample for the round instead.
  const progress = recordStudyOutcome(card.id, ratedOutcome, now, { skipConfidence: !!variant });

  if (variant) {
    applyVariantRoundReview(card, ratedOutcome, variant, progress, cadence, now);
    return;
  }

  if (ratedOutcome === 'again') {
    const dropFromActive = applyHardLapse(progress, cadence, now);
    if (dropFromActive && Array.isArray(runtime.spacedActiveIds)) {
      runtime.spacedActiveIds = runtime.spacedActiveIds.filter(id => id !== card.id);
    }
    getDirectionalMarksStore()[card.id] = 'unsure';
  } else {
    applyCorrectOutcome(progress, cadence, now, ratedOutcome);
    getDirectionalMarksStore()[card.id] = ratedOutcome === 'easy' ? 'known' : 'unsure';
  }

  progress.lastSpacedOutcome = ratedOutcome;
  runtime.marks = getDirectionalMarksStore();
}

// One review of a face in a variant "split card" set (a base verb + its derived
// principal-part faces sharing one progress entry). The set runs as a ROUND —
// one attempt at the whole set, bounded by a 2 h window from when its first face
// is seen — and resolves like this:
//   • Hard  → requeue the face through the middle pile (no lapse, no round end).
//             It stays pending, so it keeps coming back until it's Easy/Uncertain.
//   • Easy  → finalize the face as cleared; it parks out of "Due now" (deferred)
//             until the round resolves.
//   • Uncertain → finalize the face as uncertain; it also parks out of "Due now"
//             (deferred) until the round resolves. It does NOT keep re-surfacing
//             this sitting — the whole set resets first (see below).
// Once EVERY face is final (Easy or Uncertain): all-Easy advances the shared
// schedule (~1 day for a fresh set, growing thereafter); any Uncertain in the
// mix resets the whole set — every face back to due-now for a fresh round. The
// 2 h window elapsing with faces still pending resets it the same way (handled
// in isCardDue). Each round close records one confidence sample.
function applyVariantRoundReview(card, ratedOutcome, variant, progress, cadence, now) {
  const marks = getDirectionalMarksStore();
  // Open a fresh round on the first mark after the previous one ended — or if the
  // 2 h window of a still-open round has already elapsed (the user came back
  // late), close that one out first so this mark starts a new attempt.
  if (progress.cycleStartedAt > 0 && now >= progress.cycleStartedAt + SRS_VARIANT_HOLD_MS) {
    endVariantRound(progress, variant.siblingFaces);
  }
  if (!(progress.cycleStartedAt > 0)) {
    progress.cycleStartedAt = now;
    progress.cycleFaceSamples = {};
  }
  addVariantFaceSample(progress, variant.face, ratedOutcome);

  // The round shares one deadline: 2 h after its first face was seen.
  const roundDeadlineMs = Math.max(0, (progress.cycleStartedAt + SRS_VARIANT_HOLD_MS) - now);
  const finish = () => {
    progress.lastSpacedOutcome = ratedOutcome;
    runtime.marks = marks;
  };
  // Drop the just-marked face from the active pile so navigate(1) advances to the
  // next card rather than re-rendering this one (it advances by relying on a
  // marked card leaving active, not by incrementing the cursor). A pending face
  // (Hard) returns from "middle" after the other due cards; a final face is
  // deferred and won't return until the round resolves.
  const dropFromActive = () => {
    if (Array.isArray(runtime.spacedActiveIds)) {
      runtime.spacedActiveIds = runtime.spacedActiveIds.filter(id => id !== card.id);
    }
  };

  // Hard / miss → requeue the face (no lapse, no round end). It stays pending and
  // keeps coming back (via the middle pile) until it's marked Easy or Uncertain.
  if (ratedOutcome === 'again') {
    setProgressDelay(progress, roundDeadlineMs, now);
    dropFromActive();
    marks[card.id] = 'unsure';
    finish();
    return;
  }

  // Easy or Uncertain → finalize this face (it parks out of "Due now").
  const passed = new Set(progress.cycleFacesPassed);
  const uncertain = new Set(progress.cycleFacesUncertain || []);
  if (ratedOutcome === 'easy') {
    passed.add(variant.face);
    uncertain.delete(variant.face);
    marks[card.id] = 'known';
  } else { // 'pass' → Uncertain
    uncertain.add(variant.face);
    passed.delete(variant.face);
    marks[card.id] = 'unsure';
  }
  progress.cycleFacesPassed = [...passed];
  progress.cycleFacesUncertain = [...uncertain];
  progress.streak += 1;
  setProgressDelay(progress, roundDeadlineMs, now);
  dropFromActive();

  // Not every face is final yet → leave the round in progress.
  const allFinal = [...variant.siblingFaces].every(f => passed.has(f) || uncertain.has(f));
  if (!allFinal) {
    finish();
    return;
  }

  // Every face is final this round. Record the round's confidence, then:
  if (uncertain.size === 0) {
    // All Easy → set complete: advance the shared schedule (~1 day for a fresh
    // set, growing with confidence on later rounds).
    endVariantRound(progress, variant.siblingFaces);
    applyCorrectOutcome(progress, cadence, now, 'easy');
    marks[card.id] = 'known';
  } else {
    // Any Uncertain in the mix → reset the whole set: every face back to due-now
    // for a fresh round so the learner can re-attempt the forms they were unsure
    // of (along with the rest).
    endVariantRound(progress, variant.siblingFaces);
    setProgressDelay(progress, 0, now);
  }
  finish();
}

function getDueCount(cards = runtime.originalDeck) {
  return (cards || []).filter(isCardDue).length;
}

// Count of cards that the end-of-deck "advance 1 h" Next press would
// promote from deferred to due-now. Used by render.js to show the user
// "(N near-due)" in brackets on the spaced session-complete card so
// they know whether pressing Next will actually surface more work.
function getNearDueCount(cards = runtime.originalDeck) {
  const now = Date.now();
  const threshold = now + SRS_CYCLE_ADVANCE_MS;
  return (cards || []).filter(card => {
    const p = getWordProgress(card.id);
    return p.dueAt && p.dueAt > now && p.dueAt <= threshold;
  }).length;
}




function getKnownCount() {
  return runtime.originalDeck.filter(card => runtime.marks[card.id] === 'known').length;
}

function getHighConfidenceCount() {
  return runtime.originalDeck.filter(card => {
    const pct = getConfidencePct(getWordProgress(card.id));
    return pct !== null && pct > 75;
  }).length;
}

function getRemainingCards() {
  if (runtime.spacedRepetition) {
    return runtime.deck.slice(0, runtime.activeDeckCount);
  }
  return runtime.deck.filter(card => runtime.marks[card.id] !== 'known');
}

function moveCardToBackOfActivePile(card) {
  if (!card) return false;
  const directionalMarks = getDirectionalMarksStore();

  const currentCardId = runtime.deck[runtime.currentIdx]?.id || null;
  directionalMarks[card.id] = 'unsure';
  runtime.marks = directionalMarks;

  runtime.deck = runtime.deck.filter(candidate => candidate.id !== card.id);
  const splitAt = runtime.deck.findIndex(candidate => runtime.marks[candidate.id] === 'known');
  const insertAt = splitAt === -1 ? runtime.deck.length : splitAt;
  runtime.deck.splice(insertAt, 0, card);

  runtime.activeDeckCount = runtime.originalDeck.filter(candidate => runtime.marks[candidate.id] !== 'known').length;
  if (currentCardId) {
    const restoredIdx = runtime.deck.findIndex(candidate => candidate.id === currentCardId);
    if (restoredIdx >= 0) runtime.currentIdx = restoredIdx;
  }
  runtime.unspacedPendingRecycle = false;
  return true;
}

// Unspaced flip-deck hourly upcoming-cards reshuffle. Kept on its old
// cadence — the unspaced flow has no middle deck and still benefits from
// occasional order churn during long sessions.
const PERIODIC_RESHUFFLE_MIN_MS = 60 * 60 * 1000;

function maybePeriodicReshuffle() {
  // Spaced mode handles session boundaries inside buildStudyDeck via
  // SESSION_IDLE_RESET_MS, so there's nothing for this hook to do.
  if (runtime.spacedRepetition) return;
  if (!runtime.shuffled) return;
  runtime.flipsSinceReshuffle++;
  const now = Date.now();
  const lastAt = Number(runtime.lastPeriodicReshuffleAt) || 0;
  if (!lastAt) {
    runtime.lastPeriodicReshuffleAt = now;
    return;
  }
  if (now - lastAt < PERIODIC_RESHUFFLE_MIN_MS) return;
  runtime.lastPeriodicReshuffleAt = now;
  runtime.flipsSinceReshuffle = 0;
  reshuffleUpcomingCards();
}

// Per-flip ~1/50 (2%) chance to bring one high-confidence (>75%) deferred
// card back into the active pile. Skipped when shuffle is off or in
// morphology mode. The picked card is forced due, added to spacedActiveIds
// so it lands directly in active (not middle), and the active section is
// reshuffled so the returning card mixes in randomly instead of sitting on
// the back.
function maybeReturnConfirmedDeferredCard() {
  if (!runtime.spacedRepetition || !runtime.shuffled || isMorphologyMode()) return false;
  if (KNOWN_CARD_RANDOM_RETURN_FLIP_ODDS <= 0) return false;
  if (Math.random() >= 1 / KNOWN_CARD_RANDOM_RETURN_FLIP_ODDS) return false;

  const eligible = (runtime.originalDeck || []).filter(card => {
    if (isCardDue(card)) return false;
    const pct = getConfidencePct(getWordProgress(card.id));
    return pct !== null && pct > 75;
  });
  if (!eligible.length) return false;

  const pick = eligible[Math.floor(Math.random() * eligible.length)];
  getWordProgress(pick.id).dueAt = Date.now();
  runtime.spacedActiveIds = [...(runtime.spacedActiveIds || []), pick.id];
  runtime.deck = buildStudyDeck(runtime.originalDeck, { shuffleActive: true });
  return true;
}

function reshuffleUpcomingCards() {
  const start = runtime.currentIdx + 1;
  // In spaced mode keep deferred (not-yet-due) cards in their dueAt order at
  // the tail; only reshuffle the active (due) portion ahead of runtime.currentIdx.
  const end = runtime.spacedRepetition
    ? Math.min(runtime.activeDeckCount, runtime.deck.length)
    : runtime.deck.length;
  if (start >= end) return;
  const upcoming = [];
  const pinned = [];
  for (let i = start; i < end; i++) {
    const id = runtime.deck[i].id;
    if (runtime.marks[id] === 'known' || runtime.unspacedDeferredIds.has(id)) pinned.push(runtime.deck[i]);
    else upcoming.push(runtime.deck[i]);
  }
  if (upcoming.length < 2) return;
  const tail = runtime.deck.slice(end);
  runtime.deck = [...runtime.deck.slice(0, start), ...shuffleArray(upcoming), ...pinned, ...tail];
}

function maybeReturnKnownCardToActivePile() {
  if (runtime.spacedRepetition || isMorphologyMode() || KNOWN_CARD_RANDOM_RETURN_FLIP_ODDS <= 0) return false;
  if (!runtime.originalDeck.length || runtime.currentIdx >= runtime.deck.length) return false;

  const currentCardId = runtime.deck[runtime.currentIdx]?.id || null;
  const knownCards = runtime.originalDeck.filter(card => card.id !== currentCardId && runtime.marks[card.id] === 'known');
  if (!knownCards.length) return false;

  const returnChance = 1 / KNOWN_CARD_RANDOM_RETURN_FLIP_ODDS;
  if (Math.random() >= returnChance) return false;

  const card = knownCards[Math.floor(Math.random() * knownCards.length)];
  return moveCardToBackOfActivePile(card);
}


// Save/restore + JSON export/import + Transfer modal live in js/state/persistence.js

function startNextCycle(mode = 'remaining', options = {}) {
  runtime.unspacedDeferredIds = new Set();
  runtime.flipsSinceReshuffle = 0;
  // A new cycle is a fresh shuffle anchor — reset the hourly timer so the
  // next periodic reshuffle counts from now.
  runtime.lastPeriodicReshuffleAt = Date.now();
  if (mode === 'full') {
    const directionalMarks = getDirectionalMarksStore();
    (runtime.originalDeck || []).forEach(card => {
      delete directionalMarks[card.id];
    });
    runtime.marks = directionalMarks;
    const fullDeck = runtime.shuffled
      ? shuffleArray([...(runtime.originalDeck || [])])
      : [...(runtime.originalDeck || [])];
    avoidHeadCollision(fullDeck, options.avoidHeadId);
    runtime.deck = fullDeck;
    runtime.currentIdx = fullDeck.length ? 0 : runtime.deck.length;
  } else {
    const remaining = runtime.shuffled
      ? shuffleArray([...getRemainingCards()])
      : [...getRemainingCards()];
    avoidHeadCollision(remaining, options.avoidHeadId);
    const known = (runtime.originalDeck || []).filter(card => runtime.marks[card.id] === 'known');
    runtime.deck = [...remaining, ...known];
    runtime.currentIdx = remaining.length ? 0 : runtime.deck.length;
  }
  resetUnspacedCycleState();
  runtime.unspacedPendingRecycle = false;
  saveState();
}

// Onclick target for the Next button. Defers to navigate(1), which detects
// the "deck fully archived" case in unspaced vocab mode and re-routes the
// press to a no-confirm reset (the button's label morphs to "↻ Reset" via
// syncLayoutVisibility so the affordance matches the behaviour).
function handleNavNext() {
  navigate(1);
}

function resetStudyState() {
  runtime.marks = getDirectionalMarksStore();
  runtime.currentIdx = 0;
  runtime.activeDeckCount = runtime.spacedRepetition ? getDueCount(runtime.originalDeck) : runtime.originalDeck.filter(card => runtime.marks[card.id] !== 'known').length;
  // Fresh deck = fresh piles. The previous deck's active ids must not leak
  // into the next build: selections can share card ids (e.g. adding a
  // chapter keeps the old chapter's ids), and a stale carry-over would split
  // the brand-new deck into a bogus active/middle partition.
  runtime.spacedActiveIds = [];
  resetUnspacedCycleState();
  runtime.unspacedPendingRecycle = false;
  runtime.isFlipped = false;
}

// Study Selector builders + toggle/deselect/load flow live in js/ui/selectors.js
// Reader UI (drills + verses) lives in js/ui/reader.js; configured at module-top above.
// ═══════════════════════════════════════════════════════
//  RENDER
// ═══════════════════════════════════════════════════════
// renderCard and flipCard live in js/ui/render.js

// ═══════════════════════════════════════════════════════
//  NAVIGATE + MARK
// ═══════════════════════════════════════════════════════
// Navigation, marking, mode/profile setters, toggles and resets live in js/ui/navigation.js
// ═══════════════════════════════════════════════════════
//  PROGRESS + REVIEW
// ═══════════════════════════════════════════════════════
// Progress bar, Review panel, returnSeenCardToDeck live in js/ui/progress.js

// Modal/overlay control (disclaimer, what's new, study selector, shortcuts,
// analytics open/close, startStudying) lives in js/ui/modals.js


// Touch-safe tap bridge for iOS/pointer quirks lives in js/ui/touchTapBridge.js

// Pure SVG/HTML chart builders and series helpers now live in js/ui/charts.js

// Analytics overlay (renderAnalyticsOverlay + all its compute/build helpers,
// plus the celebrate-on-level-up plumbing) lives in js/ui/analytics.js

installKeyboardShortcuts({
  isAnalyticsModalOpen, closeAnalyticsOverlay,
  isStudySelectorOpen, closeStudySelector,
  isShortcutsModalOpen, closeShortcutsModal,
  isToggleInfoModalOpen, closeToggleInfoModal,
  isContactAuthorModalOpen, closeContactAuthorModal,
  isInstallInstructionsOpen, closeInstallInstructions,
  isAlphabetOverlayOpen, closeAlphabetOverlay,
  isDisclaimerModalOpen, isTransferModalOpen, closeTransferModal,
  isReviewDeckMode,
  getSelectedKeys: () => runtime.selectedKeys,
  navigate, flipCard, markCard
});

// ═══════════════════════════════════════════════════════
//  GLOBAL EXPORTS — needed for HTML onclick handlers
//  Export these BEFORE startup runs, so one later init error does not
//  leave the page rendered-but-unclickable.
// ═══════════════════════════════════════════════════════
const GLOBAL_CLICK_HANDLERS = {
  flipCard, navigate, markCard, handleNavNext,
  returnSeenCardToDeck,
  closeAnalyticsOverlay, closeTransferModal, exportProgressJson,
  closeShortcutsModal, closeStudySelector,
  deselectAllChapters, deselectAll,
  handleConsentAction, handleTransferPrimaryAction, handleTransferSecondaryAction,
  openShortcutsModal, openStudySelector,
  openAnalyticsOverlay, resetAllStats, resetCurrentDeck, resetRequiredOnly,
  closeResetSpacedModal, updateResetSpacedScopeLabels, confirmResetSpacedTimingOnly, confirmResetSpacedProgress,
  confirmResetSpacedSmooth,
  closeResetUnspacedModal, confirmResetUnspacedMarks,
  openResetStatsModal, closeResetStatsModal,
  confirmResetStatsKeepSettings, confirmResetToStart,
  setReviewSortMode,
  reshuffleEligible,
  fastForwardOneDay, fastForwardOneWeek,
  restoreSpacedUndo, setAppProfile, setStudyMode, setThemeMode, setFontFamily, setTextSize,
  setShowPoints, setShowTranslit,
  showDisclaimerModal, startStudying, toggleDirection,
  toggleRequiredOnly, toggleHardVocabReview, toggleShuffle, toggleSpacedRepetition, toggleSpacingCadence, toggleUnspacedDailyReset, triggerImportProgress,
  closeToggleInfoModal, onDueHistogramToggle,
  openContactAuthorModal, closeContactAuthorModal, openExternalLink,
  triggerInstall, closeInstallInstructions, dontShowInstallAgain,
  // Phase 2 PR B: Parsing mode (js/ui/parsing.js) click/change handlers.
  parsingSetLesson, parsingSetParadigm,
  parsingToggleShuffleAll, parsingToggleCustomSet, parsingToggleCustomSetParadigm, parsingToggleCustomSetGroup,
  parsingToggleExcludeKnown, parsingToggleAppendix, parsingSetDirection, parsingToggleDim,
  parsingPickDimensionValue, parsingSubmitDontKnow, parsingPickBuildChoice,
  parsingToggleBuildPick, parsingCheckBuildPicks, parsingNextCard,
  parsingResetKnownForms, parsingClearStats, parsingClearFormAttempt,
  // Phase 2 PR C: Grammar Quiz mode (js/ui/grammar.js) click/change handlers.
  grammarSetLesson, grammarToggleReviewMissed, grammarSetDifficulty,
  grammarSelectChoice, grammarNextQuestion,
  // Phase 2 PR D: Reader mode (js/ui/reader.js) click/change handlers.
  readerSetLesson, readerSetTier,
  readerOpenPassage, readerBackToList, readerToggleToken,
  readerToggleMarkForReview, readerToggleReadStatus,
  // Phase 2 PR E: Lesson 0 Alphabet practice (js/ui/alphabet.js) click
  // handlers, including its own overlay open/close.
  openAlphabetOverlay, closeAlphabetOverlay,
  alphabetFlip, alphabetMarkAgain, alphabetMarkGotIt,
  alphabetShuffle, alphabetResetProgress
};
if (typeof globalThis !== 'undefined') Object.assign(globalThis, GLOBAL_CLICK_HANDLERS);
if (typeof window !== 'undefined' && window !== globalThis) Object.assign(window, GLOBAL_CLICK_HANDLERS);
installToggleInfoButtons(); // add (i) info buttons to Advanced-settings toggles

initializeThemeMode();
initializeFontFamily();
initializeTextSize();
initializeShowPoints();
initializeShowTranslit();
// Initial build with default state (needed so restoreState can find DOM elements)
buildSessions();
buildChapterSelector();
if (!restoreState()) {
  syncToggleButtons(); // reflect default controls on load
}
// Mixed-version guard (CLAUDE.md ES-module cache hazard): during a
// service-worker update window this fresh, version-stamped main.js can be
// paired with a STALE cached js/state/runtime.js whose default object
// predates the parsing subtree (or a stale persistence.js that never
// restores it). Everything parsing-related reaches state through the
// configureParsing getState hook above, so patching the live object here
// covers every consumer. Shape mirrors runtime.js's `parsing` default —
// keep the two in sync (see the sync comment there).
if (!runtime.parsing || typeof runtime.parsing !== 'object') {
  runtime.parsing = {
    schemaVersion: 1,
    lesson: 1,
    focusedParadigmId: null,
    direction: 'parse',
    shuffleAll: false,
    customSetOn: false,
    customSet: {},
    excludeKnown: false,
    includeAppendix: false,
    dims: {
      binyan: true, conjugation: true, person: true, gender: true,
      number: true, suffix: true, state: true
    },
    attempts: {},
    initializedFromVocab: false
  };
}
// Same mixed-version guard for runtime.grammar (Phase 2 PR C). Shape
// mirrors runtime.js's `grammar` default — keep the two in sync.
if (!runtime.grammar || typeof runtime.grammar !== 'object') {
  runtime.grammar = {
    schemaVersion: 1,
    lesson: 1,
    reviewMissed: false,
    difficulty: 'all',
    attempts: {},
    initializedFromVocab: false
  };
}
// Same mixed-version guard for runtime.reader (Phase 2 PR D). Shape mirrors
// runtime.js's `reader` default — keep the two in sync.
if (!runtime.reader || typeof runtime.reader !== 'object') {
  runtime.reader = {
    schemaVersion: 1,
    lesson: 1,
    tier: 'both',
    readPassages: {},
    readOrder: [],
    marks: {},
    lastPassageId: null,
    initializedFromVocab: false
  };
}
// Same mixed-version guard for runtime.alphabet (Phase 2 PR E). Shape
// mirrors runtime.js's `alphabet` default — keep the two in sync.
if (!runtime.alphabet || typeof runtime.alphabet !== 'object') {
  runtime.alphabet = {
    schemaVersion: 1,
    known: {},
    seen: {}
  };
}
// Rebuild after restore: runtime.appProfile may have changed, affecting grammar summary text
buildSessions();
buildChapterSelector();
initPwaInstall();
initializeConsentGate();

const cardArea = document.getElementById('cardArea');
if (cardArea) {
  cardArea.addEventListener('click', (event) => {
    const target = event.target;
    if (!target || !(target instanceof Element)) return;
    if (target.closest('.empty-state')) openStudySelector();
  });
}

startUsageTracking();
syncLayoutVisibility();
renderProgress();
installTouchSafeTapBridge();
installClickShield();

// Prevent mobile double-tap zoom on interactive controls
function preventDoubleTapZoom(el) {
  let lastTouchEnd = 0;
  el.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) event.preventDefault();
    lastTouchEnd = now;
  }, false);
}

['shuffleToggle','directionToggle','spacedToggle','unspacedDailyResetToggle','modeShortcutVocabBtn','modeShortcutParsingBtn','modeShortcutGrammarBtn','modeShortcutReaderBtn','themeSystemBtn','themeDarkBtn','themeLightBtn'].forEach(id => {
  const el = document.getElementById(id);
  if (el) preventDoubleTapZoom(el);
});

// Service-worker registration + the "Update available" refresh prompt were
// extracted to js/pwa/swUpdate.js — a CLASSIC script loaded from its own
// <script> tag — after a field freeze: living at the tail of this module's
// body meant any earlier startup error (e.g. the CLAUDE.md mixed-version
// import hazard during an update window) silently killed the only recovery
// UI. Do not re-inline it here.
