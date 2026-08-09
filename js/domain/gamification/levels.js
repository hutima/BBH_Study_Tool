// XP level thresholds and titles
//
// PR H punch-list item 6 (user feedback, 2026-08-09): the inherited Greek
// app's titles were transliterated-Greek puns (not Greek Unicode, so they
// evaded the release-gate Greek-Unicode scan — tools/check_release.mjs's
// check4b now scans for the specific retired words instead, so deliberately
// NOT repeating any of them here). Every title below is now a transliterated
// HEBREW pun preserving the same joke as its old Greek counterpart — see
// docs/bbh-conversion-plan.md "PR H punch-list item 6" addendum for the
// rationale and the full old->new list. `flav` (the level's flavor-text
// description) is unchanged throughout — only the title word itself changed
// languages.
export const XP_LEVELS = [
  { level: 1,  threshold: 0,       title: 'Alef',            flav: 'Already know one letter' },
  { level: 2,  threshold: 25,      title: 'Ger',              flav: 'Stranger in a strange land' },
  { level: 3,  threshold: 75,      title: 'Shomea',           flav: 'Listening, not yet understanding' },
  { level: 4,  threshold: 175,     title: 'Sefog',            flav: 'Soaking it all in' },
  { level: 5,  threshold: 400,     title: 'Talmid',           flav: 'Officially a student' },
  { level: 6,  threshold: 800,     title: 'Doresh',           flav: 'Checks the scrolls daily' },
  { level: 7,  threshold: 1500,    title: 'Qore',             flav: 'Reads without (much) stumbling' },
  { level: 8,  threshold: 2800,    title: 'Okhel-Sfarim',     flav: 'Devours texts for breakfast' },
  { level: 9,  threshold: 5000,    title: 'Ohev-Milim',       flav: 'Unhealthy attachment to words' },
  { level: 10, threshold: 7500,    title: 'Meturgeman',       flav: 'Actually understands some of this' },
  { level: 11, threshold: 10500,   title: 'Medakdek',         flav: 'Parses in their sleep' },
  { level: 12, threshold: 14000,   title: 'Darshan',          flav: 'Draws out hidden meaning' },
  { level: 13, threshold: 18000,   title: 'Noem',             flav: 'Argues about grammar for fun' },
  { level: 14, threshold: 23000,   title: 'Moreh',            flav: 'Others come to you now' },
  { level: 15, threshold: 29000,   title: 'Chakham',          flav: 'Wisdom achieved (allegedly)' },
  { level: 16, threshold: 36000,   title: 'Peh-Zahav',        flav: 'Golden-tongued' },
  { level: 17, threshold: 44000,   title: 'Ma’amik',     flav: 'Speaks of deep things' },
  { level: 18, threshold: 53000,   title: 'Rav-Yode’a',  flav: 'Knows more than is healthy' },
  { level: 19, threshold: 64000,   title: 'Sar',              flav: 'Ruler of the lexicon' },
  { level: 20, threshold: 77000,   title: 'Sofer',            flav: 'Final form achieved (or so you thought)' },
  { level: 21, threshold: 92000,   title: 'Kol-Yakhol',       flav: 'Almighty vocabulary, questionable sleep' },
  { level: 22, threshold: 108000,  title: 'Teshuvah',         flav: 'Changed your mind about quitting' },
  { level: 23, threshold: 125000,  title: 'Derashah',         flav: 'Can preach the paradigms now' },
  { level: 24, threshold: 140000,  title: 'Mushpa-mi-Shamayim', flav: 'Divinely inspired (by flashcards)' },
  { level: 25, threshold: 155000,  title: 'Chutzpah',         flav: 'Bold enough to parse anything' },
  { level: 26, threshold: 168000,  title: 'Etzem',            flav: 'The substance of things studied' },
  { level: 27, threshold: 178000,  title: 'Sod',              flav: 'The mystery is how you have time for this' },
  { level: 28, threshold: 187000,  title: 'Melo',             flav: 'Fullness of knowledge (almost)' },
  { level: 29, threshold: 195000,  title: 'Hitgalut',         flav: 'The final paradigms revealed' },
  { level: 30, threshold: 200000,  title: 'Davar',            flav: 'In the beginning was the Word — and you know it' }
];

export const REVIEW_XP_SCHEDULE = [8, 5, 3, 2]; // legacy schedule for migration only
