# BBH Phase 2 Recovery Ledger

## Resume status

- Date: 2026-08-08. Session 1 (Fable orchestrator).
- Preflight 0 (PDF purge + clean `Main`) is **complete and verified**; this
  file's commit is the first Phase 2 project commit.
- Current phase: Phase 0 (audit and plan) — starting.

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
- Open PRs: none. Merged: PR #1 (Phase 1 conversion). PR #2 was the PDF
  transport upload; its content is purged from all branches.

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

- Preflight 0 (this commit): PDF quarantined and verified (title/ISBN match),
  history cleaned, refs force-pushed, fresh-clone verified, guard added.

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
- Parsing forms/paradigms: 0. Grammar questions: 0. Reader passages: 0.

## Tests last run

- `node tools/check_no_pdf.mjs` → PASS (and fixture/real-PDF self-tests fail
  as intended).
- Phase 1 checks (`tools/validate_bbh_data.mjs`, `tools/check_release.mjs`):
  not yet rerun this session — run at Phase 0 start.

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

1. Phase 0 audit: rerun Phase 1 validators on `Main`; inventory extension
   seams (`js/ui/navigation.js` no-op hooks, `normalizeStudyMode`) and
   `ad1547e` parsing behaviors via targeted `git show`.
2. Pin OSHB (`openscriptures/morphhb`) release + license; record in
   `source/bbh/reader/corpus-pin.json` draft.
3. Draft parsing/grammar/reader schemas + lesson-gate map
   (`source/bbh/parsing/lesson_gates.json`, `paradigms.json`) and extend
   `docs/bbh-conversion-plan.md` with the Phase 2 ledger.

## Resume prompt

Read `RESTORE.md` top to bottom. Verify `git rev-parse Main` ancestry contains
`b70eee8` and that `git ls-files | grep -i pdf` is empty. Check whether GitHub
now reports `Main` as default (if not, remind the user — do not attempt
workarounds). Then continue from "Next three actions" under the user's Phase 2
orchestration prompt rules: PR A first (GA removal + schemas + validators +
gate engine), Sonnet for implementation, Haiku for mechanical scans, Opus
(≤3 total) only for schema review, mid-project audit, final audit. Never
recommit the PDF; run `node tools/check_no_pdf.mjs` before every commit.
