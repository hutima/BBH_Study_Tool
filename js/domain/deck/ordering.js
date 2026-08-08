// Deck ordering and set key helpers
import { CHAPTER_TO_WEEK } from '../../data/setMeta.js';

function getSets() {
  return window.SETS && typeof window.SETS === 'object' ? window.SETS : {};
}

export function isChapterKey(key) {
  return /^\d+$/.test(String(key));
}

// Legacy pseudo-key predicates from the Greek app (ADV#, NTB::...). Nothing
// in the BBH data ever produces these, so they always return false — kept
// only because a couple of call sites still reference them defensively.
export function isAdvancedKey(key) {
  return /^ADV\d+$/i.test(String(key || ''));
}

export function isBookKey(key) {
  return /^NTB::/.test(String(key || ''));
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
