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
| 6 | Dead-code excision + `tools/check_release.mjs` + smoke test + docs sync | sonnet | `js/ui/*`, `js/app/main.js`, `js/state/*`, `js/domain/deck/*`, `js/domain/gamification/*`, `tools/check_release.mjs`, `docs/index-structure.md`, README.md, CLAUDE.md, `docs/bbh-conversion-plan.md` | done |
| 7 | Final semantic audit | opus | diffs/summaries only | pending |

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

---

# Phase 2 Ledger — Lesson-Gated Parsing, Grammar, Reader, Content Completion

Started 2026-08-08 on clean `Main` (`0a5e8be`, after Preflight 0 PDF purge — see
`RESTORE.md`). Base for all Phase 2 PRs: `Main` (exact case). Deployment note:
**GitHub Pages is the primary deployment**; the app must stay static/build-free,
subpath-relative, and merging to the default branch deploys it.

## Content authorities

- Cook & Holmstedt, *Beginning Biblical Hebrew* (ISBN 978-0-8010-4886-9) — the
  user's PDF, held OUTSIDE the repo (private verification source; page images
  are authoritative, the scan's OCR layer is garbage — never trust extracted text).
- Baker eSources all-lessons flashcards (203 lesson terms) — cross-check only.
- OSHB `openscriptures/morphhb` tag `v.2.2` = `6a5db284c715c18b239422e57bb89684e6a19f00`
  (WLC text public domain; lemma/morph CC BY 4.0; no NFC normalization of display
  text) — see `source/bbh/reader/corpus-pin.json`.

## PDF page mapping (verified visually)

| Book section | Printed pages | PDF page formula |
|---|---|---|
| Grammar lessons 1–50 | 21–137 | PDF page = printed page (1:1) |
| Appendixes/glossaries | a-3 … a-51+ | PDF page = 140 + N (a-12 → 152; verified) |
| Illustrated Reader | r-1 … | PDF page = 215 + N (r-55 → 270; verified) |

Appendix paradigm tables carry their own lesson references (e.g. "Personal
Pronouns (LL5, 11)", "Demonstrative Pronouns (L33)", "Attached Pronouns with
Singular Nouns (LL9, 22)") — use them to cross-check `introducedLesson`, but the
lesson pages remain the primary authority for gate values.

## Phase 2 architecture decisions

1. **Hebrew axes only.** Verb parse features: `binyan` (qal|nifal|piel|pual|
   hitpael|hifil|hofal), `conjugation` (perfect|imperfect|past-narrative|
   imperative|jussive|infinitive|adverbial-infinitive|participle), `person`
   (1|2|3), `gender` (m|f|c), `number` (s|p|d), `suffix` (null or
   {person,gender,number}). Nominal: `pos`, `gender`, `number`, `state`
   (absolute|construct), `suffix`. Pronoun: `person/gender/number` (+ demonstr.
   near/far). NO tense/voice/mood/case axes; no graded "aspect" step; Lesson 49
   semantic case relations are reference prose only.
2. **`acceptedParses` is an array** on every form; grading accepts any member.
   Ambiguity notes (`ambiguityNote`) explain context-dependence; no form-only
   question may depend on syntax/discourse.
3. **Gates**: every form carries `introducedLesson` (1–50) or
   `appendixOnly: true` (never both). Cumulative gate: lesson N exposes
   `introducedLesson <= N` across forms, paradigms, dimension values, hints,
   and distractors. Appendix-only forms sit behind an off-by-default toggle.
   Staged paradigms gate per-form, not per-paradigm.
4. **Source data layout** (`source/bbh/` is authoritative, generated `js/data/`
   is never hand-edited — same rule as Phase 1):
   - `source/bbh/parsing/paradigms.json` (paradigms → forms → acceptedParses,
     each form: id, display (pointed), lemma/root, pos, introducedLesson |
     appendixOnly, source {lesson,page}|{appendix,page}, note, translit?)
   - `source/bbh/parsing/lesson_gates.json` (lesson → newly introduced
     material, summary + source page; drives validator cross-check + UI
     "what's new"/empty states)
   - `source/bbh/grammar/questions.json` + `examples.json` (per orchestration
     prompt spec: 4 choices, correctIndex, provenance, reviewStatus, tags)
   - `source/bbh/reader/corpus-pin.json`, `gate-map.json`, `selections.json`
   - Generators/validators: `tools/gen_bbh_parsing_data.mjs`,
     `tools/validate_bbh_parsing_data.mjs`, `tools/validate_bbh_grammar_data.mjs`,
     `tools/import_oshb_reader.mjs` (dev-time; reads pinned checkout)
   - Generated: `js/data/bbh_parsing.js`, `js/data/bbh_grammar.js`,
     `js/data/bbh_reader.js` — deterministic, byte-identical on re-run.
5. **Comparison keys**: display Hebrew is stored authoritative (no NFC
   mutation); unpointed/comparison forms are derived fields via
   `js/utils/hebrewText.js` at generation time, tested to never overwrite
   display text.
6. **State**: keep `bbhStudyToolStateV1` storage key; add additive subtrees
   `parsing`, `grammar`, `reader` each with their own `schemaVersion`.
   Migration = fill defaults when absent; vocabulary SRS untouched. Export
   format id unchanged with bumped `version` + back-compatible import.
   Parsing "known" rule: 2 consecutive fully-acceptable recent attempts under
   currently-graded dimensions, recomputed from structured attempt records.
7. **Module-graph safety** (post-launch rules from CLAUDE.md apply): new modes
   load via NEW script files + runtime wiring (deps objects /
   `GLOBAL_CLICK_HANDLERS`), never new cross-module named exports from
   existing shipped modules. Never remove an export v1 `main.js` imports.
   Single `?v=` bump (1 → 2) with `CACHE_NAME` at release.
8. **Telemetry zero**: GA snippet removed; release check fails on
   `googletagmanager|google-analytics|gtag(|G-YH11KQB6QX` in the live graph.
   "Analytics" means local progress dashboards only.
9. **GitHub Pages compatibility** (user requirement): no build step, no
   server-side anything, all URLs relative (site lives under
   `/BBH_Study_Tool/`), `.nojekyll` preserved, new data ships as static JS
   files added to the sw precache.

## Phase 2 task ledger

| PR | Scope | Model | Owned files | Status |
|----|-------|-------|-------------|--------|
| A | GA removal, guard wiring, schemas, validators, gate engine + tests, ledger, corpus pin | sonnet (impl) | `index.html`, `tools/check_release.mjs`, `tools/check_no_pdf.mjs` (wiring), `source/bbh/{parsing,grammar,reader}/*.json` (schema skeletons), `tools/validate_bbh_parsing_data.mjs`, `js/domain/parsing/gates.js` + tests, docs | in progress |
| B | Verified parsing inventory (PDF), Parse/Build domain+UI, state v2, parsing analytics | sonnet (transcription+impl), fable (review) | `source/bbh/parsing/*`, `tools/gen_bbh_parsing_data.mjs`, `js/data/bbh_parsing.js`, `js/domain/parsing/*`, `js/ui/*` (parsing seams), `js/state/*`, `index.html` | pending |
| C | Grammar bank (300 reviewed Qs), anti-giveaway validator, Grammar UI, parsing UX round, freeze hotfix | sonnet fan-out (5 authors, 7 blind reviewers, lint+fix passes), fable (adjudication) | `source/bbh/grammar/*`, `tools/{validate,gen}_bbh_grammar_data.mjs`, `js/data/bbh_grammar.js`, `js/ui/grammar.js`, `js/ui/parsing.js`, `js/pwa/swUpdate.js`, state files | done |
| D | OSHB import/scorer, curated selections, Reader UI, attribution | sonnet | `tools/import_oshb_reader.mjs`, `source/bbh/reader/*`, `js/data/bbh_reader.js`, `js/ui/reader2/*` | pending |
| E | Vocab 191→209 (IDs preserved), Lesson 0 Alphabet UI, Reference Extended-reference render, guidance text | sonnet | `source/bbh/*.csv`, `tools/gen_bbh_data.mjs` counts, `js/ui/alphabet.js`, `pages/memorization.html`, `docs/bbh-content-gaps.md`, `index.html`, state files, docs | done |
| F | Release hardening: cached-v1 upgrade test, offline, `?v=2`, docs, final audit | sonnet + opus (audit) | `sw.js`, `index.html`, README, CLAUDE.md, docs | pending |

Opus budget: 3 calls max — (1) schema/gate review pre-PR-B, (2) mid-project
content audit, (3) final release audit. Used so far: 0.

## Phase 2 acceptance commands

- `node tools/check_no_pdf.mjs` — recontamination guard (every commit)
- `node tools/validate_bbh_parsing_data.mjs` — parsing source integrity
  (unique stable ids, gate xor appendixOnly, source refs present, Hebrew-axis
  whitelist, acceptedParses non-empty, no future-lesson leak in distractor pools)
- `node tools/gen_bbh_parsing_data.mjs && git diff --exit-code js/data/` —
  determinism
- `node tools/check_release.mjs` — extended: telemetry scan, PDF guard,
  precache/`?v=` sync, Greek scans, data counts
- Browser smoke: mode switching, gates at N-1/N boundaries, Parse/Build paths,
  export/import v1→v2, offline reload, cached-v1 upgrade

## Addendum (user request, 2026-08-08): optional lesson grouping

The Greek app grouped chapters by syllabus weeks; BBH has no syllabus. Add
OPTIONAL lesson-group presets using the textbook's own unit structure — the
13 illustrated-Reading breakpoints from the TOC: 1–9 (R1), 10–14 (R2),
15–18 (R3), 19–22 (R4), 23–26 (R5), 27–30 (R6), 31–34 (R7), 35–38 (R8),
39–41 (R9), 42–44 (R10), 45–46 (R11), 47–48 (R12), 49–50 (R13). Keep the
existing decade ranges; add these as a second preset group ("Units" /
"Reading blocks") in the vocab lesson picker, and reuse the same shortcuts in
the Parsing/Grammar current-lesson selectors. Implemented via
`tools/gen_bbh_data.mjs` presets (PR E scope; UI shortcuts land with PR B/C
selectors as they're built).

## Addendum (user request, 2026-08-08): Lesson 0 — Alphabet practice

Add a "Lesson 0 · Alphabet" flashcard practice deck, COMPLETELY separate from
the vocabulary machinery: own source/generated data (letters, names, sound
values, final forms — transcribed from Lesson 1 pp. 21–26 + Appendix A
a-3..a-6), own state subtree (no SRS, no XP/streaks/achievements, excluded
from presets, vocab stats, and export vocab counts), unaffected by vocab
toggles. UI: entry in the lesson area launching a lightweight flip/shuffle
loop with local again/got-it marking. Closes the "full alphabet chart" gap in
docs/bbh-content-gaps.md. Scope: PR E (content completion), first item.

## Addendum (user request, 2026-08-09): post-Phase-2 follow-up — parsing depth review + root drills + mobile UX

After PR F ships: (1) a Fable/Opus review of the Hebrew Parsing module
against the original Greek implementation (`ad1547e`) — interaction depth,
drill variety, analytics parity; (2) root-based cross-lesson drills:
combine paradigms sharing a root (שמר spans Qal Perfect L16 → Imperfect
L23 → Past Narrative L35 → Imperative L39 → Participle L42; היה and the
derived-binyan exemplars similarly) into "conjugation journey" practice —
Hebrew's smaller axis system makes same-word-across-lessons testing
natural where Greek needed separate paradigms; (3) simplify the Parsing UI
into user-sensible modules/groupings, designed mobile-first (current
controls still clunky per user feedback). Tracked as follow-up task; not
part of the Phase 2 definition of done.

**Status: shipped (PR G)** — see `docs/bbh-parsing-depth-review.md` for the
review (§1-§3) and the adopted implementation plan (§4, amended in full by
§5). Landed: `buildDrillPool`'s `rootFilter` branch + `dimValueFilter`
("By feature") filter and `orderDrillPool`'s deterministic `journey` mode
(`js/domain/parsing/drill.js`); the Focused/Root journey (verbs)/By feature/
Shuffle/Custom scope control, root journey map + "Drill this root", and the
primary-bar + collapsed "More options" mobile regroup (`js/ui/parsing.js`);
`runtime.parsing.rootFilter`/`dimValueFilter`/`journeyIndex`/`optionsOpen`
(additive, `PROGRESS_EXPORT_VERSION` unchanged at 6). Cache bumped to `?v=7`.

## Addendum (user mobile feedback, 2026-08-09): PR H punch list

From live mobile testing screenshots: (1) remove the decade lesson presets
(keep Units + All); (2) Lesson 0 rating row should match the vocab card
button layout; (3) split Lesson 0 into 0A Alphabet and 0B Vowel marks —
0B cards show the sign on its carrier plus a representative vocab word
with the marked cluster highlighted (chosen deterministically at
generation from the 209-card deck); (4) fix #grammarSection mobile layout
(question card overlaps options/score strip; header/mode-bar collision);
(5) vocab Hard/Uncertain/Easy rating buttons leak into Parsing mode via
syncLayoutVisibility — hide outside vocab. Ships as PR H after PR G.

## Addendum (user request, 2026-08-09): Reader literal glosses (after PR H)

Tap-to-reveal per-passage LITERAL word-by-word glosses in Reader mode,
assembled at generation time from verified sources only: matched
vocab-card glosses → new `source/bbh/reader/reader_glosses.json`
(transcribed from the textbook glossary's own entries for exactly the
lemmas appearing in the 52 curated passages that lack vocab matches,
page-verified) → proper-name renderings → honest gap markers. Never
invented glosses, never a copyrighted Bible translation (standing project
rule). UI: per-passage reveal control, interlinear line under tokens.

## Addendum (user rule change, 2026-08-09): LLM wooden translations permitted

The user has explicitly relaxed the "no generated translations" rule:
LLM-GENERATED WOODEN (literal) TRANSLATIONS ARE NOW PERMITTED for Reader
passages. Conditions retained: (1) generated at development time, stored
in source/generated data with provenance "llm-wooden-reviewed", never at
runtime; (2) each translation independently verified by a separate
reviewer agent against the verse's token morphology + verified glosses
before shipping; (3) labeled in the UI as an unofficial literal rendering;
(4) still never copied from or paraphrasing any copyrighted English Bible
translation. This supersedes the stricter clause in the task-13 addendum
above — the interlinear gloss line and the wooden verse translation can
ship together (gloss = per-token, wooden = per-verse).

## Addendum (user feedback, 2026-08-09): PR H punch-list item 6 — Hebrew title puns

The gamification Titles ladder still carries the Greek app's transliterated
GREEK puns (Alpha, Paroikos, Akouōn, Spongos, Mathētēs, Berean …) — they
evaded the release-gate Greek scans because they are Latin-script
transliterations, not Greek Unicode. Convert every title (and any
similarly-flavored achievement names — audit js/domain/gamification/*) to
equivalent HEBREW puns preserving each level's joke (e.g. Alef "already
know one letter", Ger "stranger in a strange land", Shomea "listening,
not yet understanding", Talmid "officially a student", Doresh "checks the
scrolls daily"). Consider extending the release-gate string scan with the
known Greek transliteration list so regressions get caught.

**Done, PR H.** Every title in `js/domain/gamification/levels.js`'s
`XP_LEVELS` ladder converted (old Greek title -> new Hebrew title, `flav`
text unchanged in every row):

| Level | Old (Greek) | New (Hebrew) |
|------:|-------------|--------------|
| 1  | Alpha | Alef |
| 2  | Paroikos | Ger |
| 3  | Akouōn | Shomea |
| 4  | Spongos | Sefog |
| 5  | Mathētēs | Talmid |
| 6  | Berean | Doresh |
| 7  | Anagnōstēs | Qore |
| 8  | Bibliophagos | Okhel-Sfarim |
| 9  | Logophilos | Ohev-Milim |
| 10 | Hermēneutēs | Meturgeman |
| 11 | Grammatikos | Medakdek |
| 12 | Exēgētēs | Darshan |
| 13 | Rhētōr | Noem |
| 14 | Didaskalos | Moreh |
| 15 | Sophos | Chakham |
| 16 | Chrysostomos | Peh-Zahav |
| 17 | Theologos | Ma'amik |
| 18 | Polymathēs | Rav-Yode'a |
| 19 | Archōn | Sar |
| 20 | Logothetēs | Sofer |
| 21 | Pantokratōr | Kol-Yakhol |
| 22 | Metanoia | Teshuvah |
| 23 | Kērygma | Derashah |
| 24 | Theopneustos | Mushpa-mi-Shamayim |
| 25 | Parrhēsia | Chutzpah |
| 26 | Hypostasis | Etzem |
| 27 | Mystērion | Sod |
| 28 | Plērōma | Melo |
| 29 | Apokalypsis | Hitgalut |
| 30 | Logos | Davar |

Achievements/badges (`js/domain/gamification/xp.js` `computeAchievements`)
were audited too — their names (First Light, Kindled, Diligent, Centurion,
Three-fold Cord, Required Lexicon, Ch. N, …) turned out to be English, not
Greek-transliteration-flavored, so none needed conversion.

`tools/check_release.mjs` check4b now scans the live load graph for a
word-boundary, case-insensitive list of the retired Greek words above
(`logos` deliberately excluded — common English word, e.g. "app logos") so
a title regressing back to its Greek pun fails the release build. Because
that scan matches on the literal old words, this table (and any other
mention of the old titles) must stay out of the live load graph — this doc
is fine (`docs/` isn't scanned), but `js/domain/gamification/levels.js`'s
own header comment deliberately does NOT repeat the old words verbatim.

## Addendum (user request, 2026-08-09): Reader book expansion (after tasks 12/13)

Review Reader mode, then expand passage curation beyond Genesis: extend
the importer's book list (candidates: Ruth, Jonah, Exodus, Deuteronomy,
Judges, Samuel narrative) over the same pinned OSHB v2.2 checkout;
re-review the lemma-override/vocab-match table for the new books'
high-frequency lemmas; re-curate selections to fill the thin gate buckets
(15-19, 23-27, 28-31 had only 1-2 Genesis strict candidates) and to find
challenge-tier verses (Genesis yielded zero). Byte-equality, determinism,
and tier rules unchanged.

**Status: shipped.** `tools/import_oshb_reader.mjs`'s `BOOK_LIST` is now
`['Gen','Ruth','Jonah','Exod','Deut','Judg','1Sam','2Sam']`
(`importReaderCorpus`, generalized from the Genesis-only `importGenesis`,
which remains as a back-compat single-book alias); the OSIS tokenizer
(`parseBookXml`) and every verse ref helper are book-parameterized.
Coverage-gap count across all 8 books is 0 — `source/bbh/reader/gate-
map.json` needed no new entries; its existing per-POS-letter safety-net
catch-alls already covered every OSHB morph code the 7 new books
introduced. `LEMMA_OVERRIDES` gained 24 new entries (16 resolving to a
CSV lesson, 8 documented verified-absent) from a combined-top-60 audit
across all 8 books; 3 further genuine matches (אֱלֹהִים 430, אֶרֶץ 776,
צִוָּה 6680) were found but deliberately withheld because adding them
would have drifted 5 of the 52 pre-existing Genesis selections' recorded
scores — see the comment above those three in `LEMMA_OVERRIDES`.
`source/bbh/reader/selections.json` grew from 52 to 78 selections (all 52
Genesis entries byte-identical, unchanged): 26 new entries — thin-bucket
fill for 15-19/23-27/28-31 (6 verses, non-Genesis only) plus up to 2
strict + 1 guided showcase per new book (all 7 landed in the L35-38
wayyiqtol/past-narrative bucket, each book's richest pool). Zero
challenge-tier verses were found across all 8 books (same null result as
Genesis-only). `js/ui/reader.js` groups passages by book (`Gen` first,
then the 7 expansion books) then by gate-lesson bucket within each book;
adds a `runtime.reader.showChallenge` toggle (default off, all 3 state
sync points + the pre-PR-D migration seed updated) gating a `challenge`
tier badge + per-passage `challengeNote` header line, currently inert
(no challenge passages exist yet, but the code path is exercised in
`scratchpad/smoke_reader.mjs` via an injected test fixture). Cache bumped
to `?v=9`; `check_release.mjs` check5b updated to the new 78-passage
count. See the task's own report for the full self-check transcript.

## Addendum (user ordering, 2026-08-09): task order + PR H item 7

Task #14 (Reader multi-book expansion) runs BEFORE task #13 (literal
glosses + wooden translations) so gloss/translation authoring happens once
over the final passage set. PR H additionally carries item 7 (orchestrator
design, from user feedback on the PR G UI): parsing scope control becomes
a preset-style 2-column card grid (no stretched 5-way pill), direction
pill gets short labels (Parse|Build|Mixed) + max-width, lesson selector
becomes an inline label+select row, tighter mobile padding.

## Addendum (user request, 2026-08-09): advanced vocab + vocab by book (task #15)

After tasks 12/14/13: mirror the Greek app's deck structure with Hebrew
sources — (1) per-book vocabulary decks (Genesis first, then the Reader-
expansion books) generated from the pinned OSHB corpus by lemma frequency,
own id namespace, selectable alongside lesson decks; (2) advanced-vocab
tiers beyond the 209 lesson cards (textbook R# reader vocabulary and/or
corpus frequency tiers). Glosses default to public-domain Strong's (mapped
via OSHB Strong's numbers), optionally LLM-condensed under the 2026-08-09
wooden-translation rule; the textbook glossary's R# glosses require the
user to re-supply glossary pages (PDF transport copy deleted).

## Addendum (user feedback, 2026-08-09): 0B vowel-deck fixes (task #16)

From live screenshots: 0B is hard to read and some vowel marks render
misplaced on the answer face — root-cause hypothesis: cluster highlighting
splits spans mid-grapheme, detaching combining marks from their base.
Fix: true grapheme segmentation (Intl.Segmenter 'grapheme', fallback
regex consonant+combining-marks), larger/brighter representative word,
highlight by color/weight only. Also: Again/Got-it become STACKED
full-width vertical buttons on 0A/0B for one-handed use (user
suggestion). Runs right after task #14 (styles.css overlap).

## Addendum (user request, 2026-08-09): rename 0A/0B to Lessons 1/2

The practice decks map exactly onto the textbook's own lessons (L1 The
Consonants, L2 The Vowels), so the "Lesson 0" framing is retired:
"Lesson 1 · Alphabet" and "Lesson 2 · Vowel marks" (display-only rename;
state keys/ids unchanged). Lessons 1 and 2 disappear from the VOCAB
lesson selector only (zero cards; their content is the practice decks) —
parsing/grammar/reader selects and the Units presets are untouched, and
the other zero-vocab lessons (4/37/41/43/44/46-48/50) stay listed per the
user's scope. Ships with task #16.

## Addendum (user feedback, 2026-08-09): challenge tier rework (into task #13)

The challenge show/hide toggle is inert because the strict definition
("exactly one near-future feature token") matched ZERO verses in all 8
books. Task #13 additionally: relax the definition in a documented way
(one future feature TYPE per verse, small token cap, few unknowns),
re-score, curate real challenge passages (feature named in the passage
header, badge highlighting verified with real data), and hide the toggle
whenever no challenge passage exists at the learner's current gate — no
inert controls.

## Addendum (user screenshot, 2026-08-09): Reader renders OSHB slashes (into task #13)

The Reader displays OSHB's morpheme-segmentation "/" markers inside the
Hebrew (e.g. ה/תבה) — annotation, not Masoretic text. Fix in task #13:
stored token text stays byte-exact for provenance; the RENDER strips the
segment dividers (documented display transform; byte-equality validation
continues to run against stored data). Task #13 also delivers the
per-passage show/hide translation control the user expects.

## Addendum (user screenshot, 2026-08-09): parsing card hierarchy + translit (task #17)

Parsing drill card gets Greek-app-style hierarchy: Hebrew form at
vocab-card scale as the anchor, step label/choices stepped down, and a
smaller italic TRANSLITERATION line under the form honoring the global
show/hide preference. The book prints no paradigm transliterations, so
they are generated deterministically at build time (rule-based romanizer
matched to the vocab CSV's translit style; qamets-qatan/shewa/dagesh
handling documented; ~30-form sample review before shipping; marked as
derived in the data notes). Runs after task #16.

## Addendum (user feedback, 2026-08-09): tier-label clarity (into task #13)

Strict/Guided means nothing to a user in-app. Task #13 adds a plain-
language caption under the Passages toggle (Strict: every word's grammar
is within your current lesson, at most one unfamiliar word. Guided: up to
three unfamiliar words, marked with dotted underlines), matching badge
tooltips, and user-guide wording.

## Addendum (user screenshot, 2026-08-09): underline noise — matcher fixes (into task #13)

Gen 10:17 showed every word dotted-underlined. Two matcher bugs: OSHB
gentilic nouns (Ng — the Hivite/Arkite/Sinite) are not excluded like
proper nouns, so name-lists count as unknown content words (wrongly
underlined AND wrongly scored guided); and compound tokens (ו/את) match
vocab against the whole compound lemma instead of the core segment, so
known vocabulary like the object marker fails to match. Task #13: Ng →
proper-name-class, per-core-segment vocab matching, corpus re-score with
documented tier shifts.

## Addendum (user request, 2026-08-09): task #18 — alphabet as a mode + combined deck + tap guards

After task #15: (1) Lesson 1/2 practice converts from modal overlays to
clean selector-entered sections (same layout family as the other modes);
(2) the standalone-practice note (no SRS/XP/vocab stats) stays prominent;
(3) new combined letters+vowel-marks deck entry (merged deck; known
tracking reuses the letters/vowels maps); (4) tap guards on ALL modal
close buttons via the existing clickShield pattern so a close tap cannot
fall through on phones.

## Addendum (user request, 2026-08-09): book-deck analytics scoping (into task #18)

Per the Greek original: book-deck cards (bbh-bk-*) are EXCLUDED from most
analytics (course totals, per-chapter/word breakdowns, coverage/mastery,
stubborn/improved/slipping lists) but INCLUDED in the spaced-repetition
due-time histogram/forecast — scheduled reviews are real work regardless
of deck. Folded into task #18 (item 5) with ad1547e as the behavioral
reference.

## Addendum (user requests, 2026-08-09): task #19 — Reference mobile + structure

Reference page: (1) tables in scroll containers w/ sticky first column +
edge-fade hint; alphabet/vowel charts become stacked cards <=600px;
tightened mobile typography; source-ref dedup ranges. (2) Sections
ordered by TEXTBOOK lesson order (earliest source lesson asc; appendix
group last). (3) Every section collapsible (<details>), default
collapsed, Expand/Collapse-all control. (4) Collapse state persisted in
localStorage aux key bbhStudyToolReferenceStateV1 (page is standalone —
main state modules untouched).

## Addendum (user correction, 2026-08-09): task #20 — advanced vocab reworked to Greek model

Task #15's per-book new-word decks were NOT the requested design. Per the
Greek original (ad1547e advancedSection/bookVocabSection): (1) Advanced
vocabulary = corpus-wide non-course lemmas in descending-frequency
buckets (sub-groups of 25), new bbh-adv-* cards, excluded from course
totals but present in selected-deck analytics; (2) Book vocab = every
lexeme per book in sets of 50 by in-book frequency, each entry LINKING to
its existing card (shared progress, no duplicates); (3) both rendered as
collapsible sections placed AFTER the manual lesson selection with blurbs
and meta counts; (4) bbh-bk-* marks migrate to bbh-adv-* by Strong's
number. Runs after task #19.

**Resolved (2026-08-09):** implemented as specified.
`tools/gen_bbh_advanced_vocab.mjs` (replaces `tools/gen_bbh_book_vocab.mjs`)
writes `js/data/bbh_advanced_vocab.js` (replaces `bbh_book_vocab.js`),
registering `window.BBH_ADVANCED_VOCAB` (18 buckets of 100, sub-grouped by
25 via each card's own `sub` field, 1,726 `bbh-adv-<strongs>` cards — every
content lemma at corpus frequency ≥2 not already one of the 209 lesson
cards) and `window.BBH_BOOK_VOCAB` (8 books, each an ordered array of
EXISTING lesson/advanced card ids by descending in-book frequency — 81–92%
per-book coverage of that book's distinct content lemmas; the ~8–19%
uncovered are lemmas below the advanced frequency floor or excluded as
proper/gentilic/numeral). `js/domain/deck/filters.js`'s
`resolveBookVocabCards()` resolves `BKV::<book>[::g::<N>]` pseudo-keys to
those ids at deck-build time (never new SETS entries), mirroring the
Greek app's own resolveBookVocabCards/NT_BOOK_VOCAB. Two `<details
class="advanced-section-shell">` sections ("Advanced vocabulary", "Book
Vocab") sit in `index.html` after `#chaptersGrid` — the
`.advanced-section-shell`/`.supplemental-set`/`.advanced-sub-list` CSS was
already present in `styles.css`, dormant since the original Greek→Hebrew
conversion, so no styling work was needed. `js/state/migrations.js`'s
`book-vocab-bk-ids-to-advanced` migration remaps any `bbh-bk-<slug>-
<strongs>`/`bbh-bk-core-<strongs>` marks to `bbh-adv-<strongs>` (dropped if
that Strong's number no longer carries an advanced card). Shipped at
`?v=16`. See `RESTORE.md` for the merged-task summary and self-check
outcomes.

## Addendum (user screenshot, 2026-08-09): task #21 — parsing options desktop layout

Good on phone, sparse on desktop: rows right-pin their controls across the
full panel width leaving dead space. At >=700px: two-column label/control
layout with LEFT-aligned natural-width controls, scope cards in one
auto-fit row, capped select/pill widths. Phone layout untouched. Runs
after task #20 (styles.css collision).

**Status: shipped** (task #21). One `@media (min-width: 700px)` block in
`styles.css`: options rows `justify-content: flex-start` (the stretch was
`space-between` pinning controls to the far edge of the ~860px panel),
selects capped at 28ch, scope grid switched from fixed `repeat(2, 1fr)`
to `repeat(auto-fit, minmax(110px, 160px))` left-justified, root/danger
buttons capped. ≤699px verified pixel-identical (before/after screenshot
pair at 375px + a 699px/700px boundary pair).

## Addendum (user feedback, 2026-08-09): focused-paradigm default label (into task #21)

'None (today's new material)' is opaque. The default (no focused paradigm)
pools the forms newly introduced AT the current lesson; relabel the option
dynamically as 'New in Lesson N' (tracks the lesson selector). Behavior
unchanged.

**Status: shipped** (task #21). `renderFocusedPickerRow` in
`js/ui/parsing.js` now labels the default option
`None (New in Lesson ${state.lesson})` — same `state.lesson` the gate
logic reads, recomputed on every render, `focusedParadigmId` still null.

## Addendum (user feedback, 2026-08-09): grammar shuffle (into task #21)

Grammar quiz question order repeats identically across sessions (the
deterministic bucket ordering has no per-session entropy). Fix: fresh
session seed at init (PARSING_SESSION_SEED convention — Date.now() once,
never persisted/graded) shuffling WITHIN the unseen/weak/rest priority
buckets; type-interleaving retained.

**Status: shipped, with a corrected diagnosis** (task #21). The premise
was half-wrong: `js/ui/grammar.js`'s `orderQuestionPool` ALREADY
Fisher-Yates-shuffled each priority bucket with
`host.getSessionSeed() + N`, wired to `PARSING_SESSION_SEED` since PR C —
per-page-load shuffling existed all along (verified empirically on the
live 300-question bank). The gap that actually matched the user's report:
the seed is captured once per app LOAD, and an installed PWA can keep one
load resident for days, so re-opening the quiz in the same resident load
replayed the identical order. Fix (main.js only, no module-boundary
changes): a `grammarEntropy` value re-rolled on every transition INTO
grammar mode in `syncLayoutVisibility`, XORed into the seed
`configureGrammar` provides — fresh order per quiz visit, stable within a
visit, never persisted, ordering-only. Per-question choice order stays
deterministic within the visit (it derives from the same seed).

## Addendum (user policy change, 2026-08-09): Google Analytics reintroduced

The repo owner has reversed the no-telemetry rule and supplied their own
GA4 property (G-J5HGG50J92). Ships with the task-21 release: snippet in
index.html + pages/memorization.html; check_release telemetry check
reworked to REQUIRE exactly G-J5HGG50J92 and FORBID the retired Greek-app
property G-YH11KQB6QX; user-guide privacy copy updated (on-device study
progress unchanged; anonymous usage measurement disclosed); CLAUDE.md
telemetry rule rewritten accordingly. Consent-gating offered, owner to
decide; unconditional load unless requested.

**Status: shipped** (task #22, commit `2d91849`). Snippet live in both
HTML heads; check7 inverted to a pinned-property gate (REQUIRE
`G-J5HGG50J92` loader+config in both pages, FORBID `G-YH11KQB6QX`, any
other GA4 id, and gtag refs outside the two HTML files) and
negative-tested in both directions; user-guide privacy copy + changelog
updated; CLAUDE.md "Telemetry" section records the policy change.
Sandbox note: the snippet's blocked network call surfaces as an env-only
`ERR_TUNNEL_CONNECTION_FAILED` console error in Playwright smokes.

## Addendum (user request, 2026-08-09): task #23 — whole-Tanakh advanced vocab

"Advanced vocab should cover every OT book just as a general memorization
tool." The Advanced-vocabulary frequency buckets stop being scoped to the
8-book Reader corpus: `gen_bbh_advanced_vocab.mjs` now feeds on ALL 39
OSHB books at the same pinned commit (dev-time only, same importer
pipeline), keeping every existing rule — nouns/verbs/adjectives only, no
proper names/gentilics, corpus frequency >= 2, zero overlap with the 209
lesson lemmas, buckets of 100 with sub-groups of 25, `bbh-adv-<strongs>`
ids, excluded from course totals. Because ids are Strong's-keyed, existing
saved marks stay valid with NO migration — only bucket membership shifts
as corpus frequencies re-rank. Book Vocab likewise generalizes to every OT
book (canonical order) since it only links existing cards; per-book
coverage rises with the larger advanced pool. check_release check5c
counts update accordingly.

**Status: implemented, uncommitted** (2026-08-09). `FULL_TANAKH_BOOK_LIST`
(39 codes, canonical Leningrad-Codex/BHS print order sourced from the
pinned checkout's own `structure/OshbVerse/Script/Books.js`) added to
`tools/gen_bbh_advanced_vocab.mjs`, passed into `importReaderCorpus({
books })`; `BOOK_META` grew from 8 to 39 entries in the same order
(existing 8 slugs kept stable), guarded by an `assertBookMetaMatchesFullList()`
drift check. No changes to `tools/import_oshb_reader.mjs`'s own 8-book
`BOOK_LIST` (Reader is untouched — still 8 curated books) or to
`source/bbh/`. Results: 39 buckets / 3,880 advanced cards (was 18/1,726),
5,820/5,820 Strong's glosses resolved (0 missing, well under the 2% miss
budget), Book Vocab 39 books at 78.7–98.7% per-book coverage. Verified
zero of the 1,726 pre-existing `bbh-adv-*` ids dropped (Strong's-keyed ids
are frequency-invariant; script-checked, not eyeballed) and their lemma
text is byte-identical. Generator reruns byte-identical (sha1 x2).
`check_release.mjs` check5c now asserts exact counts (39/3880/39, matching
check5's `=== N` style) — 24 reports, 0 failures. `?v=18`.
index.html/docs/index-structure.md copy updated (whole-Tanakh scope,
3,800+ cards). `scratchpad/smoke_book_vocab.mjs` (39-book-section
assertion added) and `scratchpad/smoke_pr_h.mjs` rerun green (only the
documented env-only GA console-error check fails in both). Spot-check: a
lemma absent from the old 8-book corpus (מְדִינָה "province", Strong
4082) now ranks #6 in Esther's Book Vocab. See `RESTORE.md`'s task-23
entry for the full numbers.

## Addendum (user request, 2026-08-09): task #24 — Reader: more prose + poetry challenge

"Expand reader to other prose books to allow for more variety, maybe
include simpler poetry as a challenge, since that's more intermediate."
Two-part expansion of the curated Reader (still never the textbook's own
Reader): (1) new prose-narrative books — Joshua, 1-2 Kings, Esther — with
strict/guided selections curated into thin gate buckets for variety;
(2) simple poetry (short, high-frequency Psalms — e.g. Ps 1/23/100/117/
121/150 candidates) shipped ONLY as challenge-tier passages
(`reader-ch-*`), labeled as poetry, since poetry's syntax/vocabulary is
intermediate. All new passages follow the wooden-translation policy
(LLM-wooden-reviewed, independently verified against token morphology,
labeled unofficial) and the Strong's gloss pipeline.

## Addendum (user requests + screenshots, 2026-08-09): task #25 — parsing UX round

Four items from live mobile testing: (1) scope card "Focused" renamed
"Lesson focus" (drills a single lesson's material); (2) scope card
"Shuffle" renamed "All to date" (cumulative pool up to the current
lesson) and made the DEFAULT scope for fresh state — display-only
renames, internal keys 'focused'/'shuffle' unchanged, stored user
choices never overridden, default mirrored in all three state sync
points; (3) More-options rows rebuilt as TOGGLE first, then label, then
a NEW (i) info button per option (vocab controlsBar tooltip style), with
the tap area that flips the toggle limited to the toggle CONTROL itself
(user constraint — a tap on/near the (i) must never flip the option;
toggle keeps a >=44px target; (i) is its own tap-guarded target); (4)
mobile Build-mode/root-journey layout bug: journey-map chips and the
drill card share a row and crush into two columns on phones — stack
full-width on narrow viewports for both Parse and Build.

**Status: IMPLEMENTED, UNCOMMITTED (2026-08-09).** All four items shipped
on `claude/new-session-988x25`, working tree left for the orchestrator per
instruction (no commit/push).

1. `js/ui/parsing.js`'s `renderScopeControl` card array relabeled
   (`'Lesson focus'`/`'All to date'`, internal `'focused'`/`'shuffle'` keys
   untouched); added a `title` to each card clarifying scope (Lesson focus
   = current lesson's paradigms only; All to date = full cumulative gated
   pool). The "Focused paradigm" picker-row label and the empty-state
   guidance text were renamed to match. `docs/index-structure.md`'s
   `parsingSection` row and `index.html`'s Parsing user-guide paragraph +
   changelog bullet updated to the new names.
2. Default scope flipped to `shuffleAll: true` (All to date) at all THREE
   sync points that must agree per this module's own header comments:
   `js/state/runtime.js`'s `parsing` default, `js/app/main.js`'s
   mixed-version guard, and `js/state/persistence.js`'s
   `sanitizeParsingState` (which now defaults `shuffleAll` to `true` ONLY
   when the field is missing/invalid — `typeof src.shuffleAll ===
   'boolean' ? src.shuffleAll : true` — so an explicit stored `false`
   from a user who picked Lesson focus survives untouched). The pre-PR-B
   `parsing-state-v1-init` migration seed in `js/state/migrations.js` was
   also updated to `shuffleAll: true` for consistency (a save with no
   `parsing` key at all is the same "never touched Parsing" case the new
   default targets).
3. `js/ui/parsing.js`'s `toggleHtml()` rebuilt: a plain `.parsing-toggle-row`
   `<div>` (no row-level `onclick`) containing, in DOM order, the switch
   itself as a real `<button class="toggle-switch">` (the row's `id` and
   the persistence `onclick` moved here), the `<span class="toggle-text">`
   label, then a new `<button class="toggle-info">` "(i)". The (i) reuses
   the SAME `#toggleInfoOverlay` modal and `showToggleInfo`/
   `closeToggleInfoModal` functions the vocab controlsBar's info buttons
   already use (`main.js`) — `showToggleInfo` was added to
   `GLOBAL_CLICK_HANDLERS` since parsing's rows call it from an
   `onclick="..."` string (cross-module, no new ES import, per the
   module-cache hazard rule). Because the (i) is a DOM *sibling* of the
   switch (not nested inside it), a tap on/near it structurally cannot
   bubble into the switch's click handler — no extra tap-guard JS was
   needed. `styles.css` gained button-element resets on the shared
   `.toggle-switch`/`.toggle-info` classes (safe no-ops on the `<span>`s
   vocab/grammar still use there) and a `.parsing-toggle-row
   .toggle-switch::before` invisible ≥44px hit area scoped to parsing's
   rows only. Wrote one-sentence explanations for all 9 rows (Exclude
   known, Appendix forms, and the 7 axis toggles — the axis toggles use
   an "Ask about `<axis>` when parsing or building a form" template).
4. Root cause: `.parsing-area { display: flex; justify-content: center; }`
   had no explicit `flex-direction`, so whenever a root-journey's
   `.parsing-journey-map` and the drill `.parsing-card` are both present
   (`js/ui/parsing.js`'s `renderParsingArea`: `journeyMapHtml + bodyHtml`,
   two block-level siblings) the default `row` direction split them into
   two flex-shrunk columns. Fix: `@media (max-width: 699px) { .parsing-area
   { flex-direction: column; } }` — stacks map-above/card-below on phones
   in both Parse and Build; `>=700px` keeps the pre-existing row layout
   untouched (task #21's desktop work not regressed — verified by
   comparing computed `flex-direction`/`.parsing-scope-grid` layout against
   a `git worktree` checkout of pre-change `HEAD`).

Verification: `node tools/check_release.mjs` → 24 reports / 0 failures at
`?v=19` (bumped from `?v=18` across `index.html`/`sw.js`/`styles.css`/
`pages/memorization.html`/`docs/index-structure.md`, `CACHE_NAME` synced).
`scratchpad/smoke_parsing.mjs` updated for the renamed scope labels + new
default (added an explicit `clickScopeMode(page, 'Lesson focus')` right
after first entering Parsing mode, since the rest of that file was written
assuming the old Focused-by-default behavior) and reruns with the SAME
4-failure baseline as the unmodified pre-task-25 tree (`(a)` GA
`ERR_TUNNEL_CONNECTION_FAILED` console error, `(b)`/`(i)`/`(j)` a
pre-existing `.mark-easy` selector collision with the Lesson-1/2 alphabet
deck's own "Got it" button — confirmed identical on a `git worktree` of
HEAD, not a regression). New `scratchpad/smoke_task25.mjs` (12 steps, all
green) covers items (a)-(f) of the required verification list, including a
seeded-localStorage check (via `page.addInitScript`, not a same-page
`localStorage.setItem` + `reload` — the latter races a periodic
`usageTick`-driven `saveState()` in this app and silently clobbers the
seed) that a stored `focused` scope survives the new default. Screenshots
in `scratchpad/`: `task25_more_options_375_{before,after}.png`,
`task25_build_journey_375_{before,after}.png` (the before shot reproduces
the reported crush exactly), `task25_build_journey_1280_{before,after}.png`,
`task25_more_options_1280_after.png`.

## Addendum (user request, 2026-08-09): task #26 — toggle alignment app-wide

Apply task #25's toggle-row conventions to EVERY option toggle in every
mode, not just parsing: vocab #controlsBar (Shuffle, Hard review,
Direction, Spaced repetition, 2-month pace, Daily reset), grammar
options, reader options, and any other role="switch" row. Each becomes
TOGGLE control first, then label, then (i) — flip-tap area limited to
the toggle control (>=44px), label inert, (i) a separate tap-guarded
target reusing each toggle's existing explanation text. Extract ONE
shared row pattern from the parsing implementation so all modes render
identically. Button-group prefs (Font, Text size, theme, direction
pills) are not toggles and stay as-is.

**Status: IMPLEMENTED, UNCOMMITTED (2026-08-09).** Shipped on
`claude/new-session-988x25`, working tree left for the orchestrator per
instruction (no commit/push). `js/ui/parsing.js` itself is untouched —
task #26 only generalizes the CSS it already shipped and converts three
OTHER surfaces to the same shape.

1. **Converted-row inventory** — 8 rows total, all now switch-then-label-
   then-(i) in DOM order:
   - Vocab `#controlsBar` (static markup, `index.html`; 6 rows): Shuffle,
     Hard review, English → Hebrew (Direction), Spaced review, 2-month
     pace (Cadence), Daily archive reset. Each row's outer `<div id="...
     Toggle">` (e.g. `#shuffleToggle`) is unchanged and still purely
     drives show/hide (`style.display`, `js/app/main.js`'s
     `syncLayoutVisibility()`); the persisted-choice `onclick`/
     `role="switch"`/`aria-checked` moved onto the switch `<button
     id="...Btn">` (e.g. `#shuffleBtn`) inside it — that split (separate
     row id vs. switch id) is a deliberate vocab-only difference from
     parsing/grammar/reader, needed because these 6 rows individually
     show/hide by id (cadence only while Spaced review is on, daily-reset
     only while it's off).
   - Grammar "Review missed" (`js/ui/grammar.js`'s `toggleHtml()`,
     `#grammarReviewMissedToggle` now on the switch itself, matching
     parsing's own id convention — Grammar has no per-row show/hide need,
     so no separate row id was introduced). Difficulty (All/Core-only)
     stays a plain `.theme-switcher` — 2 named options, not a boolean.
   - Reader "Challenge passages" (`js/ui/reader.js`, new local
     `toggleHtml()`; `#readerChallengeToggle` now on the switch,
     replacing the old single `.reader-challenge-toggle-btn` Shown/Hidden
     text button and its red accent color — every toggle now reads
     consistently gold). Strict-only/Strict+Guided stays a
     `.theme-switcher`.
   - Parsing's own 9 More-options rows: unchanged, already shipped by
     task #25.
2. **Shared-pattern decision:** one CSS shape, `.toggle-row, .parsing-
   toggle-row { cursor: default; ... }` plus the switch's enlarged ≥44px
   tap target, moved out of the "Parsing mode" CSS section into `styles.
   css`'s shared toggle-switch primitives (next to `.toggle-info`) and
   generalized to the `.toggle-row` class name; `.parsing-toggle-row` is
   kept as an identical-rules alias selector so `js/ui/parsing.js`'s own
   (untouched) markup keeps working unchanged. For the JS-rendered modes,
   NO new shared module/export was created (the module-cache hazard rule
   in `CLAUDE.md` argues against a new cross-module import) — grammar.js
   and reader.js each got their OWN local `toggleHtml()` copy (reader.js
   didn't have one before; grammar.js's old button-wrapped version was
   rewritten in place), byte-for-byte the same shape as parsing.js's,
   each carrying a sync comment pointing at the other two copies. Vocab's
   rows are static markup (not JS-rendered), hand-written to the same
   shape directly in `index.html`.
3. **`installToggleInfoButtons()`/`installToggleInfoForContainer()`**
   (`js/app/main.js`): now dead code for `#controlsBar` — every row
   already ships its own `(i)` in markup, so the functions' own
   idempotent `if (label.querySelector('.toggle-info')) return;` guard
   bails on every row. Left in place as a no-op-compatible shim (comment
   added explaining why) rather than deleted, per the module-cache hazard
   rule's "never remove something an older bundle might reference"
   spirit — also acts as a safety net if a future row is ever added to
   `#controlsBar` as plain markup without its own `(i)`.
4. **Verification:**
   - `node tools/check_release.mjs` → 24 reports / 0 failures at `?v=20`
     (bumped from `?v=19` across `index.html`/`sw.js`/`styles.css`/
     `pages/memorization.html`/`docs/index-structure.md`, `CACHE_NAME`
     synced).
   - New `scratchpad/smoke_task26.mjs` (40 steps, all green): for every
     converted row (6 vocab + 1 grammar + 1 reader) — DOM order [switch,
     text, info]; tapping (i) opens `#toggleInfoOverlay` without flipping
     the switch; tapping the switch flips it; tapping the inert label
     does nothing; state (all 6 vocab switches, grammar's, reader's)
     survives a reload. Plus: toggling Spaced review is asserted against
     the PERSISTED `runtime.spacedRepetition` flag (not just
     `aria-checked`) and against a visible consequence (`#cadenceToggle`/
     `#unspacedDailyResetToggle` swapping visibility); toggling Reader's
     Challenge switch is asserted against the challenge-badge count
     actually appearing/disappearing. Screenshots:
     `scratchpad/task26_vocab_controlsbar_{375,1280}.png`,
     `scratchpad/task26_grammar_options_375.png`,
     `scratchpad/task26_reader_options_375.png`.
   - `scratchpad/smoke_task25.mjs` rerun against a fresh `git worktree
     add --detach ... HEAD` (`before_worktree`, created and removed by
     this task per its own instructions) — all 12 steps still green,
     confirming parsing is genuinely untouched.
     `scratchpad/smoke_pr_h.mjs` rerun — same single known-flake failure
     as its documented baseline (GA `ERR_TUNNEL_CONNECTION_FAILED`
     console error in this sandbox, not a product bug).
     `scratchpad/smoke_book_vocab.mjs` also rerun (not a required target,
     but it independently exercised `#shuffleToggle`'s old row-level
     `aria-checked` — updated its one-line selector to `#shuffleBtn` to
     match the new split, then reran green, same single known GA-flake
     failure as its own baseline).
   - One test-harness pitfall found and fixed along the way (not a
     product bug): `js/utils/clickShield.js`'s `shieldClicksBriefly()`
     arms a 350ms window after any modal close (`closeStudySelector()`
     included) that swallows the NEXT real click — including a
     `<summary>`'s native toggle action — to absorb the iOS ghost click.
     `smoke_task26.mjs`'s own deck-loading step originally waited only
     300ms before clicking `#advancedSettingsDetails summary`, landing
     inside that window and silently no-opping the open (the `<details>`
     stayed closed, hidden children still passed DOM-order checks via
     `evaluate()` but failed every `.click()`-based check as "not
     visible"). Fixed by waiting 500ms (matching every other modal-close
     site in this test suite) and making `openAdvancedSettings()`
     retry/assert instead of firing-and-forgetting.
5. **Deviations from the task brief:** none. Every listed row was
   converted; button-groups (Font, Text size, theme switcher, direction/
   difficulty/tier pills) were left alone as instructed.

## Addendum (user directive, 2026-08-09): task #24 runs STAGED

Task #24 (Reader prose/poetry expansion) is staged and committed in
parts so progress survives token-budget exhaustion (user directive).
Each stage is a separate agent run, verified by the orchestrator, then
committed AND pushed to the feature branch when green (branch pushes
don't deploy; only the final PR merge does), with RESTORE.md refreshed
at every checkpoint: (A) importer BOOK_LIST + gate-map/morph coverage
for Josh/1Kgs/2Kgs/Esth/Ps; (B) prose selections curated + scored +
glosses + wooden translations (committable per book); (C) Psalms
challenge-tier passages, poetry-labeled; (D) independent
wooden-translation review, release counts, smokes, ?v=21 bump, PR.

**Status: Stage A IMPLEMENTED, UNCOMMITTED (2026-08-09).** `BOOK_LIST` in
`tools/import_oshb_reader.mjs` extended 8→13 books (`+Josh, 1Kgs, 2Kgs,
Esth, Ps`, codes/slugs matching task #23's `gen_bbh_advanced_vocab.mjs`
`BOOK_META`). Corpus pin re-verified against
`source/bbh/reader/corpus-pin.json`. Gate-map coverage: **0 gaps** in all
5 new books and in the combined 13-book run — the existing per-POS
catch-alls absorb Psalms' poetic register too, same finding as task #14's
prose expansion; no `gate-map.json` edit needed. Lemma audit: combined
top-40 unresolved content lemmas across the 5 books (2,496 candidates
total) written for stage B/C, no overrides added this stage. Regeneration
proof: `js/data/bbh_reader.js` byte-identical across two
`gen_bbh_reader_data.mjs` reruns (sha1-verified) — the 86 existing
selections are untouched, the importer only gained capability.
`check_release.mjs` → 24/0 unchanged, `?v=20` untouched. Only file
touched: `tools/import_oshb_reader.mjs`. Reports:
`scratchpad/task24a_gatemap_gaps.md`, `scratchpad/task24a_lemma_audit.md`
(session scratchpad, not committed).

**Status: Stage B IMPLEMENTED, UNCOMMITTED (2026-08-09).** 12 new PROSE
selections curated into `source/bbh/reader/selections.json` from Joshua/
1 Kings/2 Kings/Esther (2 strict + 1 guided per book), ADDITIONS ONLY —
all 86 pre-existing entries verified byte-identical (zero frozen-score
drift) by diffing a fresh `js/data/bbh_reader.js` regeneration against the
pre-stage-B file. No new `LEMMA_OVERRIDES` entries (every pick already
reached its tier without one). Picks, by bucket-thinness + pedagogical fit
(famous verses like Josh 1:9/24:15/Esth 4:14 don't themselves score
strict/guided — their scoring NEIGHBOR verses were used instead):
- `reader-josh-9-3` (strict, gate 42, bucket 42-44 — thin) — Gibeonites
  hear what Joshua did to Jericho/Ai.
- `reader-josh-24-28` (strict, gate 35) — Joshua sends the people to their
  inheritance, closing Josh 24's covenant-renewal scene.
- `reader-josh-1-16` (guided, gate 40) — the people's pledge of obedience,
  answering Joshua's commissioning speech.
- `reader-1kgs-2-2` (strict, gate 42, bucket 42-44 — thin) — David's
  charge to Solomon, "be strong, and be a man."
- `reader-1kgs-3-19` (strict, gate 35) — Solomon's judgment narrative (the
  child who died in the night).
- `reader-1kgs-19-16` (guided, gate 23, bucket 23-27 — thin, previously
  only 2 guided candidates corpus-wide) — the LORD tells Elijah to anoint
  Elisha as prophet, bridging the Elijah/Elisha material.
- `reader-2kgs-2-22` (strict, gate 37) — Elisha heals the waters at
  Jericho.
- `reader-2kgs-13-22` (strict, gate 20, bucket 20-22 — thin) — Hazael's
  oppression of Israel (historical-summary clause).
- `reader-2kgs-5-19` (guided, gate 39) — Elisha dismisses Naaman, "go in
  peace."
- `reader-esth-2-5` (strict, gate 22, bucket 20-22 — thin) — introduces
  Mordecai the Jew in Susa.
- `reader-esth-4-10` (strict, gate 40) — Esther/Hathach/Mordecai message
  relay, immediately surrounding "for such a time as this" (4:14).
- `reader-esth-4-15` (guided, gate 35) — Esther's reply to Mordecai, same
  relay.

Bucket coverage before→after (strict+guided count; buckets 15-19/28-31/
32-34 untouched — no strong short/pedagogical candidate found there in
these 4 books, per "do not force it"): 20-22 6→8, 23-27 6→7, 35-38 23→27,
39-41 7→10, 42-44 6→8. All 12 `wooden` translations author-drafted fresh
from the Hebrew (never copied from/paraphrasing a copyrighted English
Bible), `woodenStatus:"draft"` — matching task 13a's original pre-review
convention (this schema has no separate provenance field; stage D flips
these to `"reviewed"` after independent morphology verification, same as
it did for the original 86). Strong's glosses: **300/300 resolved, 0
missing** (up from 265/265 pre-stage-B — the new selections' distinct
Strong's numbers all already exist in the pinned dictionary).

Also fixed a real product gap surfaced while spot-checking a new
selection in-browser: `js/ui/reader.js`'s `BOOK_NAMES`/`BOOK_ORDER` tables
(Reader book-heading display + grouping order) still only knew the
original 8 books, so Josh/1Kgs/2Kgs/Esth rendered as raw OSIS codes
("Josh", "1Kgs", ...) grouped after every named book instead of "Joshua"/
"1 Kings"/"2 Kings"/"Esther" in canonical order. Added all 5 stage-A books
(including `Ps`, ahead of stage C, so that stage never needs to touch this
file) to both tables — display-only, no schema/data change.

`tools/check_release.mjs` check5b passage count updated 86→98.
Verification: `node tools/validate_bbh_reader_data.mjs` → 6/6 pass
(reproducibility: all 98 selections' scores reproduce exactly from a fresh
import); `node tools/gen_bbh_reader_data.mjs` run twice → byte-identical
(`js/data/bbh_reader.js` sha1 `1d913da6...` both times); `node
tools/check_release.mjs` → 23 reports / 1 failure (`check6: source/bbh/
has uncommitted changes vs git HEAD` — expected while uncommitted, same as
tasks 13/14's own uncommitted-stage runs; resolves to 24/0 once the
orchestrator commits). Playwright: `scratchpad/smoke_reader.mjs` (12
sections, 40 checks) reruns fully green — fixed two pre-existing
env-only flakes found along the way (not product bugs): (1) added a
`page.route` stub for the GA `gtag.js` load, and (2) discovered that
stub alone wasn't sufficient once the app's own service worker takes
control after the smoke's later `page.reload()`s (the SW's own
cache-miss `fetch()` call for gtag.js issues from its own execution
context, which `page.route` doesn't intercept) — fixed by creating the
Playwright context with `serviceWorkers: 'block'` (this smoke tests
Reader UI behavior, not PWA/SW mechanics, so disabling the SW here is
inert to what the file actually covers). A new dedicated spot-check
(`scratchpad/task24b_spotcheck.mjs`) confirms `reader-esth-4-15` renders
correctly end-to-end: Hebrew tokens, a populated gloss popover, and the
wooden-translation reveal with the correct "not yet reviewed" (draft)
caption. Files touched:
`source/bbh/reader/selections.json` (12 new entries + 1 new note,
appended — 86 pre-existing entries untouched), `js/data/bbh_reader.js`
(regenerated), `tools/check_release.mjs` (check5b count), `js/ui/reader.js`
(BOOK_NAMES/BOOK_ORDER fix). NOT committed per orchestrator instruction —
working tree left for the orchestrator. Scratchpad reports
(`task24b_query.mjs`, `task24b_query_out.txt`, `task24b_inspect.mjs`,
`task24b_finalize.mjs`, `task24b_spotcheck.mjs`) live in this session's
scratchpad dir, not the repo. Next: stage C (Psalms challenge-tier
selections, poetry-labeled) and stage D (independent wooden-translation
review flipping all 12 new entries' `woodenStatus` to `"reviewed"`,
release counts, smokes, `?v=21` bump, PR). See RESTORE.md's task-24 stage-B
entry for the full numbers.

**Status: Stage C IMPLEMENTED, UNCOMMITTED (2026-08-09).** 8 new
CHALLENGE-TIER-ONLY Psalms selections (`reader-ch-ps-*` ids) curated into
`source/bbh/reader/selections.json` — the first poetry in the Reader
corpus, additions-only (all 98 pre-existing entries deep-equal
byte-identical after regeneration, verified via `scratchpad/
task24c_diff98.mjs`, 0 mismatches).

Method: every candidate was checked against `scoreVerse()`'s EXISTING
challenge diagnostic (unchanged since task 13a) — `allMapped`,
`unknownContentLexemes<=2`, a lower "in-scope" gate `G>=9` with
`(maxGrammarLesson-G)>=10`, and 1-3 tokens at the verse's own single max
lesson. Of the user-suggested candidate pool (Ps 1, 23, 100, 117, 121,
150), every individual verse was queried (`scratchpad/task24c_query.mjs`,
`task24c_scan2.mjs`): only Psalm 121 produced natural challenge-eligible
verses — 121:2 (unknownContentLexemes 1, gate L22, one Qal participle
עֹשֵׂה "maker of" previewing L42) and 121:8 (unknownContentLexemes 1, gate
L23, two pronoun-suffixed infinitive-construct forms צֵאתְךָ/וּבוֹאֶךָ
previewing L40) — every other verse in that pool (Ps 1:1/1:6, 23:1-6,
100:1-5, 117:1-2, 121:1/3/4/6/7, 150:1-6) either landed in ordinary
strict/guided tier already (no qualifying >=10-lesson single-feature gap)
or exceeded the unknown-lexeme ceiling. Per the task brief's explicit
permission to substitute, a broader scan
(`scratchpad/task24c_scan.mjs`, 113 challenge-eligible candidates <=10
tokens corpuswide, cross-referenced against a "famous chapter" list) found
6 more equally short, equally recognizable psalm verses that DO score
into the challenge shape: Ps 95:3 ("For a great God is YHWH, and a great
king over all gods" — 2 Adjective forms, gate L20/feature L32), Ps 113:5
("Who is like YHWH our God, who makes high to sit" — Hifil participle,
gate L31/feature L42), Ps 113:6 (continues 113:5, "who makes low to see,
in the heavens and in the earth" — Hifil participle, gate L24/feature
L42), Ps 114:1 (the Exodus-Hallel opening, "When Yisrael went out from
Mitsrayim, the house of Yaakov from a people of stammering speech" — Qal
participle, gate L24/feature L42), Ps 130:4 ("For with you is the
forgiveness, so that you may be feared" — Nifal imperfect, gate L22/
feature L37, the Nifal/Hitpael stem floor), Ps 146:1 ("Praise Yah! Praise,
O my soul, YHWH!" — 2 Piel imperative forms, gate L22/feature L39). One
substitution candidate originally considered and rejected: Ps 19:1 (its
own OSHB Hebrew-versification verse is the "To the choirmaster, a psalm
of David" superscription, not the famous "the heavens declare" line,
which is Hebrew Ps 19:2 and does not itself score challenge-eligible) —
swapped for Ps 114:1, a genuinely famous full sentence.

Poetry labeling (user requirement): every new `challengeNote` LEADS with
a plain genre sentence — `"Poetry — Psalm N. Verse structure and word
order differ from prose narrative."` — before the usual future-feature
sentence (e.g. `"Contains 1 Qal participle form (עֹשֵׂה, \"maker of\") —
Participles introduced in Lesson 42."`). This reuses the EXISTING
`.reader-challenge-note` box in `js/ui/reader.js` (line ~636,
unmodified) verbatim — no new UI mechanism, chip, or CSS was added,
per the task brief's own preference; the existing badge + note machinery
already fit. Verified end-to-end with a screenshot
(`scratchpad/task24c_ps121_2_full.png`): opening `Ps 121:2` with the
Challenge toggle on shows the `challenge` tier badge, the
`⚠ Challenge: Poetry — Psalm 121. Verse structure and word order differ
from prose narrative. Contains 1 Qal participle form (עֹשֵׂה, "maker
of") — Participles introduced in Lesson 42.` note box, the Hebrew text,
and (revealed) the wooden translation with its "not yet reviewed" draft
caption.

Wooden translations: all 8 author-drafted fresh from the Hebrew,
`woodenStatus:"draft"` (stage D reviews), following the corpus's existing
house style — `YHWH` for the divine name (never "the LORD"),
Hebrew-transliterated proper names (`Yisrael`, `Mitsrayim`, `Yaakov`),
and literal Hebrew word order preserved even where it reads as poetic
inversion (Ps 95:3's verbless "For a great God is YHWH, and a great king
over all gods"; Ps 113:5-6's "who makes high to sit ... who makes low to
see"). No `LEMMA_OVERRIDES` entries added (every pick already reached its
challenge shape without one).

Strong's glosses: 316/316 distinct numbers resolved (0 missing; up from
300/300 pre-stage-C).

`tools/check_release.mjs` check5b passage count updated 98→106.
Verification: `node tools/validate_bbh_reader_data.mjs` → 6/6 pass
(reproducibility: all 106 selections' scores reproduce exactly from a
fresh import, including the challenge sub-object for all 16 challenge-tier
entries); `node tools/gen_bbh_reader_data.mjs` run twice → byte-identical
(`js/data/bbh_reader.js` sha1 `1e1e7008...` both times); the 98
pre-existing passages verified deep-equal byte-identical via a VM-sandboxed
load-and-compare (`scratchpad/task24c_diff98.mjs`) — 0 mismatches; `node
tools/check_release.mjs` → 23 reports / 1 failure (`check6: source/bbh/
has uncommitted changes vs git HEAD` — expected while uncommitted, resolves
to 24/0 once the orchestrator commits). Playwright:
`scratchpad/smoke_reader.mjs` (12 sections, 40 checks) reruns fully green
UNMODIFIED (that file asserts no total-passage-count, so stage C needed no
edits there — confirmed by rerun, including its own book-heading/
Genesis/challenge-toggle checks all still passing with 106 passages
loaded). New `scratchpad/smoke_task24c.mjs` (18 checks, all green):
sanity that exactly 8 `reader-ch-ps-*` passages are registered, all tier
"challenge", all `challengeNote`s prefixed "Poetry —"; at Lesson 22 with
the Challenge toggle OFF no `Ps ...` passage row renders; toggling ON
reveals >=1 `Ps ...` row carrying the challenge badge; opening it shows
the badge in the passage header AND a non-empty `.reader-challenge-note`
containing "Poetry —" and a specific Psalm number; toggling back OFF
hides the `Ps ...` rows again; zero console/page errors accrued across
the whole run. Files touched: `source/bbh/reader/selections.json` (8 new
entries + 1 new note, appended — 98 pre-existing entries untouched),
`js/data/bbh_reader.js` (regenerated), `tools/check_release.mjs` (check5b
count 98→106). NOT committed per orchestrator instruction — working tree
left for the orchestrator. Scratchpad reports (`task24c_query.mjs`,
`task24c_scan.mjs`, `task24c_scan2.mjs`, `task24c_detail.mjs`,
`task24c_detail2.mjs`, `task24c_final.mjs`, `task24c_append.mjs`,
`task24c_diff98.mjs`, `smoke_task24c.mjs`, `task24c_ps121_2_full.png`)
live in this session's scratchpad dir, not the repo. Next: stage D
(independent wooden-translation review flipping all 20 new `draft`
`woodenStatus` fields — 12 from stage B + 8 from stage C — to
`"reviewed"`, release counts, smokes, `?v=21` bump, PR).

**Status: Stage D IMPLEMENTED, UNCOMMITTED (2026-08-09) — TASK #24
COMPLETE pending orchestrator commit+PR.** Independent review (a fresh
reviewer session, not the author of stages B/C) of all 20 `draft`
selections against their own token-level OSHB morphology (person/gender/
number, binyan/stem, conjugation, suffixes, construct chains,
definiteness, word order) plus the corpus's existing house style
(transliterated proper-name conventions already set by earlier reviewed
entries, "And" for wayyiqtol clause-opens, "from with" for מֵאִתּ/מֵעִם,
the copyrighted-phrasing spot-guard).

**Verdict: 13 clean / 7 fixed.** Clean (no change beyond the
`woodenStatus` flip): `reader-josh-9-3`, `reader-josh-24-28`,
`reader-1kgs-2-2`, `reader-1kgs-3-19` ("because she lay on him" closely
matches ESV/NASB — flagged and judged unavoidable, since every major
translation converges on this short causal clause independently, not
evidence of copying; left as literal and accurate), `reader-esth-4-15`,
and all 8 `reader-ch-ps-*` entries (95:3, 113:5, 113:6, 114:1, 121:2,
121:8, 130:4, 146:1 — each checked for the same idiom-convergence
question, e.g. "go in peace"/"your going out and your coming in", and
judged necessary/unavoidable literal renderings, not copied phrasing).
Fixed (7, one line each):
- `reader-josh-1-16`: "and wherever you send us we will go" →
  "and to all that you send us we will go" — restores the Hebrew's own
  parallel structure with clause 1 ("all that you commanded us we will
  do"), which the draft's paraphrase had broken; the paraphrase also
  verbatim-echoed NIV's own wording for this verse (spot-guard hit).
- `reader-1kgs-19-16`: "over Israel" → "over Yisrael" — the corpus
  already established "Yisrael" as its transliteration convention for
  this name in 3 prior reviewed entries (`reader-deut-6-4`,
  `reader-2sam-17-26`, `reader-ch-exod-6-11`); the draft used the English
  form instead.
- `reader-2kgs-13-22`: "oppressed Israel" → "oppressed Yisrael" — same
  fix, same reason.
- `reader-2kgs-2-22`: "So the waters were healed" → "And the waters were
  healed" — the corpus's wayyiqtol clause-opens are 58/58 "And" among
  reviewed entries; this draft's unique "So" also happened to match
  KJV's own "So the waters were healed..." connective exactly.
- `reader-2kgs-5-19`: "went from him" → "went from with him" — the token
  is מֵ/אִתּ/וֹ (מ + אֵת/אִתּ "with" + suffix), and stage C's own
  `reader-ch-ps-121-2` ("My help is from with YHWH") already set the
  "from with" precedent for this exact preposition-chain pattern in this
  same review batch; the draft dropped "with".
- `reader-esth-2-5`: "There was a Jewish man in Susa the citadel..." →
  "A Jewish man was in Susa the citadel..." — the Hebrew here is
  Subject-before-verb (אִישׁ יְהוּדִי הָיָה), not the verb-initial
  וַיְהִי pattern the corpus's existing "there was" renderings correctly
  mirror elsewhere (e.g. `reader-gen-1-13`'s "And there was evening");
  preserving the Hebrew's actual word order also moves the sentence away
  from ESV's own near-identical "there was a Jew in Susa the citadel".
- `reader-esth-4-10`: "commanded him for Mordecai" → "commanded him to
  Mordecai" — אֶל is literally "to"; the immediately following selection
  `reader-esth-4-15` renders the identical construction ("to reply to
  Mordecai") correctly, so this was an internal inconsistency within the
  same 2-verse Esther relay, not just a word-choice call.

**Verification proof.** Field-level diff of a fresh
`node tools/gen_bbh_reader_data.mjs` regeneration against HEAD's
`js/data/bbh_reader.js` (`scratchpad/field_diff.mjs`, a VM-sandboxed
load-and-compare per passage id): exactly the 20 reviewed passages
differ, and for every one of them the ONLY changed keys are `wooden`
and/or `woodenStatus` (7 changed both, 13 changed `woodenStatus` only) —
the other 86 passages, and every other field (`tokens`, `scores`,
`rationale`, `challengeNote`, `gateLesson`, `tier`, ...) on all 106, are
byte-identical, and the top-level `schemaVersion`/`attribution`/
`corpusPin` are unchanged. Two `gen_bbh_reader_data.mjs` reruns produced
byte-identical output both times (sha1 `7b32e2d5fa4dd8d46eaa9e4e4714b44a0e69f837`).

`tools/validate_bbh_reader_data.mjs` gained a new check, `no-draft-wooden`
(the task brief's explicit ask: check whether the validator enforces
reviewed-only, and add it if not — it didn't) — fails release if ANY
selection still carries `woodenStatus:"draft"`. Negative-tested: flipping
one entry back to `"draft"` makes the validator fail with exit code 1 and
the correct message naming the offending id; restoring it passes again
(6→7 report lines, same pass/fail semantics as every other check in the
file). This check runs as one of `tools/check_release.mjs`'s subprocess
checks, so it is release-blocking, not just a standalone dev-tool
warning.

`node tools/check_release.mjs`: on a clean tree (verified via a
`git stash`/`git stash pop` round-trip that fully restored every pending
change afterward — confirmed by `git diff --stat` and the `js/data/
bbh_reader.js` sha1 both matching pre-stash) → **24 reports, 0
failures**. On the actual (intentionally uncommitted) working tree →
same 24 reports minus check6 (`source/bbh/ has uncommitted changes vs
git HEAD`) — the expected, same-as-every-prior-uncommitted-stage state.

`?v=20` → `?v=21` bumped across `index.html`/`sw.js`/`styles.css`/
`pages/memorization.html`/`docs/index-structure.md` (`CACHE_NAME` synced
in `sw.js`). While in `docs/index-structure.md` for the bump, also
corrected two now-stale "52 curated ... passages" mentions (pre-existing
staleness from stages B/C not updating this doc, not new drift from this
stage) to the current 106. User guide (`index.html`) Reader copy updated
in both the mode-description paragraph and the existing 2026-08
changelog entry's Reader bullet (edited in place, no new entry — per
CLAUDE.md's changelog rule): book list now reads Genesis/Ruth/Jonah/
Exodus/Deuteronomy/Judges/Joshua/1&ndash;2 Samuel/1&ndash;2 Kings/Esther;
the Challenge tier's "one passage" wording (now inaccurate — up to 16
challenge passages can be simultaneously visible by Lesson 40, verified
by script) was generalized to "a small number of passages"/"a curated
set of passages"; the Psalms poetry Challenge material is called out
explicitly; and "labeled draft or independently reviewed" was retired in
favor of "independently-reviewed" now that zero drafts remain.

**Playwright.** `scratchpad/smoke_reader.mjs` (12 sections) reruns fully
green at baseline (GA `gtag.js` route stub + `serviceWorkers: 'block'`),
including its own wooden-caption check now reading "Unofficial literal
rendering — machine-drafted, independently reviewed" for a live passage
(previously this ran against a still-draft corpus). `scratchpad/
smoke_task24c.mjs` (18 checks) reruns fully green unmodified. A new ad
hoc spot-check (`scratchpad/spotcheck_fix.mjs`) opened `reader-esth-2-5`
directly via `window.readerOpenPassage()`, revealed its wooden
translation, and confirmed it now renders the FIXED text "A Jewish man
was in Susa the citadel..." (not the pre-review "There was a Jewish
man...") with the "independently reviewed" caption.

Files touched: `source/bbh/reader/selections.json` (20 `woodenStatus`
flips, 7 with corrected `wooden` text), `js/data/bbh_reader.js`
(regenerated), `tools/validate_bbh_reader_data.mjs` (new
`no-draft-wooden` check), `index.html`, `sw.js`, `styles.css`,
`pages/memorization.html`, `docs/index-structure.md`. NOT committed —
per the task brief, stage D is an independent fresh-reviewer pass and
leaves the working tree for the orchestrator to review and commit as the
final piece of the task #24 PR (stages A/B/C are already separate commits
on `claude/new-session-988x25` — `0198a27`/`71ff7e3`/`879ed81` — none yet
merged to `Main`). **Task #24 (Reader prose/poetry expansion, all four
stages) is now functionally complete; only the orchestrator's commit and
PR remain.**
