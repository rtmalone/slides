// Build downloadable PDFs of Reveal.js decks using Reveal's print-pdf mode.
//
//   npm run pdf                       # all decks listed in DECKS
//   npm run pdf -- scoutbook-parents  # just one
//
// Uses the locally installed Google Chrome (no browser download needed).
// Each PDF is written next to its deck, e.g. scoutbook-parents/Scoutbook-Plus-for-Parents.pdf,
// and linked from the deck's "Download PDF" button.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');

const DECKS = {
  'scoutbook-den-leader': 'Scoutbook-Plus-for-Den-Leaders.pdf',
  'scoutbook-parents': 'Scoutbook-Plus-for-Parents.pdf',
};

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

// Minimal static server so the script doesn't depend on one already running.
function serve() {
  const server = createServer(async (req, res) => {
    try {
      let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
      let file = join(ROOT, path);
      if (!file.startsWith(ROOT)) throw new Error('outside root');
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((done) => server.listen(0, '127.0.0.1', () => done(server)));
}

const requested = process.argv.slice(2);
const decks = requested.length ? requested : Object.keys(DECKS);
const unknown = decks.filter((d) => !DECKS[d]);
if (unknown.length) {
  console.error(`Unknown deck(s): ${unknown.join(', ')}. Add them to DECKS in scripts/build-pdfs.mjs.`);
  process.exit(1);
}

const server = await serve();
const { port } = server.address();
const browser = await chromium.launch({ channel: 'chrome' });

try {
  for (const deck of decks) {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/${deck}/?print-pdf`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.Reveal?.isReady());
    await page.evaluate(() => document.fonts.ready);
    const out = join(ROOT, deck, DECKS[deck]);
    await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
    const slides = await page.evaluate(() => Reveal.getTotalSlides());
    console.log(`✓ ${deck}/${DECKS[deck]} (${slides} slides)`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
