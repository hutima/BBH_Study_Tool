#!/usr/bin/env node
// GENERATED-FILE GENERATOR — this file is hand-maintained (not itself
// generated). It reads the immutable Phase 2 grammar source file and
// deterministically writes js/data/bbh_grammar.js. Mirrors the style of
// tools/gen_bbh_parsing_data.mjs.
//
// Source (hand-maintained, authoritative — never generated into, never
// edited by this script):
//   - source/bbh/grammar/questions.json
//
// Output (generated — never hand-edit, re-run this script instead):
//   - js/data/bbh_grammar.js
//
// Before writing anything, this script spawns
// tools/validate_bbh_grammar_data.mjs as a subprocess and fails hard
// (nonzero exit, output relayed) if the source data doesn't pass — the
// generator never writes output from data the validator has rejected.
//
// Determinism: questions are sorted by (introducedLesson, id). Re-running
// with no source changes must be a byte-identical no-op:
// `node tools/gen_bbh_grammar_data.mjs && git diff --exit-code
// js/data/bbh_grammar.js`. Runs (and must stay a no-op) even when the bank
// is empty — js/data/bbh_grammar.js ships with an empty questions array so
// downstream wiring can rely on the file existing on disk.
//
// Usage: node tools/gen_bbh_grammar_data.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const QUESTIONS_PATH = path.join(ROOT, 'source/bbh/grammar/questions.json');
const VALIDATOR_PATH = path.join(ROOT, 'tools/validate_bbh_grammar_data.mjs');
const OUT_PATH = path.join(ROOT, 'js/data/bbh_grammar.js');

// ─── 1. Validate first — never generate from data the validator rejects ────
function runValidator() {
  try {
    execFileSync(process.execPath, [VALIDATOR_PATH], { cwd: ROOT, stdio: 'pipe' });
  } catch (err) {
    const out = (err.stdout ? err.stdout.toString() : '') + (err.stderr ? err.stderr.toString() : '');
    console.error('gen_bbh_grammar_data: tools/validate_bbh_grammar_data.mjs failed — aborting, nothing written.\n');
    console.error(out.trim());
    process.exit(1);
  }
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

// ─── 2. Deterministic question ordering ────────────────────────────────────
function sortQuestions(questions) {
  return [...questions].sort((a, b) => {
    const la = Number.isInteger(a.introducedLesson) ? a.introducedLesson : Infinity;
    const lb = Number.isInteger(b.introducedLesson) ? b.introducedLesson : Infinity;
    if (la !== lb) return la - lb;
    return String(a.id).localeCompare(String(b.id));
  });
}

function buildOutput(questionsDoc) {
  return {
    schemaVersion: questionsDoc.schemaVersion,
    questions: sortQuestions(questionsDoc.questions)
  };
}

// ─── 3. Serialization ───────────────────────────────────────────────────
const HEADER = [
  '// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_grammar_data.mjs',
  '// (source: source/bbh/grammar/questions.json)',
  '//',
  '// Phase 2 PR C lesson-gated Grammar Quiz question bank. Self-registers on',
  '// window.BBH_GRAMMAR as a CLASSIC (non-module) script — same idiom as',
  '// js/data/bbh_vocab.js registering window.SETS and js/data/bbh_parsing.js',
  '// registering window.BBH_PARSING — so it can be dropped into index.html\'s',
  '// plain <script> tags without touching the ES-module import graph. NOT YET',
  '// wired into index.html or sw.js precache as of PR C — that lands with the',
  '// Grammar Quiz UI in a later PR; this file existing unused on disk (and',
  '// possibly with an empty questions array, before the bank is populated) is',
  '// expected at this stage.',
  '//',
  '// Shape: { schemaVersion, questions: [...] }. Every question carries every',
  '// field from source/bbh/grammar/questions.json unchanged — see that file\'s',
  '// header notes / docs/bbh-conversion-plan.md "Phase 2 architecture',
  '// decisions" for the question-object schema. Questions are sorted by',
  '// (introducedLesson, id).',
  '//',
  '// Never edit this file by hand — re-run the generator instead. Never edit',
  '// source/bbh/grammar/questions.json from here or anywhere else.',
  ''
].join('\n');

function writeGrammarFile(output) {
  const json = JSON.stringify(output, null, 2);
  const parts = [];
  parts.push(HEADER);
  parts.push('(function () {\n');
  parts.push(`  window.BBH_GRAMMAR = ${json.split('\n').join('\n  ')};\n`);
  parts.push('})();\n');
  return parts.join('');
}

function main() {
  runValidator();

  const questionsDoc = readJson(QUESTIONS_PATH);

  const output = buildOutput(questionsDoc);
  writeFileSync(OUT_PATH, writeGrammarFile(output));
  console.log(
    `Wrote ${path.relative(ROOT, OUT_PATH)} (${output.questions.length} question(s)).`
  );
}

main();
