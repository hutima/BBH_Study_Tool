# `index.html` structure notes

Navigation map for the root `index.html` (~625 lines, Phase 2 PR C build —
Vocabulary + Parsing + Grammar Quiz). Keep this in sync when you change the
file — see "Maintenance rules" in `CLAUDE.md`.

Line numbers are approximate (drift a few lines between edits). When in
doubt, grep for the `id` rather than trusting a line number.

---

## Top-level layout

```
1    <!DOCTYPE html> / <head>          ← pre-paint theme bootstrap, manifest/icons, stylesheet
44   <body>
45     <div class="app">               ← main shell (in-flow UI, everything that scrolls)
199    overlays (modals)               ← siblings of .app, position:fixed, shown/hidden by JS
591    <script> block                  ← classic data scripts + pos_logic.js shim + main.js module
597  </body>
```

Every `<div class="consent-overlay" …>` is a top-level sibling of `.app` —
never nest a new overlay inside `.app`.

---

## `<head>` (1–43)

- 9–19   PWA / icon / manifest `<meta>` tags, `<title>`, and the stylesheet
         link. No analytics tag — GA (`gtag.js`, property `G-YH11KQB6QX`) was
         removed in Phase 2; the app ships telemetry-free and no replacement
         analytics is permitted (see CLAUDE.md).
- 20–42 **Pre-paint inline script.** Reads `localStorage` and sets
        `data-theme` / `data-font-family` / `data-text-size` on `<html>`
        before first paint to avoid a flash of the wrong theme. Don't move
        this above the stylesheet link.
- `<link rel="stylesheet" href="styles.css?v=4">` (line 19)

> Cache-bust: every asset URL ends in `?v=4`. Bump the number on release
> (see "Cache-bust" in `CLAUDE.md`). The same number lives in `sw.js`
> (`CACHE_NAME` + `APP_SHELL_PATHS`) — both must agree, and
> `tools/check_release.mjs` enforces it.

---

## `<div class="app">` (45–197)

In-document order:

| Lines    | Element                                  | Notes |
|---------:|-------------------------------------------|-------|
| 47–58    | `<header>`                                | Theme switcher (System/Dark/Light), `<h1>Beginning Biblical Hebrew</h1>`, `#appSubtitle` (always "Vocabulary Flashcards" — `getModeDescription()` in `main.js`), `.wycliffe` unofficial-study-aid line naming Cook & Holmstedt / Baker Academic. |
| 60–63    | `.notice-row`                             | "Study aid notice" button (`showDisclaimerModal()`) + `#appNotice`. |
| 65–74    | `.quick-start`                            | Choose session / Start studying / `.mode-group` (`#modeShortcutVocabBtn` + `#modeShortcutParsingBtn` + `#modeShortcutGrammarBtn`, all `onclick="setStudyMode(...)"` — Reader is still not in the DOM) / Progress / User guide / `#modeShortcutMemorizationBtn` link to `pages/memorization.html` ("Reference"). |
| 76       | `.ornament`                               | Decorative `✦ · · · ✦`. |
| 78–146   | `<details id="advancedSettingsDetails">`  | "Advanced review settings" — **vocab-only; hidden when `studyMode==='parsing'` or `'grammar'`** (`syncLayoutVisibility()` in `js/app/main.js`). Contains `.display-prefs` (Font Serif/Sans, Text size Medium/Large/X-Large, **Vowel points** Pointed/Unpointed — `setShowPoints`, `js/utils/hebrewText.js` `stripHebrewPoints` — and **Transliteration** Show/Hide — `setShowTranslit`), then `#controlsBar` (see below), then the always-open `#progressToolsGroup` frame (Export/Import progress buttons, `exportProgressJson` / `triggerImportProgress`). |
| 104–137  | └ `#controlsBar`                          | Six toggles, each `installToggleInfoButtons()`-injected with a small `(i)` info button: `#shuffleToggle` (`toggleShuffle`), `#hardReviewToggle` (`toggleHardVocabReview` — drills cards missed 10+ times, confidence < 40%), `#directionToggle` (`toggleDirection`, "English → Hebrew" label — `runtime.directionToGreek` is the underlying field name, kept for the SRS/mark-store key scheme, see `CLAUDE.md`), `#spacedToggle` (`toggleSpacedRepetition`), `#cadenceToggle` ("2-month pace", `toggleSpacingCadence`, inverted: ON = 2-month intensive preset, OFF = default 8-month relaxed preset — `js/domain/srs/constants.js` `SRS_CADENCE_PRESETS`), `#unspacedDailyResetToggle` (`toggleUnspacedDailyReset`, 5 AM local daily archive-clear). No "Required only"/starred-vocab toggle — all 191 BBH cards are `required: true` (see conversion plan decision 5); no split vocab/grammar selection. |
| 148–155  | `<details id="resetActionsDetails">`      | "Reset actions" — a sibling `<details>` after `#advancedSettingsDetails`, not nested inside it. **Vocab-only; hidden when `studyMode==='parsing'` or `'grammar'`.** Reshuffle (`reshuffleEligible`), Reset deck (`#resetDeckBtn` → `resetCurrentDeck`), Reset stats (`openResetStatsModal`). |
| 157–163  | `<section id="parsingSection">`           | **Phase 2 PR B.** Hidden (`style="display:none"`) unless `studyMode==='parsing'`; toggled by the same `syncLayoutVisibility()` branch that hides the vocab sections above/below it (and `#grammarSection`, below). `<details id="parsingOptionsDetails">` wraps `#parsingOptionsPanel` (lesson/paradigm selects, scope toggles, dimension toggles, reset/clear buttons); `#parsingArea` (empty-state / step-walk / Build-choices / summary). Both are populated by `js/ui/parsing.js`'s `renderParsingPanel()`, called from `syncLayoutVisibility()` — see that module's header for the full id list (`parsingLessonSelect`, `parsingParadigmSelect`, `parsingShuffleAllToggle`, `parsingCustomSetToggle`/`parsingCustomSetList`, `parsingExcludeKnownToggle`, `parsingAppendixToggle`, `parsingDirectionToggle`, `parsingDim<Name>Toggle` ×7, `parsingResetKnownBtn`, `parsingClearStatsBtn`). |
| 165–170  | `<section id="grammarSection">`           | **New (Phase 2 PR C).** Hidden (`style="display:none"`) unless `studyMode==='grammar'`; toggled by the same `syncLayoutVisibility()` branch. `<details id="grammarOptionsDetails">` wraps `#grammarOptionsPanel` (lesson select, Review-missed toggle, Difficulty All/Core-only switcher); `#grammarArea` (empty-state / question card / answer summary, with an in-session score strip at the top). Both are populated by `js/ui/grammar.js`'s `renderGrammarPanel()`, called from `syncLayoutVisibility()` — see that module's header for the full id list (`grammarLessonSelect`, `grammarReviewMissedToggle`, `grammarDifficultyToggle`). |
| ~172–177 | `#cardArea`                               | **Main flashcard mount (vocab only; hidden when `studyMode==='parsing'` or `'grammar'`).** Ships a placeholder `.empty-state` (Hebrew "אבג" + "Tap to choose a session…"); `renderCard()` in `js/ui/render.js` replaces it. |
| ~179–184 | `#navRow`                                 | Prev (`navigate(-1)`) / `#spacedUndoBtn` (`restoreSpacedUndo`) / `#navResetBtn` (`resetCurrentDeck`) / `#navNextBtn` (`handleNavNext` → `navigate(1)`). Vocab only; hidden in Parsing/Grammar mode (each owns its own Next button inside its own summary card). |
| ~186–189 | `#markRow`                                | Hard (`again`) / Uncertain (`pass`) / Easy (`easy`) via `markCard(outcome)`. Vocab only; hidden in Parsing/Grammar mode. |
| ~191–194 | `#ffRow`                                  | Fast-forward 1 day / 1 week (`fastForwardOneDay` / `fastForwardOneWeek`) — advances the SRS clock for testing/catch-up. Vocab only; hidden in Parsing/Grammar mode. |
| ~196–206 | `<section class="review-shell">`          | `#reviewPanel` → `#reviewDeckTag`, `#reviewStats` (confidence/due breakdown + collapsible due-by-day histogram, `buildDueHistogramHtml` in `js/ui/progress.js`), `#reviewSortRow`, `#reviewList`. Vocab only; hidden in Parsing/Grammar mode (each has its own analytics section instead — see `#analyticsParsingCollapse` / `#analyticsGrammarCollapse` below). |
| ~208–210 | `<footer class="app-footer">`             | "Contact author" link (`openContactAuthorModal()`). |

---

## Overlays (199–590) — siblings of `.app`

All use `class="consent-overlay"` + an `aria-hidden` toggle; most nest a
`.consent-modal`/`.analytics-overlay` panel inside. Open/close handlers live
in `js/ui/modals.js` and `js/ui/navigation.js`, wired via `main.js`.

| Lines    | id                            | Purpose |
|---------:|-------------------------------|---------|
| 199–216  | `#transferOverlay`            | Import/export progress (textarea + file picker) — `js/state/persistence.js`. |
| 217–375  | `#analyticsOverlay`           | Progress/analytics dashboard — hero XP/streak, chapter mastery grid, records, stubborn/slipping/most-improved lists, achievements, (Phase 2 PR B) `#analyticsParsingCollapse` (`data-collapse-key="parsingSection"`, `#analyticsParsingBody` — Parsing accuracy/known-status/trend/recent-forms; hidden via inline `style="display:none"` until at least one parsing attempt exists), and (Phase 2 PR C) `#analyticsGrammarCollapse` (`data-collapse-key="grammarSection"`, `#analyticsGrammarBody` — overall accuracy, per-lesson-block accuracy, top-5 weakest concept tags, missed-question count; same hide-until-first-attempt behavior). Rendered by `renderAnalyticsOverlay()` in `js/ui/analytics.js`, which calls each section through its own host hook (`host.renderParsingSection()` / `host.renderGrammarSection()`) wired to `js/ui/parsing.js`'s `renderParsingAnalytics()` / `js/ui/grammar.js`'s `renderGrammarAnalytics()` in `main.js`'s `configureAnalytics(...)` — analytics.js itself never imports parsing.js or grammar.js. Labels read "Lesson N" (not "Chapter N"). |
| 349–374  | `#studySelectorOverlay`       | "Choose session" — the six lesson-range presets (Lessons 1–10 / 11–20 / … / All, `js/data/setMeta.js` `SESSION_WEEK_META`) plus the individual-lesson chapter selector, built by `js/ui/selectors.js`. |
| 375–430  | `#shortcutsOverlay`           | User guide / keyboard shortcuts + the inline **changelog** (see "Changelog" in `CLAUDE.md` for the editing rules). |
| 431–464  | `#consentOverlay`             | First-run disclaimer / consent gate (`initializeConsentGate`, `handleConsentAction`). |
| 465–490  | `#resetSpacedOverlay`         | Scoped reset for spaced-repetition progress (timing-only / full progress / smooth). |
| 491–506  | `#resetStatsOverlay`          | "Reset stats" modal — keep settings vs. reset to first-launch start. |
| 507–528  | `#resetUnspacedOverlay`       | Scoped reset for unspaced marks. |
| 529–540  | `#refreshAvailableOverlay`    | Service-worker "Update available" prompt (`acceptRefreshAvailable`, wired at the bottom of `main.js`). |
| 541–552  | `#toggleInfoOverlay`          | Small modal showing a toggle's own `title` text — surfaced for touch devices where hover tooltips never appear (`showToggleInfo` / `installToggleInfoButtons` in `main.js`). |
| 553–575  | `#contactAuthorOverlay`       | Author contact card. |
| 576–590  | `#installInstructionsOverlay`| PWA "Add to Home Screen" how-to (`js/ui/pwaInstall.js`). |

---

## Script block (~635–641)

```html
<script defer src="js/data/bbh_vocab.js?v=4"></script>
<script defer src="js/data/bbh_reference_data.js?v=4"></script>
<script defer src="js/data/bbh_parsing.js?v=4"></script>
<script defer src="js/data/bbh_grammar.js?v=4"></script>
<script defer src="js/logic/pos_logic.js?v=4"></script>
<script defer src="js/pwa/swUpdate.js?v=4"></script>
<script type="module" src="js/app/main.js?v=4"></script>
```

- **`js/data/bbh_vocab.js`** — classic deferred script, self-registers
  `window.SETS["1".."50"] = {label, type:'lesson', cards}` (generated; never
  hand-edit — see the data-regeneration rule in `CLAUDE.md`).
- **`js/data/bbh_reference_data.js`** — classic deferred script, the
  paradigm/reference data also consumed by `pages/memorization.html`.
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
its header comment), so it needs no `js/domain/*` gates engine. Being
brand-new files, neither `parsing.js` nor `grammar.js` carries any of the
cross-version cache-hazard risk the paragraph above warns about; that risk
applies to *existing* shipped modules' export lists, not new files.

---

## Maintenance

See "Maintenance rules" in `CLAUDE.md` for the full checklist (this doc,
cache-bust, the ES-module hazard, the changelog). In short: if you add,
remove, or rename a section/overlay/id in `index.html`, or change the
script load order, update this file in the same commit.
