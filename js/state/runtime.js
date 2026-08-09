// The application's mutable runtime state — every binding that used to live
// as a top-level `let` in main.js. Modules that need read or write access
// import this object directly and operate on its properties. Mutations on
// object/array properties propagate because there's a single shared
// reference; reassignments to primitive fields (e.g. `runtime.studyMode =
// 'morph'`) work because callers always go through this object.
//
// Initial values match what main.js used to declare. Anything that needs to
// be reset later (resetAllStats, restoreState) reassigns runtime.foo just
// like main.js used to reassign the bare `foo`.

import { ANALYTICS_COLLAPSED_DEFAULTS } from './store.js';

export const runtime = {
  // ── Usage / gamification ────────────────────────────────────────────
  appUsageStats: {
    totalMs: 0,
    dailyMs: {},
    activeStudyMs: 0,
    activeDailyMs: {},
    lastActiveAt: 0,
    lastStudyInteractionAt: 0,
    lastStudyCountedAt: 0,
    firstStudyAt: 0,
    studySessionHistory: [],
    currentStudySession: null
  },
  appProfile: 'vocab_grammar',
  appGamification: { lastCelebratedLevel: null, lastCelebratedBadgeDay: null, lastEarnedAchievementIds: [] },
  usageTickHandle: null,
  usageVisibilityBound: false,
  usageTickCounter: 0,
  analyticsExpandedChapter: null,
  analyticsExpandedWord: null,
  analyticsChapterSort: 'confidence', // 'confidence' | 'alphabetical'
  // Sort order of the per-deck progress card list. Defaults to last-seen
  // (most recently reviewed first) so the words just studied sit on top;
  // alphabetical is the predictable "find a word" lookup, and confidence
  // flips it to lowest-raw-pct-first for the "what should I drill next" view.
  reviewSortMode: 'lastSeen', // 'lastSeen' | 'alphabetical' | 'confidence'
  // Word IDs currently expanded inside the stubborn / improved / slipping
  // lists. Keyed by the list's collapseKey so each list tracks its own
  // expansion independently — opening a row in "Most stubborn" doesn't
  // close one in "Slipping list".
  analyticsExpandedListWords: {},
  // Analytics-page-local vocab view (separate from the study deck's
  // directionToGreek / requiredOnly so analyzing one direction doesn't force
  // a deck rebuild).
  analyticsVocabDirection: 'g2e',     // 'g2e' | 'e2g'
  analyticsVocabScope: 'required',    // 'required' | 'all'
  // Per-section open/closed state for the analytics overlay's collapsibles.
  // Defaults live in ANALYTICS_COLLAPSED_DEFAULTS (store.js) so migrations
  // and compaction can share the canonical key list.
  analyticsCollapsed: { ...ANALYTICS_COLLAPSED_DEFAULTS },

  // ── Modal / disclaimer / transfer / theme ───────────────────────────
  hasAcceptedDisclaimer: false,
  disclaimerModalRequiresAgreement: false,
  transferModalMode: '',
  transferPrimaryAction: null,
  transferSecondaryAction: null,
  themeMode: 'system',
  fontFamily: 'serif',  // 'serif' | 'sans'
  textSize: 'medium',   // 'small' | 'medium' | 'large' | 'x-large'
  // Hebrew display prefs (Task 3). showPoints controls whether card.g is
  // rendered pointed (as authored) or with stripHebrewPoints() applied at
  // render time — the underlying data/ids are never touched. showTranslit
  // toggles the .card-translit line via a CSS attribute (see styles.css).
  showPoints: 'pointed',    // 'pointed' | 'unpointed'
  showTranslit: 'show',     // 'show' | 'hide'

  // ── Study mode ───────────────────────────────────────────────────
  studyMode: 'vocab',

  // ── Parsing mode (Phase 2 PR B) ─────────────────────────────────────
  // Fully independent of the vocab deck/SRS machinery above — see
  // docs/bbh-conversion-plan.md "Phase 2 architecture decisions" #6 and
  // js/ui/parsing.js. Owned/mutated only by js/ui/parsing.js (via the live
  // reference handed back from configureParsing's getState hook) and
  // restored/persisted by js/state/persistence.js's sanitizeParsingState.
  // SYNC: js/app/main.js keeps a mirrored copy of this default shape in its
  // mixed-version guard after restoreState() — update both together.
  parsing: {
    schemaVersion: 1,
    lesson: 1,
    focusedParadigmId: null,
    direction: 'parse',       // 'parse' | 'build'
    shuffleAll: false,
    customSetOn: false,       // whether customSet (below) actually scopes the pool
    customSet: {},            // { [paradigmId]: true }
    excludeKnown: false,
    includeAppendix: false,   // off by default — appendix forms are opt-in
    dims: {
      binyan: true, conjugation: true, person: true, gender: true,
      number: true, suffix: true, state: true
    },
    attempts: {},             // { [formId]: { seen, recent, history } }
    initializedFromVocab: false
  },

  // ── Grammar Quiz mode (Phase 2 PR C) ─────────────────────────────────
  // Fully independent of the vocab deck/SRS machinery and of the parsing
  // subtree above — see docs/bbh-conversion-plan.md "Phase 2 architecture
  // decisions" #6 and js/ui/grammar.js. Owned/mutated only by js/ui/grammar.js
  // (via the live reference handed back from configureGrammar's getState
  // hook) and restored/persisted by js/state/persistence.js's
  // sanitizeGrammarState.
  // SYNC: js/app/main.js keeps a mirrored copy of this default shape in its
  // mixed-version guard after restoreState() — update both together.
  grammar: {
    schemaVersion: 1,
    lesson: 1,
    reviewMissed: false,
    difficulty: 'all',        // 'all' | 'core'
    attempts: {},              // { [questionId]: { seen, correct, recent, lastAt } }
    initializedFromVocab: false
  },

  // ── Reader mode (Phase 2 PR D) ───────────────────────────────────────
  // Fully independent of the vocab deck/SRS machinery and of the parsing/
  // grammar subtrees above — see js/ui/reader.js. Owned/mutated only by
  // js/ui/reader.js (via the live reference handed back from
  // configureReader's getState hook) and restored/persisted by
  // js/state/persistence.js's sanitizeReaderState. NO SRS interaction of
  // any kind lives here — `marks` is a plain self-review flag, never
  // scheduled or graded.
  // SYNC: js/app/main.js keeps a mirrored copy of this default shape in its
  // mixed-version guard after restoreState() — update both together.
  reader: {
    schemaVersion: 1,
    lesson: 1,
    tier: 'both',             // 'strict' | 'both' (Strict+Guided)
    readPassages: {},         // { [passageId]: true }
    readOrder: [],            // passage ids, most recent read first, capped 20
    marks: {},                // { [passageId + ':' + tokenIndex]: true }
    lastPassageId: null,
    initializedFromVocab: false
  },

  // ── Lesson 0: Alphabet practice (PR E) ────────────────────────────────
  // Completely separate from every vocab/parsing/grammar/reader subtree
  // above: no SRS, no XP/streaks/achievements, never touches selectedKeys/
  // presets, and is excluded from vocab stats and export vocab counts (see
  // docs/bbh-conversion-plan.md "Lesson 0 — Alphabet practice" addendum).
  // Owned/mutated only by js/ui/alphabet.js (via the live reference handed
  // back from configureAlphabet's getState hook) and restored/persisted by
  // js/state/persistence.js's sanitizeAlphabetState. `known`/`seen` are
  // plain maps keyed by the letter's stable `order` (1-23) as a string.
  // SYNC: js/app/main.js keeps a mirrored copy of this default shape in its
  // mixed-version guard after restoreState() — update both together.
  alphabet: {
    schemaVersion: 1,
    known: {},   // { [letterOrder]: true }
    seen: {}     // { [letterOrder]: reviewCount }
  },

  // ── Persisted directional stores (rebuilt from localStorage) ────────
  deckStates: {},
  globalWordMarks: {},
  globalWordProgress: {},

  // ── Current study session + deck cursor ─────────────────────────────
  currentSession: null,
  selectedKeys: [],
  splitSelection: false,    // separate chapter selections for vocab vs grammar
  modeSelections: {},       // { vocab: {selectedKeys, currentSessionId}, morph: {...} }
  deck: [],
  originalDeck: [],
  // Identity of the deck currently in `deck` — which deck-state-bank entry it
  // belongs to. Set whenever a deck is freshly built; consulted by
  // saveCurrentDeckStateToBank so the in-flight deck is always filed under its
  // own key even when callers have already mutated studyMode / direction /
  // selectedKeys ahead of the rebuild.
  activeDeckRef: null,      // { key, selectedKeys, currentSessionId }
  currentIdx: 0,
  isFlipped: false,
  shuffled: true,           // shuffle on by default
  requiredOnly: true,
  directionToGreek: false,  // false = Greek→English, true = English→Greek
  // Live spaced-repetition flag for the *current* study mode. Mirrors the
  // matching entry in `spacedByMode` — kept in sync on every mode switch and
  // toggle so the wide existing read-base (deck banks, nav, stats) needs no
  // change. Vocab and grammar each remember their own setting.
  spacedRepetition: true,
  // Per-section spaced-repetition preference. Grammar (morph) defaults to
  // unspaced — its drills are short reference checks, not a confidence-graded
  // SRS deck — while vocab stays spaced. setStudyMode swaps the active value
  // into `spacedRepetition`; toggleSpacedRepetition writes back here.
  spacedByMode: { vocab: true, morph: false },
  // SRS spacing-cadence preset: 'intensive' (2-month course, default) keeps the
  // tight easy-interval growth + ~2-week cap; 'relaxed' (8-month course)
  // stretches both. Read by applySpacedReview via getActiveCadence(); changing
  // it only affects how future flips schedule, not already-due cards.
  spacingCadence: 'intensive',
  hardVocabReviewMode: false, // restrict vocab deck to cards missed >10× and still under 40% confidence
  activeDeckCount: 0,
  // Cards in the "middle deck" — currently due but not yet seen this session.
  // Builds up as deferred cards' timers expire mid-session; gets dumped into
  // active when the active section drains, on manual reshuffle, on 2% revival,
  // or after a 5-hour idle. In-memory only (not persisted, recomputed each
  // build).
  middleDeckCount: 0,
  // IDs that should land in the active section on the next buildStudyDeck.
  // Drains as those cards are reviewed; replenishes when middle dumps in
  // (active-empties / manual reshuffle / 2% revival / 5 h idle). Persisted
  // through reload only when lastStudyActivityAt is within the 5 h window
  // (see persistence.js), and banked per deck in deckStates so a mode/toggle
  // round-trip within the window resumes each deck's own active pile.
  spacedActiveIds: [],
  // Timestamp (ms) of the most recent study activity in any mode (vocab,
  // grammar, or reader — anything that fires noteStudyInteraction).
  // Persisted, so the timer survives reload. persistence.js gates restore
  // of session state (spacedActiveIds, unspacedMiddleIds) on
  // (now - lastStudyActivityAt) <= SESSION_IDLE_RESET_MS.
  lastStudyActivityAt: 0,
  // Snapshot of lastStudyActivityAt taken at the start of each
  // noteStudyInteraction, before the field is bumped to "now". Used by
  // buildStudyDeck's in-session idle check so it sees the timestamp of the
  // previous activity instead of the one we just recorded. In-memory.
  previousStudyActivityAt: 0,
  unspacedPendingRecycle: false,
  unspacedCycleState: {},
  unspacedDeferredIds: new Set(), // 'pass' and 'again' cards excluded from current pass; reappear in next cycle
  // Cards Hard/Uncertain-marked in the current unspaced round, awaiting the
  // next reshuffle. Sits between active and archived in the deck layout.
  // Persisted (as an array) gated on the 5 h session window — a reload or a
  // mode/toggle round-trip within the window resumes the round; past it,
  // everything unmarked collapses back into active and a fresh round starts.
  // Also banked per deck in deckStates alongside spacedActiveIds.
  unspacedMiddleIds: new Set(),
  unspacedMiddleCount: 0,
  // Round bookkeeping for the unspaced flip-deck flow. A "round" is one pass
  // through the active deck — Hard/Uncertain bump the card to the back of the
  // active queue (it'll reappear in the same round); Easy archives it. When
  // every card present at the start of the round has been marked, the
  // remaining (non-archived) cards reshuffle for the next round.
  unspacedRoundSize: 0,
  unspacedRoundMarks: 0,
  // 5 AM-cutoff day key recorded the last time an unspaced archive (Easy
  // mark) was active. When the current day key drifts past this and
  // unspacedAutoResetEnabled is on, the daily auto-clear wipes all
  // unspaced 'known' marks across both vocab directions.
  lastUnspacedArchiveDayKey: '',
  // Off by default: Easy-archived cards persist across sessions and chapter
  // changes until the user explicitly resets, or until they opt in to the
  // 5 AM daily reset via the deck control toggle.
  unspacedAutoResetEnabled: false,
  flipsSinceReshuffle: 0,         // forward navigations since last periodic reshuffle (legacy; see lastPeriodicReshuffleAt)
  lastPeriodicReshuffleAt: 0,     // timestamp (ms) of the last periodic reshuffle; throttled to ≥ 1 hour
  spacedUndoSnapshot: null,
  // History stack of pre-action snapshots for vocab unspaced. Each Next
  // press, Hard/Uncertain/Easy mark, and end-of-deck reshuffle pushes one
  // entry; Prev pops the top and restores it. Entries are tagged 'next',
  // 'mark', or 'reshuffle' so the Prev button label can switch to "Undo"
  // when the next pop would roll back a confidence-impacting mark.
  // Capped at runtime; not persisted (session-only).
  unspacedHistory: [],

  // ── Per-direction mark store for the active study mode ──────────────
  marks: {}
};
