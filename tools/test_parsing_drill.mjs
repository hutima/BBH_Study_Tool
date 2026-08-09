#!/usr/bin/env node
// Test runner for js/domain/parsing/drill.js — the Phase 2 Parse/Build drill
// domain. Dependency-free (node:assert only). Uses an inline fixture rather
// than real source data (source/bbh/parsing/paradigms.json ships empty until
// content lands) so it stays fast and stable across Phase 2 PR B content
// changes. Mirrors the style of tools/test_parsing_gates.mjs.
//
// Usage: node tools/test_parsing_drill.mjs
// Exits nonzero on any failed assertion; prints one PASS line per test.

import assert from 'node:assert/strict';
import {
  applicableDimensions,
  buildDrillPool,
  orderDrillPool,
  evaluateParse,
  recordAttempt,
  isFormKnown,
  buildFormChoices,
  formStatus
} from '../js/domain/parsing/drill.js';

// ─── Fixture ────────────────────────────────────────────────────────────
// Language-neutral placeholder Hebrew — exercises the drill domain's
// arithmetic/logic, not a claim of real BBH content (that's Phase 2 PR B's
// content-authoring job).
const PARADIGMS = [
  {
    id: 'qal-perfect',
    category: 'verb',
    label: 'Qal Perfect (fixture)',
    forms: [
      {
        id: 'qal-perfect-3ms',
        display: 'קָטַל',
        pos: 'verb',
        introducedLesson: 5,
        source: { lesson: 5, page: 1 },
        acceptedParses: [
          { binyan: 'qal', conjugation: 'perfect', person: '3', gender: 'masculine', number: 'singular', suffix: null }
        ]
      },
      // Ambiguous written form: identical consonantal/pointed shape can
      // parse as EITHER 2ms or 3fs perfect — both are legitimate answers.
      {
        id: 'qal-perfect-2ms-3fs-ambig',
        display: 'קָטַלְתְּ',
        pos: 'verb',
        introducedLesson: 5,
        source: { lesson: 5, page: 1 },
        ambiguityNote: '2ms and 3fs perfect are written identically in this paradigm slot.',
        acceptedParses: [
          { binyan: 'qal', conjugation: 'perfect', person: '2', gender: 'masculine', number: 'singular', suffix: null },
          { binyan: 'qal', conjugation: 'perfect', person: '3', gender: 'feminine', number: 'singular', suffix: null }
        ]
      }
    ]
  },
  // Staged paradigm: same paradigm id, forms split across lessons 16 and 19
  // (mirrors the gates.js fixture's staging pattern).
  {
    id: 'qal-imperfect',
    category: 'verb',
    label: 'Qal Imperfect (fixture)',
    forms: [
      {
        id: 'qal-imperfect-3ms',
        display: 'יִקְטֹל',
        pos: 'verb',
        introducedLesson: 16,
        source: { lesson: 16, page: 2 },
        acceptedParses: [
          { binyan: 'qal', conjugation: 'imperfect', person: '3', gender: 'masculine', number: 'singular', suffix: null }
        ]
      },
      {
        id: 'qal-imperfect-3mp',
        display: 'יִקְטְלוּ',
        pos: 'verb',
        introducedLesson: 19,
        source: { lesson: 19, page: 3 },
        acceptedParses: [
          { binyan: 'qal', conjugation: 'imperfect', person: '3', gender: 'masculine', number: 'plural', suffix: null }
        ]
      }
    ]
  },
  // Future-lesson verb form (introducedLesson 40) — used to prove
  // buildFormChoices never leaks a not-yet-available distractor/accepted-id
  // when queried at an earlier lesson, even though it's the same pos and
  // would otherwise be an eligible distractor.
  {
    id: 'hifil-perfect',
    category: 'verb',
    label: 'Hifil Perfect (fixture, future lesson)',
    forms: [
      {
        id: 'hifil-perfect-3ms',
        display: 'הִקְטִיל',
        pos: 'verb',
        introducedLesson: 40,
        source: { lesson: 40, page: 90 },
        acceptedParses: [
          { binyan: 'hifil', conjugation: 'perfect', person: '3', gender: 'masculine', number: 'singular', suffix: null }
        ]
      }
    ]
  },
  // Noun forms: two carry a `suffix` dimension (and a duplicate parse to
  // exercise structural, not identity, suffix comparison); one has NO
  // suffix key on any parse but DOES vary `state` — applicableDimensions
  // must include `state` and omit `suffix` for that one.
  {
    id: 'noun-suffixed',
    category: 'noun',
    label: 'Suffixed noun (fixture)',
    forms: [
      {
        id: 'noun-suffixed-3ms',
        display: 'סִפְרוֹ',
        pos: 'noun',
        introducedLesson: 23,
        source: { lesson: 23, page: 60 },
        acceptedParses: [
          { gender: 'masculine', number: 'singular', state: 'absolute', suffix: { person: '3', gender: 'masculine', number: 'singular' } }
        ]
      },
      {
        id: 'noun-suffixed-2ms',
        display: 'סִפְרְךָ',
        pos: 'noun',
        introducedLesson: 23,
        source: { lesson: 23, page: 60 },
        acceptedParses: [
          { gender: 'masculine', number: 'singular', state: 'absolute', suffix: { person: '2', gender: 'masculine', number: 'singular' } }
        ]
      },
      {
        id: 'noun-construct-plain',
        display: 'סֵפֶר',
        pos: 'noun',
        introducedLesson: 23,
        source: { lesson: 23, page: 60 },
        acceptedParses: [
          { gender: 'masculine', number: 'singular', state: 'construct' }
        ]
      }
    ]
  },
  // Appendix-only pronoun.
  {
    id: 'demonstrative',
    category: 'pronoun',
    label: 'Demonstrative pronoun (fixture)',
    forms: [
      {
        id: 'demonstrative-near-appendix',
        display: 'הַלָּז',
        pos: 'pronoun',
        appendixOnly: true,
        source: { appendix: 'A', page: 'a-3' },
        acceptedParses: [{ person: '3', gender: 'masculine', number: 'singular', deixis: 'near' }]
      }
    ]
  },
  // Particles: a bare one with an empty-object parse (no dimensions at all
  // — applicableDimensions must be []) and a suffixed one.
  {
    id: 'object-marker',
    category: 'particle',
    label: 'Object marker (fixture)',
    forms: [
      {
        id: 'object-marker-plain',
        display: 'אֵת',
        pos: 'particle',
        introducedLesson: 3,
        source: { lesson: 3, page: 8 },
        acceptedParses: [{}]
      },
      {
        id: 'object-marker-1cs',
        display: 'אֹתִי',
        pos: 'particle',
        introducedLesson: 12,
        source: { lesson: 12, page: 30 },
        acceptedParses: [{ suffix: { person: '1', gender: 'common', number: 'singular' } }]
      }
    ]
  }
];

function byId(id) {
  for (const paradigm of PARADIGMS) {
    const form = paradigm.forms.find((f) => f.id === id);
    if (form) return { ...form, paradigmId: paradigm.id };
  }
  throw new Error(`fixture form not found: ${id}`);
}

// ─── tiny test harness ──────────────────────────────────────────────────
let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`PASS: ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL: ${name}`);
    console.error(`  ${err.stack || err.message}`);
  }
}

const VERB_DIMS = ['binyan', 'conjugation', 'person', 'gender', 'number', 'suffix'];

// ─── applicableDimensions ─────────────────────────────────────────────────
test('applicableDimensions: verb form with a single unambiguous parse gets all dims that parse defines', () => {
  assert.deepEqual(applicableDimensions(byId('qal-perfect-3ms')), VERB_DIMS);
});

test('applicableDimensions: bare particle with {} parse has no applicable dimensions', () => {
  assert.deepEqual(applicableDimensions(byId('object-marker-plain')), []);
});

test('applicableDimensions: suffixed particle has exactly ["suffix"]', () => {
  assert.deepEqual(applicableDimensions(byId('object-marker-1cs')), ['suffix']);
});

test('applicableDimensions: noun with no suffix on any parse still includes state (and omits suffix)', () => {
  assert.deepEqual(applicableDimensions(byId('noun-construct-plain')), ['gender', 'number', 'state']);
});

test('applicableDimensions: noun WITH a suffix parse includes suffix', () => {
  assert.deepEqual(applicableDimensions(byId('noun-suffixed-3ms')), ['gender', 'number', 'state', 'suffix']);
});

// ─── evaluateParse: ambiguous form accepted via either parse ─────────────
test('evaluateParse: ambiguous form is "correct" when picks match the 2ms parse', () => {
  const form = byId('qal-perfect-2ms-3fs-ambig');
  const picks = { binyan: 'qal', conjugation: 'perfect', person: '2', gender: 'masculine', number: 'singular', suffix: null };
  const { result, bestParse } = evaluateParse(form, picks, VERB_DIMS);
  assert.equal(result, 'correct');
  assert.equal(bestParse.person, '2');
});

test('evaluateParse: ambiguous form is ALSO "correct" when picks match the 3fs parse', () => {
  const form = byId('qal-perfect-2ms-3fs-ambig');
  const picks = { binyan: 'qal', conjugation: 'perfect', person: '3', gender: 'feminine', number: 'singular', suffix: null };
  const { result, bestParse } = evaluateParse(form, picks, VERB_DIMS);
  assert.equal(result, 'correct');
  assert.equal(bestParse.gender, 'feminine');
});

// ─── evaluateParse: partial vs wrong ─────────────────────────────────────
test('evaluateParse: partial when some enabled dims match but not all', () => {
  const form = byId('qal-perfect-3ms');
  // binyan/conjugation/gender/number/suffix match; person is wrong (1 vs 3).
  const picks = { binyan: 'qal', conjugation: 'perfect', person: '1', gender: 'masculine', number: 'singular', suffix: null };
  const { result, perDim } = evaluateParse(form, picks, VERB_DIMS);
  assert.equal(result, 'partial');
  assert.equal(perDim.person, 0);
  assert.equal(perDim.binyan, 1);
});

test('evaluateParse: wrong when nothing matches', () => {
  const form = byId('qal-perfect-3ms');
  const picks = { binyan: 'piel', conjugation: 'imperfect', person: '1', gender: 'feminine', number: 'plural', suffix: { person: '1', gender: 'common', number: 'plural' } };
  const { result } = evaluateParse(form, picks, VERB_DIMS);
  assert.equal(result, 'wrong');
});

test('evaluateParse: suffix values compare structurally, not by identity', () => {
  const form = byId('noun-suffixed-3ms');
  const dims = applicableDimensions(form);
  const picks = { gender: 'masculine', number: 'singular', state: 'absolute', suffix: { person: '3', gender: 'masculine', number: 'singular' } };
  const { result } = evaluateParse(form, picks, dims);
  assert.equal(result, 'correct');
});

// ─── isFormKnown: 2/2 rule, incl. toggle-change recompute ────────────────
test('isFormKnown: false with zero or one fully-covering attempt', () => {
  let attempts = {};
  assert.equal(isFormKnown(attempts, 'qal-perfect-3ms', VERB_DIMS), false);

  const perDim = { binyan: 1, conjugation: 1, person: 1, gender: 1, number: 1, suffix: 1 };
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', perDim, { at: 1 });
  assert.equal(isFormKnown(attempts, 'qal-perfect-3ms', VERB_DIMS), false, 'one attempt is not enough');
});

test('isFormKnown: true after 2 consecutive fully-correct, fully-covering attempts', () => {
  let attempts = {};
  const perDim = { binyan: 1, conjugation: 1, person: 1, gender: 1, number: 1, suffix: 1 };
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', perDim, { at: 1 });
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', perDim, { at: 2 });
  assert.equal(isFormKnown(attempts, 'qal-perfect-3ms', VERB_DIMS), true);
});

test('isFormKnown: a wrong dim in either of the last 2 attempts breaks "known"', () => {
  let attempts = {};
  const good = { binyan: 1, conjugation: 1, person: 1, gender: 1, number: 1, suffix: 1 };
  const bad = { ...good, person: 0 };
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', good, { at: 1 });
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', bad, { at: 2 });
  assert.equal(isFormKnown(attempts, 'qal-perfect-3ms', VERB_DIMS), false);
});

test('isFormKnown: toggle change -> known status recomputed, not corrupted (narrow-coverage attempts do not count under a wider toggle)', () => {
  let attempts = {};
  const narrowDims = ['binyan', 'conjugation'];
  // Two attempts recorded while only binyan/conjugation were enabled — both
  // score 1 on everything THEY covered, but never touched person/gender/
  // number/suffix at all.
  const narrowPerDim = { binyan: 1, conjugation: 1 };
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', narrowPerDim, { at: 1 });
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', narrowPerDim, { at: 2 });

  // Under the SAME narrow toggle set, this is known.
  assert.equal(isFormKnown(attempts, 'qal-perfect-3ms', narrowDims), true);

  // Widen the toggle to the full VERB_DIMS set: those same two attempts
  // never recorded person/gender/number/suffix, so they must NOT count
  // toward "known" under the wider set — this is the corruption case.
  assert.equal(isFormKnown(attempts, 'qal-perfect-3ms', VERB_DIMS), false);

  // Record 2 fresh attempts that DO cover the full widened set: now it
  // should become known again, freshly, under the wider toggle.
  const fullPerDim = { binyan: 1, conjugation: 1, person: 1, gender: 1, number: 1, suffix: 1 };
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', fullPerDim, { at: 3 });
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', fullPerDim, { at: 4 });
  assert.equal(isFormKnown(attempts, 'qal-perfect-3ms', VERB_DIMS), true);
});

test('recordAttempt: is immutable (never mutates the passed-in attempts object) and caps recent at 2 / history at 50', () => {
  let attempts = {};
  const frozenEmpty = attempts;
  const perDim = { binyan: 1 };
  for (let i = 0; i < 55; i += 1) {
    const next = recordAttempt(attempts, 'qal-perfect-3ms', perDim, { at: i });
    assert.notEqual(next, attempts, 'recordAttempt must return a new object');
    attempts = next;
  }
  assert.deepEqual(frozenEmpty, {}, 'the original empty attempts object must be untouched');
  assert.equal(attempts['qal-perfect-3ms'].seen, 55);
  assert.equal(attempts['qal-perfect-3ms'].recent.length, 2);
  assert.equal(attempts['qal-perfect-3ms'].history.length, 50);
  assert.deepEqual(attempts['qal-perfect-3ms'].recent.map((e) => e.at), [53, 54]);
});

// ─── formStatus ───────────────────────────────────────────────────────────
test('formStatus: unseen / right / partial / wrong / known', () => {
  let attempts = {};
  assert.equal(formStatus(attempts, 'qal-perfect-3ms', VERB_DIMS), 'unseen');

  const allRight = { binyan: 1, conjugation: 1, person: 1, gender: 1, number: 1, suffix: 1 };
  const partial = { binyan: 1, conjugation: 0, person: 1, gender: 1, number: 1, suffix: 1 };
  const allWrong = { binyan: 0, conjugation: 0, person: 0, gender: 0, number: 0, suffix: 0 };

  attempts = recordAttempt(attempts, 'qal-perfect-3ms', partial, { at: 1 });
  assert.equal(formStatus(attempts, 'qal-perfect-3ms', VERB_DIMS), 'partial');

  attempts = recordAttempt(attempts, 'qal-perfect-3ms', allWrong, { at: 2 });
  assert.equal(formStatus(attempts, 'qal-perfect-3ms', VERB_DIMS), 'wrong');

  attempts = recordAttempt(attempts, 'qal-perfect-3ms', allRight, { at: 3 });
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', allRight, { at: 4 });
  assert.equal(formStatus(attempts, 'qal-perfect-3ms', VERB_DIMS), 'known');
});

// ─── buildDrillPool: gating, scope filters, excludeKnown ─────────────────
test('buildDrillPool: default scope (no focus/custom/shuffleAll) is only forms newly introduced AT the given lesson', () => {
  const pool = buildDrillPool(PARADIGMS, { lesson: 23 });
  const ids = pool.map((f) => f.id).sort();
  assert.deepEqual(ids, ['noun-construct-plain', 'noun-suffixed-2ms', 'noun-suffixed-3ms'].sort());
});

test('buildDrillPool: shuffleAll:true broadens to the full cumulative gated pool', () => {
  const pool = buildDrillPool(PARADIGMS, { lesson: 23, shuffleAll: true });
  const ids = new Set(pool.map((f) => f.id));
  assert.ok(ids.has('qal-perfect-3ms'), 'lesson-5 form should be included cumulatively');
  assert.ok(ids.has('qal-imperfect-3ms'), 'lesson-16 form should be included cumulatively');
  assert.ok(ids.has('qal-imperfect-3mp'), 'lesson-19 form should be included cumulatively at lesson 23');
});

test('buildDrillPool: focusParadigmId restricts to one paradigm regardless of lesson-introduced filtering', () => {
  const pool = buildDrillPool(PARADIGMS, { lesson: 50, focusParadigmId: 'qal-imperfect' });
  assert.deepEqual(pool.map((f) => f.id).sort(), ['qal-imperfect-3mp', 'qal-imperfect-3ms'].sort());
});

test('buildDrillPool: customParadigmIds restricts to the listed paradigms', () => {
  const pool = buildDrillPool(PARADIGMS, { lesson: 50, customParadigmIds: ['qal-perfect', 'object-marker'] });
  const paradigmIds = new Set(pool.map((f) => f.paradigmId));
  assert.deepEqual(paradigmIds, new Set(['qal-perfect', 'object-marker']));
});

test('buildDrillPool: never leaks appendixOnly or future-lesson forms regardless of scope option', () => {
  const pool = buildDrillPool(PARADIGMS, { lesson: 23, shuffleAll: true });
  const ids = new Set(pool.map((f) => f.id));
  assert.ok(!ids.has('demonstrative-near-appendix'));
  assert.ok(!ids.has('hifil-perfect-3ms'));
});

test('buildDrillPool: excludeKnown drops a known form from the pool', () => {
  let attempts = {};
  const perDim = { binyan: 1, conjugation: 1, person: 1, gender: 1, number: 1, suffix: 1 };
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', perDim, { at: 1 });
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', perDim, { at: 2 });

  const withoutExclude = buildDrillPool(PARADIGMS, { lesson: 5 });
  assert.ok(withoutExclude.map((f) => f.id).includes('qal-perfect-3ms'));

  const withExclude = buildDrillPool(PARADIGMS, { lesson: 5, excludeKnown: true, attempts });
  assert.ok(!withExclude.map((f) => f.id).includes('qal-perfect-3ms'), 'known form should be excluded');
  // The unrelated ambiguous form (same lesson) is untouched.
  assert.ok(withExclude.map((f) => f.id).includes('qal-perfect-2ms-3fs-ambig'));
});

// ─── buildFormChoices: accepted matches + no future-lesson leaks ─────────
test('buildFormChoices: acceptedIds include the target and any feature-identical in-scope form; distractors never leak a future-lesson form', () => {
  // Add a second, homographic paradigm entry so there IS a legitimate
  // second accepted answer for qal-perfect-3ms's exact parse.
  const extendedParadigms = [
    ...PARADIGMS,
    {
      id: 'qal-perfect-homograph',
      category: 'verb',
      label: 'Homographic Qal Perfect 3ms (fixture)',
      forms: [
        {
          id: 'qal-perfect-3ms-homograph',
          display: 'קָטַל',
          pos: 'verb',
          introducedLesson: 5,
          source: { lesson: 5, page: 1 },
          acceptedParses: [
            { binyan: 'qal', conjugation: 'perfect', person: '3', gender: 'masculine', number: 'singular', suffix: null }
          ]
        }
      ]
    }
  ];

  const target = byId('qal-perfect-3ms');
  // Query at lesson 20: hifil-perfect-3ms (lesson 40) must be gated out of
  // BOTH acceptedIds and choices, even though it's the same pos.
  const { choices, acceptedIds } = buildFormChoices(extendedParadigms, target, { lesson: 20, count: 4, rngSeedInt: 7 });

  assert.ok(acceptedIds.includes('qal-perfect-3ms'));
  assert.ok(acceptedIds.includes('qal-perfect-3ms-homograph'), 'feature-identical homograph must be accepted');
  assert.ok(!acceptedIds.includes('hifil-perfect-3ms'), 'future-lesson form must never appear in acceptedIds');
  assert.ok(!choices.includes('hifil-perfect-3ms'), 'future-lesson form must never appear as a choice/distractor');
  assert.ok(choices.length >= 2, 'must offer at least 2 choices when the pool supports it');
  assert.ok(choices.includes('qal-perfect-3ms'), 'target form itself must be among the choices');
});

test('buildFormChoices: never fewer than 2 choices when at least 2 in-scope forms exist, and returns what exists otherwise', () => {
  // At lesson 3, only object-marker-plain (lesson 3) exists among particles;
  // object-marker-1cs (lesson 12) is not yet in scope, so there is nothing
  // to serve as a distractor for a particle-pos target.
  const target = byId('object-marker-plain');
  const { choices } = buildFormChoices(PARADIGMS, target, { lesson: 3, count: 4, rngSeedInt: 1 });
  assert.deepEqual(choices, ['object-marker-plain'], 'no distractor pool available -> just the target');
});

// ─── orderDrillPool: priority buckets + determinism ──────────────────────
test('orderDrillPool: unseen first, then seen-not-known (most-missed first), then known', () => {
  const pool = [byId('qal-perfect-3ms'), byId('qal-imperfect-3ms'), byId('qal-imperfect-3mp'), byId('noun-suffixed-3ms')];

  let attempts = {};
  const right = { binyan: 1, conjugation: 1, person: 1, gender: 1, number: 1, suffix: 1 };
  const wrong = { binyan: 0, conjugation: 0, person: 0, gender: 0, number: 0, suffix: 0 };

  // qal-perfect-3ms: known (2/2 right).
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', right, { at: 1 });
  attempts = recordAttempt(attempts, 'qal-perfect-3ms', right, { at: 2 });

  // qal-imperfect-3ms: seen, not known, missed twice (2 wrong attempts in history).
  attempts = recordAttempt(attempts, 'qal-imperfect-3ms', wrong, { at: 1 });
  attempts = recordAttempt(attempts, 'qal-imperfect-3ms', wrong, { at: 2 });

  // qal-imperfect-3mp: seen, not known, missed once then got one right (1 miss in history, most recent 2 not both right).
  attempts = recordAttempt(attempts, 'qal-imperfect-3mp', wrong, { at: 1 });
  attempts = recordAttempt(attempts, 'qal-imperfect-3mp', right, { at: 2 });

  // noun-suffixed-3ms: unseen (no attempts recorded).

  const ordered = orderDrillPool(pool, attempts, 42).map((f) => f.id);

  assert.equal(ordered[0], 'noun-suffixed-3ms', 'unseen form must come first');
  // Both non-known verbs must precede the known one.
  const knownIdx = ordered.indexOf('qal-perfect-3ms');
  const moreMissedIdx = ordered.indexOf('qal-imperfect-3ms');
  const lessMissedIdx = ordered.indexOf('qal-imperfect-3mp');
  assert.ok(moreMissedIdx < knownIdx && lessMissedIdx < knownIdx, 'known form must be last');
  assert.ok(moreMissedIdx < lessMissedIdx, 'the form missed twice must precede the form missed once (most-missed first)');
});

test('orderDrillPool: deterministic for equal seeds (same pool/attempts/seed -> identical order every call)', () => {
  const pool = [byId('qal-perfect-3ms'), byId('qal-imperfect-3ms'), byId('qal-imperfect-3mp'), byId('noun-suffixed-3ms'), byId('noun-suffixed-2ms')];
  const attempts = {};

  const first = orderDrillPool(pool, attempts, 123).map((f) => f.id);
  const second = orderDrillPool(pool, attempts, 123).map((f) => f.id);
  assert.deepEqual(first, second);

  // Different seed CAN (not guaranteed to, but practically does for this
  // fixture size) produce a different order among the all-unseen bucket —
  // sanity check that the seed is actually wired through, not ignored.
  const third = orderDrillPool(pool, attempts, 999).map((f) => f.id);
  assert.notDeepEqual(first, third, 'a different seed should be capable of producing a different tie-break order');
});

// ─── buildDrillPool: rootFilter (PR G) ───────────────────────────────────
// Fixture note: none of the fixture forms above carry a `root` field. Add a
// small root-bearing pair spanning two lessons so rootFilter can be tested
// without disturbing any existing test's pool math.
const ROOT_PARADIGMS = [
  ...PARADIGMS,
  {
    id: 'root-verb-a',
    category: 'verb',
    label: 'Root fixture A (fixture)',
    forms: [
      {
        id: 'root-verb-a-1',
        display: 'שׁמר',
        pos: 'verb',
        root: 'שמר',
        introducedLesson: 10,
        source: { lesson: 10, page: 1 },
        acceptedParses: [{ binyan: 'qal', conjugation: 'perfect', person: '3', gender: 'masculine', number: 'singular', suffix: null }]
      }
    ]
  },
  {
    id: 'root-verb-b',
    category: 'verb',
    label: 'Root fixture B (fixture)',
    forms: [
      {
        id: 'root-verb-b-1',
        display: 'ישׁמר',
        pos: 'verb',
        root: 'שמר',
        introducedLesson: 20,
        source: { lesson: 20, page: 2 },
        acceptedParses: [{ binyan: 'qal', conjugation: 'imperfect', person: '3', gender: 'masculine', number: 'singular', suffix: null }]
      }
    ]
  }
];

test('buildDrillPool: rootFilter gathers every in-gate form sharing a root, across paradigms and lessons', () => {
  const pool = buildDrillPool(ROOT_PARADIGMS, { lesson: 50, rootFilter: 'שמר' });
  assert.deepEqual(pool.map((f) => f.id).sort(), ['root-verb-a-1', 'root-verb-b-1'].sort());
});

test('buildDrillPool: rootFilter still respects the lesson gate', () => {
  const pool = buildDrillPool(ROOT_PARADIGMS, { lesson: 15, rootFilter: 'שמר' });
  assert.deepEqual(pool.map((f) => f.id), ['root-verb-a-1'], 'lesson-20 root form must not leak at lesson 15');
});

test('buildDrillPool: rootFilter is mutually exclusive with focusParadigmId/customParadigmIds/shuffleAll — it wins even when those are also set', () => {
  const pool = buildDrillPool(ROOT_PARADIGMS, {
    lesson: 50,
    rootFilter: 'שמר',
    focusParadigmId: 'qal-perfect',
    customParadigmIds: ['object-marker'],
    shuffleAll: false
  });
  assert.deepEqual(pool.map((f) => f.id).sort(), ['root-verb-a-1', 'root-verb-b-1'].sort(),
    'rootFilter must be checked as its own first branch, ignoring focus/custom/shuffle entirely');
});

// ─── buildDrillPool: dimValueFilter (PR G, "By feature") ─────────────────
test('dimValueFilter: single dim/value keeps only matching forms', () => {
  const pool = buildDrillPool(PARADIGMS, { lesson: 50, shuffleAll: true, dimValueFilter: { conjugation: ['imperfect'] } });
  const ids = new Set(pool.map((f) => f.id));
  assert.ok(ids.has('qal-imperfect-3ms'));
  assert.ok(ids.has('qal-imperfect-3mp'));
  assert.ok(!ids.has('qal-perfect-3ms'), 'perfect-conjugation form must be excluded');
});

test('dimValueFilter: multiple dims are ANDed (every filtered dim must independently match SOME acceptedParse)', () => {
  // Ambiguous form has parses {person:2,gender:masc} and {person:3,gender:fem}.
  // Filtering person=[2] AND gender=[feminine] independently: person=2
  // matches the FIRST parse, gender=feminine matches the SECOND parse — not
  // necessarily the same parse — so the form must still be kept.
  const pool = buildDrillPool(PARADIGMS, {
    lesson: 50, shuffleAll: true,
    dimValueFilter: { person: ['2'], gender: ['feminine'] }
  });
  assert.ok(pool.map((f) => f.id).includes('qal-perfect-2ms-3fs-ambig'));

  // A dim value that appears on NEITHER accepted parse excludes the form.
  const poolNoMatch = buildDrillPool(PARADIGMS, {
    lesson: 50, shuffleAll: true,
    dimValueFilter: { person: ['1'] }
  });
  assert.ok(!poolNoMatch.map((f) => f.id).includes('qal-perfect-2ms-3fs-ambig'));
});

test('dimValueFilter: suffix values use the same "person-gender-number" serialization availableDimensionValues uses', () => {
  const pool = buildDrillPool(PARADIGMS, {
    lesson: 50, shuffleAll: true,
    dimValueFilter: { suffix: ['3-masculine-singular'] }
  });
  assert.deepEqual(pool.map((f) => f.id), ['noun-suffixed-3ms']);
});

test('dimValueFilter: an empty value array for a dim is not a constraint (matches everything, same as omitting the dim)', () => {
  const withEmpty = buildDrillPool(PARADIGMS, { lesson: 23, dimValueFilter: { state: [] } });
  const withoutFilter = buildDrillPool(PARADIGMS, { lesson: 23 });
  assert.deepEqual(withEmpty.map((f) => f.id).sort(), withoutFilter.map((f) => f.id).sort());
});

test('dimValueFilter composes with rootFilter (both apply)', () => {
  const pool = buildDrillPool(ROOT_PARADIGMS, {
    lesson: 50, rootFilter: 'שמר',
    dimValueFilter: { conjugation: ['perfect'] }
  });
  assert.deepEqual(pool.map((f) => f.id), ['root-verb-a-1']);
});

// ─── orderDrillPool: journey mode (PR G) ─────────────────────────────────
test('orderDrillPool journey mode: deterministic (introducedLesson asc, paradigm index asc, form index asc), no PRNG', () => {
  const pool = buildDrillPool(ROOT_PARADIGMS, { lesson: 50, rootFilter: 'שמר' });
  const ordered1 = orderDrillPool(pool, {}, 111, { mode: 'journey' }).map((f) => f.id);
  const ordered2 = orderDrillPool(pool, {}, 999, { mode: 'journey' }).map((f) => f.id);
  assert.deepEqual(ordered1, ['root-verb-a-1', 'root-verb-b-1'], 'lesson 10 form must precede the lesson 20 form');
  assert.deepEqual(ordered1, ordered2, 'journey order must be identical across different seeds (no PRNG involved)');
});

test('orderDrillPool journey mode: stable tie-break preserves (paradigm index, form index) order for equal introducedLesson', () => {
  // qal-perfect-3ms and qal-perfect-2ms-3fs-ambig share introducedLesson 5
  // and both live in paradigm "qal-perfect", array positions 0 and 1.
  const pool = buildDrillPool(PARADIGMS, { lesson: 5 });
  const ordered = orderDrillPool(pool, {}, 42, { mode: 'journey' }).map((f) => f.id);
  assert.deepEqual(ordered, ['qal-perfect-3ms', 'qal-perfect-2ms-3fs-ambig']);
});

test('orderDrillPool journey mode: ignores excludeKnown for pool MEMBERSHIP (journey mode itself does no filtering — caller controls membership via buildDrillPool)', () => {
  const pool = buildDrillPool(ROOT_PARADIGMS, { lesson: 50, rootFilter: 'שמר' }); // excludeKnown NOT passed
  let attempts = {};
  const perDim = { binyan: 1, conjugation: 1, person: 1, gender: 1, number: 1, suffix: 1 };
  attempts = recordAttempt(attempts, 'root-verb-a-1', perDim, { at: 1 });
  attempts = recordAttempt(attempts, 'root-verb-a-1', perDim, { at: 2 });
  assert.equal(isFormKnown(attempts, 'root-verb-a-1', ['binyan', 'conjugation', 'person', 'gender', 'number', 'suffix']), true);
  const ordered = orderDrillPool(pool, attempts, 7, { mode: 'journey' }).map((f) => f.id);
  assert.ok(ordered.includes('root-verb-a-1'), 'a KNOWN form must still appear in journey order — journey never drops known forms from the walk');
  assert.deepEqual(ordered, ['root-verb-a-1', 'root-verb-b-1']);
});

// ─── summary ─────────────────────────────────────────────────────────────
if (failed) {
  console.error(`\n${failed} test(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('\nAll tests passed.');
}
