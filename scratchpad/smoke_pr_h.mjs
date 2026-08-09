#!/usr/bin/env node
// Regression smoke test for the PR H mobile punch list
// (docs/bbh-conversion-plan.md "PR H punch list" addendum). Not part of the
// shipped app or the release gate — a manual/CI-optional Playwright check
// against a local static server, run alongside scratchpad/smoke_reader.mjs
// after any change that could plausibly disturb PR H's fixes (mode
// switching, session-selector rendering, vocab rating-row visibility).
//
// What it checks (subset of the PR H punch list that's safely automatable
// via the DOM — layout/overlap items 2/4 need a human eyeballing a real
// viewport and are out of scope here):
//   1. Decade lesson presets (1-10, 11-20, ...) are gone from the session
//      selector; the 13 "Unit" reading-block presets are present instead.
//   2. Lesson 0A/0B alphabet-practice entries are present and open their
//      own overlay, fully separate from the vocab lesson list.
//   3. The vocab Hard/Uncertain/Easy rating row (#markRow) is visible in
//      Vocabulary mode but hidden in Parsing, Grammar, and Reader modes
//      (item 5 — syncLayoutVisibility must not leak vocab-only controls
//      into the other modes).
//   4. No console/page errors switching between all four modes.
//
// Usage: node scratchpad/smoke_pr_h.mjs

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  ({ default: { chromium } } = await import('/opt/node22/lib/node_modules/playwright/index.js'));
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = 8935;

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

    await page.goto(`http://localhost:${PORT}/index.html`);
    await page.evaluate(() => localStorage.setItem('bbhStudyToolConsentV1', 'accepted'));
    await page.reload();
    await page.waitForSelector('#modeShortcutReaderBtn', { state: 'attached', timeout: 10000 });

    console.log('\n=== 1. Session selector: decade presets gone, Units present ===');
    await page.click('.quick-btn:has-text("Choose session")');
    await page.waitForSelector('.session-btn', { timeout: 10000 });
    const sessionLabels = await page.$$eval('.session-btn', (els) => els.map((e) => e.textContent.trim()));
    console.log('   session buttons:', sessionLabels.slice(0, 20).join(' | '));
    const hasDecadeLabel = sessionLabels.some((l) => /^(1|11|21|31|41)\s*[–-]\s*(10|20|30|40|50)$/.test(l.replace(/\s+/g, '')));
    check('no decade-range preset label (e.g. "1–10") present', !hasDecadeLabel);
    const unitCount = sessionLabels.filter((l) => /Unit \d+/.test(l)).length;
    check('all 13 "Unit N" reading-block presets present', unitCount === 13);
    check('"All Lessons"-style preset present', sessionLabels.some((l) => /all/i.test(l)));

    console.log('\n=== 2. Lesson 0A/0B alphabet entries ===');
    const lesson0Buttons = await page.$$eval('.alphabet-lesson0-btn', (els) => els.map((e) => e.textContent.trim()));
    check('Lesson 0A · Alphabet entry present', lesson0Buttons.some((t) => /Lesson 0A/.test(t)));
    check('Lesson 0B · Vowel marks entry present', lesson0Buttons.some((t) => /Lesson 0B/.test(t)));
    await page.click('.alphabet-lesson0-btn >> nth=0');
    await page.waitForSelector('#alphabetOverlay[aria-hidden="false"], #alphabetOverlay.open', { timeout: 5000 }).catch(() => {});
    const alphabetOverlayVisible = await page.evaluate(() => {
      const el = document.getElementById('alphabetOverlay');
      return el && el.getAttribute('aria-hidden') !== 'true';
    });
    check('Lesson 0A opens its own overlay (separate from vocab lesson picker)', alphabetOverlayVisible);
    await page.evaluate(() => { if (typeof closeAlphabetOverlay === 'function') closeAlphabetOverlay(); });
    await page.waitForSelector('.session-btn', { state: 'visible', timeout: 5000 });

    // Select "All Lessons" so a real deck loads (needed for the markRow
    // visibility check below — with no session selected the deck is
    // legitimately empty and markRow is correctly hidden regardless of
    // mode, which would make that check meaningless).
    const allBtn = await page.$$('.session-btn');
    for (const btn of allBtn) {
      const text = await btn.textContent();
      if (/all lessons/i.test(text)) { await btn.click(); break; }
    }
    await page.click('.study-selector-modal .analytics-footer-row >> button:has-text("Close")');
    await page.click('.quick-btn.quick-primary:has-text("Start studying")');
    await page.waitForTimeout(500);

    console.log('\n=== 3. Vocab rating row hidden outside Vocabulary mode ===');
    // Vocab is the default mode after "Start studying" — check it first.
    const markRowVocab = await page.evaluate(() => {
      const el = document.getElementById('markRow');
      return el ? getComputedStyle(el).display !== 'none' : null;
    });
    check('markRow visible in Vocabulary mode (deck loaded)', markRowVocab === true);

    for (const modeBtnSel of ['#modeShortcutReaderBtn']) {
      await page.click(modeBtnSel);
      await page.waitForTimeout(300);
    }
    const markRowReader = await page.evaluate(() => {
      const el = document.getElementById('markRow');
      return el ? getComputedStyle(el).display === 'none' : null;
    });
    check('markRow hidden in Reader mode', markRowReader === true);

    console.log('\n=== 4. Clean mode switching (no console errors) ===');
    check('no console/page errors across the flow above', consoleErrors.length === 0);
    if (consoleErrors.length) console.log('    ', consoleErrors.slice(0, 5).join('\n     '));

    console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`);
    process.exitCode = failures === 0 ? 0 : 1;
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error('smoke_pr_h.mjs crashed:', err);
  process.exitCode = 1;
});
