#!/usr/bin/env node
// Validator for the BBH Phase 2 Grammar Quiz source file:
// source/bbh/grammar/questions.json. This is a hand-maintained, independently
// reviewed authoritative source (never generated) — see
// tools/gen_bbh_grammar_data.mjs (Phase 2 PR C) for the generator that
// consumes it. Mirrors the style of tools/validate_bbh_parsing_data.mjs.
//
// Designed to pass on the empty `questions: []` skeleton that ships before
// the bank is populated, and to keep validating once it is populated.
//
// Enforces the question-object schema described in the spec shared with the
// authoring agents (see docs/bbh-conversion-plan.md "Phase 2 architecture
// decisions" item 4), plus a set of anti-giveaway lints so a lazy test-taker
// can't pattern-match the answer key without knowing Hebrew grammar:
//   - length outliers, choice-set style outliers, forbidden "all/none of the
//     above", absolutes ("always"/"never") in exactly one choice (warning),
//     duplicate/near-duplicate choices (tiny inline Levenshtein), prompt-echo,
//     correct-position balance (overall + per 10-lesson gate block),
//     true/false balance, per-lesson coverage (non-fatal report), and a
//     gate-sanity scan for grammar terms that shouldn't appear before the
//     lesson that introduces them.
//
// Exits nonzero (via process.exitCode) with a category-tagged message per
// violation found. Collects all violations across a run rather than
// stopping at the first, so a single invocation surfaces as much as
// possible. Non-fatal findings (coverage report, absolutes warning) are
// printed separately and do NOT affect the exit code.
//
// Usage: node tools/validate_bbh_grammar_data.mjs [--file <path>]
//   --file lets a fixture/self-test point the validator at an alternate
//   questions.json-shaped file instead of the real source (used by the
//   fixture self-test documented in the Phase 2 grammar PR; the real source
//   is always used when --file is omitted).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const out = { file: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--file') {
      out.file = argv[i + 1];
      i++;
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const QUESTIONS_PATH = args.file
  ? path.resolve(process.cwd(), args.file)
  : path.join(ROOT, 'source/bbh/grammar/questions.json');

const TOTAL_LESSONS = 50;
const ID_RE = /^[a-z0-9][a-z0-9-]*$/;
const KEBAB_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const APPENDIX_PAGE_RE = /^a-\d+$/;

const QUESTION_TYPES = new Set([
  'identify-form', 'distinguish-rule', 'correct-phrase',
  'apply-rule', 'diagnose-change', 'interpret-context', 'true-false'
]);
const DIFFICULTY_VALUES = new Set(['core', 'stretch']);
const REVIEW_STATUS_VALUES = new Set(['draft', 'reviewed']);
const PROVENANCE_VALUES = new Set(['textbook-fact', 'original-example', 'public-mt']);

const failures = [];
const nonFatal = [];
function fail(category, message) {
  failures.push(`[${category}] ${message}`);
}
function note(message) {
  nonFatal.push(message);
}

function readJson(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    fail('parse', `${filePath} is not valid JSON: ${err.message}`);
    return null;
  }
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim() !== '';
}

// ─── Tiny inline Levenshtein (edit distance) ───────────────────────────────
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,      // deletion
        curr[j - 1] + 1,  // insertion
        prev[j - 1] + cost // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// ─── Gate-sanity term whitelist (tuned here; not source data) ─────────────
// Term -> earliest lesson at which it may appear in prompt/choices/explanation
// (word-boundary, case-insensitive, English only — Hebrew text is not
// scanned). A question gated (introducedLesson) before that lesson may not
// mention the term. "Appendix-only" concepts (pual/hofal) never appear in
// any lesson-gated question — encoded here as Infinity.
const GATE_TERMS = [
  { term: 'piel', earliestLesson: 29 },
  { term: 'hifil', earliestLesson: 29 },
  { term: 'nifal', earliestLesson: 37 },
  { term: 'hitpael', earliestLesson: 37 },
  { term: 'pual', earliestLesson: Infinity },
  { term: 'hofal', earliestLesson: Infinity },
  { term: 'past narrative', earliestLesson: 35 },
  { term: 'participle', earliestLesson: 42 },
  { term: 'jussive', earliestLesson: 39 },
  { term: 'imperative', earliestLesson: 39 },
  { term: 'bound', earliestLesson: 20 },
  { term: 'construct', earliestLesson: 20 },
  { term: 'imperfect', earliestLesson: 23 },
  { term: 'perfect', earliestLesson: 15 }
];

function gateTermRegex(term) {
  // Word-boundary, case-insensitive; escape any regex metachars (none of the
  // current terms have any, but stay safe for future entries with e.g. a
  // hyphen — hyphen is not a regex metachar so no escaping needed there).
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i');
}

function checkGateSanity(q, label) {
  const haystacks = [
    ['prompt', q.prompt],
    ...(Array.isArray(q.choices) ? q.choices.map((c, i) => [`choices[${i}]`, c]) : []),
    ['explanation', q.explanation]
  ];
  for (const { term, earliestLesson } of GATE_TERMS) {
    if (q.introducedLesson >= earliestLesson) continue; // in scope, allowed
    const re = gateTermRegex(term);
    for (const [field, text] of haystacks) {
      if (typeof text === 'string' && re.test(text)) {
        fail(
          'gate-sanity',
          `${label}: ${field} mentions "${term}" but introducedLesson=${q.introducedLesson} ` +
          `is before its earliest allowed lesson (${earliestLesson === Infinity ? 'appendix-only' : earliestLesson})`
        );
      }
    }
  }
}

// ─── Per-question structural validation ────────────────────────────────────
function validateSource(source, label) {
  if (!isPlainObject(source)) {
    fail('source-shape', `${label}: source is not an object`);
    return;
  }
  const hasLesson = 'lesson' in source;
  const hasAppendix = 'appendix' in source;
  if (hasLesson === hasAppendix) {
    fail('source-shape', `${label}: source must have exactly one of {lesson,page} or {appendix,page}`);
    return;
  }
  if (hasLesson) {
    if (!Number.isInteger(source.lesson) || source.lesson < 1 || source.lesson > TOTAL_LESSONS) {
      fail('source-shape', `${label}: source.lesson "${source.lesson}" not an integer in 1..${TOTAL_LESSONS}`);
    }
    if (!Number.isInteger(source.page)) {
      fail('source-shape', `${label}: source.page must be an integer for a lesson source, got ${JSON.stringify(source.page)}`);
    }
  } else {
    if (!['A', 'B', 'C'].includes(source.appendix)) {
      fail('source-shape', `${label}: source.appendix "${source.appendix}" not one of A/B/C`);
    }
    if (typeof source.page !== 'string' || !APPENDIX_PAGE_RE.test(source.page)) {
      fail('source-shape', `${label}: source.page "${source.page}" does not match ^a-\\d+$`);
    }
  }
}

function normalizeForDup(s) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function endingPunct(s) {
  const m = s.trim().match(/([.!?])$/);
  return m ? m[1] : '';
}

function leadingCapital(s) {
  const t = s.trim();
  return t.length > 0 && /[A-Za-z]/.test(t[0]) && t[0] === t[0].toUpperCase() && t[0] !== t[0].toLowerCase();
}

function wordsOf(s) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// Longest verbatim shared word n-gram (n>=4) between two word-token arrays.
function longestSharedRun(a, b) {
  let best = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      let k = 0;
      while (i + k < a.length && j + k < b.length && a[i + k] === b[j + k]) k++;
      if (k > best) best = k;
    }
  }
  return best;
}

function checkAntiGiveaway(q, label) {
  const choices = q.choices;
  if (!Array.isArray(choices) || choices.some((c) => typeof c !== 'string')) return; // structural check already failed this

  const trimmed = choices.map((c) => c.trim());
  const correctIdx = q.correctIndex;
  const correct = trimmed[correctIdx];

  // Forbidden strings.
  for (let i = 0; i < trimmed.length; i++) {
    const lower = trimmed[i].toLowerCase();
    if (lower.includes('all of the above') || lower.includes('none of the above')) {
      fail('anti-giveaway', `${label}: choices[${i}] contains a forbidden "all/none of the above" phrase`);
    }
  }

  // Duplicate / near-duplicate choices.
  for (let i = 0; i < trimmed.length; i++) {
    for (let j = i + 1; j < trimmed.length; j++) {
      const a = trimmed[i];
      const b = trimmed[j];
      if (normalizeForDup(a) === normalizeForDup(b)) {
        fail('anti-giveaway', `${label}: choices[${i}] and choices[${j}] are duplicate (case/whitespace-insensitive)`);
        continue;
      }
      if (a.length > 8 && b.length > 8 && levenshtein(a, b) <= 2) {
        fail('anti-giveaway', `${label}: choices[${i}] and choices[${j}] are near-duplicate (edit distance <= 2)`);
      }
    }
  }

  if (typeof correct === 'string' && correctIdx >= 0 && correctIdx < trimmed.length) {
    // Length outlier: correct uniquely longest or shortest by >30% vs EVERY distractor.
    const distractors = trimmed.filter((_, i) => i !== correctIdx);
    if (distractors.length > 0) {
      const correctLen = correct.length;
      const allLonger = distractors.every((d) => correctLen > d.length * 1.3);
      const allShorter = distractors.every((d) => correctLen * 1.3 < d.length);
      if (allLonger) {
        fail('anti-giveaway', `${label}: correct choice (index ${correctIdx}) is >30% longer than every distractor`);
      }
      if (allShorter) {
        fail('anti-giveaway', `${label}: correct choice (index ${correctIdx}) is >30% shorter than every distractor`);
      }
    }

    // Style outliers: exactly one choice differs in ending punctuation or
    // leading capitalization from the rest.
    if (trimmed.length >= 3) {
      const puncts = trimmed.map(endingPunct);
      const punctCounts = new Map();
      for (const p of puncts) punctCounts.set(p, (punctCounts.get(p) || 0) + 1);
      for (const [p, count] of punctCounts) {
        if (count === 1 && punctCounts.size >= 2) {
          const idx = puncts.indexOf(p);
          fail('anti-giveaway', `${label}: choices[${idx}] is a style outlier (ending punctuation "${p || '<none>'}" unique among choices)`);
        }
      }
      const caps = trimmed.map(leadingCapital);
      const capTrueCount = caps.filter(Boolean).length;
      const capFalseCount = caps.length - capTrueCount;
      if (capTrueCount === 1 || capFalseCount === 1) {
        const idx = capTrueCount === 1 ? caps.indexOf(true) : caps.indexOf(false);
        fail('anti-giveaway', `${label}: choices[${idx}] is a style outlier (leading capitalization unique among choices)`);
      }
    }

    // Prompt-echo: correct choice shares a >=4-word verbatim run with the
    // prompt that no distractor shares.
    if (isNonEmptyString(q.prompt)) {
      const promptWords = wordsOf(q.prompt);
      const correctRun = longestSharedRun(promptWords, wordsOf(correct));
      if (correctRun >= 4) {
        const anyDistractorShares = distractors.some((d) => longestSharedRun(promptWords, wordsOf(d)) >= correctRun);
        if (!anyDistractorShares) {
          fail('anti-giveaway', `${label}: correct choice (index ${correctIdx}) echoes a >=4-word run from the prompt that no distractor shares`);
        }
      }
    }
  }

  // Absolutes: "always"/"never" appearing in exactly one choice (warning, non-fatal).
  for (const word of ['always', 'never']) {
    const re = new RegExp(`\\b${word}\\b`, 'i');
    const hits = trimmed.map((c) => re.test(c));
    const hitCount = hits.filter(Boolean).length;
    if (hitCount === 1) {
      note(`${label}: choices[${hits.indexOf(true)}] is the only choice containing "${word}"`);
    }
  }
}

function validateQuestion(q, idsSeen) {
  const idOk = isNonEmptyString(q.id) && ID_RE.test(q.id);
  if (!isNonEmptyString(q.id)) {
    fail('question-id', `question has missing/empty id`);
  } else if (!ID_RE.test(q.id)) {
    fail('question-id', `question id "${q.id}" does not match ^[a-z0-9][a-z0-9-]*$`);
  } else if (idsSeen.has(q.id)) {
    fail('question-id', `duplicate question id "${q.id}"`);
  } else {
    idsSeen.add(q.id);
  }
  const label = idOk ? `question "${q.id}"` : 'question <unidentified>';

  if (!Number.isInteger(q.introducedLesson) || q.introducedLesson < 1 || q.introducedLesson > TOTAL_LESSONS) {
    fail('gate', `${label}: introducedLesson "${q.introducedLesson}" not an integer in 1..${TOTAL_LESSONS}`);
  }
  if ('reviewThroughLesson' in q && q.reviewThroughLesson !== undefined) {
    if (!Number.isInteger(q.reviewThroughLesson) || q.reviewThroughLesson < 1 || q.reviewThroughLesson > TOTAL_LESSONS) {
      fail('gate', `${label}: reviewThroughLesson "${q.reviewThroughLesson}" not an integer in 1..${TOTAL_LESSONS}`);
    }
  }

  if (!QUESTION_TYPES.has(q.type)) {
    fail('question-type', `${label}: type "${q.type}" not in whitelist`);
  }
  if (!DIFFICULTY_VALUES.has(q.difficulty)) {
    fail('question-difficulty', `${label}: difficulty "${q.difficulty}" not in {core,stretch}`);
  }
  if (!isNonEmptyString(q.prompt)) {
    fail('question-prompt', `${label}: prompt is empty`);
  }

  const isTrueFalse = q.type === 'true-false';
  const expectedChoiceCount = isTrueFalse ? 2 : 4;
  if (!Array.isArray(q.choices)) {
    fail('question-choices', `${label}: choices is not an array`);
  } else {
    if (q.choices.length !== expectedChoiceCount) {
      fail('question-choices', `${label}: choices has ${q.choices.length} entries, expected exactly ${expectedChoiceCount}`);
    }
    const seen = new Set();
    q.choices.forEach((c, i) => {
      if (!isNonEmptyString(c)) {
        fail('question-choices', `${label}: choices[${i}] is empty`);
        return;
      }
      const key = normalizeForDup(c);
      if (seen.has(key)) {
        fail('question-choices', `${label}: choices[${i}] duplicates an earlier choice (case/whitespace-insensitive)`);
      }
      seen.add(key);
    });
  }

  if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || (Array.isArray(q.choices) && q.correctIndex >= q.choices.length)) {
    fail('question-correct-index', `${label}: correctIndex "${q.correctIndex}" is not a valid index into choices`);
  }

  if (!isNonEmptyString(q.explanation)) {
    fail('question-explanation', `${label}: explanation is empty`);
  }

  validateSource(q.source, label);

  if (!Array.isArray(q.conceptTags) || q.conceptTags.length === 0) {
    fail('question-concept-tags', `${label}: conceptTags must be a non-empty array`);
  } else {
    q.conceptTags.forEach((tag, i) => {
      if (typeof tag !== 'string' || !KEBAB_RE.test(tag)) {
        fail('question-concept-tags', `${label}: conceptTags[${i}] "${tag}" is not kebab-case`);
      }
    });
  }

  if (!PROVENANCE_VALUES.has(q.exampleProvenance)) {
    fail('question-provenance', `${label}: exampleProvenance "${q.exampleProvenance}" not in {textbook-fact,original-example,public-mt}`);
  } else if (q.exampleProvenance === 'public-mt') {
    if (!isNonEmptyString(q.verseRef)) {
      fail('question-provenance', `${label}: exampleProvenance is "public-mt" but verseRef is missing/empty`);
    }
  }

  if (!REVIEW_STATUS_VALUES.has(q.reviewStatus)) {
    fail('question-review-status', `${label}: reviewStatus "${q.reviewStatus}" not in {draft,reviewed}`);
  }

  // Anti-giveaway lints (structural prerequisites already checked above;
  // these still run defensively against whatever shape exists).
  checkAntiGiveaway(q, label);
  if (Number.isInteger(q.introducedLesson)) checkGateSanity(q, label);

  return { idOk, label, isTrueFalse };
}

// ─── Bank-wide balance checks ───────────────────────────────────────────────
function checkPositionBalance(questions) {
  const nonTF = questions.filter((q) => q.type !== 'true-false' && Number.isInteger(q.correctIndex));
  if (nonTF.length >= 40) {
    const counts = [0, 0, 0, 0];
    for (const q of nonTF) {
      if (q.correctIndex >= 0 && q.correctIndex <= 3) counts[q.correctIndex]++;
    }
    counts.forEach((count, pos) => {
      const pct = (count / nonTF.length) * 100;
      if (pct < 15 || pct > 35) {
        fail(
          'position-balance',
          `overall correct-answer position ${pos} holds ${pct.toFixed(1)}% of ${nonTF.length} non-true-false questions ` +
          `(must be 15-35% once bank has >=40 such questions)`
        );
      }
    });
  }

  // Per contiguous 10-lesson gate block.
  for (let blockStart = 1; blockStart <= 41; blockStart += 10) {
    const blockEnd = blockStart + 9;
    const blockQs = nonTF.filter((q) => q.introducedLesson >= blockStart && q.introducedLesson <= blockEnd);
    if (blockQs.length >= 12) {
      const counts = [0, 0, 0, 0];
      for (const q of blockQs) {
        if (q.correctIndex >= 0 && q.correctIndex <= 3) counts[q.correctIndex]++;
      }
      counts.forEach((count, pos) => {
        const pct = (count / blockQs.length) * 100;
        if (pct > 50) {
          fail(
            'position-balance',
            `lesson block ${blockStart}-${blockEnd}: correct-answer position ${pos} holds ${pct.toFixed(1)}% of ` +
            `${blockQs.length} non-true-false questions (must be <=50% once block has >=12 such questions)`
          );
        }
      });
    }
  }
}

function checkTrueFalseBalance(questions) {
  const tf = questions.filter((q) => q.type === 'true-false' && Array.isArray(q.choices) && q.choices.length === 2 && Number.isInteger(q.correctIndex));
  if (tf.length < 6) return;
  // By convention (mirroring the spec's TRUE_FALSE_CHOICES), correctIndex 0
  // means the true-labeled choice is at index 0 if choices[0] normalizes to
  // "true"; fall back to correctIndex 0 == "true" if choices don't literally
  // say True/False.
  let trueCount = 0;
  for (const q of tf) {
    const chosen = q.choices[q.correctIndex];
    const normalized = typeof chosen === 'string' ? chosen.trim().toLowerCase() : '';
    const isTrue = normalized === 'true' ? true : normalized === 'false' ? false : q.correctIndex === 0;
    if (isTrue) trueCount++;
  }
  const pct = (trueCount / tf.length) * 100;
  if (pct < 45 || pct > 55) {
    fail(
      'true-false-balance',
      `true:false ratio is ${trueCount}:${tf.length - trueCount} (${pct.toFixed(1)}% true) — must be between 45:55 and 55:45 ` +
      `once bank has >=6 true-false questions`
    );
  }
}

function reportCoverage(questions) {
  const perLesson = new Array(TOTAL_LESSONS + 1).fill(0); // index 1..50
  for (const q of questions) {
    if (Number.isInteger(q.introducedLesson) && q.introducedLesson >= 1 && q.introducedLesson <= TOTAL_LESSONS) {
      perLesson[q.introducedLesson]++;
    }
  }
  const thinLessons = [];
  for (let l = 1; l <= TOTAL_LESSONS; l++) {
    if (perLesson[l] < 4) thinLessons.push(`L${l}(${perLesson[l]})`);
  }
  if (thinLessons.length) {
    note(`per-lesson coverage: ${thinLessons.length} lesson(s) below 4 questions: ${thinLessons.join(', ')}`);
  }

  const thinBlocks = [];
  for (let blockStart = 1; blockStart <= 46; blockStart += 5) {
    const blockEnd = Math.min(blockStart + 4, TOTAL_LESSONS);
    let sum = 0;
    for (let l = blockStart; l <= blockEnd; l++) sum += perLesson[l];
    if (sum < 10) thinBlocks.push(`L${blockStart}-${blockEnd}(${sum})`);
  }
  if (thinBlocks.length) {
    note(`5-lesson cumulative coverage: ${thinBlocks.length} block(s) below 10 questions: ${thinBlocks.join(', ')}`);
  }
}

function main() {
  const doc = readJson(QUESTIONS_PATH);
  if (!doc) {
    console.error(`FAIL — ${failures.length} issue(s):\n`);
    for (const f of failures) console.error(`  ${f}`);
    process.exitCode = 1;
    return;
  }

  if (doc.schemaVersion !== 1) {
    fail('schema-version', `questions.json schemaVersion is ${JSON.stringify(doc.schemaVersion)}, expected 1`);
  }
  if (!Array.isArray(doc.questions)) {
    fail('shape', 'questions.json: "questions" is not an array');
    console.error(`FAIL — ${failures.length} issue(s):\n`);
    for (const f of failures) console.error(`  ${f}`);
    process.exitCode = 1;
    return;
  }

  const idsSeen = new Set();
  const validated = [];
  for (const q of doc.questions) {
    if (!isPlainObject(q)) {
      fail('question-shape', 'a questions[] entry is not an object');
      continue;
    }
    validateQuestion(q, idsSeen);
    validated.push(q);
  }

  checkPositionBalance(validated);
  checkTrueFalseBalance(validated);
  reportCoverage(validated);

  if (nonFatal.length) {
    console.log(`${nonFatal.length} non-fatal finding(s):`);
    for (const n of nonFatal) console.log(`  ~ ${n}`);
  }

  if (failures.length) {
    console.error(`FAIL — ${failures.length} issue(s):\n`);
    for (const f of failures) console.error(`  ${f}`);
    process.exitCode = 1;
  } else {
    console.log(`OK — grammar data checks passed (${validated.length} question(s)).`);
  }
}

main();
