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

// ─── 3. Form augmentation: add `compare` (points stripped) ────────────────
// `display` (pointed) stays authoritative and untouched; `compare` is a
// purely derived field for point-insensitive matching, stripped with the
// SAME logic js/utils/hebrewText.js uses at runtime for the unpointed
// display toggle — imported directly (both are ES modules) rather than
// duplicated, so generated data and runtime display can never disagree on
// what counts as a "point".
function augmentForm(form) {
  return { ...form, compare: stripHebrewPoints(form.display) };
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
  '// source/bbh/parsing/paradigms.json unchanged, plus a generated `compare`',
  '// field (the pointed `display` with vowel points/cantillation stripped —',
  '// see js/utils/hebrewText.js#stripHebrewPoints) for point-insensitive',
  '// answer comparison. `lessonGates` mirrors source/bbh/parsing/',
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

main();
