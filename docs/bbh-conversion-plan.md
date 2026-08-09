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
