# `index.html` structure notes

Navigation map for the root `index.html` (~733 lines, PR H build — Vocabulary
+ Parsing + Grammar Quiz + Reader + Lesson 0A Alphabet + Lesson 0B Vowel
marks). Keep this in sync when you change the file — see "Maintenance rules"
in `CLAUDE.md`.

Line numbers are approximate (drift a few lines between edits). When in
doubt, grep for the `id` rather than trusting a line number.

---

## Top-level layout

```
1    <!DOCTYPE html> / <head>          ← pre-paint theme bootstrap, manifest/icons, stylesheet
44   <body>
45     <div class="app">               ← main shell (in-flow UI, everything that scrolls)
227    overlays (modals)               ← siblings of .app, position:fixed, shown/hidden by JS
713    <script> block                  ← classic data scripts + pos_logic.js shim + main.js module
722  </body>
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
- `<link rel="stylesheet" href="styles.css?v=8">` (line 19)

> Cache-bust: every asset URL ends in `?v=6`. Bump the number on release
> (see "Cache-bust" in `CLAUDE.md`). The same number lives in `sw.js`
> (`CACHE_NAME` + `APP_SHELL_PATHS`) — both must agree, and
> `tools/check_release.mjs` enforces it.

---

## `<div class="app">` (45–225)

In-document order:

| Lines    | Element                                  | Notes |
|---------:|-------------------------------------------|-------|
| 47–58    | `<header>`                                | Theme switcher (System/Dark/Light), `<h1>Beginning Biblical Hebrew</h1>`, `#appSubtitle` (always "Vocabulary Flashcards" — `getModeDescription()` in `main.js`), `.wycliffe` unofficial-study-aid line naming Cook & Holmstedt / Baker Academic. |
| 60–63    | `.notice-row`                             | "Study aid notice" button (`showDisclaimerModal()`) + `#appNotice`. |
| 65–74    | `.quick-start`                            | Choose session / Start studying / `.mode-group` (`#modeShortcutVocabBtn` + `#modeShortcutParsingBtn` + `#modeShortcutGrammarBtn` + `#modeShortcutReaderBtn`, all `onclick="setStudyMode(...)"`) / Progress / User guide / `#modeShortcutMemorizationBtn` link to `pages/memorization.html` ("Reference"). |
| 76       | `.ornament`                               | Decorative `✦ · · · ✦`. |
| 78–146   | `<details id="advancedSettingsDetails">`  | "Advanced review settings" — **vocab-only; hidden when `studyMode==='parsing'` or `'grammar'`** (`syncLayoutVisibility()` in `js/app/main.js`). Contains `.display-prefs` (Font Serif/Sans, Text size Medium/Large/X-Large, **Vowel points** Pointed/Unpointed — `setShowPoints`, `js/utils/hebrewText.js` `stripHebrewPoints` — and **Transliteration** Show/Hide — `setShowTranslit`), then `#controlsBar` (see below), then the always-open `#progressToolsGroup` frame (Export/Import progress buttons, `exportProgressJson` / `triggerImportProgress`). |
| 104–137  | └ `#controlsBar`                          | Six toggles, each `installToggleInfoButtons()`-injected with a small `(i)` info button: `#shuffleToggle` (`toggleShuffle`), `#hardReviewToggle` (`toggleHardVocabReview` — drills cards missed 10+ times, confidence < 40%), `#directionToggle` (`toggleDirection`, "English → Hebrew" label — `runtime.directionToGreek` is the underlying field name, kept for the SRS/mark-store key scheme, see `CLAUDE.md`), `#spacedToggle` (`toggleSpacedRepetition`), `#cadenceToggle` ("2-month pace", `toggleSpacingCadence`, inverted: ON = 2-month intensive preset, OFF = default 8-month relaxed preset — `js/domain/srs/constants.js` `SRS_CADENCE_PRESETS`), `#unspacedDailyResetToggle` (`toggleUnspacedDailyReset`, 5 AM local daily archive-clear). No "Required only"/starred-vocab toggle — all 209 BBH cards are `required: true` (see conversion plan decision 5); no split vocab/grammar selection. |
| 150–157  | `<details id="resetActionsDetails">`      | "Reset actions" — a sibling `<details>` after `#advancedSettingsDetails`, not nested inside it. **Vocab-only; hidden when `studyMode==='parsing'` or `'grammar'`.** Reshuffle (`reshuffleEligible`), Reset deck (`#resetDeckBtn` → `resetCurrentDeck`), Reset stats (`openResetStatsModal`). |
| 159–165  | `<section id="parsingSection">`           | **Phase 2 PR B; scope/mobile redesign in PR G; SCOPE/DIRECTION/lesson-row restyle in PR H item 7.** Hidden (`style="display:none"`) unless `studyMode==='parsing'`; toggled by the same `syncLayoutVisibility()` branch that hides the vocab sections above/below it (and `#grammarSection`, below). `<details id="parsingOptionsDetails">` wraps `#parsingOptionsPanel` — a primary bar (`parsingLessonSelect`, single row at every width — PR H item 7c; `#parsingScopeControl`, a `.parsing-scope-grid` 2-column grid of `.parsing-scope-card` buttons — PR H item 7a, same visual pattern as the study-selector's session/preset cards, replacing the old `.theme-switcher` pill — for Focused/`Root journey`/`By feature`/Shuffle/Custom scope, the Root card disabled with an "unlocks at Lesson N" title until 2+ in-gate paradigms share a root; the active mode's own inline `<select>` picker — `parsingParadigmSelect` (Focused), `parsingRootSelect` (labeled "Root (verbs)") + a "Drill this root" button (Root — also renders a `.parsing-journey-map` line inside `#parsingArea`, not here), `parsingFeatureDimSelect` + checkbox value list (By feature), `#parsingCustomSetList` (Custom, unwrapped — no separate enable toggle now that Custom is a scope-control mode); `parsingDirectionToggle`, a `.theme-switcher.parsing-direction-pill` capped to `max-width:22rem` and left-aligned under its own label — PR H item 7b, segments relabeled Parse/Build/Mixed, "Build the Form" full name moved to the user guide) plus a collapsed-by-default `<details id="parsingMoreOptionsDetails">` ("More options": `parsingExcludeKnownToggle`, `parsingAppendixToggle`, `parsingDim<Name>Toggle` ×7, `parsingResetKnownBtn`, `parsingClearStatsBtn`) whose open state persists at `runtime.parsing.optionsOpen` via `ontoggle` (no re-render — see `js/ui/parsing.js`'s render-split header comment); `#parsingArea` (empty-state / journey-map + step-walk / Build-choices / summary). Both `#parsingOptionsPanel` and `#parsingArea` are populated by `js/ui/parsing.js`'s `renderParsingPanel()`, called from `syncLayoutVisibility()` — but answering a card only ever re-renders `#parsingArea` (never the options panel), so the More-options/custom-group collapse state survives every card answer. See that module's header for the full id list and the `runtime.parsing.rootFilter`/`dimValueFilter`/`journeyIndex` scope-state fields (additive, `PROGRESS_EXPORT_VERSION` unchanged). |
| 167–173  | `<section id="grammarSection">`           | **Phase 2 PR C.** Hidden (`style="display:none"`) unless `studyMode==='grammar'`; toggled by the same `syncLayoutVisibility()` branch. `<details id="grammarOptionsDetails">` wraps `#grammarOptionsPanel` (lesson select, Review-missed toggle, Difficulty All/Core-only switcher); `#grammarArea` (empty-state / question card / answer summary, with an in-session score strip at the top — `.grammar-area` is a COLUMN flex container, PR H item 4 fix: it used to default to a row, squeezing the score strip and card side-by-side and overlapping at phone widths). Both are populated by `js/ui/grammar.js`'s `renderGrammarPanel()`, called from `syncLayoutVisibility()` — see that module's header for the full id list (`grammarLessonSelect`, `grammarReviewMissedToggle`, `grammarDifficultyToggle`). |
| 175–182  | `<section id="readerSection">`            | **Phase 2 PR D.** Hidden (`style="display:none"`) unless `studyMode==='reader'`; toggled by the same `syncLayoutVisibility()` branch. `<details id="readerOptionsDetails">` wraps `#readerOptionsPanel` (lesson select 1–50, Strict-only/Strict+Guided tier toggle); `#readerArea` (passage list grouped by gate-lesson bucket, or the single-passage reading view with tappable tokens + inline word-detail popover); `#readerAttribution` (required CC BY 4.0 line, always visible under the area). All three are populated by `js/ui/reader.js`'s `renderReaderPanel()`, called from `syncLayoutVisibility()` — see that module's header for the full id list and the morphology-code decoder. Reads `window.BBH_READER` (52 curated OSHB passages). |
| 184–190  | `#cardArea`                               | **Main flashcard mount (vocab only; hidden when `studyMode` is `'parsing'`, `'grammar'`, or `'reader'`).** Ships a placeholder `.empty-state` (Hebrew "אבג" + "Tap to choose a session…"); `renderCard()` in `js/ui/render.js` replaces it. |
| 191–197  | `#navRow`                                 | Prev (`navigate(-1)`) / `#spacedUndoBtn` (`restoreSpacedUndo`) / `#navResetBtn` (`resetCurrentDeck`) / `#navNextBtn` (`handleNavNext` → `navigate(1)`). Vocab only; hidden in Parsing/Grammar/Reader mode (each owns its own in-section navigation instead). |
| 198–203  | `#markRow`                                | Hard (`again`) / Uncertain (`pass`) / Easy (`easy`) via `markCard(outcome)`. Vocab only; hidden in Parsing/Grammar/Reader mode by `syncLayoutVisibility()` — `js/ui/render.js`'s `renderCard()` also bails out early for any non-vocab `runtime.studyMode` before it would otherwise reset this row's `display` itself (PR H item 5 fix: a mode-agnostic `renderCard()` call site, e.g. picking a session from the selector, used to undo `syncLayoutVisibility()`'s hide and leak the row into Parsing/Grammar/Reader). |
| 204–208  | `#ffRow`                                  | Fast-forward 1 day / 1 week (`fastForwardOneDay` / `fastForwardOneWeek`) — advances the SRS clock for testing/catch-up. Vocab only; hidden in Parsing/Grammar/Reader mode. |
| 209–219  | `<section class="review-shell">`          | `#reviewPanel` → `#reviewDeckTag`, `#reviewStats` (confidence/due breakdown + collapsible due-by-day histogram, `buildDueHistogramHtml` in `js/ui/progress.js`), `#reviewSortRow`, `#reviewList`. Vocab only; hidden in Parsing/Grammar/Reader mode (each has its own analytics section instead — see `#analyticsParsingCollapse` / `#analyticsGrammarCollapse` / `#analyticsReaderCollapse` below). |
| 221–223  | `<footer class="app-footer">`             | "Contact author" link (`openContactAuthorModal()`). |
| —        | (Lesson 0A/0B)                            | Has NO row in `.app` — its two entry points (`.alphabet-lesson0-section`, one button per deck: `openAlphabetOverlay('letters')` for 0A, `openAlphabetOverlay('vowels')` for 0B) live inside `#studySelectorOverlay` below, and the one shared overlay (`#alphabetOverlay`) is a sibling of `.app`, not a section within it — see `js/ui/alphabet.js`'s `deckKind` module state (PR H item 3). |

---

## Overlays (199–590) — siblings of `.app`

All use `class="consent-overlay"` + an `aria-hidden` toggle; most nest a
`.consent-modal`/`.analytics-overlay` panel inside. Open/close handlers live
in `js/ui/modals.js` and `js/ui/navigation.js`, wired via `main.js`.

| Lines    | id                            | Purpose |
|---------:|-------------------------------|---------|
| 227–244  | `#transferOverlay`            | Import/export progress (textarea + file picker) — `js/state/persistence.js`. |
| 245–415  | `#analyticsOverlay`           | Progress/analytics dashboard — hero XP/streak, chapter mastery grid, records, stubborn/slipping/most-improved lists, achievements, (Phase 2 PR B) `#analyticsParsingCollapse` (`data-collapse-key="parsingSection"`, `#analyticsParsingBody` — Parsing accuracy/known-status/trend/recent-forms; hidden via inline `style="display:none"` until at least one parsing attempt exists), (Phase 2 PR C) `#analyticsGrammarCollapse` (`data-collapse-key="grammarSection"`, `#analyticsGrammarBody` — overall accuracy, per-lesson-block accuracy, top-5 weakest concept tags, missed-question count; same hide-until-first-attempt behavior), and (Phase 2 PR D) `#analyticsReaderCollapse` (`data-collapse-key="readerSection"`, `#analyticsReaderBody` — passages read in the current lesson/tier scope vs. total, passages read overall, review-marks count; hidden until at least one passage is read or one token is marked). Rendered by `renderAnalyticsOverlay()` in `js/ui/analytics.js`, which calls each section through its own host hook (`host.renderParsingSection()` / `host.renderGrammarSection()` / `host.renderReaderSection()`) wired to `js/ui/parsing.js`'s `renderParsingAnalytics()` / `js/ui/grammar.js`'s `renderGrammarAnalytics()` / `js/ui/reader.js`'s `renderReaderAnalytics()` in `main.js`'s `configureAnalytics(...)` — analytics.js itself never imports parsing.js, grammar.js, or reader.js. Note: Lesson 0 Alphabet has NO analytics section anywhere in this overlay — see `js/ui/alphabet.js`'s header. Labels read "Lesson N" (not "Chapter N"). |
| 416–447  | `#studySelectorOverlay`       | "Choose session" — a `.alphabet-lesson0-section` block with TWO rows (**"Lesson 0A · Alphabet"** button, `onclick="openAlphabetOverlay('letters')"`, and **"Lesson 0B · Vowel marks"** button, `onclick="openAlphabetOverlay('vowels')"` — PR H item 3) sits ABOVE "Deselect all", visually separated and NOT part of `selectedKeys`/presets/vocab counts (see `js/ui/alphabet.js`), then "All Lessons" + 13 "Unit" reading-block presets — 14 keys total, the five decade-range presets were removed by PR H item 1 (`js/data/setMeta.js` `SESSION_WEEK_META`, all in one `#sessionsGrid`) — plus the individual-lesson chapter selector (`#chaptersGrid`), built by `js/ui/selectors.js`. |
| 448–474  | `#alphabetOverlay`            | **Phase 2 PR E; split into two decks + rating-row restyle by PR H items 2–3.** Lesson 0A Alphabet / 0B Vowel marks practice — one shared standalone overlay (flip card, `#alphabetMarkRow` reusing the vocab card's own `.mark-row`/`.mark-btn`/`.mark-again`/`.mark-easy` classes for Again/Got it, Shuffle, progress line, reset link, plus `#alphabetShevaFooter` — a small always-visible shəva-rules reference card shown only in 0B), entirely owned by `js/ui/alphabet.js` (its own open/close functions, not `modals.js`). `#alphabetOverlayLabel`/`#alphabetOverlayTitle` swap text between "Lesson 0A"/"Alphabet practice" and "Lesson 0B"/"Vowel marks practice" based on which deck is open. See that module's header for the isolation rules. |
| 473–528  | `#shortcutsOverlay`           | User guide / keyboard shortcuts, with a subsection per mode (Vocabulary incl. Lesson 0 + Units, Parsing, Grammar, Reader) + the inline **changelog** (see "Changelog" in `CLAUDE.md` for the editing rules). |
| 551–583  | `#consentOverlay`             | First-run disclaimer / consent gate (`initializeConsentGate`, `handleConsentAction`) — includes the on-device-storage privacy line. |
| 586–611  | `#resetSpacedOverlay`         | Scoped reset for spaced-repetition progress (timing-only / full progress / smooth). |
| 612–627  | `#resetStatsOverlay`          | "Reset stats" modal — keep settings vs. reset to first-launch start. |
| 628–649  | `#resetUnspacedOverlay`       | Scoped reset for unspaced marks. |
| 650–661  | `#refreshAvailableOverlay`    | Service-worker "Update available" prompt (`acceptRefreshAvailable`, wired at the bottom of `main.js`). |
| 662–673  | `#toggleInfoOverlay`          | Small modal showing a toggle's own `title` text — surfaced for touch devices where hover tooltips never appear (`showToggleInfo` / `installToggleInfoButtons` in `main.js`). |
| 674–696  | `#contactAuthorOverlay`       | Author contact card. |
| 697–     | `#installInstructionsOverlay`| PWA "Add to Home Screen" how-to (`js/ui/pwaInstall.js`). |

---

## Script block (~713–721)

```html
<script defer src="js/data/bbh_vocab.js?v=8"></script>
<script defer src="js/data/bbh_reference_data.js?v=8"></script>
<script defer src="js/data/bbh_parsing.js?v=8"></script>
<script defer src="js/data/bbh_grammar.js?v=8"></script>
<script defer src="js/data/bbh_reader.js?v=8"></script>
<script defer src="js/data/bbh_alphabet.js?v=8"></script>
<script defer src="js/logic/pos_logic.js?v=8"></script>
<script defer src="js/pwa/swUpdate.js?v=8"></script>
<script type="module" src="js/app/main.js?v=8"></script>
```

- **`js/data/bbh_vocab.js`** — classic deferred script, self-registers
  `window.SETS["1".."50"] = {label, type:'lesson', cards}` (generated; never
  hand-edit — see the data-regeneration rule in `CLAUDE.md`).
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
Alphabet + 0B Vowel marks by PR H item 3) is likewise not a classic script
tag — it's a brand-new ES module reached only through `main.js`'s
`import { configureAlphabet, ... } from '../ui/alphabet.js'`.
Strictest isolation of any UI module so far: it imports NOTHING at all, not
even a gates helper — there's no lesson gating in Lesson 0, all 23 letters
(and all 12 vowels) are always available. Module-local `deckKind` ('letters'
or 'vowels') picks which of `window.BBH_ALPHABET`'s two arrays and which of
`runtime.alphabet`'s two subtrees (`letters`/`vowels`) the shared render/
mark/shuffle functions read — see `openAlphabetOverlay(kind)`. It owns its
OWN overlay open/close
(`openAlphabetOverlay`/`closeAlphabetOverlay`/`isAlphabetOverlayOpen`),
unlike every other overlay in the table above, which go through
`js/ui/modals.js`. `js/ui/keyboard.js` wires its Escape-to-close and its
`isAlphabetOverlayOpen`/`closeAlphabetOverlay` params are `typeof`-guarded
the same way `isInstallInstructionsOpen` is, for the same SW cross-version
reason. Being a brand-new file, it carries none of the cross-version
cache-hazard risk either.

---

## Maintenance

See "Maintenance rules" in `CLAUDE.md` for the full checklist (this doc,
cache-bust, the ES-module hazard, the changelog). In short: if you add,
remove, or rename a section/overlay/id in `index.html`, or change the
script load order, update this file in the same commit.
