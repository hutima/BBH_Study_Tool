# BBH Phase 2 Recovery Ledger

## Resume status

- Date: 2026-08-08. Session 1 (Fable orchestrator).
- Preflight 0 (PDF purge + clean `Main`) is **complete and verified**.
- Phase 0 (audit/plan/schemas) complete. **PR A merged** as
  `7837ce2` (PR #3): GA removal, parsing validator, lesson-gate engine +
  12 boundary tests, telemetry+PDF release checks, Phase 2 ledger.
- **PR B merged** as `4f09df4` (PR #4): verified parsing inventory
  (58 paradigms / 429 forms / 36 gates, independently re-verified against
  page images), Parse/Build UI, state v2 (+export v3, v2 imports OK),
  parsing analytics, cache `?v=2`. Also fixed a SHIPPED Phase 1 data-loss
  bug (orphan-cleanup migration deleted bbh-* vocab marks on
  import/restore). Playwright smoke steps a–j green, rerun by orchestrator.
- **Hotfix merged** as `e6a36f2` (PR #5, `?v=3`): user hit a frozen app on
  the v1→v2 update. Update prompt was NOT dropped — it was structurally
  fragile (tail of main.js module body). Now extracted to
  `js/pwa/swUpdate.js` (classic script, outside the module graph) + a
  mixed-version guard fills `runtime.parsing` defaults after restore
  (mirrored shape, sync comments both sides). Also carried the grammar
  validator/generator tools (inert).
- Current phase: PR C — Grammar Quiz bank + mode, plus user-requested
  parsing UX round (grouped custom-set picker, 6-choice/all-that-apply
  Build, contrast panel, mixed direction).
- PR C status: 300 questions authored (5 blocks × 60, all lesson pages
  read; fragments + author reports in session scratchpad), blinded via
  deterministic shuffle (key files in scratchpad), 5 blind reviewers +
  1 parsing-UX agent in flight. Next: score verdicts vs keys, fix/rewrite
  defects, merge bank into source/bbh/grammar/questions.json, generate,
  build Grammar mode UI (same seam pattern as Parsing), bump `?v=4`.
- User directives this session: (1) GitHub Pages is the primary deployment —
  app must stay static/build-free/subpath-relative; merging to the default
  branch deploys. (2) Optional lesson grouping by the textbook's 13
  Reading blocks (see ledger addendum) — implement with PR B/C selectors
  and PR E presets.

## Repository and PR state

- Repo: `hutima/BBH_Study_Tool`.
- Intended default/base branch: **`Main`** (exact case) at
  `b70eee8282459ab367d29c2b2f6310ec8345b70d` (the Phase 1 merge, PR #1) plus
  Phase 2 checkpoint commits on top. All Phase 2 PRs target `Main`.
- **USER ACTION REQUIRED:** flip the GitHub default branch to `Main`
  (Settings → General → Default branch, or
  `gh repo edit hutima/BBH_Study_Tool --default-branch Main`). This session's
  GitHub App proxy exposes no repo-settings API, so the cutover could not be
  performed from here. Until flipped, GitHub reports
  `claude/biblical-hebrew-study-tool-w3khq0` as default; it points at the same
  clean commit `b70eee8`, so no contaminated history is default.
- Other branches: `claude/biblical-hebrew-study-tool-w3khq0` = `b70eee8`
  (old default, clean, deletable after the default-branch flip);
  `claude/bbh-study-tool-conversion-sly7kr` = `9b70811` (merged PR #1 head,
  clean, deletable).
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

- Orchestrator only; no agents spawned yet. No files owned by agents.

## Content counts

- Vocabulary: 50 lessons, 191 cards (target 203 after reconciliation).
- Parsing: 58 paradigms, 429 forms, 36 lesson-gate entries — transcribed
  from page images and independently re-verified form-by-form (commit
  `fb5e012`). 24 uncertainties/source-notes carried in scratchpad +
  commit message (key: L27-vs-a-16 niqqud discrepancy; no printed Hofal
  form exists; physical-book spot-checks recommended for a few
  scan-resolution cells).
- Grammar questions: 0. Reader passages: 0.
- Deployment posture: every merge to the default branch deploys via GitHub
  Pages, so each live-graph-changing PR bumps `?v=` + `CACHE_NAME`
  (PR B: 1→2) and updates the sw precache in the same PR.

## Tests last run

- `node tools/check_release.mjs` → all pass (11 reports, 0 failures; includes
  telemetry scan, PDF guard, parsing validator).
- `node tools/test_parsing_gates.mjs` → 12/12 pass.
- `node tools/validate_bbh_data.mjs` → pass (191 cards / 50 lessons).

## Blockers and unresolved questions

- Default-branch flip to `Main`: user action (see Repository state).
- GitHub Support request for PR #2 ref/cached views: user action.
- GitHub Pages: merging to the default branch likely auto-deploys (repo has
  `.nojekyll`, cache name says `github-pages`). Recorded as a consequence of
  merges; user's prompt acknowledges this.

## Model/token budget

- Opus escalations used: 0 of 3.
- Session 1 budget state: healthy at Preflight 0 completion.

## Next three actions

1. PR C — Grammar Quiz: author `source/bbh/grammar/questions.json` in
   lesson-block batches (Sonnet, ≥4 per lesson + ≥10 per 5-lesson
   cumulative block, target ≥300 reviewed); build
   `tools/validate_bbh_grammar_data.mjs` (anti-giveaway lints: length/
   position balance, category-parallel distractors, no all/none-of-above,
   T/F ≤55/45, no leak past gate) + `tools/gen_bbh_grammar_data.mjs`;
   BLIND semantic review by separate agents (prompt+shuffled choices, no
   stored answer); Grammar mode UI on the same seams as Parsing
   (normalizeStudyMode 'grammar', new js/ui/grammar.js, cache `?v=3`).
2. PR D — Reader: `tools/import_oshb_reader.mjs` over the pinned checkout
   (/workspace/openscriptures/morphhb @ v.2.2), OSHB-morph→BBH gate map,
   Strict/Guided/Challenge scoring, curated Genesis-first selections,
   Reader UI + attribution.
3. PR E — content completion: vocab 191→203 (IDs preserved), Lesson 0
   alphabet deck (user request), Reference tables, guidance text; then
   PR F release hardening + Opus final audit + PDF temp-dir deletion.

## Resume prompt

Read `RESTORE.md` top to bottom. Verify `git rev-parse Main` ancestry contains
`b70eee8` and that `git ls-files | grep -i pdf` is empty. Check whether GitHub
now reports `Main` as default (if not, remind the user — do not attempt
workarounds). Then continue from "Next three actions" under the user's Phase 2
orchestration prompt rules: PR A first (GA removal + schemas + validators +
gate engine), Sonnet for implementation, Haiku for mechanical scans, Opus
(≤3 total) only for schema review, mid-project audit, final audit. Never
recommit the PDF; run `node tools/check_no_pdf.mjs` before every commit.
