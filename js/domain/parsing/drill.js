// Parse/Build drill domain for the Phase 2 Parsing module (Cook & Holmstedt,
// Beginning Biblical Hebrew). Pure, dependency-free ES module — the ONLY
// import is ./gates.js (the lesson-gate engine), no DOM, no state module, no
// randomness besides the inline seeded PRNG below (never Math.random, so
// every result here is reproducible from its inputs).
//
// This module knows nothing about storage keys, UI, or the shape of the
// wider app state — callers (js/state/*, js/ui/*) own persisting the
// `attempts` map this module reads/writes and translating its outputs into
// UI. See docs/bbh-conversion-plan.md "Phase 2 architecture decisions" #2, #3
// and #6 for the acceptedParses/gating/known-rule contracts this module
// implements.

import { availableForms } from './gates.js';

// ─── Canonical dimension order per part of speech ──────────────────────────
// Hebrew axes only (Phase 2 architecture decision #1) — no tense/voice/mood/
// case. This is the display/grading ORDER for each pos; applicableDimensions
// below trims it down to only the dimensions a given form's acceptedParses
// actually use.
const DIMENSION_ORDER_BY_POS = {
  verb: ['binyan', 'conjugation', 'person', 'gender', 'number', 'suffix'],
  noun: ['gender', 'number', 'state', 'suffix'],
  adjective: ['gender', 'number', 'state'],
  pronoun: ['person', 'gender', 'number', 'deixis'],
  numeral: ['gender', 'number', 'state'],
  particle: ['suffix']
};

/**
 * The ordered list of parse dimensions that apply to a given form, i.e. the
 * subset of that form's pos's canonical dimension order for which AT LEAST
 * ONE of the form's acceptedParses defines the key (present, even if its
 * value is `null` — e.g. an explicit "no suffix"). A dimension where
 * acceptedParses *disagree* in value (ambiguous forms) still applies — this
 * only checks presence, not value agreement.
 *
 * @param {object} form - a form record with `pos` and `acceptedParses`.
 * @returns {string[]} ordered dimension names; `[]` if pos is unknown or no
 *   acceptedParses define any dimension (e.g. a bare particle with `{}`
 *   parses).
 */
export function applicableDimensions(form) {
  if (!form || typeof form !== 'object') return [];
  const order = DIMENSION_ORDER_BY_POS[form.pos];
  if (!order) return [];
  const parses = Array.isArray(form.acceptedParses) ? form.acceptedParses : [];
  return order.filter((dim) => parses.some((parse) => parse && typeof parse === 'object' && dim in parse));
}

// ─── Deterministic seeded PRNG (mulberry32) ────────────────────────────────
// Never Math.random — every ordering/selection in this module must be
// reproducible from an integer seed the caller controls.
function mulberry32(seedInt) {
  let a = seedInt >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fisher-Yates shuffle driven by a seeded PRNG — same seed + same input
// array (order and contents) always yields the same output order.
function seededShuffle(list, seedInt) {
  const rand = mulberry32(seedInt);
  const out = Array.isArray(list) ? list.slice() : [];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

// ─── Structural dimension-value comparison ─────────────────────────────────
// A dimension value is either a plain scalar (string) or, for `suffix`,
// either `null` (explicit "no suffix") or a {person,gender,number} object.
// Two suffix objects are equal iff all three fields match; extra keys are
// ignored (the validator whitelists exactly these three).
function dimensionValuesEqual(pickValue, parseValue) {
  if (parseValue === null) return pickValue === null;
  if (parseValue && typeof parseValue === 'object') {
    if (!pickValue || typeof pickValue !== 'object') return false;
    return (
      pickValue.person === parseValue.person &&
      pickValue.gender === parseValue.gender &&
      pickValue.number === parseValue.number
    );
  }
  return pickValue === parseValue;
}

// A stable string key for an acceptedParse object, used to test whether two
// parses (possibly on different forms) are feature-identical. Key order is
// normalized (sorted) so key-insertion-order differences don't matter.
function parseFeatureKey(parse) {
  if (!parse || typeof parse !== 'object') return '';
  return Object.keys(parse)
    .sort()
    .map((key) => `${key}=${dimensionValueKey(parse[key])}`)
    .join('|');
}
function dimensionValueKey(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'object') return `${value.person}-${value.gender}-${value.number}`;
  return String(value);
}

/**
 * Build the Parse/Build drill pool: the forms a study session should draw
 * from, after lesson gating, scope filtering, and (optionally) excluding
 * already-known forms. Gating is ALWAYS delegated to gates.js's
 * `availableForms` — this function never inspects `paradigms` directly for
 * gate decisions, so a future-lesson form can never leak into a pool.
 *
 * Scope filtering (after gating), in priority order:
 *   1. `focusParadigmId` set — pool is only forms from that one paradigm.
 *   2. else `customParadigmIds` set (non-empty array) — pool is only forms
 *      whose paradigm id is in that list.
 *   3. else `shuffleAll: true` — pool is every gated form (the full
 *      cumulative "everything learned through this lesson" set).
 *   4. else (default) — pool is only forms newly introduced AT `lesson`
 *      itself (plus appendix-only forms, if `includeAppendix` is on) — i.e.
 *      "drill today's new material", the narrowest/default scope.
 *
 * Finally, if `excludeKnown` is true, forms already "known" per
 * `isFormKnown` (graded against `enabledDims` intersected with each form's
 * own `applicableDimensions`) are dropped from the pool.
 *
 * @param {object[]} paradigms - the full (ungated) paradigms array, e.g.
 *   `window.BBH_PARSING.paradigms`.
 * @param {object} opts
 * @param {number} opts.lesson - current lesson gate (1-50).
 * @param {boolean} [opts.includeAppendix=false]
 * @param {?string} [opts.focusParadigmId=null]
 * @param {?string[]} [opts.customParadigmIds=null]
 * @param {boolean} [opts.shuffleAll=false]
 * @param {boolean} [opts.excludeKnown=false]
 * @param {object} [opts.attempts={}] - the attempts map (see recordAttempt).
 * @param {?string[]} [opts.enabledDims=null] - globally-enabled dimensions;
 *   when excluding known forms, each form is graded against the
 *   intersection of this list and its own applicableDimensions. If omitted,
 *   every applicable dimension of each form is treated as enabled.
 * @returns {object[]} forms (each carrying `paradigmId`, per gates.js).
 */
export function buildDrillPool(paradigms, opts = {}) {
  const {
    lesson,
    includeAppendix = false,
    focusParadigmId = null,
    customParadigmIds = null,
    shuffleAll = false,
    excludeKnown = false,
    attempts = {},
    enabledDims = null
  } = opts || {};

  let pool = availableForms(paradigms, lesson, { includeAppendix });

  if (focusParadigmId) {
    pool = pool.filter((form) => form.paradigmId === focusParadigmId);
  } else if (Array.isArray(customParadigmIds) && customParadigmIds.length) {
    const wanted = new Set(customParadigmIds);
    pool = pool.filter((form) => wanted.has(form.paradigmId));
  } else if (!shuffleAll) {
    pool = pool.filter(
      (form) => form.introducedLesson === lesson || (includeAppendix && form.appendixOnly === true)
    );
  }
  // shuffleAll === true (with no focus/custom scope): keep the full
  // cumulative gated pool as-is.

  if (excludeKnown) {
    pool = pool.filter((form) => {
      const dims = Array.isArray(enabledDims)
        ? applicableDimensions(form).filter((dim) => enabledDims.includes(dim))
        : applicableDimensions(form);
      return !isFormKnown(attempts, form.id, dims);
    });
  }

  return pool;
}

/**
 * Order a drill pool for presentation: unseen forms first, then forms that
 * have been seen but are not yet "known" (most-missed first among those),
 * then known forms last. Ties within each bucket are broken by a
 * deterministic seeded shuffle — same `pool` (order/contents) + same
 * `attempts` + same `rngSeedInt` always yields the same output order.
 *
 * Since this function only receives the pool and the attempts map (no
 * dimension-toggle state), "known" here is computed against each form's OWN
 * full `applicableDimensions()` (i.e. as if every applicable dimension were
 * currently enabled). Callers grading a narrower enabled-dimension set
 * should call `isFormKnown`/`formStatus` directly with their own
 * `enabledDims` if they need bucket membership to reflect that.
 *
 * @param {object[]} pool - forms, e.g. the output of buildDrillPool.
 * @param {object} attempts - the attempts map (see recordAttempt).
 * @param {number} rngSeedInt - seed for the deterministic tie-break shuffle.
 * @returns {object[]} the same forms, reordered.
 */
export function orderDrillPool(pool, attempts, rngSeedInt) {
  const forms = Array.isArray(pool) ? pool : [];
  const att = attempts && typeof attempts === 'object' ? attempts : {};
  const seed = rngSeedInt >>> 0;

  const unseen = [];
  const seenNotKnown = [];
  const known = [];

  for (const form of forms) {
    const record = att[form.id];
    const seenCount = record && Array.isArray(record.recent) ? record.recent.length : 0;
    if (!seenCount) {
      unseen.push(form);
      continue;
    }
    const dims = applicableDimensions(form);
    if (isFormKnown(att, form.id, dims)) {
      known.push(form);
    } else {
      seenNotKnown.push(form);
    }
  }

  function missCount(form) {
    const record = att[form.id];
    const history = record && Array.isArray(record.history) ? record.history : [];
    let misses = 0;
    for (const entry of history) {
      const vals = entry && entry.dims && typeof entry.dims === 'object' ? Object.values(entry.dims) : [];
      if (!vals.length || !vals.every((v) => v === 1)) misses += 1;
    }
    return misses;
  }

  const unseenOrdered = seededShuffle(unseen, seed + 1);
  // Stable sort: the seeded shuffle order is preserved as the tie-break
  // among forms with equal missCount (Array#sort is stable in Node/V8).
  const seenOrdered = seededShuffle(seenNotKnown, seed + 2).sort((a, b) => missCount(b) - missCount(a));
  const knownOrdered = seededShuffle(known, seed + 3);

  return [...unseenOrdered, ...seenOrdered, ...knownOrdered];
}

/**
 * Grade a Parse attempt: does ANY of `form`'s acceptedParses match every
 * enabled+applicable dimension of the user's picks?
 *
 * Grading is restricted to `gradedDims` = `applicableDimensions(form)`
 * intersected with `enabledDims` (dimensions the form doesn't have at all
 * are never graded, even if the caller's dimension toggles include them).
 * Each acceptedParse is scored by how many gradedDims it matches; the
 * best-scoring parse (ties broken by first-in-array) determines the result
 * and the returned `perDim` breakdown. `suffix` values compare
 * structurally (see dimensionValuesEqual) — object identity is never used.
 *
 * @param {object} form - a form record (acceptedParses, pos).
 * @param {object} picks - {dimension: value} the user selected.
 * @param {string[]} enabledDims - currently-enabled dimension names.
 * @returns {{result: 'correct'|'partial'|'wrong', perDim: Object<string,0|1>, bestParse: ?object}}
 */
export function evaluateParse(form, picks, enabledDims) {
  const gradedDims = applicableDimensions(form).filter((dim) => Array.isArray(enabledDims) && enabledDims.includes(dim));
  const parses = form && Array.isArray(form.acceptedParses) ? form.acceptedParses : [];

  let bestParse = null;
  let bestScore = -1;
  let bestPerDim = {};

  for (const parse of parses) {
    const perDim = {};
    let score = 0;
    for (const dim of gradedDims) {
      const parseHasDim = parse && typeof parse === 'object' && dim in parse;
      const pickValue = picks && typeof picks === 'object' ? picks[dim] : undefined;
      const match = parseHasDim && dimensionValuesEqual(pickValue, parse[dim]);
      perDim[dim] = match ? 1 : 0;
      if (match) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestParse = parse;
      bestPerDim = perDim;
    }
  }

  let result;
  if (!gradedDims.length || bestScore <= 0) {
    result = 'wrong';
  } else if (bestScore === gradedDims.length) {
    result = 'correct';
  } else {
    result = 'partial';
  }

  return { result, perDim: bestPerDim, bestParse };
}

/**
 * Record a graded attempt for a form, returning a NEW attempts object (the
 * input is never mutated). Each formId's record tracks:
 *   - `seen`: total attempt count.
 *   - `recent`: the last 2 `{at, dims}` entries — the window `isFormKnown`
 *     reads.
 *   - `history`: the last 50 `{at, dims}` entries, for analytics.
 * `dims` in a stored entry is a snapshot of the `perDim` the caller passed
 * (i.e. exactly the dimensions that WERE graded for that attempt) — this is
 * what lets `isFormKnown` detect "this old attempt doesn't cover a
 * dimension enabled now" after a toggle change.
 *
 * @param {object} attempts - the current attempts map ({[formId]: record}).
 * @param {string} formId
 * @param {Object<string,0|1>} perDim - the `perDim` from evaluateParse.
 * @param {{at?: number}} [meta] - `at`: a timestamp/ordinal for the entry
 *   (defaults to 0 if omitted, keeping this function pure/deterministic
 *   when the caller doesn't supply one — real callers should pass
 *   `Date.now()`).
 * @returns {object} a new attempts object with formId's record updated.
 */
export function recordAttempt(attempts, formId, perDim, meta = {}) {
  const prevAll = attempts && typeof attempts === 'object' ? attempts : {};
  const prev = prevAll[formId] && typeof prevAll[formId] === 'object' ? prevAll[formId] : { seen: 0, recent: [], history: [] };
  const at = typeof meta.at === 'number' ? meta.at : 0;
  const dims = perDim && typeof perDim === 'object' ? { ...perDim } : {};
  const entry = { at, dims };

  const prevRecent = Array.isArray(prev.recent) ? prev.recent : [];
  const prevHistory = Array.isArray(prev.history) ? prev.history : [];

  return {
    ...prevAll,
    [formId]: {
      seen: (Number(prev.seen) || 0) + 1,
      recent: [...prevRecent, entry].slice(-2),
      history: [...prevHistory, entry].slice(-50)
    }
  };
}

/**
 * Is a form "known"? True iff the attempts record for `formId` has at least
 * 2 `recent` entries, and EACH of the last 2 covers every dimension in
 * `enabledDims` (i.e. `dim in entry.dims` for every enabled dim — an entry
 * recorded before a dimension was toggled on does NOT count, even if the
 * dimensions it DID cover all scored 1) and scores 1 on every one of them.
 * An empty `enabledDims` can never be "known" (nothing graded => nothing
 * proven known).
 *
 * Recomputed fresh from the structured `recent` records every call — this
 * is what makes "known" recompute correctly (rather than corrupt) when the
 * caller's currently-enabled dimension set changes between calls.
 *
 * @param {object} attempts
 * @param {string} formId
 * @param {string[]} enabledDims - the dims that must be covered+correct.
 * @returns {boolean}
 */
export function isFormKnown(attempts, formId, enabledDims) {
  const dims = Array.isArray(enabledDims) ? enabledDims : [];
  if (!dims.length) return false;

  const record = attempts && typeof attempts === 'object' ? attempts[formId] : undefined;
  const recent = record && Array.isArray(record.recent) ? record.recent : [];
  if (recent.length < 2) return false;

  return recent.slice(-2).every((entry) => {
    if (!entry || typeof entry.dims !== 'object' || entry.dims === null) return false;
    return dims.every((dim) => dim in entry.dims && entry.dims[dim] === 1);
  });
}

/**
 * Build the choice set for a "Build the Form" question: given a target
 * form's meaning (its acceptedParses), which in-scope forms would ALSO be
 * correct answers (feature-identical parse — e.g. syncretic/homographic
 * forms sharing a parse), and which additional in-scope forms should serve
 * as distractors.
 *
 * `acceptedIds` = every in-scope (gated, same pos as `targetForm`) form
 * whose acceptedParses include a parse that is feature-identical (exact
 * key/value match, including structural suffix comparison) to one of
 * `targetForm`'s acceptedParses. `targetForm` itself is always included.
 *
 * Distractors are drawn ONLY from in-scope forms of the same pos that are
 * NOT in `acceptedIds`, preferring same-paradigm forms before others, via a
 * deterministic seeded selection. If fewer than `count - 1` distractors
 * exist, whatever is available is used — this never fabricates choices, and
 * can legitimately return fewer than `count` total (never fewer than 2
 * unless the in-scope pool itself doesn't have 2 to offer).
 *
 * @param {object[]} paradigms - full ungated paradigms array.
 * @param {object} targetForm - the form being asked about (already gated).
 * @param {object} opts
 * @param {number} opts.lesson
 * @param {boolean} [opts.includeAppendix=false]
 * @param {number} [opts.count=4]
 * @param {number} [opts.rngSeedInt=0]
 * @returns {{choices: string[], acceptedIds: string[]}}
 */
export function buildFormChoices(paradigms, targetForm, opts = {}) {
  const { lesson, includeAppendix = false, count = 4, rngSeedInt = 0 } = opts || {};

  const inScope = availableForms(paradigms, lesson, { includeAppendix });
  const samePos = inScope.filter((form) => form.pos === targetForm.pos);

  const targetKeys = new Set((targetForm.acceptedParses || []).map(parseFeatureKey));
  const acceptedForms = samePos.filter((form) =>
    (form.acceptedParses || []).some((parse) => targetKeys.has(parseFeatureKey(parse)))
  );

  const acceptedIds = acceptedForms.map((form) => form.id);
  const acceptedIdSet = new Set(acceptedIds);
  if (!acceptedIdSet.has(targetForm.id)) {
    acceptedIds.push(targetForm.id);
    acceptedIdSet.add(targetForm.id);
  }

  const distractorPool = samePos.filter((form) => !acceptedIdSet.has(form.id));
  const samePoolFirst = distractorPool.filter((form) => form.paradigmId === targetForm.paradigmId);
  const otherPool = distractorPool.filter((form) => form.paradigmId !== targetForm.paradigmId);

  const shuffledSame = seededShuffle(samePoolFirst, rngSeedInt);
  const shuffledOther = seededShuffle(otherPool, rngSeedInt + 1);
  const distractorsNeeded = Math.max(0, count - 1);
  const distractors = [...shuffledSame, ...shuffledOther].slice(0, distractorsNeeded);

  const seen = new Set();
  const choiceForms = [targetForm, ...distractors].filter((form) => {
    if (seen.has(form.id)) return false;
    seen.add(form.id);
    return true;
  });

  const choices = seededShuffle(choiceForms, rngSeedInt + 2).map((form) => form.id);

  return { choices, acceptedIds };
}

/**
 * The display status of a form from its most recent attempt(s):
 *   - 'unseen': no attempts recorded.
 *   - 'known': passes isFormKnown for `enabledDims`.
 *   - 'right' | 'partial' | 'wrong': from the single most recent attempt,
 *     restricted to whichever of `enabledDims` that attempt actually
 *     covered — 'right' if all covered enabled dims scored 1, 'partial' if
 *     some did, 'wrong' if none did. If the most recent attempt covers none
 *     of the currently-enabled dims (e.g. it predates a toggle), this
 *     returns 'unseen' (no usable information under the current toggles).
 *
 * @param {object} attempts
 * @param {string} formId
 * @param {string[]} enabledDims
 * @returns {'known'|'right'|'partial'|'wrong'|'unseen'}
 */
export function formStatus(attempts, formId, enabledDims) {
  const record = attempts && typeof attempts === 'object' ? attempts[formId] : undefined;
  const recent = record && Array.isArray(record.recent) ? record.recent : [];
  if (!recent.length) return 'unseen';

  if (isFormKnown(attempts, formId, enabledDims)) return 'known';

  const last = recent[recent.length - 1];
  if (!last || typeof last.dims !== 'object' || last.dims === null) return 'unseen';

  const dims = Array.isArray(enabledDims) ? enabledDims : [];
  const relevantDims = dims.filter((dim) => dim in last.dims);
  if (!relevantDims.length) return 'unseen';

  const scores = relevantDims.map((dim) => last.dims[dim]);
  if (scores.every((s) => s === 1)) return 'right';
  if (scores.some((s) => s === 1)) return 'partial';
  return 'wrong';
}
