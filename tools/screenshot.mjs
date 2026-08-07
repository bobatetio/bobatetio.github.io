import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const [url, label] = process.argv.slice(2);
if (!url) {
  console.error('Usage: node screenshot.mjs <url> [label]');
  process.exit(1);
}

const dir = path.resolve('temporary screenshots');
fs.mkdirSync(dir, { recursive: true });

const nextIndex = fs.readdirSync(dir)
  .map((name) => /^screenshot-(\d+)/.exec(name))
  .filter(Boolean)
  .map((m) => Number(m[1]))
  .reduce((max, n) => Math.max(max, n), 0) + 1;

const suffix = label ? `-${label.replace(/[^a-z0-9-_]+/gi, '-').replace(/^-+|-+$/g, '')}` : '';
const file = path.join(dir, `screenshot-${nextIndex}${suffix}.png`);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: file, fullPage: true });
await browser.close();

console.log(file);
