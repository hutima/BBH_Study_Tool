#!/usr/bin/env node
// GENERATED FILE PRODUCER — do not hand-edit js/data/bbh_alphabet.js.
// Regenerate: node tools/gen_bbh_alphabet_data.mjs
// (source: source/bbh/alphabet.json)
//
// Mirrors the shape/idiom of tools/gen_bbh_data.mjs: reads the immutable,
// hand-verified source/bbh/alphabet.json and deterministically writes
// js/data/bbh_alphabet.js, a classic self-registering script exposing
// window.BBH_ALPHABET = { schemaVersion, letters: [...] }.
//
// This is the "Lesson 0 — Alphabet" deck's data source (Phase 2 ledger
// addendum, 2026-08-08): a practice deck completely separate from the
// vocabulary machinery (no SRS, no ids in the bbh-l##-* namespace, not
// registered on window.SETS). Never edit source/bbh/alphabet.json from here.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SOURCE_PATH = path.join(ROOT, 'source/bbh/alphabet.json');
const OUT_PATH = path.join(ROOT, 'js/data/bbh_alphabet.js');

const EXPECTED_LETTER_COUNT = 23;
const EXPECTED_FINAL_FORM_COUNT = 5;
const REQUIRED_FIELDS = ['order', 'letter', 'nameHebrew', 'nameEnglish', 'sound'];

function readSource() {
  const raw = readFileSync(SOURCE_PATH, 'utf8');
  return JSON.parse(raw);
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

function writeAlphabetFile(letters, schemaVersion) {
  const payload = { schemaVersion, letters };
  const json = JSON.stringify(payload, null, 2);
  const parts = [];
  parts.push('// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_alphabet_data.mjs (source: source/bbh/alphabet.json)\n');
  parts.push('// Lesson 0 — Alphabet practice deck data. Self-registers on window.BBH_ALPHABET,\n');
  parts.push('// separate from window.SETS (vocabulary) — see docs/bbh-conversion-plan.md\n');
  parts.push('// "Lesson 0" addendum.\n\n');
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

  const letters = buildLetters(data);
  writeFileSync(OUT_PATH, writeAlphabetFile(letters, data.schemaVersion));
  console.log(`Wrote ${OUT_PATH}`);
  console.log(`Letters: ${letters.length}, final forms: ${letters.filter((l) => l.finalForm).length}`);
}

main();
