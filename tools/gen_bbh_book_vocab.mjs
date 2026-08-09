#!/usr/bin/env node
// GENERATED-FILE GENERATOR — this file is hand-maintained (not itself
// generated). Task #15 ("advanced vocab + vocab by book"): reads the SAME
// pinned OSHB checkout the Reader pipeline reads (never re-fetched — see
// tools/import_oshb_reader.mjs's verifyCorpusPin, reused unchanged below),
// counts whole-book content-lemma frequencies across all 8 Reader corpus
// books, drops anything already taught as one of the 209 lesson-vocab
// cards, and deterministically writes js/data/bbh_book_vocab.js: 8 per-book
// "advanced" decks (top 25 new content words each) + 1 corpus-wide "Tanakh
// core" deck (top 50). Mirrors the style of tools/gen_bbh_reader_data.mjs /
// tools/gen_bbh_parsing_data.mjs (validate-or-abort, then write; byte-
// identical on rerun with no source changes).
//
// REUSE, NOT REIMPLEMENTATION (per the task brief):
//   - tools/import_oshb_reader.mjs: importReaderCorpus() for the pinned-
//     checkout OSIS tokenizer + morphology classifier (classifyToken's own
//     hasContentSegment/isProperName/strongs fields ARE the noun/verb/
//     adjective-vs-proper-name-vs-gentilic classification this task needs —
//     no separate POS logic is written here), loadVocabRows/buildVocabIndex
//     for the 209-CSV-headword exclusion set, LEMMA_OVERRIDES for the
//     Strong's-number half of that exclusion, and loadGateMap for the
//     numeral-lemma exclusion list (gate-map.json's own priority-100
//     numeral override entry — the authoritative "these 10 Strong's numbers
//     are numerals" list already used by the Reader pipeline).
//   - tools/gen_strongs_glosses.mjs: buildGlossIndex() for the pointed
//     headword (`lx`) + short modernized gloss (`gl`) per Strong's number,
//     from the SAME pinned Strong's Hebrew Dictionary checkout the Reader
//     pipeline uses.
//   - tools/gen_bbh_parsing_data.mjs: romanizeForm() (task #17's
//     deterministic, vocab-CSV-styled romanizer) for each card's `translit`.
//
// Sources (hand-maintained/pinned, authoritative — never generated into):
//   - source/bbh/reader/corpus-pin.json (OSHB + Strong's pins)
//   - source/bbh/reader/gate-map.json (numeral-lemma exclusion list)
//   - source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv (the
//     209-card exclusion set, via loadVocabRows/buildVocabIndex)
//   - tools/import_oshb_reader.mjs's LEMMA_OVERRIDES (Strong's-number half
//     of the same exclusion set, for lemmas whose inflected forms never
//     depointed-match the CSV's own citation-form headword)
//
// Output (generated — never hand-edit, re-run this script instead):
//   - js/data/bbh_book_vocab.js
//
// EXCLUSION RULE (the "keep the 209 lesson lemmas out" design decision
// fixed in RESTORE.md's in-flight block): a content lemma is excluded from
// every book/core deck if EITHER (a) its Strong's number is a key of
// LEMMA_OVERRIDES with a non-null vocabLesson, OR (b) its Strong's
// dictionary headword (`lx`), depointed, matches a depointed CSV headword
// in buildVocabIndex's index. This is deliberately the union of both signals
// used elsewhere in this codebase for "is this lemma taught vocabulary" —
// neither alone is exhaustive (LEMMA_OVERRIDES only covers the ~60
// highest-frequency Genesis/expansion-book content lemmas that fail a
// direct depointed match; the CSV headword index alone misses every lemma
// whose citation form isn't the inflected surface form actually attested).
//
// NUMERAL EXCLUSION: gate-map.json's own priority-100 numeral-override
// entry lists the 10 Strong's numbers (259/8147/7969/702/2568/8337/7651/
// 8083/8672/6235) OSHB tags as noun/adjective morphology despite being
// numerals 1-10 — read directly from that entry's `lemmaStrongs` field
// rather than hand-copied, so this list can never drift from the Reader
// pipeline's own numeral list.
//
// CONTENT-WORD SIMPLIFICATION (inherited from classifyToken, documented
// there): a token's `strongs`/`hasContentSegment` reflects its FIRST
// noun(non-proper/gentilic)/verb/adjective segment only. Multi-content-
// segment tokens are rare (compound forms); this under-counts a second
// content segment's own frequency by at most a handful of tokens corpus-
// wide, the same simplification the Reader pipeline's own vocab-match
// scoring already accepts.
//
// Determinism: no Date.now(), no Math.random(), no environment-dependent
// iteration order — importReaderCorpus() itself is already documented
// deterministic (fixed BOOK_LIST order, no filesystem-order dependence);
// frequency maps are plain Maps built by iterating that fixed verse order;
// every book's card list and the core deck are explicitly sorted (frequency
// desc, then Strong's number asc) before being written, never left in Map
// insertion order. Re-running with no source changes must be a byte-
// identical no-op: `node tools/gen_bbh_book_vocab.mjs && git diff --exit-code
// js/data/bbh_book_vocab.js`.
//
// Usage: node tools/gen_bbh_book_vocab.mjs

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  importReaderCorpus,
  loadVocabRows,
  buildVocabIndex,
  LEMMA_OVERRIDES,
  loadGateMap,
  ROOT
} from './import_oshb_reader.mjs';
import { buildGlossIndex } from './gen_strongs_glosses.mjs';
import { romanizeForm } from './gen_bbh_parsing_data.mjs';
import { stripHebrewPoints } from '../js/utils/hebrewText.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
void __dirname;

const OUT_PATH = path.join(ROOT, 'js/data/bbh_book_vocab.js');

const PER_BOOK_TOP_N = 25;
const CORE_TOP_N = 50;
const MIN_FREQUENCY = 3;

// ─── Book display metadata (fixed, documented order — mirrors BOOK_LIST) ──
const BOOK_META = [
  { code: 'Gen', slug: 'gen', display: 'Genesis' },
  { code: 'Ruth', slug: 'ruth', display: 'Ruth' },
  { code: 'Jonah', slug: 'jonah', display: 'Jonah' },
  { code: 'Exod', slug: 'exod', display: 'Exodus' },
  { code: 'Deut', slug: 'deut', display: 'Deuteronomy' },
  { code: 'Judg', slug: 'judg', display: 'Judges' },
  { code: '1Sam', slug: '1sam', display: '1 Samuel' },
  { code: '2Sam', slug: '2sam', display: '2 Samuel' }
];

// ─── 1. Numeral-lemma exclusion set, read from gate-map.json ──────────────
// The importer's own numeral override entry (priority 100, morphPattern
// "[AN].*") is the sole gate-map entry carrying a `lemmaStrongs` array
// alongside `bbhLesson: 45` — locating it structurally (rather than by
// matching on `note` text) keeps this immune to prose rewording.
function loadNumeralStrongsSet() {
  const gateMapDoc = loadGateMap();
  const numeralEntry = gateMapDoc.mappings.find(
    (e) => e.priority === 100 && Array.isArray(e.lemmaStrongs) && e.bbhLesson === 45
  );
  if (!numeralEntry) {
    throw new Error('gen_bbh_book_vocab: could not locate the numeral-override gate-map entry (priority 100, bbhLesson 45, lemmaStrongs array) — gate-map.json shape changed?');
  }
  return new Set(numeralEntry.lemmaStrongs);
}

// ─── 2. 209-lesson-lemma exclusion test ────────────────────────────────────
function buildLessonExclusion() {
  const vocabRows = loadVocabRows();
  const vocabIndex = buildVocabIndex(vocabRows); // Map<depointed headword, {lesson, headword}>
  function isLessonLemma(strongs, headwordPointed) {
    const override = strongs != null ? LEMMA_OVERRIDES.get(strongs) : null;
    if (override && override.vocabLesson != null) return true;
    if (headwordPointed && vocabIndex.has(stripHebrewPoints(headwordPointed))) return true;
    return false;
  }
  return { vocabIndex, isLessonLemma };
}

// ─── 3. Whole-corpus content-lemma frequency counting ──────────────────────
// Reuses importReaderCorpus's own per-token classification (hasContentSegment
// / isProperName / strongs) — see classifyToken() in import_oshb_reader.mjs.
// isProperName is already true for BOTH Np (proper name) and Ng (gentilic)
// tokens (task 13a's gentilic fix), so excluding isProperName tokens here
// excludes proper nouns AND gentilics in one check, exactly as the task
// brief asks. hasContentSegment is only ever set true for N(non-proper/
// gentilic)/V/A segments, so particles/pronouns/prepositions/conjunctions
// are excluded automatically; numerals (tagged N/A by OSHB) are excluded
// separately below via numeralStrongsSet.
function countContentFrequencies({ verses, numeralStrongsSet }) {
  const perBook = new Map(); // bookCode -> Map<strongs, count>
  const global = new Map(); // strongs -> count
  for (const meta of BOOK_META) perBook.set(meta.code, new Map());

  for (const verse of verses) {
    const bookFreq = perBook.get(verse.book);
    if (!bookFreq) continue; // defensive: importReaderCorpus is scoped to BOOK_LIST already
    for (const t of verse.tokens) {
      if (!t.hasContentSegment || t.isProperName) continue;
      const strongs = t.strongs;
      if (!strongs || numeralStrongsSet.has(strongs)) continue;
      bookFreq.set(strongs, (bookFreq.get(strongs) || 0) + 1);
      global.set(strongs, (global.get(strongs) || 0) + 1);
    }
  }
  return { perBook, global };
}

// ─── 4. Deterministic candidate ordering ───────────────────────────────────
// Frequency desc, then Strong's number asc (numeric) — a total order, so
// `.slice(0, N)` after this sort is stable/reproducible regardless of Map
// iteration order.
function sortedEntries(freqMap) {
  return [...freqMap.entries()].sort((a, b) => (b[1] - a[1]) || (Number(a[0]) - Number(b[0])));
}

// ─── 5. Card construction ───────────────────────────────────────────────────
function buildCard({ idSuffix, strongs, freq, notes, glossIndex }) {
  const gloss = glossIndex.get(strongs);
  const g = gloss && gloss.lx ? gloss.lx : null;
  const e = gloss && gloss.gl ? gloss.gl : null;
  if (!g || !e) return null; // dropped: unresolved Strong's dictionary entry
  return {
    id: `bbh-bk-${idSuffix}-${strongs}`,
    g,
    e,
    translit: romanizeForm(g),
    notes,
    required: true,
    freq // stripped before serialization; kept only for the inline validation pass below
  };
}

function buildDeck({ key, label, entries, idSuffix, topN, notesFor, glossIndex, isLessonLemma }) {
  const cards = [];
  for (const [strongs, freq] of entries) {
    if (freq < MIN_FREQUENCY) continue;
    const gloss = glossIndex.get(strongs);
    if (gloss && gloss.lx && isLessonLemma(strongs, gloss.lx)) continue; // 209-lesson exclusion
    const card = buildCard({ idSuffix, strongs, freq, notes: notesFor(freq), glossIndex });
    if (!card) continue;
    cards.push(card);
    if (cards.length >= topN) break;
  }
  return { key, label, cards };
}

// ─── 6. Inline validation (no writes if anything fails) ───────────────────
function validate(decks, { vocabIndex }) {
  const errors = [];
  const seenIds = new Set();
  for (const deck of decks) {
    if (!deck.cards.length) errors.push(`deck ${deck.key}: empty card list`);
    for (const card of deck.cards) {
      if (seenIds.has(card.id)) errors.push(`duplicate id: ${card.id}`);
      seenIds.add(card.id);
      for (const field of ['id', 'g', 'e', 'translit', 'notes']) {
        if (!card[field] || typeof card[field] !== 'string' || !card[field].trim()) {
          errors.push(`deck ${deck.key} card ${card.id || '(no id)'}: empty/missing field "${field}"`);
        }
      }
      if (vocabIndex.has(stripHebrewPoints(card.g))) {
        errors.push(`deck ${deck.key} card ${card.id}: headword "${card.g}" leaks a 209-lesson lemma (unpointed match)`);
      }
    }
  }
  if (errors.length) {
    throw new Error(`gen_bbh_book_vocab: validation failed —\n  ${errors.join('\n  ')}`);
  }
}

// ─── 7. Serialization ───────────────────────────────────────────────────
const HEADER = [
  '// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_book_vocab.mjs',
  '// (source: pinned OSHB checkout via source/bbh/reader/corpus-pin.json, pinned',
  '// Strong\'s Hebrew Dictionary checkout via the same file\'s strongsPin,',
  '// source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv for the',
  '// 209-lesson-lemma exclusion set, source/bbh/reader/gate-map.json for the',
  '// numeral-lemma exclusion list)',
  '//',
  '// Task #15 ("advanced vocab + vocab by book"): 8 per-book "advanced" decks',
  '// (top 25 highest-frequency content lemmas per book, excluding the 209',
  '// lesson-vocab cards, numerals, proper names, and gentilics) plus 1',
  '// corpus-wide "Tanakh core" deck (top 50 across all 8 books combined).',
  '// Own id namespace (bbh-bk-<book>-<strongs> / bbh-bk-core-<strongs>) so',
  '// these never collide with js/data/bbh_vocab.js\'s bbh-l<NN>-<slug> ids.',
  '// Card shape mirrors js/data/bbh_vocab.js: {id, g, e, translit, notes,',
  '// required} — g/translit are the Strong\'s dictionary\'s own pointed',
  '// headword (`lx`) romanized with tools/gen_bbh_parsing_data.mjs\'s',
  '// romanizeForm(); e is a short modernized gloss from',
  '// tools/gen_strongs_glosses.mjs\'s headGloss().',
  '//',
  '// Self-registers on window.BBH_BOOK_VOCAB (classic, non-module script —',
  '// same idiom as bbh_vocab.js/bbh_parsing.js). js/app/main.js merges',
  '// BBH_BOOK_VOCAB.decks into window.SETS under their own \'book-*\' keys',
  '// AFTER bbh_vocab.js has registered, guarded on BBH_BOOK_VOCAB being',
  '// present (mixed-version safe).',
  '//',
  '// Never edit this file by hand — re-run the generator instead. Never edit',
  '// source/bbh/ from here or anywhere else.',
  ''
].join('\n');

function writeBookVocabFile(decks) {
  const strippedDecks = decks.map((deck) => ({
    key: deck.key,
    label: deck.label,
    type: 'chapter',
    cards: deck.cards.map(({ id, g, e, translit, notes, required }) => ({ id, g, e, translit, notes, required }))
  }));
  const output = { schemaVersion: 1, decks: strippedDecks };
  const json = JSON.stringify(output, null, 2);
  const parts = [];
  parts.push(HEADER);
  parts.push('(function () {\n');
  parts.push(`  window.BBH_BOOK_VOCAB = ${json.split('\n').join('\n  ')};\n`);
  parts.push('})();\n');
  return parts.join('');
}

// ─── 8. Top-level build ─────────────────────────────────────────────────
function main() {
  const numeralStrongsSet = loadNumeralStrongsSet();
  const { vocabIndex, isLessonLemma } = buildLessonExclusion();

  const { verses } = importReaderCorpus({ verifyPin: true });
  const { perBook, global } = countContentFrequencies({ verses, numeralStrongsSet });

  // Resolve Strong's dictionary entries once for every distinct content
  // Strong's number seen anywhere (per-book candidates are a subset of the
  // global set, so this single call covers both loops below).
  const distinctStrongs = [...global.keys()].sort((a, b) => Number(a) - Number(b));
  const { index: glossIndex, resolved, missing } = buildGlossIndex(distinctStrongs);

  const decks = [];
  for (const meta of BOOK_META) {
    const entries = sortedEntries(perBook.get(meta.code));
    const deck = buildDeck({
      key: `book-${meta.slug}`,
      label: `${meta.display} (advanced)`,
      entries,
      idSuffix: meta.slug,
      topN: PER_BOOK_TOP_N,
      notesFor: (freq) => `${meta.display} · ${freq}x in ${meta.display}`,
      glossIndex,
      isLessonLemma
    });
    decks.push(deck);
  }

  const coreEntries = sortedEntries(global);
  const coreDeck = buildDeck({
    key: 'book-core',
    label: 'Tanakh core (advanced)',
    entries: coreEntries,
    idSuffix: 'core',
    topN: CORE_TOP_N,
    notesFor: (freq) => `Tanakh core · ${freq}x in corpus`,
    glossIndex,
    isLessonLemma
  });
  decks.push(coreDeck);

  validate(decks, { vocabIndex });

  writeFileSync(OUT_PATH, writeBookVocabFile(decks));

  console.log(`Wrote ${path.relative(ROOT, OUT_PATH)}`);
  console.log(`Strong's glosses resolved: ${resolved}/${distinctStrongs.length} (missing: ${missing.length}${missing.length ? ' -> ' + missing.slice(0, 10).join(',') : ''})`);
  for (const deck of decks) {
    console.log(`  ${deck.key}: ${deck.cards.length} cards`);
  }
}

function isMainModule() {
  return path.resolve(process.argv[1] || '') === path.resolve(fileURLToPath(import.meta.url));
}
if (isMainModule()) main();

export { loadNumeralStrongsSet, buildLessonExclusion, countContentFrequencies, sortedEntries };
