// Parsing mode UI (Phase 2 PR B) — Cook & Holmstedt, Beginning Biblical
// Hebrew. Renders the Parsing options panel, the Parse/Build drill flow, and
// the Parsing analytics section; owns click/change handling for all of it.
//
// Hard boundary: this module imports ONLY from ../domain/parsing/gates.js
// and ../domain/parsing/drill.js — no runtime.js, no utils/helpers.js, no
// DOM helpers from elsewhere. Everything else (the live runtime.parsing
// reference, the vocab lesson selection, persistence, a one-time session
// seed) comes in via configureParsing(deps), same "runtime dependency
// injection" pattern CLAUDE.md documents for navigation.js's host hooks.
// Parsing never touches vocab SRS/marks/progress — see
// docs/bbh-conversion-plan.md "Phase 2 architecture decisions" #6.
//
// Reads its inventory from window.BBH_PARSING (classic script global, same
// idiom as window.SETS for vocab — see js/data/bbh_parsing.js's header).

import {
  availableForms,
  availableParadigms,
  availableDimensionValues,
  firstLessonWithMaterial
} from '../domain/parsing/gates.js';
import {
  applicableDimensions,
  buildDrillPool,
  orderDrillPool,
  evaluateParse,
  recordAttempt,
  isFormKnown,
  buildFormChoices,
  formStatus
} from '../domain/parsing/drill.js';

// ─── Host (runtime dependency injection) ───────────────────────────────────
let host = {
  // Returns the LIVE runtime.parsing object (mutated in place, same pattern
  // every other UI module uses for its slice of runtime.*).
  getState: () => null,
  // Vocab lesson selection (runtime.selectedKeys) — read once, for the
  // "initialize from highest selected vocab lesson" first-use rule.
  getSelectedVocabKeys: () => [],
  // A single integer captured once at session init (`new Date()` at
  // startup, never at call sites) — used only as a deterministic shuffle
  // seed, never persisted, never Math.random.
  getSessionSeed: () => 0,
  saveState: () => {}
};

export function configureParsing(deps) {
  host = { ...host, ...deps };
}

// ─── Small local utilities (no imports allowed beyond gates/drill) ────────
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isPlainObject(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function hashStringToInt(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h >>> 0;
}

// Mirrors drill.js's private dimensionValuesEqual — used ONLY to render the
// "picks vs every acceptedParse" comparison table. The actual pass/fail
// verdict recorded to attempts always comes from drill.evaluateParse; this
// is a presentation-only re-derivation for displaying every accepted parse
// (evaluateParse only returns the single best-matching one).
function dimensionValuesEqualLocal(pickValue, parseValue) {
  if (parseValue === null) return pickValue === null;
  if (parseValue && typeof parseValue === 'object') {
    if (!pickValue || typeof pickValue !== 'object') return false;
    return pickValue.person === parseValue.person && pickValue.gender === parseValue.gender && pickValue.number === parseValue.number;
  }
  return pickValue === parseValue;
}

// Parse-summary "Contrast" block: up to 3 other in-gate forms from the SAME
// paradigm whose accepted parse differs from the drilled form's in EXACTLY
// one currently-graded dimension — e.g. after drilling the 3ms Qal perfect,
// show the 3fs form as "Gender: fem." A dimension missing from either side
// makes that pair non-comparable (skipped) rather than a false "differs by
// one". Ties (more than 3 qualifying neighbors) are broken deterministically
// by form id — no randomness, same drilled form always yields the same
// Contrast set for a given lesson/appendix gate.
function computeContrastForms(state, form, gradedDims) {
  if (!form || !Array.isArray(gradedDims) || !gradedDims.length) return [];
  const gated = availableForms(getParadigms(), state.lesson, { includeAppendix: state.includeAppendix });
  const candidates = gated.filter((f) => f.paradigmId === form.paradigmId && f.id !== form.id);
  const results = [];
  candidates.forEach((candidate) => {
    let found = null;
    (form.acceptedParses || []).forEach((fp) => {
      if (found) return;
      (candidate.acceptedParses || []).forEach((cp) => {
        if (found) return;
        const diffDims = [];
        let comparable = true;
        for (const d of gradedDims) {
          const fHas = fp && typeof fp === 'object' && d in fp;
          const cHas = cp && typeof cp === 'object' && d in cp;
          if (!fHas || !cHas) { comparable = false; break; }
          if (!dimensionValuesEqualLocal(fp[d], cp[d])) diffDims.push(d);
        }
        if (comparable && diffDims.length === 1) {
          found = { diffDim: diffDims[0], diffValue: cp[diffDims[0]] };
        }
      });
    });
    if (found) results.push({ form: candidate, diffDim: found.diffDim, diffValue: found.diffValue });
  });
  results.sort((a, b) => a.form.id.localeCompare(b.form.id));
  return results.slice(0, 3);
}

function parseSuffixSerialized(serialized) {
  const parts = String(serialized).split('-');
  if (parts.length !== 3) return null;
  return { person: parts[0], gender: parts[1], number: parts[2] };
}

const PARSING_DIM_KEYS = ['binyan', 'conjugation', 'person', 'gender', 'number', 'suffix', 'state'];
const DIM_TOGGLE_LABELS = {
  binyan: 'Binyan', conjugation: 'Conjugation', person: 'Person', gender: 'Gender',
  number: 'Number', suffix: 'Suffix', state: 'State', deixis: 'Deixis'
};
const CATEGORY_ORDER = ['verb', 'noun', 'adjective', 'pronoun', 'particle', 'numeral'];
const CATEGORY_LABELS = { verb: 'Verb', noun: 'Noun', adjective: 'Adjective', pronoun: 'Pronoun', particle: 'Particle', numeral: 'Numeral' };

const DIM_VALUE_LABELS = {
  binyan: { qal: 'Qal', nifal: 'Nifal', piel: 'Piel', pual: 'Pual', hitpael: 'Hitpael', hifil: 'Hifil', hofal: 'Hofal' },
  conjugation: {
    perfect: 'Perfect', imperfect: 'Imperfect', 'past-narrative': 'Past narrative',
    imperative: 'Imperative', jussive: 'Jussive', infinitive: 'Infinitive',
    'adverbial-infinitive': 'Adverbial infinitive', participle: 'Participle'
  },
  person: { 1: '1st', 2: '2nd', 3: '3rd', '1': '1st', '2': '2nd', '3': '3rd' },
  gender: { masculine: 'masc.', feminine: 'fem.', common: 'common' },
  number: { singular: 'sing.', plural: 'plural', dual: 'dual' },
  state: { absolute: 'absolute', construct: 'construct' },
  deixis: { near: 'near', far: 'far' }
};

function formatDimValue(dim, value) {
  if (dim === 'suffix') {
    if (value === null || value === undefined) return '(no suffix)';
    if (isPlainObject(value)) {
      const p = (DIM_VALUE_LABELS.person && DIM_VALUE_LABELS.person[value.person]) || value.person;
      const g = (DIM_VALUE_LABELS.gender && DIM_VALUE_LABELS.gender[value.gender]) || value.gender;
      const n = (DIM_VALUE_LABELS.number && DIM_VALUE_LABELS.number[value.number]) || value.number;
      return `${p} ${g} ${n} suffix`;
    }
    return String(value);
  }
  const map = DIM_VALUE_LABELS[dim] || {};
  return map[value] !== undefined ? map[value] : String(value);
}

function formatParseLabel(parse, dims) {
  const parts = (Array.isArray(dims) ? dims : [])
    .filter((d) => parse && typeof parse === 'object' && d in parse)
    .map((d) => formatDimValue(d, parse[d]));
  return parts.join(' · ');
}

function formatSourceRef(form) {
  const src = form && form.source;
  if (!src) return '';
  if (form.appendixOnly && src.appendix) return `Appendix ${src.appendix}, p. ${src.page}`;
  if (src.lesson) return `Lesson ${src.lesson}, p. ${src.page}`;
  if (src.appendix) return `Appendix ${src.appendix}, p. ${src.page}`;
  return '';
}

function toggleHtml({ id, label, checked, onclick, title }) {
  return `<button class="toggle-label" id="${id}" type="button" role="switch" aria-checked="${checked ? 'true' : 'false'}" onclick="${onclick}"${title ? ` title="${escapeHtml(title)}"` : ''}>
    <span class="toggle-text">${escapeHtml(label)}</span>
    <span class="toggle-switch${checked ? ' on' : ''}" aria-hidden="true"></span>
  </button>`;
}

// ─── Inventory access ───────────────────────────────────────────────────
function getParadigms() {
  return (window.BBH_PARSING && Array.isArray(window.BBH_PARSING.paradigms)) ? window.BBH_PARSING.paradigms : [];
}

function getFormById(formId) {
  const paradigms = getParadigms();
  for (const p of paradigms) {
    const forms = Array.isArray(p.forms) ? p.forms : [];
    for (const f of forms) {
      if (f.id === formId) return { ...f, paradigmId: p.id };
    }
  }
  return null;
}

function getEnabledDims(state) {
  return PARSING_DIM_KEYS.filter((d) => state && state.dims && state.dims[d] !== false);
}

function getGatedPool(state) {
  return availableForms(getParadigms(), state.lesson, { includeAppendix: state.includeAppendix });
}

function getScopedPool(state, { excludeKnown }) {
  const mode = getScopeMode(state);
  const customIds = (mode === 'custom' && Object.keys(state.customSet || {}).some((id) => state.customSet[id]))
    ? Object.keys(state.customSet).filter((id) => state.customSet[id])
    : null;
  return buildDrillPool(getParadigms(), {
    lesson: state.lesson,
    includeAppendix: state.includeAppendix,
    focusParadigmId: mode === 'focused' ? (state.focusedParadigmId || null) : null,
    customParadigmIds: customIds,
    // 'byFeature' draws from the full cumulative gated pool (like shuffle),
    // then dimValueFilter below narrows it — §5 amendment 4.
    shuffleAll: mode === 'shuffle' || mode === 'byFeature',
    rootFilter: mode === 'root' ? state.rootFilter : null,
    dimValueFilter: mode === 'byFeature' ? state.dimValueFilter : null,
    excludeKnown,
    attempts: state.attempts,
    enabledDims: getEnabledDims(state)
  });
}

// A stale focused paradigm / custom-set selection (no longer available at
// the current lesson+appendix gate) is pruned so the UI never shows "None"
// selected while a hidden id silently still narrows the pool to nothing.
function pruneStaleScope(state) {
  const gated = availableParadigms(getParadigms(), state.lesson, { includeAppendix: state.includeAppendix });
  const gatedIds = new Set(gated.map((p) => p.id));
  if (state.focusedParadigmId && !gatedIds.has(state.focusedParadigmId)) state.focusedParadigmId = null;
  const nextCustom = {};
  Object.keys(state.customSet || {}).forEach((id) => {
    if (gatedIds.has(id)) nextCustom[id] = true;
  });
  state.customSet = nextCustom;
}

// ─── PR G: scope-mode derivation + Root/By-feature helpers ─────────────────
// The scope control's active mode is DERIVED from state, never stored as
// its own field (docs/bbh-parsing-depth-review.md §5 amendment 6):
// shuffleAll/customSetOn stay the stored booleans they always were, and
// rootFilter/dimValueFilter are truthy IFF their mode is active — that
// invariant is maintained by every handler below (parsingSetScopeMode,
// parsingSetRoot, parsingSetFeatureDim, parsingSetParadigm, lesson/appendix
// changes) always nulling out the other three scope fields together.
function getScopeMode(state) {
  if (state.rootFilter) return 'root';
  if (state.dimValueFilter) return 'byFeature';
  if (state.customSetOn) return 'custom';
  if (state.shuffleAll) return 'shuffle';
  return 'focused';
}

// Roots with >=2 in-gate paradigms at the current lesson+appendix gate —
// the only roots the Root-journey picker offers (§5 amendment 1: "Root
// scope honesty"). Computed over the GATED pool so the list (and its
// "n forms · Lm–Ln" captions) always matches what's actually drillable
// right now, not the book-wide total.
function computeRootIndex(state) {
  const gated = getGatedPool(state);
  const byRoot = {};
  gated.forEach((f) => {
    if (!f.root) return;
    if (!byRoot[f.root]) byRoot[f.root] = { root: f.root, paradigmIds: new Set(), forms: [] };
    byRoot[f.root].paradigmIds.add(f.paradigmId);
    byRoot[f.root].forms.push(f);
  });
  return Object.values(byRoot).map((entry) => {
    const lessons = entry.forms.map((f) => f.introducedLesson).filter((n) => Number.isInteger(n));
    return {
      root: entry.root,
      paradigmCount: entry.paradigmIds.size,
      formCount: entry.forms.length,
      minLesson: lessons.length ? Math.min(...lessons) : null,
      maxLesson: lessons.length ? Math.max(...lessons) : null,
      qualifies: entry.paradigmIds.size >= 2
    };
  }).sort((a, b) => a.root.localeCompare(b.root));
}

// The earliest lesson (1-50) at which ANY root reaches 2 in-gate paradigms
// under the given appendix setting — used for the scope control's disabled
// "unlocks at Lesson N" caption when zero roots currently qualify. Cheap
// (<=50 lessons x ~429 forms, run only when rendering the options panel).
function firstLessonRootUnlocks(includeAppendix) {
  const paradigms = getParadigms();
  for (let lesson = 1; lesson <= 50; lesson += 1) {
    const gated = availableForms(paradigms, lesson, { includeAppendix });
    const byRoot = {};
    for (const f of gated) {
      if (!f.root) continue;
      if (!byRoot[f.root]) byRoot[f.root] = new Set();
      byRoot[f.root].add(f.paradigmId);
      if (byRoot[f.root].size >= 2) return lesson;
    }
  }
  return null;
}

// The root's "conjugation stations" for the journey map: one entry per
// PARADIGM that has at least one form with this root (searched over the
// FULL, ungated paradigms list, not just what's in-gate — locked/future
// stations are meant to render dimmed, not disappear). Ordered by each
// paradigm's earliest introducedLesson among this root's forms.
function computeRootStations(state, root) {
  const paradigms = getParadigms();
  const gatedIds = new Set(getGatedPool(state).filter((f) => f.root === root).map((f) => f.id));
  const stations = [];
  paradigms.forEach((p) => {
    const rootForms = (p.forms || []).filter((f) => f.root === root);
    if (!rootForms.length) return;
    const lessons = rootForms.map((f) => f.introducedLesson).filter((n) => Number.isInteger(n));
    const minLesson = lessons.length ? Math.min(...lessons) : Number.POSITIVE_INFINITY;
    const inGate = rootForms.some((f) => gatedIds.has(f.id));
    stations.push({ paradigmId: p.id, label: p.label, minLesson, inGate });
  });
  stations.sort((a, b) => a.minLesson - b.minLesson);
  return stations;
}

function renderJourneyMap(stations, forCurrentForm) {
  if (!stations || !stations.length) return '';
  const items = stations.map((s) => {
    const isCurrent = !!(forCurrentForm && forCurrentForm.paradigmId === s.paradigmId);
    const classes = ['parsing-journey-station'];
    if (isCurrent) classes.push('parsing-journey-station-current');
    if (!s.inGate) classes.push('parsing-journey-station-locked');
    return `<span class="${classes.join(' ')}"${isCurrent ? ' aria-current="step"' : ''}>${escapeHtml(s.label)}</span>`;
  });
  return `<div class="parsing-journey-map" role="list" aria-label="Root journey stations">${items.join('<span class="parsing-journey-sep" aria-hidden="true">→</span>')}</div>`;
}

// Journey mode ignores exclude-known for POOL MEMBERSHIP (a known form still
// belongs to the walk) and instead starts the cursor at the first station
// that ISN'T known yet — re-derived whenever the root or lesson/appendix
// gate changes (docs/bbh-parsing-depth-review.md §5 amendment 2). Relies on
// state.rootFilter already being set (and hence getScopeMode(state)==='root')
// by the caller before this runs.
function resetJourneyCursorToFirstNotKnown(state) {
  const pool = getScopedPool(state, { excludeKnown: false });
  const ordered = orderDrillPool(pool, state.attempts, host.getSessionSeed(), { mode: 'journey' });
  const enabledDims = getEnabledDims(state);
  const idx = ordered.findIndex((f) => {
    const dims = applicableDimensions(f).filter((d) => enabledDims.includes(d));
    return dims.length ? !isFormKnown(state.attempts, f.id, dims) : true;
  });
  state.journeyIndex = idx >= 0 ? idx : 0;
}

// Defensive: if the currently-selected root drops below 2 in-gate paradigms
// (e.g. the lesson was turned back down, or appendix was toggled off), clear
// rootFilter rather than silently narrowing the pool to <2 paradigms behind
// a control that still LOOKS like "Root journey" is active.
function pruneStaleRootFilter(state) {
  if (!state.rootFilter) return;
  const entry = computeRootIndex(state).find((r) => r.root === state.rootFilter);
  if (!entry || !entry.qualifies) {
    state.rootFilter = null;
    state.journeyIndex = 0;
    rootDrillActive = false;
    currentForm = null;
    host.saveState();
  }
}

function seedForForm(formId) {
  return (hashStringToInt(String(formId)) ^ (host.getSessionSeed() >>> 0)) >>> 0;
}

// buildFormChoices (drill.js) only ever guarantees the target form itself
// among its returned `choices` — any OTHER form that also legitimately
// matches the target's parse (a feature-identical homograph, e.g. the Qal
// imperfect 2ms/3fs pair) is deliberately excluded from `choices` so a
// single-answer Build question never accidentally shows 2 "right answers".
// For the "all that apply" variant we want the OPPOSITE when such a
// homograph is in scope: swap it into a wrong-answer slot so the learner
// faces the real ambiguity instead of a single canonical pick. Presentation-
// only reshuffle of the ids drill.js already computed — never touches
// drill.js's contract, never invents a new "accepted" relationship.
function augmentBuildChoicesForAllThatApply(choices, acceptedIds, targetId, maxExtra) {
  const result = Array.isArray(choices) ? choices.slice() : [];
  const acceptedSet = new Set(acceptedIds || []);
  const displayed = new Set(result);
  const extras = (acceptedIds || []).filter((id) => id !== targetId && !displayed.has(id));
  let injected = 0;
  for (const id of extras) {
    if (injected >= maxExtra) break;
    const replaceIdx = result.findIndex((cid) => cid !== targetId && !acceptedSet.has(cid));
    if (replaceIdx === -1) break;
    result[replaceIdx] = id;
    displayed.add(id);
    injected += 1;
  }
  return result;
}

// ─── Module-local (non-persisted) walk state ───────────────────────────────
let currentForm = null;   // the form currently being asked about (full record)
let avoidFormId = null;   // set by Next so the reordered pool doesn't repeat it
let lastResult = null;    // graded result driving the summary render

// Which UI a card actually renders as when direction === 'mixed': computed
// once per card in startCardFor and read by renderParsingArea. For
// direction 'parse'/'build' this always mirrors state.direction.
let currentCardDirection = 'parse';
// Advances once per card started while direction === 'mixed' — combined
// with the session seed (never Math.random) to deterministically alternate
// Parse/Build. Not persisted: a reload simply restarts the alternation,
// which is fine since nothing about "known"/grading depends on it.
let mixedCounter = 0;

let parseSteps = [];
let parseStepIndex = 0;
let parsePicks = {};

let buildChoiceIds = null;
let buildAcceptedIds = null;
// "All that apply" Build variant — set when 2+ of the DISPLAYED choices are
// legitimate matches for the target parse (see augmentBuildChoicesForAllThatApply).
let buildMultiSelect = false;
let buildPicks = new Set();

// ─── PR G: Root journey / By-feature scope state (module-local) ───────────
// "Drill this root" is a transient sub-mode of Root scope (weakest-first
// ordering instead of journey order) — deliberately NOT persisted (only
// runtime.parsing.journeyIndex is, per docs/bbh-parsing-depth-review.md §5
// amendment 2). Resets to false whenever scope mode, root selection, or
// lesson/appendix gate changes.
let rootDrillActive = false;
// ontoggle-tracked <details> open state for the custom-set category groups,
// keyed by category id. Ephemeral (not persisted, mirrors the session-only
// mixedCounter pattern above) — fixes the "custom-group collapse discard"
// bug: previously each group's open/closed state was RECOMPUTED from
// `selected > 0` on every render(), silently closing a group the user had
// manually opened just to browse. ontoggle now writes here directly with NO
// render() call, and renderCustomSetGroups reads from here first (falling
// back to the old selected>0 default only the first time a group renders).
let customGroupOpenState = {};

function applyAttempt(state, formId, perDim) {
  state.attempts = recordAttempt(state.attempts, formId, perDim, { at: Date.now() });
  host.saveState();
}

function finishParse(state) {
  const enabledDims = getEnabledDims(state);
  const { perDim } = evaluateParse(currentForm, parsePicks, enabledDims);
  applyAttempt(state, currentForm.id, perDim);
  lastResult = { mode: 'parse', form: currentForm, picks: { ...parsePicks }, perDim };
}

// Deterministic Parse/Build alternation for direction === 'mixed'. Driven
// by the session seed (never Math.random) + a per-card counter, so within a
// session cards genuinely alternate; across a reload the alternation simply
// restarts (nothing gradeable depends on which half a card lands in).
function nextMixedDirection() {
  const parity = (mixedCounter + (host.getSessionSeed() >>> 0)) % 2;
  mixedCounter += 1;
  return parity === 0 ? 'parse' : 'build';
}

function startCardFor(form, state) {
  currentForm = form;
  lastResult = null;
  const effectiveDirection = state.direction === 'mixed' ? nextMixedDirection() : state.direction;
  currentCardDirection = effectiveDirection;
  if (effectiveDirection === 'build') {
    buildChoiceIds = null;
    buildAcceptedIds = null;
    buildMultiSelect = false;
    buildPicks = new Set();
    const { choices, acceptedIds } = buildFormChoices(getParadigms(), form, {
      lesson: state.lesson,
      includeAppendix: state.includeAppendix,
      count: 6,
      rngSeedInt: seedForForm(form.id)
    });
    buildChoiceIds = augmentBuildChoicesForAllThatApply(choices, acceptedIds, form.id, 2);
    buildAcceptedIds = acceptedIds;
    buildMultiSelect = buildChoiceIds.filter((id) => acceptedIds.includes(id)).length >= 2;
  } else {
    const enabledDims = getEnabledDims(state);
    parseSteps = applicableDimensions(form).filter((d) => enabledDims.includes(d));
    parseStepIndex = 0;
    parsePicks = {};
    if (!parseSteps.length) finishParse(state);
  }
}

function pickAndStart(pool, state) {
  const ordered = orderDrillPool(pool, state.attempts, host.getSessionSeed());
  let pick = ordered[0];
  if (avoidFormId && pick && pick.id === avoidFormId && ordered.length > 1) pick = ordered[1];
  avoidFormId = null;
  startCardFor(pick, state);
}

// A flat 58-paradigm checklist is not user-friendly (user feedback) — group
// by category (verb/noun/adjective/pronoun/particle/numeral) behind native
// <details>/<summary> so it's keyboard-accessible with no custom JS focus
// handling. Each group header shows "n of m selected" and a tri-state
// select-all/clear button. Groups with nothing in scope at the current
// lesson+appendix gate are simply omitted (gatedParadigms is already gated).
function renderCustomSetGroups(state, gatedParadigms) {
  const byCategory = {};
  gatedParadigms.forEach((p) => {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  });
  const groups = CATEGORY_ORDER.filter((cat) => byCategory[cat] && byCategory[cat].length).map((cat) => {
    const list = byCategory[cat];
    const total = list.length;
    const selected = list.filter((p) => state.customSet[p.id]).length;
    const allSelected = selected === total && total > 0;
    const items = list.map((p) => `
      <label class="parsing-custom-item">
        <input type="checkbox" onchange="parsingToggleCustomSetParadigm('${escapeHtml(p.id)}', this.checked)"${state.customSet[p.id] ? ' checked' : ''}>
        <span>${escapeHtml(p.label)}</span>
      </label>`).join('');
    const isOpen = cat in customGroupOpenState ? customGroupOpenState[cat] : selected > 0;
    return `
      <details class="parsing-custom-group"${isOpen ? ' open' : ''} ontoggle="parsingSetCustomGroupOpen('${escapeHtml(cat)}', this.open)">
        <summary class="parsing-custom-group-summary">
          <span class="parsing-custom-group-label">${escapeHtml(CATEGORY_LABELS[cat] || cat)}</span>
          <span class="parsing-custom-group-count">${selected} of ${total} selected</span>
        </summary>
        <div class="parsing-custom-group-body">
          <button class="ctrl-btn parsing-custom-group-toggle" type="button" onclick="parsingToggleCustomSetGroup('${escapeHtml(cat)}')">${allSelected ? 'Clear' : 'Select all'}</button>
          <div class="parsing-custom-set-list">${items}</div>
        </div>
      </details>`;
  }).join('');
  return groups || '<div class="parsing-empty-note">No paradigms available at this lesson yet.</div>';
}

// ─── Rendering: scope control + per-mode inline pickers (PR G, §2.3/§5.5;
// restyled to a 2-column card grid by PR H item 7a) ─────────────────────
// A 2-column grid of selectable cards (same visual pattern as the
// study-selector's session/preset cards — .chapter-btn/.session-btn: plain
// label, gold border+highlight when active, own independent border-radius
// per card rather than a fused .theme-switcher pill) picking ONE of 5
// mutually-exclusive scopes; the picker row directly below it is entirely
// mode-dependent (only one of these ever renders). "(verbs)" is dropped
// from the Root journey card label — see renderRootPickerRow's "Root
// (verbs)" field label for where that qualifier now lives.
function renderScopeControl(state, rootIndex) {
  const mode = getScopeMode(state);
  const rootQualifies = rootIndex.some((r) => r.qualifies);
  let rootDisabledAttrs = '';
  if (!rootQualifies) {
    const unlockLesson = firstLessonRootUnlocks(state.includeAppendix);
    const caption = unlockLesson ? `unlocks at Lesson ${unlockLesson}` : 'no qualifying roots yet';
    rootDisabledAttrs = ` disabled aria-disabled="true" title="${escapeHtml(caption)}"`;
  }
  const cards = [
    { key: 'focused', label: 'Focused' },
    { key: 'root', label: 'Root journey', attrs: rootDisabledAttrs },
    { key: 'byFeature', label: 'By feature' },
    { key: 'shuffle', label: 'Shuffle' },
    { key: 'custom', label: 'Custom' }
  ];
  const cardsHtml = cards.map((c) => `
      <button class="parsing-scope-card${mode === c.key ? ' active' : ''}" type="button" onclick="parsingSetScopeMode('${c.key}')"${c.attrs || ''}>${escapeHtml(c.label)}</button>`).join('');
  return `
    <div class="parsing-scope-grid" id="parsingScopeControl" role="group" aria-label="Practice scope">${cardsHtml}
    </div>`;
}

function renderFocusedPickerRow(state) {
  const gatedParadigms = availableParadigms(getParadigms(), state.lesson, { includeAppendix: state.includeAppendix });
  const byCategory = {};
  gatedParadigms.forEach((p) => {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  });
  let paradigmOptions = `<option value=""${state.focusedParadigmId ? '' : ' selected'}>None (today's new material)</option>`;
  CATEGORY_ORDER.forEach((cat) => {
    const list = byCategory[cat];
    if (!list || !list.length) return;
    paradigmOptions += `<optgroup label="${escapeHtml(CATEGORY_LABELS[cat] || cat)}">`;
    list.forEach((p) => {
      paradigmOptions += `<option value="${escapeHtml(p.id)}"${state.focusedParadigmId === p.id ? ' selected' : ''}>${escapeHtml(p.label)}</option>`;
    });
    paradigmOptions += '</optgroup>';
  });
  return `
    <div class="parsing-options-row parsing-scope-picker-row">
      <label class="parsing-field-label" for="parsingParadigmSelect">Focused paradigm</label>
      <select id="parsingParadigmSelect" class="parsing-select" onchange="parsingSetParadigm(this.value)">${paradigmOptions}</select>
    </div>`;
}

function renderRootPickerRow(state, rootIndex) {
  const qualifying = rootIndex.filter((r) => r.qualifies);
  if (!qualifying.length) return '';
  let options = '';
  qualifying.forEach((r) => {
    const caption = `${r.root} — ${r.formCount} form${r.formCount === 1 ? '' : 's'} · L${r.minLesson}–L${r.maxLesson}`;
    options += `<option value="${escapeHtml(r.root)}"${state.rootFilter === r.root ? ' selected' : ''}>${escapeHtml(caption)}</option>`;
  });
  const drillLabel = rootDrillActive ? 'Back to journey order' : 'Drill this root (weakest-first)';
  return `
    <div class="parsing-options-row parsing-scope-picker-row">
      <label class="parsing-field-label" for="parsingRootSelect">Root (verbs)</label>
      <select id="parsingRootSelect" class="parsing-select" onchange="parsingSetRoot(this.value)">${options}</select>
      <button class="ctrl-btn parsing-drill-root-btn" type="button" onclick="parsingToggleRootDrillMode()" title="Switch this root between the journey order (walks the conjugation system in lesson order) and weakest-first practice.">${escapeHtml(drillLabel)}</button>
    </div>`;
}

function renderFeaturePickerRow(state) {
  const gatedPool = getGatedPool(state);
  const applicableDimSet = new Set();
  gatedPool.forEach((f) => applicableDimensions(f).forEach((d) => applicableDimSet.add(d)));
  const dims = PARSING_DIM_KEYS.filter((d) => applicableDimSet.has(d));
  const activeDim = state.dimValueFilter ? (Object.keys(state.dimValueFilter)[0] || '') : '';
  let dimOptions = `<option value=""${activeDim ? '' : ' selected'}>Choose a feature…</option>`;
  dims.forEach((d) => {
    dimOptions += `<option value="${d}"${activeDim === d ? ' selected' : ''}>${escapeHtml(DIM_TOGGLE_LABELS[d] || d)}</option>`;
  });
  let valuesHtml = '';
  if (activeDim) {
    const values = availableDimensionValues(gatedPool, activeDim);
    const selected = new Set((state.dimValueFilter && state.dimValueFilter[activeDim]) || []);
    const items = values.map((serialized) => {
      const value = activeDim === 'suffix' ? parseSuffixSerialized(serialized) : serialized;
      const label = formatDimValue(activeDim, value);
      const encoded = encodeURIComponent(serialized);
      const checked = selected.has(serialized);
      return `
        <label class="parsing-feature-value-item">
          <input type="checkbox" onchange="parsingToggleFeatureValue('${activeDim}','${encoded}', this.checked)"${checked ? ' checked' : ''}>
          <span>${escapeHtml(label)}</span>
        </label>`;
    }).join('');
    valuesHtml = `<div class="parsing-feature-value-list">${items || '<div class="parsing-empty-note">No values available at this lesson.</div>'}</div>`;
  }
  return `
    <div class="parsing-scope-picker-row parsing-feature-row">
      <div class="parsing-options-row">
        <label class="parsing-field-label" for="parsingFeatureDimSelect">Feature</label>
        <select id="parsingFeatureDimSelect" class="parsing-select" onchange="parsingSetFeatureDim(this.value)">${dimOptions}</select>
      </div>
      ${valuesHtml}
    </div>`;
}

function renderCustomPickerRow(state) {
  const gatedParadigms = availableParadigms(getParadigms(), state.lesson, { includeAppendix: state.includeAppendix });
  return `<div class="parsing-scope-picker-row parsing-custom-set-groups" id="parsingCustomSetList">${renderCustomSetGroups(state, gatedParadigms)}</div>`;
}

// ─── Rendering: options panel ───────────────────────────────────────────
// Primary bar (lesson · scope · direction) + a collapsed "More options"
// <details> (exclude-known, appendix, dimension toggles, reset/clear) —
// §2.3 mobile IA redesign. The <details> open state is written via ontoggle
// with NO render() (parsingSetOptionsOpen), so answering cards never
// touches this function at all (§5.5 render split — see renderParsingArea
// callers below) and the collapse state survives both a card answer and a
// reload (persisted at runtime.parsing.optionsOpen).
function renderParsingOptionsPanel() {
  const panel = document.getElementById('parsingOptionsPanel');
  const state = host.getState();
  if (!panel || !state) return;

  let lessonOptions = '';
  for (let l = 1; l <= 50; l += 1) {
    lessonOptions += `<option value="${l}"${state.lesson === l ? ' selected' : ''}>${l}</option>`;
  }

  const mode = getScopeMode(state);
  const rootIndex = computeRootIndex(state);

  let pickerHtml = '';
  if (mode === 'focused') pickerHtml = renderFocusedPickerRow(state);
  else if (mode === 'root') pickerHtml = renderRootPickerRow(state, rootIndex);
  else if (mode === 'byFeature') pickerHtml = renderFeaturePickerRow(state);
  else if (mode === 'custom') pickerHtml = renderCustomPickerRow(state);
  // mode === 'shuffle': no picker — the segmented control alone is the
  // whole configuration (full cumulative gated pool).

  const gatedForms = getGatedPool(state);
  const applicableDimSet = new Set();
  gatedForms.forEach((f) => applicableDimensions(f).forEach((d) => applicableDimSet.add(d)));
  const dimToggles = PARSING_DIM_KEYS.filter((d) => applicableDimSet.has(d)).map((d) => toggleHtml({
    id: `parsingDim${capitalize(d)}Toggle`,
    label: DIM_TOGGLE_LABELS[d] || d,
    checked: state.dims[d] !== false,
    onclick: `parsingToggleDim('${d}')`,
    title: `Grade the ${(DIM_TOGGLE_LABELS[d] || d).toLowerCase()} dimension when it applies to a form.`
  })).join('');

  panel.innerHTML = `
    <div class="parsing-primary-bar">
      <div class="parsing-options-row parsing-primary-lesson">
        <label class="parsing-field-label" for="parsingLessonSelect">Current lesson</label>
        <select id="parsingLessonSelect" class="parsing-select" onchange="parsingSetLesson(this.value)">${lessonOptions}</select>
      </div>
      <div class="parsing-options-row parsing-primary-scope">
        <span class="parsing-field-label">Scope</span>
        ${renderScopeControl(state, rootIndex)}
      </div>
      ${pickerHtml}
      <div class="parsing-options-row parsing-primary-direction">
        <span class="parsing-field-label">Direction</span>
        <div class="theme-switcher parsing-direction-pill" id="parsingDirectionToggle" role="group" aria-label="Parse, build, or mix the form">
          <button class="theme-btn${state.direction === 'parse' ? ' active' : ''}" type="button" onclick="parsingSetDirection('parse')">Parse</button>
          <button class="theme-btn${state.direction === 'build' ? ' active' : ''}" type="button" onclick="parsingSetDirection('build')" title="Build the Form">Build</button>
          <button class="theme-btn${state.direction === 'mixed' ? ' active' : ''}" type="button" onclick="parsingSetDirection('mixed')" title="Alternate Parse and Build cards within one session.">Mixed</button>
        </div>
      </div>
    </div>
    <details class="parsing-more-options" id="parsingMoreOptionsDetails"${state.optionsOpen ? ' open' : ''} ontoggle="parsingSetOptionsOpen(this.open)">
      <summary>More options</summary>
      <div class="parsing-toggle-grid">
        ${toggleHtml({ id: 'parsingExcludeKnownToggle', label: 'Exclude known', checked: !!state.excludeKnown, onclick: 'parsingToggleExcludeKnown()', title: 'Hide forms already answered correctly twice in a row under the current dimension toggles.' })}
        ${toggleHtml({ id: 'parsingAppendixToggle', label: 'Appendix forms', checked: !!state.includeAppendix, onclick: 'parsingToggleAppendix()', title: 'Include forms that only appear in the textbook appendixes (off by default).' })}
      </div>
      ${dimToggles ? `<div class="parsing-toggle-grid parsing-dim-toggles">${dimToggles}</div>` : ''}
      <div class="parsing-options-row parsing-danger-row">
        <button class="ctrl-btn" id="parsingResetKnownBtn" type="button" onclick="parsingResetKnownForms()">Reset known forms</button>
        <button class="ctrl-btn" id="parsingClearStatsBtn" type="button" onclick="parsingClearStats()">Clear parsing statistics</button>
      </div>
    </details>
  `;
}

// ─── Rendering: empty / all-known states ───────────────────────────────
function renderEmptyState(state) {
  const paradigms = getParadigms();
  const cumulativePool = getGatedPool(state);
  let guidance;
  if (!cumulativePool.length) {
    const nextLesson = firstLessonWithMaterial(paradigms, state.lesson);
    guidance = nextLesson
      ? `Nothing has been introduced for parsing practice yet at Lesson ${state.lesson} — the first paradigm arrives in Lesson ${nextLesson}. Advance the Lesson selector above once you get there.`
      : 'No parsing material is available yet.';
  } else {
    const nextLesson = firstLessonWithMaterial(paradigms, state.lesson + 1);
    guidance = nextLesson
      ? `Lesson ${state.lesson} doesn't introduce new parsing material of its own — the next new paradigm arrives in Lesson ${nextLesson}. Meanwhile, turn on Shuffle all or pick a Focused paradigm above to review what's already been covered.`
      : `Lesson ${state.lesson} doesn't introduce new parsing material of its own. Turn on Shuffle all or pick a Focused paradigm above to review what's already been covered.`;
  }
  return `<div class="empty-state parsing-empty-state"><div class="big hebrew-text" dir="rtl" lang="he">אבג</div>${escapeHtml(guidance)}</div>`;
}

function renderAllKnownState() {
  return `<div class="empty-state parsing-empty-state"><div class="big hebrew-text" dir="rtl" lang="he">✓</div>Every form in this scope is already marked known under the current dimension toggles. Turn off "Exclude known" to keep drilling them, or widen the scope above.</div>`;
}

// ─── Rendering: Parse step walk ─────────────────────────────────────────
function renderDimensionChoices(dim, gatedPool) {
  const rawValues = availableDimensionValues(gatedPool, dim);
  const hasNullOption = dim === 'suffix' && gatedPool.some((f) =>
    (f.acceptedParses || []).some((p) => p && typeof p === 'object' && 'suffix' in p && p.suffix === null));
  const buttons = [];
  if (hasNullOption) {
    buttons.push(`<button class="ctrl-btn parsing-choice-btn" type="button" onclick="parsingPickDimensionValue('${dim}','__null__')">(no suffix)</button>`);
  }
  rawValues.forEach((serialized) => {
    const value = dim === 'suffix' ? parseSuffixSerialized(serialized) : serialized;
    const label = formatDimValue(dim, value);
    const encoded = encodeURIComponent(serialized);
    buttons.push(`<button class="ctrl-btn parsing-choice-btn" type="button" onclick="parsingPickDimensionValue('${dim}','${encoded}')">${escapeHtml(label)}</button>`);
  });
  return buttons.join('');
}

function renderParseStep(state) {
  const form = currentForm;
  const dim = parseSteps[parseStepIndex];
  const gatedPool = getGatedPool(state);
  const stepButtons = dim ? renderDimensionChoices(dim, gatedPool) : '';
  const progress = parseSteps.length
    ? `Step ${parseStepIndex + 1} of ${parseSteps.length}${dim ? `: ${DIM_TOGGLE_LABELS[dim] || dim}` : ''}`
    : '';
  return `
    <div class="parsing-card">
      <div class="big hebrew-text" dir="rtl" lang="he">${escapeHtml(form.display)}</div>
      <div class="parsing-progress">${escapeHtml(progress)}</div>
      <div class="parsing-step-grid">${stepButtons}</div>
      <button class="ctrl-btn parsing-dontknow-btn" type="button" onclick="parsingSubmitDontKnow()">I don't know</button>
    </div>`;
}

// ─── Rendering: Build the Form ──────────────────────────────────────────
function renderBuildQuestion(state) {
  const target = currentForm;
  const enabledDims = getEnabledDims(state);
  const gradedDims = applicableDimensions(target).filter((d) => enabledDims.includes(d));
  const parse = (target.acceptedParses || [])[0] || {};
  const promptLabel = gradedDims.length ? formatParseLabel(parse, gradedDims) : '(no graded dimensions under current toggles)';
  const choiceButtons = (buildChoiceIds || []).map((id) => {
    const f = getFormById(id);
    if (!f) return '';
    if (buildMultiSelect) {
      const picked = buildPicks.has(id);
      return `<button class="ctrl-btn parsing-choice-btn parsing-build-choice${picked ? ' parsing-build-choice-picked' : ''}" type="button" role="checkbox" aria-checked="${picked ? 'true' : 'false'}" data-form-id="${escapeHtml(id)}" onclick="parsingToggleBuildPick('${escapeHtml(id)}')" dir="rtl" lang="he">${escapeHtml(f.display)}</button>`;
    }
    return `<button class="ctrl-btn parsing-choice-btn parsing-build-choice" type="button" data-form-id="${escapeHtml(id)}" onclick="parsingPickBuildChoice('${escapeHtml(id)}')" dir="rtl" lang="he">${escapeHtml(f.display)}</button>`;
  }).join('');
  const progressLabel = buildMultiSelect ? 'Select every form that matches' : 'Build the form';
  const checkBtn = buildMultiSelect
    ? `<button class="ctrl-btn quick-primary parsing-build-check-btn" type="button" onclick="parsingCheckBuildPicks()">Check</button>`
    : '';
  return `
    <div class="parsing-card">
      <div class="parsing-build-prompt">${escapeHtml(promptLabel)}</div>
      <div class="parsing-progress">${escapeHtml(progressLabel)}</div>
      <div class="parsing-step-grid">${choiceButtons}</div>
      ${checkBtn}
    </div>`;
}

// ─── Rendering: summary (both modes) ────────────────────────────────────
function renderSummary(state) {
  const r = lastResult;
  const form = r.form;
  const enabledDims = getEnabledDims(state);
  const gradedDims = applicableDimensions(form).filter((d) => enabledDims.includes(d));

  let body;
  if (r.mode === 'parse') {
    const pickRows = gradedDims.length
      ? gradedDims.map((d) => `<div class="parsing-summary-pick-row"><span>${escapeHtml(DIM_TOGGLE_LABELS[d] || d)}</span><span>${escapeHtml(formatDimValue(d, d in r.picks ? r.picks[d] : undefined))}</span></div>`).join('')
      : '<div class="parsing-summary-pick-row"><span>(no answer given)</span></div>';
    let table = `<table class="parsing-summary-table"><thead><tr><th>Accepted parse</th>${gradedDims.map((d) => `<th>${escapeHtml(DIM_TOGGLE_LABELS[d] || d)}</th>`).join('')}</tr></thead><tbody>`;
    (form.acceptedParses || []).forEach((parse, idx) => {
      table += `<tr><td>${escapeHtml(formatParseLabel(parse, gradedDims) || `#${idx + 1}`)}</td>`;
      gradedDims.forEach((d) => {
        const has = parse && typeof parse === 'object' && d in parse;
        const ok = has && dimensionValuesEqualLocal(r.picks[d], parse[d]);
        table += `<td class="${ok ? 'parsing-cell-right' : 'parsing-cell-wrong'}">${has ? (ok ? '✓' : '✗') : '—'}</td>`;
      });
      table += '</tr>';
    });
    table += '</tbody></table>';
    const contrastForms = computeContrastForms(state, form, gradedDims);
    const contrastHtml = contrastForms.length ? `
      <div class="parsing-summary-contrast">
        <div class="parsing-summary-pick-row-header">Contrast</div>
        <ul class="parsing-contrast-list">${contrastForms.map((c) => `
          <li class="parsing-contrast-item">
            <span class="parsing-contrast-form" dir="rtl" lang="he">${escapeHtml(c.form.display)}</span>
            <span class="parsing-contrast-diff">${escapeHtml(DIM_TOGGLE_LABELS[c.diffDim] || c.diffDim)}: ${escapeHtml(formatDimValue(c.diffDim, c.diffValue))}</span>
          </li>`).join('')}</ul>
      </div>` : '';
    body = `<div class="parsing-summary-picks">${pickRows}</div>${table}${contrastHtml}`;
  } else {
    const pickedForm = r.multiSelect ? null : getFormById(r.pickedId);
    const legit = (r.choiceIds || []).map((id) => {
      const f = getFormById(id);
      if (!f) return '';
      const ok = (r.acceptedIds || []).includes(id);
      const picked = r.multiSelect ? (r.pickedIds || []).includes(id) : id === r.pickedId;
      let cls = '';
      if (ok && picked) cls = 'parsing-cell-right';
      else if (ok && !picked) cls = 'parsing-also-correct';
      else if (!ok && picked) cls = 'parsing-cell-wrong';
      const pickedTag = picked ? ' <span class="parsing-picked-tag">(picked)</span>' : '';
      return `<li class="${cls}" dir="rtl" lang="he">${ok ? '✓ ' : ''}${escapeHtml(f.display)}${pickedTag}</li>`;
    }).join('');
    let resultLabel;
    let resultClass;
    if (r.multiSelect) {
      resultLabel = r.creditLevel === 'full' ? 'Correct — every match selected' : r.creditLevel === 'partial' ? 'Partial credit' : 'Not quite';
      resultClass = r.creditLevel === 'full' ? 'parsing-result-correct' : r.creditLevel === 'partial' ? 'parsing-result-partial' : 'parsing-result-wrong';
    } else {
      resultLabel = r.correct ? 'Correct' : 'Not quite';
      resultClass = r.correct ? 'parsing-result-correct' : 'parsing-result-wrong';
    }
    const pickedRow = r.multiSelect
      ? `<div class="parsing-summary-pick-row"><span>You selected</span><span>${(r.pickedIds || []).length} form${(r.pickedIds || []).length === 1 ? '' : 's'}</span></div>`
      : `<div class="parsing-summary-pick-row"><span>You picked</span><span dir="rtl" lang="he">${escapeHtml(pickedForm ? pickedForm.display : '')}</span></div>`;
    body = `
      <div class="parsing-build-result ${resultClass}">${escapeHtml(resultLabel)}</div>
      ${pickedRow}
      <div class="parsing-build-legit">
        <div class="parsing-summary-pick-row-header">Legitimate answers among the choices shown</div>
        <ul class="parsing-build-legit-list">${legit}</ul>
      </div>`;
  }

  const noteHtml = form.note ? `<div class="parsing-summary-note">${escapeHtml(form.note)}</div>` : '';
  const ambigHtml = form.ambiguityNote ? `<div class="parsing-summary-note parsing-summary-ambiguity">${escapeHtml(form.ambiguityNote)}</div>` : '';
  const lemmaHtml = form.lemma
    ? `<div class="parsing-summary-lemma">Lemma: <span dir="rtl" lang="he">${escapeHtml(form.lemma)}</span>${form.root ? ` · Root: <span dir="rtl" lang="he">${escapeHtml(form.root)}</span>` : ''}</div>`
    : '';
  const sourceHtml = `<div class="parsing-summary-source">${escapeHtml(formatSourceRef(form))}</div>`;

  return `
    <div class="parsing-card parsing-summary">
      <div class="big hebrew-text" dir="rtl" lang="he">${escapeHtml(form.display)}</div>
      ${body}
      ${noteHtml}${ambigHtml}${lemmaHtml}${sourceHtml}
      <button class="ctrl-btn quick-primary parsing-next-btn" type="button" onclick="parsingNextCard()">Next →</button>
    </div>`;
}

// ─── Rendering: card area top-level ─────────────────────────────────────
// §5.5 render split: this is the ONLY function every answer-path handler
// calls (parsingPickDimensionValue, parsingSubmitDontKnow,
// parsingPickBuildChoice, parsingToggleBuildPick, parsingCheckBuildPicks,
// parsingNextCard) — it touches #parsingArea only, never #parsingOptionsPanel,
// so answering a card can never discard a manually-opened <details> (More
// options, a custom-set category group) the way a full options-panel
// rebuild would. Scope/option handlers call the full render() below
// instead, which also rebuilds the options panel.
function renderParsingArea() {
  const area = document.getElementById('parsingArea');
  const state = host.getState();
  if (!area || !state) return;

  const paradigms = getParadigms();
  if (!paradigms.length) {
    area.innerHTML = '<div class="empty-state parsing-empty-state">Parsing data isn\'t available yet.</div>';
    currentForm = null;
    return;
  }

  const mode = getScopeMode(state);
  // Root journey's default sub-mode ignores exclude-known for pool
  // MEMBERSHIP and walks a deterministic cursor instead of the usual
  // unseen/seen/known buckets (§5 amendment 2). "Drill this root"
  // (rootDrillActive) opts back into the ordinary bucket-ordered flow below,
  // scoped to the same root.
  const journeyActive = mode === 'root' && !!state.rootFilter && !rootDrillActive;

  let journeyMapHtml = '';
  if (journeyActive) {
    const journeyPool = getScopedPool(state, { excludeKnown: false });
    const ordered = orderDrillPool(journeyPool, state.attempts, host.getSessionSeed(), { mode: 'journey' });
    if (!ordered.length) {
      area.innerHTML = renderEmptyState(state);
      currentForm = null;
      return;
    }
    let idx = Number.isInteger(state.journeyIndex) ? state.journeyIndex : 0;
    if (idx >= ordered.length) idx = ordered.length - 1;
    if (idx < 0) idx = 0;
    state.journeyIndex = idx;
    const pick = ordered[idx];
    if (!currentForm || currentForm.id !== pick.id) {
      startCardFor(pick, state);
    }
    journeyMapHtml = renderJourneyMap(computeRootStations(state, state.rootFilter), currentForm);
  } else {
    const scopedPool = getScopedPool(state, { excludeKnown: false });
    if (!scopedPool.length) {
      area.innerHTML = renderEmptyState(state);
      currentForm = null;
      return;
    }

    const finalPool = state.excludeKnown ? getScopedPool(state, { excludeKnown: true }) : scopedPool;
    if (!finalPool.length) {
      area.innerHTML = renderAllKnownState();
      currentForm = null;
      return;
    }

    if (!currentForm || !finalPool.some((f) => f.id === currentForm.id)) {
      pickAndStart(finalPool, state);
    }

    if (mode === 'root' && state.rootFilter) {
      journeyMapHtml = renderJourneyMap(computeRootStations(state, state.rootFilter), currentForm);
    }
  }

  let bodyHtml;
  if (lastResult) {
    bodyHtml = renderSummary(state);
  } else if (currentCardDirection === 'build') {
    bodyHtml = renderBuildQuestion(state);
  } else {
    bodyHtml = renderParseStep(state);
  }

  area.innerHTML = journeyMapHtml + bodyHtml;
}

function render() {
  const state = host.getState();
  if (state) pruneStaleRootFilter(state);
  renderParsingOptionsPanel();
  renderParsingArea();
}

// ─── First-ever-use lesson initialization ───────────────────────────────
function ensureInitializedFromVocab() {
  const state = host.getState();
  if (!state || state.initializedFromVocab) return;
  const keys = host.getSelectedVocabKeys ? host.getSelectedVocabKeys() : [];
  let maxLesson = 0;
  (Array.isArray(keys) ? keys : []).forEach((k) => {
    const n = parseInt(k, 10);
    if (Number.isInteger(n) && n >= 1 && n <= 50 && n > maxLesson) maxLesson = n;
  });
  state.lesson = maxLesson >= 1 ? maxLesson : 1;
  state.initializedFromVocab = true;
  host.saveState();
}

// ─── Public entry point (called by main.js on every mode-visibility sync) ──
export function renderParsingPanel() {
  ensureInitializedFromVocab();
  render();
}

// ─── Click/change handlers (wired onto GLOBAL_CLICK_HANDLERS by main.js) ──
export function parsingSetLesson(value) {
  const state = host.getState();
  if (!state) return;
  const n = parseInt(value, 10);
  state.lesson = (Number.isInteger(n) && n >= 1 && n <= 50) ? n : 1;
  pruneStaleScope(state);
  rootDrillActive = false;
  if (state.rootFilter) resetJourneyCursorToFirstNotKnown(state); else state.journeyIndex = 0;
  currentForm = null;
  host.saveState();
  render();
}

export function parsingSetParadigm(value) {
  const state = host.getState();
  if (!state) return;
  state.focusedParadigmId = value || null;
  currentForm = null;
  host.saveState();
  render();
}

// ─── PR G: scope control + Root journey / By-feature handlers ─────────────
// Invariant maintained by every handler below: rootFilter is truthy IFF the
// scope control's active mode is 'root', dimValueFilter truthy IFF 'byFeature',
// customSetOn true IFF 'custom', shuffleAll true IFF 'shuffle' — each handler
// nulls/falsens the other three together with whichever one it sets, so
// getScopeMode(state) (priority: root > byFeature > custom > shuffle >
// focused) always agrees with what the user last picked.
export function parsingSetScopeMode(mode) {
  const state = host.getState();
  if (!state) return;
  if (mode === 'root') {
    const qualifying = computeRootIndex(state).filter((r) => r.qualifies);
    if (!qualifying.length) return; // control renders disabled in this state
    state.rootFilter = (state.rootFilter && qualifying.some((r) => r.root === state.rootFilter))
      ? state.rootFilter
      : qualifying[0].root;
  } else {
    state.rootFilter = null;
  }
  state.dimValueFilter = mode === 'byFeature' ? (state.dimValueFilter || {}) : null;
  state.customSetOn = mode === 'custom';
  state.shuffleAll = mode === 'shuffle';
  state.focusedParadigmId = mode === 'focused' ? state.focusedParadigmId : null;
  rootDrillActive = false;
  if (state.rootFilter) resetJourneyCursorToFirstNotKnown(state); else state.journeyIndex = 0;
  currentForm = null;
  host.saveState();
  render();
}

export function parsingSetRoot(root) {
  const state = host.getState();
  if (!state) return;
  const qualifying = computeRootIndex(state).filter((r) => r.qualifies);
  const match = qualifying.find((r) => r.root === root);
  state.rootFilter = match ? match.root : (qualifying[0] ? qualifying[0].root : null);
  state.dimValueFilter = null;
  state.customSetOn = false;
  state.shuffleAll = false;
  state.focusedParadigmId = null;
  rootDrillActive = false;
  if (state.rootFilter) resetJourneyCursorToFirstNotKnown(state); else state.journeyIndex = 0;
  currentForm = null;
  host.saveState();
  render();
}

// Toggles Root scope between the default journey walk (deterministic,
// cursor-based) and "Drill this root" (the ordinary weakest-first bucket
// ordering, scoped to the same root — §2.2/§5 amendment 2). Deliberately
// NOT persisted (module-local rootDrillActive), so it always starts back at
// journey order on a fresh load.
export function parsingToggleRootDrillMode() {
  const state = host.getState();
  if (!state || !state.rootFilter) return;
  rootDrillActive = !rootDrillActive;
  currentForm = null;
  render();
}

export function parsingSetFeatureDim(dim) {
  const state = host.getState();
  if (!state) return;
  state.dimValueFilter = dim ? { [dim]: [] } : {};
  currentForm = null;
  host.saveState();
  render();
}

export function parsingToggleFeatureValue(dim, encodedValue, checked) {
  const state = host.getState();
  if (!state || !state.dimValueFilter) return;
  const value = decodeURIComponent(encodedValue);
  const current = Array.isArray(state.dimValueFilter[dim]) ? state.dimValueFilter[dim] : [];
  const next = checked
    ? (current.includes(value) ? current : [...current, value])
    : current.filter((v) => v !== value);
  state.dimValueFilter = { ...state.dimValueFilter, [dim]: next };
  currentForm = null;
  host.saveState();
  render();
}

// Persisted collapse state for the "More options" <details> — written via
// ontoggle with NO render() (the element already reflects its own
// open/closed state; re-rendering here would rebuild the whole options
// panel mid-interaction, which is the exact "collapse discard" bug §5.5
// exists to fix).
export function parsingSetOptionsOpen(isOpen) {
  const state = host.getState();
  if (!state) return;
  state.optionsOpen = !!isOpen;
  host.saveState();
}

// Ephemeral (not persisted) open-state tracking for a custom-set category
// group's <details> — see the customGroupOpenState comment near its
// declaration. No render() for the same reason as parsingSetOptionsOpen.
export function parsingSetCustomGroupOpen(category, isOpen) {
  customGroupOpenState[category] = !!isOpen;
}

export function parsingToggleShuffleAll() {
  const state = host.getState();
  if (!state) return;
  state.shuffleAll = !state.shuffleAll;
  currentForm = null;
  host.saveState();
  render();
}

export function parsingToggleCustomSet() {
  const state = host.getState();
  if (!state) return;
  state.customSetOn = !state.customSetOn;
  currentForm = null;
  host.saveState();
  render();
}

export function parsingToggleCustomSetParadigm(paradigmId, checked) {
  const state = host.getState();
  if (!state) return;
  const next = { ...state.customSet };
  if (checked) next[paradigmId] = true;
  else delete next[paradigmId];
  state.customSet = next;
  currentForm = null;
  host.saveState();
  render();
}

export function parsingToggleCustomSetGroup(category) {
  const state = host.getState();
  if (!state) return;
  const gated = availableParadigms(getParadigms(), state.lesson, { includeAppendix: state.includeAppendix });
  const groupIds = gated.filter((p) => p.category === category).map((p) => p.id);
  if (!groupIds.length) return;
  const allSelected = groupIds.every((id) => state.customSet[id]);
  const next = { ...state.customSet };
  groupIds.forEach((id) => {
    if (allSelected) delete next[id];
    else next[id] = true;
  });
  state.customSet = next;
  currentForm = null;
  host.saveState();
  render();
}

export function parsingToggleExcludeKnown() {
  const state = host.getState();
  if (!state) return;
  state.excludeKnown = !state.excludeKnown;
  currentForm = null;
  host.saveState();
  render();
}

export function parsingToggleAppendix() {
  const state = host.getState();
  if (!state) return;
  state.includeAppendix = !state.includeAppendix;
  pruneStaleScope(state);
  rootDrillActive = false;
  if (state.rootFilter) resetJourneyCursorToFirstNotKnown(state); else state.journeyIndex = 0;
  currentForm = null;
  host.saveState();
  render();
}

export function parsingSetDirection(direction) {
  const state = host.getState();
  if (!state) return;
  state.direction = direction === 'build' ? 'build' : direction === 'mixed' ? 'mixed' : 'parse';
  currentForm = null;
  mixedCounter = 0;
  host.saveState();
  render();
}

export function parsingToggleDim(dim) {
  const state = host.getState();
  if (!state) return;
  const wasOn = state.dims[dim] !== false;
  state.dims = { ...state.dims, [dim]: !wasOn };
  currentForm = null;
  host.saveState();
  render();
}

// §5.5 render split: this and every other answer-path handler below call
// renderParsingArea() directly — NEVER the full render() — so answering a
// card never rebuilds #parsingOptionsPanel (see renderParsingArea's header
// comment).
export function parsingPickDimensionValue(dim, encodedValue) {
  const state = host.getState();
  if (!state || !currentForm) return;
  let value;
  if (encodedValue === '__null__') {
    value = null;
  } else {
    const raw = decodeURIComponent(encodedValue);
    value = dim === 'suffix' ? parseSuffixSerialized(raw) : raw;
  }
  parsePicks[dim] = value;
  parseStepIndex += 1;
  if (parseStepIndex >= parseSteps.length) finishParse(state);
  renderParsingArea();
}

export function parsingSubmitDontKnow() {
  const state = host.getState();
  if (!state || !currentForm) return;
  parsePicks = {};
  finishParse(state);
  renderParsingArea();
}

export function parsingPickBuildChoice(pickedId) {
  const state = host.getState();
  if (!state || !currentForm) return;
  const enabledDims = getEnabledDims(state);
  const gradedDims = applicableDimensions(currentForm).filter((d) => enabledDims.includes(d));
  const correct = (buildAcceptedIds || []).includes(pickedId);
  const perDim = {};
  gradedDims.forEach((d) => { perDim[d] = correct ? 1 : 0; });
  applyAttempt(state, currentForm.id, perDim);
  lastResult = {
    mode: 'build', form: currentForm, pickedId, correct,
    choiceIds: buildChoiceIds, acceptedIds: buildAcceptedIds, perDim
  };
  renderParsingArea();
}

// "All that apply" Build variant — toggles a choice's selection without
// grading (grading happens on parsingCheckBuildPicks, mirroring a real
// "select all, then submit" interaction rather than grading on first tap).
export function parsingToggleBuildPick(id) {
  if (!currentForm || !buildMultiSelect) return;
  const next = new Set(buildPicks);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  buildPicks = next;
  renderParsingArea();
}

// Grades an "all that apply" Build attempt. The gradeable "accepted set" is
// restricted to whichever accepted ids are actually DISPLAYED (an accepted
// homograph the learner never had the option to pick can't be held against
// or for them) — full credit iff the picks equal that set exactly; partial
// when picks are a proper subset with no wrong picks; wrong otherwise.
// recordAttempt only supports a 0|1 perDim contract (no persisted partial-
// credit shape), so per the Build-mode pattern already established by
// parsingPickBuildChoice: full credit records all graded dims as 1,
// anything less records them all as 0.
export function parsingCheckBuildPicks() {
  const state = host.getState();
  if (!state || !currentForm || !buildMultiSelect) return;
  const displayedAccepted = new Set((buildChoiceIds || []).filter((id) => (buildAcceptedIds || []).includes(id)));
  const picks = new Set(buildPicks);
  const hasWrongPick = [...picks].some((id) => !displayedAccepted.has(id));
  let creditLevel;
  if (hasWrongPick || picks.size === 0) {
    // An empty selection is a non-answer, not a "no wrong picks" subset.
    creditLevel = 'wrong';
  } else if (picks.size === displayedAccepted.size) {
    creditLevel = 'full';
  } else {
    creditLevel = 'partial';
  }
  const enabledDims = getEnabledDims(state);
  const gradedDims = applicableDimensions(currentForm).filter((d) => enabledDims.includes(d));
  const perDim = {};
  gradedDims.forEach((d) => { perDim[d] = creditLevel === 'full' ? 1 : 0; });
  applyAttempt(state, currentForm.id, perDim);
  lastResult = {
    mode: 'build', form: currentForm, multiSelect: true,
    pickedIds: [...picks], creditLevel,
    choiceIds: buildChoiceIds, acceptedIds: buildAcceptedIds, perDim
  };
  renderParsingArea();
}

export function parsingNextCard() {
  const state = host.getState();
  const journeyActive = state && getScopeMode(state) === 'root' && !!state.rootFilter && !rootDrillActive;
  if (journeyActive) {
    // Journey mode advances a persisted cursor instead of the usual
    // avoidFormId "don't immediately repeat" mechanism — the cursor IS the
    // ordering, so there is nothing to avoid-repeat. Clamped to the walk's
    // length in renderParsingArea (a lesson/appendix change can shrink or
    // grow the walk between renders).
    state.journeyIndex = (Number.isInteger(state.journeyIndex) ? state.journeyIndex : 0) + 1;
    host.saveState();
  } else {
    avoidFormId = currentForm ? currentForm.id : null;
  }
  currentForm = null;
  lastResult = null;
  renderParsingArea();
}

export function parsingResetKnownForms() {
  const state = host.getState();
  if (!state) return;
  if (!window.confirm('Reset known forms? Forms currently marked "known" lose their history and come back into rotation. Other recorded progress is kept.')) return;
  const pool = getGatedPool(state);
  const enabledDims = getEnabledDims(state);
  const next = { ...state.attempts };
  pool.forEach((f) => {
    const dims = applicableDimensions(f).filter((d) => enabledDims.includes(d));
    if (dims.length && isFormKnown(state.attempts, f.id, dims)) delete next[f.id];
  });
  state.attempts = next;
  currentForm = null;
  host.saveState();
  render();
}

export function parsingClearStats() {
  const state = host.getState();
  if (!state) return;
  if (!window.confirm('Clear all parsing statistics? This permanently erases every recorded parsing attempt.')) return;
  state.attempts = {};
  currentForm = null;
  lastResult = null;
  host.saveState();
  render();
}

export function parsingClearFormAttempt(formId) {
  const state = host.getState();
  if (!state) return;
  const next = { ...state.attempts };
  delete next[formId];
  state.attempts = next;
  host.saveState();
  render();
}

// ─── Analytics section (rendered via analytics.js's renderParsingSection host hook) ──
export function renderParsingAnalytics() {
  const container = document.getElementById('analyticsParsingBody');
  const collapse = document.getElementById('analyticsParsingCollapse');
  const statusEl = document.getElementById('analyticsParsingSummaryStatus');
  const state = host.getState();
  if (!container || !collapse || !state) return;

  const attempts = state.attempts || {};
  const formIds = Object.keys(attempts);
  if (!formIds.length) {
    collapse.style.display = 'none';
    return;
  }
  collapse.style.display = '';

  const paradigms = getParadigms();
  const paradigmLabelById = {};
  paradigms.forEach((p) => { paradigmLabelById[p.id] = p.label; });

  let totalDimAttempts = 0;
  let totalDimCorrect = 0;
  const perDim = {};
  const perParadigm = {};
  const allEntries = [];

  formIds.forEach((formId) => {
    const form = getFormById(formId);
    const rec = attempts[formId] || {};
    (rec.history || []).forEach((entry) => {
      const dims = entry && entry.dims ? entry.dims : {};
      const vals = Object.values(dims);
      Object.entries(dims).forEach(([dim, val]) => {
        totalDimAttempts += 1;
        if (val === 1) totalDimCorrect += 1;
        if (!perDim[dim]) perDim[dim] = { right: 0, total: 0 };
        perDim[dim].total += 1;
        if (val === 1) perDim[dim].right += 1;
        if (form) {
          const pid = form.paradigmId;
          if (!perParadigm[pid]) perParadigm[pid] = { right: 0, total: 0 };
          perParadigm[pid].total += 1;
          if (val === 1) perParadigm[pid].right += 1;
        }
      });
      const allRight = vals.length > 0 && vals.every((v) => v === 1);
      const anyRight = vals.some((v) => v === 1);
      allEntries.push({ at: entry.at || 0, formId, ok: allRight ? 1 : (anyRight ? 0.5 : 0) });
    });
  });

  const overallPct = totalDimAttempts ? Math.round((totalDimCorrect / totalDimAttempts) * 100) : 0;
  if (statusEl) statusEl.textContent = `${formIds.length} form${formIds.length === 1 ? '' : 's'} attempted · ${overallPct}% overall accuracy`;

  const enabledDims = getEnabledDims(state);
  const gatedPool = getGatedPool(state);
  const counts = { known: 0, right: 0, partial: 0, wrong: 0, unseen: 0 };
  gatedPool.forEach((f) => {
    const dims = applicableDimensions(f).filter((d) => enabledDims.includes(d));
    const status = dims.length ? formStatus(attempts, f.id, dims) : 'unseen';
    counts[status] = (counts[status] || 0) + 1;
  });

  allEntries.sort((a, b) => a.at - b.at);
  const last20 = allEntries.slice(-20);
  const groups = [];
  for (let i = 0; i < last20.length; i += 5) groups.push(last20.slice(i, i + 5));
  const trendHtml = groups.length
    ? groups.map((g) => {
        const avg = g.reduce((s, e) => s + e.ok, 0) / g.length;
        return avg >= 0.8 ? '\u{1F7E9}' : avg >= 0.4 ? '\u{1F7E8}' : '\u{1F7E5}';
      }).join(' ')
    : '(no attempts recorded yet)';

  const recentForms = formIds
    .map((formId) => ({
      formId,
      lastAt: (attempts[formId].history || []).reduce((m, e) => Math.max(m, e.at || 0), 0)
    }))
    .sort((a, b) => b.lastAt - a.lastAt)
    .slice(0, 10);

  const perDimHtml = Object.keys(perDim).sort().map((d) => {
    const { right, total } = perDim[d];
    const pct = total ? Math.round((right / total) * 100) : 0;
    return `<div class="parsing-summary-pick-row"><span>${escapeHtml(DIM_TOGGLE_LABELS[d] || d)}</span><span>${pct}% (${right}/${total})</span></div>`;
  }).join('') || '<div class="parsing-empty-note">No dimension attempts recorded yet.</div>';

  const perParadigmHtml = Object.keys(perParadigm)
    .sort((a, b) => (paradigmLabelById[a] || a).localeCompare(paradigmLabelById[b] || b))
    .map((pid) => {
      const { right, total } = perParadigm[pid];
      const pct = total ? Math.round((right / total) * 100) : 0;
      return `<div class="parsing-summary-pick-row"><span>${escapeHtml(paradigmLabelById[pid] || pid)}</span><span>${pct}% (${right}/${total})</span></div>`;
    }).join('') || '<div class="parsing-empty-note">No paradigm attempts recorded yet.</div>';

  const countsHtml = ['known', 'right', 'partial', 'wrong', 'unseen']
    .map((k) => `<div class="parsing-count-chip parsing-count-${k}">${capitalize(k)}: ${counts[k] || 0}</div>`)
    .join('');

  const recentListHtml = recentForms.map(({ formId }) => {
    const form = getFormById(formId);
    const dims = form ? applicableDimensions(form).filter((d) => enabledDims.includes(d)) : [];
    const status = dims.length ? formStatus(attempts, formId, dims) : 'unseen';
    return `<div class="parsing-recent-row">
      <span class="parsing-recent-form" dir="rtl" lang="he">${escapeHtml(form ? form.display : formId)}</span>
      <span class="parsing-recent-status parsing-status-${status}">${escapeHtml(status)}</span>
      <button class="ctrl-btn parsing-recent-clear" type="button" onclick="parsingClearFormAttempt('${escapeHtml(formId)}')">Clear</button>
    </div>`;
  }).join('') || '<div class="parsing-empty-note">No forms attempted yet.</div>';

  container.innerHTML = `
    <div class="parsing-summary-pick-row parsing-analytics-overall"><span>Overall accuracy</span><span>${overallPct}% (${totalDimCorrect}/${totalDimAttempts} graded dimensions)</span></div>
    <div class="parsing-count-row">${countsHtml}</div>
    <h4 class="parsing-analytics-subhead">Per dimension</h4>
    ${perDimHtml}
    <h4 class="parsing-analytics-subhead">Per paradigm</h4>
    ${perParadigmHtml}
    <h4 class="parsing-analytics-subhead">Recent trend (last ${last20.length} attempt${last20.length === 1 ? '' : 's'}, grouped by 5)</h4>
    <div class="parsing-trend-line">${trendHtml}</div>
    <h4 class="parsing-analytics-subhead">Recently attempted forms</h4>
    <div class="parsing-recent-list">${recentListHtml}</div>
  `;
}
