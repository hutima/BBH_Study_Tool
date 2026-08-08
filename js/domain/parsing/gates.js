// Lesson-gate engine for the Phase 2 Parsing/Grammar modules (Cook &
// Holmstedt, Beginning Biblical Hebrew). Pure, dependency-free ES module —
// no imports. Consumes the shape produced by source/bbh/parsing/paradigms.json
// (see tools/validate_bbh_parsing_data.mjs for the schema this assumes:
// every form carries exactly one of `introducedLesson` (1-50) or
// `appendixOnly: true`, plus a non-empty `acceptedParses` array).
//
// This is the ONLY sanctioned way to build lesson-scoped choice/distractor
// pools for Parse/Build UI (Phase 2 PR B+) — going straight to the raw
// paradigms data instead of through here risks leaking future-lesson
// material into a quiz. See docs/bbh-conversion-plan.md "Phase 2
// architecture decisions" #3.
//
// Cumulative gate: at lesson N, a non-appendix form is available iff
// `introducedLesson <= N`. Appendix-only forms are never available unless
// the caller opts in via `{ includeAppendix: true }` (off by default —
// they sit behind a UI toggle). Fails closed: a form with a missing or
// malformed `introducedLesson` and no `appendixOnly: true` is treated as
// unavailable at every lesson, never as available.

const TOTAL_LESSONS = 50;

/**
 * Is a single form available for study at the given lesson?
 *
 * @param {object} form - a form record (introducedLesson | appendixOnly).
 * @param {number} lesson - the lesson number the caller is gated at.
 * @param {{includeAppendix?: boolean}} [opts] - includeAppendix (default
 *   false) opts appendix-only forms into availability.
 * @returns {boolean}
 */
export function isFormAvailable(form, lesson, opts = {}) {
  if (!form || typeof form !== 'object') return false;
  const includeAppendix = opts.includeAppendix === true;
  if (form.appendixOnly === true) {
    return includeAppendix;
  }
  // Fail closed: a non-integer/out-of-range introducedLesson never counts
  // as available, even if `lesson` itself is huge.
  return Number.isInteger(form.introducedLesson) && form.introducedLesson <= lesson;
}

/**
 * Flatten every available form across a list of paradigms, each result
 * augmented with `paradigmId` (the owning paradigm's `id`).
 *
 * @param {object[]} paradigms - paradigms, each with a `forms` array.
 * @param {number} lesson
 * @param {{includeAppendix?: boolean}} [opts]
 * @returns {object[]}
 */
export function availableForms(paradigms, lesson, opts = {}) {
  const out = [];
  if (!Array.isArray(paradigms)) return out;
  for (const paradigm of paradigms) {
    if (!paradigm || !Array.isArray(paradigm.forms)) continue;
    for (const form of paradigm.forms) {
      if (isFormAvailable(form, lesson, opts)) {
        out.push({ ...form, paradigmId: paradigm.id });
      }
    }
  }
  return out;
}

/**
 * Paradigms gated to the given lesson: each surviving paradigm keeps only
 * its available forms, and paradigms left with zero available forms are
 * dropped entirely (a "staged" paradigm whose only forms arrive at a later
 * lesson simply doesn't appear yet).
 *
 * @param {object[]} paradigms
 * @param {number} lesson
 * @param {{includeAppendix?: boolean}} [opts]
 * @returns {object[]} each entry is `{...paradigm, forms: availableForms}`.
 */
export function availableParadigms(paradigms, lesson, opts = {}) {
  const out = [];
  if (!Array.isArray(paradigms)) return out;
  for (const paradigm of paradigms) {
    if (!paradigm || !Array.isArray(paradigm.forms)) continue;
    const forms = paradigm.forms.filter((form) => isFormAvailable(form, lesson, opts));
    if (forms.length > 0) {
      out.push({ ...paradigm, forms });
    }
  }
  return out;
}

// A dimension value serializes as itself except `suffix`, which is either
// null (skipped) or a {person,gender,number} object serialized as
// "person-gender-number" so it can live in a plain string Set.
function serializeDimensionValue(value) {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'object') {
    return `${value.person}-${value.gender}-${value.number}`;
  }
  return String(value);
}

/**
 * Distinct values a parse dimension (e.g. "binyan", "gender", "suffix")
 * takes on across the acceptedParses of an already-gate-filtered set of
 * forms (pass the output of availableForms/availableParadigms — this
 * function does not itself apply any lesson gate). This is the only
 * sanctioned way to build a choice/distractor pool: values only ever come
 * from forms the caller already filtered to the current lesson, so a
 * future-lesson value can never leak in.
 *
 * @param {object[]} forms - forms, each with an acceptedParses array.
 * @param {string} dimension - the parse feature key to collect.
 * @returns {string[]} sorted, deduplicated values.
 */
export function availableDimensionValues(forms, dimension) {
  const values = new Set();
  if (!Array.isArray(forms)) return [];
  for (const form of forms) {
    if (!form || !Array.isArray(form.acceptedParses)) continue;
    for (const parse of form.acceptedParses) {
      if (!parse || typeof parse !== 'object' || !(dimension in parse)) continue;
      const serialized = serializeDimensionValue(parse[dimension]);
      if (serialized !== undefined) values.add(serialized);
    }
  }
  return [...values].sort();
}

/**
 * The smallest lesson at or after `fromLesson` that newly introduces at
 * least one non-appendix form (i.e. some form has `introducedLesson`
 * exactly equal to that lesson) — used for empty-state messaging like
 * "first paradigm arrives at Lesson 16". Returns null if no such lesson
 * exists in `fromLesson..50`. Appendix-only forms never count, since they
 * are opt-in and not tied to lesson progression.
 *
 * @param {object[]} paradigms
 * @param {number} fromLesson
 * @param {{includeAppendix?: boolean}} [opts] - accepted for signature
 *   symmetry with the other gate functions; unused, since appendix-only
 *   material never counts as "new at a lesson".
 * @returns {number|null}
 */
export function firstLessonWithMaterial(paradigms, fromLesson, opts = {}) {
  if (!Array.isArray(paradigms)) return null;
  const lessonsIntroduced = new Set();
  for (const paradigm of paradigms) {
    if (!paradigm || !Array.isArray(paradigm.forms)) continue;
    for (const form of paradigm.forms) {
      if (form && form.appendixOnly !== true && Number.isInteger(form.introducedLesson)) {
        lessonsIntroduced.add(form.introducedLesson);
      }
    }
  }
  for (let lesson = fromLesson; lesson <= TOTAL_LESSONS; lesson += 1) {
    if (lessonsIntroduced.has(lesson)) return lesson;
  }
  return null;
}
