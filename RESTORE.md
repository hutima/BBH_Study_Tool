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
- **In flight: task #20 (last queued)** — advanced vocab reworked to the
  GREEK-APP model (ad1547e advancedSection/bookVocabSection): corpus-wide
  descending-frequency buckets (new bbh-adv-* cards, sub-groups of 25,
  excluded from course totals), Book vocab as sets of 50 per book whose
  entries LINK to existing cards (shared progress, no duplicate ids),
  both as collapsible sections AFTER the manual lesson selection,
  bbh-bk-* marks migrated to bbh-adv-* by Strong's number.
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
- **Queue**: task #15 advanced vocab + vocab-by-book decks.

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

- No agents in flight. Working tree = PR F release candidate.

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
- Reader: 52 passages / 406 tokens (32 strict / 20 guided; 0 natural
  challenge verses in Genesis under policy — documented).
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
