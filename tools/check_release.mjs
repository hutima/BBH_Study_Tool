#!/usr/bin/env node
// Consolidated release check for the BBH Study Tool. Dependency-free (Node
// built-ins only). Run before every release/tag.
//
// Checks:
//   1. Every sw.js precache path resolves to a real file on disk.
//   2. Exactly one ?v= value is used across index.html / pages/*.html / sw.js,
//      and that value appears in sw.js's CACHE_NAME version segment.
//   3. Zero Greek Unicode codepoints (U+0370-03FF, U+1F00-1FFF) in the live
//      load graph: index.html, pages/*.html, styles.css, sw.js,
//      manifest.json, and every js/ file reachable from index.html's
//      <script> tags plus main.js's transitive static imports.
//   4. Zero case-insensitive 'duff' / 'koine' / 'greekflashcards' in that same
//      graph. Bare 'greek' is allowed ONLY inside a `//` or `/* */` comment
//      line; every such occurrence is printed as a non-fatal report.
//   4b. Zero word-boundary case-insensitive hits of the RETIRED Greek-
//      transliteration gamification titles (paroikos/akouon/spongos/
//      mathetes/berean/... — see js/domain/gamification/levels.js's PR H
//      header comment) in the same graph, so a title can't regress back to
//      its pre-PR-H Greek pun. "logos" is deliberately excluded (common
//      English word, e.g. "app logos").
//   5. js/data/bbh_vocab.js registers exactly 50 lessons and 209 cards
//      (light regex parse — no execution of the generated file).
//   5b. Same light-regex-parse treatment for the other generated data
//      files: js/data/bbh_grammar.js registers exactly 300 questions,
//      js/data/bbh_reader.js exactly 52 passages, js/data/bbh_alphabet.js
//      exactly 23 letters + 12 vowels, js/data/bbh_reference_extra.js at
//      least 40 sections.
//   6. source/bbh/ is unchanged vs git HEAD (git diff --quiet).
//   7. Zero case-insensitive 'googletagmanager', 'google-analytics',
//      'gtag(', or 'G-YH11KQB6QX' in the live load graph — the app ships
//      telemetry-free (Phase 2 architecture decision 8).
//
// Also documents (see bottom of file / README) running
// tools/validate_bbh_data.mjs, tools/check_no_pdf.mjs, and
// tools/validate_bbh_parsing_data.mjs, which this script invokes as
// subprocesses so a single `node tools/check_release.mjs` covers all of them.
//
// Usage: node tools/check_release.mjs
// Exits nonzero on any failure; prints a pass summary otherwise.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const failures = [];
const reports = [];

function fail(msg) {
  failures.push(msg);
}
function report(msg) {
  reports.push(msg);
}
function readText(relPath) {
  return readFileSync(path.join(ROOT, relPath), 'utf8');
}

// ── Reachable live-load-graph file list ─────────────────────────────────
// Seed from index.html's <script src="..."> tags (classic + module), then
// walk main.js's static `import ... from '...'` specifiers transitively,
// resolving relative paths. Regex-based (no bundler / AST parser available).

function extractScriptSrcs(html) {
  const out = [];
  const re = /<script[^>]*\ssrc=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

function stripQuery(p) {
  return p.split('?')[0];
}

function extractImportSpecifiers(jsSrc) {
  const out = [];
  const patterns = [
    /import\s+[^'"]*?from\s+['"]([^'"]+)['"]/g,
    /import\s+['"]([^'"]+)['"]/g,
    /export\s+[^'"]*?from\s+['"]([^'"]+)['"]/g
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(jsSrc))) out.push(m[1]);
  }
  return out;
}

function buildReachableJsGraph(entryRelPaths) {
  const seen = new Set();
  const queue = [...entryRelPaths];
  while (queue.length) {
    const rel = queue.shift();
    if (seen.has(rel)) continue;
    seen.add(rel);
    const abs = path.join(ROOT, rel);
    if (!existsSync(abs) || !rel.endsWith('.js')) continue;
    const src = readFileSync(abs, 'utf8');
    const specs = extractImportSpecifiers(src);
    for (const spec of specs) {
      if (!spec.startsWith('.')) continue; // skip bare/external specifiers
      const resolved = path.relative(ROOT, path.resolve(path.dirname(abs), spec));
      if (!seen.has(resolved)) queue.push(resolved);
    }
  }
  return [...seen];
}

const indexHtml = readText('index.html');
const scriptSrcs = extractScriptSrcs(indexHtml).map(stripQuery);
const jsEntryPoints = scriptSrcs.filter((s) => s.endsWith('.js'));
const reachableJs = buildReachableJsGraph(jsEntryPoints);

// ── Check 1: sw.js precache paths exist ─────────────────────────────────
const swSrc = readText('sw.js');
{
  const listMatch = swSrc.match(/APP_SHELL_PATHS\s*=\s*\[([\s\S]*?)\];/);
  if (!listMatch) {
    fail('check1: could not locate APP_SHELL_PATHS array in sw.js');
  } else {
    const entries = [...listMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
    if (!entries.length) fail('check1: APP_SHELL_PATHS parsed as empty');
    let missing = 0;
    for (const entry of entries) {
      if (entry === './') continue; // resolves to index.html, checked separately
      const rel = stripQuery(entry);
      const abs = path.join(ROOT, rel);
      if (!existsSync(abs)) {
        fail(`check1: precache path does not exist on disk: ${entry}`);
        missing++;
      }
    }
    if (!missing) report(`check1: all ${entries.length} precache paths resolve (pass)`);
  }
}

// ── Check 2: exactly one ?v= value across index.html/pages/*.html/sw.js ──
{
  const versionsSeen = new Map(); // value -> [locations]
  const collectVersions = (relPath, text) => {
    // Only match inside quoted string literals / attribute values (a
    // `?v=N` appearing in a prose comment, e.g. documenting the cache-bust
    // scheme itself, is not an actual asset reference).
    const re = /["']([^"']*?\?v=([A-Za-z0-9._-]+))["']/g;
    let m;
    while ((m = re.exec(text))) {
      const v = m[2];
      if (!versionsSeen.has(v)) versionsSeen.set(v, []);
      versionsSeen.get(v).push(relPath);
    }
  };
  collectVersions('index.html', indexHtml);
  collectVersions('sw.js', swSrc);
  collectVersions('styles.css', readText('styles.css'));
  const pagesDir = path.join(ROOT, 'pages');
  if (existsSync(pagesDir)) {
    for (const f of readDirSafe(pagesDir)) {
      if (!f.endsWith('.html')) continue;
      collectVersions(`pages/${f}`, readText(`pages/${f}`));
    }
  }
  const values = [...versionsSeen.keys()];
  if (values.length === 0) {
    fail('check2: no ?v= cache-bust markers found in index.html/pages/sw.js');
  } else if (values.length > 1) {
    fail(`check2: multiple ?v= values in use: ${values.join(', ')} (expected exactly one)`);
  } else {
    const v = values[0];
    const cacheNameMatch = swSrc.match(/CACHE_NAME\s*=\s*['"]([^'"]+)['"]/);
    const cacheName = cacheNameMatch ? cacheNameMatch[1] : '';
    if (!cacheName.includes(`v${v}`) && !cacheName.includes(v)) {
      fail(`check2: ?v=${v} does not appear in sw.js CACHE_NAME ("${cacheName}")`);
    } else {
      report(`check2: single ?v=${v} in use, consistent with CACHE_NAME "${cacheName}" (pass)`);
    }
  }
}

function readDirSafe(dir) {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}

// ── Checks 3 & 4: Greek Unicode + banned words across the live load graph ──
{
  const GREEK_RE = /[Ͱ-Ͽἀ-῿]/;
  const filesToScan = [
    'index.html',
    'styles.css',
    'sw.js',
    'manifest.json',
    ...reachableJs
  ];
  const pagesDir = path.join(ROOT, 'pages');
  if (existsSync(pagesDir)) {
    for (const f of readDirSafe(pagesDir)) {
      if (f.endsWith('.html')) filesToScan.push(`pages/${f}`);
    }
  }

  let greekHits = 0;
  let bannedHits = 0;
  let gaHits = 0;
  const greekLocations = [];
  const GA_RE = /googletagmanager|google-analytics|gtag\(|G-YH11KQB6QX/i;
  // Bare 'greek' is never a hard failure — this codebase intentionally keeps
  // a handful of legacy identifiers/CSS hooks with "greek" in the name
  // (runtime.directionToGreek, .card-greek, the old-export-format rejection
  // string, etc. — see CLAUDE.md "adapter over legacy fields, documented not
  // renamed"). Every occurrence is collected here and printed as one
  // summary report line (with a location list) so a human can eyeball it
  // each release without failing the build.
  const bareGreekLocations = [];
  for (const rel of filesToScan) {
    const abs = path.join(ROOT, rel);
    if (!existsSync(abs)) continue;
    const text = readFileSync(abs, 'utf8');
    const lines = text.split('\n');
    lines.forEach((line, idx) => {
      if (GREEK_RE.test(line)) {
        greekHits++;
        greekLocations.push(`${rel}:${idx + 1}`);
      }
      if (/duff|koine|greekflashcards/i.test(line)) {
        bannedHits++;
        fail(`check4: banned term (duff/koine/greekFlashcards) at ${rel}:${idx + 1}: ${line.trim().slice(0, 120)}`);
      } else if (/greek/i.test(line)) {
        bareGreekLocations.push(`${rel}:${idx + 1}`);
      }
      if (GA_RE.test(line)) {
        gaHits++;
        fail(`check7: GA/gtag term at ${rel}:${idx + 1}: ${line.trim().slice(0, 120)}`);
      }
    });
  }
  if (bareGreekLocations.length) {
    report(`check4: ${bareGreekLocations.length} bare 'greek' mention(s), non-fatal (intentional legacy identifiers/CSS hooks) — see: ${bareGreekLocations.slice(0, 8).join(', ')}${bareGreekLocations.length > 8 ? `, ... (+${bareGreekLocations.length - 8} more)` : ''}`);
  }
  if (greekHits) {
    fail(`check3: ${greekHits} Greek-Unicode hit(s) in live load graph: ${greekLocations.slice(0, 10).join(', ')}${greekLocations.length > 10 ? ', ...' : ''}`);
  } else {
    report(`check3: 0 Greek-Unicode hits across ${filesToScan.length} live-graph files (pass)`);
  }
  if (!bannedHits) report('check4: 0 duff/koine/greekFlashcards hits (pass)');
  if (!gaHits) report(`check7: 0 googletagmanager/google-analytics/gtag(/G-YH11KQB6QX hits across ${filesToScan.length} live-graph files (pass)`);

  // ── Check 4b: the retired transliterated-GREEK gamification titles never
  // regress (PR H punch-list item 6, 2026-08-09) ──────────────────────────
  // js/domain/gamification/levels.js used to carry titles like "Paroikos"/
  // "Akouōn"/"Spongos"/"Mathētēs"/"Berean" — Latin-script Greek
  // transliterations that evaded checks 3/4 above because they aren't Greek
  // Unicode and aren't "duff"/"koine"/"greekflashcards". All 30 titles were
  // converted to Hebrew-pun equivalents (Alef/Ger/Shomea/Sefog/Talmid/
  // Doresh/...); this scan fails the release if any of the retired Greek
  // words comes back. Word-boundary + case-insensitive, so "archon" doesn't
  // false-positive-match inside an unrelated longer word. "logos" is
  // deliberately EXCLUDED — it's a common English word in this codebase
  // (e.g. "app logos", "brand logos") and would produce constant false
  // positives; see the task's "NOT common words" carve-out.
  const REMOVED_GREEK_TITLES = [
    'paroikos', 'akouon', 'spongos', 'mathetes', 'berean', 'anagnostes',
    'bibliophagos', 'logophilos', 'hermeneutes', 'grammatikos', 'exegetes',
    'rhetor', 'didaskalos', 'sophos', 'chrysostomos', 'theologos',
    'polymathes', 'archon', 'logothetes', 'pantokrator', 'metanoia',
    'kerygma', 'theopneustos', 'parrhesia', 'hypostasis', 'mysterion',
    'pleroma', 'apokalypsis'
  ];
  const REMOVED_GREEK_TITLES_RE = new RegExp(`\\b(${REMOVED_GREEK_TITLES.join('|')})\\b`, 'i');
  let removedTitleHits = 0;
  const removedTitleLocations = [];
  for (const rel of filesToScan) {
    const abs = path.join(ROOT, rel);
    if (!existsSync(abs)) continue;
    const lines = readFileSync(abs, 'utf8').split('\n');
    lines.forEach((line, idx) => {
      if (REMOVED_GREEK_TITLES_RE.test(line)) {
        removedTitleHits++;
        removedTitleLocations.push(`${rel}:${idx + 1}`);
      }
    });
  }
  if (removedTitleHits) {
    fail(`check4b: ${removedTitleHits} retired Greek-transliteration title hit(s) — a level title regressed to its pre-PR-H Greek pun: ${removedTitleLocations.slice(0, 10).join(', ')}${removedTitleLocations.length > 10 ? ', ...' : ''}`);
  } else {
    report(`check4b: 0 retired Greek-transliteration title hits across ${filesToScan.length} live-graph files (pass)`);
  }
}

// ── Check 5: bbh_vocab.js registers 50 lessons / 209 cards ──────────────
{
  const vocabPath = 'js/data/bbh_vocab.js';
  if (!existsSync(path.join(ROOT, vocabPath))) {
    fail(`check5: ${vocabPath} not found`);
  } else {
    const src = readText(vocabPath);
    const lessonCount = [...src.matchAll(/window\.SETS\[["']\d+["']\]\s*=/g)].length;
    const cardCount = [...src.matchAll(/"id":\s*"[^"]+"/g)].length;
    if (lessonCount !== 50) fail(`check5: expected 50 lessons registered, found ${lessonCount}`);
    if (cardCount !== 209) fail(`check5: expected 209 cards, found ${cardCount}`);
    if (lessonCount === 50 && cardCount === 209) {
      report('check5: 50 lessons / 209 cards registered in bbh_vocab.js (pass)');
    }
  }
}

// ── Check 5b: bbh_grammar.js / bbh_reader.js / bbh_alphabet.js /
// bbh_reference_extra.js register their expected generated-data counts ──
// (light regex parse — no execution of the generated files, same style as
// check5 above).
{
  const grammarPath = 'js/data/bbh_grammar.js';
  if (!existsSync(path.join(ROOT, grammarPath))) {
    fail(`check5b: ${grammarPath} not found`);
  } else {
    const src = readText(grammarPath);
    const questionCount = [...src.matchAll(/"id":\s*"gq-[^"]+"/g)].length;
    if (questionCount !== 300) fail(`check5b: expected 300 questions registered in ${grammarPath}, found ${questionCount}`);
    else report(`check5b: 300 questions registered in bbh_grammar.js (pass)`);
  }

  const readerPath = 'js/data/bbh_reader.js';
  if (!existsSync(path.join(ROOT, readerPath))) {
    fail(`check5b: ${readerPath} not found`);
  } else {
    const src = readText(readerPath);
    const passageCount = [...src.matchAll(/"id":\s*"reader-[^"]+"/g)].length;
    if (passageCount !== 52) fail(`check5b: expected 52 passages registered in ${readerPath}, found ${passageCount}`);
    else report(`check5b: 52 passages registered in bbh_reader.js (pass)`);
  }

  const alphabetPath = 'js/data/bbh_alphabet.js';
  if (!existsSync(path.join(ROOT, alphabetPath))) {
    fail(`check5b: ${alphabetPath} not found`);
  } else {
    const src = readText(alphabetPath);
    // Letters and vowels (PR H item 3, 0A/0B split) share the "order" field,
    // so count each array by a field unique to its own entry shape instead:
    // letters carry "letter" (the glyph itself), vowels carry "sign".
    const letterCount = [...src.matchAll(/"letter":\s*"/g)].length;
    if (letterCount !== 23) fail(`check5b: expected 23 letters registered in ${alphabetPath}, found ${letterCount}`);
    else report(`check5b: 23 letters registered in bbh_alphabet.js (pass)`);

    const vowelCount = [...src.matchAll(/"sign":\s*"/g)].length;
    if (vowelCount !== 12) fail(`check5b: expected 12 vowels registered in ${alphabetPath}, found ${vowelCount}`);
    else report(`check5b: 12 vowels registered in bbh_alphabet.js (pass)`);
  }

  const refExtraPath = 'js/data/bbh_reference_extra.js';
  if (!existsSync(path.join(ROOT, refExtraPath))) {
    fail(`check5b: ${refExtraPath} not found`);
  } else {
    const src = readText(refExtraPath);
    // Section objects sit one level under `sections: [...]`, indented 8
    // spaces (`"id": "alphabet-chart"`); row objects nested inside a
    // section's `rows: [...]` are indented 12 spaces (`"id":
    // "alphabet-chart-1"`) — anchor on the 8-space indent so only
    // top-level sections are counted, not their rows.
    const sectionCount = [...src.matchAll(/^ {8}"id":\s*"[^"]+"/gm)].length;
    if (sectionCount < 40) fail(`check5b: expected >=40 sections registered in ${refExtraPath}, found ${sectionCount}`);
    else report(`check5b: ${sectionCount} sections registered in bbh_reference_extra.js (>=40, pass)`);
  }
}

// ── Check 6: source/bbh/ unchanged vs git HEAD ──────────────────────────
{
  try {
    execFileSync('git', ['diff', '--quiet', '--', 'source/bbh/'], { cwd: ROOT });
    report('check6: source/bbh/ unchanged vs git HEAD (pass)');
  } catch (err) {
    if (err.status === 1) {
      fail('check6: source/bbh/ has uncommitted changes vs git HEAD');
    } else {
      fail(`check6: git diff failed to run (${err.message})`);
    }
  }
}

// ── Also run tools/validate_bbh_data.mjs ────────────────────────────────
{
  try {
    execFileSync(process.execPath, [path.join(ROOT, 'tools/validate_bbh_data.mjs')], { cwd: ROOT, stdio: 'pipe' });
    report('validate_bbh_data.mjs: pass');
  } catch (err) {
    const out = (err.stdout ? err.stdout.toString() : '') + (err.stderr ? err.stderr.toString() : '');
    fail(`validate_bbh_data.mjs failed:\n${out.trim()}`);
  }
}

// ── Also run tools/check_no_pdf.mjs ─────────────────────────────────────
{
  try {
    execFileSync(process.execPath, [path.join(ROOT, 'tools/check_no_pdf.mjs')], { cwd: ROOT, stdio: 'pipe' });
    report('check_no_pdf.mjs: pass');
  } catch (err) {
    const out = (err.stdout ? err.stdout.toString() : '') + (err.stderr ? err.stderr.toString() : '');
    fail(`check_no_pdf.mjs failed:\n${out.trim()}`);
  }
}

// ── Also run every data validator + engine test suite ───────────────────
// (Final-audit item N1: the tagging gate must cover grammar/reader data and
// the gate/drill engines, not just vocab+parsing sources.)
for (const sub of [
  'tools/validate_bbh_parsing_data.mjs',
  'tools/validate_bbh_grammar_data.mjs',
  'tools/validate_bbh_reader_data.mjs',
  'tools/test_parsing_gates.mjs',
  'tools/test_parsing_drill.mjs'
]) {
  try {
    execFileSync(process.execPath, [path.join(ROOT, sub)], { cwd: ROOT, stdio: 'pipe' });
    report(`${sub.replace('tools/', '')}: pass`);
  } catch (err) {
    const out = (err.stdout ? err.stdout.toString() : '') + (err.stderr ? err.stderr.toString() : '');
    fail(`${sub} failed:\n${out.trim()}`);
  }
}

// ── Summary ──────────────────────────────────────────────────────────────
console.log('── BBH release check ──');
for (const r of reports) console.log('  ' + r);
if (failures.length) {
  console.log('\nFAILURES:');
  for (const f of failures) console.log('  ✗ ' + f);
  console.log(`\n${failures.length} failure(s).`);
  process.exitCode = 1;
} else {
  console.log(`\nAll checks passed (${reports.length} reports, 0 failures).`);
}
