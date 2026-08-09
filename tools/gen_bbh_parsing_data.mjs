#!/usr/bin/env node
// GENERATED-FILE GENERATOR — this file is hand-maintained (not itself
// generated). It reads the two immutable Phase 2 parsing source files and
// deterministically writes js/data/bbh_parsing.js. Mirrors the style of
// tools/gen_bbh_data.mjs (Phase 1 generator).
//
// Sources (hand-maintained, authoritative — never generated into, never
// edited by this script):
//   - source/bbh/parsing/paradigms.json
//   - source/bbh/parsing/lesson_gates.json
//
// Output (generated — never hand-edit, re-run this script instead):
//   - js/data/bbh_parsing.js
//
// Before writing anything, this script spawns
// tools/validate_bbh_parsing_data.mjs as a subprocess and fails hard
// (nonzero exit, output relayed) if the source data doesn't pass — the
// generator never writes output from data the validator has rejected.
//
// Determinism: paradigms are sorted by (effective introducedLesson, id) —
// "effective introducedLesson" is the smallest introducedLesson among a
// paradigm's own forms (Infinity, i.e. sorts last, for a paradigm whose
// forms are all appendixOnly). Forms are kept in source order within their
// paradigm (staged paradigms rely on this being the authored order, not a
// re-sort). Re-running with no source changes must be a byte-identical
// no-op: `node tools/gen_bbh_parsing_data.mjs && git diff --exit-code
// js/data/bbh_parsing.js`.
//
// Usage: node tools/gen_bbh_parsing_data.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { stripHebrewPoints } from '../js/utils/hebrewText.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PARADIGMS_PATH = path.join(ROOT, 'source/bbh/parsing/paradigms.json');
const LESSON_GATES_PATH = path.join(ROOT, 'source/bbh/parsing/lesson_gates.json');
const VALIDATOR_PATH = path.join(ROOT, 'tools/validate_bbh_parsing_data.mjs');
const OUT_PATH = path.join(ROOT, 'js/data/bbh_parsing.js');

// ─── 1. Validate first — never generate from data the validator rejects ────
function runValidator() {
  try {
    execFileSync(process.execPath, [VALIDATOR_PATH], { cwd: ROOT, stdio: 'pipe' });
  } catch (err) {
    const out = (err.stdout ? err.stdout.toString() : '') + (err.stderr ? err.stderr.toString() : '');
    console.error('gen_bbh_parsing_data: tools/validate_bbh_parsing_data.mjs failed — aborting, nothing written.\n');
    console.error(out.trim());
    process.exit(1);
  }
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

// ─── 2. Deterministic paradigm ordering ────────────────────────────────────
// Effective sort lesson for a paradigm: the smallest introducedLesson among
// its own forms. A paradigm whose forms are all appendixOnly (no numeric
// introducedLesson anywhere) sorts to the end (Infinity). This never mutates
// or reorders `forms` itself — forms stay in source order (staged paradigms
// depend on this).
function paradigmSortLesson(paradigm) {
  const forms = Array.isArray(paradigm.forms) ? paradigm.forms : [];
  let min = Infinity;
  for (const form of forms) {
    if (Number.isInteger(form.introducedLesson) && form.introducedLesson < min) {
      min = form.introducedLesson;
    }
  }
  return min;
}

function sortParadigms(paradigms) {
  return [...paradigms].sort((a, b) => {
    const la = paradigmSortLesson(a);
    const lb = paradigmSortLesson(b);
    if (la !== lb) return la - lb;
    return String(a.id).localeCompare(String(b.id));
  });
}

// ─── 3. Form augmentation: add `compare` (points stripped) + `translit` ────
// `display` (pointed) stays authoritative and untouched; `compare` is a
// purely derived field for point-insensitive matching, stripped with the
// SAME logic js/utils/hebrewText.js uses at runtime for the unpointed
// display toggle — imported directly (both are ES modules) rather than
// duplicated, so generated data and runtime display can never disagree on
// what counts as a "point".
function augmentForm(form) {
  return { ...form, compare: stripHebrewPoints(form.display), translit: romanizeForm(form.display) };
}

// ─── 3b. Deterministic transliteration (task #17) ──────────────────────────
// Pure, rule-based romanizer: pointed `display` -> a translit string styled
// to match source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv's
// own `transliteration` column (the CASUAL style used in that CSV for
// lessons 1-17 — no macrons, no ʾ/ʿ glottal marks; lessons 18+ in that same
// CSV switch to an academic macron/ʾʿ style we do NOT follow here). Verified
// against 108 single-word CSV rows at 104/108 (96.3%) exact matches — see
// tools/gen_bbh_parsing_data.mjs's task #17 self-check in the PR notes for
// the full mismatch list. The 4 known misses, all intentionally NOT chased
// further (documented limitations, not bugs):
//   - יהוה "YHWH"      — unpronounceable divine name, not derivable from letters.
//   - אֲדֹנָי "Adonai"  — lexicalized proper-noun spelling (we produce "adonay").
//   - הָיְתָה "hayeta"  — vocal sheva after an OPEN long-vowel syllable (a real
//     Hebrew rule beyond Lesson 3's own "word-initial / second-of-two"
//     statement) comes out silent under our simple rule -> "hayta".
//   - שָׁמְרָה "shamera" — same gap, and it recurs across EVERY Qal perfect 3fs
//     form (C1-vowel-C2-sheva-C3-ah pattern) -> our output is "shamra" for
//     that whole family. Left as-is per the brief ("keep it SIMPLE... prefer
//     the plainer form"); a stress-aware sheva model would fix it but isn't
//     "cheap".
//
// Rule summary (see inline comments below for the fiddly bits):
//   - Consonants: standard values; בכפ alternate hard/fricative (b/v, k/kh,
//     p/f) on דָּגֵשׁ קַל; גדת never alternate (always g/d/t, matching the CSV's
//     own practice of never writing "dh"/"th"/"gh"). ח -> ch, כ (no dagesh)
//     -> kh (kept distinct, matching the CSV's own ach/melakhim spellings).
//     ש -> sh unless שׂ (sin dot) -> s.
//   - א/ע: silent when word-initial or vowel-less; a mid-word occurrence
//     WITH its own vowel point becomes an apostrophe (matches "na'ara",
//     "ne'arim") rather than being silently dropped (which would collide
//     two vowels together).
//   - דָּגֵשׁ: doubles the consonant (דָּגֵשׁ חָזָק) only when BOTH (a) the
//     preceding unit carries an audible vowel and (b) this unit's own vowel
//     is itself audible (not absent, not a word-final silent sheva) — a
//     final letter with a silent sheva can't geminate into nothing (see
//     אַתְּ "at", not "att"). Outside בגדכפת, doubling is rendered only for
//     מ/נ (matches יַמִּים/עַמִּים); other doubled consonants render single,
//     matching the CSV's own "isha" (not "ishsha") for אִשָּׁה.
//   - שְׁוָא (Lesson 3's own rule, kept deliberately simple — see mismatches
//     above for what this doesn't capture): vocal ('e') at word-initial
//     position, or as the second of two consecutive shevas UNLESS that
//     second sheva is also the word's FINAL letter (a word-final sheva is
//     always silent — necessary corollary, or every 2fs/2ms perfect would
//     grow a spurious trailing "e"). Silent otherwise (no vowel emitted).
//   - חֲטַף vowels: always vocal (a/e/o for patah/segol/qamats variants).
//   - קָמֶץ: 'a', EXCEPT a narrow, cheap קָמֶץ חָטוּף detector — a qamats whose
//     syllable is closed (immediately followed by a vowel-less consonant
//     that is itself the word's last letter) AND the word carries a maqaf
//     (־, which reliably marks loss of stress) renders 'o' instead. This
//     catches כָּל־ -> "kol-" but intentionally does NOT attempt qamats-qatan
//     detection anywhere else (real detection needs a stress/syllable model
//     this generator doesn't have — documented limitation, not a bug).
//   - מַתְרֵס לְקִירָיָה (matres lectionis) — never double-represented:
//     - Bare (vowel-less) וּ with דָּגֵשׁ after a vowel-less unit = שׁוּרוּק ('u'),
//       borrowed onto that preceding unit; a bare ו carrying its own holam
//       after a vowel-less unit = חוֹלָם מָלֵא ('o'), same borrowing. Neither
//       vav itself contributes a separate consonant sound.
//     - Bare (vowel-less) י after חִירִיק/צֵרֵי is the standard mater pair in
//       this style -> absorbed with no extra glide (single i / single e;
//       this is where אֵין "en" but עֵינַיִם "einayim" diverge in the source
//       CSV itself — we always take the plainer "en"-style collapse).
//     - Bare י after קָמֶץ/פַּתַח is the "ay" diphthong pattern instead: a real
//       consonantal y mid-word (הָיוּ -> "hayu"), or a trailing "y" when it's
//       the word's last letter (מָתַי -> "matay", אַי -> "ay").
//     - A word-final, vowel-less, דָּגֵשׁ/מַפִּיק-less ה is always silent and
//       dropped; ה WITH a מַפִּיק (the only context מַפִּיק occurs in) is a real
//       consonant ('h', e.g. לָהּ -> "lah").
//   - מַקָּף (־) is preserved literally as a trailing "-" (matches the CSV's
//     own "kol-", "et-").
//   - Multi-word `display` values (numerals like "אַחַד עָשָׂר", alternate forms
//     like "הוּ- / וֹ-") are split on whitespace/" / " first, each Hebrew
//     segment romanized independently, and rejoined with the original
//     separators untouched.
//
// Determinism: pure function of the input string only (no RNG, no Date, no
// external state) — re-running the generator with unchanged sources is
// byte-identical, same as every other generated field here.
const V = {
  PATACH: 'ַ', QAMATS: 'ָ', HIRIQ: 'ִ', TSERE: 'ֵ', SEGOL: 'ֶ',
  HOLAM: 'ֹ', HOLAM_HASER: 'ֺ', QUBBUTZ: 'ֻ', SHEVA: 'ְ',
  HATAF_SEGOL: 'ֱ', HATAF_PATACH: 'ֲ', HATAF_QAMATS: 'ֳ',
  DAGESH: 'ּ', SHIN_DOT: 'ׁ', SIN_DOT: 'ׂ', MAQAF: '־'
};
const VOWEL_VALUE = {
  [V.PATACH]: 'a', [V.HIRIQ]: 'i', [V.TSERE]: 'e', [V.SEGOL]: 'e',
  [V.HOLAM]: 'o', [V.HOLAM_HASER]: 'o', [V.QUBBUTZ]: 'u',
  [V.HATAF_SEGOL]: 'e', [V.HATAF_PATACH]: 'a', [V.HATAF_QAMATS]: 'o'
};
const VOWEL_CODES = new Set(Object.keys(VOWEL_VALUE).concat([V.SHEVA, V.QAMATS]));
const BASE_LETTERS = new Set('אבגדהוזחטיכךלמםנןסעפףצץקרשת'.split(''));
const FINAL_TO_MEDIAL = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
const BGDKPT = new Set('בגדכפת'.split(''));
const NO_DAGESH_LETTERS = new Set('אהחער'.split('')); // gutturals + resh never take דָּגֵשׁ

// Split a raw Hebrew word (single space-free token) into per-consonant units:
// { letter, dagesh, shin, sin, vowel, maqaf }. Combining marks in the input
// attach to whichever base letter/maqaf precedes them (standard Unicode
// combining-mark order), so a single left-to-right scan suffices.
function tokenizeWord(word) {
  const units = [];
  let cur = null;
  for (const ch of word) {
    if (ch === V.MAQAF) { units.push({ letter: '-', maqaf: true, dagesh: false, shin: false, sin: false, vowel: null }); cur = null; continue; }
    if (BASE_LETTERS.has(ch)) { cur = { letter: ch, maqaf: false, dagesh: false, shin: false, sin: false, vowel: null }; units.push(cur); continue; }
    if (ch === V.DAGESH) { if (cur) cur.dagesh = true; continue; }
    if (ch === V.SHIN_DOT) { if (cur) cur.shin = true; continue; }
    if (ch === V.SIN_DOT) { if (cur) cur.sin = true; continue; }
    if (VOWEL_CODES.has(ch)) { if (cur) cur.vowel = ch; continue; }
    // Anything else (cantillation, stray punctuation) is silently ignored —
    // none of the source data this generator reads carries cantillation.
  }
  return units;
}

// Consonant sound for one unit, given whether it's geminated (דָּגֵשׁ חָזָק).
function consonantSound(unit, forte) {
  const letter = FINAL_TO_MEDIAL[unit.letter] || unit.letter;
  let base;
  switch (letter) {
    case 'א': base = ''; break;
    case 'ב': base = unit.dagesh ? 'b' : 'v'; break;
    case 'ג': base = 'g'; break;
    case 'ד': base = 'd'; break;
    case 'ה': base = 'h'; break;
    case 'ו': base = 'v'; break;
    case 'ז': base = 'z'; break;
    case 'ח': base = 'ch'; break;
    case 'ט': base = 't'; break;
    case 'י': base = 'y'; break;
    case 'כ': base = unit.dagesh ? 'k' : 'kh'; break;
    case 'ל': base = 'l'; break;
    case 'מ': base = 'm'; break;
    case 'נ': base = 'n'; break;
    case 'ס': base = 's'; break;
    case 'ע': base = ''; break;
    case 'פ': base = unit.dagesh ? 'p' : 'f'; break;
    case 'צ': base = 'ts'; break;
    case 'ק': base = 'q'; break;
    case 'ר': base = 'r'; break;
    case 'ש': base = (unit.sin && !unit.shin) ? 's' : 'sh'; break;
    case 'ת': base = 't'; break;
    default: base = '';
  }
  return forte && base ? base + base : base;
}

// Romanize a single space-free Hebrew token (may still contain an internal
// מַקָּף). See the big comment above augmentForm for the rule summary.
function romanizeWord(word) {
  const units = tokenizeWord(word);
  const n = units.length;
  let out = '';
  for (let i = 0; i < n; i += 1) {
    const unit = units[i];
    if (unit.maqaf) { out += '-'; continue; }
    const prev = i > 0 ? units[i - 1] : null;
    const next = (i + 1 < n && !units[i + 1].maqaf) ? units[i + 1] : null;
    const isLast = (i === n - 1) || (i + 1 === n - 1 && units[i + 1].maqaf);

    // ── matres lectionis: bare ו borrowing its vowel onto a preceding
    // vowel-less unit (שׁוּרוּק via דָּגֵשׁ, or חוֹלָם מָלֵא via a bare holam-vav) ──
    if (unit.letter === 'ו' && unit.vowel === null && unit.dagesh && prev && prev.vowel === null && !prev.maqaf) {
      out += 'u';
      continue;
    }
    if (unit.letter === 'ו' && unit.vowel === V.HOLAM && !unit.dagesh && prev && prev.vowel === null && !prev.maqaf) {
      out += 'o';
      continue;
    }

    // ── matres lectionis: bare י (no vowel of its own) after a vowel ──
    if (unit.letter === 'י' && unit.vowel === null && prev && prev.vowel !== null) {
      const pv = prev.vowel;
      if (pv === V.HIRIQ || pv === V.TSERE) continue; // absorbed, no glide
      if (pv === V.QAMATS || pv === V.PATACH) {
        if (isLast) { out += 'y'; continue; } // trailing "ay"/"ai" spelled with y
        // else: fall through, treat this yod as an ordinary consonant unit
      } else {
        continue; // other vowel + bare yod: default to absorption
      }
    }

    // ── silent final ה (mater, no דָּגֵשׁ/מַפִּיק, no vowel of its own) ──
    if (unit.letter === 'ה' && isLast && unit.vowel === null && !unit.dagesh) continue;

    // ── דָּגֵשׁ קַל vs דָּגֵשׁ חָזָק ──
    // A unit's own vowel counts as "audible" either directly, or when it's
    // vowel-less itself but borrows one from an immediately-following
    // matres-lectionis vav (שׁוּרוּק / חוֹלָם מָלֵא) — e.g. the geminated dalet in
    // מַדּוּעַ has no vowel point of its own; the וּ right after it supplies the
    // "u". Without this, that dalet would wrongly look un-doublable.
    const borrowsFromNextVav = unit.vowel === null && next && next.letter === 'ו' &&
      ((next.dagesh && next.vowel === null) || (!next.dagesh && next.vowel === V.HOLAM));
    const ownVowelAudible = (unit.vowel !== null && !(unit.vowel === V.SHEVA && isLast)) || borrowsFromNextVav;
    let forte = false;
    if (unit.dagesh && !NO_DAGESH_LETTERS.has(unit.letter) && ownVowelAudible) {
      const precedesVowel = !!(prev && prev.vowel !== null && !prev._silentSheva);
      if (BGDKPT.has(unit.letter)) forte = precedesVowel;
      // Outside בגדכפת this casual style only consistently doubles nasals.
      else forte = precedesVowel && (unit.letter === 'מ' || unit.letter === 'נ');
    }

    let cons = consonantSound(unit, forte);
    // Mid-word sounding א/ע -> apostrophe (avoids colliding two vowels).
    // Word-initial and word-final occurrences (the latter usually a furtive
    // vowel under ע/ח) stay silent instead, matching the CSV's own "shama"
    // (not "sham'a") for word-final ayin.
    if ((unit.letter === 'א' || unit.letter === 'ע') && unit.vowel !== null && i !== 0 && !isLast) cons = "'";

    let vow = '';
    if (unit.vowel === V.SHEVA) {
      const wordInitial = i === 0;
      const secondOfPair = !!(prev && prev.vowel === V.SHEVA);
      if (wordInitial || (secondOfPair && !isLast)) vow = 'e';
      else unit._silentSheva = true;
    } else if (unit.vowel === V.QAMATS) {
      const closedFinal = !!(next && next.vowel === null && (i + 2 >= n || units[i + 2].maqaf));
      const hasMaqaf = units.some((u) => u.maqaf);
      vow = (closedFinal && hasMaqaf) ? 'o' : 'a';
    } else if (unit.vowel !== null) {
      vow = VOWEL_VALUE[unit.vowel] || '';
    }
    out += cons + vow;
  }
  return out;
}

// Exported for the task #17 CSV self-check script only (not imported by any
// shipped app code — this file is a Node build tool, never loaded in-browser).
export { romanizeForm, romanizeWord };

// Split a (possibly multi-word) `display` value on whitespace and " / "
// alternate-form separators, romanizing each Hebrew segment independently
// and rejoining with the original separators untouched — handles numeral
// phrases ("אַחַד עָשָׂר") and alternate-form pairs ("הוּ- / וֹ-") without
// treating them as one run-on word.
function romanizeForm(display) {
  const text = String(display || '');
  return text.split(/(\s*\/\s*|\s+)/).map((seg) => (/[א-ת]/.test(seg) ? romanizeWord(seg) : seg)).join('');
}

function buildOutput(paradigmsDoc, gatesDoc) {
  const sorted = sortParadigms(paradigmsDoc.paradigms);
  return {
    schemaVersion: paradigmsDoc.schemaVersion,
    paradigms: sorted.map((paradigm) => ({
      ...paradigm,
      forms: paradigm.forms.map(augmentForm)
    })),
    lessonGates: gatesDoc.lessons
  };
}

// ─── 4. Serialization ───────────────────────────────────────────────────
const HEADER = [
  '// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_parsing_data.mjs',
  '// (source: source/bbh/parsing/paradigms.json, source/bbh/parsing/lesson_gates.json)',
  '//',
  '// Phase 2 PR B lesson-gated Parsing/Build inventory. Self-registers on',
  '// window.BBH_PARSING as a CLASSIC (non-module) script — same idiom as',
  '// js/data/bbh_vocab.js registering window.SETS — so it can be dropped into',
  '// index.html\'s plain <script> tags without touching the ES-module import',
  '// graph. NOT YET wired into index.html or sw.js precache as of PR B — that',
  '// lands with the Parse/Build UI in a later PR; this file existing unused',
  '// on disk is expected at this stage.',
  '//',
  '// Shape: { schemaVersion, paradigms: [...], lessonGates: [...] }. Every',
  '// form under paradigms[].forms carries every field from',
  '// source/bbh/parsing/paradigms.json unchanged, plus two generated fields:',
  '// `compare` (the pointed `display` with vowel points/cantillation stripped',
  '// — see js/utils/hebrewText.js#stripHebrewPoints) for point-insensitive',
  '// answer comparison, and `translit` (task #17 — a deterministic, rule-',
  '// based romanization of `display`; see romanizeForm() in',
  '// tools/gen_bbh_parsing_data.mjs for the full rule set and its documented',
  '// limitations). `lessonGates` mirrors source/bbh/parsing/',
  '// lesson_gates.json\'s `lessons` array unchanged.',
  '//',
  '// Never edit this file by hand — re-run the generator instead. Never edit',
  '// source/bbh/parsing/*.json from here or anywhere else.',
  ''
].join('\n');

function writeParsingFile(output) {
  const json = JSON.stringify(output, null, 2);
  const parts = [];
  parts.push(HEADER);
  parts.push('(function () {\n');
  parts.push(`  window.BBH_PARSING = ${json.split('\n').join('\n  ')};\n`);
  parts.push('})();\n');
  return parts.join('');
}

function main() {
  runValidator();

  const paradigmsDoc = readJson(PARADIGMS_PATH);
  const gatesDoc = readJson(LESSON_GATES_PATH);

  const output = buildOutput(paradigmsDoc, gatesDoc);
  writeFileSync(OUT_PATH, writeParsingFile(output));
  console.log(
    `Wrote ${path.relative(ROOT, OUT_PATH)} ` +
    `(${output.paradigms.length} paradigm(s), ${output.lessonGates.length} lesson_gates entry(ies)).`
  );
}

// Guarded (task #15, advanced vocab + vocab-by-book): tools/gen_bbh_book_
// vocab.mjs imports { romanizeForm } from this file to romanize book-deck
// headwords without forking the rule set. Every other generator in this
// repo (gen_bbh_data.mjs, gen_strongs_glosses.mjs, gen_bbh_reader_data.mjs)
// gates its own main()/side-effecting call behind an isMainModule() check
// for exactly this reason — importing a module for its pure helpers must
// never also re-run its CLI (which here spawns a validator subprocess and
// rewrites js/data/bbh_parsing.js). Re-running via `node
// tools/gen_bbh_parsing_data.mjs` directly is unaffected: isMainModule()
// is still true in that case, so main() still fires exactly as before.
function isMainModule() {
  return path.resolve(process.argv[1] || '') === path.resolve(fileURLToPath(import.meta.url));
}
if (isMainModule()) main();
