#!/usr/bin/env node
// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_data.mjs
// (source: source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv,
//  source/bbh/Beginning_Biblical_Hebrew_Revision_Guide.md)
//
// This IS the generator (not itself generated). It reads the two immutable
// source files and deterministically writes:
//   - js/data/bbh_vocab.js
//   - js/data/bbh_reference_data.js
//   - js/data/setMeta.js
//
// Never edit the outputs by hand — re-run this script instead. Never edit
// the source/bbh/ files from here or anywhere else.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CSV_PATH = path.join(ROOT, 'source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv');
const GUIDE_PATH = path.join(ROOT, 'source/bbh/Beginning_Biblical_Hebrew_Revision_Guide.md');

const OUT_VOCAB = path.join(ROOT, 'js/data/bbh_vocab.js');
const OUT_REFERENCE = path.join(ROOT, 'js/data/bbh_reference_data.js');
const OUT_SETMETA = path.join(ROOT, 'js/data/setMeta.js');

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

// ─── Unicode ranges (Hebrew points/cantillation) ───────────────────────────
// Cantillation: U+0591–U+05AF
// Points: U+05B0–U+05BC, U+05C1, U+05C2, U+05C7
// (maqaf U+05BE and spaces are handled separately for slug generation)
const POINTS_RE = /[\u0591-\u05AF\u05B0-\u05BC\u05C1\u05C2\u05C7]/g;

export function stripPoints(s) {
  return String(s).replace(POINTS_RE, '');
}

function headwordOf(g) {
  const idx = g.search(/[/(]/);
  const head = idx === -1 ? g : g.slice(0, idx);
  return head.trim();
}

export function slugify(g) {
  const head = headwordOf(g).trim();
  const stripped = stripPoints(head);
  const withHyphenMaqaf = stripped.replace(/־/g, '-');
  const withHyphenSpaces = withHyphenMaqaf.replace(/\s+/g, '-');
  return withHyphenSpaces.normalize('NFC');
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

// ─── CSV parsing (quoted, comma-delimited, no dependencies) ────────────────
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
  // Drop a single fully-empty trailing row (trailing newline artifact).
  if (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === '') {
    rows.pop();
  }
  return rows;
}

function readCsvRecords() {
  const raw = readFileSync(CSV_PATH, 'utf8');
  const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const rows = parseCSV(text);
  if (rows.length === 0) throw new Error('CSV has no rows');
  const header = rows[0];
  const headerMatches =
    header.length === EXPECTED_HEADER.length && header.every((h, i) => h === EXPECTED_HEADER[i]);
  if (!headerMatches) {
    throw new Error(
      `CSV header mismatch.\n  expected: ${EXPECTED_HEADER.join(',')}\n  actual:   ${header.join(',')}`
    );
  }
  const records = [];
  for (let r = 1; r < rows.length; r += 1) {
    const row = rows[r];
    if (row.length === 1 && row[0] === '') continue; // stray blank line
    if (row.length !== header.length) {
      throw new Error(`CSV row ${r + 1} has ${row.length} fields, expected ${header.length}`);
    }
    const rec = {};
    header.forEach((key, idx) => {
      rec[key] = row[idx];
    });
    records.push(rec);
  }
  return records;
}

// ─── Revision guide parsing ─────────────────────────────────────────────
function readGuideLessons() {
  const text = readFileSync(GUIDE_PATH, 'utf8');
  const lines = text.split(/\r\n|\n/);
  const lessonHeadingRe = /^## Lesson (\d+):\s*(.*)$/;
  const lessons = [];
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(lessonHeadingRe);
    if (!m) {
      i += 1;
      continue;
    }
    const lessonNumber = Number(m[1]);
    const title = m[2].trim();
    i += 1;

    let page = null;
    while (i < lines.length && !/^## /.test(lines[i])) {
      const pm = lines[i].match(/^Source page:\s*(\d+)\s*$/);
      if (pm) {
        page = Number(pm[1]);
        i += 1;
        break;
      }
      i += 1;
    }

    while (i < lines.length && !/^## /.test(lines[i]) && !/^### Revision concepts\s*$/.test(lines[i])) {
      i += 1;
    }
    const concepts = [];
    if (i < lines.length && /^### Revision concepts\s*$/.test(lines[i])) {
      i += 1;
      while (i < lines.length && !/^## /.test(lines[i]) && !/^### /.test(lines[i])) {
        const bm = lines[i].match(/^-\s+(.*)$/);
        if (bm) concepts.push(bm[1].trim());
        i += 1;
      }
    }

    // Skip ahead to the next lesson heading (past the Vocabulary section,
    // which is not parsed here — the CSV is the vocabulary source of truth).
    while (i < lines.length && !/^## /.test(lines[i])) {
      i += 1;
    }

    if (page == null) {
      throw new Error(`Lesson ${lessonNumber}: could not find "Source page:" line`);
    }
    lessons.push({ lessonNumber, title, page, concepts });
  }
  return lessons;
}

function normalizeWhitespace(s) {
  return String(s).trim().replace(/\s+/g, ' ');
}

// ─── Build data ─────────────────────────────────────────────────────────
function buildLessons() {
  const csvRecords = readCsvRecords();
  const guideLessons = readGuideLessons();

  if (guideLessons.length !== TOTAL_LESSONS) {
    throw new Error(`Expected ${TOTAL_LESSONS} lessons in guide, found ${guideLessons.length}`);
  }

  const guideByLesson = new Map(guideLessons.map((l) => [l.lessonNumber, l]));
  for (let n = 1; n <= TOTAL_LESSONS; n += 1) {
    if (!guideByLesson.has(n)) throw new Error(`Guide missing Lesson ${n}`);
  }

  const csvByLesson = new Map();
  const titleMismatches = [];
  for (const rec of csvRecords) {
    const lessonNumber = Number(rec.lesson_number);
    if (!Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > TOTAL_LESSONS) {
      throw new Error(`CSV row has out-of-range lesson_number: ${rec.lesson_number}`);
    }
    if (!csvByLesson.has(lessonNumber)) csvByLesson.set(lessonNumber, []);
    csvByLesson.get(lessonNumber).push(rec);

    const guide = guideByLesson.get(lessonNumber);
    if (normalizeWhitespace(rec.lesson_title) !== normalizeWhitespace(guide.title)) {
      titleMismatches.push({
        lesson: lessonNumber,
        csvTitle: rec.lesson_title,
        guideTitle: guide.title
      });
    }
  }

  const usedIds = new Set();
  const lessons = [];
  let totalCards = 0;

  for (let n = 1; n <= TOTAL_LESSONS; n += 1) {
    const guide = guideByLesson.get(n);
    const rows = csvByLesson.get(n) || [];
    const slugCounts = new Map();
    const cards = rows.map((rec) => {
      const slug = slugify(rec.hebrew);
      const count = (slugCounts.get(slug) || 0) + 1;
      slugCounts.set(slug, count);
      let idBase = count > 1 ? `${slug}-${count}` : slug;
      let id = `bbh-l${pad2(n)}-${idBase}`;
      let bump = count;
      while (usedIds.has(id)) {
        bump += 1;
        id = `bbh-l${pad2(n)}-${slug}-${bump}`;
      }
      usedIds.add(id);

      const card = {
        id,
        g: rec.hebrew,
        e: rec.english_gloss,
        translit: rec.transliteration
      };
      if (rec.grammar_and_forms && rec.grammar_and_forms.trim() !== '') {
        card.notes = rec.grammar_and_forms;
      }
      card.page = Number(rec.source_page);
      card.required = true;
      return card;
    });

    totalCards += cards.length;
    lessons.push({
      lessonNumber: n,
      title: guide.title,
      page: guide.page,
      concepts: guide.concepts,
      cards
    });
  }

  return { lessons, totalCards, titleMismatches };
}

// ─── Serialization helpers ──────────────────────────────────────────────
function indentBlock(json, spaces) {
  const pad = ' '.repeat(spaces);
  return json
    .split('\n')
    .map((line) => (line.length ? pad + line : line))
    .join('\n');
}

const BANNER = (sources) =>
  `// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_data.mjs (source: ${sources})\n`;

function writeVocabFile(lessons) {
  const parts = [];
  parts.push(BANNER('source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv'));
  parts.push('// BBH vocabulary by lesson — self-registers on window.SETS, same idiom as js/data/words.js.\n\n');
  parts.push('(function () {\n');
  parts.push('  window.SETS = window.SETS || {};\n\n');
  for (const lesson of lessons) {
    const setObj = {
      label: `Lesson ${lesson.lessonNumber}: ${lesson.title}`,
      type: 'chapter',
      cards: lesson.cards
    };
    const json = JSON.stringify(setObj, null, 2);
    parts.push(`  window.SETS[${JSON.stringify(String(lesson.lessonNumber))}] = ${indentBlock(json, 2).trimStart()};\n\n`);
  }
  parts.push('})();\n');
  return parts.join('');
}

function writeReferenceFile(lessons) {
  const arr = lessons.map((lesson) => ({
    lesson: lesson.lessonNumber,
    title: lesson.title,
    page: lesson.page,
    concepts: lesson.concepts,
    vocabCount: lesson.cards.length
  }));
  const json = JSON.stringify(arr, null, 2);
  const parts = [];
  parts.push(BANNER('source/bbh/Beginning_Biblical_Hebrew_Revision_Guide.md'));
  parts.push('// BBH per-lesson reference data (revision concepts + vocab counts) — self-registers on window.BBH_REFERENCE.\n\n');
  parts.push('(function () {\n');
  parts.push(`  window.BBH_REFERENCE = ${indentBlock(json, 2).trimStart()};\n`);
  parts.push('})();\n');
  return parts.join('');
}

function writeSetMetaFile(lessons) {
  const chapterTitles = {};
  for (const lesson of lessons) {
    chapterTitles[lesson.lessonNumber] = lesson.title;
  }

  const RANGE_SIZE = 10;
  const rangeKeys = ['rng1', 'rng2', 'rng3', 'rng4', 'rng5'];
  const sessionWeekMeta = {};
  const chapterToWeek = {};
  rangeKeys.forEach((key, idx) => {
    const start = idx * RANGE_SIZE + 1;
    const end = start + RANGE_SIZE - 1;
    const lessonsInRange = [];
    for (let n = start; n <= end; n += 1) {
      lessonsInRange.push(n);
      chapterToWeek[n] = idx + 1;
    }
    sessionWeekMeta[key] = {
      label: `Lessons ${start}–${end}`,
      lessons: lessonsInRange
    };
  });
  const allLessons = [];
  for (let n = 1; n <= TOTAL_LESSONS; n += 1) allLessons.push(n);
  sessionWeekMeta.all = { label: 'All Lessons', lessons: allLessons };

  const weekFirstChapter = {};
  Object.keys(chapterToWeek).forEach((chapStr) => {
    const ch = Number(chapStr);
    const wk = chapterToWeek[chapStr];
    if (weekFirstChapter[wk] == null || ch < weekFirstChapter[wk]) weekFirstChapter[wk] = ch;
  });

  const parts = [];
  parts.push(BANNER('source/bbh/Beginning_Biblical_Hebrew_Revision_Guide.md'));
  parts.push('// Set metadata — lesson titles, lesson-to-range mapping, and session range\n');
  parts.push('// groupings (BBH). ES module: see js/ui/selectors.js, js/domain/deck/ordering.js.\n\n');

  parts.push(`export const CHAPTER_TITLES = ${JSON.stringify(chapterTitles, null, 2)};\n\n`);
  parts.push('// Alias — CHAPTER_TITLES keeps its legacy name for importers; LESSON_TITLES\n');
  parts.push('// is the same data under its natural BBH name.\n');
  parts.push('export const LESSON_TITLES = CHAPTER_TITLES;\n\n');

  parts.push('// Six range presets for the lesson selector: five 10-lesson blocks plus "all".\n');
  parts.push(`export const SESSION_WEEK_META = ${JSON.stringify(sessionWeekMeta, null, 2)};\n\n`);

  parts.push('// Lesson number -> range index (1..5), derived from SESSION_WEEK_META rng1..rng5.\n');
  parts.push(`export const CHAPTER_TO_WEEK = ${JSON.stringify(chapterToWeek, null, 2)};\n\n`);

  parts.push('// First (lowest) lesson number of each range — the inverse of CHAPTER_TO_WEEK.\n');
  parts.push(`export const WEEK_FIRST_CHAPTER = ${JSON.stringify(weekFirstChapter, null, 2)};\n`);

  return parts.join('');
}

function main() {
  const { lessons, totalCards, titleMismatches } = buildLessons();

  if (titleMismatches.length) {
    console.warn(`Note: ${titleMismatches.length} CSV lesson_title value(s) differ from the guide title (guide is canonical):`);
    for (const m of titleMismatches) {
      console.warn(`  Lesson ${m.lesson}: csv="${m.csvTitle}" guide="${m.guideTitle}"`);
    }
  }

  writeFileSync(OUT_VOCAB, writeVocabFile(lessons));
  writeFileSync(OUT_REFERENCE, writeReferenceFile(lessons));
  writeFileSync(OUT_SETMETA, writeSetMetaFile(lessons));

  console.log(`Wrote ${OUT_VOCAB}`);
  console.log(`Wrote ${OUT_REFERENCE}`);
  console.log(`Wrote ${OUT_SETMETA}`);
  console.log(`Lessons: ${lessons.length}, total cards: ${totalCards}`);
}

main();
