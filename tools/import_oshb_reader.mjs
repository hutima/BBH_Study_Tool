#!/usr/bin/env node
// Dev-time OSHB importer for the BBH Reader (Phase 2 PR D). Node built-ins
// only. Reads a PINNED local checkout of openscriptures/morphhb (never
// fetched over the network — see verifyCorpusPin below) and:
//   - tokenizes wlc/Gen.xml (OSIS XML) verse by verse,
//   - maps each token's OSHB morphology to a BBH lesson gate via
//     source/bbh/reader/gate-map.json (data-driven; this file contains NO
//     duplicate copy of the mapping policy — see that file's `notes`),
//   - matches lexemes against the BBH vocab CSV to compute a `vocabLesson`,
//   - scores every verse (gateLesson / unmappedCount / unknownContentLexemes
//     / tokenCount) and assigns a tier (strict/guided/challenge/none).
//
// This module is BOTH a CLI (see `main()` at the bottom, gated on
// `isMainModule()`) and an ES-module library: tools/gen_bbh_reader_data.mjs
// and tools/validate_bbh_reader_data.mjs both `import { importGenesis }`
// from here to re-run the exact same scoring and check it reproduces
// source/bbh/reader/selections.json's recorded scores byte-for-byte-equal
// (JSON-equal), rather than trusting a cached snapshot.
//
// Determinism: no Date.now(), no Math.random(), no network I/O, no
// environment-dependent iteration order (every Map/array built here is in a
// fixed, source-derived order). Re-running produces byte-identical output
// for the same pinned commit + same source/bbh files.
//
// CLI usage:
//   node tools/import_oshb_reader.mjs --report   prints per-gate-bucket
//     candidate counts (strict/guided/challenge) and a top-candidates table,
//     plus vocab-match / override-table / coverage-gap diagnostics.
//   node tools/import_oshb_reader.mjs --emit      like --report, but also
//     prints the FULL scored corpus (every verse, every token) as JSON to
//     stdout (pipe to a file if you want it on disk — this tool never
//     writes into the repo itself; only tools/gen_bbh_reader_data.mjs does,
//     and only to js/data/bbh_reader.js).
//
// Corpus pin: /workspace/openscriptures/morphhb @
// 6a5db284c715c18b239422e57bb89684e6a19f00 (tag v.2.2) — see
// source/bbh/reader/corpus-pin.json. Override the checkout path with the
// BBH_OSHB_CHECKOUT env var if needed; the commit pin is NOT overridable
// here (edit corpus-pin.json, the single source of truth, instead).

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { stripHebrewPoints } from '../js/utils/hebrewText.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');

const CORPUS_PIN_PATH = path.join(ROOT, 'source/bbh/reader/corpus-pin.json');
const GATE_MAP_PATH = path.join(ROOT, 'source/bbh/reader/gate-map.json');
const VOCAB_CSV_PATH = path.join(ROOT, 'source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv');
const CHECKOUT_DIR = process.env.BBH_OSHB_CHECKOUT || '/workspace/openscriptures/morphhb';

// ─── 0. Corpus pin verification ────────────────────────────────────────────
// Aborts (throws) unless the checkout's HEAD matches corpus-pin.json exactly.
// This is the ONLY place this tool touches the checkout on disk besides
// reading wlc/Gen.xml — never fetches, never checks out a different ref.
export function readCorpusPin() {
  return JSON.parse(readFileSync(CORPUS_PIN_PATH, 'utf8'));
}

export function verifyCorpusPin({ checkoutDir = CHECKOUT_DIR } = {}) {
  const pin = readCorpusPin();
  if (!existsSync(checkoutDir)) {
    throw new Error(`OSHB checkout not found at ${checkoutDir} (set BBH_OSHB_CHECKOUT to override).`);
  }
  let head;
  try {
    head = execFileSync('git', ['-C', checkoutDir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch (err) {
    throw new Error(`Failed to read HEAD of ${checkoutDir}: ${err.message}`);
  }
  if (head !== pin.commit) {
    throw new Error(
      `Corpus pin mismatch: ${checkoutDir} is at ${head}, expected ${pin.commit} ` +
      `(source/bbh/reader/corpus-pin.json). Aborting — never import from an unpinned checkout.`
    );
  }
  return { pin, checkoutDir, head };
}

// ─── 1. OSIS XML tokenizer (Gen.xml only) ──────────────────────────────────
// Regex-based, not a general XML parser — Gen.xml's structure is narrow and
// fully verified ahead of time (see the investigation notes in the PR D
// report): <verse osisID="Gen.C.V"> directly contains zero or more <w>
// elements (display text captured byte-for-byte, no entity decoding — OSHB's
// Hebrew content never uses XML entities) plus <seg>/<note> siblings we
// ignore. <note>...</note> blocks are stripped BEFORE <w> extraction because
// a small number of verses embed a Kethiv/Qere apparatus
// (<note type="variant"><rdg><w>...qere...</w></rdg></note>) — the OUTER
// <w type="x-ketiv"> (a direct child of <verse>) is the token that enters
// our stream; the nested Qere alternative inside the note is intentionally
// NOT tokenized (documented simplification — see PR D report; none of Gen 1,
// 3, 22, 37, 38, 47, 50 contain a Kethiv/Qere pair, so this never affects the
// curated selections).
const VERSE_RE = /<verse osisID="(Gen\.\d+\.\d+)">([\s\S]*?)<\/verse>/g;
const NOTE_RE = /<note[\s\S]*?<\/note>/g;
const W_RE = /<w\b([^>]*)>([^<]*)<\/w>/g;
const ATTR_RE = /(\w[\w-]*)="([^"]*)"/g;

function parseAttrs(attrStr) {
  const attrs = {};
  let m;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(attrStr))) attrs[m[1]] = m[2];
  return attrs;
}

/**
 * @param {string} xmlText raw wlc/Gen.xml content (already read as utf8)
 * @returns {Array<{osisID:string, tokens:Array}>}
 */
export function parseGenesisXml(xmlText) {
  const verses = [];
  let vm;
  VERSE_RE.lastIndex = 0;
  while ((vm = VERSE_RE.exec(xmlText))) {
    const osisID = vm[1];
    const body = vm[2].replace(NOTE_RE, '');
    const tokens = [];
    let wm;
    W_RE.lastIndex = 0;
    while ((wm = W_RE.exec(body))) {
      const attrs = parseAttrs(wm[1]);
      tokens.push({
        id: attrs.id || null,
        type: attrs.type || null, // e.g. "x-ketiv"
        lemmaRaw: attrs.lemma || null,
        morphRaw: attrs.morph || null,
        display: wm[2] // EXACT byte-for-byte text from the XML, untouched
      });
    }
    verses.push({ osisID, tokens });
  }
  return verses;
}

export function osisRefToDisplay(osisID) {
  // "Gen.1.1" -> "Gen 1:1"
  const [book, chap, verse] = osisID.split('.');
  return `${book} ${chap}:${verse}`;
}

// ─── 2. Per-token segment splitting + lemma/morph/display alignment ───────
// A single <w> may bundle multiple morphemes (prefixed conjunction/
// preposition/article, the stem, and/or an attached suffix), each separated
// by "/" in `display` and `morph`. `lemma` only lists LEXICAL morphemes
// (prefixes b/c/d/l and the stem) — attached suffix segments (morph segments
// starting with "S") consume no lemma part at all, so lemma segments cannot
// be zipped index-for-index with morph segments; they must be aligned by
// skipping "S..." morph segments. (Verified against the full Gen.xml corpus:
// display segment count == morph segment count in all 20,612 non-Qere
// tokens; lemma segment count == count of non-"S" morph segments in all but
// 3 tokens — 2 unique compound-preposition lemma citations, e.g.
// lemma="b/2004" morph="HR/Sp3fp" citing the archaic pronoun the suffix
// historically fused from. Those 3 fall back gracefully below: extra/short
// lemma lists are truncated/padded with null rather than throwing.)
export function splitToken(token) {
  const morphNoLang = token.morphRaw && /^[HA]/.test(token.morphRaw)
    ? token.morphRaw.slice(1)
    : (token.morphRaw || '');
  const morphSegs = morphNoLang ? morphNoLang.split('/') : [];
  const dispSegs = token.display ? token.display.split('/') : [token.display];
  const lemmaSegsRaw = token.lemmaRaw ? token.lemmaRaw.split('/') : [];

  const lemmaSegs = new Array(morphSegs.length).fill(null);
  let li = 0;
  for (let i = 0; i < morphSegs.length; i++) {
    if (morphSegs[i].startsWith('S')) continue; // suffix segments carry no lemma
    if (li < lemmaSegsRaw.length) {
      lemmaSegs[i] = lemmaSegsRaw[li];
      li++;
    }
  }

  const segments = morphSegs.map((morph, i) => ({
    morph,
    display: dispSegs[i] !== undefined ? dispSegs[i] : null,
    lemma: lemmaSegs[i]
  }));
  return segments;
}

export function strongsOf(lemmaSeg) {
  if (!lemmaSeg) return null;
  const m = /^(\d+)/.exec(lemmaSeg.trim());
  return m ? m[1] : null;
}

// ─── 3. Vocab CSV indexing ─────────────────────────────────────────────────
// Minimal quoted-CSV reader: every field in this file is double-quoted and
// no field contains an embedded quote or newline (verified: exactly one
// occurrence of `""` in the whole file, and it is an EMPTY quoted field
// `""`, not an escaped inner quote) — a `"([^"]*)"` scan per line is exact.
function parseVocabCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
  const rows = [];
  for (let i = 1; i < lines.length; i++) { // skip header row
    const fields = [...lines[i].matchAll(/"([^"]*)"/g)].map((m) => m[1]);
    if (fields.length < 7) continue;
    const [lessonStr, lessonTitle, sourcePage, hebrew, translit, gloss, forms] = fields;
    const lesson = Number.parseInt(lessonStr, 10);
    if (!Number.isInteger(lesson)) continue;
    rows.push({ lesson, lessonTitle, sourcePage, hebrew, translit, gloss, forms });
  }
  return rows;
}

// A vocab CSV `hebrew` field may list alternates ("א / ב") and/or a
// parenthetical secondary form ("davar (devarim)" -> "דָּבָר (דְּבָרִים)").
// Every distinct headword surfaced by either splitting rule becomes its own
// lookup key, mapped to the LOWEST lesson number it's attested at (rows are
// in lesson order in the source CSV, but we take an explicit min rather than
// relying on that).
function headwordsFromField(hebrewField) {
  const out = [];
  for (const alt of hebrewField.split(' / ')) {
    const trimmed = alt.trim();
    const parenMatch = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(trimmed);
    if (parenMatch) {
      out.push(parenMatch[1].trim());
      out.push(parenMatch[2].trim());
    } else if (trimmed) {
      out.push(trimmed);
    }
  }
  return out;
}

/** @returns {Map<string, {lesson:number, headword:string}>} keyed by stripHebrewPoints(headword) */
export function buildVocabIndex(vocabRows) {
  const index = new Map();
  for (const row of vocabRows) {
    for (const headword of headwordsFromField(row.hebrew)) {
      const key = stripHebrewPoints(headword);
      if (!key) continue;
      const existing = index.get(key);
      if (!existing || row.lesson < existing.lesson) {
        index.set(key, { lesson: row.lesson, headword });
      }
    }
  }
  return index;
}

export function loadVocabRows() {
  return parseVocabCsv(readFileSync(VOCAB_CSV_PATH, 'utf8'));
}

// ─── 4. Manual lemma-override table ────────────────────────────────────────
// The direct depointed-display-vs-CSV-headword match (buildVocabIndex +
// vocabLookup below) only succeeds when a token's inflected surface form is
// IDENTICAL (modulo points) to the CSV's citation form — true for e.g. a
// Qal Perfect 3ms verb or an absolute-singular noun, false for most plurals,
// construct forms, and any non-3ms/3fs verb form. This table plugs the ~30
// highest-frequency Genesis content lemmas (by Strong's number) that fail
// the direct match but ARE taught vocabulary, so unknownContentLexemes
// doesn't over-report. Built from `--report`'s "unmatched lemma frequency"
// diagnostic, cross-checked by hand against the vocab CSV. Keyed by Strong's
// number (stable across all inflected forms, unlike display text).
// Every entry below was individually cross-checked against
// source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv (both a
// Hebrew-substring grep against the CSV's `hebrew` column and an
// English-gloss grep against `english_gloss`/`grammar_and_forms`, to catch
// cases where a verb's dictionary-citation vowel pattern — e.g. Piel
// דִּבֵּר vs. a wayyiqtol וַיְדַבֵּר — doesn't literally substring-match).
// `vocabLesson: null` entries are NOT gaps in this table; they are the
// documented, verified finding that the lemma is genuinely absent from the
// 191-card BBH vocab CSV (a curated subset of Genesis's actual vocabulary,
// not exhaustive), so `--report`'s unmatched-frequency list should stop
// flagging them as "not yet resolved" once they're listed here.
export const LEMMA_OVERRIDES = new Map([
  ['559', { vocabLesson: null, note: 'אמר "say" (Strong 559) — highest-frequency Genesis verb; verified NOT present in the BBH vocab CSV.' }],
  ['935', { vocabLesson: 26, note: 'בוא "come, enter" (Strong 935) — CSV L26 row בּוֹא "come, enter". Direct match only succeeds for the bare Qal infinitive/3ms-lookalike forms.' }],
  ['3205', { vocabLesson: null, note: 'ילד "bear/beget" (Strong 3205) — verified NOT present in the BBH vocab CSV.' }],
  ['251', { vocabLesson: 10, note: 'אָח "brother" (Strong 251) — CSV L10 row אָח (אַחִים); plural/construct/suffixed forms (אֲחִי, אֶחָיו, ...) don\'t depointed-match the absolute singular citation form.' }],
  ['6440', { vocabLesson: null, note: 'פָּנִים "face" (Strong 6440) — verified NOT present in the BBH vocab CSV.' }],
  ['3947', { vocabLesson: 16, note: 'לָקַח "take, receive" (Strong 3947) — CSV L16 row; only the bare Qal perfect 3ms citation form direct-matches.' }],
  ['5414', { vocabLesson: 17, note: 'נָתַן "give, place, set" (Strong 5414) — CSV L17 row; only the bare Qal perfect 3ms citation form direct-matches.' }],
  ['6213', { vocabLesson: 15, note: 'עָשָׂה "do, make" (Strong 6213) — CSV L15 row עָשָׂה (נַעֲשָׂה); only the bare Qal perfect 3ms citation form direct-matches.' }],
  ['7121', { vocabLesson: 16, note: 'קָרָא "call" (Strong 7121) — CSV L16 row; only the bare Qal perfect 3ms citation form direct-matches.' }],
  ['7200', { vocabLesson: null, note: 'ראה "see" (Strong 7200) — verified NOT present in the BBH vocab CSV.' }],
  ['3212', { vocabLesson: 16, note: 'ילך — OSHB\'s alternate/defective lemma citation used for many wayyiqtol/imperfect forms of הָלַךְ "walk, go" (Strong 1980, CSV L16); Hebrew lexicography treats 3212 and 1980 as the same lexeme (הלך suppletes with ילך in the imperfect stem), so this shares 1980\'s vocab lesson.' }],
  ['1980', { vocabLesson: 16, note: 'הָלַךְ "walk, go" (Strong 1980) — CSV L16 row; only the bare Qal perfect 3ms citation form direct-matches (see also 3212, the imperfect-stem alternate lemma).' }],
  ['4191', { vocabLesson: 30, note: 'מוּת "die" (Strong 4191) — CSV L30 row; only the bare Qal citation form direct-matches.' }],
  ['5869', { vocabLesson: 10, note: 'עַיִן "eye" (Strong 5869) — CSV lists it twice: L10 עַיִן (עֵינַיִם) dual, and L40 עַיִן, עֵין bound-form pair; construct/suffixed forms don\'t depointed-match either citation row, so this maps to the lower (L10) lesson per the "earliest attested" rule.' }],
  ['8034', { vocabLesson: 6, note: 'שֵׁם "name" (Strong 8034) — CSV L6 row שֵׁם (שֵׁמוֹת); construct/suffixed forms (שֵׁם־, שְׁמוֹ, ...) don\'t depointed-match the absolute singular.' }],
  ['1288', { vocabLesson: 29, note: 'בֵּרַךְ/בֵּרֵךְ "bless" (Strong 1288, Piel) — CSV L29 row; only the bare Piel perfect 3ms citation form direct-matches.' }],
  ['2416', { vocabLesson: null, note: 'חַי "living, life" (Strong 2416) — verified NOT present in the BBH vocab CSV (distinct from Strong 5315 נֶפֶשׁ "life, self", which IS L34 vocab and direct-matches its own absolute form already).' }],
  ['3967', { vocabLesson: null, note: 'מֵאָה "hundred" (Strong 3967) — verified NOT present in the BBH vocab CSV.' }],
  ['6629', { vocabLesson: null, note: 'צֹאן "flock" (Strong 6629) — verified NOT present in the BBH vocab CSV.' }],
  ['7651', { vocabLesson: null, note: 'שֶׁבַע "seven" (Strong 7651, numeral) — verified NOT present in the BBH vocab CSV; grammar-gated separately via gate-map\'s numeral override (L45).' }],
  ['7725', { vocabLesson: null, note: 'שׁוּב "return" (Strong 7725) — verified NOT present in the BBH vocab CSV (an earlier draft of this table wrongly matched it to L21\'s unrelated שָׁבַת "rest", Strong 7673 — a false substring hit on the shared שׁב consonants; corrected here after review).' }],
  ['2421', { vocabLesson: null, note: 'חָיָה "live" (Strong 2421) — verified NOT present in the BBH vocab CSV.' }],
  ['113', { vocabLesson: 3, note: 'אָדוֹן "lord, master" (Strong 113) — CSV L3 row אָדוֹן / אֲדֹנָי; construct/suffixed forms (אֲדֹנִי, אֲדֹנָיו, ...) don\'t all depointed-match.' }],
  ['3117', { vocabLesson: 21, note: 'יוֹם "day" (Strong 3117) — CSV L21 row (plural יָמִים noted in grammar_and_forms); plural/construct forms don\'t depointed-match the singular citation.' }],
  ['7971', { vocabLesson: 15, note: 'שָׁלַח "send" (Strong 7971) — CSV L15 row שָׁלַח (נִשְׁלַח); only the bare Qal perfect 3ms citation form direct-matches.' }],
  ['6965', { vocabLesson: null, note: 'קוּם "arise, stand up" (Strong 6965) — verified NOT present in the BBH vocab CSV (distinct from Strong 5975 עָמַד "stand", which IS L19 vocab and direct-matches its own form already).' }],
  ['8147', { vocabLesson: 31, note: 'שְׁנַיִם "two" (Strong 8147, numeral) — CSV L31 row שְׁנַיִם (F שְׁתַּיִם); construct שְׁנֵי and the feminine form don\'t depointed-match the masculine absolute citation. Also grammar-gated via gate-map\'s numeral override (L45).' }],
  ['7704', { vocabLesson: null, note: 'שָׂדֶה "field" (Strong 7704) — verified NOT present in the BBH vocab CSV.' }],
  ['259', { vocabLesson: null, note: 'אֶחָד "one" (Strong 259, numeral) — verified NOT present in the BBH vocab CSV; grammar-gated separately via gate-map\'s numeral override (L45).' }],
  ['3318', { vocabLesson: 22, note: 'יָצָא "go forth" (Strong 3318) — CSV L22 row; only the bare Qal perfect 3ms citation form direct-matches.' }],
  ['120', { vocabLesson: null, note: 'אָדָם "man, mankind" (Strong 120, common-noun sense) — verified NOT present in the BBH vocab CSV as a common noun (only ever tagged Np "Adam" in this corpus\'s proper-name instances, which the Np gate-map rule already covers at grammar-gate L5 and excludes from unknown-content-lexeme counts).' }],
  ['1323', { vocabLesson: 7, note: 'בַּת "daughter" (Strong 1323) — CSV L7 row בַּת (בָּנוֹת); construct/suffixed/plural forms don\'t depointed-match the absolute singular.' }],
  ['398', { vocabLesson: 18, note: 'אָכַל "eat" (Strong 398) — CSV L18 row; only the bare Qal perfect 3ms citation form direct-matches.' }],
  ['5375', { vocabLesson: 32, note: 'נָשָׂא "lift up, carry" (Strong 5375) — CSV L32 row; only the bare Qal perfect 3ms citation form direct-matches.' }],
  ['1696', { vocabLesson: 15, note: 'דִּבֶּר "speak" (Strong 1696, Piel) — CSV L15 row דִּבֵּר; distinct lexeme from Strong 1697 דָּבָר "word, thing" (CSV L5) despite the shared consonantal root — only the bare Piel perfect 3ms citation form direct-matches.' }],
  ['4672', { vocabLesson: 22, note: 'מָצָא "find" (Strong 4672) — CSV L22 row; only the bare Qal perfect 3ms citation form direct-matches.' }],
  ['1', { vocabLesson: 7, note: 'אָב "father" (Strong 1) — CSV L7 row; construct/suffixed forms (אֲבִי, אָבִיו, ...) don\'t depointed-match אָב.' }],
  ['376', { vocabLesson: 6, note: 'אִישׁ "man" (Strong 376) — CSV L6 row; construct/suffixed forms don\'t all depointed-match.' }],
  ['802', { vocabLesson: 6, note: 'אִשָּׁה "woman, wife" (Strong 802) — CSV L6 row; construct אֵשֶׁת and suffixed forms don\'t depointed-match אִשָּׁה.' }],
  ['1121', { vocabLesson: 7, note: 'בֵּן "son" (Strong 1121) — CSV L7 row בֵּן (בָּנִים); construct/plural/suffixed forms (בֶּן־, בְּנֵי, בְּנוֹ, ...) don\'t depointed-match the absolute singular citation form.' }],
  ['1961', { vocabLesson: 6, note: 'הָיָה "be, become" (Strong 1961) — CSV L6 lists both הָיָה (3ms) and הָיְתָה (3fs) as separate rows; every other PGN form (הָיוּ, אֶהְיֶה, יִהְיֶה, ...) fails to depointed-match either citation row.' }],
  ['5750', { vocabLesson: null, note: 'עוֹד "still, yet, again" (Strong 5750, adverb D) — verified NOT present in the BBH vocab CSV; grammar gate resolves via the vocabLinked D-rule to unmapped.' }]
]);

/**
 * @returns {{lesson:number, via:'direct'|'override'}|null}
 */
export function vocabLookup(displaySeg, lemmaSeg, vocabIndex) {
  if (displaySeg) {
    const key = stripHebrewPoints(displaySeg);
    const direct = vocabIndex.get(key);
    if (direct) return { lesson: direct.lesson, via: 'direct' };
  }
  const strongs = strongsOf(lemmaSeg);
  if (strongs && LEMMA_OVERRIDES.has(strongs)) {
    const entry = LEMMA_OVERRIDES.get(strongs);
    if (entry.vocabLesson != null) return { lesson: entry.vocabLesson, via: 'override' };
  }
  return null;
}

// ─── 5. Gate-map compilation + application ────────────────────────────────
export function loadGateMap() {
  return JSON.parse(readFileSync(GATE_MAP_PATH, 'utf8'));
}

export function compileGateMap(gateMapDoc) {
  return gateMapDoc.mappings.map((entry) => ({
    ...entry,
    window: entry.window || 1,
    priority: entry.priority || 0,
    regex: new RegExp(`^(?:${entry.morphPattern})$`)
  }));
}

function pickBestEntry(candidates) {
  if (candidates.length === 0) return null;
  let best = candidates[0];
  for (const c of candidates.slice(1)) {
    if (c.priority > best.priority) { best = c; continue; }
    if (c.priority === best.priority) {
      // Tie-break: prefer a mapped (non-unmapped) match, then higher lesson.
      const bestUnmapped = !!best.unmapped;
      const cUnmapped = !!c.unmapped;
      if (bestUnmapped && !cUnmapped) { best = c; continue; }
      if (!bestUnmapped && !cUnmapped && (c.bbhLesson || 0) > (best.bbhLesson || 0)) best = c;
    }
  }
  return best;
}

function resolveEntry(entry, segment, vocabIndex) {
  if (!entry) return { kind: 'gap', lesson: null };
  if (entry.vocabLinked) {
    const match = vocabLookup(segment.display, segment.lemma, vocabIndex);
    return match
      ? { kind: 'mapped', lesson: entry.bbhLesson, entry, vocabMatch: match }
      : { kind: 'unmapped', lesson: null, entry };
  }
  if (entry.unmapped) return { kind: 'unmapped', lesson: null, entry };
  if (entry.neutral) return { kind: 'neutral', lesson: null, entry };
  return { kind: 'mapped', lesson: entry.bbhLesson, entry };
}

/**
 * Classifies one token's segments against the compiled gate-map. Returns
 * per-segment contributions (window-1) and any window-2 (suffix-host)
 * contributions, plus the token-level aggregate.
 */
export function classifyToken(token, segments, compiledGateMap, vocabIndex) {
  const contributions = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const w1Candidates = compiledGateMap.filter(
      (e) => e.window === 1 && e.regex.test(seg.morph) &&
        (!e.lemmaStrongs || e.lemmaStrongs.includes(strongsOf(seg.lemma)))
    );
    const best1 = pickBestEntry(w1Candidates);
    const resolved1 = resolveEntry(best1, seg, vocabIndex);
    contributions.push({ segmentIndex: i, window: 1, ...resolved1 });

    if (i + 1 < segments.length) {
      const windowStr = `${seg.morph}/${segments[i + 1].morph}`;
      const w2Candidates = compiledGateMap.filter((e) => e.window === 2 && e.regex.test(windowStr));
      const best2 = pickBestEntry(w2Candidates);
      if (best2) {
        const resolved2 = resolveEntry(best2, seg, vocabIndex);
        contributions.push({ segmentIndex: i, window: 2, ...resolved2 });
      }
    }
  }

  const isProperName = contributions.some((c) => c.entry && c.entry.isProperName);
  const unmapped = contributions.some((c) => c.kind === 'unmapped' || c.kind === 'gap');
  const mappedLessons = contributions.filter((c) => c.kind === 'mapped').map((c) => c.lesson);
  const tokenLesson = mappedLessons.length ? Math.max(...mappedLessons) : null;

  // Content-word (N/V/A, non-proper) vocab match, for unknownContentLexemes.
  let vocabLesson = null;
  let strongs = null;
  let hasContentSegment = false;
  for (let i = 0; i < segments.length; i++) {
    const pos = segments[i].morph[0];
    const isProperSeg = /^Np/.test(segments[i].morph);
    if ((pos === 'N' && !isProperSeg) || pos === 'V' || pos === 'A') {
      hasContentSegment = true;
      const match = vocabLookup(segments[i].display, segments[i].lemma, vocabIndex);
      if (match && (vocabLesson == null || match.lesson < vocabLesson)) vocabLesson = match.lesson;
      if (!strongs) strongs = strongsOf(segments[i].lemma);
    }
  }
  if (!strongs) {
    // fall back to the first segment carrying a Strong's number, for
    // provenance (proper names, particles matched to vocab, etc.)
    for (const seg of segments) {
      const s = strongsOf(seg.lemma);
      if (s) { strongs = s; break; }
    }
  }

  return {
    contributions,
    isProperName,
    unmapped,
    tokenLesson,
    hasContentSegment,
    vocabLesson,
    strongs
  };
}

// ─── 6. Verse scoring + tiering ────────────────────────────────────────────
export function scoreVerse(classifiedTokens) {
  const tokenCount = classifiedTokens.length;
  const unmappedCount = classifiedTokens.filter((t) => t.unmapped).length;
  const unknownContentLexemes = classifiedTokens.filter(
    (t) => t.hasContentSegment && !t.isProperName && t.vocabLesson == null
  ).length;
  const lessons = classifiedTokens.map((t) => t.tokenLesson).filter((l) => l != null);
  const maxGrammarLesson = lessons.length ? Math.max(...lessons) : 0;

  let tier = null;
  let effectiveGateLesson = maxGrammarLesson;
  const allMapped = unmappedCount === 0;
  if (allMapped && unknownContentLexemes <= 1) {
    tier = 'strict';
  } else if (allMapped && unknownContentLexemes <= 3) {
    tier = 'guided';
  } else if (allMapped) {
    const atMax = classifiedTokens.filter((t) => t.tokenLesson === maxGrammarLesson);
    const below = lessons.filter((l) => l < maxGrammarLesson);
    if (atMax.length === 1 && lessons.length > atMax.length && unknownContentLexemes <= 3) {
      tier = 'challenge';
      effectiveGateLesson = below.length ? Math.max(...below) : maxGrammarLesson;
    }
  }

  return {
    tokenCount,
    unmappedCount,
    unknownContentLexemes,
    maxGrammarLesson,
    gateLesson: maxGrammarLesson,
    effectiveGateLesson,
    tier
  };
}

// ─── 7. Top-level import ───────────────────────────────────────────────────
export function importGenesis({ checkoutDir = CHECKOUT_DIR, verifyPin = true } = {}) {
  let pinInfo = null;
  if (verifyPin) pinInfo = verifyCorpusPin({ checkoutDir });
  else pinInfo = { pin: readCorpusPin(), checkoutDir };

  const genXmlPath = path.join(checkoutDir, 'wlc/Gen.xml');
  const xmlText = readFileSync(genXmlPath, 'utf8');
  const rawVerses = parseGenesisXml(xmlText);

  const vocabRows = loadVocabRows();
  const vocabIndex = buildVocabIndex(vocabRows);
  const gateMapDoc = loadGateMap();
  const compiledGateMap = compileGateMap(gateMapDoc);

  const verses = rawVerses.map((v) => {
    const classifiedTokens = v.tokens.map((token) => {
      const segments = splitToken(token);
      const classified = classifyToken(token, segments, compiledGateMap, vocabIndex);
      return { token, segments, ...classified };
    });
    const scores = scoreVerse(classifiedTokens);
    return {
      osisID: v.osisID,
      ref: osisRefToDisplay(v.osisID),
      tokens: classifiedTokens,
      scores
    };
  });

  return { pin: pinInfo.pin, checkoutDir: pinInfo.checkoutDir, verses, vocabIndexSize: vocabIndex.size };
}

// ─── 8. CLI ─────────────────────────────────────────────────────────────────
function bucketOf(lesson) {
  const buckets = [
    [9, 14], [15, 19], [20, 22], [23, 27], [28, 31],
    [32, 34], [35, 38], [39, 41], [42, 44], [45, 50]
  ];
  for (const [lo, hi] of buckets) if (lesson >= lo && lesson <= hi) return `${lo}-${hi}`;
  if (lesson < 9) return '<9';
  return '50+';
}

function printReport(result) {
  const { verses, vocabIndexSize, pin } = result;
  console.log(`Corpus: ${pin.repository} @ ${pin.commit} (tag ${pin.tag})`);
  console.log(`Vocab index: ${vocabIndexSize} distinct headword keys from the BBH vocab CSV.`);
  console.log(`Genesis: ${verses.length} verses, ${verses.reduce((n, v) => n + v.tokens.length, 0)} tokens.\n`);

  const tierCounts = { strict: 0, guided: 0, challenge: 0, none: 0 };
  const byBucket = new Map();
  let coverageGaps = 0;
  const gapExamples = [];
  const unmatchedLemmaFreq = new Map();

  for (const v of verses) {
    const t = v.scores.tier || 'none';
    tierCounts[t]++;
    if (t !== 'none') {
      const bucket = bucketOf(v.scores.effectiveGateLesson);
      if (!byBucket.has(bucket)) byBucket.set(bucket, { strict: [], guided: [], challenge: [] });
      byBucket.get(bucket)[t].push(v);
    }
    for (const tok of v.tokens) {
      for (const c of tok.contributions) {
        if (c.kind === 'gap') {
          coverageGaps++;
          if (gapExamples.length < 15) gapExamples.push(`${v.ref} morph="${tok.segments[c.segmentIndex].morph}"`);
        }
      }
      if (tok.hasContentSegment && !tok.isProperName && tok.vocabLesson == null && tok.strongs) {
        unmatchedLemmaFreq.set(tok.strongs, (unmatchedLemmaFreq.get(tok.strongs) || 0) + 1);
      }
    }
  }

  console.log('Tier totals (whole Genesis):', tierCounts);
  console.log(`Coverage gaps (window-1 segment matched by NO gate-map entry, incl. safety-net catch-alls): ${coverageGaps}`);
  if (gapExamples.length) console.log('  examples:', gapExamples.join(' | '));

  console.log('\nPer-bucket candidate counts (bucketed by effective gate lesson):');
  const bucketOrder = ['<9', '9-14', '15-19', '20-22', '23-27', '28-31', '32-34', '35-38', '39-41', '42-44', '45-50', '50+'];
  for (const b of bucketOrder) {
    const entry = byBucket.get(b);
    if (!entry) continue;
    console.log(`  ${b}: strict=${entry.strict.length} guided=${entry.guided.length} challenge=${entry.challenge.length}`);
  }

  console.log('\nTop unmatched content-lexeme Strong\'s numbers (frequency, not yet in LEMMA_OVERRIDES with a resolving lesson):');
  const top = [...unmatchedLemmaFreq.entries()]
    .filter(([strongs]) => {
      const o = LEMMA_OVERRIDES.get(strongs);
      return !o || o.vocabLesson == null;
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, 35);
  for (const [strongs, freq] of top) console.log(`  Strong ${strongs}: ${freq}x`);

  return { tierCounts, byBucket, coverageGaps };
}

function isMainModule() {
  return path.resolve(process.argv[1] || '') === path.resolve(fileURLToPath(import.meta.url));
}

function main() {
  const args = process.argv.slice(2);
  const doReport = args.includes('--report');
  const doEmit = args.includes('--emit');
  if (!doReport && !doEmit) {
    console.log('Usage: node tools/import_oshb_reader.mjs --report | --emit');
    process.exitCode = 1;
    return;
  }
  const result = importGenesis();
  printReport(result);
  if (doEmit) {
    console.log('\n--- FULL SCORED CORPUS (JSON) ---');
    console.log(JSON.stringify(result.verses.map((v) => ({
      osisID: v.osisID,
      ref: v.ref,
      scores: v.scores,
      tokens: v.tokens.map((t) => ({
        display: t.token.display,
        lemma: t.token.lemmaRaw,
        morph: t.token.morphRaw,
        gate: t.tokenLesson,
        unmapped: t.unmapped,
        isProperName: t.isProperName,
        vocabLesson: t.vocabLesson,
        strongs: t.strongs
      }))
    })), null, 2));
  }
}

if (isMainModule()) main();
