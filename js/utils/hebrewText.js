// Hebrew text helpers -- point-stripping for the unpointed display toggle,
// and Hebrew-aware sorting for vocab lists (analytics / review "A-Z" mode).
//
// Replaces the old Greek-alphabet sort helper module (deleted -- no
// Greek-alphabet cards remain in this app).

// --- Unicode ranges (Hebrew points/cantillation) ---------------------------
// Cantillation: U+0591-U+05AF
// Points: U+05B0-U+05BC, U+05C1, U+05C2, U+05C7
// KEEP IN SYNC with tools/gen_bbh_data.mjs's POINTS_RE / stripPoints -- both
// implementations must strip the identical set of code points so generated
// data and runtime display never disagree on what counts as a "point".
// Preserved: letters U+05D0-U+05EA, maqaf U+05BE, sof pasuq U+05C3,
// geresh/gershayim U+05F3/U+05F4, and all other punctuation.
const POINTS_RE = /[֑-ְ֯-ׇּׁׂ]/g;

// Final-form letters folded to their medial equivalent for sort purposes only
// (display text is never altered by this map).
// U+05DA (final kaf)  -> U+05DB (kaf)
// U+05DD (final mem)  -> U+05DE (mem)
// U+05DF (final nun)  -> U+05E0 (nun)
// U+05E3 (final pe)   -> U+05E4 (pe)
// U+05E5 (final tsadi)-> U+05E6 (tsadi)
const FINAL_LETTER_MAP = {
  'ך': 'כ',
  'ם': 'מ',
  'ן': 'נ',
  'ף': 'פ',
  'ץ': 'צ'
};
const FINAL_LETTER_RE = /[ךםןףץ]/g;

/**
 * Remove Hebrew cantillation marks and vowel points from a string, leaving
 * consonantal letters, maqaf, sof pasuq, geresh/gershayim, and any other
 * (non-Hebrew) characters untouched. NFC-normalizes first so precomposed vs.
 * combining-mark input strips identically.
 */
export function stripHebrewPoints(str) {
  return String(str || '').normalize('NFC').replace(POINTS_RE, '');
}

/**
 * Sort key for Hebrew text: strip points, then fold final-form letters to
 * their medial form (so final kaf/kaf, final mem/mem, etc. sort adjacently),
 * and trim whitespace.
 */
export function hebrewSortKey(str) {
  return stripHebrewPoints(str)
    .replace(FINAL_LETTER_RE, (ch) => FINAL_LETTER_MAP[ch])
    .trim();
}

// Shared collator instance -- cheap to reuse across many comparisons.
let hebrewCollator = null;
function getHebrewCollator() {
  if (!hebrewCollator) {
    hebrewCollator = new Intl.Collator('he', { sensitivity: 'base' });
  }
  return hebrewCollator;
}

/**
 * Compare two Hebrew strings for sorting (e.g. Array.prototype.sort).
 */
export function compareHebrew(a, b) {
  return getHebrewCollator().compare(hebrewSortKey(a), hebrewSortKey(b));
}
