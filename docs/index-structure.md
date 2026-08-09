# `index.html` structure notes

Navigation map for the root `index.html` (~750 lines, task #18 build —
Vocabulary + Parsing + Grammar Quiz + Reader + Lesson 1 Alphabet / Lesson 2
Vowel marks / Lessons 1-2 combined practice decks — displayed as "Lesson
1"/"Lesson 2"/"Lessons 1-2" since task #16's display rename + task #18's
combined-deck addition; internally still the `js/ui/alphabet.js` module,
`deckKind` 'letters'/'vowels'/'combined', `runtime.alphabet.letters/vowels`).
As of task #18 the alphabet/vowel decks render into an in-flow
`#alphabetSection` (like Parsing/Grammar/Reader), not a modal overlay — see
that section's row in the `.app` table below. Keep this in sync when you
change the file — see "Maintenance rules" in `CLAUDE.md`.

Line numbers are approximate (drift a few lines between edits). When in
doubt, grep for the `id` rather than trusting a line number.

---

## Top-level layout

```
1    <!DOCTYPE html> / <head>          ← pre-paint theme bootstrap, manifest/icons, stylesheet
44   <body>
45     <div class="app">               ← main shell (in-flow UI, everything that scrolls)
264    overlays (modals)               ← siblings of .app, position:fixed, shown/hidden by JS
743    <script> block                  ← classic data scripts + pos_logic.js shim + main.js module
754  </body>
```

Every `<div class="consent-overlay" …>` is a top-level sibling of `.app` —
never nest a new overlay inside `.app`.

---

## `<head>` (1–54)

- 10–20  **Google Analytics snippet** (task #22, owner policy change
         2026-08-09): async `gtag.js` loader + inline `dataLayer`/`gtag`
         config for the owner's own GA4 property `G-J5HGG50J92`. The same
         snippet also lives in `pages/memorization.html`.
         `tools/check_release.mjs` check7 requires it in both files,
         pins the property id, and forbids the retired `G-YH11KQB6QX`
         (see "Telemetry" in CLAUDE.md).
- 21–30  PWA / icon / manifest `<meta>` tags, `<title>`, and the stylesheet
         link.
- 31–53 **Pre-paint inline script.** Reads `localStorage` and sets
        `data-theme` / `data-font-family` / `data-text-size` on `<html>`
        before first paint to avoid a flash of the wrong theme. Don't move
        this above the stylesheet link.
- `<link rel="stylesheet" href="styles.css?v=20">` (line 30)

> Cache-bust: every asset URL ends in `?v=20`. Bump the number on release
> (see "Cache-bust" in `CLAUDE.md`). The same number lives in `sw.js`
> (`CACHE_NAME` + `APP_SHELL_PATHS`) — both must agree, and
> `tools/check_release.mjs` enforces it.

---

## `<div class="app">` (45–263)

In-document order:

| Lines    | Element                                  | Notes |
|---------:|-------------------------------------------|-------|
| 47–58    | `<header>`                                | Theme switcher (System/Dark/Light), `<h1>Beginning Biblical Hebrew</h1>`, `#appSubtitle` (always "Vocabulary Flashcards" — `getModeDescription()` in `main.js`), `.wycliffe` unofficial-study-aid line naming Cook & Holmstedt / Baker Academic. |
| 60–63    | `.notice-row`                             | "Study aid notice" button (`showDisclaimerModal()`) + `#appNotice`. |
| 65–74    | `.quick-start`                            | Choose session / Start studying / `.mode-group` (`#modeShortcutVocabBtn` + `#modeShortcutParsingBtn` + `#modeShortcutGrammarBtn` + `#modeShortcutReaderBtn`, all `onclick="setStudyMode(...)"`) / Progress / User guide / `#modeShortcutMemorizationBtn` link to `pages/memorization.html` ("Reference"). |
| 76       | `.ornament`                               | Decorative `✦ · · · ✦`. |
| 78–146   | `<details id="advancedSettingsDetails">`  | "Advanced review settings" — **vocab-only; hidden when `studyMode==='parsing'` or `'grammar'`** (`syncLayoutVisibility()` in `js/app/main.js`). Contains `.display-prefs` (Font Serif/Sans, Text size Medium/Large/X-Large, **Vowel points** Pointed/Unpointed — `setShowPoints`, `js/utils/hebrewText.js` `stripHebrewPoints` — and **Transliteration** Show/Hide — `setShowTranslit`), then `#controlsBar` (see below), then the always-open `#progressToolsGroup` frame (Export/Import progress buttons, `exportProgressJson` / `triggerImportProgress`). |
| 104–151  | └ `#controlsBar`                          | Six toggle rows, task #26 rebuilt as static markup in the same TOGGLE-then-LABEL-then-(i) DOM order task #25 shipped for parsing (see `#parsingSection`'s row below): a plain `.toggle-label.toggle-row` `<div>` (no row-level onclick) containing the switch `<button class="toggle-switch">`, the inert `<span class="toggle-text">` label, then a `<button class="toggle-info">` "(i)" — `showToggleInfo(this.closest('.toggle-row'))`, same `#toggleInfoOverlay` modal parsing's rows use. The ROW keeps its original id purely for show/hide (`style.display`, `syncLayoutVisibility()`); the SWITCH carries its own separate id for the `.on`/`aria-checked` state sync (`syncToggleButtons()`) and the persisted-choice `onclick`: `#shuffleToggle` row / `#shuffleBtn` switch (`toggleShuffle`), `#hardReviewToggle` / `#hardReviewBtn` (`toggleHardVocabReview` — drills cards missed 10+ times, confidence < 40%), `#directionToggle` / `#directionBtn` (`toggleDirection`, "English → Hebrew" label — `runtime.directionToGreek` is the underlying field name, kept for the SRS/mark-store key scheme, see `CLAUDE.md`), `#spacedToggle` / `#spacedBtn` (`toggleSpacedRepetition`), `#cadenceToggle` / `#cadenceBtn` ("2-month pace", `toggleSpacingCadence`, inverted: ON = 2-month intensive preset, OFF = default 8-month relaxed preset — `js/domain/srs/constants.js` `SRS_CADENCE_PRESETS`; row visible only while Spaced review is on), `#unspacedDailyResetToggle` / `#unspacedDailyResetBtn` (`toggleUnspacedDailyReset`, 5 AM local daily archive-clear; row visible only while Spaced review is off). `installToggleInfoButtons()`/`installToggleInfoForContainer()` (`js/app/main.js`) are now DEAD CODE for this container — every row already ships its own `(i)` in markup, so their idempotent `if (label.querySelector('.toggle-info')) return;` guard bails on every row — kept in place as a no-op-compatible shim per `CLAUDE.md`'s module-cache hazard rule, not deleted. No "Required only"/starred-vocab toggle — all 209 BBH cards are `required: true` (see conversion plan decision 5); no split vocab/grammar selection. |
| 150–157  | `<details id="resetActionsDetails">`      | "Reset actions" — a sibling `<details>` after `#advancedSettingsDetails`, not nested inside it. **Vocab-only; hidden when `studyMode==='parsing'` or `'grammar'`.** Reshuffle (`reshuffleEligible`), Reset deck (`#resetDeckBtn` → `resetCurrentDeck`), Reset stats (`openResetStatsModal`). |
| 159–165  | `<section id="parsingSection">`           | **Phase 2 PR B; scope/mobile redesign in PR G; SCOPE/DIRECTION/lesson-row restyle in PR H item 7; scope-card relabel + default + More-options row rebuild + journey-map/card mobile stacking in task #25.** Hidden (`style="display:none"`) unless `studyMode==='parsing'`; toggled by the same `syncLayoutVisibility()` branch that hides the vocab sections above/below it (and `#grammarSection`, below). `<details id="parsingOptionsDetails">` wraps `#parsingOptionsPanel` — a primary bar (`parsingLessonSelect`, single row at every width — PR H item 7c; `#parsingScopeControl`, a `.parsing-scope-grid` 2-column grid of `.parsing-scope-card` buttons — PR H item 7a, same visual pattern as the study-selector's session/preset cards, replacing the old `.theme-switcher` pill — for **Lesson focus**/`Root journey`/`By feature`/**All to date**/Custom scope (task #25 items 1-2: display-only renames of the old Focused/Shuffle labels — internal mode keys `'focused'`/`'shuffle'` unchanged; **All to date is now the default scope for fresh state**, mirrored across `js/state/runtime.js`'s `parsing` default, `js/state/persistence.js`'s `sanitizeParsingState`, and `main.js`'s mixed-version guard), the Root card disabled with an "unlocks at Lesson N" title until 2+ in-gate paradigms share a root; the active mode's own inline `<select>` picker — `parsingParadigmSelect` (Lesson focus), `parsingRootSelect` (labeled "Root (verbs)") + a "Drill this root" button (Root — also renders a `.parsing-journey-map` line inside `#parsingArea`, not here), `parsingFeatureDimSelect` + checkbox value list (By feature), `#parsingCustomSetList` (Custom, unwrapped — no separate enable toggle now that Custom is a scope-control mode); `parsingDirectionToggle`, a `.theme-switcher.parsing-direction-pill` capped to `max-width:22rem` and left-aligned under its own label — PR H item 7b, segments relabeled Parse/Build/Mixed, "Build the Form" full name moved to the user guide) plus a collapsed-by-default `<details id="parsingMoreOptionsDetails">` ("More options": `parsingExcludeKnownToggle`, `parsingAppendixToggle`, `parsingDim<Name>Toggle` ×7, `parsingResetKnownBtn`, `parsingClearStatsBtn`) whose open state persists at `runtime.parsing.optionsOpen` via `ontoggle` (no re-render — see `js/ui/parsing.js`'s render-split header comment); `#parsingArea` (empty-state / journey-map + step-walk / Build-choices / summary — below 700px `.parsing-area` switches from row to column so the journey map stacks full-width above the drill card instead of both crushing into half-width columns, task #25 item 4). Each More-options row (task #25 item 3) is now a plain `.parsing-toggle-row` `<div>` — no row-level onclick — containing, in DOM order, the switch `<button class="toggle-switch">` (the id, e.g. `parsingAppendixToggle`, moved here), the `<span class="toggle-text">` label, and a `<button class="toggle-info">` "(i)" that opens the SAME `#toggleInfoOverlay` modal the vocab controlsBar's info buttons use (`showToggleInfo`/`closeToggleInfoModal`, exposed on `GLOBAL_CLICK_HANDLERS` for this onclick-string call site) — the (i) is a sibling of the switch, not nested inside it, so tapping it can never flip the toggle. Task #26 generalized this row shape app-wide: `styles.css`'s rules now live under the shared `.toggle-row, .parsing-toggle-row` selector (identical rules, `.parsing-toggle-row` kept as an alias so this file's own markup — untouched by task #26 — still applies) and the same DOM shape now also renders `#controlsBar`'s vocab toggles (static markup) and grammar/reader's own toggles (each module's own local `toggleHtml()`, deliberately duplicated rather than imported — see those modules' header comments and `CLAUDE.md`'s module-cache hazard note). Both `#parsingOptionsPanel` and `#parsingArea` are populated by `js/ui/parsing.js`'s `renderParsingPanel()`, called from `syncLayoutVisibility()` — but answering a card only ever re-renders `#parsingArea` (never the options panel), so the More-options/custom-group collapse state survives every card answer. See that module's header for the full id list and the `runtime.parsing.rootFilter`/`dimValueFilter`/`journeyIndex` scope-state fields (additive, `PROGRESS_EXPORT_VERSION` unchanged). |
| 167–173  | `<section id="grammarSection">`           | **Phase 2 PR C.** Hidden (`style="display:none"`) unless `studyMode==='grammar'`; toggled by the same `syncLayoutVisibility()` branch. `<details id="grammarOptionsDetails">` wraps `#grammarOptionsPanel` (lesson select, Review-missed toggle, Difficulty All/Core-only switcher); `#grammarArea` (empty-state / question card / answer summary, with an in-session score strip at the top — `.grammar-area` is a COLUMN flex container, PR H item 4 fix: it used to default to a row, squeezing the score strip and card side-by-side and overlapping at phone widths). Both are populated by `js/ui/grammar.js`'s `renderGrammarPanel()`, called from `syncLayoutVisibility()` — see that module's header for the full id list (`grammarLessonSelect`, `grammarReviewMissedToggle`, `grammarDifficultyToggle`). Task #26: the Review-missed row is now the shared TOGGLE-then-LABEL-then-(i) shape (`toggleHtml()`, id `grammarReviewMissedToggle` on the SWITCH button itself, matching parsing's own convention — not on the row, unlike vocab's `#controlsBar`, which keeps a separate id on each row for show/hide). Difficulty stays a plain `.theme-switcher` (2 named options, not a boolean toggle — out of task #26's scope). |
| 175–182  | `<section id="readerSection">`            | **Phase 2 PR D.** Hidden (`style="display:none"`) unless `studyMode==='reader'`; toggled by the same `syncLayoutVisibility()` branch. `<details id="readerOptionsDetails">` wraps `#readerOptionsPanel` (lesson select 1–50, Strict-only/Strict+Guided tier toggle, and — only when a challenge-tier passage exists at or before the current lesson — a Challenge-passages toggle); `#readerArea` (passage list grouped by gate-lesson bucket, or the single-passage reading view with tappable tokens + inline word-detail popover); `#readerAttribution` (required CC BY 4.0 line, always visible under the area). All three are populated by `js/ui/reader.js`'s `renderReaderPanel()`, called from `syncLayoutVisibility()` — see that module's header for the full id list and the morphology-code decoder. Reads `window.BBH_READER` (52 curated OSHB passages). Task #26: the Challenge-passages row (`#readerChallengeToggle`, previously a single "Shown"/"Hidden" text button) was rebuilt as the shared TOGGLE-then-LABEL-then-(i) shape (`toggleHtml()`, id on the switch, same convention as grammar's); Strict-only/Strict+Guided stays a plain `.theme-switcher` (2 named options, out of task #26's scope). |
| —        | `<section id="alphabetSection">`          | **Task #18 — converted from a modal overlay (`#alphabetOverlay`, PR E/PR H item 3) to an in-flow section.** Hidden (`style="display:none"`) unless `js/ui/alphabet.js`'s `isAlphabetSectionActive()` is true; toggled from INSIDE `syncLayoutVisibility()`'s vocab branch (not a new early-return mode branch like Parsing/Grammar/Reader above) — `runtime.studyMode` stays `'vocab'` the whole time a deck is open, see that module's header comment for why. `.alphabet-standalone-note` (compact "no SRS/no XP/not counted" line, `title` attr carries the long form — task #18 item 2); `.alphabet-header-row` (`#alphabetSectionLabel`/`#alphabetSectionTitle` text + `.alphabet-back-btn` → `alphabetBackToVocab()`, `main.js`, restores the vocab card area with the deck untouched — not a modal close, no `shieldClicksBriefly()`); `#alphabetCardArea`; `#alphabetMarkRow` (Again/Got it, reusing `#markRow`'s own button classes — PR H item 2); `#alphabetProgressLine` + Shuffle (`alphabetShuffle()`); Reset progress link (`alphabetResetProgress()`); `#alphabetShevaFooter` (shown for the vowels AND combined decks). All populated by `js/ui/alphabet.js`'s `renderAlphabetSection()`, called from `syncLayoutVisibility()` same as the other three modules' render calls. Selecting a deck from `#studySelectorOverlay` calls `main.js`'s `pickAlphabetDeck(kind)` wrapper (`openAlphabetSection(kind)` + `closeStudySelector()` + `syncLayoutVisibility()`) — see `js/ui/alphabet.js`'s `deckKind` module state (`'letters'`/`'vowels'`/`'combined'`, task #18 item 3: the combined deck merges all 23 letters + 12 vowels, known-marking resolved per-card by its own kind into the SAME `runtime.alphabet.letters`/`.vowels` maps — no third map). |
| 184–190  | `#cardArea`                               | **Main flashcard mount (vocab only; hidden when `studyMode` is `'parsing'`, `'grammar'`, or `'reader'`, OR when `#alphabetSection` is active).** Ships a placeholder `.empty-state` (Hebrew "אבג" + "Tap to choose a session…"); `renderCard()` in `js/ui/render.js` replaces it. |
| 191–197  | `#navRow`                                 | Prev (`navigate(-1)`) / `#spacedUndoBtn` (`restoreSpacedUndo`) / `#navResetBtn` (`resetCurrentDeck`) / `#navNextBtn` (`handleNavNext` → `navigate(1)`). Vocab only; hidden in Parsing/Grammar/Reader mode (each owns its own in-section navigation instead). |
| 198–203  | `#markRow`                                | Hard (`again`) / Uncertain (`pass`) / Easy (`easy`) via `markCard(outcome)`. Vocab only; hidden in Parsing/Grammar/Reader mode by `syncLayoutVisibility()` — `js/ui/render.js`'s `renderCard()` also bails out early for any non-vocab `runtime.studyMode` before it would otherwise reset this row's `display` itself (PR H item 5 fix: a mode-agnostic `renderCard()` call site, e.g. picking a session from the selector, used to undo `syncLayoutVisibility()`'s hide and leak the row into Parsing/Grammar/Reader). |
| 204–208  | `#ffRow`                                  | Fast-forward 1 day / 1 week (`fastForwardOneDay` / `fastForwardOneWeek`) — advances the SRS clock for testing/catch-up. Vocab only; hidden in Parsing/Grammar/Reader mode. |
| 209–219  | `<section class="review-shell">`          | `#reviewPanel` → `#reviewDeckTag`, `#reviewStats` (confidence/due breakdown + collapsible due-by-day histogram, `buildDueHistogramHtml` in `js/ui/progress.js`), `#reviewSortRow`, `#reviewList`. Vocab only; hidden in Parsing/Grammar/Reader mode (each has its own analytics section instead — see `#analyticsParsingCollapse` / `#analyticsGrammarCollapse` / `#analyticsReaderCollapse` below). |
| 221–223  | `<footer class="app-footer">`             | "Contact author" link (`openContactAuthorModal()`). |

---

## Overlays (264–626) — siblings of `.app`

All use `class="consent-overlay"` + an `aria-hidden` toggle; most nest a
`.consent-modal`/`.analytics-overlay` panel inside. Open/close handlers live
in `js/ui/modals.js` and `js/ui/navigation.js`, wired via `main.js`.

**Tap guards (task #18 item 4 audit):** every close/dismiss button across
these overlays (Close, Cancel, Got it, Got it!, Agree and continue, Refresh
now, and the small "✕" corner buttons) carries `shieldClicksBriefly()`
(`js/utils/clickShield.js`) in its close handler, so the iOS ghost click
~300ms after the tap that closed the modal can't fall through onto whatever
is now under the finger — `js/ui/pwaInstall.js`'s `closeInstallInstructions()`
was missing this and was fixed in the same audit. Every one of those buttons
also carries a shared `.modal-close-btn` marker class in `index.html` (in
addition to its own `.ctrl-btn`/`.modal-close-x`/etc styling classes) so
`main.js`'s startup code can apply `preventDoubleTapZoom()` to all of them
in one `document.querySelectorAll('.modal-close-btn')` pass. Non-modal
buttons (mode shortcuts, the alphabet section's own "← Back to lessons")
are deliberately NOT shielded or tap-guarded this way.

| Lines    | id                            | Purpose |
|---------:|-------------------------------|---------|
| 227–244  | `#transferOverlay`            | Import/export progress (textarea + file picker) — `js/state/persistence.js`. |
| 245–415  | `#analyticsOverlay`           | Progress/analytics dashboard — hero XP/streak, chapter mastery grid, records, stubborn/slipping/most-improved lists, achievements, (Phase 2 PR B) `#analyticsParsingCollapse` (`data-collapse-key="parsingSection"`, `#analyticsParsingBody` — Parsing accuracy/known-status/trend/recent-forms; hidden via inline `style="display:none"` until at least one parsing attempt exists), (Phase 2 PR C) `#analyticsGrammarCollapse` (`data-collapse-key="grammarSection"`, `#analyticsGrammarBody` — overall accuracy, per-lesson-block accuracy, top-5 weakest concept tags, missed-question count; same hide-until-first-attempt behavior), and (Phase 2 PR D) `#analyticsReaderCollapse` (`data-collapse-key="readerSection"`, `#analyticsReaderBody` — passages read in the current lesson/tier scope vs. total, passages read overall, review-marks count; hidden until at least one passage is read or one token is marked). Rendered by `renderAnalyticsOverlay()` in `js/ui/analytics.js`, which calls each section through its own host hook (`host.renderParsingSection()` / `host.renderGrammarSection()` / `host.renderReaderSection()`) wired to `js/ui/parsing.js`'s `renderParsingAnalytics()` / `js/ui/grammar.js`'s `renderGrammarAnalytics()` / `js/ui/reader.js`'s `renderReaderAnalytics()` in `main.js`'s `configureAnalytics(...)` — analytics.js itself never imports parsing.js, grammar.js, or reader.js. Note: the Lesson 1/2 Alphabet/Vowel decks have NO analytics section anywhere in this overlay — see `js/ui/alphabet.js`'s header. Course-wide vocab totals/chapter-mastery grid/stubborn-slipping-improved lists are all scoped through `getAllChapterKeys()`/`getAllVocabCards()` (`js/domain/deck/filters.js`, `isChapterKey`-filtered), which also excludes the task #20 `ADV<NN>` advanced-vocab buckets (and the `BKV::*` Book Vocab pseudo-keys, never even merged into `window.SETS`) from every course-wide panel — task #18 item 5 audit confirmed this end-to-end for the task #15 predecessor (analytics.js/progress.js), reconfirmed for task #20's rework, see `docs/bbh-conversion-plan.md`. Labels read "Lesson N" (not "Chapter N"). |
| 455–513  | `#studySelectorOverlay`       | "Choose session" — a `.alphabet-lesson0-section` block with THREE rows (**"Lesson 1 · Alphabet"**, **"Lesson 2 · Vowel marks"**, and **"Lessons 1-2 · Letters + vowels (combined)"** buttons, all `onclick="pickAlphabetDeck('letters'\|'vowels'\|'combined')"` — task #18 item 3 added the combined entry and switched the click target from `openAlphabetOverlay(kind)` to `main.js`'s `pickAlphabetDeck(kind)` wrapper, which opens the in-flow `#alphabetSection` instead of a modal) sits ABOVE "Deselect all", visually separated and NOT part of `selectedKeys`/presets/vocab counts (see `js/ui/alphabet.js`), then "All Lessons" + 13 "Unit" reading-block presets — 14 keys total, the five decade-range presets were removed by PR H item 1 (`js/data/setMeta.js` `SESSION_WEEK_META`, all in one `#sessionsGrid`) — then the individual-lesson chapter selector (`#chaptersGrid`), built by `js/ui/selectors.js` (task #16 addendum: `buildChapterSelector()` now excludes lessons 1–2 from this grid only — their 0-vocab lessons are now the decks above; lesson 3 is the first entry; Parsing/Grammar/Reader's own lesson selects still start at 1) — then (task #20, REWORKED from task #15's `#bookDecksGrid` grid to mirror the Greek app's own advancedSection/bookVocabSection design; placement moved to AFTER manual lesson selection per that rework) two collapsible `<details class="advanced-section-shell">` sections: **`#advancedSection`** (`#advancedGrid`, `<details id="advancedSectionShell">` with a `#advancedSectionMeta` bucket/word count and a blurb) built by `js/ui/selectors.js`'s `buildAdvancedVocabSelector()` from the `ADV<NN>` keys `js/app/main.js`'s `mergeAdvancedVocabDecks()` folded into `window.SETS` — each bucket is itself a nested `<details class="supplemental-set advanced-set">` with an "All of Advanced N-M" button (`toggleSet(key)`) plus per-sub-group-of-25 buttons (`toggleAdvancedSubGroup(key, sub)` → `toggleSet('ADV<NN>::sub::<label>')`); own "Deselect all advanced" button, `deselectAllAdvanced()` — and **`#bookVocabSection`** (`#bookVocabGrid`, `<details id="bookVocabSectionShell">`) built by `buildBookVocabSelector()` from `window.BBH_BOOK_VOCAB.books` (never merged into `window.SETS` — see the script-block entry below), each book a nested `<details>` with an "All of `<Book>`" button (`toggleSet('BKV::<book>')`) plus per-50-word-group buttons (`toggleBookVocabGroup(bookKey, N)` → `toggleSet('BKV::<book>::g::<N>')`); own "Deselect all book vocab" button, `deselectAllBookVocab()`. Neither `ADV<NN>` nor `BKV::*` keys are `isChapterKey`, so the lesson/session deselect buttons skip them; `.advanced-section-shell`/`.supplemental-set`/`.advanced-sub-list`/etc. CSS was already present in `styles.css` (ported dormant from the Greek app at the original conversion), so no CSS changes were needed for this rework. |
| 473–528  | `#shortcutsOverlay`           | User guide / keyboard shortcuts, with a subsection per mode (Vocabulary incl. Lesson 1/2/combined + Units, Parsing, Grammar, Reader) + the inline **changelog** (see "Changelog" in `CLAUDE.md` for the editing rules). |
| 551–583  | `#consentOverlay`             | First-run disclaimer / consent gate (`initializeConsentGate`, `handleConsentAction`) — includes the on-device-storage privacy line. |
| 586–611  | `#resetSpacedOverlay`         | Scoped reset for spaced-repetition progress (timing-only / full progress / smooth). |
| 612–627  | `#resetStatsOverlay`          | "Reset stats" modal — keep settings vs. reset to first-launch start. |
| 628–649  | `#resetUnspacedOverlay`       | Scoped reset for unspaced marks. |
| 650–661  | `#refreshAvailableOverlay`    | Service-worker "Update available" prompt (`acceptRefreshAvailable`, wired at the bottom of `main.js`). |
| 662–673  | `#toggleInfoOverlay`          | Small modal showing a toggle's own `title` text — surfaced for touch devices where hover tooltips never appear (`showToggleInfo` / `installToggleInfoButtons` in `main.js`). |
| 674–696  | `#contactAuthorOverlay`       | Author contact card. |
| 697–     | `#installInstructionsOverlay`| PWA "Add to Home Screen" how-to (`js/ui/pwaInstall.js`). |

---

## Script block (~743–752)

```html
<script defer src="js/data/bbh_vocab.js?v=20"></script>
<script defer src="js/data/bbh_advanced_vocab.js?v=20"></script>
<script defer src="js/data/bbh_reference_data.js?v=20"></script>
<script defer src="js/data/bbh_parsing.js?v=20"></script>
<script defer src="js/data/bbh_grammar.js?v=20"></script>
<script defer src="js/data/bbh_reader.js?v=20"></script>
<script defer src="js/data/bbh_alphabet.js?v=20"></script>
<script defer src="js/logic/pos_logic.js?v=20"></script>
<script defer src="js/pwa/swUpdate.js?v=20"></script>
<script type="module" src="js/app/main.js?v=20"></script>
```

- **`js/data/bbh_vocab.js`** — classic deferred script, self-registers
  `window.SETS["1".."50"] = {label, type:'lesson', cards}` (generated; never
  hand-edit — see the data-regeneration rule in `CLAUDE.md`).
- **`js/data/bbh_advanced_vocab.js`** — classic deferred script (task #20,
  advanced vocab reworked to the GREEK-APP model, replacing task #15's
  `bbh_book_vocab.js`; task #23 widened the corpus from the Reader's 8
  books to the whole 39-book Tanakh), self-registers TWO globals:
  `window.BBH_ADVANCED_VOCAB = {schemaVersion, buckets: [{key, label, notes, cards}, ...]}`
  (corpus-wide descending-frequency buckets of 100, `bbh-adv-<strongs>` card
  ids, 3,880 cards across 39 buckets as of task #23 — grows/shrinks
  slightly as the pinned OSHB/Strong's checkouts or the 209-lesson CSV
  change) and
  `window.BBH_BOOK_VOCAB = {schemaVersion, groupSize, books: [{key, name, order, refs}, ...]}`
  (39 books, canonical Hebrew-Bible print order, `refs` an array of
  EXISTING lesson/advanced card ids ordered by descending in-book
  frequency — a link index, never new cards). Both generated by
  `tools/gen_bbh_advanced_vocab.mjs` from a pinned OSHB checkout (all 39
  `wlc/*.xml` books as of task #23) + pinned Strong's Hebrew Dictionary
  checkout (both already pinned for the Reader pipeline — see
  `source/bbh/reader/corpus-pin.json`)
  + `tools/gen_bbh_data.mjs`'s `buildLessons()` (the 209-card link/exclusion
  set), never hand-edited. Loaded AFTER `bbh_vocab.js` in this script block
  on purpose: `js/app/main.js`'s `mergeAdvancedVocabDecks()` (module-load-
  time, before the first `buildAdvancedVocabSelector()` call) folds
  `BBH_ADVANCED_VOCAB.buckets` into `window.SETS` under their own `ADV<NN>`
  keys — an ordinary additive merge, guarded on `BBH_ADVANCED_VOCAB` being
  present (mixed-version safe). `BBH_BOOK_VOCAB` is deliberately NEVER
  merged into `window.SETS` — its `BKV::<book>`/`BKV::<book>::g::<N>`
  pseudo-keys are resolved straight to the live lesson/advanced card
  objects at deck-build time by `js/domain/deck/filters.js`'s
  `resolveBookVocabCards()`, so a book-vocab selection shares progress with
  the card's home lesson or advanced bucket (no duplicate ids). Read by
  `js/ui/selectors.js`'s `buildAdvancedVocabSelector()` /
  `buildBookVocabSelector()`; card selection/SRS/export flow through the
  same generic `getSelectedVocabCards()` code path lesson decks use, with
  only a small book-vocab-key branch there (no separate SETS entries for
  book vocab at all).
- **`js/data/bbh_reference_data.js`** — classic deferred script, the
  paradigm/reference data also consumed by `pages/memorization.html`
  (which also loads the sibling `js/data/bbh_reference_extra.js` — the 42
  alphabet/vowel/paradigm Extended reference sections — directly itself;
  that file is NOT a script tag in `index.html`, only in
  `pages/memorization.html`, since index.html has no use for it).
- **`js/data/bbh_alphabet.js`** — classic deferred script (Phase 2 PR E,
  Lesson 0A/0B split by PR H item 3), self-registers
  `window.BBH_ALPHABET = {schemaVersion, letters, vowels, shevaRules}` (23
  letters, 12 vowels + their shəva rules) — generated by
  `tools/gen_bbh_alphabet_data.mjs` from `source/bbh/alphabet.json` +
  `source/bbh/vowels.json` + the vocab CSV pipeline (each vowel's
  deterministic representative example word/highlighted cluster), never
  hand-edited. Read only by `js/ui/alphabet.js`.
- **`js/data/bbh_parsing.js`** — classic deferred script (Phase 2 PR B),
  self-registers `window.BBH_PARSING = {schemaVersion, paradigms, lessonGates}`
  — generated by `tools/gen_bbh_parsing_data.mjs`, never hand-edited. Read
  only by `js/ui/parsing.js`.
- **`js/data/bbh_grammar.js`** — classic deferred script (Phase 2 PR C),
  self-registers `window.BBH_GRAMMAR = {schemaVersion, questions}` —
  generated by `tools/gen_bbh_grammar_data.mjs` from
  `source/bbh/grammar/questions.json`, never hand-edited. Read only by
  `js/ui/grammar.js`. Ships with an empty `questions` array until the bank
  is populated (see `docs/bbh-conversion-plan.md` Phase 2 PR C).
- **`js/data/bbh_reader.js`** — classic deferred script (Phase 2 PR D),
  self-registers `window.BBH_READER = {schemaVersion, attribution, corpusPin,
  passages}` — 52 curated Reader passages (406 tokens), generated by
  `tools/gen_bbh_reader_data.mjs` from `source/bbh/reader/*.json` plus a
  pinned OSHB import (`tools/import_oshb_reader.mjs`), never hand-edited.
  Read only by `js/ui/reader.js`. Hebrew text is public domain (WLC as
  distributed by OSHB); lemma/morphology data is CC BY 4.0 — see the
  attribution line rendered in `#readerAttribution` and duplicated in
  `#shortcutsOverlay`, and `source/bbh/reader/corpus-pin.json`.
- **`js/pwa/swUpdate.js`** — classic deferred script, NOT a module (Phase 2
  hotfix). Service-worker registration + the `#refreshAvailableOverlay`
  "Update available" prompt, extracted OUT of `main.js`'s module body so no
  ES-module startup failure can ever hide the refresh prompt. Defines
  `window.acceptRefreshAvailable()`.
- **`js/logic/pos_logic.js`** — classic deferred script, NOT a module. A
  small shim (`stableCardKey`) kept for legacy-id-map back-compat; see its
  own header comment. Loaded as a global (not imported) so it must stay a
  classic script, not converted to an ES module, without also updating every
  `typeof window.stableCardKey === 'function'` call site.
- **`js/app/main.js`** — the only `type="module"` script; every other JS
  file is reached via its (or its dependencies') static `import` graph. See
  the "Cache-bust" and "ES-module cross-version import hazard" rules in
  `CLAUDE.md` before adding or removing an export here — this hazard has
  been **active since the v1 release** shipped (previous BBH-conversion
  commits were pre-launch, so it didn't apply yet).

`js/data/setMeta.js` (lesson titles + `SESSION_WEEK_META` range presets) is
**not** a classic script tag — it's pulled in only through `main.js`'s
`import { SESSION_WEEK_META } from '../data/setMeta.js'`.

`js/ui/parsing.js` (Phase 2 PR B) is likewise not a classic script tag —
it's a brand-new ES module reached only through `main.js`'s
`import { configureParsing, ... } from '../ui/parsing.js'`, which in turn
imports `js/domain/parsing/gates.js` and `js/domain/parsing/drill.js` (its
only two permitted imports — see that file's header comment).

`js/ui/grammar.js` (Phase 2 PR C) is likewise not a classic script tag —
it's a brand-new ES module reached only through `main.js`'s
`import { configureGrammar, ... } from '../ui/grammar.js'`. Unlike
`parsing.js`, it imports NOTHING else — gating is a simple
`introducedLesson <= lesson` filter implemented locally in the module (see
its header comment), so it needs no `js/domain/*` gates engine.

`js/ui/reader.js` (Phase 2 PR D) is likewise not a classic script tag —
it's a brand-new ES module reached only through `main.js`'s
`import { configureReader, ... } from '../ui/reader.js'`. Same isolation
rule as `grammar.js`: imports NOTHING else, gating is a local
`gateLesson <= lesson` filter, and it owns its own OSHB morphology-code
decoder (verb stem/conjugation/PGN, noun/adjective gender-number-state,
pronoun/suffix person-gender-number, particle types) rather than importing
one. `main.js`'s `js/state/persistence.js`/`js/ui/navigation.js` wiring for
Reader reuses two host hooks (`isReaderMode` / `renderReaderModule`) those
two modules already carried as no-op defaults from before Reader existed —
see their own header comments. Being brand-new files, none of `parsing.js`,
`grammar.js`, or `reader.js` carries any of the
cross-version cache-hazard risk the paragraph above warns about; that risk
applies to *existing* shipped modules' export lists, not new files.

`js/ui/alphabet.js` (Phase 2 PR E, Lesson 0 addendum; split into 0A
Alphabet + 0B Vowel marks by PR H item 3; overlay → in-flow section +
combined deck by task #18) is likewise not a classic script tag — it's an
ES module reached only through `main.js`'s
`import { configureAlphabet, ... } from '../ui/alphabet.js'`.
Strictest isolation of any UI module so far: it imports NOTHING at all, not
even a gates helper — there's no lesson gating in Lesson 1/2, all 23 letters
and all 12 vowels are always available. Module-local `deckKind` ('letters',
'vowels', or 'combined' — task #18) picks which of `window.BBH_ALPHABET`'s
arrays and which of `runtime.alphabet`'s two subtrees (`letters`/`vowels`)
the shared render/mark/shuffle functions read; a second module-local flag,
`sectionActive` (exposed as `isAlphabetSectionActive()`), tracks whether
`#alphabetSection` is currently showing — see `openAlphabetSection(kind)` /
`closeAlphabetSection()`. Unlike every other mode section, this one is
toggled from INSIDE `syncLayoutVisibility()`'s vocab branch rather than a
sibling early-return branch, because `runtime.studyMode` deliberately never
becomes `'alphabet'` — see that module's header comment for the full
rationale. `main.js`'s `pickAlphabetDeck(kind)` / `alphabetBackToVocab()`
wrappers are what actually orchestrate across modules (open the deck, close
the study selector, flip the section's visibility) since alphabet.js itself
imports nothing and can't reach `closeStudySelector()`/`syncLayoutVisibility()`
directly. The pre-task-#18 overlay API
(`openAlphabetOverlay`/`closeAlphabetOverlay`/`isAlphabetOverlayOpen`) is
kept exported as inert no-ops (`#alphabetOverlay` no longer exists in
`index.html`) per the cross-version "never remove an export an older
shipped main.js still imports" rule below — as of task #18, alphabet.js is
no longer risk-free the way a brand-new file is (it shipped in PR E through
task #16), so this module's export-list changes are held to the same
discipline as parsing.js/grammar.js/reader.js's later additions. `js/ui/
keyboard.js` wires Escape for both the legacy overlay (`isAlphabetOverlayOpen`
/`closeAlphabetOverlay`, now inert) and the new section
(`isAlphabetSectionActive`/`alphabetBackToVocab`, task #18) — all four are
`typeof`-guarded the same way `isInstallInstructionsOpen` is, for the same
SW cross-version reason; the section guard also suppresses the vocab-deck
keyboard shortcuts (space/arrows/1-2-3) while it's open, since
`isReviewDeckMode()` would otherwise still read true (`studyMode==='vocab'`).

---

## Maintenance

See "Maintenance rules" in `CLAUDE.md` for the full checklist (this doc,
cache-bust, the ES-module hazard, the changelog). In short: if you add,
remove, or rename a section/overlay/id in `index.html`, or change the
script load order, update this file in the same commit.
