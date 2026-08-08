// Card rendering for vocab mode, plus flipCard().
//
// Reads runtime state for deck position / direction / answer state. Calls
// back into main.js for the deck/lifecycle hooks (saveState,
// syncLayoutVisibility, etc.) and into progress.js for the progress/review
// re-renders that follow a flip or mark.

import { runtime } from '../state/runtime.js';
import { renderProgress, renderReview } from './progress.js';
import { stripHebrewPoints } from '../utils/hebrewText.js';

let host = {
  saveState: () => {},
  syncLayoutVisibility: () => {},
  noteStudyInteraction: () => {},
  getNearDueCount: () => 0,
  maybeReturnKnownCardToActivePile: () => false
};

export function configureRender(deps) {
  host = { ...host, ...deps };
}

// The "nothing selected" placeholder — the same markup index.html ships in
// #cardArea. Shown on a fresh start, after deselecting everything, and when
// switching into a mode that has no chapters selected. Only paints the card
// area; callers that also need the deck cleared do that themselves.
export function renderChooseSessionEmptyState() {
  const area = document.getElementById('cardArea');
  if (area) {
    area.innerHTML = '<div class="empty-state"><div class="big hebrew-text" dir="rtl" lang="he">אבג</div>Tap to choose a session and start studying.</div>';
  }
}

export function renderCard() {
  const area = document.getElementById('cardArea');
  host.saveState();
  host.syncLayoutVisibility();

  // No lessons selected → show the canonical "choose a session" placeholder.
  // Sits ahead of every deck-dependent branch so a stale deck carried over
  // from a previous selection can't render here.
  if (!runtime.selectedKeys.length) {
    renderChooseSessionEmptyState();
    return;
  }

  if (!runtime.deck.length) {
    // The common case here is a vocab-free lesson (no vocab of its own —
    // e.g. Lessons 1, 2, 4, 37, 41, 43, 44, 46, 47, 48, 50): a friendly
    // empty state rather than a bare "no cards" message.
    const onlyChapterKeys = runtime.selectedKeys.length > 0 && runtime.selectedKeys.every(k => /^\d+$/.test(String(k)));
    const emptyMessage = runtime.hardVocabReviewMode
      ? 'No vocab in this selection currently qualifies as "hard" (missed 10+ times, confidence under 40%).'
      : onlyChapterKeys
        ? (runtime.selectedKeys.length === 1
          ? 'No vocabulary is introduced in this lesson — see the Reference page for its concepts.'
          : 'No vocabulary is introduced in the selected lessons — see the Reference page for their concepts.')
        : 'No cards in this deck.';
    area.innerHTML = `<div class="empty-state"><div class="big">—</div>${emptyMessage}</div>`;
    return;
  }

  if (!runtime.spacedRepetition && runtime.currentIdx >= runtime.deck.length && runtime.unspacedPendingRecycle) {
    // Clear a stale recycle flag before falling through to the "round
    // complete" state below.
    runtime.unspacedPendingRecycle = false;
  }

  if ((!runtime.spacedRepetition && runtime.currentIdx >= runtime.deck.length) || (runtime.spacedRepetition && runtime.currentIdx >= runtime.activeDeckCount)) {
    // Round complete = active is empty AND middle still has cards waiting to
    // reshuffle. If middle is empty too, everything is archived and the
    // "Session Confirmed" state takes over instead.
    const unspacedRoundComplete = !runtime.spacedRepetition && runtime.unspacedMiddleCount > 0;

    const nearDueCount = runtime.spacedRepetition ? host.getNearDueCount() : 0;
    const spacedAdvanceTitle = nearDueCount > 0
      ? `No cards currently due ✦ <span style="color:var(--muted);font-weight:normal;font-size:0.82em;letter-spacing:1px">(${nearDueCount} near-due)</span>`
      : 'No cards currently due ✦';

    const doneTitle = runtime.spacedRepetition
      ? spacedAdvanceTitle
      : unspacedRoundComplete
        ? 'End of round ✦'
        : 'All cards confirmed ✨';

    const spacedAdvanceSub = nearDueCount > 0
      ? `Everything in this selection is scheduled ahead. Press <strong>Next →</strong> to advance the review clock by 1 hour and pull <strong>${nearDueCount}</strong> near-due card${nearDueCount === 1 ? '' : 's'} back in.`
      : 'Everything in this selection is scheduled ahead. Press <strong>Next →</strong> to advance the review clock by 1 hour and pull the next near-due cards back in.';

    const doneSub = runtime.spacedRepetition
      ? spacedAdvanceSub
      : unspacedRoundComplete
        ? 'Press <strong>Next →</strong> to reshuffle unconfirmed cards into another pass, or <strong>↻ Reset</strong> to start the whole deck over.'
        : 'Press <strong>↻ Reset</strong> to reshuffle the selected cards.<br><span style="color:var(--muted);font-size:13px">Archived cards stay archived until you reset or pick a new session.</span>';

    area.innerHTML = `
      <div class="done-card show">
        <div class="done-title">${doneTitle}</div>
        <div class="done-sub">${doneSub}</div>
      </div>`;
    document.getElementById('markRow').style.display = 'none';
    return;
  }

  document.getElementById('markRow').style.display = 'flex';
  const card = runtime.deck[runtime.currentIdx];

  // ── BBH vocab card (Hebrew ⇄ English) ──────────────────────────────────
  // Card shape: { g: pointed Hebrew, e: gloss, translit, notes, page }.
  // Direction toggle (runtime.directionToGreek — name kept for the SRS/mark
  // store key scheme, see getDirectionKey in main.js) swaps which face is
  // the prompt; both faces always show the Hebrew headword so the answer
  // face doubles as the reveal.
  const sourceLabelDisplay = card.sourceLabel || '';
  // Vowel-points display toggle (runtime.showPoints, default 'pointed') only
  // affects this rendered text — card.g itself, ids, and the underlying data
  // are never touched, so switching the toggle mid-session doesn't disturb
  // SRS/mark bookkeeping keyed on the original pointed headword.
  const rawHebrew = card.g || '—';
  const hebrewSource = runtime.showPoints === 'unpointed' ? stripHebrewPoints(rawHebrew) : rawHebrew;
  const hebrewDisplay = escapeHtml(hebrewSource);
  const englishDisplay = escapeHtml(card.e || '—');
  const translitHtml = card.translit
    ? `<div class="card-translit">${escapeHtml(card.translit)}</div>`
    : '';
  // Notes (grammar/forms) + page reference collapse into one small detail
  // line under the answer — Task 3 owns styling the class hooks below.
  const detailBits = [];
  if (card.notes) detailBits.push(escapeHtml(card.notes));
  if (card.page) detailBits.push(`p. ${escapeHtml(String(card.page))}`);
  const detailLineHtml = detailBits.length
    ? `<div class="card-detail-line">${detailBits.join(' · ')}</div>`
    : '';

  let frontHTML, backHTML;
  if (!runtime.directionToGreek) {
    frontHTML = `
        <div class="card-face card-front">
          <span class="card-label">Hebrew</span>
          <div class="card-greek hebrew-text" dir="rtl" lang="he">${hebrewDisplay}</div>
          <div class="card-hint">${sourceLabelDisplay}</div>
          <div class="flip-hint">click to reveal →</div>
        </div>`;
    backHTML = `
        <div class="card-face card-back">
          <span class="card-label">English</span>
          <div class="card-english">${englishDisplay}</div>
          <div class="card-greek-small hebrew-text" dir="rtl" lang="he">${hebrewDisplay}</div>
          ${translitHtml}
          ${detailLineHtml}
        </div>`;
  } else {
    frontHTML = `
        <div class="card-face card-front">
          <span class="card-label">English</span>
          <div class="card-english">${englishDisplay}</div>
          <div class="card-hint">${sourceLabelDisplay}</div>
          <div class="flip-hint">click to reveal →</div>
        </div>`;
    backHTML = `
        <div class="card-face card-back">
          <span class="card-label">Hebrew</span>
          <div class="card-greek hebrew-text" dir="rtl" lang="he">${hebrewDisplay}</div>
          ${translitHtml}
          ${detailLineHtml}
        </div>`;
  }

  area.innerHTML = `
    <div class="card-wrapper" id="cardWrapper" onclick="flipCard()">
      <div class="card-inner" id="cardInner">
        ${frontHTML}
        ${backHTML}
      </div>
    </div>`;

  runtime.isFlipped = false;
  renderProgress();
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function flipCard() {
  const wrapper = document.getElementById('cardWrapper');
  if (!wrapper) return;
  host.noteStudyInteraction();
  runtime.isFlipped = !runtime.isFlipped;
  wrapper.classList.toggle('flipped', runtime.isFlipped);

  if (runtime.isFlipped && host.maybeReturnKnownCardToActivePile()) {
    renderProgress();
    renderReview();
    host.saveState();
  }
}
