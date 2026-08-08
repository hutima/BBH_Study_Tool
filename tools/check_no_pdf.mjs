#!/usr/bin/env node
// Recontamination guard for the purged textbook PDF (Phase 2 Preflight 0).
// Dependency-free (Node built-ins only). Fails (exit 1) when any of:
//   1. The forbidden exact path `Hebrew.pdf` is tracked or staged.
//   2. Any tracked or staged file's SHA-256 matches the recorded digest of
//      the purged upload.
//   3. Any tracked or staged file begins with the `%PDF-` magic bytes and is
//      not in ALLOWED_PDF_PATHS (currently empty — the repo tracks no PDFs).
//
// Usage:
//   node tools/check_no_pdf.mjs                  # scan tracked + staged files
//   node tools/check_no_pdf.mjs --check-file <p> # run the same detection on
//                                                # one file (fixture self-test)
//
// Run as part of `node tools/check_release.mjs` and before every commit that
// touches binary assets.

import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Exact repo-root path of the purged temporary transport upload (PR #2).
const FORBIDDEN_PATHS = ['Hebrew.pdf'];
// SHA-256 of the purged blob's content, recorded during Preflight 0.
const FORBIDDEN_SHA256 = new Set([
  '2770611f70c15b79ede260d4838bf455a38de57eaff29c6eb62c253d54f52270'
]);
// Deliberately tracked PDFs would be listed here after review. None today.
const ALLOWED_PDF_PATHS = new Set();

const failures = [];

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

function isPdfMagic(buf) {
  return buf.length >= 5 && buf.toString('latin1', 0, 5) === '%PDF-';
}

function checkOne(relPath, buf) {
  if (FORBIDDEN_PATHS.includes(relPath)) {
    failures.push(`forbidden path present: ${relPath}`);
  }
  if (FORBIDDEN_SHA256.has(sha256(buf))) {
    failures.push(`file matches purged PDF digest: ${relPath}`);
  }
  if (isPdfMagic(buf) && !ALLOWED_PDF_PATHS.has(relPath)) {
    failures.push(`unexpected PDF magic bytes in unreviewed file: ${relPath}`);
  }
}

const fixtureIdx = process.argv.indexOf('--check-file');
if (fixtureIdx !== -1) {
  const p = process.argv[fixtureIdx + 1];
  if (!p || !existsSync(p)) {
    console.error(`check_no_pdf: --check-file target not found: ${p}`);
    process.exit(2);
  }
  checkOne(path.basename(p), readFileSync(p));
} else {
  const listed = execFileSync(
    'git',
    ['-C', ROOT, 'ls-files', '--cached', '--full-name', '-z'],
    { encoding: 'utf8' }
  );
  const staged = execFileSync(
    'git',
    ['-C', ROOT, 'diff', '--cached', '--name-only', '--diff-filter=d', '-z'],
    { encoding: 'utf8' }
  );
  const files = new Set(
    (listed + '\0' + staged).split('\0').filter((s) => s.length > 0)
  );
  for (const rel of files) {
    const abs = path.join(ROOT, rel);
    if (!existsSync(abs)) continue; // deleted in worktree but still indexed
    checkOne(rel, readFileSync(abs));
  }
}

if (failures.length > 0) {
  console.error('check_no_pdf: FAIL');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('check_no_pdf: PASS (no forbidden path, digest, or PDF magic)');
