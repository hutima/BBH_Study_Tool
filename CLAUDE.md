# Repository notes for Claude

---

# Status: Phase 2 (Parsing + Grammar + Reader + Content Completion) SHIPPED — as of 2026-08-09

`BBH_Study_Tool` is a Beginning Biblical Hebrew study tool, converted from an
existing Koine Greek study tool
([`hutima/duff_study_tool`](https://github.com/hutima/duff_study_tool) @
`6f13b00`, imported as commit `1ac74a9`). **The Greek→Hebrew conversion is
done, and Phase 2 (lesson-gated Parsing, Grammar Quiz, Reader, and content
completion) has shipped on top of it.** The live app is a four-mode Hebrew
study PWA for lessons 1–50 of John A. Cook & Robert D. Holmstedt, *Beginning
Biblical Hebrew: A Grammar and Illustrated Reader* (Baker Academic):
**Vocabulary** flashcards, **Parsing** drills, a **Grammar** quiz, and a
**Reader** over curated Hebrew Bible passages — plus a standalone **Lesson 0
Alphabet** practice deck and a static **Reference** page.

For the task-by-task history of how this was built (generator → shell prune →
Hebrew presentation → reference page → state/export → checks/docs →
Parsing/Grammar/Reader → content completion), see
`docs/bbh-conversion-plan.md`. For remaining known content gaps in the
Reference page, see `docs/bbh-content-gaps.md`.

## What's live right now

- **Data:** `js/data/bbh_vocab.js` (50 lessons, 209 cards, generated from
  `source/bbh/Beginning_Biblical_Hebrew_Vocabulary_by_Lesson.csv`);
  `js/data/bbh_reference_data.js` + `js/data/bbh_reference_extra.js` (42
  alphabet/vowel/paradigm reference sections) + `js/data/setMeta.js`
  (generated from `source/bbh/Beginning_Biblical_Hebrew_Revision_Guide.md`,
  `source/bbh/alphabet.json`, `source/bbh/vowels.json`,
  `source/bbh/parsing/paradigms.json`); `js/data/bbh_parsing.js`,
  `js/data/bbh_grammar.js`, `js/data/bbh_reader.js` (from their respective
  `source/bbh/{parsing,grammar,reader}/` sources); `js/data/bbh_alphabet.js`
  (Lesson 0 letter inventory, from `source/bbh/alphabet.json`).
- **Study modes:** Vocabulary, Parsing, Grammar, and Reader are all real and
  reachable from the UI (`js/ui/parsing.js`, `js/ui/grammar.js`,
  `js/ui/reader.js`), plus a completely separate **Lesson 0 · Alphabet**
  practice overlay (`js/ui/alphabet.js`) launched from the study selector.
- **Presentation:** RTL Hebrew card faces (`dir="rtl" lang="he"`), a
  pointed/unpointed vowel-points toggle, a transliteration show/hide toggle,
  Hebrew alphabetical sort (`js/utils/hebrewText.js`), and bundled Noto
  Serif/Sans Hebrew webfonts (`fonts/`, OFL-licensed). Reader and Lesson 0
  Alphabet always show pointed text regardless of the vocab display toggles.
- **State/export:** storage key `bbhStudyToolStateV1` (+ `bbhStudyTool*` aux
  keys), export format id `bbh-study-tool-progress-export` at
  `PROGRESS_EXPORT_VERSION` 6 (imports v2–v5 stay backward compatible). No
  migration from the old Greek-app storage keys — this was treated as a
  fresh install. Additive, independent state subtrees: `runtime.parsing`,
  `runtime.grammar`, `runtime.reader`, `runtime.alphabet` — none of them
  touch vocab SRS/marks/progress, and `runtime.alphabet` is never folded
  into any vocab count (stats or export).
- **PWA:** `CACHE_NAME` = `bbh-flashcards-pwa-v6-github-pages`, all asset
  URLs at `?v=6`.
- **Checks:** `node tools/validate_bbh_data.mjs`, `node
  tools/validate_bbh_parsing_data.mjs`, `node tools/check_no_pdf.mjs`, and
  `node tools/check_release.mjs` (consolidated release gate — precache
  paths, single `?v=` value, zero Greek Unicode / zero duff-koine-
  greekFlashcards / zero GA-telemetry strings in the live load graph,
  50-lesson/209-card count, `source/bbh/` untouched; also runs the other
  three as subprocesses). Run `check_release.mjs` before tagging a release.

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

Phase 1's original deferrals (Hebrew Grammar/Parsing, Reader, and the
alphabet/vowel/pronoun/attached-pronoun/strong-verb/derived-binyan/
construct/numeral/segolate paradigm gaps) have all shipped — see
`docs/bbh-content-gaps.md` for the closed-gap list and where each now lives.
What remains genuinely deferred:

- **Unrestricted whole-Bible browsing in Reader.** Reader ships 52 curated,
  lesson-gated passages (`js/data/bbh_reader.js`), not the full OSHB text —
  there is no "browse any verse" mode.
- **Contextual syntax/discourse drills.** Parsing grades only Hebrew
  morphology axes (binyan/stem, conjugation, person/gender/number, state,
  suffix) on isolated forms — never syntax or discourse-level questions (see
  `docs/bbh-conversion-plan.md` "Phase 2 architecture decisions" #1–2).
- **Weak-verb drilling beyond appendix display.** The Piel/Hifil/Nifal/
  Hitpael/Pual recognition forms and paradigm tables are shown for reference
  (Reference page + Parsing's appendix-forms toggle), but there's no
  dedicated weak-root conjugation drill mode yet.
- **English renderings of Reader passages** — POLICY CHANGED by the user
  (2026-08-09, see the conversion-plan addendum): LLM-generated WOODEN
  (literal) verse translations are now permitted, provided they are
  generated at development time with provenance `llm-wooden-reviewed`,
  independently verified against each verse's token morphology before
  shipping, labeled in-app as unofficial literal renderings, and never
  copied from or paraphrasing a copyrighted English Bible translation.
  Planned alongside tap-to-reveal per-token literal glosses (task #13);
  not yet implemented.
- **Full paradigm tables the source guide never printed and that remain
  unverified against the physical textbook** — see the "still open" section
  of `docs/bbh-content-gaps.md` for the exact list.

**Telemetry (owner policy change, 2026-08-09 — reverses Phase 2
architecture decision 8):** the app ships Google Analytics again, on the
owner's OWN GA4 property `G-J5HGG50J92`, added at the owner's explicit
request with an owner-supplied verbatim snippet. Rules, enforced by
`tools/check_release.mjs` check7:

- The gtag.js loader + `gtag('config', 'G-J5HGG50J92')` snippet MUST be
  present in both `index.html` and `pages/memorization.html` (a silent
  drop fails the release).
- The retired inherited property `G-YH11KQB6QX` must never reappear, no
  other GA4 measurement id may appear, and no `gtag(`/`googletagmanager`
  reference may exist outside those two HTML files — app JS stays free of
  telemetry calls; GA sees page visits only, never study data.
- The user guide discloses this (anonymous page-visit stats; study
  progress stays on-device). Keep that disclosure accurate if the
  snippet ever changes.
- "Analytics" elsewhere in this codebase (the Progress overlay,
  `analytics*` ids) still means the local, on-device progress dashboard —
  unrelated to GA.

## Navigation

- **`index.html` structure:** see `docs/index-structure.md` before scanning
  the file. It maps the in-flow `.app` shell, the overlay siblings, and the
  script groups by line range and `id`.

## Maintenance rules

- **Keep `RESTORE.md` current (standing project rule, user-mandated
  2026-08-09).** `RESTORE.md` at the repo root is the durable recovery
  ledger that lets any fresh session resume without re-auditing. Refresh
  and commit it: after every completed task or merged PR (update merged-PR
  list, content counts, tests-last-run, queue/next actions), before every
  expensive or parallel agent delegation, at every phase gate or scope
  change the user requests, and before stopping for any blocker or
  session boundary. Keep it compact (< ~250 lines), factual, free of
  secrets and copyrighted excerpts, and never let it overstate: a stale
  ledger that undersells is a bug; one that oversells is a lie. A session
  that starts on this repo should read `RESTORE.md` first and verify its
  recorded branch/SHA against git before acting.

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

Every asset URL in `index.html` ends in `?v=6` (current release). The same number lives in
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
