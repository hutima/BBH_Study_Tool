# Repository notes for Claude

---

# ⚠ READ FIRST — this repo is a Greek app mid-conversion to Hebrew

**Everything below the "Inherited notes" divider describes the *Greek* app and
is still literally true of the code — none of it has been converted yet.**

## What this repo is

`BBH_Study_Tool` is a Beginning Biblical Hebrew study tool being built by
converting an existing Koine Greek study tool.

- **Base:** verbatim copy of the working tree of
  [`hutima/duff_study_tool`](https://github.com/hutima/duff_study_tool) @ `6f13b00`.
- **Imported as:** commit `1ac74a9` on `claude/biblical-hebrew-study-tool-w3khq0`.
  Upstream git history was **not** carried over (this repo had no commits, so
  the import is a single squashed snapshot). To diff against or pull fixes from
  upstream later, clone it separately — there is no shared ancestry to merge.
- **Target textbook:** John A. Cook & Robert D. Holmstedt, *Beginning Biblical
  Hebrew: A Grammar and Illustrated Reader* (Baker Academic).

## Status as of the last session (2026-08-08)

**Nothing has been converted. The app is 100% Greek.** The only change from
upstream is this CLAUDE.md section. The user paused work here to research how
they want the app restructured, so **do not start bulk conversion without
checking in** — the restructure may change the data model.

Measured conversion surface at import:
- 48 files reference "Greek"/"greek"; 25 reference "Duff"
- ~53k LOC of JS across `js/`
- `CACHE_NAME` is at `greek-flashcards-pwa-v343-github-pages`

## Decisions already made

- **Sequencing follows Cook & Holmstedt.** Its structure (confirmed from the
  publisher's description, *not* from the book itself): **50 short grammar
  lessons** paginated left-to-right, plus a **14-reading illustrated reader**
  bound at the back and paginated right-to-left. This replaces Duff's
  "Ch 0–20 + 8 course weeks" model — the preset-session and chapter-selector
  scheme in `js/data/setMeta.js` will need reshaping, not just relabeling.
- **Phase 1 scope: Vocab + Paradigms only.** Get the alphabet, vocab decks, and
  paradigm reference tables working in Hebrew first. Grammar, Parsing, and
  Reader modes are deferred — hide or stub them rather than shipping Greek
  content under Hebrew labels.

## Open questions — get these from the user before building content

- The lesson-by-lesson breakdown (titles + per-lesson vocab) could **not** be
  obtained. The publisher sites (`bakeracademic.com`, `christianbook.com`) are
  blocked by this environment's egress proxy and `beginningbiblicalhebrew.com`
  did not resolve. Only lessons 2–4 are known secondhand (Vowels, Sheva,
  Dagesh). **This has to come from the user or the book.**
- Whether the 14 reader selections map onto lessons, and how.
- Which text to use for a future Reader mode (WLC / Leningrad?), and whether
  it should be pointed.

## Conversion surface — engine vs. content

**Language-agnostic, should carry over mostly intact:** `js/domain/srs/`,
`js/domain/deck/`, `js/domain/gamification/`, `js/state/`, `js/ui/charts.js`,
`js/ui/analytics.js`, the PWA shell (`sw.js`, `manifest.json`).

**Needs full replacement or rework:**
- `js/data/**` — all vocab, morphology, grammar, reader, paradigms. Wholesale.
- `js/domain/grammar/morph_steps.js` + `js/logic/pos_logic.js` — the Parsing
  walk is built on Greek axes (aspect → tense → voice → mood → person → number
  → case → gender). Hebrew needs a different axis set entirely: stem/binyan,
  conjugation, person/gender/number, state, pronominal suffixes. This is the
  single biggest structural rewrite, and it's deferred to a later phase.
- `js/utils/greekSort.js` — replace with Hebrew alphabetical collation.
- **RTL.** The app is LTR throughout. Hebrew needs `dir="rtl"` handling on card
  faces, reader text, and paradigm tables — and Hebrew vowel points and
  cantillation marks are combining characters, so naive string slicing,
  truncation, and `.length` checks on Hebrew text will corrupt it.
- **Vowel pointing** should probably be a display toggle (pointed / unpointed),
  which is a data-model decision worth settling before writing vocab files.
- **Fonts.** `fonts/` bundles Gentium Plus and Noto Sans in **Latin + Greek
  subsets only — neither has any Hebrew coverage.** Both families need a
  Hebrew-capable replacement (SBL Hebrew, Ezra SIL, Noto Serif/Sans Hebrew,
  Taamey) bundled as woff2 for offline use, and the Serif/Sans font-family
  switch in settings rewired to them.

## Landmines inherited from the base

Read the maintenance rules below before touching `index.html` or module
boundaries — the cache-bust scheme and the ES-module cross-version hazard are
real and have bitten this codebase before. They apply unchanged to this fork.

---

# Inherited notes (from the Greek app — still accurate for the current code)

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
  - the `?v=NNN` cache-bust scheme changes
- Line numbers in the doc are approximate — don't chase a few lines of drift,
  but do refresh them when a section moves significantly.

## Cache-bust

Every asset URL in `index.html` ends in `?v=NNN`. The same number lives in
`sw.js` (`CACHE_NAME` + precache list). Bump both together on release.

### ⚠ ES-module imports are NOT cache-busted — don't break cross-version mixing

The `?v=NNN` only stamps the `<script>`/`<link>` URLs in `index.html`. The
relative `import ... from '../ui/foo.js'` specifiers **inside** the JS modules
carry no `?v=`, so they're fetched bare. During a service-worker update the
browser can momentarily pair a **new** `main.js?v=NNN` (from the network) with an
**old cached** sibling module (the bare import resolves via `ignoreSearch`).
If the new importer references an export the old module doesn't have yet, the
module throws a `SyntaxError` at load → `main.js` never runs → the whole app
freezes (no click handlers, and the update prompt — which lives in `main.js` —
never shows). This is the Safari "frozen on update" failure mode; it would bite
when `PARSING_SHUFFLE_ALL_VALUE` was added as a new `navigation.js` export and
imported into `main.js`.

Rules of thumb when changing module boundaries:
- **Avoid importing a brand-new export across modules** if you can define the
  value locally instead (e.g. a sentinel string constant — keep a mirrored copy
  and a sync comment, as `PARSING_SHUFFLE_ALL_VALUE` now does in both
  `navigation.js` and `main.js`).
- **Never remove an export that an older shipped `main.js` still imports** —
  keep it around (even if unused by the new code) so an old importer paired with
  the new module doesn't `SyntaxError`.
- Runtime wiring (deps objects passed to `configure*(...)`, `GLOBAL_CLICK_HANDLERS`
  / `window` handler assignments) degrades to `undefined`, not a module-load
  `SyntaxError`, so it's safe across versions — prefer it for new cross-module
  hooks.

## Changelog

The user guide's inline changelog (`#shortcutsOverlay` in `index.html`) is a
short, high-level summary for users — **not** a per-commit or per-day log:

- Keep it to a handful (~1–5) of **major release notes**, grouped by theme/era,
  newest first. Don't add a new entry per change or per day — fold edits into
  the most relevant existing entry (and re-consolidate if it's growing too fine).
- Bullets are **short and skimmable**: headline features only. Skip minor
  changes, bug fixes, and internal refactors.
- Only the newest entry carries the `open` attribute.
