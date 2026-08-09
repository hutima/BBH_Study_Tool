#!/usr/bin/env node
// Dev-time OSHB importer for the BBH Reader (Phase 2 PR D; multi-book
// expansion added in the "Reader book expansion" task). Node built-ins
// only. Reads a PINNED local checkout of openscriptures/morphhb (never
// fetched over the network — see verifyCorpusPin below) and, for every book
// in BOOK_LIST below:
//   - tokenizes wlc/<Book>.xml (OSIS XML) verse by verse,
//   - maps each token's OSHB morphology to a BBH lesson gate via
//     source/bbh/reader/gate-map.json (data-driven; this file contains NO
//     duplicate copy of the mapping policy — see that file's `notes`),
//   - matches lexemes against the BBH vocab CSV to compute a `vocabLesson`,
//   - scores every verse (gateLesson / unmappedCount / unknownContentLexemes
//     / tokenCount) and assigns a tier (strict/guided/challenge/none).
//
// This module is BOTH a CLI (see `main()` at the bottom, gated on
// `isMainModule()`) and an ES-module library: tools/gen_bbh_reader_data.mjs
// and tools/validate_bbh_reader_data.mjs both `import { importReaderCorpus }`
// from here to re-run the exact same scoring and check it reproduces
// source/bbh/reader/selections.json's recorded scores byte-for-byte-equal
// (JSON-equal), rather than trusting a cached snapshot.
//
// BOOK_LIST is the configurable set of OSHB wlc/*.xml basenames imported —
// currently ['Gen','Ruth','Jonah','Exod','Deut','Judg','1Sam','2Sam',
// 'Josh','1Kgs','2Kgs','Esth','Ps'] (verified exact filenames against the
// pinned checkout's wlc/ directory). The 5 trailing entries were added by
// task #24 stage A (importer/coverage groundwork only — no new selections
// curated yet; see docs/bbh-conversion-plan.md's task-24 staging addendum).
// Their codes match the canonical codes/slugs task #23's
// tools/gen_bbh_advanced_vocab.mjs BOOK_META already uses for the same
// books (josh, 1kgs, 2kgs, esth, ps) — this module has no separate slug
// table of its own (osisRefToDisplay derives display refs straight from
// osisID, never a hand-authored per-book name lookup), so no such table
// needed updating.
// Every verse carries its own `book` (OSIS book code) alongside `osisID`/
// `ref` so downstream consumers (selections curation, Reader UI grouping)
// can group multi-book output without re-parsing osisID.
//
// Determinism: no Date.now(), no Math.random(), no network I/O, no
// environment-dependent iteration order (every Map/array built here is in a
// fixed, source-derived order — books are processed in BOOK_LIST's own
// order, never Object-key or filesystem order). Re-running produces
// byte-identical output for the same pinned commit + same source/bbh files.
//
// CLI usage:
//   node tools/import_oshb_reader.mjs --report   prints per-gate-bucket
//     candidate counts (strict/guided/challenge) and a top-candidates table,
//     plus vocab-match / override-table / coverage-gap diagnostics, across
//     every book in BOOK_LIST (or scope with --book=Ruth to one book).
//   node tools/import_oshb_reader.mjs --emit      like --report, but also
//     prints the FULL scored corpus (every verse, every token) as JSON to
//     stdout (pipe to a file if you want it on disk — this tool never
//     writes into the repo itself; only tools/gen_bbh_reader_data.mjs does,
//     and only to js/data/bbh_reader.js).
//   --book=Gen|Ruth|Jonah|Exod|Deut|Judg|1Sam|2Sam|Josh|1Kgs|2Kgs|Esth|Ps
//     scope --report/--emit to a single book (for per-book coverage/
//     vocab-match audits).
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

// wlc/*.xml basenames (OSIS book codes), imported in this fixed order.
// Verified against the pinned checkout's wlc/ directory listing (all 8
// present, exact case/spelling). Genesis first (Phase 2 PR D's original
// scope, and the 52 pre-existing curated selections all live there), then
// the "Reader book expansion" task's additions.
export const BOOK_LIST = [
  'Gen', 'Ruth', 'Jonah', 'Exod', 'Deut', 'Judg', '1Sam', '2Sam',
  // task #24 stage A additions (importer capability only — see the header
  // comment above and docs/bbh-conversion-plan.md's task-24 staging
  // addendum; no selections curated from these yet):
  'Josh', '1Kgs', '2Kgs', 'Esth', 'Ps'
];

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

// ─── 1. OSIS XML tokenizer (any single wlc/<Book>.xml file) ───────────────
// Regex-based, not a general XML parser — every wlc/<Book>.xml file in OSHB
// shares Gen.xml's narrow structure (verified for all 8 BOOK_LIST files
// ahead of time, same investigation approach as the original PR D report):
// <verse osisID="<Book>.C.V"> directly contains zero or more <w> elements
// (display text captured byte-for-byte, no entity decoding — OSHB's Hebrew
// content never uses XML entities) plus <seg>/<note> siblings we ignore.
// <note>...</note> blocks are stripped BEFORE <w> extraction because a small
// number of verses embed a Kethiv/Qere apparatus
// (<note type="variant"><rdg><w>...qere...</w></rdg></note>) — the OUTER
// <w type="x-ketiv"> (a direct child of <verse>) is the token that enters
// our stream; the nested Qere alternative inside the note is intentionally
// NOT tokenized (documented simplification — see PR D report). The book
// code in the regex below is a parameter (any run of letters/digits, e.g.
// "Gen", "1Sam") rather than hardcoded "Gen", so this same tokenizer serves
// every BOOK_LIST entry.
//
// LARGE-LETTER TOKENIZER FIX (task 13a, found while authoring wooden
// translations): OSHB marks a handful of traditionally-enlarged Masoretic
// letters with a NESTED <seg type="x-large">...</seg> INSIDE the <w>
// element itself (verified: exactly 2 occurrences across all 8 BOOK_LIST
// books, both in Deut.6.4 — the Shema's שְׁמַע and אֶחָד). The original
// W_RE (`<w\b([^>]*)>([^<]*)<\/w>`) requires the <w> body to contain no
// `<` at all, so it silently fails to match either of those two <w>
// elements — not an error, just two tokens vanishing from the stream,
// which is worse: Deut.6.4 (already a curated selection,
// reader-deut-6-4) was silently missing its own "Hear" and "one" (the
// verse's first and last words) from both scoring and the emitted Reader
// passage. W_RE below now also accepts an interleaving of plain text and
// <seg ...>text</seg> runs inside a <w>; the nested <seg> wrapper is then
// stripped (keeping its inner text) when building `display`, so the
// reconstructed text is byte-identical to the un-marked-up word. No other
// nested-tag shape has been observed inside a <w> in any of the 8 books
// (this <seg type="x-large"> case is the only one), so this fix is
// intentionally narrow rather than a general XML-nesting parser.
const NOTE_RE = /<note[\s\S]*?<\/note>/g;
const W_RE = /<w\b([^>]*)>((?:[^<]|<seg\b[^>]*>[^<]*<\/seg>)*)<\/w>/g;
const NESTED_SEG_RE = /<seg\b[^>]*>([^<]*)<\/seg>/g;
const ATTR_RE = /(\w[\w-]*)="([^"]*)"/g;

function verseRegexFor(bookCode) {
  const escaped = bookCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`<verse osisID="(${escaped}\\.\\d+\\.\\d+)">([\\s\\S]*?)<\\/verse>`, 'g');
}

function parseAttrs(attrStr) {
  const attrs = {};
  let m;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(attrStr))) attrs[m[1]] = m[2];
  return attrs;
}

/**
 * @param {string} xmlText raw wlc/<Book>.xml content (already read as utf8)
 * @param {string} bookCode OSIS book code this file belongs to (e.g. "Gen",
 *   "1Sam") — used only to anchor the <verse osisID> regex to this book, so
 *   a stray cross-reference in another book's <note> (already stripped
 *   above) can never leak a verse in.
 * @returns {Array<{osisID:string, book:string, tokens:Array}>}
 */
export function parseBookXml(xmlText, bookCode) {
  const verses = [];
  const verseRe = verseRegexFor(bookCode);
  let vm;
  while ((vm = verseRe.exec(xmlText))) {
    const osisID = vm[1];
    const body = vm[2].replace(NOTE_RE, '');
    const tokens = [];
    let wm;
    W_RE.lastIndex = 0;
    while ((wm = W_RE.exec(body))) {
      const attrs = parseAttrs(wm[1]);
      // Flatten any nested <seg type="x-large">letter</seg> markup (see the
      // header comment above) back to plain text — the result is
      // byte-identical to the word's text with the large-letter markup
      // simply not present, i.e. exactly what tools/validate_bbh_reader_
      // data.mjs's OWN independent extractRawTokenDisplays() (fixed the
      // same way) produces, so the byte-equality check still means what it
      // says. A <w> with no nested <seg> is untouched (replace is a no-op).
      const display = wm[2].indexOf('<seg') === -1 ? wm[2] : wm[2].replace(NESTED_SEG_RE, '$1');
      tokens.push({
        id: attrs.id || null,
        type: attrs.type || null, // e.g. "x-ketiv"
        lemmaRaw: attrs.lemma || null,
        morphRaw: attrs.morph || null,
        display // EXACT byte-for-byte text from the XML (nested <seg> markup flattened, see above)
      });
    }
    verses.push({ osisID, book: bookCode, tokens });
  }
  return verses;
}

// Back-compat alias — Genesis-only callers (none remain in this repo, but
// keeping the name avoids a silent breakage if something outside the repo's
// own tools/ still imports it).
export function parseGenesisXml(xmlText) {
  return parseBookXml(xmlText, 'Gen');
}

export function osisRefToDisplay(osisID) {
  // "Gen.1.1" -> "Gen 1:1"; "1Sam.1.1" -> "1Sam 1:1"
  const parts = osisID.split('.');
  const verse = parts.pop();
  const chap = parts.pop();
  const book = parts.join('.');
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
  ['5750', { vocabLesson: null, note: 'עוֹד "still, yet, again" (Strong 5750, adverb D) — verified NOT present in the BBH vocab CSV; grammar gate resolves via the vocabLinked D-rule to unmapped.' }],

  // ─── Added for the "Reader book expansion" task (Ruth/Jonah/Exod/Deut/
  // Judg/1Sam/2Sam) — audited from --report's combined top-60 unresolved
  // Strong's numbers across all 8 books (the per-book top-40 lists overlap
  // heavily on these, since Strong's overrides are global; see that CLI
  // report's "PER BOOK" section for the individual per-book frequencies).
  // Same verification method as the table above: Hebrew-substring / English-
  // gloss grep against the vocab CSV, cross-checked by hand.
  // The freeze below was LIFTED in task 13a ("matcher fixes... re-score the
  // whole corpus... the freeze on Genesis scores is LIFTED for this pass").
  // All three deliberately-withheld entries are now added. This DOES
  // change the recorded scores of 5 pre-existing Genesis selections
  // (430/776: reader-gen-1-1, reader-gen-24-4, reader-gen-10-20; 6680:
  // reader-gen-50-12, reader-gen-7-5) — see task 13a's report for the
  // full tier-change table; source/bbh/reader/selections.json's `scores`/
  // `tier`/`gateLesson` for those 5 entries (and any others affected by
  // the gentilic/compound-token fixes above) were re-derived from a fresh
  // importReaderCorpus() run and are no longer required to stay byte-for-
  // byte identical to the pre-13a values.
  ['430', { vocabLesson: 3, note: 'אֱלֹהִים "God, gods" (Strong 430) — CSV L3 row; morphologically-plural noun whose construct/suffixed forms (אֱלֹהֵי, אֱלֹהָיו, ...) don\'t depointed-match the absolute citation form. Previously withheld (see task 13a) to avoid drifting 5 pre-existing Genesis selection scores; that freeze is now lifted.' }],
  ['776', { vocabLesson: 9, note: 'אֶרֶץ "land, earth" (Strong 776) — CSV L9 row אֶרֶץ (אֲרָצוֹת); construct אֶרֶץ־/plural/suffixed forms don\'t depointed-match the absolute singular citation. Previously withheld (see task 13a); freeze now lifted.' }],
  ['6680', { vocabLesson: 35, note: 'צִוָּה "command" (Strong 6680, Piel) — CSV L35 row; only the bare Piel perfect 3ms citation form direct-matches (most attestations are wayyiqtol/imperfect/infinitive forms). Previously withheld (see task 13a); freeze now lifted.' }],
  ['8085', { vocabLesson: 16, note: 'שָׁמַע "hear, listen" (Strong 8085) — CSV L16 row; only the bare Qal perfect 3ms citation form direct-matches.' }],
  ['3045', { vocabLesson: 19, note: 'יָדַע "know" (Strong 3045) — CSV L19 row; only the bare Qal citation form direct-matches (most attestations across the expansion books are imperfect/infinitive/participle forms).' }],
  ['3427', { vocabLesson: 16, note: 'יָשַׁב "sit, inhabit, dwell" (Strong 3427) — CSV L16 row; only the bare Qal perfect 3ms citation form direct-matches.' }],
  ['5971', { vocabLesson: 15, note: 'עַם "people" (Strong 5971) — CSV L15 row עַם (עַמִּים); construct עַם־/plural/suffixed forms don\'t depointed-match the absolute singular.' }],
  ['3027', { vocabLesson: 10, note: 'יָד "hand" (Strong 3027) — CSV L10 row יָד (יָדַיִם); construct יַד־/dual/suffixed forms (יָדוֹ, יָדְךָ, ...) don\'t depointed-match the absolute singular citation.' }],
  ['1419', { vocabLesson: 32, note: 'גָּדוֹל "great" (Strong 1419) — CSV L32 row; feminine/plural/construct adjective forms (גְּדֹלָה, גְּדֹלִים, ...) don\'t depointed-match the masculine singular citation.' }],
  ['3372', { vocabLesson: 38, note: 'יָרֵא "be afraid, fear" (Strong 3372) — CSV L38 row; only the bare Qal citation form direct-matches.' }],
  ['4428', { vocabLesson: 9, note: 'מֶלֶךְ "king" (Strong 4428) — CSV L9 row מֶלֶךְ (מְלָכִים); construct מֶלֶךְ־/plural/suffixed forms (מַלְכּוֹ, מַלְכֵי, ...) don\'t depointed-match the absolute singular citation. Distinct from Strong 4427 מָלַךְ "reign" (the verb, CSV L23) despite the shared מלך consonants.' }],
  ['5307', { vocabLesson: 42, note: 'נָפַל "fall" (Strong 5307) — CSV L42 row; only the bare Qal citation form direct-matches.' }],
  ['8104', { vocabLesson: 15, note: 'שָׁמַר "guard, keep, watch" (Strong 8104) — CSV lists it at both L15 (שָׁמַר (נִשְׁמַר), infinitive/Nifal-noted headword) and L16 (fully conjugated Qal perfect paradigm); every PGN/stem/conjugation form beyond the bare citation forms fails to depointed-match, so this maps to the lower (L15) lesson per the "earliest attested" rule.' }],
  ['1697', { vocabLesson: 5, note: 'דָּבָר "word, thing" (Strong 1697) — CSV L5 row; construct דְּבַר־/plural/suffixed forms (דְּבָרָיו, דִּבְרֵי, ...) don\'t depointed-match the absolute singular citation. Distinct from Strong 1696 דִּבֶּר "speak" (the Piel verb, already in this table) despite the shared דבר consonants.' }],
  ['5650', { vocabLesson: 11, note: 'עֶבֶד "servant" (Strong 5650) — CSV L11 row עֶבֶד (עֲבָדִים); construct עֶבֶד־/plural/suffixed forms (עֲבָדָיו, עַבְדּוֹ, ...) don\'t depointed-match the absolute singular citation.' }],
  ['6430', { vocabLesson: null, note: 'פְּלִשְׁתִּי "Philistine" (Strong 6430, gentilic noun Ng — high-frequency in Judges/1-2 Samuel) — verified NOT present in the BBH vocab CSV; grammar-gated normally via gate-map\'s N[cg] rules (still L7/L10/L20 by inflection, same as before task 13a). As of task 13a\'s gentilic fix, Ng tokens are pn-class (excluded from unknownContentLexemes like a proper name, plus a distinct gent:true flag) regardless of this entry\'s vocabLesson:null, so this override now only affects vocabLesson/gl provenance, not scoring.' }],
  ['5927', { vocabLesson: null, note: 'עָלָה "go up, ascend" (Strong 5927) — verified NOT present in the BBH vocab CSV.' }],
  ['5674', { vocabLesson: null, note: 'עָבַר "cross over, pass through" (Strong 5674) — verified NOT present in the BBH vocab CSV (distinct from Strong 5647 עָבַד "serve/work", also verified absent, despite the shared עב consonants).' }],
  ['5046', { vocabLesson: null, note: 'נָגַד (Hifil הִגִּיד) "tell, declare, report" (Strong 5046) — verified NOT present in the BBH vocab CSV.' }],
  ['2022', { vocabLesson: null, note: 'הַר "mountain, hill" (Strong 2022) — verified NOT present in the BBH vocab CSV.' }],
  ['2091', { vocabLesson: null, note: 'זָהָב "gold" (Strong 2091) — verified NOT present in the BBH vocab CSV.' }],
  ['7969', { vocabLesson: null, note: 'שָׁלוֹשׁ/שְׁלֹשָׁה "three" (Strong 7969, numeral) — verified NOT present in the BBH vocab CSV as its own row; grammar-gated separately via gate-map\'s numeral override (L45).' }],
  ['3701', { vocabLesson: null, note: 'כֶּסֶף "silver, money" (Strong 3701) — verified NOT present in the BBH vocab CSV.' }],
  ['3820', { vocabLesson: null, note: 'לֵב "heart, mind" (Strong 3820) — verified NOT present in the BBH vocab CSV.' }],
  ['3423', { vocabLesson: null, note: 'יָרַשׁ "possess, inherit, dispossess" (Strong 3423) — verified NOT present in the BBH vocab CSV.' }],
  ['5647', { vocabLesson: null, note: 'עָבַד "serve, work" (Strong 5647, the verb) — verified NOT present in the BBH vocab CSV (distinct from Strong 5650 עֶבֶד "servant", the noun, which IS L11 vocab and already in this table).' }],
  ['4421', { vocabLesson: null, note: 'מִלְחָמָה "war, battle" (Strong 4421) — verified NOT present in the BBH vocab CSV.' }],
  ['6310', { vocabLesson: null, note: 'פֶּה "mouth" (Strong 6310) — verified NOT present in the BBH vocab CSV.' }],
  ['4196', { vocabLesson: null, note: 'מִזְבֵּחַ "altar" (Strong 4196) — verified NOT present in the BBH vocab CSV.' }],
  ['6030', { vocabLesson: null, note: 'עָנָה "answer, respond" (Strong 6030) — verified NOT present in the BBH vocab CSV.' }],
  ['1242', { vocabLesson: null, note: 'בֹּקֶר "morning" (Strong 1242) — verified NOT present in the BBH vocab CSV.' }],
  ['505', { vocabLesson: null, note: 'אֶלֶף "thousand" (Strong 505, numeral) — verified NOT present in the BBH vocab CSV.' }],
  ['6086', { vocabLesson: null, note: 'עֵץ "tree, wood" (Strong 6086) — verified NOT present in the BBH vocab CSV.' }],
  ['8432', { vocabLesson: null, note: 'תָּוֶךְ "midst" (Strong 8432, usually in the phrase בְּתוֹךְ "in the midst of") — verified NOT present in the BBH vocab CSV.' }],
  ['727', { vocabLesson: null, note: 'אָרוֹן "ark, chest" (Strong 727) — verified NOT present in the BBH vocab CSV.' }],
  ['68', { vocabLesson: null, note: 'אֶבֶן "stone" (Strong 68) — verified NOT present in the BBH vocab CSV.' }],
  ['5493', { vocabLesson: null, note: 'סוּר "turn aside, depart" (Strong 5493) — verified NOT present in the BBH vocab CSV.' }],
  ['3627', { vocabLesson: null, note: 'כְּלִי "vessel, weapon, implement" (Strong 3627) — verified NOT present in the BBH vocab CSV.' }],
  ['4264', { vocabLesson: null, note: 'מַחֲנֶה "camp" (Strong 4264) — verified NOT present in the BBH vocab CSV.' }],
  ['3548', { vocabLesson: null, note: 'כֹּהֵן "priest" (Strong 3548) — verified NOT present in the BBH vocab CSV.' }],
  ['4057', { vocabLesson: null, note: 'מִדְבָּר "wilderness, desert" (Strong 4057) — verified NOT present in the BBH vocab CSV.' }]
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

  // Gentilic handling (task 13a matcher fix): OSHB tags gentilic nouns
  // (e.g. הַחִוִּי "the Hivite", הָעַרְקִי "the Arkite") with an N*g* morph
  // code (Ngmsa/Ngfsa/Ngmpa/Ngfpa/Ngmsc/Ngmpc — verified as the complete set
  // across all 8 BOOK_LIST books), which the shared "N[cg]..." gate-map
  // rules grammar-gate identically to a common noun (L7/L10/L20 — gentilics
  // DO follow ordinary noun inflection paradigms, so that part is correct
  // and unchanged). The bug they don't share with proper names (Np, which
  // gets its own gate-map entry with isProperName:true) is exclusion from
  // unknown-content-lexeme counts: a verse-full of untaught nation/clan
  // names (e.g. Gen 10:17's Hivite/Arkite/Sinite list) was wrongly counted
  // as 3 unknown content words and mis-tiered. Gentilics are therefore
  // treated as pn-class for that purpose (excluded from hasContentSegment
  // below, and isProperName:true on the emitted token) while ALSO carrying
  // a distinct `gent` flag/return value so the UI can label them
  // "gentilic name" rather than a personal/place name.
  const isGentilic = segments.some((seg) => /^Ng/.test(seg.morph));

  const isProperName = isGentilic || contributions.some((c) => c.entry && c.entry.isProperName);
  const unmapped = contributions.some((c) => c.kind === 'unmapped' || c.kind === 'gap');
  const mappedLessons = contributions.filter((c) => c.kind === 'mapped').map((c) => c.lesson);
  const tokenLesson = mappedLessons.length ? Math.max(...mappedLessons) : null;

  // Content-word (N/V/A, non-proper, non-gentilic) vocab match, for
  // unknownContentLexemes.
  let vocabLesson = null;
  let strongs = null;
  let hasContentSegment = false;
  for (let i = 0; i < segments.length; i++) {
    const pos = segments[i].morph[0];
    // N[pg] = proper noun (Np) or gentilic noun (Ng) — both excluded from
    // the content-lexeme count (see isGentilic note above).
    const isProperSeg = /^N[pg]/.test(segments[i].morph);
    if ((pos === 'N' && !isProperSeg) || pos === 'V' || pos === 'A') {
      hasContentSegment = true;
      const match = vocabLookup(segments[i].display, segments[i].lemma, vocabIndex);
      if (match && (vocabLesson == null || match.lesson < vocabLesson)) vocabLesson = match.lesson;
      if (!strongs) strongs = strongsOf(segments[i].lemma);
    }
  }
  // Compound-token vocab matching (task 13a matcher fix): a token with no
  // N/V/A content segment (a pure function-word token — a prefixed
  // conjunction/preposition/article bundled with a particle segment, e.g.
  // "ו/את" = C + To) never sets vocabLesson above, even when its CORE
  // segment (the particle, not the prefix) is itself taught vocabulary
  // (e.g. את "direct-object marker" is CSV L15). splitToken() already
  // isolates each morpheme's own display/lemma (the "/" split happens
  // before this function runs), so re-testing every non-proper/gentilic
  // segment of such a token against the vocab index — restricted to
  // hasContentSegment===false tokens so a real content word's own
  // scoring is never contaminated by an unrelated prefix segment's
  // (extremely unlikely, but not risked) accidental match — surfaces the
  // CORE segment's own match for display purposes (the `v` field read by
  // the Reader UI's guided-tier dotted-underline logic) without affecting
  // unknownContentLexemes (hasContentSegment stays false either way).
  if (!hasContentSegment) {
    for (const seg of segments) {
      if (/^N[pg]/.test(seg.morph)) continue;
      const match = vocabLookup(seg.display, seg.lemma, vocabIndex);
      if (match && (vocabLesson == null || match.lesson < vocabLesson)) vocabLesson = match.lesson;
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
    isGentilic,
    unmapped,
    tokenLesson,
    hasContentSegment,
    vocabLesson,
    strongs
  };
}

// ─── 6. Verse scoring + tiering ────────────────────────────────────────────
// PRIMARY TIER — unchanged in shape from Phase 2 PR D: a verse is judged AT
// ITS OWN maxGrammarLesson (gateLesson always equals maxGrammarLesson for
// strict/guided). This is deliberately independent of the challenge
// diagnostic below — see that block's own header comment for why the two
// must never be conflated into one either/or branch.
//
// CHALLENGE (reworked in task 13a — see docs/bbh-conversion-plan.md's
// "challenge tier rework" and "underline noise" addenda, both 2026-08-09).
// The relaxed definition (docs addendum, verbatim): a verse qualifies as
// CHALLENGE at gate G when all its morphology is in scope at G EXCEPT
// tokens sharing exactly ONE future feature TYPE (same gate-map lesson
// bucket, e.g. "past narrative L35"), 1-3 such tokens, and <=2 unknown
// non-proper content lexemes.
//
// IMPORTANT — challenge-eligibility is an INDEPENDENT, OPT-IN diagnostic,
// never an override of the primary strict/guided tier above. An earlier
// draft of this function tried "check challenge first, fall back to
// strict/guided" (structurally the only way challenge's own <=2 threshold
// — a strict subset of guided's <=3 — could ever be reached at all, since
// checking it AFTER strict/guided is a dead branch: guided's <=3 always
// claims the verse first). But EVERY ordinary short clause has "one token
// at the single highest lesson (typically its main verb) plus a lower
// baseline" — that is not a rare or noteworthy shape, it is completely
// normal sentence structure — so checking it first turned ~80% of the
// curated corpus's existing strict/guided selections into "challenge"
// (verified against source/bbh/reader/selections.json's pre-13a 78
// entries: 60+ flipped tier on a first draft of this function, almost all
// of them ordinary one-verb clauses, not genuine "future feature preview"
// material). Making challenge-eligibility a SEPARATE field entirely
// sidesteps this: a verse keeps its ordinary strict/guided tier from its
// own maxGrammarLesson regardless of whether it ALSO happens to match the
// challenge shape; a curator opts a specific verse INTO the challenge tier
// by recording tier:"challenge" (+ a lower gateLesson + challengeNote) in
// selections.json, and the validator checks that choice against THIS
// `challenge` sub-object (see validate_bbh_reader_data.mjs) rather than
// against the primary `tier` field.
//
// Additional curation-quality floors beyond the doc's own three numeric
// conditions (not required for correctness, but kept as they cut a
// ~1600-candidate raw match count down to a set actually worth hand-
// curating from — see tools/import_oshb_reader.mjs --report's per-bucket
// challenge counts):
//   - G (the lower "in scope" gate) must itself be >= lesson 9, matching
//     the floor bucketOf()'s own 10 curation buckets already use — below
//     that is bare pronoun/article/preposition material every passage at
//     any level inevitably contains as connective tissue, so a verse whose
//     only "baseline" is <9 material has no real lower foundation to
//     preview against.
//   - the gap (maxGrammarLesson - G) must be >= 10 — i.e. the future
//     feature must belong to a meaningfully distant unit of the course,
//     not just the next lesson or two over. This is what actually
//     separates "look, here's a preview of Past Narrative" (a genuine,
//     nameable future paradigm) from "this clause's verb happens to be one
//     lesson more advanced than its nouns" (true of nearly every clause,
//     and not a distinguishable "feature").
export function scoreVerse(classifiedTokens) {
  const tokenCount = classifiedTokens.length;
  const unmappedCount = classifiedTokens.filter((t) => t.unmapped).length;
  const unknownContentLexemes = classifiedTokens.filter(
    (t) => t.hasContentSegment && !t.isProperName && t.vocabLesson == null
  ).length;
  const lessons = classifiedTokens.map((t) => t.tokenLesson).filter((l) => l != null);
  const maxGrammarLesson = lessons.length ? Math.max(...lessons) : 0;
  const allMapped = unmappedCount === 0;

  let tier = null;
  if (allMapped && unknownContentLexemes <= 1) {
    tier = 'strict';
  } else if (allMapped && unknownContentLexemes <= 3) {
    tier = 'guided';
  }

  const CHALLENGE_MIN_GATE = 9;
  const CHALLENGE_MIN_GAP = 10;
  let challenge = { eligible: false, gateLesson: null, futureFeatureLesson: null, futureTokenCount: 0 };
  if (allMapped && unknownContentLexemes <= 2) {
    const distinctLessonsDesc = [...new Set(lessons)].sort((a, b) => b - a);
    const g = distinctLessonsDesc.length > 1 ? distinctLessonsDesc[1] : null;
    const atMax = classifiedTokens.filter((t) => t.tokenLesson === maxGrammarLesson);
    if (
      g != null && g >= CHALLENGE_MIN_GATE &&
      (maxGrammarLesson - g) >= CHALLENGE_MIN_GAP &&
      atMax.length >= 1 && atMax.length <= 3
    ) {
      challenge = {
        eligible: true,
        gateLesson: g,
        futureFeatureLesson: maxGrammarLesson,
        futureTokenCount: atMax.length
      };
    }
  }

  return {
    tokenCount,
    unmappedCount,
    unknownContentLexemes,
    maxGrammarLesson,
    gateLesson: maxGrammarLesson,
    tier,
    challenge
  };
}

// Human-readable label for a gate-map bbhLesson, derived from that lesson's
// OWN mapped gate-map entries' `note` text (data-driven, not a hand-authored
// duplicate table) — used to build a challenge selection's `challengeNote`
// ("Contains 2 Past Narrative forms — introduced in Lesson 35"). Strips the
// trailing "(base L.. -> L..)"/"(base L.., stem floor L.. -> L..)" STEM-FLOOR
// provenance parenthetical (see gate-map.json's notes) to leave just the
// feature name.
export function describeGateLesson(gateMapDoc, lesson) {
  const entry = gateMapDoc.mappings.find(
    (e) => e.bbhLesson === lesson && !e.unmapped && !e.neutral
  );
  if (!entry) return `Lesson ${lesson} feature`;
  return entry.note.replace(/\s*\(base L\d+(?:,\s*stem floor L\d+)?\s*->\s*L\d+\)\s*$/, '').trim();
}

// ─── 7. Top-level import ───────────────────────────────────────────────────
// Reads and scores every book in `books` (default BOOK_LIST), in that fixed
// order, and returns a single flat `verses` array (each verse additionally
// carries its own `book` field). Genesis is always processed first when
// present, preserving the exact verse order/content the original 52
// curated selections were scored against (byte-for-byte reproducibility is
// unaffected either way — scoring is purely per-verse/per-token — but fixed
// ordering keeps `--report`'s output and any future debugging deterministic
// across runs).
export function importReaderCorpus({ checkoutDir = CHECKOUT_DIR, verifyPin = true, books = BOOK_LIST } = {}) {
  let pinInfo = null;
  if (verifyPin) pinInfo = verifyCorpusPin({ checkoutDir });
  else pinInfo = { pin: readCorpusPin(), checkoutDir };

  const vocabRows = loadVocabRows();
  const vocabIndex = buildVocabIndex(vocabRows);
  const gateMapDoc = loadGateMap();
  const compiledGateMap = compileGateMap(gateMapDoc);

  const verses = [];
  for (const bookCode of books) {
    const bookXmlPath = path.join(checkoutDir, `wlc/${bookCode}.xml`);
    const xmlText = readFileSync(bookXmlPath, 'utf8');
    const rawVerses = parseBookXml(xmlText, bookCode);
    for (const v of rawVerses) {
      const classifiedTokens = v.tokens.map((token) => {
        const segments = splitToken(token);
        const classified = classifyToken(token, segments, compiledGateMap, vocabIndex);
        return { token, segments, ...classified };
      });
      const scores = scoreVerse(classifiedTokens);
      verses.push({
        osisID: v.osisID,
        book: bookCode,
        ref: osisRefToDisplay(v.osisID),
        tokens: classifiedTokens,
        scores
      });
    }
  }

  return { pin: pinInfo.pin, checkoutDir: pinInfo.checkoutDir, verses, vocabIndexSize: vocabIndex.size, books };
}

// Back-compat alias (Genesis-only, single-book import) — every in-repo
// caller now uses importReaderCorpus (multi-book); kept so nothing outside
// tools/ silently breaks if it still imports the old name.
export function importGenesis(opts = {}) {
  return importReaderCorpus({ ...opts, books: ['Gen'] });
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
  const { verses, vocabIndexSize, pin, books } = result;
  console.log(`Corpus: ${pin.repository} @ ${pin.commit} (tag ${pin.tag})`);
  console.log(`Books: ${books.join(', ')}`);
  console.log(`Vocab index: ${vocabIndexSize} distinct headword keys from the BBH vocab CSV.`);
  console.log(`Total: ${verses.length} verses, ${verses.reduce((n, v) => n + v.tokens.length, 0)} tokens.\n`);

  const tierCounts = { strict: 0, guided: 0, none: 0 };
  let challengeCount = 0;
  const byBucket = new Map(); // strict/guided, bucketed by their OWN gateLesson (maxGrammarLesson)
  const challengeByBucket = new Map(); // challenge candidates, bucketed by their OWN (lower) challenge.gateLesson — independent of tier
  const byBook = new Map(); // book -> { verses, tokens, tierCounts, challengeCount, coverageGaps, unmatchedLemmaFreq }
  let coverageGaps = 0;
  const gapExamples = [];
  const unmatchedLemmaFreq = new Map();

  for (const v of verses) {
    if (!byBook.has(v.book)) {
      byBook.set(v.book, { verses: 0, tokens: 0, tierCounts: { strict: 0, guided: 0, none: 0 }, challengeCount: 0, coverageGaps: 0, unmatchedLemmaFreq: new Map() });
    }
    const bookAgg = byBook.get(v.book);
    bookAgg.verses++;
    bookAgg.tokens += v.tokens.length;

    const t = v.scores.tier || 'none';
    tierCounts[t]++;
    bookAgg.tierCounts[t]++;
    if (t !== 'none') {
      const bucket = bucketOf(v.scores.gateLesson);
      if (!byBucket.has(bucket)) byBucket.set(bucket, { strict: [], guided: [] });
      byBucket.get(bucket)[t].push(v);
    }
    // Challenge is an INDEPENDENT diagnostic (see scoreVerse's header
    // comment) — a verse can be challenge-eligible regardless of its own
    // primary tier, so this is counted/bucketed separately, never folded
    // into tierCounts/byBucket above.
    if (v.scores.challenge.eligible) {
      challengeCount++;
      bookAgg.challengeCount++;
      const bucket = bucketOf(v.scores.challenge.gateLesson);
      if (!challengeByBucket.has(bucket)) challengeByBucket.set(bucket, []);
      challengeByBucket.get(bucket).push(v);
    }
    for (const tok of v.tokens) {
      for (const c of tok.contributions) {
        if (c.kind === 'gap') {
          coverageGaps++;
          bookAgg.coverageGaps++;
          if (gapExamples.length < 30) gapExamples.push(`${v.ref} morph="${tok.segments[c.segmentIndex].morph}"`);
        }
      }
      if (tok.hasContentSegment && !tok.isProperName && tok.vocabLesson == null && tok.strongs) {
        unmatchedLemmaFreq.set(tok.strongs, (unmatchedLemmaFreq.get(tok.strongs) || 0) + 1);
        bookAgg.unmatchedLemmaFreq.set(tok.strongs, (bookAgg.unmatchedLemmaFreq.get(tok.strongs) || 0) + 1);
      }
    }
  }

  console.log('Tier totals (all books combined, strict/guided/none — primary tier, own maxGrammarLesson):', tierCounts);
  console.log(`Challenge-eligible candidates (all books combined; INDEPENDENT diagnostic, overlaps tierCounts above — see scoreVerse): ${challengeCount}`);
  console.log(`Coverage gaps (window-1 segment matched by NO gate-map entry, incl. safety-net catch-alls): ${coverageGaps}`);
  if (gapExamples.length) console.log('  examples:', gapExamples.join(' | '));

  console.log('\nPer-book totals:');
  for (const b of books) {
    const agg = byBook.get(b);
    if (!agg) continue;
    console.log(`  ${b}: ${agg.verses} verses, ${agg.tokens} tokens, tiers=${JSON.stringify(agg.tierCounts)}, challengeEligible=${agg.challengeCount}, coverageGaps=${agg.coverageGaps}`);
  }

  console.log('\nPer-bucket candidate counts (strict/guided bucketed by their OWN gateLesson, all books combined):');
  const bucketOrder = ['<9', '9-14', '15-19', '20-22', '23-27', '28-31', '32-34', '35-38', '39-41', '42-44', '45-50', '50+'];
  for (const bkt of bucketOrder) {
    const entry = byBucket.get(bkt);
    if (!entry) continue;
    const byBookCounts = {};
    for (const tier of ['strict', 'guided']) {
      for (const v of entry[tier]) {
        byBookCounts[v.book] = byBookCounts[v.book] || { strict: 0, guided: 0 };
        byBookCounts[v.book][tier]++;
      }
    }
    console.log(`  ${bkt}: strict=${entry.strict.length} guided=${entry.guided.length} ${JSON.stringify(byBookCounts)}`);
  }

  console.log('\nChallenge-eligible candidates, bucketed by their OWN (lower) challenge.gateLesson (all books combined):');
  for (const bkt of bucketOrder) {
    const list = challengeByBucket.get(bkt);
    if (!list) continue;
    const byBookCounts = {};
    for (const v of list) byBookCounts[v.book] = (byBookCounts[v.book] || 0) + 1;
    console.log(`  ${bkt}: ${list.length} ${JSON.stringify(byBookCounts)}`);
  }

  console.log('\nTop unmatched content-lexeme Strong\'s numbers, ALL BOOKS (frequency, not yet in LEMMA_OVERRIDES with a resolving lesson):');
  const filterUnresolved = ([strongs]) => {
    const o = LEMMA_OVERRIDES.get(strongs);
    return !o || o.vocabLesson == null;
  };
  const top = [...unmatchedLemmaFreq.entries()].filter(filterUnresolved).sort((a, b) => b[1] - a[1]).slice(0, 60);
  for (const [strongs, freq] of top) console.log(`  Strong ${strongs}: ${freq}x`);

  if (books.length > 1) {
    console.log('\nTop unmatched content-lexeme Strong\'s numbers PER BOOK (top 40 each):');
    for (const b of books) {
      const agg = byBook.get(b);
      if (!agg) continue;
      const bookTop = [...agg.unmatchedLemmaFreq.entries()].filter(filterUnresolved).sort((a, b2) => b2[1] - a[1]).slice(0, 40);
      console.log(`  ${b}:`, bookTop.map(([s, f]) => `${s}(${f}x)`).join(' '));
    }
  }

  return { tierCounts, byBucket, byBook, coverageGaps };
}

function isMainModule() {
  return path.resolve(process.argv[1] || '') === path.resolve(fileURLToPath(import.meta.url));
}

function main() {
  const args = process.argv.slice(2);
  const doReport = args.includes('--report');
  const doEmit = args.includes('--emit');
  const bookArg = args.find((a) => a.startsWith('--book='));
  const books = bookArg ? [bookArg.slice('--book='.length)] : BOOK_LIST;
  if (!doReport && !doEmit) {
    console.log('Usage: node tools/import_oshb_reader.mjs --report | --emit [--book=Gen|Ruth|Jonah|Exod|Deut|Judg|1Sam|2Sam|Josh|1Kgs|2Kgs|Esth|Ps]');
    process.exitCode = 1;
    return;
  }
  const result = importReaderCorpus({ books });
  printReport(result);
  if (doEmit) {
    console.log('\n--- FULL SCORED CORPUS (JSON) ---');
    console.log(JSON.stringify(result.verses.map((v) => ({
      osisID: v.osisID,
      book: v.book,
      ref: v.ref,
      scores: v.scores,
      tokens: v.tokens.map((t) => ({
        display: t.token.display,
        lemma: t.token.lemmaRaw,
        morph: t.token.morphRaw,
        gate: t.tokenLesson,
        unmapped: t.unmapped,
        isProperName: t.isProperName,
        isGentilic: t.isGentilic,
        vocabLesson: t.vocabLesson,
        strongs: t.strongs
      }))
    })), null, 2));
  }
}

if (isMainModule()) main();
