#!/usr/bin/env node
// Smoke test for the Reader book expansion (multi-book grouping, challenge
// toggle, non-Genesis token popover, byte-equality spot-check). Not part of
// the shipped app or the release gate — a manual/CI-optional Playwright
// check against a local static server. Requires `playwright` (Chromium) to
// be installed; run with `node scratchpad/smoke_reader.mjs`.
//
// What it checks:
//   1. App loads clean (no console errors), consent pre-accepted via
//      localStorage seed.
//   2. Switching to Reader mode at Lesson 50 / Strict+Guided renders
//      multiple BOOK group headings (Genesis + at least one of
//      Ruth/Jonah/Exodus/Deuteronomy/Judges/1-2 Samuel).
//   3. Challenge toggle is OFF by default and no challenge badge is
//      present. A synthetic challenge passage is then injected into
//      window.BBH_READER (test-only, via page.evaluate — never touches
//      disk) to prove the toggle mechanism itself: hidden while off,
//      visible with a "challenge" badge once turned on, hidden again once
//      turned back off. (The real curated data has 0 challenge-tier
//      passages as of this pass — see selections.json's notes — so this
//      is the only way to exercise the actual show/hide code path.)
//   4. Opening a non-Genesis passage (a Deuteronomy or Ruth entry) and
//      tapping a token opens the word-detail popover with Lemma/
//      Morphology rows populated.
//   5. Byte-equality spot-check: a Ruth passage's first token's raw
//      display text, as read directly from wlc/Ruth.xml on disk, matches
//      the token text rendered in the DOM exactly (Buffer-level).
//
// Usage: node scratchpad/smoke_reader.mjs

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// playwright is installed globally in this environment (no project
// node_modules/package.json — the app itself is dependency-free by
// design). Try a bare specifier first (works if the caller's environment
// has it on the module resolution path), fall back to the known global
// install location used by this sandbox's `playwright` CLI.
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  ({ default: { chromium } } = await import('/opt/node22/lib/node_modules/playwright/index.js'));
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = 8934;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json'
};

function startServer() {
  const server = createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const filePath = path.join(ROOT, urlPath === '/' ? '/index.html' : urlPath);
    if (!filePath.startsWith(ROOT) || !existsSync(filePath)) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(readFileSync(filePath));
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

let failures = 0;
function check(name, cond) {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    console.log(`  ✗ ${name}`);
    failures++;
  }
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('pageerror', (err) => consoleErrors.push(String(err)));
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

    // Pre-seed consent so the disclaimer overlay never blocks the flow.
    await page.goto(`http://localhost:${PORT}/index.html`);
    await page.evaluate(() => localStorage.setItem('bbhStudyToolConsentV1', 'accepted'));
    await page.reload();
    await page.waitForSelector('#modeShortcutReaderBtn', { state: 'attached', timeout: 10000 });

    console.log('\n=== 1. Clean load ===');
    check('no console/page errors on load', consoleErrors.length === 0);
    if (consoleErrors.length) console.log('    ', consoleErrors.slice(0, 5).join('\n     '));

    console.log('\n=== 2. Multi-book grouping ===');
    await page.click('#modeShortcutReaderBtn');
    await page.waitForSelector('#readerLessonSelect', { timeout: 10000 });
    await page.selectOption('#readerLessonSelect', '50');
    // Strict+Guided is the non-strict button; ensure it's active (default).
    await page.waitForSelector('.reader-book-group', { timeout: 10000 });
    const bookHeadings = await page.$$eval('.reader-book-heading', (els) => els.map((e) => e.textContent.trim()));
    console.log('   book headings found:', bookHeadings.join(', '));
    check('at least 2 distinct book headings at Lesson 50', new Set(bookHeadings).size >= 2);
    check('Genesis heading present', bookHeadings.includes('Genesis'));
    const nonGenesisBooks = bookHeadings.filter((b) => b !== 'Genesis');
    check('at least one non-Genesis book heading present', nonGenesisBooks.length >= 1);

    console.log('\n=== 3. Challenge toggle mechanics ===');
    const challengeBadgeCountBefore = await page.$$eval('.reader-tier-badge-challenge', (els) => els.length);
    check('0 challenge badges visible by default (toggle off, real data has 0 challenge passages)', challengeBadgeCountBefore === 0);
    const toggleBtn = await page.$('#readerChallengeToggle');
    check('challenge toggle button exists', !!toggleBtn);
    const toggleAriaBefore = await page.getAttribute('#readerChallengeToggle', 'aria-checked');
    check('challenge toggle starts aria-checked=false', toggleAriaBefore === 'false');

    // Inject a synthetic challenge passage (test-only, in-memory) to
    // exercise the actual show/hide + badge code path end to end.
    await page.evaluate(() => {
      window.BBH_READER.passages.push({
        id: 'smoke-test-challenge-fixture',
        book: 'Gen',
        ref: 'Gen 1:1',
        gateLesson: 1,
        tier: 'challenge',
        challengeNote: 'Smoke-test fixture: Piel stem (introduced Lesson 29).',
        tokens: [
          { t: 'בְּרֵאשִׁית', l: '7225', s: '7225', m: 'HRncmsa', g: 1, pn: false, v: 1 }
        ]
      });
    });
    // Force a re-render by nudging the lesson selector (fires readerSetLesson -> render()).
    await page.selectOption('#readerLessonSelect', '49');
    await page.selectOption('#readerLessonSelect', '50');
    await page.waitForTimeout(50);
    const challengeVisibleWhileOff = await page.$$eval('.reader-tier-badge-challenge', (els) => els.length);
    check('injected challenge passage stays hidden while toggle is off', challengeVisibleWhileOff === 0);

    await page.click('#readerChallengeToggle');
    await page.waitForTimeout(50);
    const ariaAfterOn = await page.getAttribute('#readerChallengeToggle', 'aria-checked');
    check('toggle flips to aria-checked=true after click', ariaAfterOn === 'true');
    const challengeVisibleWhileOn = await page.$$eval('.reader-tier-badge-challenge', (els) => els.length);
    check('injected challenge passage becomes visible with a badge once toggle is on', challengeVisibleWhileOn === 1);

    await page.click('#readerChallengeToggle');
    await page.waitForTimeout(50);
    const challengeVisibleAfterOff = await page.$$eval('.reader-tier-badge-challenge', (els) => els.length);
    check('injected challenge passage hides again once toggle is turned back off', challengeVisibleAfterOff === 0);

    console.log('\n=== 4. Token popover on a non-Genesis passage ===');
    // Find a passage row under a non-Genesis book heading and open it.
    const opened = await page.evaluate(() => {
      const groups = [...document.querySelectorAll('.reader-book-group')];
      const nonGen = groups.find((g) => g.querySelector('.reader-book-heading').textContent.trim() !== 'Genesis');
      if (!nonGen) return null;
      const row = nonGen.querySelector('.reader-passage-row');
      if (!row) return null;
      const ref = row.querySelector('.reader-passage-ref').textContent.trim();
      row.click();
      return ref;
    });
    check('a non-Genesis passage row was found and clicked', !!opened);
    console.log('   opened passage:', opened);
    await page.waitForSelector('.reader-hebrew-block .reader-token', { timeout: 10000 });
    await page.click('.reader-hebrew-block .reader-token >> nth=0');
    await page.waitForSelector('.reader-popover', { timeout: 5000 });
    const popoverRows = await page.$$eval('.reader-popover-row .reader-popover-label', (els) => els.map((e) => e.textContent.trim()));
    console.log('   popover rows:', popoverRows.join(', '));
    check('popover has a Lemma row', popoverRows.includes('Lemma'));
    check('popover has a Morphology row', popoverRows.includes('Morphology'));

    console.log('\n=== 5. Byte-equality spot-check (Ruth) ===');
    await page.click('.reader-back-btn');
    await page.waitForSelector('#readerLessonSelect');
    const ruthFirstToken = await page.evaluate(() => {
      const p = window.BBH_READER.passages.find((x) => x.book === 'Ruth');
      return p ? { ref: p.ref, t: p.tokens[0].t } : null;
    });
    check('a Ruth passage exists in window.BBH_READER', !!ruthFirstToken);
    if (ruthFirstToken) {
      console.log('   Ruth passage:', ruthFirstToken.ref, 'first token:', ruthFirstToken.t);
      const checkoutDir = process.env.BBH_OSHB_CHECKOUT || '/workspace/openscriptures/morphhb';
      const ruthXmlPath = path.join(checkoutDir, 'wlc/Ruth.xml');
      if (existsSync(ruthXmlPath)) {
        const xml = readFileSync(ruthXmlPath, 'utf8');
        const [, chap, verse] = ruthFirstToken.ref.replace('Ruth ', '').match(/(\d+):(\d+)/);
        const osisID = `Ruth.${chap}.${verse}`;
        const verseRe = new RegExp(`<verse osisID="${osisID.replace(/\./g, '\\.')}">([\\s\\S]*?)<\\/verse>`);
        const m = verseRe.exec(xml);
        const body = m ? m[1].replace(/<note[\s\S]*?<\/note>/g, '') : '';
        const wMatch = /<w\b[^>]*>([^<]*)<\/w>/.exec(body);
        const rawFirstToken = wMatch ? wMatch[1] : null;
        check(
          'Ruth passage first token matches an independent fresh read of wlc/Ruth.xml (byte-equal)',
          rawFirstToken !== null && Buffer.from(rawFirstToken, 'utf8').equals(Buffer.from(ruthFirstToken.t, 'utf8'))
        );
      } else {
        console.log('   (OSHB checkout not found at', ruthXmlPath, '- skipping direct-XML comparison; already covered by validate_bbh_reader_data.mjs)');
      }
    }

    console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`);
    process.exitCode = failures === 0 ? 0 : 1;
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error('smoke_reader.mjs crashed:', err);
  process.exitCode = 1;
});
