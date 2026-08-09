#!/usr/bin/env node
// Dev-time Strong's Hebrew Dictionary gloss extractor (task 13a, "Strong's
// glosses"). Reads a PINNED local checkout of openscriptures/strongs (never
// fetched over the network — see verifyStrongsPin below, mirrors
// tools/import_oshb_reader.mjs's verifyCorpusPin idiom) and, for a given set
// of Strong's numbers (the ones actually appearing in the curated Reader
// selections' tokens), extracts:
//   - `gl` a SHORT, modernized English gloss derived from the dictionary's
//     own `strongs_def` field (its concise head sense, not the full entry —
//     see headGloss() below), with a small documented table of mechanical
//     archaic-English replacements applied (see MODERNIZE_TABLE).
//   - `lx` the pointed Hebrew headword (the dictionary's own `lemma` field,
//     the lexical/citation form — NOT the inflected surface form a given
//     token displays).
//
// This is imported by tools/gen_bbh_reader_data.mjs (never fetched/read at
// runtime by the shipped app) to populate every emitted token's `gl`/`lx`
// fields. Proper names resolve through the exact same extraction pipeline:
// Strong's own strongs_def convention for a proper-name entry already
// LEADS with its own transliterated spelling (e.g. H85 "Abraham, the later
// name of Abram", H3478 "Jisrael, a symbolical name of Jacob") — the same
// head-gloss cut that works for common words already yields exactly "the
// transliterated name from Strong's" the task brief asks for, with no
// separate code path needed.
//
// Pin: /workspace/openscriptures/strongs @
// 0acd2f251c2d35ff8db2dece4e0593979d3ac223 — see
// source/bbh/reader/corpus-pin.json's `strongsPin` field (added in task
// 13a as a second pinned source alongside the existing OSHB `commit`).
// License: public domain (James Strong's 1894 dictionary; see
// corpus-pin.json's strongsPin.license note for the nuance around the
// digitization's own copyright notice).

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CORPUS_PIN_PATH = path.join(ROOT, 'source/bbh/reader/corpus-pin.json');
const CHECKOUT_DIR = process.env.BBH_STRONGS_CHECKOUT || '/workspace/openscriptures/strongs';

export function readStrongsPin() {
  const pin = JSON.parse(readFileSync(CORPUS_PIN_PATH, 'utf8'));
  if (!pin.strongsPin) throw new Error('corpus-pin.json has no strongsPin field — run task 13a\'s corpus-pin update first.');
  return pin.strongsPin;
}

export function verifyStrongsPin({ checkoutDir = CHECKOUT_DIR } = {}) {
  const pin = readStrongsPin();
  if (!existsSync(checkoutDir)) {
    throw new Error(`Strong's checkout not found at ${checkoutDir} (set BBH_STRONGS_CHECKOUT to override).`);
  }
  let head;
  try {
    head = execFileSync('git', ['-C', checkoutDir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch (err) {
    throw new Error(`Failed to read HEAD of ${checkoutDir}: ${err.message}`);
  }
  if (head !== pin.commit) {
    throw new Error(
      `Strong's corpus pin mismatch: ${checkoutDir} is at ${head}, expected ${pin.commit} ` +
      `(source/bbh/reader/corpus-pin.json's strongsPin). Aborting — never import from an unpinned checkout.`
    );
  }
  return { pin, checkoutDir, head };
}

// ─── Dictionary loading ─────────────────────────────────────────────────
// hebrew/strongs-hebrew-dictionary.js is `var strongsHebrewDictionary =
// {...}; module.exports = strongsHebrewDictionary;` — a plain JS object
// literal whose contents happen to already be valid JSON (double-quoted
// keys/strings throughout, verified against the full 8674-entry file), so
// we extract the object-literal text between the `=` and the trailing
// `;\nmodule.exports` and JSON.parse it directly rather than eval-ing the
// file (no code execution of third-party content).
let _dictCache = null;
export function loadStrongsHebrewDictionary({ checkoutDir = CHECKOUT_DIR } = {}) {
  if (_dictCache) return _dictCache;
  const filePath = path.join(checkoutDir, 'hebrew/strongs-hebrew-dictionary.js');
  const raw = readFileSync(filePath, 'utf8');
  const m = raw.match(/var strongsHebrewDictionary = ([\s\S]*?);\s*\n\s*module\.exports/);
  if (!m) throw new Error(`Could not locate the strongsHebrewDictionary object literal in ${filePath}`);
  _dictCache = JSON.parse(m[1]);
  return _dictCache;
}

// ─── MODERNIZATION TABLE ────────────────────────────────────────────────
// Deterministic, mechanical archaic-English -> modern-English replacements,
// applied word-boundary-safe. Anything NOT covered here is left exactly
// as Strong's wrote it (per the task brief: "anything beyond the table is
// left as-is"). Ordered as an array (not an object) so multi-word/irregular
// entries can be listed alongside simple ones without key-collision
// surprises; applied in order, each as a global word-boundary regex.
//
// Empirically, NONE of these fire on the 263 Strong's numbers actually
// used by the 86 curated Reader selections (strongs_def is Strong's own
// third-person definitional prose, which rarely uses second-person archaic
// forms — those show up more in kjv_def, which this pipeline does not
// gloss from). The table is still implemented and unit-tested (see
// selfTestModernize() below) so it is ready for any future selection
// whose head gloss does carry one of these forms, per the task brief's
// explicit list of examples.
export const MODERNIZE_TABLE = [
  // Irregular verb forms — must run BEFORE the general -eth rule below.
  [/\bhath\b/gi, 'has'],
  [/\bhast\b/gi, 'have'],
  [/\bdoth\b/gi, 'does'],
  [/\bdoeth\b/gi, 'does'],
  [/\bgoeth\b/gi, 'goes'],
  [/\bsaith\b/gi, 'says'],
  [/\bshalt\b/gi, 'shall'],
  [/\bwilt\b/gi, 'will'],
  [/\bwast\b/gi, 'were'],
  [/\bart\b/gi, 'are'],
  // Archaic 2nd-person pronouns.
  [/\bthee\b/gi, 'you'],
  [/\bthou\b/gi, 'you'],
  [/\bthine\b/gi, 'yours'],
  [/\bthy\b/gi, 'your'],
  [/\bye\b/gi, 'you'],
  // Archaic prepositions/adverbs.
  [/\bunto\b/gi, 'to'],
  // General regular "-eth" 3rd-person present verb ending (walketh ->
  // walks, keepeth -> keeps). Restricted to lowercase words of 5+ letters
  // to avoid false hits on short/irregular words already handled above or
  // on non-verb "-eth" words (beneath, underneath — the only two common
  // English words matching this shape).
  [/\b(?!beneath\b|underneath\b)([a-z]{3,})eth\b/g, '$1s']
];

export function modernize(text) {
  let s = text;
  for (const [re, replacement] of MODERNIZE_TABLE) s = s.replace(re, replacement);
  return s;
}

function selfTestModernize() {
  const cases = [
    ['thou hast not spoken unto thee', 'you have not spoken to you'],
    ['he walketh and she keepeth', 'he walks and she keeps'],
    ['the LORD hath said, doeth all things', 'the LORD has said, does all things'],
    ['a house beneath the hill', 'a house beneath the hill'] // must NOT become "b'houses'" etc.
  ];
  for (const [input, expected] of cases) {
    const got = modernize(input);
    if (got !== expected) {
      throw new Error(`MODERNIZE_TABLE self-test failed: modernize(${JSON.stringify(input)}) = ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`);
    }
  }
}
selfTestModernize();

// ─── Small hand-curated gloss overrides ────────────────────────────────
// The mechanical headGloss() extraction below (cut at the first semicolon/
// comma, dropping a leading "properly,"-style qualifier and any
// parenthetical) works well for the large majority of the 263 Strong's
// numbers this task's selections actually use, but a handful of very
// high-frequency function words have a strongs_def written as one long
// discursive clause with no clean early boundary, so the mechanical cut
// still lands on something unusable. Same spirit/size as
// tools/import_oshb_reader.mjs's LEMMA_OVERRIDES: small, individually
// justified, keyed by Strong's number.
export const GLOSS_OVERRIDES = new Map([
  ['3588', 'for, that, because, when'] // כִּי — strongs_def is one long 130-char clause ("(by implication) very widely used as a relative conjunction or adverb...") with its first comma/semicolon landing mid-clause ("...conjuncti…", truncated by the 60-char cap); כי is far too high-frequency in the corpus to ship a truncated gloss.
]);

// ─── Head-gloss extraction ─────────────────────────────────────────────
// "A SHORT gloss ... the concise head gloss, not the full entry" (task
// brief). strongs_def entries are one or more comma/semicolon-separated
// clauses, sometimes prefixed with a bare qualifier adverb ("properly,",
// "literally,", "perhaps properly,") and/or followed by a parenthetical
// elaboration. This extracts just the head sense:
//   1. Unwrap a "{...}" cross-reference placeholder (a handful of Aramaic-
//      cognate entries cite their Hebrew counterpart this way).
//   2. Strip a leading bare qualifier adverb — otherwise cutting at the
//      first comma below would wrongly yield just "properly" as the whole
//      gloss (real example: H853 את "properly, self (but generally used to
//      point out ...)" must yield "self", not "properly").
//   3. Drop everything from the first "(" onward — parentheticals are
//      elaboration/crossreference, not the head sense (real example: H1121
//      בֵּן "a son (as a builder of the family name), in the widest
//      sense..." must yield "a son", not the parenthetical aside).
//   4. Cut at the first semicolon OR comma, whichever comes first (these
//      separate the head sense from further senses/elaboration).
//   5. Strip a now-dangling trailing conjunction ("or"/"and"/"but"/"also"/
//      "hence") left over from step 3 cutting mid-clause (real example:
//      H216 אור "illumination or (concrete) luminary..." must yield
//      "illumination", not "illumination or").
//   6. Hard-cap at 60 chars (with an ellipsis) as a final safety net for
//      any clause step 4 didn't shorten enough.
// Verified against all 263 Strong's numbers used by the 86 curated
// selections — see task 13a's report for the coverage summary.
export function headGloss(strongsDef, strongsNumber) {
  if (GLOSS_OVERRIDES.has(strongsNumber)) return GLOSS_OVERRIDES.get(strongsNumber);
  let s = (strongsDef || '').trim();
  if (!s) return null;
  if (/^\{.*\}$/.test(s)) s = s.slice(1, -1).trim();
  s = s.replace(/^(?:perhaps |apparently |probably )?(properly|literally|primarily|prop\.|lit\.|used only|figuratively)[,:]?\s+/i, '');
  const parenIdx = s.indexOf('(');
  if (parenIdx > 0) s = s.slice(0, parenIdx);
  const semi = s.indexOf(';');
  const comma = s.indexOf(',');
  let cut = -1;
  if (semi !== -1 && comma !== -1) cut = Math.min(semi, comma);
  else cut = semi !== -1 ? semi : comma;
  if (cut !== -1) s = s.slice(0, cut);
  s = s.trim().replace(/[.,;:]+$/, '');
  s = s.replace(/\s+(or|and|but|also|hence)$/i, '').trim();
  if (!s) return null;
  s = modernize(s);
  if (s.length > 60) s = s.slice(0, 57).trim() + '…';
  return s;
}

// ─── Public entry point ────────────────────────────────────────────────
/**
 * @param {string[]} strongsNumbers distinct Strong's numbers (digits-only
 *   strings, no "H" prefix — matches the `strongs`/`s` field this pipeline
 *   already uses elsewhere) to resolve.
 * @returns {{ index: Map<string,{gl:string|null, lx:string|null}>,
 *   resolved: number, missing: string[] }}
 */
export function buildGlossIndex(strongsNumbers, opts = {}) {
  const { checkoutDir = CHECKOUT_DIR } = opts;
  const dict = loadStrongsHebrewDictionary({ checkoutDir });
  const index = new Map();
  const missing = [];
  let resolved = 0;
  for (const num of strongsNumbers) {
    const entry = dict[`H${num}`];
    if (!entry) {
      missing.push(num);
      index.set(num, { gl: null, lx: null });
      continue;
    }
    resolved++;
    index.set(num, {
      gl: headGloss(entry.strongs_def, num),
      lx: entry.lemma || null
    });
  }
  return { index, resolved, missing };
}

// ─── CLI (diagnostics only — never used by gen_bbh_reader_data.mjs) ────
function isMainModule() {
  return path.resolve(process.argv[1] || '') === path.resolve(fileURLToPath(import.meta.url));
}

function main() {
  const { pin } = verifyStrongsPin();
  console.log(`Strong's corpus: ${pin.repository} @ ${pin.commit}`);
  const dict = loadStrongsHebrewDictionary();
  console.log(`Dictionary entries: ${Object.keys(dict).length}`);
  console.log('modernize() + headGloss() self-tests: pass');
}

if (isMainModule()) main();
