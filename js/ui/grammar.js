// Grammar Quiz mode UI (Phase 2 PR C) — Cook & Holmstedt, Beginning Biblical
// Hebrew. Renders the Grammar Quiz options panel, the question/answer drill
// flow, and the Grammar analytics section; owns click/change handling for
// all of it.
//
// Hard boundary: this module imports NOTHING from other app modules — no
// gates engine (gating here is a simple `introducedLesson <= lesson`
// filter, implemented locally below), no runtime.js, no utils/helpers.js,
// no DOM helpers from elsewhere. Everything else (the live runtime.grammar
// reference, persistence, a one-time session seed) comes in via
// configureGrammar(deps), the same "runtime dependency injection" pattern
// js/ui/parsing.js uses (see that file's header). Grammar never touches
// vocab SRS/marks/progress or parsing state — see
// docs/bbh-conversion-plan.md "Phase 2 architecture decisions" #6.
//
// Reads its question bank from window.BBH_GRAMMAR (classic script global,
// same idiom as window.SETS for vocab and window.BBH_PARSING for parsing —
// see js/data/bbh_grammar.js's header).

// ─── Host (runtime dependency injection) ───────────────────────────────────
let host = {
  // Returns the LIVE runtime.grammar object (mutated in place, same pattern
  // every other UI module uses for its slice of runtime.*).
  getState: () => null,
  saveState: () => {},
  // A single integer captured once at session init — used only as a
  // deterministic shuffle seed, never persisted, never Math.random. Mirrors
  // js/ui/parsing.js's getSessionSeed.
  getSessionSeed: () => 0,
  // Vocab lesson selection (runtime.selectedKeys, or the stashed
  // modeSelections.vocab entry) — read once, for the "initialize from
  // highest selected vocab lesson" first-use rule. Mirrors
  // js/ui/parsing.js's getSelectedVocabKeys.
  getSelectedVocabKeys: () => []
};

export function configureGrammar(deps) {
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

function hashStringToInt(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h >>> 0;
}

// ─── Deterministic seeded PRNG (mulberry32) — mirrors
// js/domain/parsing/drill.js's private copy. Never Math.random — every
// ordering/selection in this module must be reproducible from an integer
// seed the caller controls.
function mulberry32(seedInt) {
  let a = seedInt >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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

// ─── Mixed Hebrew/English text rendering ───────────────────────────────────
// Grammar prompts/choices/explanations are English prose with inline Hebrew
// substrings (letters, words, short phrases) — unlike parsing.js, which
// only ever renders a single, whole Hebrew form as its own block. Each
// contiguous run of Hebrew-range characters (letters U+05D0–05EA, points
// U+05B0–05C7, cantillation U+0591–05AF, maqaf/geresh/gershayim/sof pasuq)
// — including single spaces THAT SEPARATE further Hebrew characters, so a
// multi-word Hebrew phrase stays one bidi unit — is wrapped in the app's
// existing `.hebrew-text` Hebrew-span convention (see styles.css and
// js/ui/render.js's card-face rendering) as an inline `dir="rtl" lang="he"`
// span; everything else is left as plain (escaped) text in the surrounding
// LTR flow.
const HEBREW_RUN_RE = /[֑-״]+(?:[ ][֑-״]+)*/g;
function renderMixedHebrewText(raw) {
  const text = String(raw ?? '');
  let out = '';
  let lastIndex = 0;
  let m;
  HEBREW_RUN_RE.lastIndex = 0;
  while ((m = HEBREW_RUN_RE.exec(text))) {
    out += escapeHtml(text.slice(lastIndex, m.index));
    out += `<span class="hebrew-text grammar-hebrew-inline" dir="rtl" lang="he">${escapeHtml(m[0])}</span>`;
    lastIndex = m.index + m[0].length;
  }
  out += escapeHtml(text.slice(lastIndex));
  return out;
}

// Task #26: shared TOGGLE-then-LABEL-then-(i) row shape — mirrors
// js/ui/parsing.js's toggleHtml() (see that module's header comment for the
// full rationale: a plain wrapper <div>, no row-level onclick; the switch is
// its own <button> carrying the id/onclick/role=switch/aria-checked; the
// (i) is a DOM SIBLING of the switch, not nested inside it, so a tap on/near
// it can never bubble into the switch's click handler — no extra tap-guard
// JS needed). Duplicated locally rather than imported from parsing.js — a
// new cross-module ES import here would hit exactly the mixed-version
// module-pairing hazard CLAUDE.md's cache-bust section warns about (an old
// cached sibling module paired with a new importer can SyntaxError the
// whole app). Keep any future edits to this shape mirrored across
// parsing.js/grammar.js/reader.js's own copies. Reuses the SAME
// #toggleInfoOverlay modal / showToggleInfo()/closeToggleInfoModal()
// (js/app/main.js, on GLOBAL_CLICK_HANDLERS) parsing's rows call.
function toggleHtml({ id, label, checked, onclick, title }) {
  return `<div class="toggle-label toggle-row"${title ? ` title="${escapeHtml(title)}"` : ''}>
    <button class="toggle-switch${checked ? ' on' : ''}" id="${id}" type="button" role="switch" aria-checked="${checked ? 'true' : 'false'}" aria-label="${escapeHtml(label)}" onclick="${onclick}"></button>
    <span class="toggle-text">${escapeHtml(label)}</span>
    <button class="toggle-info" type="button" aria-label="What this setting does" onclick="showToggleInfo(this.closest('.toggle-row'))">i</button>
  </div>`;
}

// ─── Inventory access ───────────────────────────────────────────────────
function getQuestions() {
  return (window.BBH_GRAMMAR && Array.isArray(window.BBH_GRAMMAR.questions)) ? window.BBH_GRAMMAR.questions : [];
}

function getQuestionById(qid) {
  return getQuestions().find((q) => q.id === qid) || null;
}

// ─── Gating: cumulative introducedLesson <= lesson filter, implemented
// locally (no gates.js import — see module header). ──────────────────────
function gatedQuestions(lesson) {
  return getQuestions().filter((q) => Number.isInteger(q.introducedLesson) && q.introducedLesson <= lesson);
}

function firstLessonWithMaterial(fromLesson) {
  let min = null;
  getQuestions().forEach((q) => {
    if (!Number.isInteger(q.introducedLesson) || q.introducedLesson < fromLesson) return;
    if (min === null || q.introducedLesson < min) min = q.introducedLesson;
  });
  return min;
}

// "Previously-answered-incorrect" = at least one recorded wrong answer ever
// (seen > correct), not merely the most recent attempt — matches the design
// note's "previously-answered-incorrect questions still in gate".
function isMissed(state, qid) {
  const rec = state.attempts && state.attempts[qid];
  if (!rec) return false;
  return (rec.seen || 0) > (rec.correct || 0);
}

function getGatedPool(state) {
  return gatedQuestions(state.lesson);
}

function getScopedPool(state) {
  let pool = getGatedPool(state);
  if (state.difficulty === 'core') pool = pool.filter((q) => q.difficulty === 'core');
  if (state.reviewMissed) pool = pool.filter((q) => isMissed(state, q.id));
  return pool;
}

// ─── Pool ordering: unseen first, then weak (lowest recent accuracy), then
// rest. Deterministic seeded tiebreak within each bucket. ─────────────────
function recentAccuracy(rec) {
  const recent = rec && Array.isArray(rec.recent) ? rec.recent : [];
  if (!recent.length) return 1;
  return recent.reduce((sum, v) => sum + v, 0) / recent.length;
}

const WEAK_ACCURACY_THRESHOLD = 0.6;

function orderQuestionPool(pool, attempts, seedInt) {
  const questions = Array.isArray(pool) ? pool : [];
  const att = attempts && typeof attempts === 'object' ? attempts : {};
  const seed = seedInt >>> 0;

  const unseen = [];
  const weak = [];
  const rest = [];

  questions.forEach((q) => {
    const rec = att[q.id];
    if (!rec || !rec.seen) { unseen.push(q); return; }
    const acc = recentAccuracy(rec);
    if (acc < WEAK_ACCURACY_THRESHOLD) weak.push({ q, acc });
    else rest.push(q);
  });

  const unseenOrdered = seededShuffle(unseen, seed + 1);
  // Stable sort: the seeded shuffle order is preserved as the tie-break
  // among questions with equal accuracy (Array#sort is stable in Node/V8).
  const weakOrdered = seededShuffle(weak, seed + 2)
    .sort((a, b) => a.acc - b.acc)
    .map((entry) => entry.q);
  const restOrdered = seededShuffle(rest, seed + 3);

  return [...unseenOrdered, ...weakOrdered, ...restOrdered];
}

function seedForQuestion(qid, attemptIndex) {
  return (hashStringToInt(String(qid)) ^ (host.getSessionSeed() >>> 0) ^ Math.imul(attemptIndex + 1, 0x9e3779b1)) >>> 0;
}

// ─── Module-local (non-persisted) walk state ───────────────────────────────
let currentQuestion = null;   // the question currently being asked (full record)
let avoidQuestionId = null;   // set by Next so the reordered pool doesn't repeat it
let lastQuestionType = null;  // type of the question just answered — used to avoid two in a row
let choiceOrder = [];         // shuffled ORIGINAL indices for the current question's choices
let answered = false;         // whether the current question has been answered
let selectedChoiceIdx = null; // ORIGINAL index of the picked choice
let lastCorrect = null;

// In-session score strip. Deliberately NOT persisted (resets on reload) —
// same rationale as parsing.js's mixedCounter: nothing gradeable depends on
// it, it is purely a within-session at-a-glance readout.
let sessionCorrect = 0;
let sessionTotal = 0;
let sessionStreak = 0;

function recordAttempt(state, qid, correct) {
  const prev = (state.attempts && state.attempts[qid]) || { seen: 0, correct: 0, recent: [] };
  const recent = (Array.isArray(prev.recent) ? prev.recent.slice(-4) : []);
  recent.push(correct ? 1 : 0);
  state.attempts = {
    ...state.attempts,
    [qid]: {
      seen: (prev.seen || 0) + 1,
      correct: (prev.correct || 0) + (correct ? 1 : 0),
      recent,
      lastAt: Date.now()
    }
  };
  host.saveState();
}

function startQuestion(q, state) {
  currentQuestion = q;
  answered = false;
  selectedChoiceIdx = null;
  lastCorrect = null;
  const n = Array.isArray(q.choices) ? q.choices.length : 0;
  const rec = state.attempts && state.attempts[q.id];
  const seed = seedForQuestion(q.id, rec ? (rec.seen || 0) : 0);
  choiceOrder = seededShuffle(Array.from({ length: n }, (_, i) => i), seed);
}

function pickAndStart(pool, state) {
  const ordered = orderQuestionPool(pool, state.attempts, host.getSessionSeed());
  let pick = ordered[0];
  if (avoidQuestionId && pick && pick.id === avoidQuestionId && ordered.length > 1) {
    pick = ordered.find((q) => q.id !== avoidQuestionId) || pick;
  }
  // Never two consecutive questions of the same type when avoidable: if the
  // top-ranked pick shares a type with the just-answered question, swap in
  // the first differently-typed candidate from the same ordered pool (still
  // deterministic — no randomness beyond the seeded ordering above). If
  // every candidate shares the type (a single-type pool), the pick stands.
  if (lastQuestionType && pick && pick.type === lastQuestionType) {
    const alt = ordered.find((q) => q.id !== pick.id && q.type !== lastQuestionType);
    if (alt) pick = alt;
  }
  avoidQuestionId = null;
  startQuestion(pick, state);
}

// ─── Rendering: options panel ───────────────────────────────────────────
function renderGrammarOptionsPanel() {
  const panel = document.getElementById('grammarOptionsPanel');
  const state = host.getState();
  if (!panel || !state) return;

  let lessonOptions = '';
  for (let l = 1; l <= 50; l += 1) {
    lessonOptions += `<option value="${l}"${state.lesson === l ? ' selected' : ''}>${l}</option>`;
  }

  panel.innerHTML = `
    <div class="grammar-options-row">
      <label class="grammar-field-label" for="grammarLessonSelect">Current lesson</label>
      <select id="grammarLessonSelect" class="grammar-select" onchange="grammarSetLesson(this.value)">${lessonOptions}</select>
    </div>
    <div class="grammar-toggle-grid">
      ${toggleHtml({
        id: 'grammarReviewMissedToggle',
        label: 'Review missed',
        checked: !!state.reviewMissed,
        onclick: 'grammarToggleReviewMissed()',
        title: 'Only ask questions you have previously answered incorrectly, and that are still in scope at the current lesson.'
      })}
    </div>
    <div class="grammar-options-row">
      <span class="grammar-field-label">Difficulty</span>
      <div class="theme-switcher" id="grammarDifficultyToggle" role="group" aria-label="Difficulty filter">
        <button class="theme-btn${state.difficulty === 'all' ? ' active' : ''}" type="button" onclick="grammarSetDifficulty('all')">All</button>
        <button class="theme-btn${state.difficulty === 'core' ? ' active' : ''}" type="button" onclick="grammarSetDifficulty('core')">Core only</button>
      </div>
    </div>
  `;
}

// ─── Rendering: empty states ─────────────────────────────────────────────
function renderEmptyState(state) {
  if (state.reviewMissed) {
    return '<div class="empty-state grammar-empty-state">No missed questions in this scope yet. Turn off "Review missed" above to keep practicing normally.</div>';
  }
  const gatedPool = getGatedPool(state);
  if (!gatedPool.length) {
    const nextLesson = firstLessonWithMaterial(state.lesson);
    const guidance = nextLesson
      ? `Nothing has been introduced for the Grammar Quiz yet at Lesson ${state.lesson} — the first questions arrive in Lesson ${nextLesson}. Advance the Lesson selector above once you get there.`
      : 'No Grammar Quiz questions are available yet.';
    return `<div class="empty-state grammar-empty-state"><div class="big hebrew-text" dir="rtl" lang="he">אבג</div>${escapeHtml(guidance)}</div>`;
  }
  return '<div class="empty-state grammar-empty-state">No "Core only" questions in this scope yet. Switch Difficulty to "All" above to keep practicing.</div>';
}

// ─── Rendering: score strip ──────────────────────────────────────────────
function renderScoreStrip() {
  return `<div class="grammar-score-strip"><span>Session: ${sessionCorrect} / ${sessionTotal}</span><span>Streak: ${sessionStreak}</span></div>`;
}

// ─── Rendering: question card ────────────────────────────────────────────
function formatSourceRef(q) {
  const src = q && q.source;
  if (!src) return '';
  if (src.lesson) return `Lesson ${src.lesson}, p. ${src.page}`;
  if (src.appendix) return `Appendix ${src.appendix}, p. ${src.page}`;
  return '';
}

function renderQuestionCard() {
  const q = currentQuestion;
  const choiceCount = Array.isArray(q.choices) ? q.choices.length : 0;
  const gridClass = choiceCount <= 2 ? ' grammar-choice-grid-tf' : '';
  const choiceButtons = choiceOrder.map((originalIdx, displayIdx) => `
    <button class="ctrl-btn grammar-choice-btn" type="button" onclick="grammarSelectChoice(${displayIdx})">${renderMixedHebrewText(q.choices[originalIdx])}</button>`).join('');
  return `
    <div class="grammar-card">
      <div class="grammar-prompt">${renderMixedHebrewText(q.prompt)}</div>
      <div class="grammar-choice-grid${gridClass}">${choiceButtons}</div>
    </div>`;
}

// ─── Rendering: answer summary ───────────────────────────────────────────
function renderAnswerSummary() {
  const q = currentQuestion;
  const resultClass = lastCorrect ? 'grammar-result-correct' : 'grammar-result-wrong';
  const resultLabel = lastCorrect ? 'Correct' : 'Not quite';

  const choiceRows = choiceOrder.map((originalIdx) => {
    const isCorrectChoice = originalIdx === q.correctIndex;
    const isPicked = originalIdx === selectedChoiceIdx;
    let cls = '';
    if (isCorrectChoice && isPicked) cls = 'grammar-cell-right';
    else if (isCorrectChoice && !isPicked) cls = 'grammar-also-correct';
    else if (!isCorrectChoice && isPicked) cls = 'grammar-cell-wrong';
    const pickedTag = isPicked ? ' <span class="grammar-picked-tag">(picked)</span>' : '';
    return `<li class="${cls}">${isCorrectChoice ? '✓ ' : ''}${renderMixedHebrewText(q.choices[originalIdx])}${pickedTag}</li>`;
  }).join('');

  const tagsHtml = (Array.isArray(q.conceptTags) && q.conceptTags.length)
    ? `<div class="grammar-summary-tags">${q.conceptTags.map((t) => `<span class="grammar-tag-chip">${escapeHtml(t)}</span>`).join('')}</div>`
    : '';
  const sourceHtml = `<div class="grammar-summary-source">${escapeHtml(formatSourceRef(q))}</div>`;

  return `
    <div class="grammar-card grammar-summary">
      <div class="grammar-result ${resultClass}">${resultLabel}</div>
      <div class="grammar-prompt">${renderMixedHebrewText(q.prompt)}</div>
      <ul class="grammar-choice-list">${choiceRows}</ul>
      <div class="grammar-explanation">${renderMixedHebrewText(q.explanation)}</div>
      ${tagsHtml}
      ${sourceHtml}
      <button class="ctrl-btn quick-primary grammar-next-btn" type="button" onclick="grammarNextQuestion()">Next →</button>
    </div>`;
}

// ─── Rendering: card area top-level ─────────────────────────────────────
function renderGrammarArea() {
  const area = document.getElementById('grammarArea');
  const state = host.getState();
  if (!area || !state) return;

  const questions = getQuestions();
  if (!questions.length) {
    area.innerHTML = '<div class="empty-state grammar-empty-state">Grammar Quiz data isn\'t available yet.</div>';
    currentQuestion = null;
    return;
  }

  const pool = getScopedPool(state);
  if (!pool.length) {
    area.innerHTML = renderEmptyState(state);
    currentQuestion = null;
    return;
  }

  if (!currentQuestion || !pool.some((q) => q.id === currentQuestion.id)) {
    pickAndStart(pool, state);
  }

  const scoreHtml = renderScoreStrip();
  area.innerHTML = scoreHtml + (answered ? renderAnswerSummary() : renderQuestionCard());
}

function render() {
  renderGrammarOptionsPanel();
  renderGrammarArea();
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
export function renderGrammarPanel() {
  ensureInitializedFromVocab();
  render();
}

// ─── Click/change handlers (wired onto GLOBAL_CLICK_HANDLERS by main.js) ──
export function grammarSetLesson(value) {
  const state = host.getState();
  if (!state) return;
  const n = parseInt(value, 10);
  state.lesson = (Number.isInteger(n) && n >= 1 && n <= 50) ? n : 1;
  currentQuestion = null;
  host.saveState();
  render();
}

export function grammarToggleReviewMissed() {
  const state = host.getState();
  if (!state) return;
  state.reviewMissed = !state.reviewMissed;
  currentQuestion = null;
  host.saveState();
  render();
}

export function grammarSetDifficulty(value) {
  const state = host.getState();
  if (!state) return;
  state.difficulty = value === 'core' ? 'core' : 'all';
  currentQuestion = null;
  host.saveState();
  render();
}

export function grammarSelectChoice(displayIdx) {
  const state = host.getState();
  if (!state || !currentQuestion || answered) return;
  const idx = parseInt(displayIdx, 10);
  const originalIdx = choiceOrder[idx];
  if (!Number.isInteger(originalIdx)) return;
  answered = true;
  selectedChoiceIdx = originalIdx;
  const correct = originalIdx === currentQuestion.correctIndex;
  lastCorrect = correct;
  sessionTotal += 1;
  if (correct) { sessionCorrect += 1; sessionStreak += 1; } else { sessionStreak = 0; }
  recordAttempt(state, currentQuestion.id, correct);
  render();
}

export function grammarNextQuestion() {
  lastQuestionType = currentQuestion ? currentQuestion.type : lastQuestionType;
  avoidQuestionId = currentQuestion ? currentQuestion.id : null;
  currentQuestion = null;
  answered = false;
  render();
}

// ─── Analytics section (rendered via analytics.js's renderGrammarSection host hook) ──
export function renderGrammarAnalytics() {
  const container = document.getElementById('analyticsGrammarBody');
  const collapse = document.getElementById('analyticsGrammarCollapse');
  const statusEl = document.getElementById('analyticsGrammarSummaryStatus');
  const state = host.getState();
  if (!container || !collapse || !state) return;

  const attempts = state.attempts || {};
  const qids = Object.keys(attempts);
  if (!qids.length) {
    collapse.style.display = 'none';
    return;
  }
  collapse.style.display = '';

  let totalSeen = 0;
  let totalCorrect = 0;
  let missedCount = 0;
  const blockStats = {};
  const tagStats = {};

  qids.forEach((qid) => {
    const rec = attempts[qid] || {};
    const seen = rec.seen || 0;
    const correct = rec.correct || 0;
    totalSeen += seen;
    totalCorrect += correct;
    if (seen > correct) missedCount += 1;

    const q = getQuestionById(qid);
    if (!q || !Number.isInteger(q.introducedLesson)) return;
    const blockStart = Math.floor((q.introducedLesson - 1) / 10) * 10 + 1;
    const blockEnd = Math.min(blockStart + 9, 50);
    const blockKey = `${blockStart}-${blockEnd}`;
    if (!blockStats[blockKey]) blockStats[blockKey] = { right: 0, total: 0, start: blockStart };
    blockStats[blockKey].right += correct;
    blockStats[blockKey].total += seen;

    (Array.isArray(q.conceptTags) ? q.conceptTags : []).forEach((tag) => {
      if (!tagStats[tag]) tagStats[tag] = { right: 0, total: 0 };
      tagStats[tag].right += correct;
      tagStats[tag].total += seen;
    });
  });

  const overallPct = totalSeen ? Math.round((totalCorrect / totalSeen) * 100) : 0;
  if (statusEl) statusEl.textContent = `${qids.length} question${qids.length === 1 ? '' : 's'} attempted · ${overallPct}% overall accuracy`;

  const blockHtml = Object.keys(blockStats)
    .sort((a, b) => blockStats[a].start - blockStats[b].start)
    .map((key) => {
      const { right, total } = blockStats[key];
      const pct = total ? Math.round((right / total) * 100) : 0;
      return `<div class="grammar-analytics-row"><span>Lessons ${key}</span><span>${pct}% (${right}/${total})</span></div>`;
    }).join('') || '<div class="grammar-empty-note">No lesson-block data yet.</div>';

  const weakestTags = Object.keys(tagStats)
    .filter((tag) => tagStats[tag].total >= 3)
    .map((tag) => ({ tag, ...tagStats[tag], pct: tagStats[tag].total ? tagStats[tag].right / tagStats[tag].total : 1 }))
    .sort((a, b) => a.pct - b.pct || a.tag.localeCompare(b.tag))
    .slice(0, 5);
  const weakestHtml = weakestTags.length
    ? weakestTags.map((t) => `<div class="grammar-analytics-row"><span>${escapeHtml(t.tag)}</span><span>${Math.round(t.pct * 100)}% (${t.right}/${t.total})</span></div>`).join('')
    : '<div class="grammar-empty-note">Not enough attempts yet (each concept needs ≥ 3 attempts).</div>';

  const missedHtml = missedCount
    ? `<div class="grammar-missed-hint">${missedCount} question${missedCount === 1 ? '' : 's'} currently missed. Turn on "Review missed" in the Grammar Quiz options above to focus on them.</div>`
    : '<div class="grammar-empty-note">No missed questions right now.</div>';

  container.innerHTML = `
    <div class="grammar-analytics-row grammar-analytics-overall"><span>Overall accuracy</span><span>${overallPct}% (${totalCorrect}/${totalSeen} answers)</span></div>
    <h4 class="grammar-analytics-subhead">Per lesson block</h4>
    ${blockHtml}
    <h4 class="grammar-analytics-subhead">Weakest concepts</h4>
    ${weakestHtml}
    <h4 class="grammar-analytics-subhead">Missed questions</h4>
    ${missedHtml}
  `;
}
