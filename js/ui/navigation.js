// Navigation + marking + study-mode toggles.
//
// navigate(dir), markCard(outcome), setStudyMode, setAppProfile and all the
// toggles (shuffle/required/direction/spaced/morph self-check) live here.
// Also reshuffleEligible, fastForward day/week, resetCurrentDeck,
// resetAllStats. Reads/writes runtime state directly; host callbacks cover
// the SRS scheduler, deck builder, study-state primitives, and the
// directional-store helpers that still live in main.js.

import { runtime } from '../state/runtime.js';
import { shuffleArray } from '../utils/helpers.js';
import { SRS_CYCLE_ADVANCE_MS } from '../domain/srs/constants.js';
import { msFromDays, daysFromMs } from '../domain/srs/scheduler.js';
import { expandSessionSets, sortSetKeys } from '../domain/deck/ordering.js';
import { isIrregularCardEnabled } from '../domain/deck/filters.js';
import {
  sanitizeGamificationState,
  STORAGE_KEY,
  CONSENT_STORAGE_KEY,
  THEME_STORAGE_KEY,
  FONT_FAMILY_STORAGE_KEY,
  TEXT_SIZE_STORAGE_KEY
} from '../state/store.js';
import { getStorage } from '../utils/storage.js';
import { shieldClicksBriefly } from '../utils/clickShield.js';
import { renderCard } from './render.js';
import { renderProgress, renderReview } from './progress.js';
import {
  loadDeckFromKeys,
  buildSessions,
  buildChapterSelector
} from './selectors.js';

let host = {
  noteStudyInteraction: () => {},
  isMorphologyMode: () => false,
  isParsingMode: () => false,
  // Grammar Quiz mode (Phase 2 PR C) — see js/ui/grammar.js. Injected the
  // same way as isParsingMode; only setStudyMode below actually branches on
  // it (Grammar owns its own lesson scope in runtime.grammar.lesson, never
  // runtime.selectedKeys/runtime.deck, so it needs no other navigate()/
  // markCard() guarding — those are unreachable in Grammar mode because
  // main.js's syncLayoutVisibility hides navRow/markRow/ffRow there, same
  // as Parsing, and isReviewDeckMode (main.js) already excludes 'grammar').
  isGrammarMode: () => false,
  isReaderMode: () => false,
  normalizeStudyMode: (m) => m,
  resetMorphAnswerState: () => {},
  ensureDirectionalStores: () => {},
  getDirectionalMarksStore: () => ({}),
  getDirectionalProgressStore: () => ({}),
  syncToggleButtons: () => {},
  syncLayoutVisibility: () => {},
  startNextCycle: () => {},
  getKnownCount: () => 0,
  advanceScheduledCards: () => {},
  buildStudyDeck: () => [],
  captureSpacedUndoSnapshot: () => {},
  applySpacedReview: () => {},
  clearSpacedUndoSnapshot: () => {},
  restoreSpacedUndo: () => {},
  pushUnspacedHistory: () => {},
  restoreUnspacedHistoryStep: () => false,
  clearSavedState: () => {},
  maybeReturnConfirmedDeferredCard: () => {},
  maybePeriodicReshuffle: () => {},
  recordStudyOutcome: () => {},
  applyUnspacedSharedSchedule: () => {},
  getRemainingCards: () => [],
  resetUnspacedCycleState: () => {},
  noteUnspacedArchiveActivity: () => {},
  saveCurrentDeckStateToBank: () => {},
  markActiveDeckRef: () => {},
  saveState: () => {},
  renderReaderModule: () => {},
  getDeckStateKey: () => '',
  getSessions: () => [],
  getSelectedCards: () => [],
  resetMorphStepState: () => {},
  ensureMorphFocusedParadigm: () => {},
  rebuildMorphDeckForStepMode: () => {},
  rebuildParsingCycle: () => {},
  prepareLookupFocus: () => {},
  listAvailableParadigmLemmas: () => []
};

// When split vocab/grammar selection is on, each mode keeps its own selected
// chapters. These helpers stash/restore that selection as the study mode
// changes. Only 'vocab' and 'morph' participate; 'reader' is left untouched.
function saveModeSelection(mode) {
  if (mode !== 'vocab' && mode !== 'morph' && mode !== 'parsing') return;
  runtime.modeSelections[mode] = {
    selectedKeys: [...runtime.selectedKeys],
    currentSessionId: runtime.currentSession ? runtime.currentSession.id : null
  };
}

// Spaced-repetition is remembered per section (vocab vs grammar). Only those
// two modes carry a setting; grammar (morph) defaults to unspaced, vocab to
// spaced. Parsing/reader don't use the SRS deck, so they're left out.
function spacedDefaultForMode(mode) {
  return mode !== 'morph';
}
function effectiveSpacedForMode(mode) {
  const v = runtime.spacedByMode && runtime.spacedByMode[mode];
  return typeof v === 'boolean' ? v : spacedDefaultForMode(mode);
}

function restoreModeSelection(mode) {
  if (mode !== 'vocab' && mode !== 'morph' && mode !== 'parsing') return;
  const saved = runtime.modeSelections[mode];
  if (!saved) return;
  runtime.selectedKeys = sortSetKeys((saved.selectedKeys || []).map(String));
  runtime.currentSession = saved.currentSessionId
    ? host.getSessions().find(s => s.id === saved.currentSessionId) || null
    : null;
}

export function configureNavigation(deps) {
  host = { ...host, ...deps };
}

export function navigate(dir, options = {}) {
  if (!runtime.deck.length) return;
  host.noteStudyInteraction();

  if (dir < 0) {
    // Spaced vocab hides the Prev button (going back would re-show a card
    // that was just rescheduled and invite double-grading); the keyboard
    // ArrowLeft path must match. Spaced morph keeps cursor-back, mirroring
    // its visible controls.
    if (runtime.spacedRepetition && !host.isMorphologyMode() && !host.isParsingMode()) return;
    // Vocab unspaced: Prev walks back through the history stack. Each
    // Next, mark, and reshuffle pushed a snapshot before mutating, so a
    // Prev press just pops and restores. The label flips between
    // "← Prev" and "↶ Undo" so the user knows when the next pop will
    // roll back a confidence-impacting mark.
    if (!runtime.spacedRepetition && !host.isMorphologyMode() && !host.isParsingMode()) {
      if (host.restoreUnspacedHistoryStep()) return;
      // No history to walk: fall through to plain cursor-back.
    }
    runtime.currentIdx = Math.max(0, runtime.currentIdx - 1);
    host.resetMorphAnswerState();
    renderCard();
    return;
  }

  if (!runtime.spacedRepetition && runtime.currentIdx >= runtime.deck.length) {
    if (host.isMorphologyMode() || host.isParsingMode()) {
      // Morph + parsing both auto-cycle on Next when everything is known.
      if (runtime.unspacedPendingRecycle) {
        host.startNextCycle('remaining');
      } else if (host.getKnownCount() === runtime.originalDeck.length) {
        host.startNextCycle('full');
      } else {
        return;
      }
      host.resetMorphAnswerState();
      renderCard();
      renderReview();
      renderProgress();
      host.saveState();
    } else if (runtime.unspacedMiddleCount > 0) {
      // Vocab unspaced + end-of-round confirmation card: middle has cards
      // waiting. Next dumps middle back into active (shuffled) and starts a
      // fresh round. Push history so Prev can put the deck back in its
      // pre-shuffle order. When middle is empty AND active is empty, the
      // deck is fully archived — Next is a no-op and the user must use
      // Reset.
      host.pushUnspacedHistory('reshuffle');
      reshuffleUnspacedRound(host.getDirectionalMarksStore());
      runtime.isFlipped = false;
      host.resetMorphAnswerState();
      renderCard();
      renderReview();
      renderProgress();
      host.saveState();
    }
    return;
  }

  if (runtime.spacedRepetition && runtime.currentIdx >= runtime.activeDeckCount) {
    // Active section drained. If middle has cards (timers expired during
    // this session OR cards Again'd during this pass), dump them into
    // active and reshuffle — keeps the user moving without burning time.
    // Only when middle is empty too do we fall back to the existing
    // scheduled-advance behaviour, which nudges the next-up deferred cards
    // forward an hour so the deck isn't dead. The last-shown card's id is
    // forwarded as avoidHeadId so the reshuffled deck doesn't put that
    // same card first — especially important now that Again-marked cards
    // land directly in middle without a timer-based cool-off.
    const avoidHeadId = runtime.deck[runtime.currentIdx - 1]
      ? runtime.deck[runtime.currentIdx - 1].id
      : undefined;
    if (runtime.middleDeckCount > 0) {
      runtime.deck = host.buildStudyDeck(runtime.originalDeck, { forceShuffle: true, avoidHeadId });
    } else {
      // Advance the SRS clock so cards within 1 h of due become due-now,
      // then rebuild with forceShuffle so every newly-promoted card lands
      // in active (not middle). Without forceShuffle, any stale entry in
      // spacedActiveIds that happens to coincide with a newly-due card
      // would split the cohort across active and middle, forcing the user
      // to press Next a second time to dump middle in.
      host.advanceScheduledCards(runtime.originalDeck, SRS_CYCLE_ADVANCE_MS);
      runtime.deck = host.buildStudyDeck(runtime.originalDeck, { forceShuffle: true, avoidHeadId });
    }
    runtime.currentIdx = 0;
    host.resetMorphAnswerState();
    renderCard();
    renderReview();
    renderProgress();
    host.saveState();
    return;
  }

  let autoReviewedCardId;
  if (runtime.spacedRepetition && runtime.currentIdx < runtime.activeDeckCount && !options.skipAutoReview && !host.isMorphologyMode() && !host.isParsingMode()) {
    const reviewedCard = runtime.deck[runtime.currentIdx];
    autoReviewedCardId = reviewedCard ? reviewedCard.id : undefined;
    host.captureSpacedUndoSnapshot();
    host.applySpacedReview(reviewedCard, 'again');
    runtime.deck = host.buildStudyDeck(runtime.originalDeck);
  }

  if (runtime.spacedRepetition) {
    if (host.isMorphologyMode() || host.isParsingMode()) {
      if (runtime.morphPendingAdvance) {
        runtime.deck = host.buildStudyDeck(runtime.originalDeck);
        runtime.currentIdx = Math.min(runtime.currentIdx, runtime.activeDeckCount);
      } else if (host.isParsingMode() && runtime.currentIdx + 1 >= runtime.activeDeckCount) {
        // Parsing has no SRS writes, so the standard end-of-cycle "no cards
        // due" splash never resolves on its own — reshuffle immediately
        // when the cursor would step past the last card. Rebuild through the
        // filtered focused pool (not buildStudyDeck on the stale originalDeck)
        // so any form that became 2/2 known mid-session is dropped by the
        // exclude-known-morphs filter. The just-shown card's id is forwarded
        // as avoidHeadId so it doesn't repeat at the head of the new cycle.
        const avoidHeadId = runtime.deck[runtime.currentIdx]
          ? runtime.deck[runtime.currentIdx].id
          : undefined;
        host.rebuildParsingCycle({ avoidHeadId });
      } else {
        runtime.currentIdx = Math.min(runtime.currentIdx + 1, runtime.activeDeckCount);
      }
      host.clearSpacedUndoSnapshot();
    } else if (runtime.activeDeckCount <= 0 && runtime.middleDeckCount > 0) {
      // The auto-'again' above drained the active pile with cards still
      // waiting in middle. Dump them in right away — mirroring markCard —
      // instead of parking on a "no cards due" splash that the user has to
      // press Next through. The just-reviewed card's id is forwarded so the
      // dump doesn't put that same card back on top.
      runtime.deck = host.buildStudyDeck(runtime.originalDeck, { forceShuffle: true, avoidHeadId: autoReviewedCardId });
      runtime.currentIdx = 0;
    } else {
      runtime.currentIdx = Math.min(runtime.currentIdx, runtime.activeDeckCount);
      host.maybeReturnConfirmedDeferredCard();
      host.maybePeriodicReshuffle();
    }
    host.resetMorphAnswerState();
    renderCard();
    renderReview();
    renderProgress();
    host.saveState();
    return;
  }

  if (host.isMorphologyMode() || host.isParsingMode()) {
    const nextIdx = runtime.currentIdx + 1;
    if (nextIdx >= runtime.deck.length) {
      if (host.isParsingMode()) {
        // Parsing: silent auto-reshuffle, no "end of round" splash.
        const avoidHeadId = runtime.deck[runtime.currentIdx]
          ? runtime.deck[runtime.currentIdx].id
          : undefined;
        host.startNextCycle('remaining', { avoidHeadId });
      } else if (host.getKnownCount() === runtime.originalDeck.length) {
        runtime.currentIdx = runtime.deck.length;
        runtime.unspacedPendingRecycle = false;
      } else {
        runtime.currentIdx = runtime.deck.length;
        runtime.unspacedPendingRecycle = true;
      }
    } else {
      runtime.currentIdx = nextIdx;
      runtime.unspacedPendingRecycle = false;
    }
    host.clearSpacedUndoSnapshot();
    host.resetMorphAnswerState();
    renderCard();
    renderReview();
    renderProgress();
    host.saveState();
    return;
  }

  // Vocab unspaced: Next acts as a neutral pass — moves the current card
  // to the back of the active queue and ticks the round counter, but
  // does not record a confidence sample or touch pass/fail/XP. The
  // pre-action state is pushed onto the unspaced history stack so a
  // subsequent Prev can step back through each Next press one by one.
  if (runtime.currentIdx < runtime.activeDeckCount) {
    const currentCard = runtime.deck[runtime.currentIdx];
    host.pushUnspacedHistory('next');
    applyUnspacedMark(currentCard, 'pass', { skipRecording: true });
    host.maybePeriodicReshuffle();
    host.resetMorphAnswerState();
    renderCard();
    renderReview();
    renderProgress();
    host.saveState();
    return;
  }

  // Cursor past the active section (e.g. every card archived via Easy).
  // Park at the end so renderCard shows the done state; the user clicks
  // "↻ Reset" (the morphed Next button) to restart.
  runtime.currentIdx = runtime.deck.length;
  runtime.unspacedPendingRecycle = false;
  host.resetMorphAnswerState();
  renderCard();
}

export function markCard(outcome) {
  // outcome: 'again' | 'pass' | 'easy'
  if (host.isMorphologyMode() || host.isParsingMode()) return;
  host.noteStudyInteraction();
  if ((!runtime.spacedRepetition && runtime.currentIdx >= runtime.deck.length) || (runtime.spacedRepetition && runtime.currentIdx >= runtime.activeDeckCount)) return;
  const currentCard = runtime.deck[runtime.currentIdx];
  if (runtime.spacedRepetition) {
    host.captureSpacedUndoSnapshot();
    host.applySpacedReview(currentCard, outcome);
    runtime.deck = host.buildStudyDeck(runtime.originalDeck);
    if (runtime.activeDeckCount <= 0) {
      // Active drained on this very mark. If middle has waiting cards, dump
      // them in so the user keeps moving rather than landing on the
      // empty-deck state and needing another Next press to recover. Forward
      // the just-marked card's id as avoidHeadId so the dump doesn't put
      // it first (an Again-marked card would otherwise be a likely head).
      if (runtime.middleDeckCount > 0) {
        runtime.deck = host.buildStudyDeck(runtime.originalDeck, { forceShuffle: true, avoidHeadId: currentCard && currentCard.id });
        runtime.currentIdx = 0;
      } else {
        runtime.currentIdx = runtime.activeDeckCount;
      }
      host.resetMorphAnswerState();
      renderCard();
    } else {
      navigate(1, { skipAutoReview: true });
    }
  } else {
    host.pushUnspacedHistory('mark');
    applyUnspacedMark(currentCard, outcome);
    renderCard();
  }
  renderReview();
  renderProgress();
  host.saveState();
}

// Unspaced flip-deck marking. Three sections: [active, middle, archived].
// - Hard ('again') / Uncertain ('pass') → move card to the back of the middle
//   section. It will NOT reappear until the active section drains and the
//   user reshuffles, dumping middle back into active.
// - Easy ('easy') → archive the card (mark 'known'); it stays out until the
//   user clicks Reset or picks a new session.
// All three outcomes still feed recordStudyOutcome so confidence/analytics
// reflect the response. applyUnspacedSharedSchedule keeps the legacy cycle
// bookkeeping in sync for any reader that still consults it.
// `options.skipRecording` makes the call a neutral queue-only nudge: the
// card moves to middle without recording confidence/XP. Used by the Next
// button in vocab unspaced mode.
function applyUnspacedMark(card, outcome, options = {}) {
  if (!card) return;
  const normalizedOutcome = outcome === 'easy' ? 'easy' : outcome === 'pass' ? 'pass' : 'again';
  if (!options.skipRecording) {
    const recordedOutcome = normalizedOutcome === 'easy' ? 'known' : normalizedOutcome === 'pass' ? 'pass' : 'review';
    const reviewedAt = Date.now();
    host.recordStudyOutcome(card.id, recordedOutcome, reviewedAt);
    host.applyUnspacedSharedSchedule(card, normalizedOutcome, reviewedAt);
  }

  const directionalMarks = host.getDirectionalMarksStore();
  const fromIdx = runtime.deck.findIndex(c => c && c.id === card.id);
  if (!runtime.unspacedMiddleIds) runtime.unspacedMiddleIds = new Set();

  if (normalizedOutcome === 'easy') {
    directionalMarks[card.id] = 'known';
    runtime.unspacedMiddleIds.delete(card.id);
    host.noteUnspacedArchiveActivity();
    if (fromIdx >= 0) {
      runtime.deck.splice(fromIdx, 1);
      runtime.deck.push(card);
    }
  } else {
    // Hard / Uncertain: move card into the middle section. Insert at the end
    // of middle (= start of archived), so middle preserves insertion order
    // — earliest-marked cards reshuffle first.
    delete directionalMarks[card.id];
    runtime.unspacedMiddleIds.add(card.id);
    if (fromIdx >= 0) {
      runtime.deck.splice(fromIdx, 1);
      // After splice, find first archived card; insert just before it so the
      // card lands at the tail of middle. If nothing is archived yet, push
      // to the deck tail.
      const splitAt = runtime.deck.findIndex(c => c && directionalMarks[c.id] === 'known');
      const insertAt = splitAt === -1 ? runtime.deck.length : splitAt;
      runtime.deck.splice(insertAt, 0, card);
    }
  }

  runtime.marks = directionalMarks;
  // active = unmarked AND not in middle; middle = unmarked AND in middle.
  runtime.activeDeckCount = runtime.deck.filter(c => directionalMarks[c.id] !== 'known' && !runtime.unspacedMiddleIds.has(c.id)).length;
  runtime.unspacedMiddleCount = runtime.deck.filter(c => directionalMarks[c.id] !== 'known' && runtime.unspacedMiddleIds.has(c.id)).length;
  runtime.unspacedRoundMarks = (Number(runtime.unspacedRoundMarks) || 0) + 1;

  // Round complete = active is empty. Park at deck.length so renderCard
  // shows the "End of round" (middle has cards) or "Session complete"
  // (middle empty) state. The user's next press at deck.length is where
  // the reshuffle (middle → active) actually happens, so they get a beat
  // to pause/reset before the next pass starts.
  if (runtime.activeDeckCount === 0) {
    runtime.currentIdx = runtime.deck.length;
    if (runtime.unspacedMiddleCount === 0) {
      // Everything archived; clear the round counter too so a re-entry into
      // the deck doesn't inherit stale bookkeeping.
      runtime.unspacedRoundSize = 0;
      runtime.unspacedRoundMarks = 0;
    }
  } else {
    // Mid-round: the splice shifted later cards into our slot, so currentIdx
    // already points at the next card. Clamp to the new active count.
    runtime.currentIdx = Math.min(runtime.currentIdx, Math.max(0, runtime.activeDeckCount - 1));
    // Edge case: marking Hard/Uncertain on the very last active position
    // moves the card back to the same slot. Wrap so the learner doesn't see
    // the same card twice in a row.
    const cursorCard = runtime.deck[runtime.currentIdx];
    if (normalizedOutcome !== 'easy' && cursorCard && cursorCard.id === card.id) {
      runtime.currentIdx = 0;
    }
  }

  runtime.unspacedPendingRecycle = false;
  runtime.isFlipped = false;
}

function reshuffleUnspacedRound(directionalMarks) {
  const marks = directionalMarks || host.getDirectionalMarksStore();
  // Reshuffle = end of a round. Middle dumps back into active (everyone
  // unmarked is now eligible again), the combined pile is shuffled, and the
  // round counter resets. Archived cards stay archived.
  runtime.unspacedMiddleIds = new Set();
  runtime.unspacedMiddleCount = 0;
  const active = runtime.deck.filter(c => c && marks[c.id] !== 'known');
  const known = runtime.deck.filter(c => c && marks[c.id] === 'known');
  runtime.deck = [...shuffleArray(active), ...known];
  runtime.activeDeckCount = active.length;
  runtime.currentIdx = 0;
  runtime.unspacedRoundSize = active.length;
  runtime.unspacedRoundMarks = 0;
}

// Seed the round counters whenever we (re)build an unspaced deck, so the very
// first mark doesn't trigger a phantom "round complete" against a stale size.
export function resetUnspacedRoundForActiveDeck() {
  if (runtime.spacedRepetition) {
    runtime.unspacedRoundSize = 0;
    runtime.unspacedRoundMarks = 0;
    return;
  }
  const directionalMarks = host.getDirectionalMarksStore();
  runtime.unspacedRoundSize = runtime.deck.filter(c => c && directionalMarks[c.id] !== 'known').length;
  runtime.unspacedRoundMarks = 0;
}

// Empty-deck "Reset" path: archived all cards, user pressed the Next button
// (which now reads "↻ Reset"). Clears archives + reshuffles, no modal.
export function resetUnspacedDeckNoConfirm() {
  if (runtime.spacedRepetition) return;
  if (!runtime.selectedKeys.length) return;
  host.clearSpacedUndoSnapshot();
  const directionalMarks = host.getDirectionalMarksStore();
  (runtime.originalDeck || []).forEach(card => {
    delete directionalMarks[card.id];
  });
  runtime.marks = directionalMarks;
  host.resetUnspacedCycleState();
  runtime.unspacedPendingRecycle = false;
  runtime.currentIdx = 0;
  runtime.isFlipped = false;
  host.resetMorphAnswerState();
  runtime.deck = host.buildStudyDeck(runtime.originalDeck);
  resetUnspacedRoundForActiveDeck();
  renderCard();
  renderProgress();
  renderReview();
  host.saveState();
}

export function setStudyMode(mode) {
  const nextMode = host.normalizeStudyMode(mode);
  if (runtime.studyMode === nextMode) return;

  const prevMode = runtime.studyMode;
  host.saveCurrentDeckStateToBank();
  // Parsing mode owns its chapter scope via runtime.parsingChapter (the
  // dropdown above the focused paradigm). It must never share selectedKeys
  // with vocab/morph, regardless of splitSelection — otherwise entering
  // parsing would clobber the vocab/morph chapter pick, and leaving would
  // leak the parsing chapter back into them. So we always save/restore
  // around any parsing transition; the regular splitSelection swap handles
  // vocab↔morph as before.
  const parsingTransition = prevMode === 'parsing' || nextMode === 'parsing';
  if (runtime.splitSelection || parsingTransition) {
    // When splitSelection is OFF and we're entering parsing, the current
    // selection is shared by vocab+morph. Stash it under both slots so the
    // user lands back on the right chapter regardless of which mode they
    // return to first.
    if (!runtime.splitSelection && nextMode === 'parsing' && (prevMode === 'vocab' || prevMode === 'morph')) {
      saveModeSelection('vocab');
      saveModeSelection('morph');
    } else {
      saveModeSelection(prevMode);
    }
    restoreModeSelection(nextMode);
  }
  // Swap the spaced-repetition flag to the section we're entering. Save the
  // mode we're leaving back into spacedByMode first (vocab/morph each keep
  // their own), then mirror the destination's value into the live flag so the
  // deck build below and the toggle UI reflect this section's setting.
  if (prevMode === 'vocab' || prevMode === 'morph') {
    runtime.spacedByMode[prevMode] = runtime.spacedRepetition;
  }
  if (nextMode === 'vocab' || nextMode === 'morph') {
    runtime.spacedRepetition = effectiveSpacedForMode(nextMode);
  }
  runtime.studyMode = nextMode;
  // Entering parsing: the dropdown is the source of truth, so overwrite
  // selectedKeys with [parsingChapter] (a chapter-keyed string, which
  // deriveSelectionLevels reads as the max effective chapter). Any stale
  // modeSelections.parsing entry from before this feature is overridden.
  if (nextMode === 'parsing') {
    const chapter = Number.isInteger(runtime.parsingChapter) && runtime.parsingChapter >= 1 && runtime.parsingChapter <= 20
      ? runtime.parsingChapter
      : 20;
    runtime.parsingChapter = chapter;
    runtime.selectedKeys = [String(chapter)];
    runtime.currentSession = null;
  }
  host.clearSpacedUndoSnapshot();
  host.resetMorphAnswerState();
  host.ensureDirectionalStores();
  runtime.marks = host.getDirectionalMarksStore();
  host.syncToggleButtons();

  if (host.isReaderMode()) {
    host.renderReaderModule();
    renderProgress();
    host.saveState();
    return;
  }

  // Grammar Quiz mode (Phase 2 PR C): short-circuit before any of the
  // vocab-deck logic below runs, mirroring the Reader early-return above.
  // Grammar owns its own lesson scope (runtime.grammar.lesson, restored/
  // rendered by js/ui/grammar.js's renderGrammarPanel) and must never build
  // or touch runtime.deck / vocab SRS — see docs/bbh-conversion-plan.md
  // "Phase 2 architecture decisions" #6.
  if (host.isGrammarMode && host.isGrammarMode()) {
    renderProgress();
    host.saveState();
    return;
  }

  if (!runtime.selectedKeys.length) {
    // Switching into a mode with nothing selected (common when split
    // vocab/grammar selection is on and only one side has chapters): drop the
    // deck we carried over from the mode we just left. Without this the stale
    // deck stays in runtime.deck and its cards leak through — e.g. grammar
    // cards rendering in an empty vocab deck — and the progress/review panels
    // keep summarizing it. saveCurrentDeckStateToBank() ran above, so the
    // previous deck's resume cursor is already banked.
    runtime.deck = [];
    runtime.originalDeck = [];
    runtime.activeDeckRef = null;
    runtime.currentIdx = 0;
    runtime.activeDeckCount = 0;
    host.saveState();
    renderCard();
    renderProgress();
    renderReview();
    return;
  }

  const keysToLoad = runtime.currentSession ? expandSessionSets(runtime.currentSession) : runtime.selectedKeys;
  loadDeckFromKeys(keysToLoad, runtime.currentSession ? runtime.currentSession.id : null);
}

export function setAppProfile(profile) {
  const nextProfile = 'vocab_grammar';
  if (runtime.appProfile === nextProfile) return;

  host.saveCurrentDeckStateToBank();
  runtime.appProfile = nextProfile;
  host.clearSpacedUndoSnapshot();

  host.ensureDirectionalStores();
  runtime.marks = host.getDirectionalMarksStore();
  buildSessions();
  buildChapterSelector();
  host.syncToggleButtons();

  if (!runtime.selectedKeys.length) {
    renderCard();
    renderProgress();
    renderReview();
    host.saveState();
    return;
  }

  const keysToLoad = runtime.currentSession ? expandSessionSets(runtime.currentSession) : runtime.selectedKeys;
  loadDeckFromKeys(keysToLoad, runtime.currentSession ? runtime.currentSession.id : null);
}


export function toggleShuffle() {
  runtime.shuffled = !runtime.shuffled;
  runtime.flipsSinceReshuffle = 0;
  host.syncToggleButtons();

  if (runtime.spacedRepetition) {
    runtime.deck = host.buildStudyDeck(runtime.originalDeck, { forceShuffle: runtime.shuffled });
    runtime.currentIdx = Math.min(runtime.currentIdx, runtime.activeDeckCount);
  } else {
    // Toggling shuffle (either direction) collapses the middle pile back
    // into active so the deck order matches the partition state. Without
    // this, unspacedMiddleIds keeps cards earmarked as middle even though
    // they're now interleaved with active in runtime.deck, leaving
    // activeDeckCount/unspacedMiddleCount out of sync with what the user sees.
    runtime.unspacedMiddleIds = new Set();
    runtime.unspacedMiddleCount = 0;
    const activeCards = host.getRemainingCards();
    const knownCards = runtime.deck.filter(card => runtime.marks[card.id] === 'known');
    runtime.deck = runtime.shuffled ? [...shuffleArray([...activeCards]), ...knownCards] : [...activeCards, ...knownCards];
    runtime.activeDeckCount = activeCards.length;
    runtime.unspacedRoundSize = activeCards.length;
    runtime.unspacedRoundMarks = 0;

    if (runtime.currentIdx >= activeCards.length) {
      runtime.currentIdx = activeCards.length ? 0 : runtime.deck.length;
    }
  }

  runtime.isFlipped = false;
  renderCard();
  renderProgress();
  renderReview();
  host.saveState();
}

export function toggleRequiredOnly() {
  runtime.requiredOnly = !runtime.requiredOnly;
  host.syncToggleButtons();
  // The chapter buttons show a per-chapter vocab count; refresh it so the
  // numbers reflect the starred-only filter while the selector is open.
  buildChapterSelector();
  if (!runtime.selectedKeys.length) {
    host.saveState();
    return;
  }
  const keysToLoad = runtime.currentSession ? expandSessionSets(runtime.currentSession) : runtime.selectedKeys;
  loadDeckFromKeys(keysToLoad, runtime.currentSession ? runtime.currentSession.id : null);
}

export function toggleHardVocabReview() {
  runtime.hardVocabReviewMode = !runtime.hardVocabReviewMode;
  host.syncToggleButtons();
  if (!runtime.selectedKeys.length) {
    host.saveState();
    return;
  }
  const keysToLoad = runtime.currentSession ? expandSessionSets(runtime.currentSession) : runtime.selectedKeys;
  loadDeckFromKeys(keysToLoad, runtime.currentSession ? runtime.currentSession.id : null);
}


export function toggleDirection() {
  runtime.directionToGreek = !runtime.directionToGreek;
  host.clearSpacedUndoSnapshot();
  host.ensureDirectionalStores();
  runtime.marks = host.getDirectionalMarksStore();
  host.resetMorphAnswerState();
  host.syncToggleButtons();
  if (runtime.selectedKeys.length) {
    const keysToLoad = runtime.currentSession ? expandSessionSets(runtime.currentSession) : runtime.selectedKeys;
    loadDeckFromKeys(keysToLoad, runtime.currentSession ? runtime.currentSession.id : null);
    return;
  }
  runtime.isFlipped = false;
  renderCard();
  renderProgress();
  renderReview();
  host.saveState();
}

export function toggleSpacedRepetition() {
  if (host.isReaderMode()) return;
  runtime.spacedRepetition = !runtime.spacedRepetition;
  // Persist this section's choice so vocab and grammar keep diverging.
  if (runtime.studyMode === 'vocab' || runtime.studyMode === 'morph') {
    runtime.spacedByMode[runtime.studyMode] = runtime.spacedRepetition;
  }
  host.clearSpacedUndoSnapshot();
  host.resetUnspacedCycleState();
  host.syncToggleButtons();
  if (!runtime.selectedKeys.length) {
    host.saveState();
    return;
  }
  runtime.deck = host.buildStudyDeck(runtime.originalDeck);
  runtime.currentIdx = 0;
  // spacedRepetition is part of the deck-state-bank key, so the deck now
  // belongs to a different bank entry — refresh the ref before any save.
  host.markActiveDeckRef();
  host.resetMorphAnswerState();
  runtime.isFlipped = false;
  renderCard();
  renderProgress();
  renderReview();
  host.saveState();
}

// Switch the spaced-review spacing cadence between the relaxed 8-month
// course pace ('relaxed', the default for new users) and the 2-month
// intensive pace ('intensive'). The Advanced-settings toggle is framed as
// the intensive opt-in (ON = intensive), but this flip is symmetric.
// This only changes how *future* flips are scheduled (the easy-interval
// growth curve and the max-interval cap) — already-scheduled cards keep
// their due dates, so the deck and current due states are untouched and
// there's nothing to rebuild. Use "Smooth schedule" / a timing reset to
// rebalance existing due dates if desired.
export function toggleSpacingCadence() {
  runtime.spacingCadence = runtime.spacingCadence === 'relaxed' ? 'intensive' : 'relaxed';
  host.syncToggleButtons();
  renderProgress();
  renderReview();
  host.saveState();
}

// Toggle the unspaced "Daily archive reset" preference. When on, the next
// time the app sees the 5 AM-cutoff day key has rolled over from the last
// archive activity it wipes the unspaced 'known' marks. When off,
// Easy-archived cards persist indefinitely until the user resets.
export function toggleUnspacedDailyReset() {
  runtime.unspacedAutoResetEnabled = !runtime.unspacedAutoResetEnabled;
  if (runtime.unspacedAutoResetEnabled) {
    // Re-seed on every opt-in so the auto-clear fires on the *next*
    // 5 AM boundary, never the moment of opt-in. Without this, flipping
    // the toggle off+on across a day rollover would surprise the user
    // by wiping archives the instant they re-enable it.
    host.noteUnspacedArchiveActivity();
  }
  host.syncToggleButtons();
  host.saveState();
}


export function reshuffleEligible() {
  if (!runtime.selectedKeys.length) return;

  // Parsing: rebuild through its canonical builder so the reshuffle honours
  // orderParsingPool. The per-session show-count budget is deliberately kept
  // (not reset) so repeats stay bounded across reshuffles within the run.
  if (host.isParsingMode()) {
    host.rebuildParsingCycle();
    runtime.isFlipped = false;
    renderCard();
    renderProgress();
    renderReview();
    host.saveState();
    return;
  }

  if (runtime.spacedRepetition) {
    // Shuffle only currently-eligible (due) cards. SRS progress and
    // scheduled-ahead deferrals are left untouched.
    runtime.deck = host.buildStudyDeck(runtime.originalDeck, { forceShuffle: true });
    runtime.currentIdx = runtime.activeDeckCount ? 0 : runtime.currentIdx;
  } else {
    // Non-spaced: shuffle the still-active (not-yet-known) portion only;
    // known cards stay pinned to the end of the cycle. Equivalent to an
    // end-of-round reshuffle — middle dumps back into active first so
    // unspacedMiddleIds stays aligned with the visible deck order.
    runtime.unspacedMiddleIds = new Set();
    runtime.unspacedMiddleCount = 0;
    const activeCards = host.getRemainingCards();
    const knownCards = runtime.deck.filter(card => runtime.marks[card.id] === 'known');
    runtime.deck = [...shuffleArray([...activeCards]), ...knownCards];
    runtime.activeDeckCount = activeCards.length;
    runtime.unspacedRoundSize = activeCards.length;
    runtime.unspacedRoundMarks = 0;
    runtime.currentIdx = activeCards.length ? 0 : runtime.deck.length;
  }

  runtime.isFlipped = false;
  renderCard();
  renderProgress();
  renderReview();
  host.saveState();
}

function fastForwardScheduling(advanceMs) {
  if (!runtime.spacedRepetition || !runtime.originalDeck.length) return;
  host.advanceScheduledCards(runtime.originalDeck, advanceMs);
  runtime.deck = host.buildStudyDeck(runtime.originalDeck);
  runtime.currentIdx = 0;
  runtime.isFlipped = false;
  host.resetMorphAnswerState();
  renderCard();
  renderProgress();
  renderReview();
  host.saveState();
}

export function fastForwardOneDay() {
  fastForwardScheduling(msFromDays(1));
}

export function fastForwardOneWeek() {
  // A full week pulls every scheduled card 7 days earlier in one step, which
  // can dump a large batch into "due now" and effectively collapse the
  // spacing — and fast-forward has no undo. Confirm before applying. (Skip
  // the prompt when there's nothing scheduled to advance.)
  if (!runtime.spacedRepetition || !runtime.originalDeck.length) return;
  if (!window.confirm('Fast-forward the review schedule by 1 week?\n\nEvery card\'s due date moves 7 days earlier, so a large batch may come due at once. This can\'t be undone.')) {
    return;
  }
  fastForwardScheduling(msFromDays(7));
}

export function resetCurrentDeck() {
  if (!runtime.selectedKeys.length) {
    host.clearSpacedUndoSnapshot();
    host.clearSavedState();
    return;
  }

  if (runtime.spacedRepetition) {
    openResetSpacedModal();
    return;
  }

  openResetUnspacedModal();
}

// Shortcut entry point: opens the same reset modal as `resetCurrentDeck`
// but pre-checks the "Starred cards only" scope so the action only touches
// graded vocabulary in the current selection. The user still chooses
// between "Set all to now" and "Reset progress" inside the spaced modal.
export function resetRequiredOnly() {
  if (!runtime.selectedKeys.length) return;
  const overlayId = runtime.spacedRepetition ? 'resetSpacedOverlay' : 'resetUnspacedOverlay';
  if (runtime.spacedRepetition) {
    openResetSpacedModal();
  } else {
    openResetUnspacedModal();
  }
  const overlay = document.getElementById(overlayId);
  const checkbox = overlay && overlay.querySelector('input[type="checkbox"][data-reset-required-only]');
  if (checkbox) checkbox.checked = true;
  if (runtime.spacedRepetition) updateResetSpacedScopeLabels();
}

// Returns true when a card should be touched by the reset operation,
// given the "Starred cards only" scope toggle in the reset modal.
function shouldResetCard(card, requiredOnly) {
  if (!requiredOnly) return true;
  return !!(card && card.required);
}

// The reset modal targets the *current selection*, not the current deck.
// runtime.originalDeck is already filtered to required-only when the
// study toggle is on, so iterating it would silently skip non-required
// cards on a whole-deck reset. Pull the full selection here and let
// shouldResetCard apply the modal's own scope toggle.
function getResetScopeCards() {
  const allSelected = host.getSelectedCards(runtime.selectedKeys);
  return Array.isArray(allSelected) && allSelected.length ? allSelected : runtime.originalDeck;
}

function performUnspacedDeckReset(requiredOnly) {
  if (!requiredOnly) {
    // Whole-deck reset still clears the saved deck-state for this combo.
    const deckKey = host.getDeckStateKey(runtime.selectedKeys, runtime.requiredOnly, runtime.spacedRepetition);
    delete runtime.deckStates[deckKey];
  }
  const directionalMarks = host.getDirectionalMarksStore();

  getResetScopeCards().forEach(card => {
    if (!shouldResetCard(card, requiredOnly)) return;
    delete directionalMarks[card.id];
  });

  runtime.marks = directionalMarks;
  host.resetUnspacedCycleState();
  runtime.unspacedPendingRecycle = false;
  runtime.currentIdx = 0;
  runtime.isFlipped = false;
  host.resetMorphAnswerState();
  runtime.deck = [];
  runtime.activeDeckCount = 0;
  runtime.deck = host.buildStudyDeck(runtime.originalDeck);
  resetUnspacedRoundForActiveDeck();
  renderCard();
  renderProgress();
  renderReview();
  host.saveState();
}

function performSpacedProgressReset(requiredOnly) {
  if (!requiredOnly) {
    const deckKey = host.getDeckStateKey(runtime.selectedKeys, runtime.requiredOnly, runtime.spacedRepetition);
    delete runtime.deckStates[deckKey];
  }
  const directionalProgress = host.getDirectionalProgressStore();

  getResetScopeCards().forEach(card => {
    if (!shouldResetCard(card, requiredOnly)) return;
    const p = directionalProgress[card.id];
    if (p && typeof p === 'object') {
      p.dueAt = 0;
      p.intervalDays = 0;
      p.streak = 0;
      p.easyStreak = 0;
      p.srsStage = 0;
      p.ease = 2.3;
      p.lastEasyIntervalDays = 0;
      p.confidence = 0;
      p.confidenceHistory = [];
      // Clear any in-progress lapse/relearn, leech, and variant-cycle state so
      // a reset card starts from a clean schedule, not mid-ladder.
      p.inRelearn = false;
      p.relearnLeft = 0;
      p.preLapseIntervalDays = 0;
      p.lapseCount = 0;
      p.leechDrill = false;
      p.leechStreak = 0;
      p.cycleFacesPassed = [];
      p.cycleFacesUncertain = [];
      p.cycleFacesHeld = {};
      p.cycleStartedAt = 0;
      p.cycleFaceSamples = {};
      // The SRS scheduling is gone, so the last spaced outcome can no
      // longer describe a real scheduled state. Leaving it set made the
      // per-word analytics show "lastOutcome: easy" alongside stage 0 /
      // ease 2.30 / no due date.
      delete p.lastSpacedOutcome;
      // seenCount, passCount, failCount, lastReviewedAt intentionally kept
    }
  });

  runtime.marks = host.getDirectionalMarksStore();
  host.resetUnspacedCycleState();
  runtime.currentIdx = 0;
  runtime.isFlipped = false;
  host.resetMorphAnswerState();
  runtime.deck = [];
  runtime.activeDeckCount = 0;
  runtime.deck = host.buildStudyDeck(runtime.originalDeck);
  renderCard();
  renderProgress();
  renderReview();
  host.saveState();
}

function performSpacedTimingReset(requiredOnly) {
  const directionalProgress = host.getDirectionalProgressStore();

  getResetScopeCards().forEach(card => {
    if (!shouldResetCard(card, requiredOnly)) return;
    const p = directionalProgress[card.id];
    if (p && typeof p === 'object') {
      p.dueAt = 0;
      p.intervalDays = 0;
      // streak, easyStreak, srsStage, ease, lastEasyIntervalDays,
      // confidence, confidenceHistory intentionally kept
    }
  });

  runtime.currentIdx = 0;
  runtime.isFlipped = false;
  host.resetMorphAnswerState();
  runtime.deck = host.buildStudyDeck(runtime.originalDeck);
  renderCard();
  renderProgress();
  renderReview();
  host.saveState();
}

// Levels the future due-date pile-up: finishing a deck shortly after a
// timing reset hands most cards the same interval, so they all land on the
// same future day (typically the interval cap). This re-spreads the pile so
// roughly the same number of cards come due each day, with two guarantees:
// cards due within the next 3 days are never touched (short intervals are the
// stabilization churn — pulling them around would fight the scheduler), and no
// card is ever pushed later than it already is.
//
// The smoothing window is [day 4 .. the latest due-day]. Its target daily load
// is the plain average over that window:
//     value = (cards due in the window) / n,   n = lastDay - 4 + 1
// A day is a "pile" only when it carries MORE than 1.1× value; the surplus
// (every card above 1.1× value) is shed onto earlier days. Receiving days fill
// only up to a hard 1× value cap, so relieving one pile never builds another
// and the filled days settle a touch below the piles they drain. Working from
// the far end of the window inward and always preferring the nearest earlier
// day with room, each pile drains into the days just before it first, and a
// card only ever moves earlier (never later, never past day 4).
//
// intervalDays is left alone on purpose: it records the interval the card
// *earned*, which seeds the next 'easy' growth — reviewing a few days early
// shouldn't shrink a card's future intervals.
function performSpacedScheduleSmooth(requiredOnly) {
  const directionalProgress = host.getDirectionalProgressStore();
  const now = Date.now();
  const protectedUntil = now + msFromDays(3);

  const entries = [];
  getResetScopeCards().forEach(card => {
    if (!shouldResetCard(card, requiredOnly)) return;
    const p = directionalProgress[card.id];
    if (p && typeof p === 'object' && Number(p.dueAt) > protectedUntil) entries.push(p);
  });
  if (entries.length < 2) return;

  const FIRST_DAY = 4;
  const MAX_SMOOTH_DAY = 366;  // bound the bucket array against any corrupt far-future dueAt
  const dayOf = (dueAt) => Math.min(MAX_SMOOTH_DAY, Math.max(FIRST_DAY, Math.ceil(daysFromMs(dueAt - now))));

  // Bucket every in-scope card by its due-day and find the far end of the
  // window. Buckets and `counts` stay in lockstep so a card can be physically
  // moved (popped from one day, pushed onto an earlier one) as it redistributes.
  const buckets = new Map();  // day -> progress objects currently due that day
  let lastDay = FIRST_DAY;
  entries.forEach((p) => {
    const d = dayOf(p.dueAt);
    if (!buckets.has(d)) buckets.set(d, []);
    buckets.get(d).push(p);
    if (d > lastDay) lastDay = d;
  });
  if (lastDay - FIRST_DAY < 1) return;  // everything already lands within one day-slot

  // value = average daily load over [day 4 .. lastDay]; a day over 1.1× value
  // is a pile, and receiving days fill only up to 1× value (the hard cap).
  const value = entries.length / (lastDay - FIRST_DAY + 1);  // = cards / n
  const pileThreshold = value * 1.1;
  const cap = value;

  const counts = new Array(lastDay + 1).fill(0);
  for (let d = FIRST_DAY; d <= lastDay; d++) counts[d] = (buckets.get(d) || []).length;

  // Start at the end of the window and walk back toward day 4. Each pile sheds
  // the cards above 1.1× value, one at a time, onto the nearest earlier day
  // still under the cap — biased to the days closest to the pile. Cards only
  // ever move earlier; a pile that runs out of earlier room keeps the rest.
  for (let day = lastDay; day > FIRST_DAY; day--) {
    while (counts[day] > pileThreshold) {
      let dest = -1;
      for (let earlier = day - 1; earlier >= FIRST_DAY; earlier--) {
        if (counts[earlier] < cap) { dest = earlier; break; }
      }
      if (dest === -1) break;  // no earlier day has room — leave the rest here
      const p = buckets.get(day).pop();
      const targetDueAt = now + msFromDays(dest);
      if (targetDueAt < p.dueAt) p.dueAt = targetDueAt;  // earlier-only guard
      if (!buckets.has(dest)) buckets.set(dest, []);
      buckets.get(dest).push(p);
      counts[day] -= 1;
      counts[dest] += 1;
    }
  }

  // Nothing becomes due immediately (earliest target is day 4), so the
  // active deck is unchanged — only the review panel's due times moved.
  renderProgress();
  renderReview();
  host.saveState();
}

// True if the reset-scope toggle in the given modal is checked.
function isResetScopeRequiredOnly(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return false;
  const checkbox = overlay.querySelector('input[type="checkbox"][data-reset-required-only]');
  return !!(checkbox && checkbox.checked);
}

// Rewrites the spaced-reset action labels to name the scope the buttons will
// actually touch — the current selection ("selected"), or just its starred /
// graded cards when the scope toggle is on ("starred selected") — so the
// labels never read "all" (which looks like "every word in the app" rather
// than the current selection). Updates the body action-names and the buttons
// together; button text is CSS-uppercased, so case here is cosmetic. Re-run on
// open and whenever the "Starred cards only" checkbox changes.
export function updateResetSpacedScopeLabels() {
  const overlay = document.getElementById('resetSpacedOverlay');
  if (!overlay) return;
  const word = isResetScopeRequiredOnly('resetSpacedOverlay') ? 'starred selected' : 'selected';
  overlay.querySelectorAll('[data-reset-scope="timing"]').forEach((el) => {
    el.textContent = `Set ${word} to now`;
  });
  overlay.querySelectorAll('[data-reset-scope="progress"]').forEach((el) => {
    el.textContent = `Reset ${word}`;
  });
}

function openResetSpacedModal() {
  const overlay = document.getElementById('resetSpacedOverlay');
  if (!overlay) {
    // Fall back to legacy confirm if the modal markup isn't present.
    if (window.confirm('Reset spaced-review scheduling for this deck only? This keeps your unspaced marks and pass history.')) {
      host.clearSpacedUndoSnapshot();
      performSpacedProgressReset(false);
    }
    return;
  }
  // Reset the scope toggle to off whenever the modal opens, so the
  // default behaviour ("reset the whole deck") is unambiguous.
  const checkbox = overlay.querySelector('input[type="checkbox"][data-reset-required-only]');
  if (checkbox) checkbox.checked = false;
  updateResetSpacedScopeLabels();
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

export function closeResetSpacedModal() {
  const overlay = document.getElementById('resetSpacedOverlay');
  if (!overlay) return;
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  // Match the behavior of the other modal close handlers: only drop
  // modal-open when no other overlay is currently visible.
  const anyOtherOpen = document.querySelector('.consent-overlay.show');
  if (!anyOtherOpen) document.body.classList.remove('modal-open');
  shieldClicksBriefly();
}

export function confirmResetSpacedTimingOnly() {
  const requiredOnly = isResetScopeRequiredOnly('resetSpacedOverlay');
  closeResetSpacedModal();
  if (!runtime.selectedKeys.length || !runtime.spacedRepetition) return;
  host.clearSpacedUndoSnapshot();
  performSpacedTimingReset(requiredOnly);
}

export function confirmResetSpacedProgress() {
  const requiredOnly = isResetScopeRequiredOnly('resetSpacedOverlay');
  closeResetSpacedModal();
  if (!runtime.selectedKeys.length || !runtime.spacedRepetition) return;
  host.clearSpacedUndoSnapshot();
  performSpacedProgressReset(requiredOnly);
}

export function confirmResetSpacedSmooth() {
  const requiredOnly = isResetScopeRequiredOnly('resetSpacedOverlay');
  closeResetSpacedModal();
  if (!runtime.selectedKeys.length || !runtime.spacedRepetition) return;
  host.clearSpacedUndoSnapshot();
  performSpacedScheduleSmooth(requiredOnly);
}

function openResetUnspacedModal() {
  const overlay = document.getElementById('resetUnspacedOverlay');
  if (!overlay) {
    // Fall back to legacy confirm if the modal markup isn't present.
    if (window.confirm('Reset unspaced marks for this deck only? This keeps your spaced-review scheduling and intervals.')) {
      host.clearSpacedUndoSnapshot();
      performUnspacedDeckReset(false);
    }
    return;
  }
  const checkbox = overlay.querySelector('input[type="checkbox"][data-reset-required-only]');
  if (checkbox) checkbox.checked = false;
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

export function closeResetUnspacedModal() {
  const overlay = document.getElementById('resetUnspacedOverlay');
  if (!overlay) return;
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  const anyOtherOpen = document.querySelector('.consent-overlay.show');
  if (!anyOtherOpen) document.body.classList.remove('modal-open');
  shieldClicksBriefly();
}

export function confirmResetUnspacedMarks() {
  const requiredOnly = isResetScopeRequiredOnly('resetUnspacedOverlay');
  closeResetUnspacedModal();
  if (!runtime.selectedKeys.length || runtime.spacedRepetition) return;
  host.clearSpacedUndoSnapshot();
  performUnspacedDeckReset(requiredOnly);
}

export function openResetStatsModal() {
  const overlay = document.getElementById('resetStatsOverlay');
  if (!overlay) {
    // Fall back to the legacy single-confirm flow if the modal markup
    // isn't present (e.g. during older cached index.html on PWA installs).
    if (window.confirm('Reset all saved study stats, marks, and spaced-review scheduling for both directions?')) {
      performResetStatsKeepSettings();
    }
    return;
  }
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

export function closeResetStatsModal() {
  const overlay = document.getElementById('resetStatsOverlay');
  if (!overlay) return;
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  const anyOtherOpen = document.querySelector('.consent-overlay.show');
  if (!anyOtherOpen) document.body.classList.remove('modal-open');
  shieldClicksBriefly();
}

export function confirmResetStatsKeepSettings() {
  closeResetStatsModal();
  // Double-confirm: the modal pick is the first step, this native dialog
  // is the second so a misclick doesn't quietly wipe progress.
  const confirmed = window.confirm('Reset all saved study stats, marks, spaced-review scheduling, achievements, and study-time history? Your settings are kept.');
  if (!confirmed) return;
  performResetStatsKeepSettings();
}

export function confirmResetToStart() {
  closeResetStatsModal();
  const confirmed = window.confirm('Wipe ALL data and return to the initial launch state? This clears stats, settings, theme, fonts, profile, and the study-aid disclaimer, then reloads the page.');
  if (!confirmed) return;
  performResetToStart();
}

function performResetStatsKeepSettings() {
  host.clearSpacedUndoSnapshot();

  runtime.globalWordMarks = { g2e: {}, e2g: {} };
  runtime.globalWordProgress = { g2e: {}, e2g: {} };
  runtime.deckStates = {};
  runtime.appUsageStats = {
    totalMs: 0,
    dailyMs: {},
    activeStudyMs: 0,
    activeDailyMs: {},
    lastActiveAt: document.hidden ? 0 : Date.now(),
    lastStudyInteractionAt: 0,
    lastStudyCountedAt: 0,
    firstStudyAt: 0,
    studySessionHistory: [],
    currentStudySession: null
  };
  runtime.appGamification = sanitizeGamificationState({});
  host.ensureDirectionalStores();
  host.resetUnspacedCycleState();
  runtime.marks = host.getDirectionalMarksStore();

  if (runtime.selectedKeys.length) {
    runtime.currentIdx = 0;
    runtime.isFlipped = false;
    runtime.deck = [];
    runtime.activeDeckCount = 0;
    runtime.deck = host.buildStudyDeck(runtime.originalDeck);
    renderCard();
    renderProgress();
    renderReview();
  } else {
    renderReview();
    renderProgress();
  }

  host.saveState();
}

function performResetToStart() {
  const storage = getStorage();
  if (storage) {
    // Every key the app writes — clearing only STORAGE_KEY would leave
    // the disclaimer, theme, and font flags behind, so a reload wouldn't
    // feel like a fresh first launch.
    const keysToWipe = [
      STORAGE_KEY,
      CONSENT_STORAGE_KEY,
      THEME_STORAGE_KEY,
      FONT_FAMILY_STORAGE_KEY,
      TEXT_SIZE_STORAGE_KEY
    ];
    for (const key of keysToWipe) {
      try { storage.removeItem(key); } catch (_err) { /* ignore */ }
    }
  }
  // Reload to rebuild every in-memory store from a clean slate, including
  // the consent gate, theme initializer, and selector lists.
  window.location.reload();
}

// Backward-compatible alias kept in case any cached HTML still calls it.
export const resetAllStats = openResetStatsModal;
