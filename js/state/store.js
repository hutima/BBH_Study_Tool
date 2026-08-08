// Central state store — single source of truth for all mutable app state
import { isPlainObject } from '../utils/helpers.js';

// ── Persistence keys ──
// Fresh BBH namespace — this is a new deployment with no shipped clients, so
// there is no migration from the old Greek-app keys (see persistence.js: no
// legacy-key fallback chain, no legacy-key purge list).
export const STORAGE_KEY = 'bbhStudyToolStateV1';
export const CONSENT_STORAGE_KEY = 'bbhStudyToolConsentV1';
export const THEME_STORAGE_KEY = 'bbhStudyToolThemeMode';
export const FONT_FAMILY_STORAGE_KEY = 'bbhStudyToolFontFamily';
export const TEXT_SIZE_STORAGE_KEY = 'bbhStudyToolTextSize';
export const SHOW_POINTS_STORAGE_KEY = 'bbhStudyToolShowPoints';
export const SHOW_TRANSLIT_STORAGE_KEY = 'bbhStudyToolShowTranslit';
export const PROGRESS_EXPORT_FORMAT = 'bbh-study-tool-progress-export';
export const PROGRESS_EXPORT_VERSION = 2;
export const STUDY_IDLE_MS = 90 * 1000;
export const STUDY_SESSION_BREAK_MS = 30 * 60 * 1000;
export const MAX_STUDY_SESSION_HISTORY = 500;
// The deck-state bank stores a full card-id ordering per selection combo and
// would otherwise grow without bound (every distinct chapter selection adds an
// entry). It is only a resume convenience, so it is capped to the most
// recently used selections to keep the persisted save small.
export const MAX_DECK_STATE_ENTRIES = 16;
// JSON exports are for transferring stats/history between devices; card-shuffle
// resume position isn't worth its weight (~30 KB per entry) in a backup, so
// trim to a much smaller set than the live localStorage cap.
export const EXPORT_MAX_DECK_STATE_ENTRIES = 4;

// ── Analytics overlay collapse defaults ───────────────────────────────
// Canonical set of collapse keys, with their default-closed (true) or
// default-open (false) value. Renames + compaction in migrations.js
// reference this list so the saved JSON never carries defunct keys, and
// runtime.js seeds its analyticsCollapsed from a clone of these defaults.
export const ANALYTICS_COLLAPSED_DEFAULTS = {
  // Top-level
  totalVocab: false,
  selectedVocab: true,
  totalGrammar: false,
  selectedGrammar: true,
  studyActivity: true,
  achievements: true,
  titles: true,
  // Total Vocabulary sub-sections
  totalVocabChapterMap: true,
  totalVocabProgress: true,
  totalVocabSlippingList: true,
  totalVocabStubborn: true,
  totalVocabImproved: true,
  // Selected Vocabulary sub-sections
  selectedVocabBar: false,
  selectedVocabProgress: true,
  selectedVocabSlippingList: true,
  selectedVocabStubborn: true,
  selectedVocabImproved: true,
  // Total Grammar sub-sections
  totalGrammarChapterMap: true,
  totalGrammarProgress: true,
  totalGrammarStubborn: true,
  totalGrammarImproved: true,
  paradigmStepStats: true,
  // Selected Grammar sub-sections
  selectedGrammarBar: false,
  selectedGrammarProgress: true,
  selectedGrammarStubborn: true,
  selectedGrammarImproved: true,
  // Achievements sub-collapsibles
  achievementsDaily: true,
  achievementsMilestones: true,
  achievementsChapters: true
};

// ── Sanitize gamification state ──
// (The live mutable app state is js/state/runtime.js's `runtime` object —
// this module previously also exported a parallel `S` object plus a set of
// direction/mode helper functions [getDirectionKey, getStudyStoreKey,
// ensureDirectionalStores, getDirectionalMarksStore,
// getDirectionalProgressStore, isMorphologyMode, isVocabOnlyProfile,
// canAccessGrammarUi, getProfileDescription, getModeDescription,
// resetMorphAnswerState] that operated on it. Nothing outside this file ever
// imported `S` or those functions — main.js/navigation.js/render.js all
// implement their own equivalents against `runtime` — so it was write-only
// dead weight from the Greek app and has been removed. sanitizeGamificationState
// below is genuinely shared (navigation.js, persistence.js) and is kept.)

export function sanitizeGamificationState(candidate) {
  if (!isPlainObject(candidate)) return { lastCelebratedLevel: null, lastCelebratedBadgeDay: null, lastEarnedAchievementIds: [] };
  return {
    lastCelebratedLevel: Number.isFinite(candidate.lastCelebratedLevel) ? candidate.lastCelebratedLevel : null,
    lastCelebratedBadgeDay: typeof candidate.lastCelebratedBadgeDay === 'string' ? candidate.lastCelebratedBadgeDay : null,
    lastEarnedAchievementIds: Array.isArray(candidate.lastEarnedAchievementIds) ? candidate.lastEarnedAchievementIds : []
  };
}
