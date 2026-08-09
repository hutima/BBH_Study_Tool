// Card selection / filtering helpers
import {
  isChapterKey, sourceHint, getChapterForKey, getWeekForKey,
  isBookVocabKey, parseBookVocabKey, parseAdvancedSubKey
} from './ordering.js';
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

// ─── Book Vocab resolution (task #20) ──────────────────────────────────────
// Book pseudo-keys ("BKV::<book>" / "BKV::<book>::g::<N>") don't carry their
// own cards: window.BBH_BOOK_VOCAB.books[].refs is an array of EXISTING
// card ids (lesson or advanced), ordered by descending in-book frequency —
// computed at generation time by tools/gen_bbh_advanced_vocab.mjs. This
// resolves a book pseudo-key back to the live, fully-enriched card objects
// (same shape a lesson/advanced selection would produce) so progress is
// shared with the card's home lesson/advanced-bucket set. Mirrors the
// Greek app's resolveBookVocabCards (ad1547e js/domain/deck/filters.js),
// adapted to resolve by id (deterministic here) rather than by headword.
const BOOK_VOCAB_GROUP_SIZE_DEFAULT = 50;
function bookVocabGroupSize() {
  const n = window.BBH_BOOK_VOCAB && Number(window.BBH_BOOK_VOCAB.groupSize);
  return n > 0 ? n : BOOK_VOCAB_GROUP_SIZE_DEFAULT;
}

// Index of every real (non-book-vocab) vocab card by id, built via a
// recursive getSelectedVocabCards call over the full non-book-vocab key
// inventory so a book-vocab-resolved card carries the EXACT SAME enriched
// shape (sourceKey/sourceLabel/chapter/week/id) as when reached via its
// home lesson or advanced bucket. Memoized; the signature invalidates the
// cache if the loaded card data changes.
let bookVocabCardIndex = null;
let bookVocabCardIndexSig = '';
function getRealCardIndexById() {
  const sets = getSets();
  const keys = Object.keys(sets).filter(k => !isBookVocabKey(k) && Array.isArray(sets[k]?.cards) && sets[k].cards.length);
  const sig = keys.length + ':' + keys.reduce((n, k) => n + sets[k].cards.length, 0);
  if (bookVocabCardIndex && bookVocabCardIndexSig === sig) return bookVocabCardIndex;
  const idx = new Map();
  // requiredFlag false: index the full inventory; required-only filtering
  // is applied per-card when the book-vocab set is emitted, below.
  getSelectedVocabCards(keys, false).forEach(card => {
    if (card && card.id != null && !idx.has(card.id)) idx.set(card.id, card);
  });
  bookVocabCardIndex = idx;
  bookVocabCardIndexSig = sig;
  return idx;
}

export function resolveBookVocabCards(rawKey, requiredFlag = false) {
  const parsed = parseBookVocabKey(rawKey);
  if (!parsed) return [];
  const books = (window.BBH_BOOK_VOCAB && Array.isArray(window.BBH_BOOK_VOCAB.books)) ? window.BBH_BOOK_VOCAB.books : [];
  const book = books.find(b => b.key === parsed.book);
  if (!book || !Array.isArray(book.refs)) return [];
  let refs = book.refs;
  if (parsed.group) {
    const size = bookVocabGroupSize();
    const start = (parsed.group - 1) * size;
    refs = refs.slice(start, start + size);
  }
  const index = getRealCardIndexById();
  const out = [];
  const seen = new Set();
  refs.forEach(id => {
    const card = index.get(id);
    if (!card) return; // linked card no longer present (mixed-version safe)
    if (requiredFlag && !card.required) return;
    if (seen.has(card.id)) return; // a book lists each lexeme once
    seen.add(card.id);
    out.push({ ...card });
  });
  return out;
}

export function getSelectedVocabCards(keys, requiredFlag = false) {
  const cards = [];
  const hasBookVocabKeys = (keys || []).some(isBookVocabKey);
  (keys || []).forEach(key => {
    const rawKey = String(key);
    if (isBookVocabKey(rawKey)) {
      resolveBookVocabCards(rawKey, requiredFlag).forEach(card => cards.push(card));
      return;
    }
    // Advanced-vocab bucket sub-groups ("ADV01::sub::1-25") select a slice
    // of their base bucket's cards by the card's own `sub` field (see
    // tools/gen_bbh_advanced_vocab.mjs) rather than a separate SETS entry.
    const sub = parseAdvancedSubKey(rawKey);
    const lookupKey = sub ? sub.baseKey : rawKey;
    const set = getSets()[lookupKey];
    const setCards = Array.isArray(set?.cards) ? set.cards : [];
    if (!setCards.length) return;
    setCards.forEach((card, idx) => {
      if (requiredFlag && !card.required) return;
      if (sub && String(card?.sub || '') !== sub.sub) return;
      cards.push({
        ...card,
        kind: 'vocab',
        sourceKey: lookupKey,
        sourceLabel: sourceHint(lookupKey),
        chapter: getChapterForKey(lookupKey),
        week: getWeekForKey(lookupKey),
        // Prefer the card's own explicit id (bbh-l<lesson>-<slug> or
        // bbh-adv-<strongs>) — only fall back to a derived key for cards
        // that don't carry one.
        id: card.id != null ? String(card.id) : `${lookupKey}-${idx}-${stableKey(card.g)}`
      });
    });
  });
  // Book vocab links to cards that may also be reachable via their home
  // lesson/advanced bucket (or via another selected book), so collapse
  // duplicate ids when any book-vocab key is in play. The non-book path
  // can't produce dupes, so it skips this to preserve the original card
  // order exactly.
  if (hasBookVocabKeys) {
    const seen = new Set();
    return cards.filter(card => {
      if (seen.has(card.id)) return false;
      seen.add(card.id);
      return true;
    });
  }
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

// Course-wide "all vocab" totals: this feeds js/ui/analytics.js's course-
// completion headline stats (the fixed "209 cards" identity documented
// throughout RESTORE.md/CLAUDE.md) — deliberately scoped to
// getAllChapterKeys() (isChapterKey-filtered), NOT the raw
// getAllVocabKeys(), so the "ADV<NN>" advanced-vocab buckets merged into
// window.SETS by js/app/main.js's mergeAdvancedVocabDecks (task #20) never
// inflate that denominator. Book-vocab pseudo-keys ("BKV::...") are never
// merged into window.SETS at all, so they're excluded automatically too.
// This mirrors the existing precedent for runtime.alphabet (Lesson 0/1
// practice decks are "never folded into any vocab count, stats or
// export" — see CLAUDE.md): advanced/book-vocab cards fully participate in
// SRS marks/progress/export like any other selected deck (verified in
// task #20's self-check), they just don't count toward the course-wide
// 209.
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
