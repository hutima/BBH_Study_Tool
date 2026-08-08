#!/usr/bin/env node
// Test runner for js/domain/parsing/gates.js — the Phase 2 lesson-gate
// engine. Dependency-free (node:assert + node:path only). Uses an inline
// fixture rather than real source data so it stays fast and stable across
// Phase 2 PR B content changes.
//
// Usage: node tools/test_parsing_gates.mjs
// Exits nonzero on any failed assertion; prints one PASS line per test.

import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  isFormAvailable,
  availableForms,
  availableParadigms,
  availableDimensionValues,
  firstLessonWithMaterial
} from '../js/domain/parsing/gates.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
void __dirname; // unused, kept for parity with the other tools/ scripts

// ─── Fixture ────────────────────────────────────────────────────────────
// Language-neutral placeholder Hebrew (real display strings, but not
// claimed to be linguistically exhaustive) — this fixture exists to
// exercise the gate engine's lesson arithmetic, not to model real BBH
// content (that's Phase 2 PR B's job).
const PARADIGMS = [
  {
    id: 'qal-perfect',
    category: 'verb',
    label: 'Qal Perfect (fixture)',
    forms: [
      {
        id: 'qal-perfect-3ms',
        display: 'קטל',
        pos: 'verb',
        introducedLesson: 5,
        source: { lesson: 5, page: 1 },
        acceptedParses: [
          { binyan: 'qal', conjugation: 'perfect', person: '3', gender: 'masculine', number: 'singular', suffix: null }
        ]
      }
    ]
  },
  // Staged paradigm: same paradigm id, forms split across lessons 16 and 19.
  {
    id: 'qal-imperfect',
    category: 'verb',
    label: 'Qal Imperfect (fixture)',
    forms: [
      {
        id: 'qal-imperfect-3ms',
        display: 'יקטל',
        pos: 'verb',
        introducedLesson: 16,
        source: { lesson: 16, page: 2 },
        acceptedParses: [
          { binyan: 'qal', conjugation: 'imperfect', person: '3', gender: 'masculine', number: 'singular', suffix: null }
        ]
      },
      {
        id: 'qal-imperfect-3mp',
        display: 'יקטלו',
        pos: 'verb',
        introducedLesson: 19,
        source: { lesson: 19, page: 3 },
        acceptedParses: [
          { binyan: 'qal', conjugation: 'imperfect', person: '3', gender: 'masculine', number: 'plural', suffix: null }
        ]
      }
    ]
  },
  // Multiple acceptedParses sharing a dimension value (suffix), including
  // an exact duplicate parse within one form, to exercise dedup.
  {
    id: 'noun-suffixed',
    category: 'noun',
    label: 'Suffixed noun (fixture)',
    forms: [
      {
        id: 'noun-suffixed-3ms',
        display: 'ספרו',
        pos: 'noun',
        introducedLesson: 23,
        source: { lesson: 23, page: 4 },
        acceptedParses: [
          { gender: 'masculine', number: 'singular', state: 'absolute', suffix: { person: '3', gender: 'masculine', number: 'singular' } },
          { gender: 'masculine', number: 'singular', state: 'absolute', suffix: { person: '3', gender: 'masculine', number: 'singular' } }
        ]
      },
      {
        id: 'noun-suffixed-3mp',
        display: 'ספרם',
        pos: 'noun',
        introducedLesson: 23,
        source: { lesson: 23, page: 4 },
        acceptedParses: [
          { gender: 'masculine', number: 'singular', state: 'absolute', suffix: { person: '3', gender: 'masculine', number: 'plural' } }
        ]
      }
    ]
  },
  // Appendix-only form — never available without includeAppendix.
  {
    id: 'demonstrative',
    category: 'pronoun',
    label: 'Demonstrative pronoun (fixture)',
    forms: [
      {
        id: 'demonstrative-near-appendix',
        display: 'הלז',
        pos: 'pronoun',
        appendixOnly: true,
        source: { appendix: 'A', page: 'a-3' },
        acceptedParses: [
          { person: '3', gender: 'masculine', number: 'singular', deixis: 'near' }
        ]
      }
    ]
  },
  // Malformed form: no introducedLesson, no appendixOnly. Must fail closed.
  {
    id: 'malformed',
    category: 'particle',
    label: 'Malformed fixture (no gate fields)',
    forms: [
      {
        id: 'malformed-no-gate',
        display: 'את',
        pos: 'particle',
        source: { lesson: 1, page: 1 },
        acceptedParses: [{}]
      }
    ]
  }
];

// ─── tiny test harness ──────────────────────────────────────────────────
let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`PASS: ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL: ${name}`);
    console.error(`  ${err.message}`);
  }
}

function idsOf(forms) {
  return forms.map((f) => f.id).sort();
}

// ─── (1) at lesson 15 nothing from lesson 16+ leaks ────────────────────
test('lesson 15: only the lesson-5 form is available, nothing from 16/19/23 leaks', () => {
  const forms = availableForms(PARADIGMS, 15);
  assert.deepEqual(idsOf(forms), ['qal-perfect-3ms']);
});

// ─── (2) at lesson 16, lesson-16 forms appear, lesson-19 stage does not ─
test('lesson 16: qal-imperfect-3ms appears, qal-imperfect-3mp (lesson 19) does not', () => {
  const forms = availableForms(PARADIGMS, 16);
  const ids = idsOf(forms);
  assert.ok(ids.includes('qal-imperfect-3ms'), 'expected qal-imperfect-3ms to be available at lesson 16');
  assert.ok(!ids.includes('qal-imperfect-3mp'), 'qal-imperfect-3mp (lesson 19) leaked at lesson 16');

  const paradigms = availableParadigms(PARADIGMS, 16);
  const staged = paradigms.find((p) => p.id === 'qal-imperfect');
  assert.ok(staged, 'expected the staged qal-imperfect paradigm to appear (it has an available form)');
  assert.equal(staged.forms.length, 1, 'staged paradigm should expose only its lesson-16 form at lesson 16');
  assert.equal(staged.forms[0].id, 'qal-imperfect-3ms');
});

// ─── (3) at lesson 19, the lesson-19 stage does appear ─────────────────
test('lesson 19: both qal-imperfect forms are available', () => {
  const forms = availableForms(PARADIGMS, 19);
  const ids = idsOf(forms);
  assert.ok(ids.includes('qal-imperfect-3ms'));
  assert.ok(ids.includes('qal-imperfect-3mp'));

  const paradigms = availableParadigms(PARADIGMS, 19);
  const staged = paradigms.find((p) => p.id === 'qal-imperfect');
  assert.equal(staged.forms.length, 2);
});

// ─── (4) appendixOnly never appears without includeAppendix, appears with it ─
test('appendixOnly form never appears without includeAppendix, at any lesson', () => {
  for (const lesson of [1, 16, 23, 50]) {
    const forms = availableForms(PARADIGMS, lesson);
    assert.ok(
      !idsOf(forms).includes('demonstrative-near-appendix'),
      `demonstrative-near-appendix leaked at lesson ${lesson} without includeAppendix`
    );
    assert.equal(isFormAvailable(PARADIGMS[3].forms[0], lesson), false);
  }
});

test('appendixOnly form appears once includeAppendix:true is opted in', () => {
  const forms = availableForms(PARADIGMS, 1, { includeAppendix: true });
  assert.ok(idsOf(forms).includes('demonstrative-near-appendix'));
  assert.equal(isFormAvailable(PARADIGMS[3].forms[0], 1, { includeAppendix: true }), true);
});

// ─── (5) availableDimensionValues at lesson 16 excludes lesson-19+ values ─
test('availableDimensionValues at lesson 16 excludes "plural" (only introduced by the lesson-19 form)', () => {
  const forms = availableForms(PARADIGMS, 16);
  const numbers = availableDimensionValues(forms, 'number');
  assert.deepEqual(numbers, ['singular']);
});

test('availableDimensionValues at lesson 19 includes "plural" once the lesson-19 form is available', () => {
  const forms = availableForms(PARADIGMS, 19);
  const numbers = availableDimensionValues(forms, 'number');
  assert.deepEqual(numbers, ['plural', 'singular']);
});

// ─── (6) firstLessonWithMaterial ────────────────────────────────────────
test('firstLessonWithMaterial(6..16) returns 16', () => {
  assert.equal(firstLessonWithMaterial(PARADIGMS, 6), 16);
});

test('firstLessonWithMaterial(from 17) returns 19', () => {
  assert.equal(firstLessonWithMaterial(PARADIGMS, 17), 19);
});

test('firstLessonWithMaterial(past the last introduced lesson) returns null', () => {
  assert.equal(firstLessonWithMaterial(PARADIGMS, 24), null);
});

// ─── (7) fail-closed: a malformed form is never available ──────────────
test('fail-closed: a form with no introducedLesson and no appendixOnly is never available', () => {
  const malformed = PARADIGMS.find((p) => p.id === 'malformed').forms[0];
  for (const lesson of [1, 25, 50]) {
    assert.equal(isFormAvailable(malformed, lesson), false);
    assert.equal(isFormAvailable(malformed, lesson, { includeAppendix: true }), false);
  }
  const forms = availableForms(PARADIGMS, 50, { includeAppendix: true });
  assert.ok(!idsOf(forms).includes('malformed-no-gate'));
});

// ─── (8) suffix serialization dedupes ───────────────────────────────────
test('suffix serialization dedupes identical suffix parses (within and across forms)', () => {
  const forms = availableForms(PARADIGMS, 23);
  const suffixes = availableDimensionValues(forms, 'suffix');
  // noun-suffixed-3ms contributes the SAME suffix value twice (two identical
  // parses); noun-suffixed-3mp contributes a distinct one. Expect exactly 2
  // deduplicated, sorted entries.
  assert.deepEqual(suffixes, ['3-masculine-plural', '3-masculine-singular']);
});

// ─── summary ─────────────────────────────────────────────────────────────
if (failed) {
  console.error(`\n${failed} test(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('\nAll tests passed.');
}
