# BBH Study Tool

An **unofficial** study PWA for John A. Cook & Robert D. Holmstedt,
*Beginning Biblical Hebrew: A Grammar and Illustrated Reader* (Baker
Academic). It is a student-made study aid, not affiliated with or endorsed
by the authors or publisher — always verify against the textbook and your
course materials. Everything runs locally in your browser; nothing is sent
anywhere unless you explicitly export your progress as a JSON file.

This app began as a fork of a Koine Greek study tool
([`hutima/duff_study_tool`](https://github.com/hutima/duff_study_tool)) and
was converted to Hebrew. See `CLAUDE.md` for the maintenance rules and
`docs/bbh-conversion-plan.md` for the full task-by-task ledger (Phase 1
conversion, then Phase 2: Parsing, Grammar, Reader, content completion).

## Scope: four study modes + Reference

The app covers:

- **Vocabulary flashcards** for all 209 vocabulary entries across the book's
  50 lessons, Hebrew ⇄ English direction toggle, pointed/unpointed display
  toggle, transliteration show/hide, spaced-repetition review (with an
  unspaced flip-deck alternative), progress tracking, and an
  analytics/achievements overlay. Lesson-range presets include both the five
  decade blocks (1–10 … 41–50) and the textbook's own 13 "Unit" reading-block
  presets.
- **Lesson 0 · Alphabet** — a standalone flip-card practice deck for the 23
  Hebrew letters, launched from the study selector. Completely separate from
  vocabulary: no SRS, no XP/streaks/achievements, and never counted in vocab
  stats or export vocab counts.
- **Parsing mode** — drills Hebrew morphology (binyan/stem, conjugation,
  person/gender/number, state, pronominal suffixes) gated to the current
  lesson, in Parse/Build/Mixed direction, with focused-paradigm, shuffle-all,
  custom-set, exclude-known, and appendix-forms scoping.
- **Grammar Quiz mode** — multiple-choice grammar questions gated to the
  current lesson, with a review-missed filter and an All/Core-only
  difficulty switch.
- **Reader mode** — curated Hebrew Bible passages (Strict/Guided tiers,
  OSHB text/morphology, CC BY 4.0 attribution) with tap-to-inspect word
  details and personal review marks; no grading, nothing scheduled.
- A standalone **Reference page** (`pages/memorization.html`) with
  per-lesson revision-concept checklists, the original verified paradigm
  tables, and an Extended reference section (42 alphabet/vowel/paradigm
  tables grouped by category, with an appendix-only group collapsed by
  default).

See `docs/bbh-content-gaps.md` for what's still unverified/deferred.

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

All data in `js/data/` is **generated** — never hand-edit any
`js/data/bbh_*.js` file or `js/data/setMeta.js`. The authoritative,
user-supplied source files live under `source/bbh/`:

- `source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv` — 209
  vocab rows (UTF-8 with BOM).
- `source/bbh/Beginning_Biblical_Hebrew_Revision_Guide.md` — the 50-lesson
  breakdown used for lesson titles, revision-concept checklists, and the
  original paradigm tables.
- `source/bbh/alphabet.json`, `source/bbh/vowels.json` — the alphabet/vowel
  chart data behind Lesson 0 and the Extended reference section.
- `source/bbh/parsing/`, `source/bbh/grammar/`, `source/bbh/reader/` — the
  Parsing paradigm inventory + lesson gates, the Grammar question bank, and
  the Reader passage corpus/selections respectively.

To make a content change: edit the appropriate `source/bbh/` file, then
regenerate with the matching generator (see each generator's own header in
`tools/` for its exact source→output mapping), e.g.:

```sh
node tools/gen_bbh_data.mjs             # vocab + reference + setMeta
node tools/gen_bbh_alphabet_data.mjs    # Lesson 0 alphabet data
node tools/gen_bbh_reference_extra.mjs  # Extended reference (42 sections)
node tools/gen_bbh_parsing_data.mjs     # Parsing inventory
node tools/gen_bbh_grammar_data.mjs     # Grammar question bank
node tools/gen_bbh_reader_data.mjs      # Reader passages
```

Every generator is deterministic; regenerating twice in a row with no source
changes should produce a no-op diff (`git diff --exit-code js/data/` after a
regenerate confirms reproducibility).

## Validating and checking a release

```sh
node tools/validate_bbh_data.mjs           # 209 cards / 50 lessons / unique ids / non-empty fields / point-strip safety
node tools/validate_bbh_parsing_data.mjs   # Parsing source integrity (gates, unique ids, acceptedParses)
node tools/check_no_pdf.mjs                # PDF-recontamination guard
node tools/check_release.mjs               # consolidated release gate (also runs the three above)
```

`tools/check_release.mjs` verifies, in one pass:

1. Every `sw.js` precache path resolves to a real file.
2. Exactly one `?v=` cache-bust value is in use across `index.html`,
   `pages/*.html`, `styles.css`, and `sw.js`, and it's reflected in
   `sw.js`'s `CACHE_NAME`.
3. Zero Greek Unicode codepoints in the live load graph (`index.html`,
   `pages/*.html`, `styles.css`, `sw.js`, `manifest.json`, and every `js/`
   file reachable from `index.html`'s `<script>` tags plus `main.js`'s
   transitive imports).
4. Zero case-insensitive `duff` / `koine` / `greekFlashcards`. Bare "greek"
   is reported (not failed) — a handful of legacy identifiers/CSS hooks
   intentionally keep the name (e.g. `runtime.directionToGreek`, `.card-greek`)
   per the "adapter over legacy fields, documented not renamed" pattern in
   `CLAUDE.md`.
5. `js/data/bbh_vocab.js` registers exactly 50 lessons and 209 cards.
6. `source/bbh/` is unchanged vs. `git HEAD` (the source files are
   hand-authored content, not build output).
7. Zero Google Analytics / `gtag` telemetry strings anywhere in the live
   load graph — the app ships telemetry-free with no replacement analytics.

Run `check_release.mjs` before tagging a release.

## Fonts / licensing

`fonts/` bundles Noto Serif Hebrew and Noto Sans Hebrew (woff2, variable
weight 400–700) under the SIL Open Font License — see
`fonts/OFL-noto-hebrew.txt`. The existing Latin fonts (Gentium Plus, Noto
Sans) are kept for UI chrome; the Serif/Sans switch in Advanced settings
covers both scripts. Reader passage text and morphology are from the Open
Scriptures Hebrew Bible Project (OSHB v2.2) — WLC text public domain,
lemma/morphology data CC BY 4.0 (attribution shown in Reader and the user
guide).

## Known gaps

- `docs/bbh-content-gaps.md` lists what's still unverified against the
  physical textbook (full derived-binyan conjugation tables beyond the
  recognition-form set the book itself prints, weak-verb paradigm tables)
  and closes out every gap that's since been filled by the Extended
  reference section.
- Unrestricted whole-Bible browsing in Reader, contextual syntax/discourse
  drills, weak-verb drilling beyond appendix display, and English
  translations of Reader passages remain out of scope — see the "Deferred
  work" section of `CLAUDE.md`.

## Repository map

- `index.html`, `pages/memorization.html` — the app shell and the Reference
  page. See `docs/index-structure.md` for a navigation map of `index.html`.
- `js/` — engine (`domain/`, `state/`) and UI (`ui/`) modules; `js/app/main.js`
  is the only ES-module entry point, everything else is reached through its
  import graph or loaded as a classic `<script>` (see
  `docs/index-structure.md`).
- `js/data/` — generated vocab/reference/lesson/parsing/grammar/reader/
  alphabet data (see "Regenerating data" above).
- `source/bbh/` — the authoritative source files (vocab CSV, revision guide,
  alphabet/vowel JSON, and the `parsing/`/`grammar/`/`reader/` subtrees).
- `tools/` — the generator and validator scripts, plus the consolidated
  release check.
- `docs/` — `bbh-conversion-plan.md` (task ledger), `bbh-content-gaps.md`
  (paradigm gaps), `index-structure.md` (navigation map).
- `CLAUDE.md` — maintenance rules for anyone (human or AI) editing this repo.
