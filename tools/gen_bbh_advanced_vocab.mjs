#!/usr/bin/env node
// GENERATED-FILE GENERATOR — this file is hand-maintained (not itself
// generated). Task #20 REWORKS task #15's per-book "new word" decks to
// match the ORIGINAL GREEK APP's design (ad1547e advancedSection /
// bookVocabSection — see docs/bbh-conversion-plan.md's task-20 addendum):
//
//   1. Advanced vocabulary: EVERY content lemma (noun/verb/adjective,
//      non-proper, non-gentilic) across the corpus that is NOT one of the
//      209 lesson-vocab cards, min corpus frequency 2, ordered by
//      descending corpus frequency. Bucketed in groups of 100 ("Advanced
//      1-100", "101-200", ...), each with sub-groups of 25 (a `sub` field
//      on every card, e.g. "1-25") for the study-selector UI. Each becomes
//      a REAL new card (id `bbh-adv-<strongs>`) — own id namespace, so
//      these never collide with js/data/bbh_vocab.js's `bbh-l<NN>-<slug>`
//      ids.
//   2. Book vocab: per book, EVERY content lemma that has vocab coverage —
//      i.e. resolves to EITHER an existing 209-lesson card OR one of this
//      file's own `bbh-adv-*` cards — grouped into sets of 50 by
//      descending in-book frequency ("Genesis 1-50", "51-100", ...). These
//      are LINKS, not new cards: each book "set" is just an ordered array
//      of EXISTING card ids (js/domain/deck/filters.js's
//      resolveBookVocabCards resolves them to the live card objects at
//      deck-build time, mirroring the Greek app's resolveBookVocabCards /
//      NT_BOOK_VOCAB), so studying a book's vocabulary shares progress
//      with that word's home lesson or advanced bucket — no duplicate ids,
//      no separate SRS history. A lemma with no card anywhere (below the
//      advanced frequency floor, or excluded as proper/gentilic/numeral)
//      is simply absent from every book's list.
//
// TASK #23 (user request, 2026-08-09) — "Advanced vocab should cover every
// OT book just as a general memorization tool": the corpus scope widened
// from the Reader's 8-book curated set to ALL 39 OSHB books (the whole
// Tanakh), at the SAME pinned commit. Only the corpus INPUT changed — every
// rule above (content-class filter, proper/gentilic exclusion, min
// frequency 2, bucket/sub-group sizes, id scheme, exclusion-from-course-
// totals) is unchanged. Two things follow mechanically from a bigger
// corpus: more distinct qualifying lemmas (more/bigger buckets) and higher
// per-book link coverage (a book's own rare words are now far more likely
// to also clear the freq>=2 floor GLOBALLY, since "globally" now means the
// whole Bible instead of 8 books). Book Vocab's BOOK_META below grew from
// 8 books to all 39, in a fixed canonical (Leningrad-Codex/BHS print)
// order — see FULL_TANAKH_BOOK_LIST below for the source of that order.
// The Reader itself (`tools/import_oshb_reader.mjs`'s own BOOK_LIST,
// `js/data/bbh_reader.js`) is UNCHANGED — it still ships 8 curated books;
// this task only widens the vocab-frequency corpus, not the Reader.
//
// REUSE, NOT REIMPLEMENTATION (per the task brief):
//   - tools/gen_bbh_data.mjs: buildLessons() for the exact same 209 real
//     lesson cards (with their real, already-shipped ids) this file needs
//     to link against — no CSV re-parsing, no id-scheme reimplementation.
//   - tools/import_oshb_reader.mjs: importReaderCorpus() for the pinned-
//     checkout OSIS tokenizer + morphology classifier (hasContentSegment/
//     isProperName/strongs — the noun/verb/adjective-vs-proper-name-vs-
//     gentilic classification this task needs), LEMMA_OVERRIDES for the
//     ~40 highest-frequency lesson lemmas whose corpus-attested forms never
//     depointed-match their own citation headword, and loadGateMap for the
//     numeral-lemma exclusion list (gate-map.json's own priority-100
//     numeral override entry).
//   - tools/gen_strongs_glosses.mjs: buildGlossIndex() for the pointed
//     headword (`lx`) + short modernized gloss (`gl`) per Strong's number.
//   - tools/gen_bbh_parsing_data.mjs: romanizeForm() for each card's
//     `translit`.
//
// Sources (hand-maintained/pinned, authoritative — never generated into):
//   - source/bbh/reader/corpus-pin.json (OSHB + Strong's pins; task #23
//     reads the SAME pin, all 39 wlc/*.xml books at that one commit — no
//     new pin, no new checkout)
//   - source/bbh/reader/gate-map.json (numeral-lemma exclusion list; also
//     supplies the sole isProperName gate-map entry (bare morph pattern
//     "Np", no lemmaStrongs restriction) that importReaderCorpus()'s
//     classifyToken() needs — that entry is morphology-only, so it applies
//     identically to every book, not just the original 8)
//   - source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv (via
//     buildLessons(), the 209-card exclusion/linking set)
//   - tools/import_oshb_reader.mjs's LEMMA_OVERRIDES
//
// Output (generated — never hand-edit, re-run this script instead):
//   - js/data/bbh_advanced_vocab.js — registers BOTH window.BBH_ADVANCED_VOCAB
//     (the real bbh-adv-* card buckets, merged into window.SETS by
//     js/app/main.js's mergeAdvancedVocabDecks) and window.BBH_BOOK_VOCAB
//     (the book -> ordered-ref-ids index; never merged into window.SETS,
//     resolved at deck-build time — see js/domain/deck/filters.js).
//
// 209-LESSON-LEMMA LINKING: a corpus content lemma (by Strong's number)
// resolves to a specific lesson CARD ID by ONE of two routes:
//   (a) direct match — the Strong's dictionary's own pointed headword
//       (`lx`), depointed, exactly equals a lesson card's own depointed
//       headword. This is precise (exact card, not just "some card in lesson
//       N") because both sides trace back to the same CSV `hebrew` field.
//   (b) override match — for the ~40 lemmas in LEMMA_OVERRIDES whose
//       inflected corpus forms never depointed-match their own citation
//       headword (so route (a) fails), the override's own `note` prose
//       reliably embeds the CSV headword text (see resolveOverrideCardId
//       below) — extracted, then VALIDATED against the actual cards in
//       that override's stated lesson before being accepted. If validation
//       is ambiguous or finds nothing, the lemma is left unlinked (safe
//       fallback: it just won't appear in book vocab, never a wrong link).
// A lemma counts as "already lesson vocabulary" (excluded from becoming an
// advanced card) if EITHER route resolves OR the strongs key is a
// LEMMA_OVERRIDES entry with a non-null vocabLesson (even if route (b)'s
// validation couldn't pin an exact card) — this mirrors task #15's original
// exclusion rule exactly, so the excluded set can only ever be a superset
// of what's actually link-resolved.
//
// NUMERAL EXCLUSION: gate-map.json's own priority-100 numeral-override
// entry lists the 10 Strong's numbers OSHB tags as noun/adjective
// morphology despite being numerals 1-10 — read directly from that entry's
// `lemmaStrongs` field, never hand-copied.
//
// Determinism: no Date.now(), no Math.random(); importReaderCorpus() and
// buildLessons() are already documented deterministic; every candidate
// list is explicitly sorted (frequency desc, then Strong's number asc)
// before being sliced/bucketed, never left in Map insertion order.
// Re-running with no source changes must be a byte-identical no-op:
// `node tools/gen_bbh_advanced_vocab.mjs && git diff --exit-code
// js/data/bbh_advanced_vocab.js`.
//
// Usage: node tools/gen_bbh_advanced_vocab.mjs

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  importReaderCorpus,
  LEMMA_OVERRIDES,
  loadGateMap,
  ROOT
} from './import_oshb_reader.mjs';
import { buildLessons } from './gen_bbh_data.mjs';
import { buildGlossIndex } from './gen_strongs_glosses.mjs';
import { romanizeForm } from './gen_bbh_parsing_data.mjs';
import { stripHebrewPoints } from '../js/utils/hebrewText.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
void __dirname;

const OUT_PATH = path.join(ROOT, 'js/data/bbh_advanced_vocab.js');

const ADV_BUCKET_SIZE = 100;
const ADV_SUB_SIZE = 25;
const ADV_MIN_FREQUENCY = 2;
const BOOK_GROUP_SIZE = 50;

// ─── Whole-Tanakh corpus scope (task #23) ──────────────────────────────────
// All 39 OSHB wlc/*.xml basenames, in the canonical Hebrew-Bible PRINT
// order the corpus's own source uses: the Leningrad Codex / BHS order —
// Torah, then Nevi'im Rishonim (Former Prophets), then Nevi'im Acharonim
// (Latter Prophets: the three major books, then the Twelve in their
// traditional sequence), then Ketuvim (Writings, Chronicles-first order —
// this is the WLC/Leningrad Codex's OWN book order, verified against the
// pinned checkout's structure/OshbVerse/Script/Books.js manifest, i.e. not
// hand-guessed). This is a strict superset (by content, re-ordered) of the
// 8 books tools/import_oshb_reader.mjs's Reader-scoped BOOK_LIST already
// uses — this list is intentionally separate from that one: the Reader
// stays 8 curated books; only this generator's corpus widens.
export const FULL_TANAKH_BOOK_LIST = [
  // Torah
  'Gen', 'Exod', 'Lev', 'Num', 'Deut',
  // Nevi'im Rishonim (Former Prophets)
  'Josh', 'Judg', '1Sam', '2Sam', '1Kgs', '2Kgs',
  // Nevi'im Acharonim (Latter Prophets): the three, then the Twelve
  'Isa', 'Jer', 'Ezek',
  'Hos', 'Joel', 'Amos', 'Obad', 'Jonah', 'Mic', 'Nah', 'Hab', 'Zeph', 'Hag', 'Zech', 'Mal',
  // Ketuvim (Writings), Leningrad-Codex order
  'Ps', 'Prov', 'Job', 'Song', 'Ruth', 'Lam', 'Eccl', 'Esth', 'Dan', 'Ezra', 'Neh', '1Chr', '2Chr'
];

// ─── Book display metadata (fixed, canonical order — see
// FULL_TANAKH_BOOK_LIST above; existing 8 books keep their PRE-EXISTING
// slugs unchanged so nothing keyed to them breaks) ──────────────────────
const BOOK_META = [
  { code: 'Gen', slug: 'gen', display: 'Genesis' },
  { code: 'Exod', slug: 'exod', display: 'Exodus' },
  { code: 'Lev', slug: 'lev', display: 'Leviticus' },
  { code: 'Num', slug: 'num', display: 'Numbers' },
  { code: 'Deut', slug: 'deut', display: 'Deuteronomy' },
  { code: 'Josh', slug: 'josh', display: 'Joshua' },
  { code: 'Judg', slug: 'judg', display: 'Judges' },
  { code: '1Sam', slug: '1sam', display: '1 Samuel' },
  { code: '2Sam', slug: '2sam', display: '2 Samuel' },
  { code: '1Kgs', slug: '1kgs', display: '1 Kings' },
  { code: '2Kgs', slug: '2kgs', display: '2 Kings' },
  { code: 'Isa', slug: 'isa', display: 'Isaiah' },
  { code: 'Jer', slug: 'jer', display: 'Jeremiah' },
  { code: 'Ezek', slug: 'ezek', display: 'Ezekiel' },
  { code: 'Hos', slug: 'hos', display: 'Hosea' },
  { code: 'Joel', slug: 'joel', display: 'Joel' },
  { code: 'Amos', slug: 'amos', display: 'Amos' },
  { code: 'Obad', slug: 'obad', display: 'Obadiah' },
  { code: 'Jonah', slug: 'jonah', display: 'Jonah' },
  { code: 'Mic', slug: 'mic', display: 'Micah' },
  { code: 'Nah', slug: 'nah', display: 'Nahum' },
  { code: 'Hab', slug: 'hab', display: 'Habakkuk' },
  { code: 'Zeph', slug: 'zeph', display: 'Zephaniah' },
  { code: 'Hag', slug: 'hag', display: 'Haggai' },
  { code: 'Zech', slug: 'zech', display: 'Zechariah' },
  { code: 'Mal', slug: 'mal', display: 'Malachi' },
  { code: 'Ps', slug: 'ps', display: 'Psalms' },
  { code: 'Prov', slug: 'prov', display: 'Proverbs' },
  { code: 'Job', slug: 'job', display: 'Job' },
  { code: 'Song', slug: 'song', display: 'Song of Songs' },
  { code: 'Ruth', slug: 'ruth', display: 'Ruth' },
  { code: 'Lam', slug: 'lam', display: 'Lamentations' },
  { code: 'Eccl', slug: 'eccl', display: 'Ecclesiastes' },
  { code: 'Esth', slug: 'esth', display: 'Esther' },
  { code: 'Dan', slug: 'dan', display: 'Daniel' },
  { code: 'Ezra', slug: 'ezra', display: 'Ezra' },
  { code: 'Neh', slug: 'neh', display: 'Nehemiah' },
  { code: '1Chr', slug: '1chr', display: '1 Chronicles' },
  { code: '2Chr', slug: '2chr', display: '2 Chronicles' }
];

// ─── 1. Numeral-lemma exclusion set, read from gate-map.json ──────────────
function loadNumeralStrongsSet() {
  const gateMapDoc = loadGateMap();
  const numeralEntry = gateMapDoc.mappings.find(
    (e) => e.priority === 100 && Array.isArray(e.lemmaStrongs) && e.bbhLesson === 45
  );
  if (!numeralEntry) {
    throw new Error('gen_bbh_advanced_vocab: could not locate the numeral-override gate-map entry (priority 100, bbhLesson 45, lemmaStrongs array) — gate-map.json shape changed?');
  }
  return new Set(numeralEntry.lemmaStrongs);
}

// A card's own `g` field may carry a parenthetical secondary form ("אָח
// (אַחִים)" — singular + plural in one field) and/or " / "-separated
// alternates, mirroring tools/import_oshb_reader.mjs's own
// headwordsFromField (not exported, so reimplemented here at the same
// small scope) — every distinct headword surfaced by either splitting
// rule is its own lookup key onto the SAME card id.
function headwordVariantsOf(g) {
  const out = [];
  for (const alt of String(g || '').split(' / ')) {
    const trimmed = alt.trim();
    const m = trimmed.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (m) {
      if (m[1].trim()) out.push(m[1].trim());
      if (m[2].trim()) out.push(m[2].trim());
    } else if (trimmed) {
      out.push(trimmed);
    }
  }
  return out;
}

// ─── 2. Lesson-card index (route (a): direct depointed-headword match) ────
function buildLessonCardIndex() {
  const { lessons } = buildLessons();
  const cardsByLesson = new Map(); // lessonNumber -> cards[]
  const idByDepointedHeadword = new Map(); // depointed(headword variant) -> card.id (first-seen wins)
  for (const lesson of lessons) {
    cardsByLesson.set(lesson.lessonNumber, lesson.cards);
    for (const card of lesson.cards) {
      for (const variant of headwordVariantsOf(card.g)) {
        const key = stripHebrewPoints(variant);
        if (!key) continue;
        if (!idByDepointedHeadword.has(key)) idByDepointedHeadword.set(key, card.id);
      }
    }
  }
  return { cardsByLesson, idByDepointedHeadword };
}

// ─── 3. Route (b): LEMMA_OVERRIDES note-text headword extraction ──────────
// Every LEMMA_OVERRIDES note follows `'<headword> "<gloss>" ... CSV L<N>
// row [<headword-again>] ...'` — extract the Hebrew-script run right after
// "CSV L<N> row" (most specific) and the leading run before the first
// quote (fallback), split each on " / " and unwrap one level of
// parenthetical alternate, then accept the FIRST candidate that uniquely
// (exactly one card) depointed-matches a card in the override's own
// vocabLesson. No unique match on any candidate => leave unresolved
// (never guess).
const HEB_RUN = '[\\u05D0-\\u05EA][\\u05D0-\\u05EA\\u0591-\\u05C7\\s/()\\u05BE]*[\\u05D0-\\u05EA\\u0591-\\u05C7)]';
const RE_AFTER_ROW = new RegExp(`CSV L\\d+ row\\s+(${HEB_RUN})`);
const RE_LEADING = new RegExp(`^(${HEB_RUN})\\s*"`);

function extractOverrideCandidates(note) {
  const candidates = [];
  const afterRow = note.match(RE_AFTER_ROW);
  if (afterRow) candidates.push(afterRow[1]);
  const leading = note.match(RE_LEADING);
  if (leading) candidates.push(leading[1]);
  return candidates;
}

function splitHeadwordVariants(text) {
  const out = [];
  for (const alt of text.split('/')) {
    const trimmed = alt.trim();
    if (!trimmed) continue;
    const m = trimmed.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (m) {
      if (m[1].trim()) out.push(m[1].trim());
      if (m[2].trim()) out.push(m[2].trim());
    } else {
      out.push(trimmed);
    }
  }
  return out;
}

function resolveOverrideCardId(override, cardsByLesson) {
  const cards = cardsByLesson.get(override.vocabLesson) || [];
  if (!cards.length) return null;
  const candidates = extractOverrideCandidates(override.note).flatMap(splitHeadwordVariants);
  for (const cand of candidates) {
    const key = stripHebrewPoints(cand);
    if (!key) continue;
    const matches = cards.filter((c) => headwordVariantsOf(c.g).some((v) => stripHebrewPoints(v) === key));
    if (matches.length === 1) return matches[0].id;
  }
  return null;
}

// ─── 4. Whole-corpus + per-book content-lemma frequency counting ──────────
// Same content-word simplification as task #15: a token's `strongs`/
// `hasContentSegment` reflects its FIRST noun(non-proper/gentilic)/verb/
// adjective segment only.
function countContentFrequencies({ verses, numeralStrongsSet }) {
  const perBook = new Map(); // bookCode -> Map<strongs, count>
  const global = new Map(); // strongs -> count
  for (const meta of BOOK_META) perBook.set(meta.code, new Map());

  for (const verse of verses) {
    const bookFreq = perBook.get(verse.book);
    if (!bookFreq) continue;
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

// Frequency desc, then Strong's number asc — a total order, deterministic
// regardless of Map iteration order.
function sortedEntries(freqMap) {
  return [...freqMap.entries()].sort((a, b) => (b[1] - a[1]) || (Number(a[0]) - Number(b[0])));
}

// ─── 5. Advanced bucket/card construction ──────────────────────────────────
function buildAdvancedBuckets({ candidates, glossIndex }) {
  const buckets = [];
  for (let bucketStart = 0; bucketStart < candidates.length; bucketStart += ADV_BUCKET_SIZE) {
    const bucketEntries = candidates.slice(bucketStart, bucketStart + ADV_BUCKET_SIZE);
    const rankStart = bucketStart + 1;
    const rankEnd = bucketStart + bucketEntries.length;
    const bucketNum = buckets.length + 1;
    const key = `ADV${String(bucketNum).padStart(2, '0')}`;
    const freqLo = bucketEntries[bucketEntries.length - 1][1];
    const freqHi = bucketEntries[0][1];
    const cards = bucketEntries.map(([strongs, freq], localIdx) => {
      const gloss = glossIndex.get(strongs);
      const g = gloss && gloss.lx ? gloss.lx : null;
      const e = gloss && gloss.gl ? gloss.gl : null;
      if (!g || !e) return null; // dropped: unresolved Strong's dictionary entry
      const subStart = Math.floor(localIdx / ADV_SUB_SIZE) * ADV_SUB_SIZE;
      const subEnd = Math.min(subStart + ADV_SUB_SIZE, bucketEntries.length);
      return {
        id: `bbh-adv-${strongs}`,
        g,
        e,
        translit: romanizeForm(g),
        notes: `Advanced · ${freq}x in corpus`,
        required: true,
        sub: `${subStart + 1}-${subEnd}`
      };
    }).filter(Boolean);
    buckets.push({
      key,
      label: `Advanced ${rankStart}-${rankEnd}`,
      notes: `Corpus frequency rank ${rankStart}-${rankEnd} (occurs ${freqLo}-${freqHi}x in the corpus)`,
      cards
    });
  }
  return buckets;
}

// ─── 6. Book vocab ref-id lists ────────────────────────────────────────────
function buildBookVocabIndex({ perBook, linkedCardIdByStrongs }) {
  const books = [];
  const coverageReport = [];
  BOOK_META.forEach((meta, idx) => {
    const freq = perBook.get(meta.code);
    const totalDistinct = freq.size;
    const entries = sortedEntries(freq).filter(([strongs]) => linkedCardIdByStrongs.has(strongs));
    // Two distinct Strong's numbers can share one lexeme's card (e.g. an
    // OSHB alternate/defective lemma citation like 3212 ילך sharing 1980
    // הָלַךְ's lesson card — see LEMMA_OVERRIDES' own note on 3212). Entries
    // are already frequency-sorted, so keeping first-seen dedupes onto the
    // higher-frequency occurrence without re-sorting.
    const seenRefs = new Set();
    const refs = [];
    for (const [strongs] of entries) {
      const id = linkedCardIdByStrongs.get(strongs);
      if (seenRefs.has(id)) continue;
      seenRefs.add(id);
      refs.push(id);
    }
    books.push({ key: meta.slug, name: meta.display, order: idx + 1, refs });
    coverageReport.push({
      book: meta.display,
      linked: refs.length,
      total: totalDistinct,
      pct: totalDistinct ? Math.round((refs.length / totalDistinct) * 1000) / 10 : 0
    });
  });
  return { books, coverageReport };
}

// ─── 7. Inline validation (no writes if anything fails) ───────────────────
function validate({ buckets, books, lessonIdByDepointedHeadword }) {
  const errors = [];
  const seenAdvIds = new Set();
  const advStrongs = new Set();
  for (const bucket of buckets) {
    if (!bucket.cards.length) errors.push(`bucket ${bucket.key}: empty card list`);
    for (const card of bucket.cards) {
      if (seenAdvIds.has(card.id)) errors.push(`duplicate advanced id: ${card.id}`);
      seenAdvIds.add(card.id);
      advStrongs.add(card.id.replace('bbh-adv-', ''));
      for (const field of ['id', 'g', 'e', 'translit', 'notes', 'sub']) {
        if (!card[field] || typeof card[field] !== 'string' || !card[field].trim()) {
          errors.push(`bucket ${bucket.key} card ${card.id || '(no id)'}: empty/missing field "${field}"`);
        }
      }
      if (lessonIdByDepointedHeadword.has(stripHebrewPoints(card.g))) {
        errors.push(`bucket ${bucket.key} card ${card.id}: headword "${card.g}" leaks a 209-lesson lemma (unpointed match)`);
      }
    }
  }
  const allCardIds = new Set(seenAdvIds);
  // Every book-set ref must resolve to an id present either in the 209
  // lesson cards or in one of this file's own advanced cards.
  for (const book of books) {
    for (const ref of book.refs) {
      const isLessonId = [...lessonIdByDepointedHeadword.values()].includes(ref);
      if (!isLessonId && !allCardIds.has(ref)) {
        errors.push(`book ${book.key}: ref "${ref}" does not resolve to any known lesson or advanced card id`);
      }
    }
    if (new Set(book.refs).size !== book.refs.length) {
      errors.push(`book ${book.key}: duplicate ref ids in the same book list`);
    }
  }
  if (errors.length) {
    throw new Error(`gen_bbh_advanced_vocab: validation failed —\n  ${errors.join('\n  ')}`);
  }
}

// ─── 8. Serialization ───────────────────────────────────────────────────
const HEADER = [
  '// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_advanced_vocab.mjs',
  '// (source: pinned OSHB checkout via source/bbh/reader/corpus-pin.json, pinned',
  '// Strong\'s Hebrew Dictionary checkout via the same file\'s strongsPin,',
  '// source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv via',
  '// tools/gen_bbh_data.mjs\'s buildLessons() for the 209-lesson-card link/',
  '// exclusion set, source/bbh/reader/gate-map.json for the numeral-lemma',
  '// exclusion list)',
  '//',
  '// Task #20 (advanced vocab reworked to the Greek-app model, replacing',
  '// task #15\'s bbh_book_vocab.js): window.BBH_ADVANCED_VOCAB carries the',
  '// corpus-wide descending-frequency advanced-vocab buckets (own id',
  '// namespace bbh-adv-<strongs>, sub-groups of 25 via each card\'s own',
  '// `sub` field) — js/app/main.js\'s mergeAdvancedVocabDecks() merges these',
  '// into window.SETS under their own ADV<NN> keys. window.BBH_BOOK_VOCAB',
  '// carries the per-book LINK index (ordered arrays of EXISTING card ids,',
  '// never new cards) — never merged into window.SETS; resolved at deck-',
  '// build time by js/domain/deck/filters.js\'s resolveBookVocabCards.',
  '//',
  '// Task #23: corpus widened from the Reader\'s 8-book subset to all 39',
  '// OSHB books (the whole Tanakh, same pinned commit) — every rule above',
  '// (content-class filter, proper/gentilic exclusion, min frequency 2,',
  '// bucket/sub-group sizes, id scheme) is unchanged; only the corpus input',
  '// and the Book Vocab book list grew. bbh-adv-<strongs> ids are Strong\'s-',
  '// keyed, so pre-existing saved marks stay valid across this change.',
  '//',
  '// Never edit this file by hand — re-run the generator instead. Never edit',
  '// source/bbh/ from here or anywhere else.',
  ''
].join('\n');

function writeAdvancedVocabFile({ buckets, books }) {
  const strippedBuckets = buckets.map((b) => ({
    key: b.key,
    label: b.label,
    notes: b.notes,
    cards: b.cards.map(({ id, g, e, translit, notes, required, sub }) => ({ id, g, e, translit, notes, required, sub }))
  }));
  const strippedBooks = books.map((b) => ({ key: b.key, name: b.name, order: b.order, refs: b.refs }));
  const advancedJson = JSON.stringify({ schemaVersion: 1, buckets: strippedBuckets }, null, 2);
  const bookJson = JSON.stringify({ schemaVersion: 1, groupSize: BOOK_GROUP_SIZE, books: strippedBooks }, null, 2);
  const parts = [];
  parts.push(HEADER);
  parts.push('(function () {\n');
  parts.push(`  window.BBH_ADVANCED_VOCAB = ${advancedJson.split('\n').join('\n  ')};\n\n`);
  parts.push(`  window.BBH_BOOK_VOCAB = ${bookJson.split('\n').join('\n  ')};\n`);
  parts.push('})();\n');
  return parts.join('');
}

// BOOK_META and FULL_TANAKH_BOOK_LIST are two hand-authored parallel lists
// (one carries display/slug metadata the other doesn't need) — guard
// against them drifting apart silently.
function assertBookMetaMatchesFullList() {
  const metaCodes = BOOK_META.map((m) => m.code);
  if (metaCodes.length !== FULL_TANAKH_BOOK_LIST.length || metaCodes.some((c, i) => c !== FULL_TANAKH_BOOK_LIST[i])) {
    throw new Error('gen_bbh_advanced_vocab: BOOK_META and FULL_TANAKH_BOOK_LIST have drifted apart (order/content mismatch) — keep them in lockstep.');
  }
}

// ─── 9. Top-level build ─────────────────────────────────────────────────
function main() {
  assertBookMetaMatchesFullList();
  const numeralStrongsSet = loadNumeralStrongsSet();
  const { cardsByLesson, idByDepointedHeadword } = buildLessonCardIndex();

  const { verses } = importReaderCorpus({ verifyPin: true, books: FULL_TANAKH_BOOK_LIST });
  const { perBook, global } = countContentFrequencies({ verses, numeralStrongsSet });

  const distinctStrongs = [...global.keys()].sort((a, b) => Number(a) - Number(b));
  const { index: glossIndex, resolved, missing } = buildGlossIndex(distinctStrongs);

  // Route (a): direct depointed-headword match, keyed by Strong's number.
  const lessonCardIdByStrongs = new Map();
  for (const strongs of distinctStrongs) {
    const gloss = glossIndex.get(strongs);
    if (!gloss || !gloss.lx) continue;
    const key = stripHebrewPoints(gloss.lx);
    if (idByDepointedHeadword.has(key)) lessonCardIdByStrongs.set(strongs, idByDepointedHeadword.get(key));
  }
  // Route (b): LEMMA_OVERRIDES note-text extraction, validated.
  let overrideResolved = 0;
  let overrideUnresolved = 0;
  for (const [strongs, override] of LEMMA_OVERRIDES) {
    if (override.vocabLesson == null) continue;
    if (lessonCardIdByStrongs.has(strongs)) continue;
    const id = resolveOverrideCardId(override, cardsByLesson);
    if (id) {
      lessonCardIdByStrongs.set(strongs, id);
      overrideResolved++;
    } else {
      overrideUnresolved++;
    }
  }

  function isLessonLemma(strongs) {
    const override = LEMMA_OVERRIDES.get(strongs);
    if (override && override.vocabLesson != null) return true;
    return lessonCardIdByStrongs.has(strongs);
  }

  // Advanced bucket candidates: content lemmas, not lesson lemmas, min freq.
  const advancedCandidates = sortedEntries(global).filter(
    ([strongs, freq]) => freq >= ADV_MIN_FREQUENCY && !isLessonLemma(strongs)
  );
  const buckets = buildAdvancedBuckets({ candidates: advancedCandidates, glossIndex });

  // Combined link map for book vocab: lesson-linked ∪ advanced-linked.
  const linkedCardIdByStrongs = new Map(lessonCardIdByStrongs);
  for (const bucket of buckets) {
    for (const card of bucket.cards) {
      linkedCardIdByStrongs.set(card.id.replace('bbh-adv-', ''), card.id);
    }
  }

  const { books, coverageReport } = buildBookVocabIndex({ perBook, linkedCardIdByStrongs });

  validate({ buckets, books, lessonIdByDepointedHeadword: idByDepointedHeadword });

  writeFileSync(OUT_PATH, writeAdvancedVocabFile({ buckets, books }));

  const totalAdvCards = buckets.reduce((n, b) => n + b.cards.length, 0);
  console.log(`Wrote ${path.relative(ROOT, OUT_PATH)}`);
  console.log(`Strong's glosses resolved: ${resolved}/${distinctStrongs.length} (missing: ${missing.length}${missing.length ? ' -> ' + missing.slice(0, 10).join(',') : ''})`);
  console.log(`Lesson links: ${lessonCardIdByStrongs.size} strongs (route b resolved: ${overrideResolved}, unresolved: ${overrideUnresolved})`);
  console.log(`Advanced: ${buckets.length} buckets / ${totalAdvCards} cards (candidates before gloss-drop: ${advancedCandidates.length})`);
  for (const book of coverageReport) {
    console.log(`  ${book.book}: ${book.linked}/${book.total} linked (${book.pct}%)`);
  }
}

function isMainModule() {
  return path.resolve(process.argv[1] || '') === path.resolve(fileURLToPath(import.meta.url));
}
if (isMainModule()) main();

export { loadNumeralStrongsSet, countContentFrequencies, sortedEntries, extractOverrideCandidates, splitHeadwordVariants };
