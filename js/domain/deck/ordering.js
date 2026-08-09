// Deck ordering and set key helpers
import { CHAPTER_TO_WEEK } from '../../data/setMeta.js';

function getSets() {
  return window.SETS && typeof window.SETS === 'object' ? window.SETS : {};
}

export function isChapterKey(key) {
  return /^\d+$/.test(String(key));
}

// Task #20 (advanced vocab reworked to the Greek-app model — see
// docs/bbh-conversion-plan.md's task-20 addendum, mirroring ad1547e's
// isAdvancedKey/isBookKey in js/domain/deck/ordering.js). Advanced-vocab
// bucket keys registered into window.SETS are "ADV<NN>" (own id namespace,
// bbh-adv-<strongs> card ids); their sub-group selections use the pseudo-
// key "ADV<NN>::sub::<label>". Neither shape is isChapterKey (contains
// letters), so they're automatically excluded from buildChapterSelector's
// lesson grid, deselectAllChapters' sweep, and getAllChapterKeys' course-
// wide totals with no change needed there.
export function isAdvancedVocabKey(key) {
  return /^ADV\d+$/i.test(String(key || ''));
}

export function parseAdvancedSubKey(rawKey) {
  const m = String(rawKey || '').match(/^(ADV\d+)::sub::(.+)$/i);
  return m ? { baseKey: m[1], sub: m[2] } : null;
}

// Book Vocab pseudo-keys: "BKV::<book>" (whole book) and
// "BKV::<book>::g::<N>" (frequency group of BBH_BOOK_VOCAB.groupSize).
// These never live in window.SETS — js/domain/deck/filters.js's
// resolveBookVocabCards resolves them to EXISTING lesson/advanced card ids
// at deck-build time (see window.BBH_BOOK_VOCAB, js/data/bbh_advanced_vocab.js).
export function isBookVocabKey(key) {
  return /^BKV::/.test(String(key || ''));
}

export function parseBookVocabKey(rawKey) {
  const m = String(rawKey || '').match(/^BKV::([^:]+)(?:::g::(\d+))?$/);
  return m ? { book: m[1], group: m[2] ? Number(m[2]) : null } : null;
}

// Lesson keys are plain numeric strings ("1".."50") — sort numerically.
export function sortSetKeys(keys) {
  return [...keys].sort((a, b) => {
    const diff = Number(a) - Number(b);
    return diff || String(a).localeCompare(String(b));
  });
}

export function sourceHint(key) {
  const raw = String(key);
  if (/^\d+$/.test(raw)) return `Lesson ${raw}`;
  const sets = getSets();
  return sets[raw]?.label || raw;
}

export function getWeekForKey(key) {
  const raw = String(key);
  if (isChapterKey(raw)) return CHAPTER_TO_WEEK[Number(raw)] || null;
  const sets = getSets();
  return sets[raw]?.week || null;
}

export function getChapterForKey(key) {
  const raw = String(key);
  return isChapterKey(raw) ? Number(raw) : null;
}

// A "session" is a range preset (see SESSION_WEEK_META) whose `sets` list is
// lesson numbers — the BBH data has no odd/special-week supplemental concept.
export function expandSessionSets(session) {
  const rawSets = (session?.sets || []).map(String);
  return sortSetKeys([...new Set(rawSets.filter(isChapterKey))]);
}
