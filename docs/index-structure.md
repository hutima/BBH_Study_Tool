# `index.html` structure notes

Navigation map for the root `index.html` (~604 lines, Phase 1 / vocab-only
BBH build). Keep this in sync when you change the file — see "Maintenance
rules" in `CLAUDE.md`.

Line numbers are approximate (drift a few lines between edits). When in
doubt, grep for the `id` rather than trusting a line number.

---

## Top-level layout

```
1    <!DOCTYPE html> / <head>          ← gtag, pre-paint theme bootstrap, manifest/icons, stylesheet
51   <body>
52     <div class="app">               ← main shell (in-flow UI, everything that scrolls)
206    overlays (modals)               ← siblings of .app, position:fixed, shown/hidden by JS
598    <script> block                  ← classic data scripts + pos_logic.js shim + main.js module
604  </body>
```

Every `<div class="consent-overlay" …>` is a top-level sibling of `.app` —
never nest a new overlay inside `.app`.

---

## `<head>` (1–50)

- 10    Google Analytics `gtag.js` tag. **Property id `G-YH11KQB6QX` still
        belongs to the old Greek app** — flagged in `CLAUDE.md` for the owner
        to swap for a BBH-specific property. It fails to load in sandboxed
        test environments (blocked network request); that failure is
        expected and not a regression.
- 11–26 **Pre-paint inline script.** Reads `localStorage` and sets
        `data-theme` / `data-font-family` / `data-text-size` on `<html>`
        before first paint to avoid a flash of the wrong theme. Don't move
        this below the stylesheet link.
- 27–49 PWA / icon / manifest `<meta>` tags.
- `<link rel="stylesheet" href="styles.css?v=1">`

> Cache-bust: every asset URL ends in `?v=1`. Bump the number on release
> (see "Cache-bust" in `CLAUDE.md`). The same number lives in `sw.js`
> (`CACHE_NAME` + `APP_SHELL_PATHS`) — both must agree, and
> `tools/check_release.mjs` enforces it.

---

## `<div class="app">` (52–204)

In-document order:

| Lines    | Element                                  | Notes |
|---------:|-------------------------------------------|-------|
| 54–65    | `<header>`                                | Theme switcher (System/Dark/Light), `<h1>Beginning Biblical Hebrew</h1>`, `#appSubtitle` (always "Vocabulary Flashcards" — `getModeDescription()` in `main.js`), `.wycliffe` unofficial-study-aid line naming Cook & Holmstedt / Baker Academic. |
| 67–70    | `.notice-row`                             | "Study aid notice" button (`showDisclaimerModal()`) + `#appNotice`. |
| 72–80    | `.quick-start`                            | Choose session / Start studying / `.mode-group` (single `#modeShortcutVocabBtn` — vocab is the only study mode in Phase 1, Grammar/Parsing/Reader are not in the DOM at all) / Progress / User guide / `#modeShortcutMemorizationBtn` link to `pages/memorization.html` ("Reference"). |
| 82       | `.ornament`                               | Decorative `✦ · · · ✦`. |
| 84–142   | `<details id="advancedSettingsDetails">`  | "Advanced review settings". Contains `.display-prefs` (Font Serif/Sans, Text size Medium/Large/X-Large, **Vowel points** Pointed/Unpointed — `setShowPoints`, `js/utils/hebrewText.js` `stripHebrewPoints` — and **Transliteration** Show/Hide — `setShowTranslit`), then `#controlsBar` (see below), then the always-open `#progressToolsGroup` frame (Export/Import progress buttons, `exportProgressJson` / `triggerImportProgress`). |
| 110–133  | └ `#controlsBar`                          | Six toggles, each `installToggleInfoButtons()`-injected with a small `(i)` info button: `#shuffleToggle` (`toggleShuffle`), `#hardReviewToggle` (`toggleHardVocabReview` — drills cards missed 10+ times, confidence < 40%), `#directionToggle` (`toggleDirection`, "English → Hebrew" label — `runtime.directionToGreek` is the underlying field name, kept for the SRS/mark-store key scheme, see `CLAUDE.md`), `#spacedToggle` (`toggleSpacedRepetition`), `#cadenceToggle` ("2-month pace", `toggleSpacingCadence`, inverted: ON = 2-month intensive preset, OFF = default 8-month relaxed preset — `js/domain/srs/constants.js` `SRS_CADENCE_PRESETS`), `#unspacedDailyResetToggle` (`toggleUnspacedDailyReset`, 5 AM local daily archive-clear). No "Required only"/starred-vocab toggle — all 191 BBH cards are `required: true` (see conversion plan decision 5); no split vocab/grammar selection, no per-dim/parsing toggles — those DOM sections were removed with Grammar/Parsing in Task 2. |
| 143–150  | `<details id="resetActionsDetails">`      | "Reset actions" — a sibling `<details>` after `#advancedSettingsDetails`, not nested inside it. Reshuffle (`reshuffleEligible`), Reset deck (`#resetDeckBtn` → `resetCurrentDeck`), Reset stats (`openResetStatsModal`). |
| 152–157  | `#cardArea`                               | **Main flashcard mount.** Ships a placeholder `.empty-state` (Hebrew "אבג" + "Tap to choose a session…"); `renderCard()` in `js/ui/render.js` replaces it. |
| 159–164  | `#navRow`                                 | Prev (`navigate(-1)`) / `#spacedUndoBtn` (`restoreSpacedUndo`) / `#navResetBtn` (`resetCurrentDeck`) / `#navNextBtn` (`handleNavNext` → `navigate(1)`). |
| 166–169  | `#markRow`                                | Hard (`again`) / Uncertain (`pass`) / Easy (`easy`) via `markCard(outcome)`. |
| 171–174  | `#ffRow`                                  | Fast-forward 1 day / 1 week (`fastForwardOneDay` / `fastForwardOneWeek`) — advances the SRS clock for testing/catch-up. |
| 176–186  | `<section class="review-shell">`          | `#reviewPanel` → `#reviewDeckTag`, `#reviewStats` (confidence/due breakdown + collapsible due-by-day histogram, `buildDueHistogramHtml` in `js/ui/progress.js`), `#reviewSortRow`, `#reviewList`. |
| 188–190  | `<footer class="app-footer">`             | "Contact author" link (`openContactAuthorModal()`). |

---

## Overlays (206–597) — siblings of `.app`

All use `class="consent-overlay"` + an `aria-hidden` toggle; most nest a
`.consent-modal`/`.analytics-overlay` panel inside. Open/close handlers live
in `js/ui/modals.js` and `js/ui/navigation.js`, wired via `main.js`.

| Lines    | id                            | Purpose |
|---------:|-------------------------------|---------|
| 206–223  | `#transferOverlay`            | Import/export progress (textarea + file picker) — `js/state/persistence.js`. |
| 224–355  | `#analyticsOverlay`           | Progress/analytics dashboard — hero XP/streak, chapter mastery grid, records, stubborn/slipping/most-improved lists, achievements. Rendered by `renderAnalyticsOverlay()` in `js/ui/analytics.js`. Labels read "Lesson N" (not "Chapter N") and there is no Grammar section — vocab-only. |
| 356–381  | `#studySelectorOverlay`       | "Choose session" — the six lesson-range presets (Lessons 1–10 / 11–20 / … / All, `js/data/setMeta.js` `SESSION_WEEK_META`) plus the individual-lesson chapter selector, built by `js/ui/selectors.js`. |
| 382–437  | `#shortcutsOverlay`           | User guide / keyboard shortcuts + the inline **changelog** (see "Changelog" in `CLAUDE.md` for the editing rules). |
| 438–471  | `#consentOverlay`             | First-run disclaimer / consent gate (`initializeConsentGate`, `handleConsentAction`). |
| 472–497  | `#resetSpacedOverlay`         | Scoped reset for spaced-repetition progress (timing-only / full progress / smooth). |
| 498–513  | `#resetStatsOverlay`          | "Reset stats" modal — keep settings vs. reset to first-launch start. |
| 514–535  | `#resetUnspacedOverlay`       | Scoped reset for unspaced marks. |
| 536–547  | `#refreshAvailableOverlay`    | Service-worker "Update available" prompt (`acceptRefreshAvailable`, wired at the bottom of `main.js`). |
| 548–559  | `#toggleInfoOverlay`          | Small modal showing a toggle's own `title` text — surfaced for touch devices where hover tooltips never appear (`showToggleInfo` / `installToggleInfoButtons` in `main.js`). |
| 560–582  | `#contactAuthorOverlay`       | Author contact card. |
| 583–597  | `#installInstructionsOverlay`| PWA "Add to Home Screen" how-to (`js/ui/pwaInstall.js`). |

---

## Script block (598–602)

```html
<script defer src="js/data/bbh_vocab.js?v=1"></script>
<script defer src="js/data/bbh_reference_data.js?v=1"></script>
<script defer src="js/logic/pos_logic.js?v=1"></script>
<script type="module" src="js/app/main.js?v=1"></script>
```

- **`js/data/bbh_vocab.js`** — classic deferred script, self-registers
  `window.SETS["1".."50"] = {label, type:'lesson', cards}` (generated; never
  hand-edit — see the data-regeneration rule in `CLAUDE.md`).
- **`js/data/bbh_reference_data.js`** — classic deferred script, the
  paradigm/reference data also consumed by `pages/memorization.html`.
- **`js/logic/pos_logic.js`** — classic deferred script, NOT a module. A
  small shim (`stableCardKey`) kept for legacy-id-map back-compat; see its
  own header comment. Loaded as a global (not imported) so it must stay a
  classic script, not converted to an ES module, without also updating every
  `typeof window.stableCardKey === 'function'` call site.
- **`js/app/main.js`** — the only `type="module"` script; every other JS
  file is reached via its (or its dependencies') static `import` graph. See
  the "Cache-bust" and "ES-module cross-version import hazard" rules in
  `CLAUDE.md` before adding or removing an export here — this hazard is
  **active again** starting with this v1 release (previous BBH-conversion
  commits were pre-launch, so it didn't apply yet).

`js/data/setMeta.js` (lesson titles + `SESSION_WEEK_META` range presets) is
**not** a classic script tag — it's pulled in only through `main.js`'s
`import { SESSION_WEEK_META } from '../data/setMeta.js'`.

---

## Maintenance

See "Maintenance rules" in `CLAUDE.md` for the full checklist (this doc,
cache-bust, the ES-module hazard, the changelog). In short: if you add,
remove, or rename a section/overlay/id in `index.html`, or change the
script load order, update this file in the same commit.
