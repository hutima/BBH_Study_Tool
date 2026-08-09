#!/usr/bin/env node
// Validator for the BBH Reader source files (Phase 2 PR D):
// source/bbh/reader/{corpus-pin.json, gate-map.json, selections.json}.
// Mirrors the style of tools/validate_bbh_parsing_data.mjs: hand-maintained
// authoritative sources are schema-checked, then cross-checked against a
// FRESH run of the importer (tools/import_oshb_reader.mjs) rather than a
// cached snapshot, so drift between the source files and the pinned corpus
// is always caught.
//
// Checks:
//   1. corpus-pin.json shape + non-empty attribution string.
//   2. gate-map.json shape (every mapping entry has the fields the importer
//      expects; every morphPattern compiles as a regex).
//   3. selections.json shape (required fields, tier whitelist, unique ids).
//   4. Corpus pin verification (delegated to importGenesis -> verifyCorpusPin
//      -> aborts if the pinned checkout's HEAD doesn't match).
//   5. Score reproducibility: every selection's recorded `scores` (and tier)
//      must deep-equal what a fresh importGenesis() computes for that
//      osisRef.
//   6. No unmapped tokens in any strict/guided selection (unmappedCount===0)
//      — a selection can never expose an appendix-only/out-of-scope feature.
//   7. Display byte-equality: every token's display text, as produced by the
//      importer, is checked against an INDEPENDENT fresh read+extraction of
//      wlc/Gen.xml for literal byte equality (Buffer-level, not just JS
//      string `===`) — proves no NFC normalization or other mutation crept
//      in anywhere in the pipeline.
//
// Usage: node tools/validate_bbh_reader_data.mjs
// Exits nonzero (via process.exitCode) on any failure; prints a pass
// summary otherwise. Requires the pinned OSHB checkout to be present (see
// tools/import_oshb_reader.mjs header) — this is a dev-time tool, never run
// as part of the shipped app.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  importGenesis,
  readCorpusPin,
  loadGateMap,
  ROOT
} from './import_oshb_reader.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
void __dirname;

const SELECTIONS_PATH = path.join(ROOT, 'source/bbh/reader/selections.json');
const GEN_XML_PATH_REL = 'wlc/Gen.xml';

const TIER_VALUES = new Set(['strict', 'guided', 'challenge']);
const ID_RE = /^[a-z0-9][a-z0-9-]*$/;

const failures = [];
const reports = [];
function fail(category, message) {
  failures.push(`[${category}] ${message}`);
}
function report(message) {
  reports.push(message);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

// ─── 1. corpus-pin.json ────────────────────────────────────────────────────
function validateCorpusPin() {
  let pin;
  try {
    pin = readCorpusPin();
  } catch (err) {
    fail('corpus-pin', `failed to read/parse corpus-pin.json: ${err.message}`);
    return null;
  }
  if (pin.schemaVersion !== 1) fail('corpus-pin', `schemaVersion is ${JSON.stringify(pin.schemaVersion)}, expected 1`);
  if (typeof pin.commit !== 'string' || !/^[0-9a-f]{40}$/.test(pin.commit)) {
    fail('corpus-pin', `commit "${pin.commit}" is not a 40-char lowercase hex SHA`);
  }
  if (typeof pin.attribution !== 'string' || pin.attribution.trim() === '') {
    fail('corpus-pin', 'attribution is missing or empty');
  } else {
    report('corpus-pin: attribution present (pass)');
  }
  if (typeof pin.repository !== 'string' || !pin.repository.startsWith('http')) {
    fail('corpus-pin', `repository "${pin.repository}" is not a URL`);
  }
  return pin;
}

// ─── 2. gate-map.json ───────────────────────────────────────────────────────
function validateGateMap() {
  let doc;
  try {
    doc = loadGateMap();
  } catch (err) {
    fail('gate-map', `failed to read/parse gate-map.json: ${err.message}`);
    return;
  }
  if (doc.schemaVersion !== 1) fail('gate-map', `schemaVersion is ${JSON.stringify(doc.schemaVersion)}, expected 1`);
  if (!Array.isArray(doc.mappings)) {
    fail('gate-map', '"mappings" is not an array');
    return;
  }
  if (doc.mappings.length === 0) {
    fail('gate-map', '"mappings" is empty — Task 1 must populate it before Reader data can be curated/generated');
    return;
  }
  let entryIdx = 0;
  for (const entry of doc.mappings) {
    const label = `mappings[${entryIdx}]`;
    entryIdx++;
    if (typeof entry.morphPattern !== 'string' || entry.morphPattern === '') {
      fail('gate-map-entry', `${label}: morphPattern missing/empty`);
      continue;
    }
    try {
      // eslint-disable-next-line no-new
      new RegExp(`^(?:${entry.morphPattern})$`);
    } catch (err) {
      fail('gate-map-entry', `${label}: morphPattern "${entry.morphPattern}" does not compile: ${err.message}`);
    }
    if (entry.window !== undefined && entry.window !== 1 && entry.window !== 2) {
      fail('gate-map-entry', `${label}: window "${entry.window}" must be 1 or 2 if present`);
    }
    const hasLesson = Number.isInteger(entry.bbhLesson);
    const isUnmapped = entry.unmapped === true;
    const isNeutral = entry.neutral === true;
    const isVocabLinked = entry.vocabLinked === true;
    if (!hasLesson && !isUnmapped && !isNeutral) {
      fail('gate-map-entry', `${label}: has neither a numeric bbhLesson, unmapped:true, nor neutral:true`);
    }
    if (hasLesson && (entry.bbhLesson < 1 || entry.bbhLesson > 50)) {
      fail('gate-map-entry', `${label}: bbhLesson ${entry.bbhLesson} not in 1..50`);
    }
    if (isVocabLinked && !hasLesson) {
      fail('gate-map-entry', `${label}: vocabLinked:true requires a numeric bbhLesson (the "in scope" sentinel value)`);
    }
    if (typeof entry.note !== 'string' || entry.note.trim() === '') {
      fail('gate-map-entry', `${label}: note is missing/empty`);
    }
    if (entry.lemmaStrongs !== undefined) {
      if (!Array.isArray(entry.lemmaStrongs) || entry.lemmaStrongs.some((s) => typeof s !== 'string')) {
        fail('gate-map-entry', `${label}: lemmaStrongs must be an array of strings`);
      }
    }
  }
  report(`gate-map: ${doc.mappings.length} mapping entries, all compile as regexes (pass)`);
}

// ─── 3. selections.json shape ──────────────────────────────────────────────
function validateSelectionsShape(doc) {
  if (doc.schemaVersion !== 1) fail('selections', `schemaVersion is ${JSON.stringify(doc.schemaVersion)}, expected 1`);
  if (!Array.isArray(doc.selections)) {
    fail('selections', '"selections" is not an array');
    return [];
  }
  if (doc.selections.length === 0) {
    fail('selections', '"selections" is empty — Task 3 must populate it');
    return [];
  }
  const ids = new Set();
  const osisRefs = new Set();
  for (const sel of doc.selections) {
    const label = `selection "${sel && sel.id}"`;
    if (typeof sel.id !== 'string' || !ID_RE.test(sel.id)) {
      fail('selection-id', `${label}: id does not match ^[a-z0-9][a-z0-9-]*$`);
    } else if (ids.has(sel.id)) {
      fail('selection-id', `duplicate selection id "${sel.id}"`);
    } else {
      ids.add(sel.id);
    }
    if (typeof sel.ref !== 'string' || !/^Gen \d+:\d+$/.test(sel.ref)) {
      fail('selection-ref', `${label}: ref "${sel.ref}" does not match "Gen C:V"`);
    }
    if (typeof sel.osisRef !== 'string' || !/^Gen\.\d+\.\d+$/.test(sel.osisRef)) {
      fail('selection-ref', `${label}: osisRef "${sel.osisRef}" does not match "Gen.C.V"`);
    } else if (osisRefs.has(sel.osisRef)) {
      fail('selection-ref', `duplicate osisRef "${sel.osisRef}"`);
    } else {
      osisRefs.add(sel.osisRef);
    }
    if (!Number.isInteger(sel.gateLesson) || sel.gateLesson < 1 || sel.gateLesson > 50) {
      fail('selection-gate', `${label}: gateLesson "${sel.gateLesson}" not an integer in 1..50`);
    }
    if (!TIER_VALUES.has(sel.tier)) {
      fail('selection-tier', `${label}: tier "${sel.tier}" not in {strict,guided,challenge}`);
    }
    if (!isPlainObject(sel.scores)) {
      fail('selection-scores', `${label}: scores is not an object`);
    } else {
      for (const key of ['tokenCount', 'unknownContentLexemes', 'unmappedCount', 'maxGrammarLesson']) {
        if (!Number.isInteger(sel.scores[key]) || sel.scores[key] < 0) {
          fail('selection-scores', `${label}: scores.${key} "${sel.scores[key]}" is not a non-negative integer`);
        }
      }
    }
    if (typeof sel.rationale !== 'string' || sel.rationale.trim() === '') {
      fail('selection-rationale', `${label}: rationale is missing/empty`);
    }
  }
  report(`selections: ${doc.selections.length} entries, shape OK (pass)`);
  return doc.selections;
}

// ─── 5+6. Score reproducibility + strict/guided-never-unmapped ────────────
function validateReproducibility(selections, freshVerses) {
  const byOsisID = new Map(freshVerses.map((v) => [v.osisID, v]));
  let mismatchCount = 0;
  let unmappedInSelectionCount = 0;
  for (const sel of selections) {
    const fresh = byOsisID.get(sel.osisRef);
    if (!fresh) {
      fail('reproducibility', `selection "${sel.id}" (${sel.osisRef}): verse not found in a fresh Genesis import`);
      continue;
    }
    const freshScores = {
      tokenCount: fresh.scores.tokenCount,
      unknownContentLexemes: fresh.scores.unknownContentLexemes,
      unmappedCount: fresh.scores.unmappedCount,
      maxGrammarLesson: fresh.scores.maxGrammarLesson
    };
    if (JSON.stringify(freshScores) !== JSON.stringify(sel.scores)) {
      mismatchCount++;
      fail(
        'reproducibility',
        `selection "${sel.id}" (${sel.osisRef}): recorded scores ${JSON.stringify(sel.scores)} != fresh-import scores ${JSON.stringify(freshScores)}`
      );
    }
    if (fresh.scores.gateLesson !== sel.gateLesson) {
      mismatchCount++;
      fail('reproducibility', `selection "${sel.id}" (${sel.osisRef}): recorded gateLesson ${sel.gateLesson} != fresh maxGrammarLesson ${fresh.scores.gateLesson}`);
    }
    if (fresh.scores.tier !== sel.tier && !(sel.tier === 'challenge' && fresh.scores.tier === 'challenge')) {
      // strict/guided selections must still compute as strict/guided fresh;
      // a verse recorded as strict may legitimately still compute as strict
      // (tier is deterministic given the same tokenCount/unknownContentLexemes),
      // so any mismatch here is a real drift.
      if (fresh.scores.tier !== sel.tier) {
        mismatchCount++;
        fail('reproducibility', `selection "${sel.id}" (${sel.osisRef}): recorded tier "${sel.tier}" != fresh tier "${fresh.scores.tier}"`);
      }
    }
    if ((sel.tier === 'strict' || sel.tier === 'guided') && fresh.scores.unmappedCount !== 0) {
      unmappedInSelectionCount++;
      fail('no-unmapped-in-selection', `selection "${sel.id}" (${sel.osisRef}): tier "${sel.tier}" but unmappedCount=${fresh.scores.unmappedCount} (must be 0)`);
    }
    for (const tok of fresh.tokens) {
      if (tok.tokenLesson != null && tok.tokenLesson > sel.gateLesson) {
        fail('no-future-token', `selection "${sel.id}" (${sel.osisRef}): a token gates at L${tok.tokenLesson}, above the selection's own gateLesson ${sel.gateLesson}`);
      }
    }
  }
  if (mismatchCount === 0) report(`reproducibility: all ${selections.length} selections' scores reproduce exactly from a fresh import (pass)`);
  if (unmappedInSelectionCount === 0) report('no-unmapped-in-selection: 0 strict/guided selections contain an unmapped token (pass)');
}

// ─── 7. Display byte-equality vs a fresh, independent read of Gen.xml ─────
function extractRawTokenDisplays(xmlText, osisID) {
  const escaped = osisID.replace(/\./g, '\\.');
  const verseRe = new RegExp(`<verse osisID="${escaped}">([\\s\\S]*?)<\\/verse>`);
  const m = verseRe.exec(xmlText);
  if (!m) return null;
  const body = m[1].replace(/<note[\s\S]*?<\/note>/g, '');
  const displays = [];
  const wRe = /<w\b[^>]*>([^<]*)<\/w>/g;
  let wm;
  while ((wm = wRe.exec(body))) displays.push(wm[1]);
  return displays;
}

function validateByteEquality(selections, checkoutDir) {
  const genXmlPath = path.join(checkoutDir, GEN_XML_PATH_REL);
  const xmlText = readFileSync(genXmlPath, 'utf8'); // fresh, independent read
  let tokensChecked = 0;
  let mismatchCount = 0;
  for (const sel of selections) {
    const rawDisplays = extractRawTokenDisplays(xmlText, sel.osisRef);
    if (!rawDisplays) {
      fail('byte-equality', `selection "${sel.id}" (${sel.osisRef}): verse not found in an independent fresh read of Gen.xml`);
      continue;
    }
    // Cross-check against what the importer produced for the same verse.
    const fresh = validateByteEquality._byOsisID.get(sel.osisRef);
    if (!fresh) continue;
    if (fresh.tokens.length !== rawDisplays.length) {
      mismatchCount++;
      fail('byte-equality', `selection "${sel.id}" (${sel.osisRef}): token count mismatch, importer=${fresh.tokens.length} raw-xml=${rawDisplays.length}`);
      continue;
    }
    for (let i = 0; i < rawDisplays.length; i++) {
      tokensChecked++;
      const a = Buffer.from(fresh.tokens[i].token.display, 'utf8');
      const b = Buffer.from(rawDisplays[i], 'utf8');
      if (!a.equals(b)) {
        mismatchCount++;
        fail(
          'byte-equality',
          `selection "${sel.id}" (${sel.osisRef}) token[${i}]: importer display ${JSON.stringify(fresh.tokens[i].token.display)} != raw XML ${JSON.stringify(rawDisplays[i])}`
        );
      }
    }
  }
  if (mismatchCount === 0) {
    report(`byte-equality: ${tokensChecked} token display strings across ${selections.length} selections match wlc/Gen.xml byte-for-byte (pass)`);
  }
}

function main() {
  const pin = validateCorpusPin();
  validateGateMap();

  let selectionsDoc;
  try {
    selectionsDoc = readJson(SELECTIONS_PATH);
  } catch (err) {
    fail('selections', `failed to read/parse selections.json: ${err.message}`);
    selectionsDoc = null;
  }
  const selections = selectionsDoc ? validateSelectionsShape(selectionsDoc) : [];

  if (pin && selections.length && failures.length === 0) {
    let result;
    try {
      result = importGenesis();
    } catch (err) {
      fail('corpus-pin', `importGenesis() failed: ${err.message}`);
      result = null;
    }
    if (result) {
      validateReproducibility(selections, result.verses);
      const byOsisID = new Map(result.verses.map((v) => [v.osisID, v]));
      validateByteEquality._byOsisID = byOsisID;
      validateByteEquality(selections, result.checkoutDir);
    }
  } else if (selections.length && failures.length > 0) {
    report('skipped fresh-import reproducibility/byte-equality checks (shape errors above must be fixed first)');
  }

  console.log('── BBH Reader data validation ──');
  for (const r of reports) console.log('  ' + r);
  if (failures.length) {
    console.log('\nFAILURES:');
    for (const f of failures) console.log('  ✗ ' + f);
    console.log(`\n${failures.length} failure(s).`);
    process.exitCode = 1;
  } else {
    console.log(`\nAll checks passed (${reports.length} reports, 0 failures).`);
  }
}

main();
