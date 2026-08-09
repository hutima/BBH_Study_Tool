# BBH Phase 2 Recovery Ledger

## Resume status

- Date: 2026-08-09. Sessions 1-2 (Fable orchestrator). Phase 2 COMPLETE
  through PR F pending final merge; this refresh is the release-state ledger.
- Merged to Main: PR #3 (A, 7837ce2), #4 (B, 4f09df4), #5 (hotfix, e6a36f2),
  #6 (C, 2976b6a), #7 (D, ba9d39c), #8 (E, 901ed30). PR F carries the
  cached-upgrade smoke, release-gate extensions, and final-audit fixes.
- The app ships FIVE practice surfaces: Vocabulary (209 cards), Lesson 0
  Alphabet (23 letters, separate from vocab), Parsing (Parse/Build/Mixed),
  Grammar Quiz (300 reviewed questions), Reader (52 OSHB passages) + the
  extended Reference page (42 generated sections). Telemetry-free.
- Opus final audit (1 of 3 budgeted Opus calls used): RELEASE-READY yes,
  zero blockers; its should-fix items (stale ledger D1, quarantine deletion
  D2, release-gate coverage N1, gate-term plurals N2, false comment N3,
  nits) are all closed in PR F except D2 which is executed at PR F merge.
- **PR G merged** as `d2c8401` (PR #10, `?v=7`): parsing depth review
  (docs/bbh-parsing-depth-review.md, Opus-critiqued — 2 of 3 Opus calls
  used), root-journey drills, By-feature scope, mobile parsing IA.
- **PR H merged** as `d9dce4d` (PR #11, `?v=8`): all seven mobile punch-
  list items shipped — presets deduped (14), Lesson 0A/0B split, grammar
  layout root-cause fix, rating-row leak fix, full 30-title Hebrew pun
  ladder (+ release check 4b regression guard), parsing scope card-grid
  restyle. check_release now 21 reports.
- **Task #14 merged** as `ca8838a` (PR #12, `?v=9`): Reader now spans 8
  books (Gen/Ruth/Jonah/Exod/Deut/Judg/1-2Sam), 78 selections (52 Genesis
  byte-identical + 26 new; thin buckets filled), 0 morph coverage gaps,
  +24 lemma overrides, challenge-tier machinery shipped (0 natural
  candidates in all 8 books — documented). Deferred into task #13's pass:
  3 vocab overrides (elohim/erets/tsivvah) that drift 5 frozen Genesis
  scores, re-curate then.
- **Task #16 merged** as `e859aa5` (PR #13, `?v=10`): vowel-deck fixes
  (root causes: highlight underline fusing with niqqud; hardcoded dark
  card bg in light theme), Intl.Segmenter grapheme safety, stacked
  one-handed buttons, decks renamed "Lesson 1 · Alphabet"/"Lesson 2 ·
  Vowel marks" (display-only), vocab grid drops empty L1/L2.
- **Task #17 merged** as `6facb1b` (PR #14, `?v=11`): parsing card
  hierarchy + deterministic romanizer (104/108 CSV style-match, 4
  documented principled mismatches in the generator header).
- **Task #13 merged** as `425a6aa` (PR #15, `?v=12`): full Reader
  overhaul — matcher fixes + re-score (Gen 10:17 strict, Shema tokenizer
  bug fixed), 86 selections incl. 8 curated challenge passages
  (independent diagnostic tier), Strong's glosses 265/265 (+pinned
  openscriptures/strongs @ 0acd2f2), all 86 wooden translations authored
  AND independently reviewed (76 clean/10 fixed), popover pointed-lemma +
  gloss, slash-free rendering, tier captions, self-hiding challenge
  toggle, per-passage reveal labeled unofficial.
- **Task #15 merged** as `9f38396` (PR #16, `?v=13`): 9 advanced decks /
  246 cards ("By book · advanced" + Tanakh core), 209-lesson lemmas
  globally excluded, SRS/export roundtrip verified; fixed an analytics
  course-total leak found en route; check_release now 23 reports.
- **Task #18 merged** as `cfdfbe5` (PR #17, `?v=14`): alphabet/vowel
  practice as in-flow sections (modal retired; legacy exports inert),
  combined 35-item letters+vowels deck, tap-guard audit on all 17 modal
  close buttons, book-deck analytics scoping confirmed at Greek parity
  (due histogram includes book decks; course panels exclude) and
  smoke-locked.
- **Task #19 merged** as `ce07e1b` (PR #18, `?v=15`): Reference mobile
  overhaul — real overflow scrolling w/ sticky first column + fade hint
  (root cause: width:100% squeeze), stacked alphabet/vowel cards on
  phones, sections in textbook lesson order, collapsed-by-default
  <details> with Expand/Collapse-all + localStorage persistence
  (bbhStudyToolReferenceStateV1), source-ref ranges.
- **Tasks #21+#22 merged** as `c6f7f9d` (PR #20, `?v=17` — LIVE release).
  All 22 tracked tasks complete and merged; no agents in flight, no
  pending triggers. Queue empty; possible user-suggested follow-up:
  extending the 8-book corpus (more prose narrative, e.g. 1-2 Kings /
  Joshua / Esther) for Reader + Book Vocab + advanced buckets — offered
  2026-08-09, awaiting user decision. Round detail:
  **#22 GA reintroduction** (`2d91849`): owner's verbatim gtag snippet
  (property `G-J5HGG50J92`) in `index.html` + `pages/memorization.html`
  heads; `check_release.mjs` check7 inverted from "zero GA anywhere" to a
  pinned-property gate (snippet REQUIRED in both pages, retired
  `G-YH11KQB6QX` forbidden, any other GA4 id forbidden, no gtag refs
  outside the two HTML files — negative-tested both directions);
  user-guide privacy copy + changelog bullet updated (page visits only,
  study data on-device); CLAUDE.md telemetry rule rewritten;
  index-structure head map synced.
  **#21 parsing desktop layout + relabel** (agent-implemented, orchestrator
  verified): new `@media (min-width:700px)` block in `styles.css` —
  options rows `justify-content:flex-start`, selects capped 28ch, scope
  grid `auto-fit minmax(110px,160px)` left-justified, root/danger buttons
  capped (≤699px pixel-identical); focused-paradigm default option
  relabeled `None (New in Lesson ${state.lesson})` in
  `js/ui/parsing.js` (label-only, pool unchanged). Item 3 (grammar
  question shuffle): per-load shuffling already existed
  (`orderQuestionPool` Fisher-Yates per priority bucket, seed =
  `PARSING_SESSION_SEED`, verified empirically) — the real gap was that
  one resident PWA load replays one order; fixed with a main.js-local
  `grammarEntropy` re-rolled on each transition into grammar mode
  (XORed into the seed `configureGrammar` provides; never persisted,
  ordering-only, no module-boundary changes).
  Playwright note: the GA snippet's blocked network call in the sandbox
  (`ERR_TUNNEL_CONNECTION_FAILED`) now shows up as an env-only console
  error in smokes — not a product bug; production loads gtag normally.
- **Task #20 merged** as `eac35e7` (PR #19, `?v=16`) —
  advanced vocab reworked to the GREEK-APP model (ad1547e advancedSection/
  bookVocabSection): `tools/gen_bbh_advanced_vocab.mjs` (replaces
  `tools/gen_bbh_book_vocab.mjs`) writes `js/data/bbh_advanced_vocab.js`
  (replaces `bbh_book_vocab.js`) with `window.BBH_ADVANCED_VOCAB` (18
  buckets of 100 = 1,726 `bbh-adv-<strongs>` cards, sub-grouped by 25,
  min corpus freq 2, excluded from course totals but present in selected-
  deck analytics) and `window.BBH_BOOK_VOCAB` (8 books, ordered arrays of
  EXISTING lesson/advanced card ids by descending in-book frequency,
  81–92% per-book coverage; resolved at deck-build time by
  `js/domain/deck/filters.js`'s `resolveBookVocabCards`, never new SETS
  entries). Two `<details>` sections ("Advanced vocabulary", "Book Vocab")
  in `index.html` after `#chaptersGrid`; `.advanced-section-shell` CSS was
  already dormant in `styles.css` from the original Greek→Hebrew
  conversion, so no new CSS was needed. `js/state/migrations.js`'s
  `book-vocab-bk-ids-to-advanced` migrates old `bbh-bk-*` marks to
  `bbh-adv-<strongs>` (dropped if uncarded). `?v=16`; `check_release.mjs`
  check5c rewritten (24 reports / 0 failures). Reworked Playwright smoke
  `scratchpad/smoke_book_vocab.mjs` (8 sections) green; smoke_pr_h,
  smoke_reference, smoke_reader all rerun green; smoke_grammar step (h)
  "export has zero vocab marks to roundtrip" reproduces identically on
  bare `38da39d` (pre-task-20) — pre-existing flake, not a regression.
  Orchestrator re-verified independently before commit: generator
  byte-identical across reruns, check_release 24/0, check_no_pdf pass,
  smoke_book_vocab + smoke_pr_h rerun green.
- **Hazard note resolved (orchestrator):** the task-20 agent flagged
  commits `317dcc6`…`b728dd6` as a "concurrent session" — they are this
  orchestrator session's own ledger commits (task-21/22 scoping), not
  foreign work; the shared working tree is one session, orchestrator +
  delegated agent. The **GA4 reintroduction (property `G-J5HGG50J92`) is
  a direct user instruction** (verbatim snippet supplied 2026-08-09) —
  authorized, not an unverified claim. Shipped as task #22: GA snippet
  in `index.html` + `pages/memorization.html`, `check_release.mjs`
  telemetry check reworked to REQUIRE exactly `G-J5HGG50J92` and FORBID
  the retired `G-YH11KQB6QX`, user-guide privacy copy updated, CLAUDE.md
  telemetry rule rewritten.
- Earlier note superseded: All 18 tracked tasks complete and merged.
  Live release: `?v=14` at `cfdfbe5`. No agents in flight, no pending
  triggers, no user actions owed (default branch = Main verified; support
  follow-up closed per user; two stale merged branches remain deletable
  via GitHub UI only — proxy refuses ref deletions).
- Historical note (13a/13b staging preserved below for archaeology):
  **13a data pipeline DONE (uncommitted — not yet merged)**: gentilic Ng
  now pn-class (isProperName + distinct `gent` flag) and compound-token
  vocab matching (fixes both halves of the Gen 10:17 underline-noise
  report); 3 deferred overrides (elohim 430/erets 776/tsivvah 6680) added,
  freeze lifted; corpus re-scored — 10 of the 78 pre-existing selections
  improved (guided→strict or fewer unknown lexemes), 0 got worse. Found +
  fixed a 4th bug while at it: OSHB's nested `<seg type="x-large">` markup
  (Deut 6:4's Shema) silently dropped 2 tokens from the old regex
  tokenizer — reader-deut-6-4 now correctly has 6 tokens/gate L45.
  Challenge tier reworked as an INDEPENDENT opt-in diagnostic
  (`scores.challenge`, never overrides the primary tier — an early draft
  that checked it first flipped 60+ of the 78 selections into "challenge"
  from ordinary sentence structure); 293 challenge-eligible verses found
  across 7 gate buckets, 8 curated (reader-ch-* ids) → 86 selections total.
  Strong's Hebrew Dictionary pinned (openscriptures/strongs @
  `0acd2f251c2d35ff8db2dece4e0593979d3ac223`, public domain, see corpus-
  pin.json's `strongsPin`) and `tools/gen_strongs_glosses.mjs` added:
  265/265 distinct Strong's numbers across all 86 selections resolved to a
  short modernized gloss (`gl`) + pointed headword (`lx`) per token. All 86
  selections carry an author-drafted `wooden` + `woodenStatus:"draft"`
  literal translation — **NOT YET independently reviewed against token
  morphology; that review is 13b's/a separate agent's job, do not treat
  as verified**. `tools/check_release.mjs` check5b passage count updated
  78→86; validator/generator both green, gen twice byte-identical.
  → **13b UI (not started)**: render-time slash strip; tap gloss +
  pointed-lemma popover, never raw codes; per-passage show/hide wooden
  translation labeled unofficial + still-draft; tier-clarity captions;
  challenge toggle hidden when none at gate; surface the new `gent` flag
  ("gentilic name" label, distinct from a personal/place name).
- **Task #23 IMPLEMENTED, UNCOMMITTED** (whole-Tanakh advanced vocab, user
  request: "Advanced vocab should cover every OT book just as a general
  memorization tool"): `tools/gen_bbh_advanced_vocab.mjs` now feeds on all
  39 OSHB `wlc/*.xml` books (same pinned commit `6a5db284...`, dev-time
  only) instead of the Reader's 8-book subset — `FULL_TANAKH_BOOK_LIST`
  (canonical Leningrad-Codex/BHS print order, verified against the pinned
  checkout's own `structure/OshbVerse/Script/Books.js`), passed into
  `importReaderCorpus({ books: ... })`. Every existing rule unchanged
  (content-class filter N/V/A non-proper/gentilic, min corpus freq 2,
  buckets of 100/sub-groups of 25, `bbh-adv-<strongs>` ids, excluded from
  course totals). New numbers: 39 buckets / **3,880** advanced cards (was
  18/1,726), Strong's glosses **5,820/5,820 resolved (0 missing)**, Book
  Vocab now **39 books** (was 8) at 78–98% per-book coverage (worst: Daniel
  78.7%/Ezra 83.2%, both due to the Aramaic sections' distinct lemma set
  diluting a smaller per-book distinct-lexeme denominator — not a bug).
  Verified: all 1,726 pre-existing `bbh-adv-*` ids present in the new file
  with byte-identical lemma (`g`) text — **zero drops**, confirming no
  migration is needed (Strong's-keyed ids are frequency-invariant).
  Generator reruns byte-identical (sha1-verified twice). `?v=17` → `?v=18`
  across `index.html`/`sw.js`/`styles.css`/`pages/memorization.html`/
  `docs/index-structure.md` (CACHE_NAME synced). `check_release.mjs`
  check5c rewritten to exact counts (39 buckets / 3880 cards / 39 Book
  Vocab entries, matching check5's `=== N` style) — **24 reports, 0
  failures**. index.html's advanced-section blurbs + user-guide copy
  updated ("1,700+" → "3,800+", "8-book"/"OSHB corpus (8 books)" → "whole
  Hebrew Bible (all 39 OSHB Tanakh books)"); `docs/index-structure.md`
  synced. `scratchpad/smoke_book_vocab.mjs` gained an explicit "exactly 39
  Book Vocab book sections render" assertion and reruns green (only the
  known env-only GA `ERR_TUNNEL_CONNECTION_FAILED` console-error check
  fails, as documented); `scratchpad/smoke_pr_h.mjs` reruns green (same
  single known failure). Spot-checked a rare-book lemma NOT reachable
  under the old 8-book corpus: מְדִינָה "province" (Strong 4082,
  `bbh-adv-4082`) now ranks #6 in Esther's own Book Vocab list — Esther's
  signature "127 provinces" term, invisible to the old Genesis/Ruth/Jonah/
  Exod/Deut/Judg/1-2Sam corpus. Files touched: `tools/
  gen_bbh_advanced_vocab.mjs`, `js/data/bbh_advanced_vocab.js`
  (regenerated), `tools/check_release.mjs`, `index.html`, `sw.js`,
  `styles.css`, `pages/memorization.html`, `docs/index-structure.md`,
  `docs/bbh-conversion-plan.md` (task-23 addendum status note),
  `scratchpad/smoke_book_vocab.mjs`. **Now merged** as `f07475b` via PR #21
  (merge commit `3b6e3d4`) — the "NOT committed" note above is superseded.
  Task #24 (Reader prose/poetry expansion) remains queued, untouched by
  this pass.
- **Task #25 IMPLEMENTED, UNCOMMITTED (2026-08-09)** — four user-requested
  parsing UX fixes from live mobile testing, addendum in
  `docs/bbh-conversion-plan.md` (full detail there): (1) scope card
  "Focused" → "Lesson focus" (display-only, internal key unchanged); (2)
  scope card "Shuffle" → "All to date" (display-only) AND made the DEFAULT
  scope for fresh state, mirrored across the three sync points
  (`js/state/runtime.js` default, `js/state/persistence.js`
  `sanitizeParsingState`, `js/app/main.js` mixed-version guard — an
  explicit stored `shuffleAll:false` from a user who picked Lesson focus
  is preserved, only a missing/invalid field defaults to `true` now) plus
  the pre-PR-B migration seed for consistency; (3) More-options rows
  rebuilt as TOGGLE-then-LABEL-then-(i) in DOM order
  (`js/ui/parsing.js`'s `toggleHtml`, reusing the vocab controlsBar's
  `#toggleInfoOverlay`/`showToggleInfo` — added to `GLOBAL_CLICK_HANDLERS`
  — with one-sentence explanations for all 9 rows; the (i) is a DOM
  sibling of the switch so it structurally cannot flip it, no extra
  tap-guard JS needed); (4) root-caused and fixed the mobile Build/root-
  journey crush (`.parsing-area`'s unset `flex-direction` defaulted to
  `row`; `@media (max-width:699px)` now stacks it column, `>=700px`
  unchanged — verified against a `git worktree` of pre-change `HEAD`, task
  #21's desktop work not regressed). `?v=18` → `?v=19` (final step, all
  five files + `CACHE_NAME` synced). `check_release.mjs` → 24/0 unchanged.
  `scratchpad/smoke_parsing.mjs` updated (renamed scope-click targets, one
  new early `clickScopeMode(page, 'Lesson focus')` step since the rest of
  that file assumes the old default) — reruns with the SAME 4-failure
  baseline as the unmodified pre-task-25 tree (documented GA + `.mark-easy`
  selector-collision flakes, confirmed identical via `git worktree`, not a
  regression). New `scratchpad/smoke_task25.mjs` (12 steps) all green.
  Screenshots in `scratchpad/`: `task25_more_options_{375,1280}_*.png`,
  `task25_build_journey_{375,1280}_*.png` (375 before-shot reproduces the
  reported crush exactly). Files touched: `js/ui/parsing.js`,
  `js/state/runtime.js`, `js/state/persistence.js`,
  `js/state/migrations.js`, `js/app/main.js`, `styles.css`, `index.html`,
  `sw.js`, `pages/memorization.html`, `docs/index-structure.md`,
  `docs/bbh-conversion-plan.md`, `scratchpad/smoke_parsing.mjs`,
  `scratchpad/smoke_task21.mjs` (2-line label fix), new
  `scratchpad/smoke_task25.mjs`. NOT committed per orchestrator
  instruction — working tree left for the orchestrator to review/commit.
- **Task #26 IMPLEMENTED, UNCOMMITTED (2026-08-09)** — app-wide toggle-row
  alignment, addendum in `docs/bbh-conversion-plan.md` (full detail
  there): applied task #25's parsing-only TOGGLE-then-LABEL-then-(i) row
  shape to every OTHER option toggle — vocab `#controlsBar` (6 rows:
  Shuffle, Hard review, Direction, Spaced review, 2-month pace, Daily
  archive reset; static markup in `index.html`, row keeps its own id for
  show/hide, switch gets its own separate id for state sync — a
  deliberate vocab-only split from parsing/grammar/reader, who put the id
  directly on the switch), grammar's Review-missed toggle (`js/ui/
  grammar.js`'s `toggleHtml()` rewritten in place), and reader's
  Challenge-passages toggle (`js/ui/reader.js`, new local `toggleHtml()`,
  replacing the old single-button Shown/Hidden control). Shared CSS
  (`.toggle-row, .parsing-toggle-row` — identical rules, old name kept as
  an alias) moved to `styles.css`'s shared toggle-switch primitives;
  `js/ui/parsing.js` itself is UNTOUCHED. `js/app/main.js`'s
  `installToggleInfoButtons()`/`installToggleInfoForContainer()` are now
  dead code for `#controlsBar` (kept as a no-op shim, not deleted — every
  row ships its own `(i)` in markup now, so their idempotent guard bails
  every time). `?v=19` → `?v=20` (final step, all five files + CACHE_NAME
  synced). `check_release.mjs` → 24/0 unchanged. New
  `scratchpad/smoke_task26.mjs` (40 steps) all green — covers DOM order,
  (i)-doesn't-flip, switch-flips, label-is-inert, and reload-persistence
  for all 8 converted rows, plus asserts Spaced review's flip against the
  PERSISTED `runtime.spacedRepetition` flag (not just `aria-checked`) and
  a visible consequence (cadence/daily-reset row swap), and Reader's
  Challenge switch against the challenge-badge count actually changing.
  `scratchpad/smoke_task25.mjs` rerun against a fresh `before_worktree`
  (created + removed by this task) — all 12 steps green, confirming
  parsing is genuinely untouched. `scratchpad/smoke_pr_h.mjs` reruns with
  the SAME single known-flake failure as its documented baseline (GA
  `ERR_TUNNEL_CONNECTION_FAILED` console error, sandbox-only, not a
  product bug). `scratchpad/smoke_book_vocab.mjs` (not a required target)
  also rerun after a one-line selector fix (`#shuffleToggle` →
  `#shuffleBtn` for `aria-checked`, matching the new row/switch id split)
  — same single known-flake failure as its own baseline. One test-harness
  bug found and fixed along the way (not a product bug): `smoke_task26.
  mjs`'s own deck-loading step originally waited only 300ms after closing
  the study selector before clicking `#advancedSettingsDetails summary`
  — `js/utils/clickShield.js`'s 350ms post-modal-close click shield was
  still armed and silently swallowed the native `<details>` toggle;
  fixed by waiting 500ms (matching every other modal-close site in the
  suite) and making the open-helper retry/assert. Files touched:
  `index.html`, `js/app/main.js`, `js/ui/grammar.js`, `js/ui/reader.js`,
  `styles.css`, `sw.js`, `pages/memorization.html`,
  `docs/index-structure.md`, `docs/bbh-conversion-plan.md`, `RESTORE.md`,
  new `scratchpad/smoke_task26.mjs`, one-line fix to
  `scratchpad/smoke_book_vocab.mjs`. NOT committed per orchestrator
  instruction — working tree left for the orchestrator to review/commit.
- **Task #26 merged** as `60675d6` (PR #23, merge commit `3d79adf`,
  `?v=20` — LIVE release): app-wide toggle-row alignment (vocab
  `#controlsBar` 6 rows, grammar Review-missed, reader Challenge-passages)
  to task #25's switch-then-label-then-(i) shape; full detail in
  `docs/bbh-conversion-plan.md`'s task-26 addendum (see its "Status:
  IMPLEMENTED, UNCOMMITTED" line, now superseded by this merge).
- **Task #24 STAGE A implemented, uncommitted (2026-08-09)** — importer/
  coverage groundwork only, no new selections, `js/data/bbh_reader.js`
  untouched. `tools/import_oshb_reader.mjs`'s `BOOK_LIST` extended from 8
  to 13 books (`+Josh, 1Kgs, 2Kgs, Esth, Ps`, codes matching task #23's
  `gen_bbh_advanced_vocab.mjs` `BOOK_META` slugs `josh/1kgs/2kgs/esth/ps`),
  plus its header/CLI-usage comments; corpus pin re-verified
  (`/workspace/openscriptures/morphhb` HEAD = `6a5db284c7...`, matches
  `source/bbh/reader/corpus-pin.json`). **Coverage: 0 gate-map gaps** in
  all 5 new books individually and in the combined 13-book run (Josh 658v/
  10,051t, 1Kgs 817v/13,140t, 2Kgs 719v/12,281t, Esth 167v/3,045t, Ps
  2,527v/19,587t — Psalms' poetic register raised no new *morph codes* the
  existing per-POS catch-alls don't already absorb, same finding as task
  #14's 7-book pass). No `gate-map.json` edit needed or made — report at
  `scratchpad/task24a_gatemap_gaps.md` (this session's scratchpad, not
  committed). **Lemma audit**: combined top-40 most-frequent unresolved
  content lemmas across the 5 new books with zero `LEMMA_OVERRIDES` entry
  (2,496 candidates total, top 40 tabulated) written to
  `scratchpad/task24a_lemma_audit.md` for stage B/C curation to consume;
  notably poetry-flavored (עוֹלָם, חֶסֶד, הלל, רָשָׁע, אֲדֹנָי) plus
  royal-narrative terms (מָלַךְ, נָבִיא, כִּסֵּא) and Joshua's
  Levitical-city-list-specific מִגְרָשׁ (58/58 occurrences in Joshua
  alone). No overrides added (per instruction — stage B/C's job; none of
  the 40 would have collided with the already-frozen-then-lifted Genesis
  set anyway). **Regeneration proof**: `node tools/gen_bbh_reader_data.mjs`
  run twice, `js/data/bbh_reader.js` byte-identical both times (same sha1
  `4d4689aa...` before/after, `git diff --exit-code` clean) — the 86
  existing selections are unaffected; the importer only gained CAPABILITY.
  `node tools/check_release.mjs` → 24 reports / 0 failures, unchanged from
  before this stage (`?v=20` untouched, check6 confirms `source/bbh/`
  untouched). Only file touched: `tools/import_oshb_reader.mjs`.
- **Task #24 stage B IMPLEMENTED, UNCOMMITTED (2026-08-09)** — 12 new
  PROSE selections curated into `source/bbh/reader/selections.json` from
  Joshua/1 Kings/2 Kings/Esther (2 strict + 1 guided per book; Psalms is
  stage C's job, not touched here), additions-only (86 pre-existing
  entries verified byte-identical, zero frozen-score drift). Full list +
  scores + bucket-coverage before/after in `docs/bbh-conversion-plan.md`'s
  task-24 addendum. No new `LEMMA_OVERRIDES`. All 12 `wooden` translations
  author-drafted, `woodenStatus:"draft"` (stage D reviews + flips to
  `"reviewed"`). Strong's glosses 300/300 resolved (0 missing). Also fixed
  a real gap found while spot-checking: `js/ui/reader.js`'s
  `BOOK_NAMES`/`BOOK_ORDER` tables didn't know the 5 stage-A books, so
  Josh/1Kgs/2Kgs/Esth rendered as raw OSIS codes — added all 5 (incl. `Ps`,
  ahead of stage C). `tools/check_release.mjs` check5b passage count
  86→98. Verified: `validate_bbh_reader_data.mjs` 6/6 pass; `gen_bbh_reader
  _data.mjs` byte-identical across 2 reruns; `check_release.mjs` → 23
  reports / 1 failure (`check6: source/bbh/ has uncommitted changes` —
  expected while uncommitted, resolves to 24/0 once committed, same as
  tasks 13/14's own precedent); `scratchpad/smoke_reader.mjs` (12
  sections/40 checks) fully green (fixed two env-only Playwright flakes:
  GA `gtag.js` route stub + `serviceWorkers: 'block'` context, since a
  page-route stub alone doesn't survive the app's own SW taking control
  after this smoke's later reloads); a new
  `scratchpad/task24b_spotcheck.mjs` confirms `reader-esth-4-15` renders
  Hebrew text + gloss popover + wooden-translation reveal correctly.
  Files touched: `source/bbh/reader/selections.json`, `js/data/bbh_reader.js`
  (regenerated), `tools/check_release.mjs`, `js/ui/reader.js`. NOT
  committed per orchestrator instruction — working tree left for the
  orchestrator. Next: stage C (Psalms challenge-tier passages, poetry-
  labeled) and stage D (independent wooden-translation review flipping the
  12 new `woodenStatus` fields to `"reviewed"`, release counts, smokes,
  `?v=21` bump, PR).
- **Queue**: task #24 stage C (Psalms challenge-tier passages), stage D
  (independent wooden-translation review of the 12 stage-B entries,
  release counts, smokes, `?v=21` bump, PR) — staging plan in
  docs/bbh-conversion-plan.md's task-24 addenda.

## Repository and PR state

- Repo: `hutima/BBH_Study_Tool`.
- Intended default/base branch: **`Main`** (exact case) at
  `b70eee8282459ab367d29c2b2f6310ec8345b70d` (the Phase 1 merge, PR #1) plus
  Phase 2 checkpoint commits on top. All Phase 2 PRs target `Main`.
- **Default branch: DONE** — user flipped it; verified 2026-08-09
  (`git ls-remote origin HEAD` → Main; local origin/HEAD updated).
- **GitHub Support follow-up (PR #2 cached refs): CLOSED per user decision
  2026-08-09** — no further action; residual server-side exposure of the
  purged PDF via refs/pull/2 remains documented and accepted.
- Stale clean branches `claude/biblical-hebrew-study-tool-w3khq0`
  (b70eee8) and `claude/bbh-study-tool-conversion-sly7kr` (9b70811) are
  fully merged ancestors of Main; the session git proxy refuses ref
  deletions, so removing them is an optional one-click GitHub-UI cleanup
  for the user.
- Open PRs: none. Merged: PR #1 (Phase 1 conversion), PR #3 (Phase 2 PR A,
  merge commit `7837ce2`). PR #2 was the PDF transport upload; its content
  is purged from all branches.
- Feature branch for PR work: `claude/new-session-988x25` (recreated from
  `Main` tip per PR).

## Scope and authorities

- Goal: Phase 2 — lesson-gated Hebrew Parsing, Grammar Quiz, public-text
  Reader (OSHB), vocabulary 191→203 completion, Reference-gap completion,
  GA/telemetry removal, safe v1→v2 PWA upgrade.
- Out of scope: reproducing the textbook's Reader/exercises/translations,
  whole-Bible browsing, general Hebrew parser, any network telemetry,
  Greek axes (tense/voice/mood/case) for Hebrew.
- Authorities: user's PDF of Cook & Holmstedt *Beginning Biblical Hebrew*
  (ISBN 978-0-8010-4886-9, 326 pp; private verification source only, never
  recommitted), Baker eSources all-lessons flashcards (203 terms),
  OSHB `openscriptures/morphhb` (pin TBD in Phase 0).
- The full task spec is the user's Phase 2 orchestration prompt (uploaded
  file, session 1); its rules on axes, gating, distractors, licensing, and
  PR sequence remain binding.

## Decisions locked

1. **Sanitation method:** `git filter-repo 2.47.0 --invert-paths --path
   Hebrew.pdf` was run in a disposable bare clone as proof: the two PDF
   commits prune to empty (mapped to zero) and no other commit content
   changes. Because every repo commit is SSH-signed, filter-repo's
   signature stripping rewrote all 15 SHAs from the root — so pushing its
   output would have needlessly destroyed the reviewed Phase 1 history
   (including `ad1547e`, the behavioral reference for old parsing code).
   The applied rewrite was therefore the equivalent minimal one: force-update
   `Main` and `claude/biblical-hebrew-study-tool-w3khq0` to the untouched
   signed tip `b70eee8`, making the PDF blob unreachable from all branches.
2. **`Paradigms.pdf` (73 KB, blob `8e920f4a…`)** exists in pre-Phase-1
   history (Greek-app import `1ac74a9`, deleted from tree in `9b70811`). It
   is a predecessor-app artifact, not the textbook; purging it was outside
   the authorized exact scope. Left in history; flagged to the user.
3. Recontamination guard = `.gitignore` `/Hebrew.pdf` +
   `tools/check_no_pdf.mjs` (exact path, recorded SHA-256, `%PDF-` magic
   with empty allowlist). To be wired into `tools/check_release.mjs` in PR A.
4. Branch plan: Preflight/checkpoint commits directly on `Main` (explicitly
   authorized); feature work on `claude/new-session-988x25`, PRs target
   `Main`, merge-commit convention, no squash.

## Completed checkpoints

- Preflight 0: PDF quarantined and verified (title/ISBN match), history
  cleaned, refs force-pushed, fresh-clone verified, guard added (`0a5e8be`).
- Phase 0 (`ae376c7`): ledger, Hebrew-axis schemas, OSHB v.2.2 pin
  (`6a5db284c715c18b239422e57bb89684e6a19f00`, shallow checkout lives at
  /workspace/openscriptures/morphhb in this container), PDF page maps —
  lessons: printed=PDF 1:1 (pp. 21–137); appendix a-N = PDF 140+N; Reader
  r-N = PDF 215+N. Full lesson→page TOC index verified.
- PR A / PR #3 merged (`7837ce2`): see Resume status.

## PDF sanitation facts

- Original Git path: repo-root `Hebrew.pdf` (only path; no renames, no LFS,
  no derived images/OCR in history — verified by all-ref object scan).
- SHA-256 `2770611f70c15b79ede260d4838bf455a38de57eaff29c6eb62c253d54f52270`,
  16,937,050 bytes, blob `4cfe3b29fba59111b57305f4fe13979ff6eac0c6`.
- Affected commits: upload `74e8e7387f983908e20c166900bce4e9137074bf`
  (old `Main` tip), merge `3de6dcb186f745c9608643a21409a9c044d2febb`
  (PR #2 merge, old default tip). Both now unreachable from every branch.
- Cleanup: git-filter-repo 2.47.0 equivalence proof + exact-ref force-update
  to `b70eee8` (see Decisions #1). Rewritten remote refs: `refs/heads/Main`,
  `refs/heads/claude/biblical-hebrew-study-tool-w3khq0`.
- Fresh-clone verification (bare clone, all branches): PASS — no `Hebrew.pdf`
  path, no blob `4cfe3b29…`, no LFS pointers, no matching digest.
- **Residual exposure (cannot be fixed by a git rewrite):**
  `refs/pull/2/head` still serves `74e8e73` on GitHub's server, and PR #2's
  cached "Files changed"/raw views may remain reachable. Removing PR refs and
  running server-side GC requires **GitHub Support**; copyrighted material may
  not meet their sensitive-data criteria — if declined, document that
  limitation. No tags, releases, Actions artifacts, or known forks exist
  (verify forks from the GitHub UI; API unavailable in-session).
- Temporary local copy: exists outside the repo in the session container
  (path intentionally not recorded here). If this container is gone, ask the
  user to re-supply the PDF via a non-repository channel — do NOT re-commit
  it. Delete the temp copy + its directory before final release (PR F).

## Current work and file ownership

- No agents in flight. Task #25 (`cbe0e04`, PR #22, merge `81c8903`) and
  task #26 (`60675d6`, PR #23, merge `3d79adf`) are both merged — `Main`
  is live at `?v=20`. Working tree on `claude/new-session-988x25` (branched
  from `Main` tip `3d79adf`, ledger commit `044de02` on top) carries task
  #24 STAGE A + STAGE B (see the Resume status bullets above and
  docs/bbh-conversion-plan.md's task-24 staging addendum) IMPLEMENTED,
  UNCOMMITTED. Modified: `tools/import_oshb_reader.mjs` (stage A),
  `source/bbh/reader/selections.json` + `js/data/bbh_reader.js`
  (regenerated) + `tools/check_release.mjs` + `js/ui/reader.js` (stage B).
  `?v=` stays `20` (unchanged through stage B, per instruction — bumps at
  stage D). Scratchpad reports (`task24a_gatemap_gaps.md`,
  `task24a_lemma_audit.md`, `task24a_audit.mjs`,
  `task24a_audit_raw.txt`, `task24a_full_report.txt`, `task24b_query.mjs`,
  `task24b_query_out.txt`, `task24b_inspect.mjs`, `task24b_finalize.mjs`,
  `task24b_spotcheck.mjs`) live in this session's scratchpad dir, not the
  repo.

## Content counts

- Vocabulary: 50 lessons, 209 cards (191 legacy ids preserved; adon/adonai
  split keeps its id; 17 glossary-tagged adds; 209-vs-Baker-203 residual
  documented in docs/bbh-vocab-reconciliation.md).
- Alphabet: 23 letters (5 finals). Vowels: 12 entries + 4 sheva rules.
- Parsing: 58 paradigms / 429 forms / 36 lesson gates (all page-sourced,
  independently re-verified; known textbook-internal discrepancy L27 p.81
  holam vs Appendix a-16 patach — lesson page primacy; no printed Hofal
  form exists anywhere in the book — recorded, nothing fabricated).
- Grammar: 300 questions, all reviewStatus=reviewed (300/300 + 125/125
  blind answer agreement across two rounds; anti-giveaway lint zero).
- Reader: 98 passages / 699 tokens (63 strict / 27 guided / 8 challenge;
  spans Gen/Ruth/Jonah/Exod/Deut/Judg/1Sam/2Sam/Josh/1Kgs/2Kgs/Esth as of
  task #24 stage B, uncommitted — see RESTORE.md's task-24 stage-B note).
- Reference: 42 generated sections / 398 rows.

## Tests last run (PR F head)

- node tools/check_release.mjs → 19 reports / 0 failures (now also runs the
  grammar+reader validators and both engine test suites; data-count checks
  300/52/23/≥40; telemetry + PDF guards).
- Playwright: smoke_parsing (a-o), smoke_grammar (a-i), smoke_reader (a-j),
  smoke_pr_e (22 steps), smoke_upgrade (24 asserts: v4 client → v6 deploy,
  mixed-version window clean, update prompt, cache swap, state survival,
  offline reload) — all green, rerun by the orchestrator.

## Blockers and unresolved questions (all user-action or documented)

- USER: flip GitHub default branch to Main (Settings → General) — no API
  path from this session.
- USER (optional): GitHub Support request to drop refs/pull/2 + cached PR
  #2 views still holding the purged PDF server-side; copyright may not
  meet their sensitive-data criteria — document outcome either way.
- Baker/Quizlet egress-blocked → 209-card decision stands unless the user
  supplies the official 203 list (trim is a small, id-preserving change).
- Paradigms.pdf (73KB predecessor artifact) remains in pre-Phase-1 history;
  purging it was outside the authorized exact scope.

## Model/token budget

- Opus: 1 of 3 calls used (final release audit; schema + mid-project audits
  were covered by multi-agent blind-review redundancy at Sonnet tier).
- Session 2 hit one token-limit pause (resumed via send_later); safety
  resume trigger trig_018AcruuPX1b9Tc9jXBDT9ZU may still fire at 07:42Z —
  if Phase 2 is merged when it fires, proceed directly to the follow-up task.

## Next three actions

1. Merge PR F (release hardening + audit fixes) into Main; verify deploy.
2. Delete the PDF quarantine dir (/tmp/bbh-pdf-quarantine.4rfHYP) and
   verify absence; deliver the final Phase 2 handoff report.
3. Begin user follow-up: parsing-vs-Greek review, root-journey drills,
   mobile-first parsing UI simplification (ledger addendum 2026-08-09).

## Resume prompt

Read `RESTORE.md` top to bottom. Verify `git rev-parse Main` ancestry contains
`b70eee8` and that `git ls-files | grep -i pdf` is empty. Check whether GitHub
now reports `Main` as default (if not, remind the user — do not attempt
workarounds). Then continue from "Next three actions" under the user's Phase 2
orchestration prompt rules: PR A first (GA removal + schemas + validators +
gate engine), Sonnet for implementation, Haiku for mechanical scans, Opus
(≤3 total) only for schema review, mid-project audit, final audit. Never
recommit the PDF; run `node tools/check_no_pdf.mjs` before every commit.
