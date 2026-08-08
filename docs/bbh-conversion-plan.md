# BBH Conversion Plan & Task Ledger

Phase 1 scope (per CLAUDE.md + orchestration prompt): Vocabulary + Paradigms/Reference only.
Content authorities: `source/bbh/Beginning_Biblical_Hebrew_Revision_Guide.md` (50 lessons),
`source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv` (191 rows, UTF-8 **with BOM**).
Verified: lessons 1–50 contiguous; 39 lessons with vocab, 11 without
(1, 2, 4, 37, 41, 43, 44, 46, 47, 48, 50); no empty Hebrew/gloss cells.

## Architecture decisions

1. **Prune the existing entrypoint, don't add a new one.** `js/app/main.js` statically imports
   the Grammar/Parsing/Reader modules (`main.js:171-174,183`: `morph_steps.js`,
   `paradigm_focus.js`, `morph_lookup.js`, `explanations.js`, `js/ui/reader.js`). These carry
   Greek content, so hiding buttons is not enough — the imports must be removed. Blast radius is
   acceptable because cross-module wiring is mostly `GLOBAL_CLICK_HANDLERS`/`window` assignments
   that degrade to `undefined` (see CLAUDE.md landmines), and **this is a brand-new deployment**
   (new repo/URL, no shipped clients), so the cross-version ES-module hazard does not constrain
   this first release. After v1 ships, the landmine rules apply again.
2. **Data stays `window.SETS`-shaped.** Generated `js/data/bbh_vocab.js` self-registers
   `window.SETS["1"…"50"] = {label, type:'lesson', cards}` exactly like `words.js` did, so
   `js/domain/deck/filters.js` / selectors keep working. Zero-vocab lessons get `cards: []`.
3. **Card shape** (adapter over legacy fields, documented not renamed):
   `{ id, g: <pointed Hebrew>, e: <gloss>, translit, notes: <grammar_and_forms>, page, required: true }`.
   `g`/`e` are the legacy engine contract. Explicit deterministic `id`
   (`bbh-l<lesson>-<slug>`, slug from unpointed headword + disambiguator) — `filters.js` gets a
   small seam to prefer `card.id` over `stableCardKey(card.g)`.
4. **Lesson metadata**: rewrite `js/data/setMeta.js` → `LESSON_TITLES` (1–50 from guide),
   and reuse the existing preset mechanism (`SESSION_WEEK_META` shape) for range shortcuts
   1–10 / 11–20 / 21–30 / 31–40 / 41–50 / All. No semester schedule invented.
   Keep exported symbol names where importers (`selectors.js`, `ordering.js`) expect them.
5. **Required-only concept removed** (all 191 rows are required; toggle hidden, cards emit
   `required: true` for engine compatibility).
6. **Reference page**: `pages/memorization.html` is fully self-contained static HTML → replace
   its content with (a) per-lesson revision-concept checklists generated from the guide, and
   (b) only paradigm tables that are complete in the source (pronouns L5/L11, לְ possession
   L9/L17, Qal Perfect sg. L16 incl. היה, interrogatives L14). Incomplete sets (full alphabet
   chart with letter names, Qal Imperfect full forms, binyan pattern tables) go to
   `docs/bbh-content-gaps.md`, not the app.
7. **Hebrew text handling**: new `js/utils/hebrewText.js` — `stripPoints()` removes
   cantillation U+0591–U+05AF and points U+05B0–U+05BC, U+05C1, U+05C2, U+05C7; preserves
   letters, maqaf U+05BE, sof pasuq, geresh/gershayim. Sorting: NFC-normalize, strip points,
   fold finals (ך→כ ם→מ ן→נ ף→פ ץ→צ), then `Intl.Collator('he')`. `greekSort.js` leaves the
   import graph. No raw code-unit slicing of Hebrew.
8. **RTL scoped, app LTR**: `lang="he" dir="rtl"` only on Hebrew card faces / Hebrew spans /
   paradigm cells.
9. **Fonts**: bundle Noto Serif Hebrew + Noto Sans Hebrew woff2 + OFL license; keep existing
   Latin fonts for UI; rewire the serif/sans switch. If font download is blocked by egress,
   ship system-font Hebrew stack and record the gap.
10. **State/PWA**: `bbhStudyToolStateV1` (+ `bbhStudyTool*` aux keys), export format
    `bbh-study-tool-progress-export`, no migration from Greek keys. `CACHE_NAME` →
    `bbh-flashcards-pwa-v1-github-pages`, `?v=` reset to a fresh number, precache rebuilt to
    only live assets. Manifest: "Beginning Biblical Hebrew — Study Tool" / "BBH Study Tool",
    unofficial-study-aid label in About.
11. **Transliteration**: shown as secondary line under Hebrew, new setting to hide (default on).
    Greek `transliterateGreek()` path removed from render.

## Task ledger

| # | Task | Model | Owned files | Status |
|---|------|-------|-------------|--------|
| 0 | Audits (runtime graph, data contract, UI wiring) | haiku+sonnet | read-only | done |
| 1 | Generator + validator + generated data | sonnet | `tools/gen_bbh_data.mjs`, `tools/validate_bbh_data.mjs`, `js/data/bbh_vocab.js`, `js/data/bbh_reference_data.js`, `js/data/setMeta.js` | done |
| 2 | Shell prune + lessons UI (index.html, main.js, navigation, selectors, render) | sonnet | `index.html`, `js/app/main.js`, `js/ui/*`, `js/domain/deck/filters.js`, delete Greek data script tags | done |
| 3 | Hebrew presentation (RTL, fonts, pointed toggle, sort, translit) | sonnet | `js/utils/hebrewText.js`, `styles.css`, `fonts/`, render card-face bits | done |
| 4 | Reference page rewrite | sonnet | `pages/memorization.html`, `docs/bbh-content-gaps.md` | done |
| 5 | State/export/analytics/manifest/sw | sonnet | `js/state/*`, `manifest.json`, `sw.js`, cache-bust | done |
| 6 | Checks + smoke test + docs sync | haiku+sonnet | `tools/checks`, `docs/index-structure.md`, README, CLAUDE.md | done |
| 7 | Final semantic audit | opus | diffs/summaries only | done |

Sequencing: 1 → 2 → (3 ∥ 4) → 5 → 6 → 7. Tasks 3 and 4 touch disjoint files.

## Acceptance commands

- `node tools/gen_bbh_data.mjs && git diff --exit-code js/data/` (reproducibility)
- `node tools/validate_bbh_data.mjs` (191 cards / 50 lessons / unique deterministic ids / non-empty fields / point-strip safety)
- `node tools/check_release.mjs` (precache paths exist, `?v=` sync, no Greek Unicode `[Ͱ-Ͽἀ-῿]` and no Greek/Duff/Koine strings in live load graph, allowlist: docs/, source/, CLAUDE.md)
- Static-server smoke test via Playwright/Chromium (console clean, card reveal, rating, lesson filter, empty lesson, direction toggle, pointed toggle, export/import, reference page, offline reload)

## Notes / risks

- Legacy `stableCardKey` strips Greek accents only — harmless for Hebrew but IDs must come
  from `card.id` seam instead (Task 1+2).
- `render.js` Greek helpers (`thirdDeclensionStemFromHeadword`, Greek-range tokenizer) are
  silent no-ops on Hebrew; remove the reachable ones in Task 2, don't chase dead code.
- `docs/index-structure.md` must be updated in the same commit as `index.html` edits (Task 6
  consolidates; interim commits note the deferral).
- Icons (`icon-192.png` etc.) — check for Greek glyphs in Task 5; replace or note gap.
