#!/usr/bin/env node
// Validator for the BBH generated data files (js/data/bbh_vocab.js,
// js/data/bbh_reference_data.js, js/data/setMeta.js) against the two
// immutable sources in source/bbh/. This file is hand-written source, not a
// generated output — see tools/gen_bbh_data.mjs for the generator.
//
// Exits nonzero (via process.exitCode) with a category-tagged message per
// violation found. Collects all violations across a run rather than
// stopping at the first, so a single invocation surfaces as much as
// possible.
//
// Usage: node tools/validate_bbh_data.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CSV_PATH = path.join(ROOT, 'source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv');
const VOCAB_PATH = path.join(ROOT, 'js/data/bbh_vocab.js');
const REFERENCE_PATH = path.join(ROOT, 'js/data/bbh_reference_data.js');
const SETMETA_PATH = path.join(ROOT, 'js/data/setMeta.js');

const TOTAL_LESSONS = 50;
const EXPECTED_HEADER = [
  'lesson_number',
  'lesson_title',
  'source_page',
  'hebrew',
  'transliteration',
  'english_gloss',
  'grammar_and_forms'
];

// Cantillation U+0591-U+05AF; points U+05B0-U+05BC, U+05C1, U+05C2, U+05C7.
// Maqaf (U+05BE), sof pasuq, and geresh/gershayim fall inside the U+0591-
// U+05C7 block too but are NOT points/cantillation \u2014 they are real
// word-separator/punctuation characters stripPoints deliberately preserves,
// so the "nothing left behind" check re-uses this exact enumerated set
// rather than testing the whole contiguous Unicode block.
const POINTS_RE = /[\u0591-\u05AF\u05B0-\u05BC\u05C1\u05C2\u05C7]/g;
const ANY_POINT_OR_ACCENT_RE = /[\u0591-\u05AF\u05B0-\u05BC\u05C1\u05C2\u05C7]/;
const HEBREW_LETTER_RE = /[\u05D0-\u05EA]/g;

const failures = [];
function fail(category, message) {
  failures.push(`[${category}] ${message}`);
}

// ─── same CSV parser as the generator ──────────────────────────────────
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += c;
      i += 1;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (c === ',') {
      row.push(field);
      field = '';
      i += 1;
      continue;
    }
    if (c === '\r') {
      i += 1;
      continue;
    }
    if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i += 1;
      continue;
    }
    field += c;
    i += 1;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  if (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === '') {
    rows.pop();
  }
  return rows;
}

function readCsv() {
  const raw = readFileSync(CSV_PATH, 'utf8');
  const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const rows = parseCSV(text);
  const header = rows[0] || [];
  const headerOk = header.length === EXPECTED_HEADER.length && header.every((h, i) => h === EXPECTED_HEADER[i]);
  if (!headerOk) {
    fail('csv-header', `expected [${EXPECTED_HEADER.join(',')}] got [${header.join(',')}]`);
  }
  return rows.slice(1).map((row) => {
    const rec = {};
    header.forEach((key, idx) => {
      rec[key] = row[idx];
    });
    return rec;
  });
}

// ─── load a classic self-registering script into a sandbox ────────────
function loadClassicScript(filePath, globalName) {
  const code = readFileSync(filePath, 'utf8');
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  try {
    vm.runInContext(code, sandbox, { filename: filePath });
  } catch (err) {
    fail('parse', `${filePath} threw while executing: ${err.message}`);
    return undefined;
  }
  return sandbox.window[globalName];
}

function checkCsv() {
  const csvRecords = readCsv();

  if (csvRecords.length !== 209) {
    fail('csv-row-count', `expected 209 data rows, found ${csvRecords.length}`);
  }

  for (const rec of csvRecords) {
    const n = Number(rec.lesson_number);
    if (!Number.isInteger(n) || n < 1 || n > TOTAL_LESSONS) {
      fail('csv-lesson-range', `lesson_number "${rec.lesson_number}" is not an integer in 1..${TOTAL_LESSONS}`);
    }
  }
}

function checkVocab() {
  const SETS = loadClassicScript(VOCAB_PATH, 'SETS');
  if (!SETS || typeof SETS !== 'object') {
    fail('vocab-shape', `${VOCAB_PATH} did not register window.SETS`);
    return;
  }

  const keys = [];
  for (let n = 1; n <= TOTAL_LESSONS; n += 1) keys.push(String(n));
  const missing = keys.filter((k) => !(k in SETS));
  if (missing.length) fail('vocab-lesson-count', `window.SETS missing lessons: ${missing.join(', ')}`);

  const presentLessonKeys = Object.keys(SETS).filter((k) => /^\d+$/.test(k));
  if (presentLessonKeys.length !== TOTAL_LESSONS) {
    fail(
      'vocab-lesson-count',
      `expected exactly ${TOTAL_LESSONS} lesson records in window.SETS, found ${presentLessonKeys.length}`
    );
  }

  let totalCards = 0;
  const allIds = new Set();
  const idPattern = /^bbh-l\d{2}-\S+$/;

  for (const key of keys) {
    const set = SETS[key];
    if (!set) continue;
    if (!Array.isArray(set.cards)) {
      fail('vocab-shape', `window.SETS["${key}"].cards is not an array`);
      continue;
    }
    totalCards += set.cards.length;
    for (const card of set.cards) {
      if (!card.id || !idPattern.test(card.id)) {
        fail('id-format', `lesson ${key}: id "${card.id}" does not match ^bbh-l\\d{2}-\\S+$`);
      }
      if (allIds.has(card.id)) {
        fail('id-unique', `duplicate id "${card.id}" (lesson ${key})`);
      }
      allIds.add(card.id);

      if (!card.g || String(card.g).trim() === '') {
        fail('card-fields', `lesson ${key}, id ${card.id}: "g" is empty`);
      }
      if (!card.e || String(card.e).trim() === '') {
        fail('card-fields', `lesson ${key}, id ${card.id}: "e" is empty`);
      }
      if ('notes' in card && String(card.notes).trim() === '') {
        fail('card-fields', `lesson ${key}, id ${card.id}: "notes" present but empty (should be omitted)`);
      }

      if (card.g) {
        const g = String(card.g);
        const stripped = g.replace(POINTS_RE, '');
        if (stripped.trim() === '') {
          fail('strip-points', `lesson ${key}, id ${card.id}: stripPoints(g) is empty for g="${g}"`);
        }
        if (ANY_POINT_OR_ACCENT_RE.test(stripped)) {
          fail(
            'strip-points',
            `lesson ${key}, id ${card.id}: stripPoints(g) still contains a U+0591-U+05C7 char for g="${g}"`
          );
        }
        const lettersBefore = (g.match(HEBREW_LETTER_RE) || []).length;
        const lettersAfter = (stripped.match(HEBREW_LETTER_RE) || []).length;
        if (lettersBefore !== lettersAfter) {
          fail(
            'strip-points',
            `lesson ${key}, id ${card.id}: Hebrew letter count changed by stripPoints (${lettersBefore} -> ${lettersAfter}) for g="${g}"`
          );
        }
      }
    }
  }

  if (totalCards !== 209) {
    fail('vocab-card-count', `expected 209 total cards across all lessons, found ${totalCards}`);
  }
}

function checkReference() {
  const BBH_REFERENCE = loadClassicScript(REFERENCE_PATH, 'BBH_REFERENCE');
  if (!Array.isArray(BBH_REFERENCE)) {
    fail('reference-shape', `${REFERENCE_PATH} did not register a window.BBH_REFERENCE array`);
    return;
  }
  if (BBH_REFERENCE.length !== TOTAL_LESSONS) {
    fail('reference-lesson-count', `expected ${TOTAL_LESSONS} entries in window.BBH_REFERENCE, found ${BBH_REFERENCE.length}`);
  }
  const seenLessons = new Set();
  for (const entry of BBH_REFERENCE) {
    if (!Number.isInteger(entry.lesson) || entry.lesson < 1 || entry.lesson > TOTAL_LESSONS) {
      fail('reference-lesson-range', `lesson value "${entry.lesson}" is not an integer in 1..${TOTAL_LESSONS}`);
    }
    seenLessons.add(entry.lesson);
    if (!Array.isArray(entry.concepts)) {
      fail('reference-shape', `lesson ${entry.lesson}: concepts is not an array`);
    }
    if (typeof entry.vocabCount !== 'number') {
      fail('reference-shape', `lesson ${entry.lesson}: vocabCount is not a number`);
    }
  }
  for (let n = 1; n <= TOTAL_LESSONS; n += 1) {
    if (!seenLessons.has(n)) fail('reference-lesson-count', `window.BBH_REFERENCE missing lesson ${n}`);
  }
}

async function checkSetMeta() {
  let mod;
  try {
    mod = await import(pathToFileURL(SETMETA_PATH).href);
  } catch (err) {
    fail('parse', `${SETMETA_PATH} failed to import as an ES module: ${err.message}`);
    return;
  }
  const { SESSION_WEEK_META } = mod;
  if (!SESSION_WEEK_META || typeof SESSION_WEEK_META !== 'object') {
    fail('setmeta-shape', 'SESSION_WEEK_META is missing or not an object');
    return;
  }
  const presetKeys = Object.keys(SESSION_WEEK_META);
  if (presetKeys.length !== 19) {
    fail('setmeta-shape', `expected 19 presets in SESSION_WEEK_META (5 decade + all + 13 reading-block units), found ${presetKeys.length} (${presetKeys.join(', ')})`);
  }
  const expectedUnitRanges = [
    [1, 9], [10, 14], [15, 18], [19, 22], [23, 26], [27, 30], [31, 34],
    [35, 38], [39, 41], [42, 44], [45, 46], [47, 48], [49, 50]
  ];
  expectedUnitRanges.forEach(([start, end], idx) => {
    const key = `unit${idx + 1}`;
    const preset = SESSION_WEEK_META[key];
    if (!preset || !Array.isArray(preset.lessons)) {
      fail('setmeta-units', `missing reading-block preset "${key}"`);
      return;
    }
    const expected = [];
    for (let n = start; n <= end; n += 1) expected.push(n);
    if (JSON.stringify(preset.lessons) !== JSON.stringify(expected)) {
      fail('setmeta-units', `preset "${key}" lessons ${JSON.stringify(preset.lessons)} != expected ${JSON.stringify(expected)}`);
    }
  });
  for (const key of presetKeys) {
    const preset = SESSION_WEEK_META[key];
    const lessons = Array.isArray(preset) ? preset : preset && preset.lessons;
    if (!Array.isArray(lessons)) {
      fail('setmeta-shape', `preset "${key}" has no lesson array`);
      continue;
    }
    for (const n of lessons) {
      if (!Number.isInteger(n) || n < 1 || n > TOTAL_LESSONS) {
        fail('setmeta-range', `preset "${key}" references out-of-range lesson ${n}`);
      }
    }
  }
}

async function main() {
  checkCsv();
  checkVocab();
  checkReference();
  await checkSetMeta();

  if (failures.length) {
    console.error(`FAIL — ${failures.length} issue(s):\n`);
    for (const f of failures) console.error(`  ${f}`);
    process.exitCode = 1;
  } else {
    console.log('OK — all BBH data checks passed (209 cards, 50 lessons, unique ids, point-strip safety, 19 in-range presets).');
  }
}

main();
