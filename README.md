# BBH Study Tool

An **unofficial** vocabulary flashcard and reference PWA for John A. Cook &
Robert D. Holmstedt, *Beginning Biblical Hebrew: A Grammar and Illustrated
Reader* (Baker Academic). It is a student-made study aid, not affiliated
with or endorsed by the authors or publisher — always verify against the
textbook and your course materials.

This app began as a fork of a Koine Greek study tool
([`hutima/duff_study_tool`](https://github.com/hutima/duff_study_tool)) and
was converted to Hebrew. See `CLAUDE.md` for the conversion history and
`docs/bbh-conversion-plan.md` for the task-by-task ledger.

## Phase 1 scope: Vocabulary + Reference

The app currently covers:

- **Flashcards** for all 191 vocabulary entries across the book's 50 lessons
  (11 lessons introduce no new vocabulary and are skipped in the deck, but
  still appear in lesson-range presets and the Reference page).
- Hebrew ⇄ English direction toggle, pointed/unpointed display toggle,
  transliteration show/hide, spaced-repetition review (with an unspaced
  flip-deck alternative), progress tracking, and an analytics/achievements
  overlay.
- A standalone **Reference page** (`pages/memorization.html`) with
  per-lesson revision-concept checklists and the paradigm tables that are
  complete in the source material (pronouns, לְ-possession, Qal Perfect
  singular, interrogatives).

**Grammar, Parsing, and Reader modes are deferred** — the Greek app's
Grammar/Parsing/Reader UI and code paths have been removed from the live
app (see `docs/bbh-conversion-plan.md`), not merely hidden. Rebuilding them
for Hebrew (a different axis set: stem/binyan, conjugation,
person/gender/number, state, pronominal suffixes) is future work.

## Running locally

No build step — it's a static PWA. Serve the repo root over HTTP (opening
`index.html` via `file://` will not work: the app registers a service
worker and fetches JSON-like data via `<script>` tags that need a real
origin) and open it in a browser:

```sh
npx http-server . -p 8080
# or: python3 -m http.server 8080
```

Then visit `http://localhost:8080/`. The Reference page is at
`http://localhost:8080/pages/memorization.html`.

## Regenerating data

All vocabulary/lesson/reference data in `js/data/` is **generated** —
never hand-edit `js/data/bbh_vocab.js`, `js/data/bbh_reference_data.js`, or
`js/data/setMeta.js`. The two files under `source/bbh/` are the
authoritative, user-supplied content:

- `source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv` — 191 vocab
  rows (UTF-8 with BOM).
- `source/bbh/Beginning_Biblical_Hebrew_Revision_Guide.md` — the 50-lesson
  breakdown used for lesson titles, revision-concept checklists, and the
  paradigm tables.

To make a content change: edit the appropriate `source/bbh/` file, then
regenerate:

```sh
node tools/gen_bbh_data.mjs
```

This deterministically rewrites the three `js/data/bbh_*` files. Regenerating
twice in a row with no source changes should produce a no-op diff
(`git diff --exit-code js/data/` after a regenerate confirms reproducibility).

## Validating and checking a release

```sh
node tools/validate_bbh_data.mjs   # 191 cards / 50 lessons / unique ids / non-empty fields / point-strip safety
node tools/check_release.mjs       # consolidated release gate (also runs validate_bbh_data.mjs)
```

`tools/check_release.mjs` verifies, in one pass:

1. Every `sw.js` precache path resolves to a real file.
2. Exactly one `?v=` cache-bust value is in use across `index.html`,
   `pages/*.html`, and `sw.js`, and it's reflected in `sw.js`'s `CACHE_NAME`.
3. Zero Greek Unicode codepoints in the live load graph (`index.html`,
   `pages/*.html`, `styles.css`, `sw.js`, `manifest.json`, and every `js/`
   file reachable from `index.html`'s `<script>` tags plus `main.js`'s
   transitive imports).
4. Zero case-insensitive `duff` / `koine` / `greekFlashcards`. Bare "greek"
   is reported (not failed) — a handful of legacy identifiers/CSS hooks
   intentionally keep the name (e.g. `runtime.directionToGreek`, `.card-greek`)
   per the "adapter over legacy fields, documented not renamed" pattern in
   `CLAUDE.md`.
5. `js/data/bbh_vocab.js` registers exactly 50 lessons and 191 cards.
6. `source/bbh/` is unchanged vs. `git HEAD` (the source files are
   hand-authored content, not build output).

Run both before tagging a release.

## Fonts / licensing

`fonts/` bundles Noto Serif Hebrew and Noto Sans Hebrew (woff2, variable
weight 400–700) under the SIL Open Font License — see
`fonts/OFL-noto-hebrew.txt`. The existing Latin fonts (Gentium Plus, Noto
Sans) are kept for UI chrome; the Serif/Sans switch in Advanced settings
covers both scripts.

## Known gaps

- `docs/bbh-content-gaps.md` lists paradigms and reference material the
  source guide describes only partially (full alphabet chart, complete Qal
  Imperfect forms, binyan pattern tables) — intentionally left out of the
  app rather than invented.
- The Google Analytics property id wired into `index.html`
  (`G-YH11KQB6QX`) still belongs to the predecessor Greek app — flagged in
  `CLAUDE.md` for the repo owner to replace.
- Grammar, Parsing, a Reader mode over primary Hebrew text, and full
  paradigm tables (pending verification against the physical textbook) are
  deferred to a later phase — see `docs/bbh-conversion-plan.md`.

## Repository map

- `index.html`, `pages/memorization.html` — the app shell and the Reference
  page. See `docs/index-structure.md` for a navigation map of `index.html`.
- `js/` — engine (`domain/`, `state/`) and UI (`ui/`) modules; `js/app/main.js`
  is the only ES-module entry point, everything else is reached through its
  import graph or loaded as a classic `<script>` (see
  `docs/index-structure.md`).
- `js/data/` — generated vocab/reference/lesson data (see "Regenerating
  data" above).
- `source/bbh/` — the two authoritative source files.
- `tools/` — the generator and both check scripts.
- `docs/` — `bbh-conversion-plan.md` (task ledger), `bbh-content-gaps.md`
  (paradigm gaps), `index-structure.md` (navigation map).
- `CLAUDE.md` — maintenance rules for anyone (human or AI) editing this repo.
