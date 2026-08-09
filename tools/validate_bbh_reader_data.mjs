#!/usr/bin/env node
// Validator for the BBH Reader source files (Phase 2 PR D; multi-book
// expansion added in the "Reader book expansion" task):
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
//   3. selections.json shape (required fields, tier whitelist, unique ids,
//      ref/osisRef book code in BOOK_LIST, challengeNote required iff
//      tier==='challenge').
//   4. Corpus pin verification (delegated to importReaderCorpus ->
//      verifyCorpusPin -> aborts if the pinned checkout's HEAD doesn't
//      match).
//   5. Score reproducibility: every selection's recorded `scores` (and
//      tier) must deep-equal what a fresh importReaderCorpus() computes for
//      that osisRef. For tier==='challenge', the recorded `gateLesson` is
//      checked against the fresh `effectiveGateLesson` (the lower, below-
//      max lesson the passage is actually gated/visible at) rather than
//      `gateLesson` (always the verse's raw maxGrammarLesson) — see the
//      tier definition in source/bbh/reader/selections.json's notes and
//      scoreVerse() in tools/import_oshb_reader.mjs.
//   6. No unmapped tokens in any strict/guided selection (unmappedCount===0)
//      — a selection can never expose an appendix-only/out-of-scope feature.
//      No-future-token: no token may gate above a selection's own recorded
//      gateLesson, EXCEPT for a tier==='challenge' selection's single
//      flagged token at the verse's maxGrammarLesson (that's the whole
//      point of the challenge tier — exactly one clearly-identified
//      near-future feature; scoreVerse() only ever assigns 'challenge' when
//      there is exactly one such token, so this exemption can never widen
//      to more than one token without failing here).
//   7. Display byte-equality: every token's display text, as produced by the
//      importer, is checked against an INDEPENDENT fresh read+extraction of
//      the selection's own wlc/<Book>.xml for literal byte equality
//      (Buffer-level, not just JS string `===`) — proves no NFC
//      normalization or other mutation crept in anywhere in the pipeline.
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
  importReaderCorpus,
  readCorpusPin,
  loadGateMap,
  BOOK_LIST,
  ROOT
} from './import_oshb_reader.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
void __dirname;

const SELECTIONS_PATH = path.join(ROOT, 'source/bbh/reader/selections.json');

const TIER_VALUES = new Set(['strict', 'guided', 'challenge']);
const BOOK_RE_GROUP = BOOK_LIST.join('|');
const REF_RE = new RegExp(`^(${BOOK_RE_GROUP}) \\d+:\\d+$`);
const OSISREF_RE = new RegExp(`^(${BOOK_RE_GROUP})\\.\\d+\\.\\d+$`);
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
    if (typeof sel.ref !== 'string' || !REF_RE.test(sel.ref)) {
      fail('selection-ref', `${label}: ref "${sel.ref}" does not match "<Book> C:V" for a BOOK_LIST book (${BOOK_LIST.join(', ')})`);
    }
    if (typeof sel.osisRef !== 'string' || !OSISREF_RE.test(sel.osisRef)) {
      fail('selection-ref', `${label}: osisRef "${sel.osisRef}" does not match "<Book>.C.V" for a BOOK_LIST book (${BOOK_LIST.join(', ')})`);
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
    if (sel.tier === 'challenge') {
      if (typeof sel.challengeNote !== 'string' || sel.challengeNote.trim() === '') {
        fail('selection-challenge-note', `${label}: tier is "challenge" but challengeNote is missing/empty (must name the single near-future feature)`);
      }
    } else if (sel.challengeNote !== undefined) {
      fail('selection-challenge-note', `${label}: challengeNote is only valid on tier "challenge" selections`);
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
      fail('reproducibility', `selection "${sel.id}" (${sel.osisRef}): verse not found in a fresh import`);
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
    // For tier==='challenge', the selection's recorded gateLesson is the
    // LOWER effectiveGateLesson (below-max lesson the passage is actually
    // gated at) — the whole point of the tier is exposing one token above
    // that gate. For strict/guided, gateLesson is the ordinary raw
    // maxGrammarLesson/gateLesson (the two are identical for those tiers).
    const expectedGateLesson = sel.tier === 'challenge' ? fresh.scores.effectiveGateLesson : fresh.scores.gateLesson;
    if (expectedGateLesson !== sel.gateLesson) {
      mismatchCount++;
      fail('reproducibility', `selection "${sel.id}" (${sel.osisRef}): recorded gateLesson ${sel.gateLesson} != fresh ${sel.tier === 'challenge' ? 'effectiveGateLesson' : 'gateLesson'} ${expectedGateLesson}`);
    }
    if (fresh.scores.tier !== sel.tier) {
      mismatchCount++;
      fail('reproducibility', `selection "${sel.id}" (${sel.osisRef}): recorded tier "${sel.tier}" != fresh tier "${fresh.scores.tier}"`);
    }
    if ((sel.tier === 'strict' || sel.tier === 'guided' || sel.tier === 'challenge') && fresh.scores.unmappedCount !== 0) {
      unmappedInSelectionCount++;
      fail('no-unmapped-in-selection', `selection "${sel.id}" (${sel.osisRef}): tier "${sel.tier}" but unmappedCount=${fresh.scores.unmappedCount} (must be 0)`);
    }
    // No-future-token: every token must gate at or below the selection's
    // own recorded gateLesson, EXCEPT a tier==='challenge' selection's
    // single flagged token sitting at the verse's maxGrammarLesson — that
    // token IS the "one clearly-identified near-future feature" the
    // challenge tier exists to expose. scoreVerse() only ever assigns
    // 'challenge' when exactly one token sits at maxGrammarLesson, so this
    // exemption can never silently widen past one token.
    let challengeExemptionsUsed = 0;
    for (const tok of fresh.tokens) {
      if (tok.tokenLesson != null && tok.tokenLesson > sel.gateLesson) {
        if (sel.tier === 'challenge' && tok.tokenLesson === fresh.scores.maxGrammarLesson && challengeExemptionsUsed === 0) {
          challengeExemptionsUsed++;
          continue;
        }
        fail('no-future-token', `selection "${sel.id}" (${sel.osisRef}): a token gates at L${tok.tokenLesson}, above the selection's own gateLesson ${sel.gateLesson}${sel.tier === 'challenge' ? ' (beyond the single challenge-tier exemption)' : ''}`);
      }
    }
  }
  if (mismatchCount === 0) report(`reproducibility: all ${selections.length} selections' scores reproduce exactly from a fresh import (pass)`);
  if (unmappedInSelectionCount === 0) report('no-unmapped-in-selection: 0 selections (any tier) contain an unmapped token (pass)');
}

// ─── 7. Display byte-equality vs a fresh, independent read of wlc/<Book>.xml
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
  // Independently re-read each BOOK's own wlc/<Book>.xml exactly once
  // (never trusting the importer's own read), keyed by OSIS book code
  // (sel.osisRef's first "." segment).
  const xmlByBook = new Map();
  const bookOf = (osisID) => osisID.split('.')[0];
  let tokensChecked = 0;
  let mismatchCount = 0;
  for (const sel of selections) {
    const book = bookOf(sel.osisRef);
    if (!xmlByBook.has(book)) {
      const bookXmlPath = path.join(checkoutDir, `wlc/${book}.xml`);
      xmlByBook.set(book, readFileSync(bookXmlPath, 'utf8'));
    }
    const xmlText = xmlByBook.get(book);
    const rawDisplays = extractRawTokenDisplays(xmlText, sel.osisRef);
    if (!rawDisplays) {
      fail('byte-equality', `selection "${sel.id}" (${sel.osisRef}): verse not found in an independent fresh read of wlc/${book}.xml`);
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
    report(`byte-equality: ${tokensChecked} token display strings across ${selections.length} selections match their wlc/<Book>.xml byte-for-byte (pass)`);
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
      result = importReaderCorpus();
    } catch (err) {
      fail('corpus-pin', `importReaderCorpus() failed: ${err.message}`);
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
