// Progress bar + Review panel rendering, plus the "return seen card to deck"
// affordance from the review list. Reads runtime state directly and calls
// back into main.js for the deck helpers that mutate runtime.deck /
// runtime.currentIdx via buildStudyDeck and the unspaced-pile manipulations.

import { runtime } from '../state/runtime.js';
import { compareHebrew } from '../utils/hebrewText.js';
import { getConfidencePct } from '../domain/srs/confidence.js';
import { formatRemainingForTable, getSrsStage } from '../domain/srs/scheduler.js';
import { getCardReviewLeft, getCardReviewRight, getCardMetaLine } from '../domain/deck/filters.js';
import { isAnalyticsModalOpen } from './modals.js';

// Alphabetical sort for vocab review rows — compares by the pointed Hebrew
// headword (card.g) using Hebrew collation (see js/utils/hebrewText.js).
// A missing/empty headword sorts first rather than throwing.
function compareCardsHebrew(a, b) {
  return compareHebrew((a && a.g) || '', (b && b.g) || '');
}

let host = {
  accumulateUsageTime: () => {},
  accumulateActiveStudyTime: () => {},
  updateUsageMeta: () => {},
  getKnownCount: () => 0,
  getDueCount: () => 0,
  getRemainingCards: () => [],
  getHighConfidenceCount: () => 0,
  getWordProgress: () => ({}),
  renderAnalyticsOverlay: () => {},
  moveCardToBackOfActivePile: () => {},
  buildStudyDeck: () => [],
  renderCard: () => {},
  saveState: () => {}
};

export function configureProgress(deps) {
  host = { ...host, ...deps };
}

export function renderProgress() {
  if (!document.hidden) {
    host.accumulateUsageTime();
    host.accumulateActiveStudyTime();
  }
  const total = runtime.originalDeck.length || runtime.deck.length;
  const confirmed = host.getKnownCount();
  const remaining = Math.max(total - confirmed, 0);
  const progressPercentEl = document.getElementById('progressPercent');
  host.updateUsageMeta();

  if (runtime.spacedRepetition) {
    const dueCount = host.getDueCount(runtime.originalDeck);
    const nextCard = dueCount && runtime.currentIdx < dueCount ? runtime.currentIdx + 1 : dueCount;
    const progressTextEl = document.getElementById('progressText');
    if (progressTextEl) progressTextEl.textContent = total
      ? `${nextCard} / ${dueCount} due · Confirmed ${confirmed} · Scheduled ${Math.max(total - dueCount, 0)}`
      : '0 / 0';
    const pct = total ? Math.round(((total - dueCount) / total) * 100) : 0;
    const progressFillEl = document.getElementById('progressFill');
    if (progressFillEl) progressFillEl.style.width = pct + '%';
    if (progressPercentEl) progressPercentEl.textContent = `${pct}%`;
    if (isAnalyticsModalOpen()) host.renderAnalyticsOverlay();
    return;
  }

  const cycleSize = host.getRemainingCards().length || total;
  const nextCard = total && runtime.currentIdx < runtime.deck.length ? Math.min(runtime.currentIdx + 1, cycleSize) : total;
  const progressTextEl2 = document.getElementById('progressText');
  if (progressTextEl2) progressTextEl2.textContent = total
    ? `${nextCard} / ${cycleSize} · Confirmed ${confirmed} · Remaining ${remaining}`
    : '0 / 0';
  const pct = total ? Math.round((confirmed / total) * 100) : 0;
  const progressFillEl2 = document.getElementById('progressFill');
  if (progressFillEl2) progressFillEl2.style.width = pct + '%';
  if (progressPercentEl) progressPercentEl.textContent = `${pct}%`;
  if (isAnalyticsModalOpen()) host.renderAnalyticsOverlay();
}

// Bar columns + total for the "cards due by day" histogram. Columns:
//   now    — the current study session: the active rotation + the middle pile
//            (due cards parked to shuffle in before the session ends), i.e. the
//            first activeDeckCount+middleDeckCount entries of runtime.deck.
//            Matches the panel's "Due now" stat; the middle pile grows as cards
//            come due across rebuilds, so this tracks the session rather than
//            the raw dueAt<=now set (an Uncertain card bumped a couple of hours
//            leaves the session and lands in "today" instead).
//   today  — deferred but due later today (before tonight's midnight).
//   k      — deferred, due k calendar days from today (k = 1 is tomorrow, …),
//            out to a "14d+" overflow so a long-cadence (8-month) tail stays
//            bounded.
// Day buckets are CALENDAR days (local time): "today" runs until midnight, then
// one column per calendar day — not rolling 24h periods from now. Returns null
// in unspaced mode or when the deck is empty. dueNow is the "now"-column count
// (= active+middle).
//
// Task #18 item 5 audit: unlike the course-wide analytics panels (js/ui/
// analytics.js's Total Vocabulary histogram/chapter-mastery grid/stubborn-
// slipping-improved lists, all scoped through getAllChapterKeys()/
// getAllVocabCards() in js/domain/deck/filters.js, which are
// isChapterKey-filtered and so deliberately EXCLUDE the task #15 book-*
// advanced-vocab decks), this histogram is intentionally NOT chapter-key
// filtered — it walks runtime.originalDeck/runtime.deck, i.e. whatever the
// user actually selected and is studying right now. If that selection
// includes a book-* deck, its cards' due times are counted here exactly
// like any lesson card's, matching the Greek-app ancestor's identical,
// equally unfiltered implementation (git show ad1547e:js/ui/progress.js) —
// scheduled reviews are real work regardless of which deck they came from.
function buildDueHistogramBars() {
  if (!runtime.spacedRepetition) return null;
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;
  const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
  const MAX_DAY = 14;                         // day bars 1..13, then a 14d+ overflow
  const COL_NOW = 0, COL_TODAY = 1;
  const COL_OVERFLOW = MAX_DAY + 1;           // index of the "14d+" bucket
  const counts = new Array(COL_OVERFLOW + 1).fill(0);
  const sessionCount = (runtime.activeDeckCount || 0) + (runtime.middleDeckCount || 0);
  const sessionIds = new Set((runtime.deck || []).slice(0, sessionCount).map(c => c.id));
  let total = 0;
  let lastIdx = 0;
  (runtime.originalDeck || []).forEach(card => {
    const p = host.getWordProgress(card.id);
    total += 1;
    let col;
    if (sessionIds.has(card.id)) {
      col = COL_NOW;                          // active + middle = the current session
    } else {
      // Deferred (not in the session). Bucket by CALENDAR day from today's
      // midnight. Never-seen cards are always due, so they live in the active
      // section above and never reach this branch.
      const dueDay = new Date(p.dueAt); dueDay.setHours(0, 0, 0, 0);
      const calDays = Math.max(0, Math.round((dueDay.getTime() - startOfToday.getTime()) / DAY_MS));
      col = calDays === 0 ? COL_TODAY : Math.min(calDays + 1, COL_OVERFLOW);
    }
    counts[col] += 1;
    if (col > lastIdx) lastIdx = col;
  });
  if (!total) return null;
  const maxCount = Math.max(...counts.slice(0, lastIdx + 1), 1);
  let bars = '';
  for (let i = 0; i <= lastIdx; i++) {
    const c = counts[i];
    const h = c === 0 ? 2 : Math.max(4, Math.round((c / maxCount) * 48));
    const days = i - 1;                       // i>=2 → that many study days
    const label = i === COL_NOW ? 'now'
      : i === COL_TODAY ? 'today'
      : i === COL_OVERFLOW ? `${MAX_DAY}d+`
      : `${days}`;
    const title = i === COL_NOW ? `Due now: ${c}`
      : i === COL_TODAY ? `Due later today: ${c}`
      : i === COL_OVERFLOW ? `Due in ${MAX_DAY} or more days: ${c}`
      : `Due in ${days} day${days === 1 ? '' : 's'}: ${c}`;
    bars += `<div class="due-hist-col${i === COL_NOW ? ' due-hist-now' : ''}" title="${title}">`
      + `<span class="due-hist-count">${c || ''}</span>`
      + `<span class="due-hist-bar" style="height:${h}px"></span>`
      + `<span class="due-hist-label">${label}</span></div>`;
  }
  return { total, bars, dueNow: counts[COL_NOW] };
}

// Collapsible "Due by day" histogram. Two variants:
//   - default (review panel): a <details> that self-persists open/closed in
//     runtime.analyticsCollapsed['dueByDayPanel'] via an inline ontoggle.
//   - { collapseKey } (analytics overlay): a data-collapse-key <details> that
//     the overlay's own collapse-sync manages + persists.
// Both default to open.
export function buildDueHistogramHtml(opts = {}) {
  const data = opts.data || buildDueHistogramBars();
  if (!data) return '';
  const { total, bars } = data;
  if (opts.collapseKey) {
    return `<details class="analytics-collapse due-histogram-collapse" data-collapse-key="${opts.collapseKey}">`
      + `<summary class="analytics-collapse-summary"><span class="analytics-collapse-caret" aria-hidden="true">▾</span>`
      + `<div class="analytics-collapse-title-wrap"><h4>Due by day <span class="analytics-collapse-meta">${total}</span></h4></div></summary>`
      + `<div class="analytics-collapse-body"><div class="due-hist-bars">${bars}</div></div></details>`;
  }
  const collapsed = (runtime.analyticsCollapsed || {})['dueByDayPanel'] === true;
  return `<details class="due-histogram"${collapsed ? '' : ' open'} ontoggle="onDueHistogramToggle('dueByDayPanel', this)">`
    + `<summary class="due-hist-summary">Due by day <span class="due-hist-meta">${total}</span></summary>`
    + `<div class="due-hist-bars">${bars}</div></details>`;
}

export function renderReview() {
  const panel = document.getElementById('reviewPanel');
  if (!panel) return;
  panel.classList.add('show');

  // Bucket the deck by confidence. A card is "high" when its confidence
  // reads above 75% (matches getHighConfidenceCount); anything else falls
  // into "low" — including untouched cards, so the row-2 totals sum to
  // runtime.originalDeck.length.
  let highCount = 0;
  let lowCount = 0;
  runtime.originalDeck.forEach(card => {
    const progress = host.getWordProgress(card.id);
    const pct = getConfidencePct(progress);
    if (pct !== null && pct > 75) highCount += 1;
    else lowCount += 1;
  });
  // Three-section deck breakdown:
  //   inDeck     — active section (the in-flight rotation the user is on)
  //   sessionDue — "Due now" (spaced) / "Unconfirmed" (unspaced)
  //   later      — deferred (spaced) / archived (unspaced)
  // "Due now" is the current study session: the active rotation + the middle
  // pile (due cards parked to shuffle in before the session ends). The middle
  // pile grows as cards come due across rebuilds. The histogram's "now" column
  // is built from the same active+middle set, so the stat, the "Due later"
  // remainder, and the chart agree.
  const inDeckCount = runtime.activeDeckCount;
  const middleCount = runtime.spacedRepetition
    ? (runtime.middleDeckCount || 0)
    : (runtime.unspacedMiddleCount || 0);
  const totalCount = runtime.originalDeck.length;
  const histData = runtime.spacedRepetition ? buildDueHistogramBars() : null;
  const sessionDueCount = inDeckCount + middleCount;
  const laterCount = runtime.spacedRepetition
    ? Math.max(totalCount - sessionDueCount, 0)
    : host.getKnownCount();
  const sessionDueLabel = runtime.spacedRepetition ? 'Due now' : 'Unconfirmed';
  const laterLabel = runtime.spacedRepetition ? 'Due later' : 'Archived';

  const deckTagEl = document.getElementById('reviewDeckTag');
  if (deckTagEl) {
    deckTagEl.textContent = runtime.requiredOnly ? 'Starred-only deck' : 'Full deck';
  }

  document.getElementById('reviewStats').innerHTML = `
      <div class="review-stats-row">
        <span class="stat-deck">▦ In deck: ${inDeckCount}</span>
        <span class="stat-deck">● ${sessionDueLabel}: ${sessionDueCount}</span>
        <span class="stat-total">⌛ ${laterLabel}: ${laterCount}</span>
      </div>
      <div class="review-stats-row">
        <span class="stat-known">✓ High confidence: ${highCount}</span>
        <span class="stat-unsure">○ Low confidence: ${lowCount}</span>
      </div>
      ${buildDueHistogramHtml({ data: histData })}`;

  const sortMode = runtime.reviewSortMode === 'confidence' ? 'confidence'
    : runtime.reviewSortMode === 'alphabetical' ? 'alphabetical'
    : 'lastSeen';
  const sortRowEl = document.getElementById('reviewSortRow');
  if (sortRowEl) {
    const btn = (mode, label) => {
      const active = sortMode === mode;
      return `<button type="button" class="ctrl-btn chapter-detail-sort-btn${active ? ' active-toggle' : ''}" onclick="setReviewSortMode('${mode}')" aria-pressed="${active ? 'true' : 'false'}">${label}</button>`;
    };
    sortRowEl.innerHTML = `
      <span class="review-sort-label">Sort</span>
      <div class="review-sort-group" role="group" aria-label="Sort cards">
        ${btn('lastSeen', 'Last seen')}
        ${btn('alphabetical', 'A–Z')}
        ${btn('confidence', 'Confidence')}
      </div>`;
  }

  let listHtml = '';
  const visibleRows = runtime.originalDeck
    .map((card, idx) => ({ card, idx }))
    .filter(({ card }) => {
      const status = runtime.marks[card.id];
      const progress = host.getWordProgress(card.id);
      return status || progress.seenCount;
    });

  if (sortMode === 'confidence') {
    // Raw confidence pct from getConfidencePct (no smoothing) so the lowest
    // recall rises to the top of the drill list. Null (unseen) is treated as
    // -1 so it sorts above 0% — unseen cards are typically the most urgent
    // signal of "haven't touched this yet". Ties break alphabetically.
    visibleRows.sort((a, b) => {
      const pa = getConfidencePct(host.getWordProgress(a.card.id));
      const pb = getConfidencePct(host.getWordProgress(b.card.id));
      const va = pa === null ? -1 : pa;
      const vb = pb === null ? -1 : pb;
      if (va !== vb) return va - vb;
      return compareCardsHebrew(a.card, b.card);
    });
  } else if (sortMode === 'lastSeen') {
    // Most recently reviewed first, so the card just answered tops the list.
    // Rows with no lastReviewedAt (marked but never graded, e.g. imported
    // marks) sink to the bottom. Ties break alphabetically.
    visibleRows.sort((a, b) => {
      const ta = host.getWordProgress(a.card.id).lastReviewedAt || 0;
      const tb = host.getWordProgress(b.card.id).lastReviewedAt || 0;
      if (ta !== tb) return tb - ta;
      return compareCardsHebrew(a.card, b.card);
    });
  } else {
    visibleRows.sort((a, b) => compareCardsHebrew(a.card, b.card));
  }

  visibleRows.forEach(({ card }) => {
      const status = runtime.marks[card.id];
      const progress = host.getWordProgress(card.id);
      const confidencePct = getConfidencePct(progress);
      const confidenceMeta = confidencePct === null ? 'confidence —' : `confidence ${confidencePct}%`;
      const srsMeta = runtime.spacedRepetition
        ? `<span style="display:block;color:var(--muted);font-size:12px">${progress.dueAt && progress.dueAt > Date.now() ? `due in ${formatRemainingForTable(progress.dueAt)}` : 'due now'} · seen ×${progress.seenCount || 0} · ${confidenceMeta}</span>`
        : (progress.seenCount || progress.passCount || progress.failCount)
          ? `<span style="display:block;color:var(--muted);font-size:12px">seen ×${progress.seenCount || 0} · ${confidenceMeta}</span>`
          : '';
      const returnBtn = `<button class="return-btn" title="Return this card to circulation now" onclick="returnSeenCardToDeck('${encodeURIComponent(card.id)}')">✕</button>`;
      listHtml += `<div class="review-item">
        <span class="rg">${getCardReviewLeft(card)}${srsMeta}</span>
        <span class="re">${getCardReviewRight(card)}<span style="display:block;color:var(--muted);font-size:12px">${getCardMetaLine(card)}</span></span>
        <span class="rb ${status || 'unsure'}">${status === 'known' ? '✓' : '○'}</span>
        ${returnBtn}
      </div>`;
    });
  document.getElementById('reviewList').innerHTML = listHtml || '<span style="color:var(--muted);font-size:14px;font-style:italic">Mark cards as you study to track your progress in this direction.</span>';
}

// Sort-mode toggle for the per-deck progress list. Lives in runtime only —
// the user's pick resets to 'lastSeen' on reload, matching how the
// analytics chapter sort behaves.
export function setReviewSortMode(mode) {
  const next = mode === 'confidence' || mode === 'alphabetical' ? mode : 'lastSeen';
  if (runtime.reviewSortMode === next) return;
  runtime.reviewSortMode = next;
  renderReview();
}

// Return a previously-known card to the active deck. Flips its mark back to
// 'unsure', clears its due timer, and rebuilds the deck so the card lands at
// the back (per buildStudyDeck's newly-eligible logic).
export function returnSeenCardToDeck(encodedId) {
  const cardId = decodeURIComponent(encodedId);
  const card = runtime.originalDeck.find(c => c.id === cardId);
  if (!card) return;

  host.moveCardToBackOfActivePile(card);

  // Writes scheduling fields, so the entry must be persisted into the store.
  const progress = host.getWordProgress(cardId, { persist: true });
  progress.dueAt = Date.now();
  progress.intervalDays = 0;
  progress.streak = 0;
  progress.easyStreak = 0;
  progress.srsStage = Math.max(0, getSrsStage(progress) - 1);

  if (runtime.spacedRepetition) {
    runtime.deck = host.buildStudyDeck(runtime.originalDeck);
    const dueIdx = runtime.deck.findIndex(c => c.id === cardId);
    if (dueIdx >= 0 && dueIdx < runtime.activeDeckCount) {
      runtime.currentIdx = dueIdx;
      runtime.isFlipped = false;
    } else if (runtime.activeDeckCount > 0) {
      runtime.currentIdx = Math.min(runtime.currentIdx, runtime.activeDeckCount - 1);
    }
  } else {
    const returnedIdx = runtime.deck.findIndex(c => c.id === cardId);
    runtime.currentIdx = returnedIdx >= 0 ? returnedIdx : Math.min(runtime.currentIdx, Math.max(runtime.deck.length - 1, 0));
    runtime.isFlipped = false;
  }

  host.renderCard();
  renderProgress();
  renderReview();
  host.saveState();
}
