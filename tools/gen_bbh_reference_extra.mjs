#!/usr/bin/env node
// GENERATED FILE PRODUCER — do not hand-edit js/data/bbh_reference_extra.js.
// Regenerate: node tools/gen_bbh_reference_extra.mjs
// (sources: source/bbh/alphabet.json, source/bbh/vowels.json,
//  source/bbh/parsing/paradigms.json)
//
// Sibling-file design choice (not folded into tools/gen_bbh_data.mjs /
// js/data/bbh_reference_data.js): bbh_reference_data.js is the Phase-1
// per-lesson revision-concept feed already consumed by pages/memorization.html;
// emitting this expanded paradigm/chart content into a new sibling file keeps
// that existing generator+output byte-shape completely undisturbed (zero risk
// of an accidental diff there) while still living next to it under js/data/.
//
// Emits js/data/bbh_reference_extra.js, a classic self-registering script:
//   window.BBH_REFERENCE_EXTRA = { schemaVersion, sections: [...] }
// Each section: { id, title, columns, rows, sourceRef, appendixOnly?,
//                  introducedLesson?, footnotes? }
// Each row: { id, cells, introducedLesson, appendixOnly, ambiguityNote }
//
// Sections are entirely derived from committed, hand-verified source files —
// never hand-written here. Never edit source/bbh/ from this script.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ALPHABET_PATH = path.join(ROOT, 'source/bbh/alphabet.json');
const VOWELS_PATH = path.join(ROOT, 'source/bbh/vowels.json');
const PARADIGMS_PATH = path.join(ROOT, 'source/bbh/parsing/paradigms.json');
const OUT_PATH = path.join(ROOT, 'js/data/bbh_reference_extra.js');

const SCHEMA_VERSION = 1;

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

// ─── shared helpers ─────────────────────────────────────────────────────
function sourceSortKey(src) {
  if (!src) return '9';
  if (src.lesson != null) {
    return `0-${String(src.lesson).padStart(3, '0')}-${String(src.page).padStart(6, '0')}`;
  }
  const m = String(src.page).match(/(\d+)/);
  const pageNum = m ? m[1] : '0';
  return `1-${src.appendix}-${String(pageNum).padStart(6, '0')}`;
}

// Splits a page label into a numeric run so adjacent pages can be detected:
// "23" -> { prefix: "", num: 23 }; "a-14" -> { prefix: "a-", num: 14 }.
// Returns null when the page has no trailing digits to compare.
function parsePageRun(page) {
  const m = String(page).match(/^(.*?)(\d+)$/);
  if (!m) return null;
  return { prefix: m[1], num: parseInt(m[2], 10) };
}

// Groups a same-lesson/same-appendix run of refs (already page-sorted) into
// contiguous-page runs, e.g. pages [22, 23] -> one run of two pages.
function buildContiguousRuns(items) {
  const runs = [];
  for (const item of items) {
    const parsed = parsePageRun(item.page);
    const last = runs[runs.length - 1];
    if (parsed && last && last.parsedLast && parsed.prefix === last.parsedLast.prefix && parsed.num === last.parsedLast.num + 1) {
      last.pages.push(item.page);
      last.parsedLast = parsed;
    } else {
      runs.push({ base: item, pages: [item.page], parsedLast: parsed });
    }
  }
  return runs;
}

// Merges refs that share a lesson (or appendix) into a single ref per group:
// a contiguous run of pages becomes "first-last" (e.g. "22-23"); multiple
// runs within the same group are comma-joined (e.g. "22-23, 25"). A group
// with only one page is left untouched (no pageCount marker added) so the
// renderer's singular "p." label is unaffected. sourceRef entries must
// already be sorted by sourceSortKey (same-lesson/appendix pages adjacent)
// before calling this.
function mergeAdjacentSourceRefs(sortedRefs) {
  const groups = [];
  for (const r of sortedRefs) {
    const key = r.lesson != null ? `L${r.lesson}` : `A${r.appendix}`;
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(r);
    else groups.push({ key, items: [r] });
  }
  const merged = [];
  for (const g of groups) {
    const runs = buildContiguousRuns(g.items);
    if (runs.length === 1 && runs[0].pages.length === 1) {
      merged.push(runs[0].base);
      continue;
    }
    const pageStr = runs
      .map((run) => (run.pages.length > 1 ? `${run.pages[0]}-${run.pages[run.pages.length - 1]}` : `${run.pages[0]}`))
      .join(', ');
    const totalPages = runs.reduce((n, run) => n + run.pages.length, 0);
    merged.push({ ...runs[0].base, page: pageStr, pageCount: totalPages });
  }
  return merged;
}

function dedupedSortedSourceRefs(items, sourceOf) {
  const map = new Map();
  for (const item of items) {
    const src = sourceOf(item);
    if (!src) continue;
    const key = JSON.stringify(src);
    if (!map.has(key)) map.set(key, src);
  }
  const sorted = [...map.values()].sort((a, b) => sourceSortKey(a).localeCompare(sourceSortKey(b)));
  return mergeAdjacentSourceRefs(sorted);
}

function humanize(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  const s = String(v);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── alphabet-chart ─────────────────────────────────────────────────────
function buildAlphabetChartSection(data) {
  const letters = [...data.letters].sort((a, b) => a.order - b.order);
  const columns = ['Letter', 'Final', 'Name (Hebrew)', 'Name (English)', 'Sound', 'Begadkefat', 'Guttural'];
  const rows = letters.map((l) => ({
    id: `alphabet-chart-${l.order}`,
    cells: [l.letter, l.finalForm || '—', l.nameHebrew, l.nameEnglish, l.sound, l.begadkefat ? 'Yes' : 'No', l.guttural ? 'Yes' : 'No'],
    introducedLesson: l.source.lesson,
    appendixOnly: false,
    ambiguityNote: l.notes || null
  }));
  const sourceRef = dedupedSortedSourceRefs(letters, (l) => l.source);
  return {
    id: 'alphabet-chart',
    title: 'Hebrew Alphabet (23 Letters)',
    columns,
    rows,
    sourceRef,
    introducedLesson: 1
  };
}

// ─── vowel-chart ────────────────────────────────────────────────────────
function buildVowelChartSection(data) {
  const vowels = [...data.vowels].sort((a, b) => a.order - b.order);
  const columns = ['Sign', 'Name (Hebrew)', 'Name (English)', 'Sound class', 'Length', 'Sound', 'Mater'];
  const rows = vowels.map((v) => ({
    id: `vowel-chart-${v.order}`,
    cells: [v.sign, v.nameHebrew, v.nameEnglish, v.soundClass, v.length, v.sound, v.mater || '—'],
    introducedLesson: v.source.lesson,
    appendixOnly: false,
    ambiguityNote: v.notes || null
  }));
  const sourceRef = dedupedSortedSourceRefs(vowels, (v) => v.source);
  const footnotes = (data.shevaRules || []).map((r, idx) => ({
    id: `vowel-chart-sheva-rule-${idx + 1}`,
    text: r.rule,
    source: r.source
  }));
  return {
    id: 'vowel-chart',
    title: 'Vowel Points (Niqqud) + Shva Rules',
    columns,
    rows,
    sourceRef,
    footnotes,
    introducedLesson: 2
  };
}

// ─── generic paradigm-table section builder ────────────────────────────
const AXIS_KEYS = ['person', 'gender', 'number', 'deixis', 'state', 'definite'];
const AXIS_LABELS = {
  person: 'Person',
  gender: 'Gender',
  number: 'Number',
  deixis: 'Deixis',
  state: 'State',
  definite: 'Definite'
};
const GENDER_CODE = { masculine: 'm', feminine: 'f', common: 'c' };
const NUMBER_CODE = { singular: 's', plural: 'p', dual: 'd' };

function primaryParse(form) {
  return (form.acceptedParses && form.acceptedParses[0]) || {};
}

function suffixCode(sfx) {
  if (!sfx) return '';
  const g = GENDER_CODE[sfx.gender] || sfx.gender || '';
  const n = NUMBER_CODE[sfx.number] || sfx.number || '';
  return `${sfx.person || ''}${g}${n}`;
}

function buildParadigmSection(id, byId) {
  const p = byId[id];
  if (!p) throw new Error(`paradigm not found in source/bbh/parsing/paradigms.json: ${id}`);
  const forms = p.forms;
  if (!Array.isArray(forms) || forms.length === 0) {
    throw new Error(`paradigm "${id}" has no forms`);
  }

  // Which simple (non-suffix) axes actually vary across this paradigm's forms.
  const axisValueSets = {};
  for (const f of forms) {
    const ap = primaryParse(f);
    for (const k of AXIS_KEYS) {
      if (ap[k] !== undefined && ap[k] !== null) {
        (axisValueSets[k] = axisValueSets[k] || new Set()).add(JSON.stringify(ap[k]));
      }
    }
  }
  const activeAxisKeys = AXIS_KEYS.filter((k) => axisValueSets[k] && axisValueSets[k].size > 1);

  const hasSuffix = forms.some((f) => primaryParse(f).suffix != null);
  const hasNote = forms.some((f) => f.note);

  // A "Word" column earns its place only when this table bundles more than
  // one headword/root family (i.e. some forms genuinely share a lemma) —
  // for single-paradigm tables (e.g. one pronoun set) lemma === display for
  // every row and the column would be pure noise.
  const lemmaCount = new Set(forms.map((f) => f.lemma)).size;
  const useLemmaColumn = lemmaCount > 1 && lemmaCount < forms.length;

  const columns = [];
  if (useLemmaColumn) columns.push('Word');
  for (const k of activeAxisKeys) columns.push(AXIS_LABELS[k]);
  if (hasSuffix) columns.push('Suffix');
  columns.push('Hebrew');
  if (hasNote) columns.push('Gloss / note');

  const rows = forms.map((f) => {
    const ap = primaryParse(f);
    const cells = [];
    if (useLemmaColumn) cells.push(f.lemma || '');
    for (const k of activeAxisKeys) cells.push(humanize(ap[k]));
    if (hasSuffix) cells.push(suffixCode(ap.suffix));
    cells.push(f.display);
    if (hasNote) cells.push(f.note || '');

    const appendixOnly = f.appendixOnly === true;
    const introducedLesson = appendixOnly
      ? null
      : f.introducedLesson != null
        ? f.introducedLesson
        : p.introducedLesson != null
          ? p.introducedLesson
          : null;

    return {
      id: f.id,
      cells,
      introducedLesson,
      appendixOnly,
      ambiguityNote: f.ambiguityNote || null
    };
  });

  const sourceRef = dedupedSortedSourceRefs(forms, (f) => f.source || p.source);
  const sectionAppendixOnly = forms.every((f) => f.appendixOnly === true);

  const section = {
    id,
    title: p.label,
    columns,
    rows,
    sourceRef
  };
  if (sectionAppendixOnly) {
    section.appendixOnly = true;
  } else if (p.introducedLesson != null) {
    section.introducedLesson = p.introducedLesson;
  }
  return section;
}

// ─── Task 3 scope: the explicit list of paradigm ids to render ─────────
// Order mirrors the grouping in docs/bbh-conversion-plan.md's Phase 2
// ledger / the PR E prompt (pronouns -> demonstratives -> attached
// pronouns -> prepositions+suffixes -> ל-possession -> Qal strong verb ->
// היה -> derived binyanim recognition -> noun endings/construct ->
// irregular nouns -> segolates -> numerals -> interrogatives).
const PARADIGM_SECTION_IDS = [
  'pron-subject',
  'pron-demonstrative',
  'noun-attached-sg',
  'noun-attached-pl',
  'particle-prep-attached-el',
  'particle-prep-attached-al',
  'particle-prep-attached-ad',
  'particle-prep-attached-tachat',
  'particle-prep-attached-kmo',
  'particle-prep-attached-mn',
  'particle-object-marker',
  'particle-l-possession',
  'verb-qal-perfect',
  'verb-qal-imperfect',
  'verb-past-narrative',
  'verb-qal-infinitive',
  'verb-qal-adverbial-infinitive',
  'verb-qal-participle',
  'verb-qal-imperative',
  'verb-qal-jussive',
  'verb-haya-perfect',
  'verb-haya-imperfect',
  'verb-piel-recognition',
  'verb-hifil-recognition',
  'verb-nifal-recognition',
  'verb-hitpael-recognition',
  'verb-pual-appendix',
  'noun-endings',
  'noun-bound-construct',
  'noun-irregular',
  'noun-irregular-bayit',
  'noun-irregular-ir',
  'noun-irregular-yom',
  'noun-segolate',
  'numeral-cardinal-1-10',
  'numeral-ordinal-1-10',
  'numeral-11-19',
  'numeral-tens',
  'numeral-hundreds',
  'particle-interrogative-words'
];

// Textbook-order sort (task #19 addendum A): non-appendix sections are
// ordered by earliest source lesson ascending — alphabet (L1), vowels
// (L2/L3), then each paradigm section by its introducedLesson. Appendix-only
// sections (never printed inside a numbered lesson) are excluded from that
// sort and kept as a separate trailing group, in their original relative
// order, for the renderer's collapsed "Appendix forms" group. Array.sort is
// stable (spec-guaranteed since ES2019 / all supported Node versions), so
// ties keep PARADIGM_SECTION_IDS's authored order deterministically.
function sectionEarliestLesson(section) {
  if (section.introducedLesson != null) return section.introducedLesson;
  const refLessons = (section.sourceRef || []).filter((r) => r.lesson != null).map((r) => r.lesson);
  if (refLessons.length) return Math.min(...refLessons);
  const rowLessons = (section.rows || []).filter((r) => r.introducedLesson != null).map((r) => r.introducedLesson);
  if (rowLessons.length) return Math.min(...rowLessons);
  return Infinity;
}

function sortSectionsByLesson(sections) {
  const dated = sections.filter((s) => !s.appendixOnly);
  const appendixOnly = sections.filter((s) => s.appendixOnly);
  dated.sort((a, b) => sectionEarliestLesson(a) - sectionEarliestLesson(b));
  return [...dated, ...appendixOnly];
}

function buildSections() {
  const alphabetData = readJson(ALPHABET_PATH);
  const vowelsData = readJson(VOWELS_PATH);
  const paradigmsData = readJson(PARADIGMS_PATH);
  const byId = Object.fromEntries(paradigmsData.paradigms.map((p) => [p.id, p]));

  const sections = [];
  sections.push(buildAlphabetChartSection(alphabetData));
  sections.push(buildVowelChartSection(vowelsData));
  for (const id of PARADIGM_SECTION_IDS) {
    sections.push(buildParadigmSection(id, byId));
  }
  return sortSectionsByLesson(sections);
}

function writeReferenceExtraFile(sections) {
  const payload = { schemaVersion: SCHEMA_VERSION, sections };
  const json = JSON.stringify(payload, null, 2);
  const parts = [];
  parts.push(
    '// GENERATED FILE — do not edit. Regenerate: node tools/gen_bbh_reference_extra.mjs\n' +
      '// (sources: source/bbh/alphabet.json, source/bbh/vowels.json, source/bbh/parsing/paradigms.json)\n'
  );
  parts.push('// Expanded reference tables (alphabet/vowel charts + paradigm tables) for the\n');
  parts.push('// Reference page. Self-registers on window.BBH_REFERENCE_EXTRA, a sibling of\n');
  parts.push('// window.BBH_REFERENCE (js/data/bbh_reference_data.js) — see the header comment\n');
  parts.push('// in tools/gen_bbh_reference_extra.mjs for why this is a separate file.\n\n');
  parts.push('(function () {\n');
  parts.push(`  window.BBH_REFERENCE_EXTRA = ${json.split('\n').map((l, i) => (i === 0 ? l : '  ' + l)).join('\n')};\n`);
  parts.push('})();\n');
  return parts.join('');
}

function main() {
  const sections = buildSections();
  writeFileSync(OUT_PATH, writeReferenceExtraFile(sections));
  console.log(`Wrote ${OUT_PATH}`);
  console.log(`Sections: ${sections.length} (2 charts + ${sections.length - 2} paradigm tables)`);
  const totalRows = sections.reduce((sum, s) => sum + s.rows.length, 0);
  console.log(`Total rows across sections: ${totalRows}`);
}

main();
