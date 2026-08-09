// Card selection / filtering helpers
import { isChapterKey, sourceHint, getChapterForKey, getWeekForKey } from './ordering.js';
import { getConfidencePct } from '../srs/confidence.js';

// "Hard review" scope: cards the learner has missed more than 10 times and
// whose recent accuracy is still under 40%. Cards with no progress entry are
// excluded — they can't have been missed yet.
export const HARD_VOCAB_MIN_FAILS = 10;
export const HARD_VOCAB_MAX_CONFIDENCE = 40;

// Irregular "split cards" configs (second aorist / liquid future / aorist
// passive / perfect active / mi-verb principal parts) were a Greek-grammar
// concept — BBH has no equivalent, so this stays an empty list. It's kept
// exported (rather than removed) because js/state/persistence.js and
// js/app/main.js still iterate/import it; an empty array makes every
// downstream helper below a safe no-op.
export const IRREGULAR_CARD_CONFIGS = [];

const IRREGULAR_TAGS = IRREGULAR_CARD_CONFIGS.map(c => c.tag);

// Matches a derived-card id suffix: `::<tag>` optionally followed by `::<n>`.
// With IRREGULAR_TAGS empty this can never match a real card id, so
// progressCardId is effectively the identity function — kept as a seam in
// case a future phase reintroduces derived cards.
const DERIVED_ID_SUFFIX_RE = new RegExp(`::(?:${IRREGULAR_TAGS.join('|')})(?:::\\d+)?$`);

export function progressCardId(cardId) {
  const id = String(cardId == null ? '' : cardId);
  if (!IRREGULAR_TAGS.length) return id;
  return id.replace(DERIVED_ID_SUFFIX_RE, '');
}

// Whether an irregular split-cards toggle is effectively ON. Always false —
// no IRREGULAR_CARD_CONFIGS entries exist to enable.
export function isIrregularCardEnabled(tag, selectedKeys, overrides) {
  const v = overrides && typeof overrides === 'object' ? overrides[tag] : undefined;
  if (v === true) return true;
  if (v === false) return false;
  const config = IRREGULAR_CARD_CONFIGS.find(c => c.tag === tag);
  if (!config) return false;
  const chapters = new Set((selectedKeys || []).filter(isChapterKey).map(Number));
  return chapters.has(config.chapter);
}

export function irregularEnabledTags(selectedKeys, overrides) {
  return IRREGULAR_CARD_CONFIGS
    .filter(c => isIrregularCardEnabled(c.tag, selectedKeys, overrides))
    .map(c => c.tag);
}

export function isHardVocabCard(card, progressStore) {
  const progress = (progressStore || {})[progressCardId(card?.id)];
  if (!progress) return false;
  if ((Number(progress.failCount) || 0) <= HARD_VOCAB_MIN_FAILS) return false;
  const pct = getConfidencePct(progress);
  return pct !== null && pct < HARD_VOCAB_MAX_CONFIDENCE;
}

export function filterHardVocabCards(cards, progressStore) {
  return (cards || []).filter(card => isHardVocabCard(card, progressStore));
}

function getSets() {
  return window.SETS && typeof window.SETS === 'object' ? window.SETS : {};
}

// Fallback id builder for any card that doesn't already carry an explicit
// `id` (the generated BBH data always does — see js/data/bbh_vocab.js).
function stableKey(text) {
  return typeof window.stableCardKey === 'function' ? window.stableCardKey(text) : String(text || '');
}

export function getSelectedVocabCards(keys, requiredFlag = false) {
  const cards = [];
  (keys || []).forEach(key => {
    const lookupKey = String(key);
    const set = getSets()[lookupKey];
    const setCards = Array.isArray(set?.cards) ? set.cards : [];
    if (!setCards.length) return;
    setCards.forEach((card, idx) => {
      if (requiredFlag && !card.required) return;
      cards.push({
        ...card,
        kind: 'vocab',
        sourceKey: lookupKey,
        sourceLabel: sourceHint(lookupKey),
        chapter: getChapterForKey(lookupKey),
        week: getWeekForKey(lookupKey),
        // Prefer the card's own explicit id (bbh-l<lesson>-<slug>) — only
        // fall back to a derived key for cards that don't carry one.
        id: card.id != null ? String(card.id) : `${lookupKey}-${idx}-${stableKey(card.g)}`
      });
    });
  });
  return cards;
}

// Irregular-card expansion is a no-op with IRREGULAR_CARD_CONFIGS empty, but
// kept as a real function (rather than removed) so js/app/main.js's deck-
// build call site doesn't need special-casing.
export function expandIrregularCards(cards, enabledTags) {
  if (!Array.isArray(cards) || !cards.length) return cards || [];
  const tags = (enabledTags || []).filter(t => IRREGULAR_TAGS.includes(t));
  if (!tags.length) return cards;
  return cards;
}

// No derived-card faces exist in the BBH data, so every card is its own
// independent progress entry.
export function derivedCardFaceKey(card) {
  return null;
}

// Kept as a general "every window.SETS key" utility (unfiltered) — no
// in-repo caller besides getAllVocabCards below as of task #15, but the
// name has no "lesson-only" contract of its own, so it stays literal.
export function getAllVocabKeys() {
  return Object.keys(getSets());
}

export function getAllChapterKeys() {
  return Object.keys(getSets()).filter(isChapterKey).sort((a, b) => Number(a) - Number(b));
}

// Course-wide "all vocab" totals (task #15 seam): this feeds js/ui/
// analytics.js's course-completion headline stats (the fixed "209 cards"
// identity documented throughout RESTORE.md/CLAUDE.md) — deliberately
// scoped to getAllChapterKeys() (isChapterKey-filtered), NOT the raw
// getAllVocabKeys(), so the 'book-*' advanced decks merged into window.SETS
// by js/app/main.js's mergeBookVocabDecks never inflate that denominator.
// This mirrors the existing precedent for runtime.alphabet (Lesson 0/1
// practice decks are "never folded into any vocab count, stats or
// export" — see CLAUDE.md): book decks fully participate in SRS
// marks/progress/export like any other selected deck (verified in task
// #15's self-check), they just don't count toward the course-wide 209.
export function getAllVocabCards(requiredFlag = false) {
  return getSelectedVocabCards(getAllChapterKeys(), requiredFlag);
}

export function getChapterVocabCards(chapterKey, requiredFlag = false) {
  return getSelectedVocabCards([String(chapterKey)], requiredFlag);
}

export function getCardReviewLeft(card) {
  return card.g || '—';
}

export function getCardReviewRight(card) {
  return card.e || '—';
}

export function getCardMetaLine(card) {
  return card.notes || '';
}
