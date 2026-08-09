#!/usr/bin/env node
// GENERATED-FILE GENERATOR — this file is hand-maintained (not itself
// generated). It reads the Phase 2 Reader source files, re-runs the OSHB
// importer fresh (never trusting a cache), and deterministically writes
// js/data/bbh_reader.js. Mirrors the style of tools/gen_bbh_parsing_data.mjs.
//
// Sources (hand-maintained/curated, authoritative — never generated into):
//   - source/bbh/reader/corpus-pin.json
//   - source/bbh/reader/gate-map.json
//   - source/bbh/reader/selections.json
//   - tools/import_oshb_reader.mjs (dev-time importer; reads the PINNED
//     local OSHB checkout — see that file's header for the path/env var)
//
// Output (generated — never hand-edit, re-run this script instead):
//   - js/data/bbh_reader.js
//
// Before writing anything, this script spawns
// tools/validate_bbh_reader_data.mjs as a subprocess and fails hard
// (nonzero exit, output relayed) if the source data doesn't pass — same
// idiom as tools/gen_bbh_parsing_data.mjs. The validator itself re-runs the
// importer fresh and checks that every selection's recorded scores
// reproduce exactly, so a generated file can never silently ship stale or
// drifted passage data.
//
// Determinism: passages are emitted in source/bbh/reader/selections.json's
// own array order (never re-sorted, never Object-key-order-dependent —
// every object below is built with an explicit key list). No Date.now(),
// no Math.random(), no environment-dependent iteration. Re-running with no
// source changes must be a byte-identical no-op:
// `node tools/gen_bbh_reader_data.mjs && git diff --exit-code js/data/bbh_reader.js`.
//
// Usage: node tools/gen_bbh_reader_data.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { importGenesis, readCorpusPin, ROOT } from './import_oshb_reader.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
void __dirname;

const SELECTIONS_PATH = path.join(ROOT, 'source/bbh/reader/selections.json');
const VALIDATOR_PATH = path.join(ROOT, 'tools/validate_bbh_reader_data.mjs');
const OUT_PATH = path.join(ROOT, 'js/data/bbh_reader.js');

// ─── 1. Validate first — never generate from data the validator rejects ───
function runValidator() {
  try {
    execFileSync(process.execPath, [VALIDATOR_PATH], { cwd: ROOT, stdio: 'pipe' });
  } catch (err) {
    const out = (err.stdout ? err.stdout.toString() : '') + (err.stderr ? err.stderr.toString() : '');
    console.error('gen_bbh_reader_data: tools/validate_bbh_reader_data.mjs failed — aborting, nothing written.\n');
    console.error(out.trim());
    process.exit(1);
  }
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

// ─── 2. Build the passage token list for one selection ─────────────────────
// Emitted token shape (short keys — this ships to the browser):
//   t  display text, EXACT byte-for-byte from wlc/Gen.xml (never mutated)
//   l  raw OSHB lemma attribute (Strong's number[s], possibly "/"-joined
//      for a multi-morpheme token, e.g. "d/8064") or null if the token
//      carries no lemma attribute at all
//   s  primary content-word Strong's number (digits only, homonym letter
//      stripped) or null for a token with no content (N/V/A) segment
//   m  raw OSHB morph attribute (e.g. "HTd/Ncmsa")
//   g  this token's own grammar gate (max mapped BBH lesson across its
//      morphology), or null if the token is entirely function-word/
//      grammar-neutral (e.g. a bare "C" conjunction gates at L13, so this
//      is null only for genuinely gate-less segments, which in practice
//      does not occur once every POS is covered by gate-map.json)
//   pn true if any segment of this token is a proper noun (Np)
//   v  this token's content-word vocabLesson match (CSV-verified earliest
//      lesson), or null if unmatched/not a content word
function buildToken(classifiedToken) {
  return {
    t: classifiedToken.token.display,
    l: classifiedToken.token.lemmaRaw,
    s: classifiedToken.strongs,
    m: classifiedToken.token.morphRaw,
    g: classifiedToken.tokenLesson,
    pn: classifiedToken.isProperName,
    v: classifiedToken.vocabLesson
  };
}

function buildPassage(selection, freshVerse) {
  return {
    id: selection.id,
    ref: selection.ref,
    gateLesson: selection.gateLesson,
    tier: selection.tier,
    tokens: freshVerse.tokens.map(buildToken)
  };
}

function buildOutput(selectionsDoc, pin, freshVerses) {
  const byOsisID = new Map(freshVerses.map((v) => [v.osisID, v]));
  const passages = selectionsDoc.selections.map((sel) => buildPassage(sel, byOsisID.get(sel.osisRef)));
  return {
    schemaVersion: 1,
    attribution: pin.attribution,
    corpusPin: { tag: pin.tag, commit: pin.commit },
    passages
  };
}

// ─── 3. Serialization ───────────────────────────────────────────────────
const HEADER = [
  '// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_reader_data.mjs',
  '// (sources: source/bbh/reader/corpus-pin.json, gate-map.json, selections.json',
  '// + a fresh run of tools/import_oshb_reader.mjs against the pinned OSHB',
  '// checkout — see that file\'s header. NOT a hand-authored source itself.)',
  '//',
  '// Phase 2 PR D curated Reader passages. Self-registers on',
  '// window.BBH_READER as a CLASSIC (non-module) script — same idiom as',
  '// js/data/bbh_vocab.js registering window.SETS and js/data/bbh_parsing.js',
  '// registering window.BBH_PARSING — so it can be dropped into index.html\'s',
  '// plain <script> tags without touching the ES-module import graph. NOT YET',
  '// wired into index.html or sw.js precache as of PR D — that lands with the',
  '// Reader UI in a later PR; this file existing unused on disk is expected',
  '// at this stage.',
  '//',
  '// Shape: { schemaVersion, attribution, corpusPin: {tag, commit},',
  '// passages: [{ id, ref, gateLesson, tier, tokens: [{t,l,s,m,g,pn,v}] }] }.',
  '// Token field meanings are documented above buildToken() in',
  '// tools/gen_bbh_reader_data.mjs. `t` (display) is preserved byte-for-byte',
  '// from the Westminster Leningrad Codex text as distributed by OSHB — never',
  '// NFC-normalized or otherwise mutated anywhere in this pipeline.',
  '//',
  '// Never edit this file by hand — re-run the generator instead. Never edit',
  '// source/bbh/reader/*.json from here or anywhere else.',
  ''
].join('\n');

function writeReaderFile(output) {
  const json = JSON.stringify(output, null, 2);
  const parts = [];
  parts.push(HEADER);
  parts.push('(function () {\n');
  parts.push(`  window.BBH_READER = ${json.split('\n').join('\n  ')};\n`);
  parts.push('})();\n');
  return parts.join('');
}

function main() {
  runValidator();

  const selectionsDoc = readJson(SELECTIONS_PATH);
  const pin = readCorpusPin();
  const { verses } = importGenesis();

  const output = buildOutput(selectionsDoc, pin, verses);
  writeFileSync(OUT_PATH, writeReaderFile(output));
  console.log(
    `Wrote ${path.relative(ROOT, OUT_PATH)} ` +
    `(${output.passages.length} passage(s), ` +
    `${output.passages.reduce((n, p) => n + p.tokens.length, 0)} token(s)).`
  );
}

main();
