# Repository notes for Claude

---

# Status: Phase 1 (Vocab + Reference) conversion COMPLETE — as of 2026-08-08

`BBH_Study_Tool` is a Beginning Biblical Hebrew study tool, converted from an
existing Koine Greek study tool
([`hutima/duff_study_tool`](https://github.com/hutima/duff_study_tool) @
`6f13b00`, imported as commit `1ac74a9`). **The Greek→Hebrew conversion for
Phase 1 (Vocabulary + Reference) is done on this branch**: the live app is a
Hebrew vocabulary flashcard PWA for lessons 1–50 of John A. Cook & Robert D.
Holmstedt, *Beginning Biblical Hebrew: A Grammar and Illustrated Reader*
(Baker Academic), plus a static Reference page. Grammar, Parsing, and a
Reader mode were part of the inherited Greek app and remain **deferred** —
see "Deferred work" below.

For the task-by-task history of how this was built (generator → shell prune →
Hebrew presentation → reference page → state/export → this checks/docs pass),
see `docs/bbh-conversion-plan.md`. For known content gaps in the Reference
page (paradigms the source guide only partially prints), see
`docs/bbh-content-gaps.md`.

## What's live right now

- **Data:** `js/data/bbh_vocab.js` (50 lessons, 191 cards, generated from
  `source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv`) and
  `js/data/bbh_reference_data.js` / `js/data/setMeta.js` (generated from
  `source/bbh/Beginning_Biblical_Hebrew_Revision_Guide.md`).
- **Study modes:** Vocabulary only. `runtime.studyMode` is locked to
  `'vocab'` (`normalizeStudyMode()` in `js/app/main.js` always returns
  `'vocab'`; `isVocabOnlyProfile()` always returns `true`) — Grammar,
  Parsing, and Reader are not reachable from the UI, and their code paths
  have been **excised from the live module graph** (not just hidden), per
  the Task 6 cleanup in `docs/bbh-conversion-plan.md`.
- **Presentation:** RTL Hebrew card faces (`dir="rtl" lang="he"`), a
  pointed/unpointed vowel-points toggle, a transliteration show/hide toggle,
  Hebrew alphabetical sort (`js/utils/hebrewText.js`), and bundled Noto
  Serif/Sans Hebrew webfonts (`fonts/`, OFL-licensed).
- **State/export:** storage key `bbhStudyToolStateV1` (+ `bbhStudyTool*` aux
  keys), export format id `bbh-study-tool-progress-export`. No migration
  from the old Greek-app storage keys — this is treated as a fresh install.
- **PWA:** `CACHE_NAME` = `bbh-flashcards-pwa-v1-github-pages`, all asset
  URLs at `?v=1`.
- **Checks:** `node tools/validate_bbh_data.mjs` (data-shape checks) and
  `node tools/check_release.mjs` (consolidated release gate — precache
  paths, single `?v=` value, zero Greek Unicode / zero duff-koine-
  greekFlashcards in the live load graph, 50-lesson/191-card count,
  `source/bbh/` untouched). Run both before tagging a release.

## Data-regeneration rule

**Never hand-edit the generated files** `js/data/bbh_vocab.js`,
`js/data/bbh_reference_data.js`, or `js/data/setMeta.js`. They are
deterministic output of `tools/gen_bbh_data.mjs`. To change vocabulary,
lesson titles, or reference content: edit the source file under
`source/bbh/` (the two files there are the **authoritative, user-supplied**
content — never generate into or hand-massage them from tooling), then run:

```sh
node tools/gen_bbh_data.mjs
```

Regenerating with no source changes should be a no-op
(`git diff --exit-code js/data/`).

## Deferred work

- **Hebrew Grammar/Parsing.** The inherited Greek Parsing walk was built on
  Greek axes (aspect → tense → voice → mood → person → number → case →
  gender). Hebrew needs a different axis set entirely — stem/binyan,
  conjugation, person/gender/number, state, pronominal suffixes. This is a
  from-scratch design, not a port, and has no code to build on now that the
  Greek Parsing/Grammar module graph has been removed (Task 6).
- **Reader mode** over primary Hebrew text (WLC / Leningrad?, pointed or
  not?) — not started; the old Greek Reader UI/code is gone.
- **Full paradigm tables** — `pages/memorization.html` only prints paradigms
  that are complete in `source/bbh/Beginning_Biblical_Hebrew_Revision_Guide.md`
  (pronouns, לְ-possession, Qal Perfect singular, interrogatives). Anything
  the guide only partially prints (full alphabet chart, complete Qal
  Imperfect, binyan pattern tables) needs verification against the physical
  textbook before it can be added — see `docs/bbh-content-gaps.md`.
- **Google Analytics property id.** `index.html`'s `gtag` snippet
  (`G-YH11KQB6QX`) still points at the predecessor Greek app's GA property.
  Flagged for the repo owner to swap in a BBH-specific property id.

## Navigation

- **`index.html` structure:** see `docs/index-structure.md` before scanning
  the file. It maps the in-flow `.app` shell, the overlay siblings, and the
  script groups by line range and `id`.

## Maintenance rules

- **Keep `docs/index-structure.md` in sync.** If you edit `index.html` and
  any of the following change, update the doc in the same commit:
  - a section in `.app` is added, removed, reordered, or renamed
  - an overlay (`consent-overlay`) is added or removed
  - an `id` referenced by JS is added, removed, or renamed
  - the script load order / grouping changes
  - the `?v=N` cache-bust scheme changes
- Line numbers in the doc are approximate — don't chase a few lines of drift,
  but do refresh them when a section moves significantly.

## Cache-bust

Every asset URL in `index.html` ends in `?v=1`. The same number lives in
`sw.js` (`CACHE_NAME` + `APP_SHELL_PATHS`). Bump both together on release —
`tools/check_release.mjs` checks that exactly one `?v=` value is in use and
that it's reflected in `CACHE_NAME`.

### ⚠ ES-module imports are NOT cache-busted — this hazard is ACTIVE again

This rule didn't constrain the BBH-conversion commits themselves (pre-launch,
no shipped clients yet), but **now that v1 has shipped, it applies to every
future release** exactly as it did in the inherited Greek app:

The `?v=N` only stamps the `<script>`/`<link>` URLs in `index.html`. The
relative `import ... from '../ui/foo.js'` specifiers **inside** the JS modules
carry no `?v=`, so they're fetched bare. During a service-worker update the
browser can momentarily pair a **new** `main.js?v=N` (from the network) with an
**old cached** sibling module (the bare import resolves via `ignoreSearch`).
If the new importer references an export the old module doesn't have yet, the
module throws a `SyntaxError` at load → `main.js` never runs → the whole app
freezes (no click handlers, and the update prompt — which lives in `main.js` —
never shows). This is the Safari "frozen on update" failure mode.

Rules of thumb when changing module boundaries:
- **Avoid importing a brand-new export across modules** if you can define the
  value locally instead (e.g. a sentinel string constant — keep a mirrored copy
  and a sync comment in both places).
- **Never remove an export that an older shipped `main.js` still imports** —
  keep it around (even if unused by the new code) so an old importer paired with
  the new module doesn't `SyntaxError`.
- Runtime wiring (deps objects passed to `configure*(...)`, `GLOBAL_CLICK_HANDLERS`
  / `window` handler assignments) degrades to `undefined` (or a module's own
  no-op default in its `host` object), not a module-load `SyntaxError`, so
  it's safe across versions — prefer it for new cross-module hooks.

## Changelog

The user guide's inline changelog (`#shortcutsOverlay` in `index.html`) is a
short, high-level summary for users — **not** a per-commit or per-day log:

- Keep it to a handful (~1–5) of **major release notes**, grouped by theme/era,
  newest first. Don't add a new entry per change or per day — fold edits into
  the most relevant existing entry (and re-consolidate if it's growing too fine).
- Bullets are **short and skimmable**: headline features only. Skip minor
  changes, bug fixes, and internal refactors.
- Only the newest entry carries the `open` attribute.
