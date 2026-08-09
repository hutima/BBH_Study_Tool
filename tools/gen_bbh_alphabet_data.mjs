#!/usr/bin/env node
// GENERATED FILE PRODUCER — do not hand-edit js/data/bbh_alphabet.js.
// Regenerate: node tools/gen_bbh_alphabet_data.mjs
// (source: source/bbh/alphabet.json, source/bbh/vowels.json, plus the vocab
//  CSV pipeline via tools/gen_bbh_data.mjs's buildLessons()/headwordOf())
//
// Mirrors the shape/idiom of tools/gen_bbh_data.mjs: reads the immutable,
// hand-verified source/bbh/{alphabet,vowels}.json and deterministically
// writes js/data/bbh_alphabet.js, a classic self-registering script exposing
// window.BBH_ALPHABET = { schemaVersion, letters: [...], vowels: [...],
// shevaRules: [...] }.
//
// This is the "Lesson 0" practice decks' data source — Lesson 0A Alphabet
// (Phase 2 ledger addendum, 2026-08-08) and Lesson 0B Vowel marks (PR H
// punch-list item 3, 2026-08-09): completely separate from the vocabulary
// machinery (no SRS, no ids in the bbh-l##-* namespace, not registered on
// window.SETS). Never edit source/bbh/{alphabet,vowels}.json from here.
//
// PR H item 3 — vowel example words: each vowels[] entry gets a
// deterministic `example: { word, clusterIndex } | null` picked from the
// vocab CSV pipeline's card order (lesson ascending, then CSV row order —
// exactly buildLessons()'s own order, reused via import so this never
// re-parses the CSV itself). `word` is the card's pointed HEADWORD (the
// same head-before-"/"-or-"(" extraction slugify() uses, via the shared
// headwordOf() helper); `clusterIndex` is that word's grapheme-cluster
// index (consonant + its trailing combining marks) whose marks contain the
// vowel's combining codepoint, restricted to a NON-FINAL cluster and (for
// shureq only, whose codepoint U+05BC/dagesh is shared with begadkefat
// dagesh qal) to a vav base consonant. The first matching card wins. Vowels
// with no match (chatef signs are rare) get `example: null` — the UI falls
// back to the bare sign on its printed carrier.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildLessons, headwordOf } from './gen_bbh_data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SOURCE_PATH = path.join(ROOT, 'source/bbh/alphabet.json');
const VOWELS_SOURCE_PATH = path.join(ROOT, 'source/bbh/vowels.json');
const OUT_PATH = path.join(ROOT, 'js/data/bbh_alphabet.js');

const EXPECTED_LETTER_COUNT = 23;
const EXPECTED_FINAL_FORM_COUNT = 5;
const EXPECTED_VOWEL_COUNT = 12;
const REQUIRED_FIELDS = ['order', 'letter', 'nameHebrew', 'nameEnglish', 'sound'];
const REQUIRED_VOWEL_FIELDS = ['order', 'sign', 'nameHebrew', 'nameEnglish', 'soundClass', 'length', 'sound'];

// ─── Grapheme-cluster splitting (consonant + its trailing combining marks)
// SYNC: js/ui/alphabet.js re-implements this same split client-side to
// locate/highlight the stored clusterIndex at render time (that module may
// not import anything — see its header) — keep the two in sync if either
// changes. Ranges match tools/gen_bbh_data.mjs's own POINTS_RE.
const CONSONANT_RE = /[\u05D0-\u05EA]/;
const MARK_RE = /[\u0591-\u05AF\u05B0-\u05BC\u05C1\u05C2\u05C7]/;

function splitHebrewClusters(word) {
  const clusters = [];
  let current = null;
  for (const ch of String(word)) {
    if (CONSONANT_RE.test(ch)) {
      current = { base: ch, marks: '' };
      clusters.push(current);
    } else if (current && MARK_RE.test(ch)) {
      current.marks += ch;
    } else {
      current = null;
    }
  }
  return clusters;
}

// order (1..12, matching source/bbh/vowels.json's own row order) -> match
// rule. Chatef-qamets (order 6) is the SAME printed sign as qamets (order
// 2) — the book itself says the sign is contextual (Appendix A a-6) — so
// both deterministically match the same first card; that's expected, not a
// bug (see header comment: matching is purely mechanical by codepoint).
const VOWEL_MATCH_RULES = {
  1: { codepoint: '\u05B7' },                     // patach
  2: { codepoint: '\u05B8' },                     // qamets(-he)
  3: { codepoint: '\u05B6' },                     // segol
  4: { codepoint: '\u05B5' },                     // tsere(-yod)
  5: { codepoint: '\u05B4' },                     // chireq(-yod)
  6: { codepoint: '\u05B8' },                     // qamets-chatuf
  7: { codepoint: '\u05B9' },                     // cholem(-vav)
  8: { codepoint: '\u05BB' },                     // qibbuts
  9: { codepoint: '\u05BC', requireBase: '\u05D5' }, // shureq (vav+dagesh)
  10: { codepoint: '\u05B2' },                    // chatef-patach
  11: { codepoint: '\u05B1' },                    // chatef-segol
  12: { codepoint: '\u05B3' }                     // chatef-qamets
};

function findVowelExample(order, flatCards) {
  const rule = VOWEL_MATCH_RULES[order];
  if (!rule) return null;
  for (const g of flatCards) {
    const headword = headwordOf(g);
    const clusters = splitHebrewClusters(headword);
    if (clusters.length < 2) continue; // must have a non-final cluster
    for (let i = 0; i < clusters.length - 1; i += 1) {
      const cl = clusters[i];
      if (!cl.marks.includes(rule.codepoint)) continue;
      if (rule.requireBase && cl.base !== rule.requireBase) continue;
      return { word: headword, clusterIndex: i };
    }
  }
  return null;
}

function readSource() {
  const raw = readFileSync(SOURCE_PATH, 'utf8');
  return JSON.parse(raw);
}

function readVowelsSource() {
  const raw = readFileSync(VOWELS_SOURCE_PATH, 'utf8');
  return JSON.parse(raw);
}

function validateVowels(data) {
  const errors = [];
  if (typeof data.schemaVersion !== 'number') {
    errors.push('vowels: schemaVersion is missing or not a number');
  }
  if (!Array.isArray(data.vowels)) {
    errors.push('vowels: "vowels" is not an array');
    return errors;
  }
  if (data.vowels.length !== EXPECTED_VOWEL_COUNT) {
    errors.push(`vowels: expected ${EXPECTED_VOWEL_COUNT} entries, found ${data.vowels.length}`);
  }
  const seenOrders = new Set();
  data.vowels.forEach((entry, idx) => {
    for (const field of REQUIRED_VOWEL_FIELDS) {
      const v = entry[field];
      if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
        errors.push(`vowels[${idx}] (order=${entry.order}): required field "${field}" is empty/missing`);
      }
    }
    if (!Number.isInteger(entry.order) || entry.order < 1 || entry.order > EXPECTED_VOWEL_COUNT) {
      errors.push(`vowels[${idx}]: order "${entry.order}" is not an integer in 1..${EXPECTED_VOWEL_COUNT}`);
    } else {
      if (seenOrders.has(entry.order)) errors.push(`vowels[${idx}]: duplicate order ${entry.order}`);
      seenOrders.add(entry.order);
    }
    if (!entry.source || !Number.isInteger(entry.source.lesson) || !Number.isInteger(entry.source.page)) {
      errors.push(`vowels[${idx}] (order=${entry.order}): source.{lesson,page} missing/invalid`);
    }
  });
  for (let n = 1; n <= EXPECTED_VOWEL_COUNT; n += 1) {
    if (!seenOrders.has(n)) errors.push(`vowels: order sequence missing ${n} (expected contiguous 1..${EXPECTED_VOWEL_COUNT})`);
  }
  if (!Array.isArray(data.shevaRules) || !data.shevaRules.length) {
    errors.push('vowels: "shevaRules" is missing or empty');
  } else {
    data.shevaRules.forEach((rule, idx) => {
      if (!rule.rule || typeof rule.rule !== 'string' || !rule.rule.trim()) {
        errors.push(`shevaRules[${idx}]: "rule" is empty/missing`);
      }
    });
  }
  return errors;
}

function buildVowels(data, flatCards) {
  return [...data.vowels]
    .sort((a, b) => a.order - b.order)
    .map((v) => ({
      order: v.order,
      sign: v.sign,
      nameHebrew: v.nameHebrew,
      nameEnglish: v.nameEnglish,
      soundClass: v.soundClass,
      length: v.length,
      sound: v.sound,
      mater: v.mater ?? null,
      notes: v.notes ?? null,
      source: { lesson: v.source.lesson, page: v.source.page },
      example: findVowelExample(v.order, flatCards)
    }));
}

function buildShevaRules(data) {
  return data.shevaRules.map((r) => ({
    rule: r.rule,
    source: { lesson: r.source.lesson, page: r.source.page }
  }));
}

// ─── Inline validation (schema check) ──────────────────────────────────
function validate(data) {
  const errors = [];

  if (typeof data.schemaVersion !== 'number') {
    errors.push('schemaVersion is missing or not a number');
  }
  if (!Array.isArray(data.letters)) {
    errors.push('letters is not an array');
    return errors; // nothing further can be checked safely
  }
  if (data.letters.length !== EXPECTED_LETTER_COUNT) {
    errors.push(`expected ${EXPECTED_LETTER_COUNT} letters, found ${data.letters.length}`);
  }

  const seenOrders = new Set();
  let finalFormCount = 0;

  data.letters.forEach((entry, idx) => {
    for (const field of REQUIRED_FIELDS) {
      const v = entry[field];
      if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
        errors.push(`letters[${idx}] (order=${entry.order}): required field "${field}" is empty/missing`);
      }
    }
    if (!Number.isInteger(entry.order) || entry.order < 1 || entry.order > EXPECTED_LETTER_COUNT) {
      errors.push(`letters[${idx}]: order "${entry.order}" is not an integer in 1..${EXPECTED_LETTER_COUNT}`);
    } else {
      if (seenOrders.has(entry.order)) errors.push(`letters[${idx}]: duplicate order ${entry.order}`);
      seenOrders.add(entry.order);
    }
    if (typeof entry.begadkefat !== 'boolean') {
      errors.push(`letters[${idx}] (order=${entry.order}): begadkefat is not a boolean`);
    }
    if (typeof entry.guttural !== 'boolean') {
      errors.push(`letters[${idx}] (order=${entry.order}): guttural is not a boolean`);
    }
    if (entry.finalForm != null) {
      if (typeof entry.finalForm !== 'string' || entry.finalForm.trim() === '') {
        errors.push(`letters[${idx}] (order=${entry.order}): finalForm present but empty`);
      } else {
        finalFormCount += 1;
      }
    }
    if (!entry.source || !Number.isInteger(entry.source.lesson) || !Number.isInteger(entry.source.page)) {
      errors.push(`letters[${idx}] (order=${entry.order}): source.{lesson,page} missing/invalid`);
    }
  });

  // order 1..23 contiguous
  for (let n = 1; n <= EXPECTED_LETTER_COUNT; n += 1) {
    if (!seenOrders.has(n)) errors.push(`order sequence missing ${n} (expected contiguous 1..${EXPECTED_LETTER_COUNT})`);
  }

  if (finalFormCount !== EXPECTED_FINAL_FORM_COUNT) {
    errors.push(`expected ${EXPECTED_FINAL_FORM_COUNT} letters with a finalForm, found ${finalFormCount}`);
  }

  return errors;
}

// ─── Build the deterministic output shape ──────────────────────────────
function buildLetters(data) {
  return [...data.letters]
    .sort((a, b) => a.order - b.order)
    .map((l) => ({
      order: l.order,
      letter: l.letter,
      finalForm: l.finalForm ?? null,
      nameHebrew: l.nameHebrew,
      nameEnglish: l.nameEnglish,
      translit: l.translit ?? null,
      sound: l.sound,
      begadkefat: !!l.begadkefat,
      guttural: !!l.guttural,
      notes: l.notes ?? null,
      source: { lesson: l.source.lesson, page: l.source.page }
    }));
}

function writeAlphabetFile(letters, vowels, shevaRules, schemaVersion) {
  const payload = { schemaVersion, letters, vowels, shevaRules };
  const json = JSON.stringify(payload, null, 2);
  const parts = [];
  parts.push('// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_alphabet_data.mjs (source: source/bbh/alphabet.json, source/bbh/vowels.json, vocab CSV pipeline)\n');
  parts.push('// Lesson 0 practice deck data — 0A Alphabet (letters) + 0B Vowel marks\n');
  parts.push('// (vowels + shevaRules). Self-registers on window.BBH_ALPHABET, separate\n');
  parts.push('// from window.SETS (vocabulary) — see docs/bbh-conversion-plan.md "Lesson 0"\n');
  parts.push('// and "PR H punch-list item 3" addenda.\n\n');
  parts.push('(function () {\n');
  parts.push(`  window.BBH_ALPHABET = ${json.split('\n').map((l, i) => (i === 0 ? l : '  ' + l)).join('\n')};\n`);
  parts.push('})();\n');
  return parts.join('');
}

function main() {
  const data = readSource();
  const errors = validate(data);
  if (errors.length) {
    console.error(`FAIL — ${errors.length} schema violation(s) in ${SOURCE_PATH}:`);
    for (const e of errors) console.error(`  [alphabet-schema] ${e}`);
    process.exitCode = 1;
    return;
  }

  const vowelsData = readVowelsSource();
  const vowelErrors = validateVowels(vowelsData);
  if (vowelErrors.length) {
    console.error(`FAIL — ${vowelErrors.length} schema violation(s) in ${VOWELS_SOURCE_PATH}:`);
    for (const e of vowelErrors) console.error(`  [vowels-schema] ${e}`);
    process.exitCode = 1;
    return;
  }

  const { lessons } = buildLessons();
  const flatCards = lessons.flatMap((lesson) => lesson.cards.map((card) => card.g));

  const letters = buildLetters(data);
  const vowels = buildVowels(vowelsData, flatCards);
  const shevaRules = buildShevaRules(vowelsData);
  writeFileSync(OUT_PATH, writeAlphabetFile(letters, vowels, shevaRules, data.schemaVersion));
  console.log(`Wrote ${OUT_PATH}`);
  console.log(`Letters: ${letters.length}, final forms: ${letters.filter((l) => l.finalForm).length}`);
  console.log(`Vowels: ${vowels.length}, with example: ${vowels.filter((v) => v.example).length}, sheva rules: ${shevaRules.length}`);
}

main();
