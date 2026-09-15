/* audit.mjs — שער לעשר הגרסאות: h1 יחיד · ניגודיות בהרכבת-אלפא · אפס גלישה · אפס שגיאות.
   הרצה: node gen/looks/first10/audit.mjs [--shots] */
import { readdirSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const shots = process.argv.includes('--shots');
if (shots) mkdirSync(join(here, 'shots'), { recursive: true });
const pages = readdirSync(here).filter(f => f.endsWith('.html') && f !== 'index.html').sort();

const CHECK = () => {
  const out = { h1: document.querySelectorAll('h1').length, contrast: [] };
  const nu = c => c.match(/[\d.]+/g).map(Number);
  const mix = (f, b) => { const a = f[3] === undefined ? 1 : f[3]; return [0, 1, 2].map(i => f[i] * a + b[i] * (1 - a)); };
  const lum = c => { const s = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * s[0] + .7152 * s[1] + .0722 * s[2]; };
  const bgOf = el => {
    let cur = el, acc = null;
    while (cur) {
      const c = nu(getComputedStyle(cur).backgroundColor);
      if (c[3] !== 0) acc = acc ? mix(acc, c) : c;
      if (acc && (acc[3] === undefined || acc[3] === 1)) return acc.slice(0, 3);
      cur = cur.parentElement;
    }
    return (acc || [255, 255, 255]).slice(0, 3);
  };
  const seen = new Set();
  document.querySelectorAll('body *').forEach(el => {
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || !el.getClientRects().length) return;
    if (el.closest('[aria-hidden=true]') || el.matches(':disabled,[disabled]')) return;
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const need = (size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5;
    const bg = bgOf(el), fg = mix(nu(cs.color), bg);
    const cr = (Math.max(lum(fg), lum(bg)) + .05) / (Math.min(lum(fg), lum(bg)) + .05);
    const key = el.className + '|' + Math.round(size) + '|' + cs.color;
    if (cr < need && !seen.has(key)) { seen.add(key); out.contrast.push(`${el.tagName.toLowerCase()}.${el.className || '-'} ${size}px=${cr.toFixed(2)}`); }
  });
  return out;
};

const b = await chromium.launch();
let bad = 0;
for (const f of pages) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  await p.goto('file://' + join(here, f));
  await p.waitForTimeout(500);
  const r = await p.evaluate(CHECK);
  const over = {};
  for (const w of [360, 390, 768]) {
    await p.setViewportSize({ width: w, height: 820 });
    await p.waitForTimeout(140);
    over[w] = await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  }
  await p.setViewportSize({ width: 1280, height: 900 });
  if (shots) { await p.waitForTimeout(300); await p.screenshot({ path: join(here, 'shots', f.replace('.html', '.png')), fullPage: true }); }
  const fails = [];
  if (r.h1 !== 1) fails.push('h1=' + r.h1);
  if (r.contrast.length) fails.push('ניגודיות: ' + r.contrast.join(' ; '));
  for (const w of [360, 390, 768]) if (over[w]) fails.push(`גלישה ${w}=${over[w]}`);
  if (errs.length) fails.push('שגיאות: ' + errs.join(' | '));
  bad += fails.length ? 1 : 0;
  console.log((fails.length ? '✗ ' : '✓ ') + f.replace('.html', '').padEnd(13) + (fails.length ? fails.join(' · ') : 'נקי'));
  await p.close();
}
await b.close();
console.log(bad ? `\n${bad} גרסאות עם ממצאים` : `\n${pages.length} גרסאות — נקי`);
process.exit(bad ? 1 : 0);
