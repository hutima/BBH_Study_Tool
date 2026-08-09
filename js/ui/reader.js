// Reader mode UI (Phase 2 PR D) — Cook & Holmstedt, Beginning Biblical Hebrew.
// Renders the Reader options panel (lesson select + tier filter), the
// passage list (grouped by gate-lesson bucket), the single-passage reading
// view (tappable tokens + inline word-detail popover), the Reader analytics
// section, and the CC BY 4.0 attribution line — owns click/change handling
// for all of it.
//
// Hard boundary: this module imports NOTHING from other app modules — same
// rule as js/ui/grammar.js (see that file's header). Gating here is a
// simple `gateLesson <= lesson` filter, implemented locally below. Reader
// never touches vocab SRS/marks/progress, parsing state, or grammar state —
// its own runtime.reader subtree (read status, per-token review marks) is
// entirely separate. Reader has NO SRS interaction of any kind: "mark for
// review" is a plain flag a learner sets for themselves, never scheduled,
// never graded, never fed into the vocab/parsing/grammar confidence models.
//
// Reads its passage corpus from window.BBH_READER (classic script global,
// same idiom as window.SETS / window.BBH_PARSING / window.BBH_GRAMMAR — see
// js/data/bbh_reader.js's header). Text/lemma/morphology are OSHB (Open
// Scriptures Hebrew Bible) data, CC BY 4.0 — see renderReaderAttribution().
//
// DISPLAY-TEXT INTEGRITY (do not "fix" this elsewhere): every token's `t`
// field is preserved byte-for-byte from the Westminster Leningrad Codex text
// as distributed by OSHB (see js/data/bbh_reader.js's header and
// tools/gen_bbh_reader_data.mjs). OSHB's own distribution notes warn against
// NFC-normalizing or otherwise mutating that text — unlike vocab headwords,
// which the app is free to re-render pointed/unpointed via
// js/utils/hebrewText.js's stripHebrewPoints(), Reader passage text is never
// run through that (or any other) transform: `t` is rendered exactly as
// authored, in every render path below, regardless of the vocab "Vowel
// points: Pointed/Unpointed" display toggle (runtime.showPoints) — that
// toggle is a vocab-card-only display preference and must never reach this
// module. Reader always shows pointed source text.

// ─── Host (runtime dependency injection) ───────────────────────────────────
let host = {
  // Returns the LIVE runtime.reader object (mutated in place, same pattern
  // every other UI module uses for its slice of runtime.*).
  getState: () => null,
  saveState: () => {},
  // Vocab lesson selection, for the "initialize from highest selected vocab
  // lesson" first-use rule. Mirrors js/ui/grammar.js's getSelectedVocabKeys.
  getSelectedVocabKeys: () => []
};

export function configureReader(deps) {
  host = { ...host, ...deps };
}

// ─── Small local utilities (no imports allowed) ────────────────────────────
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Inventory access ───────────────────────────────────────────────────
function getPassages() {
  return (window.BBH_READER && Array.isArray(window.BBH_READER.passages)) ? window.BBH_READER.passages : [];
}

function getPassageById(id) {
  return getPassages().find((p) => p.id === id) || null;
}

// ─── Gating: cumulative gateLesson <= lesson filter, implemented locally
// (no gates.js import — see module header). ────────────────────────────────
function gatedPassages(lesson) {
  return getPassages().filter((p) => Number.isInteger(p.gateLesson) && p.gateLesson <= lesson);
}

function tierScoped(list, tier) {
  return tier === 'strict' ? list.filter((p) => p.tier === 'strict') : list;
}

// First gate lesson (at or after fromLesson) that has material matching the
// tier filter — used for the empty-state guidance message. Mirrors
// js/ui/grammar.js's firstLessonWithMaterial.
function firstLessonWithMaterial(fromLesson, tier) {
  let min = null;
  getPassages().forEach((p) => {
    if (!Number.isInteger(p.gateLesson) || p.gateLesson < fromLesson) return;
    if (tier === 'strict' && p.tier !== 'strict') return;
    if (min === null || p.gateLesson < min) min = p.gateLesson;
  });
  return min;
}

// Group passages into the same 10-lesson buckets used elsewhere (Lessons
// 1-10, 11-20, ... 41-50), sorted by bucket start then by gate lesson.
function groupByBucket(passages) {
  const buckets = {};
  passages.forEach((p) => {
    const start = Math.floor((p.gateLesson - 1) / 10) * 10 + 1;
    const end = Math.min(start + 9, 50);
    const key = `${start}-${end}`;
    if (!buckets[key]) buckets[key] = { start, end, passages: [] };
    buckets[key].passages.push(p);
  });
  return Object.keys(buckets)
    .map((key) => buckets[key])
    .sort((a, b) => a.start - b.start)
    .map((b) => ({
      ...b,
      passages: b.passages.slice().sort((x, y) => (x.gateLesson - y.gateLesson) || String(x.ref).localeCompare(String(y.ref)))
    }));
}

// ─── OSHB Hebrew morphology code decoder ───────────────────────────────────
// Decodes the codes actually present in js/data/bbh_reader.js's token `m`
// field — OpenScriptures Hebrew morphology, e.g. "HVqp3ms" (verb, Qal,
// perfect, 3ms) or "HTd/Ncmsa" (definite article + common noun, masculine
// singular absolute). A word can be multiple fused morphemes, each its own
// "/"-separated segment (conjunction, preposition-with-article, the word
// itself, a pronominal suffix, ...) — each segment is decoded independently
// and the labels joined with " + ". Any segment this table doesn't cover
// renders as its raw code in parentheses, per design — "unknowable segments
// render as the raw code" rather than silently dropping information.
const MORPH_STEM_TABLE = {
  q: 'Qal', N: 'Niphal', p: 'Piel', P: 'Pual', h: 'Hiphil', H: 'Hophal',
  t: 'Hitpael', o: 'Polel', O: 'Polal', r: 'Hitpolel', m: 'Poel', M: 'Poal',
  k: 'Palel', K: 'Pulal', Q: 'Qal passive', l: 'Pilpel', L: 'Polpal',
  f: 'Hithpalpel', D: 'Nithpael', j: 'Pealal', i: 'Pilel', u: 'Hothpaal',
  c: 'Tiphil', v: 'Hishtaphel', w: 'Hithpalel', y: 'Hitpalpel'
};
const MORPH_CONJ_TABLE = {
  p: 'perfect', q: 'sequential perfect', i: 'imperfect', w: 'sequential imperfect',
  h: 'cohortative', j: 'jussive', v: 'imperative', r: 'active participle',
  s: 'passive participle', a: 'infinitive absolute', c: 'infinitive construct'
};
const MORPH_PERSON_TABLE = { '1': '1st person', '2': '2nd person', '3': '3rd person', x: '' };
const MORPH_GENDER_TABLE = { c: 'common', m: 'masculine', f: 'feminine', b: 'both', x: '' };
const MORPH_NUMBER_TABLE = { s: 'singular', p: 'plural', d: 'dual', x: '' };
const MORPH_STATE_TABLE = { a: 'absolute', c: 'construct', d: 'determined', x: '' };
const MORPH_NOUN_TYPE_TABLE = { c: 'common noun', g: 'gentilic noun' };
const MORPH_ADJ_TYPE_TABLE = { a: 'adjective', c: 'cardinal number', o: 'ordinal number', g: 'gentilic adjective' };
const MORPH_PRON_TYPE_TABLE = { d: 'demonstrative pronoun', f: 'indefinite pronoun', i: 'interrogative pronoun', p: 'personal pronoun', r: 'relative pronoun' };
const MORPH_PARTICLE_TABLE = { a: 'exhortation particle', d: 'definite article', e: 'exhortation particle', i: 'interrogative particle', m: 'demonstrative particle', n: 'negative particle', o: 'direct object marker', r: 'relative particle' };

// Distinguishes an explicit "" mapping (drop this slot — e.g. the 'x'
// placeholder OSHB uses for a person/gender/number slot that doesn't apply,
// such as a demonstrative pronoun's non-existent "person") from a genuinely
// unmapped code (echo the raw code back so nothing is silently lost).
function morphLabel(table, code) {
  return (table && Object.prototype.hasOwnProperty.call(table, code)) ? table[code] : code;
}

function decodeVerbSegment(rest) {
  if (rest.length < 2) return null;
  const stem = rest[0];
  const conj = rest[1];
  const tail = rest.slice(2);
  const stemLabel = MORPH_STEM_TABLE[stem] || stem;
  const conjLabel = MORPH_CONJ_TABLE[conj] || conj;
  if (conj === 'a') return `${stemLabel} infinitive absolute`;
  if (conj === 'r' || conj === 's' || conj === 'c') {
    if (tail.length < 3) return `${stemLabel} ${conjLabel}`;
    return `${stemLabel} ${conjLabel} · ${morphLabel(MORPH_GENDER_TABLE, tail[0])} ${morphLabel(MORPH_NUMBER_TABLE, tail[1])} ${morphLabel(MORPH_STATE_TABLE, tail[2])}`;
  }
  if (tail.length < 3) return `${stemLabel} ${conjLabel}`;
  const parts = [morphLabel(MORPH_PERSON_TABLE, tail[0]), morphLabel(MORPH_GENDER_TABLE, tail[1]), morphLabel(MORPH_NUMBER_TABLE, tail[2])].filter(Boolean);
  return `${stemLabel} ${conjLabel} · ${parts.join(' ')}`;
}

function decodeNounSegment(rest) {
  if (!rest.length) return null;
  const type = rest[0];
  if (type === 'p') return 'proper noun';
  const typeLabel = MORPH_NOUN_TYPE_TABLE[type] || 'noun';
  if (rest.length < 4) return typeLabel;
  return `${typeLabel} · ${morphLabel(MORPH_GENDER_TABLE, rest[1])} ${morphLabel(MORPH_NUMBER_TABLE, rest[2])} ${morphLabel(MORPH_STATE_TABLE, rest[3])}`;
}

function decodeAdjectiveSegment(rest) {
  if (!rest.length) return 'adjective';
  const typeLabel = MORPH_ADJ_TYPE_TABLE[rest[0]] || 'adjective';
  if (rest.length < 4) return typeLabel;
  return `${typeLabel} · ${morphLabel(MORPH_GENDER_TABLE, rest[1])} ${morphLabel(MORPH_NUMBER_TABLE, rest[2])} ${morphLabel(MORPH_STATE_TABLE, rest[3])}`;
}

function decodePronounSegment(rest) {
  if (!rest.length) return 'pronoun';
  const typeLabel = MORPH_PRON_TYPE_TABLE[rest[0]] || 'pronoun';
  if (rest.length < 4) return typeLabel;
  const parts = [morphLabel(MORPH_PERSON_TABLE, rest[1]), morphLabel(MORPH_GENDER_TABLE, rest[2]), morphLabel(MORPH_NUMBER_TABLE, rest[3])].filter(Boolean);
  return parts.length ? `${typeLabel} · ${parts.join(' ')}` : typeLabel;
}

function decodeSuffixSegment(rest) {
  if (!rest.length) return 'suffix';
  const kindLabel = rest[0] === 'p' ? 'pronominal suffix' : 'suffix';
  if (rest.length < 4) return kindLabel;
  const parts = [morphLabel(MORPH_PERSON_TABLE, rest[1]), morphLabel(MORPH_GENDER_TABLE, rest[2]), morphLabel(MORPH_NUMBER_TABLE, rest[3])].filter(Boolean);
  return parts.length ? `${kindLabel} · ${parts.join(' ')}` : kindLabel;
}

function decodePrepositionSegment(rest) {
  if (!rest.length) return 'preposition';
  if (rest === 'd') return 'preposition (with article)';
  return null;
}

function decodeParticleSegment(rest) {
  if (!rest.length) return 'particle';
  const label = MORPH_PARTICLE_TABLE[rest[0]];
  if (!label) return null;
  return rest.length > 1 ? `${label} (${rest})` : label;
}

function decodeMorphSegment(seg) {
  if (!seg) return null;
  const letter = seg[0];
  const rest = seg.slice(1);
  switch (letter) {
    case 'A': return decodeAdjectiveSegment(rest);
    case 'C': return 'conjunction';
    case 'D': return 'adverb';
    case 'N': return decodeNounSegment(rest);
    case 'P': return decodePronounSegment(rest);
    case 'R': return decodePrepositionSegment(rest);
    case 'S': return decodeSuffixSegment(rest);
    case 'T': return decodeParticleSegment(rest);
    case 'V': return decodeVerbSegment(rest);
    default: return null;
  }
}

function decodeMorph(code) {
  const raw = String(code ?? '');
  if (!raw) return '';
  const stripped = raw.startsWith('H') ? raw.slice(1) : raw; // strip language prefix
  const segments = stripped.split('/').filter(Boolean);
  if (!segments.length) return raw;
  return segments.map((seg) => decodeMorphSegment(seg) || `(${seg})`).join(' + ');
}

// ─── Module-local (non-persisted) view state ───────────────────────────────
// Which passage the reading view is currently open on, and which of its
// tokens has its popover expanded (one at a time). Neither is persisted —
// reopening the app always lands back on the passage list, same as
// js/ui/grammar.js's currentQuestion is session-local.
let openPassageId = null;
let activeTokenIdx = null;

// ─── Rendering: options panel ───────────────────────────────────────────
function renderReaderOptionsPanel() {
  const panel = document.getElementById('readerOptionsPanel');
  const state = host.getState();
  if (!panel || !state) return;

  let lessonOptions = '';
  for (let l = 1; l <= 50; l += 1) {
    lessonOptions += `<option value="${l}"${state.lesson === l ? ' selected' : ''}>${l}</option>`;
  }

  panel.innerHTML = `
    <div class="reader-options-row">
      <label class="reader-field-label" for="readerLessonSelect">Current lesson</label>
      <select id="readerLessonSelect" class="reader-select" onchange="readerSetLesson(this.value)">${lessonOptions}</select>
    </div>
    <div class="reader-options-row">
      <span class="reader-field-label">Passages</span>
      <div class="theme-switcher" id="readerTierToggle" role="group" aria-label="Passage tier filter">
        <button class="theme-btn${state.tier === 'strict' ? ' active' : ''}" type="button" onclick="readerSetTier('strict')">Strict only</button>
        <button class="theme-btn${state.tier !== 'strict' ? ' active' : ''}" type="button" onclick="readerSetTier('both')" title="Strict passages use only vocabulary already gated in by the current lesson; Guided passages may include a handful of not-yet-introduced words, marked with a dotted underline.">Strict + Guided</button>
      </div>
    </div>
  `;
}

// ─── Rendering: passage list ─────────────────────────────────────────────
function renderRecentlyRead(state, passages) {
  const order = Array.isArray(state.readOrder) ? state.readOrder : [];
  if (!order.length) return '';
  const chips = order
    .map((id) => passages.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 8)
    .map((p) => `<button class="reader-recent-chip" type="button" onclick="readerOpenPassage('${escapeHtml(p.id)}')">${escapeHtml(p.ref)}</button>`)
    .join('');
  if (!chips) return '';
  return `<div class="reader-recent"><span class="reader-field-label">Recently read</span><div class="reader-recent-list">${chips}</div></div>`;
}

function tierBadgeHtml(tier) {
  return tier === 'guided'
    ? '<span class="reader-tier-badge reader-tier-badge-guided">guided</span>'
    : '<span class="reader-tier-badge reader-tier-badge-strict">strict</span>';
}

function renderPassageRow(p, state) {
  const isRead = !!(state.readPassages && state.readPassages[p.id]);
  const n = p.tokens.length;
  return `
    <button class="reader-passage-row" type="button" onclick="readerOpenPassage('${escapeHtml(p.id)}')">
      <span class="reader-passage-ref">${escapeHtml(p.ref)}</span>
      <span class="reader-passage-meta">${tierBadgeHtml(p.tier)}<span class="reader-passage-tokens">${n} word${n === 1 ? '' : 's'}</span>${isRead ? '<span class="reader-read-check" aria-label="Read">✓</span>' : ''}</span>
    </button>`;
}

function renderPassageList(state, passages) {
  const gated = gatedPassages(state.lesson);
  const scoped = tierScoped(gated, state.tier);
  if (!scoped.length) {
    const nextLesson = firstLessonWithMaterial(state.lesson, state.tier);
    const guidance = nextLesson
      ? `No Reader passages are available yet at Lesson ${state.lesson} — the first passage arrives in Lesson ${nextLesson}. Advance the Lesson selector above once you get there.`
      : 'No Reader passages are available yet.';
    return `<div class="empty-state reader-empty-state"><div class="big hebrew-text" dir="rtl" lang="he">אבג</div>${escapeHtml(guidance)}</div>`;
  }
  const recentHtml = renderRecentlyRead(state, passages);
  const groupsHtml = groupByBucket(scoped).map((g) => `
    <div class="reader-group">
      <div class="reader-group-heading">Lessons ${g.start}–${g.end}</div>
      <div class="reader-passage-list">${g.passages.map((p) => renderPassageRow(p, state)).join('')}</div>
    </div>`).join('');
  return `${recentHtml}${groupsHtml}`;
}

// ─── Rendering: single-passage reading view ──────────────────────────────
// Token spans: display text (`t`) is rendered VERBATIM (escapeHtml only —
// see the DISPLAY-TEXT INTEGRITY note at the top of this file). Tokens are
// separated by a literal space between <span> siblings (not CSS spacing) so
// selection/copy behaves naturally; maqqef-joined forms already carry their
// own maqqef character inside a single token's `t`, so no extra joining
// logic is needed here.
function tokenSpan(passage, t, idx, state) {
  const key = passage.id + ':' + idx;
  const unknown = t.v == null && !t.pn && passage.tier === 'guided';
  const marked = !!(state.marks && state.marks[key]);
  const active = activeTokenIdx === idx;
  const cls = ['reader-token'];
  if (unknown) cls.push('reader-token-unknown');
  if (t.pn) cls.push('reader-token-proper');
  if (marked) cls.push('reader-token-marked');
  if (active) cls.push('reader-token-active');
  return `<span class="${cls.join(' ')}" role="button" tabindex="0" onclick="readerToggleToken(${idx})">${escapeHtml(t.t)}</span>`;
}

function popoverRow(label, valueHtml) {
  return `<div class="reader-popover-row"><span class="reader-popover-label">${escapeHtml(label)}</span><span class="reader-popover-value">${valueHtml}</span></div>`;
}

function renderTokenPopover(passage, idx, state) {
  const t = passage.tokens[idx];
  if (!t) return '';
  const key = passage.id + ':' + idx;
  const marked = !!(state.marks && state.marks[key]);
  const rows = [];
  rows.push(popoverRow('Display', `<span class="hebrew-text reader-popover-hebrew" dir="rtl" lang="he">${escapeHtml(t.t)}</span>`));
  const lemmaValue = (t.s && t.s !== t.l)
    ? `${escapeHtml(t.l)} <span class="reader-popover-strongs">(Strong's ${escapeHtml(t.s)})</span>`
    : escapeHtml(t.l);
  rows.push(popoverRow('Lemma', lemmaValue));
  rows.push(popoverRow('Morphology', escapeHtml(decodeMorph(t.m))));
  if (Number.isInteger(t.g)) rows.push(popoverRow('BBH gate', `Lesson ${t.g}`));
  if (t.v != null) rows.push(popoverRow('Vocab lesson', `Lesson ${t.v}`));
  if (t.pn) rows.push(popoverRow('Proper name', 'Yes'));
  return `
    <div class="reader-popover" role="group" aria-label="Word details">
      ${rows.join('')}
      <button class="ctrl-btn reader-mark-btn${marked ? ' active' : ''}" type="button" onclick="readerToggleMarkForReview(${idx})">${marked ? '★ Marked for review' : '☆ Mark for review'}</button>
    </div>`;
}

function renderPassageView(passage, state) {
  const isRead = !!(state.readPassages && state.readPassages[passage.id]);
  const n = passage.tokens.length;
  const tokensHtml = passage.tokens.map((t, idx) => tokenSpan(passage, t, idx, state)).join(' ');
  const popoverHtml = (activeTokenIdx != null && passage.tokens[activeTokenIdx]) ? renderTokenPopover(passage, activeTokenIdx, state) : '';
  return `
    <div class="reader-passage-view">
      <div class="reader-passage-header">
        <button class="ctrl-btn reader-back-btn" type="button" onclick="readerBackToList()">&larr; All passages</button>
        <button class="ctrl-btn reader-read-toggle-btn${isRead ? ' active' : ''}" type="button" onclick="readerToggleReadStatus('${escapeHtml(passage.id)}')">${isRead ? '✓ Read' : 'Mark as read'}</button>
      </div>
      <div class="reader-passage-title">
        <span class="reader-passage-ref">${escapeHtml(passage.ref)}</span>
        ${tierBadgeHtml(passage.tier)}
        <span class="reader-passage-tokens">${n} word${n === 1 ? '' : 's'} · Gate: Lesson ${passage.gateLesson}</span>
      </div>
      <div class="reader-hebrew-block hebrew-text" dir="rtl" lang="he">${tokensHtml}</div>
      ${popoverHtml}
    </div>`;
}

// ─── Rendering: area top-level ────────────────────────────────────────────
function renderReaderArea() {
  const area = document.getElementById('readerArea');
  const state = host.getState();
  if (!area || !state) return;

  const passages = getPassages();
  if (!passages.length) {
    area.innerHTML = '<div class="empty-state reader-empty-state">Reader passages aren’t available yet.</div>';
    openPassageId = null;
    return;
  }

  const openPassage = openPassageId ? getPassageById(openPassageId) : null;
  if (openPassage) {
    area.innerHTML = renderPassageView(openPassage, state);
  } else {
    openPassageId = null;
    area.innerHTML = renderPassageList(state, passages);
  }
}

// ─── Rendering: attribution line (CC BY 4.0 compliance — required, always
// visible at the bottom of the Reader section regardless of list/detail
// view; see also the matching line in index.html's user-guide overlay). ────
function renderReaderAttribution() {
  const el = document.getElementById('readerAttribution');
  if (!el) return;
  const data = window.BBH_READER;
  if (!data || !data.attribution) { el.textContent = ''; return; }
  const tag = (data.corpusPin && data.corpusPin.tag) ? ` (${data.corpusPin.tag})` : '';
  el.textContent = `${data.attribution}${tag}`;
}

function render() {
  renderReaderOptionsPanel();
  renderReaderArea();
  renderReaderAttribution();
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

// ─── Public entry point (called by main.js on every mode-visibility sync,
// and by js/state/persistence.js's host.renderReaderModule() hook after a
// restore/import lands while Reader is the active mode) ───────────────────
export function renderReaderPanel() {
  ensureInitializedFromVocab();
  render();
}

// ─── Click/change handlers (wired onto GLOBAL_CLICK_HANDLERS by main.js) ──
export function readerSetLesson(value) {
  const state = host.getState();
  if (!state) return;
  const n = parseInt(value, 10);
  state.lesson = (Number.isInteger(n) && n >= 1 && n <= 50) ? n : 1;
  openPassageId = null;
  activeTokenIdx = null;
  host.saveState();
  render();
}

export function readerSetTier(value) {
  const state = host.getState();
  if (!state) return;
  state.tier = value === 'strict' ? 'strict' : 'both';
  host.saveState();
  render();
}

export function readerOpenPassage(id) {
  const state = host.getState();
  if (!state) return;
  if (!getPassageById(id)) return;
  openPassageId = id;
  activeTokenIdx = null;
  state.lastPassageId = id;
  host.saveState();
  render();
}

export function readerBackToList() {
  openPassageId = null;
  activeTokenIdx = null;
  render();
}

export function readerToggleToken(idx) {
  const n = parseInt(idx, 10);
  if (!Number.isInteger(n)) return;
  activeTokenIdx = (activeTokenIdx === n) ? null : n;
  render();
}

export function readerToggleMarkForReview(idx) {
  const state = host.getState();
  if (!state || !openPassageId) return;
  const n = parseInt(idx, 10);
  if (!Number.isInteger(n)) return;
  const key = openPassageId + ':' + n;
  if (!state.marks || typeof state.marks !== 'object') state.marks = {};
  if (state.marks[key]) delete state.marks[key];
  else state.marks[key] = true;
  host.saveState();
  render();
}

export function readerToggleReadStatus(id) {
  const state = host.getState();
  if (!state) return;
  if (!state.readPassages || typeof state.readPassages !== 'object') state.readPassages = {};
  if (!Array.isArray(state.readOrder)) state.readOrder = [];
  if (state.readPassages[id]) {
    delete state.readPassages[id];
    state.readOrder = state.readOrder.filter((x) => x !== id);
  } else {
    state.readPassages[id] = true;
    state.readOrder = [id, ...state.readOrder.filter((x) => x !== id)].slice(0, 20);
  }
  host.saveState();
  render();
}

// ─── Analytics section (rendered via analytics.js's renderReaderSection host
// hook) — minimal by design: passages-read count/total at the current gate,
// plus the review-marks count. No SRS-style accuracy/streak metrics — there
// is nothing gradeable to summarize in Reader mode. ─────────────────────────
export function renderReaderAnalytics() {
  const container = document.getElementById('analyticsReaderBody');
  const collapse = document.getElementById('analyticsReaderCollapse');
  const statusEl = document.getElementById('analyticsReaderSummaryStatus');
  const state = host.getState();
  if (!container || !collapse || !state) return;

  const readCount = Object.keys(state.readPassages || {}).length;
  const markCount = Object.keys(state.marks || {}).length;
  if (!readCount && !markCount) {
    collapse.style.display = 'none';
    return;
  }
  collapse.style.display = '';

  const passages = getPassages();
  const scoped = tierScoped(gatedPassages(state.lesson), state.tier);
  const readInScope = scoped.filter((p) => state.readPassages && state.readPassages[p.id]).length;

  if (statusEl) statusEl.textContent = `${readInScope} / ${scoped.length} passages read at Lesson ${state.lesson} · ${markCount} marked for review`;

  container.innerHTML = `
    <div class="reader-analytics-row"><span>Passages read (current lesson/tier scope)</span><span>${readInScope} / ${scoped.length}</span></div>
    <div class="reader-analytics-row"><span>Passages read (overall)</span><span>${readCount} / ${passages.length}</span></div>
    <div class="reader-analytics-row"><span>Marked for review</span><span>${markCount}</span></div>
  `;
}
