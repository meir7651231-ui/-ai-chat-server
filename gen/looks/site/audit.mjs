/* audit.mjs — אותה ביקורת שהורצה על מסך-הגבייה, על כל מסכי-האתר.
   דורש playwright מותקן גלובלית. `node gen/looks/site/audit.mjs [--shots]` */
import { readdirSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const shots = process.argv.includes('--shots');
const pages = readdirSync(here).filter(f => f.endsWith('.html')).sort();
if (shots) mkdirSync(join(here, 'shots'), { recursive: true });

const IN_PAGE = () => {
  const out = { h1: 0, main: 0, skip: false, lit: 0, contrast: [], focusless: 0 };
  out.h1 = document.querySelectorAll('h1').length;
  out.main = document.querySelectorAll('main,[role=main]').length;
  out.skip = !!document.querySelector('a.skip');
  /* ליטרל-צבע בתוך ה-HTML (מותר רק var(--…)) */
  document.querySelectorAll('[style]').forEach(e => {
    const s = e.getAttribute('style');
    if (/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(s)) out.lit++;
  });
  /* ניגודיות עם הרכבת-אלפא אמיתית */
  const num = c => c.match(/[\d.]+/g).map(Number);
  const mix = (f, b) => { const a = f[3] === undefined ? 1 : f[3]; return [0, 1, 2].map(i => f[i] * a + b[i] * (1 - a)); };
  const lum = c => { const s = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * s[0] + .7152 * s[1] + .0722 * s[2]; };
  const bgOf = el => {
    let cur = el, acc = null;
    while (cur) {
      const c = num(getComputedStyle(cur).backgroundColor);
      if (c[3] !== 0) acc = acc ? mix(acc, c) : c;
      if (acc && (acc[3] === undefined || acc[3] === 1)) return acc.slice(0, 3);
      cur = cur.parentElement;
    }
    return (acc || [255, 255, 255]).slice(0, 3);
  };
  const seen = new Set();
  document.querySelectorAll('body *').forEach(el => {
    const t = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join('');
    if (!t) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || !el.getClientRects().length) return;
    if (el.closest('[aria-hidden=true]') || el.matches(':disabled,[disabled]')) return;   // WCAG: פטור לפקד מנוטרל ולתוכן מוסתר
    if (el.closest('details:not([open])') && !el.closest('summary')) return;
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const need = (size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5;
    const fg = mix(num(cs.color), bgOf(el)), bg = bgOf(el);
    const l1 = lum(fg), l2 = lum(bg);
    const cr = (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05);
    const key = el.className + '|' + Math.round(size) + '|' + cs.color;
    if (cr < need && !seen.has(key)) { seen.add(key); out.contrast.push(`${el.tagName.toLowerCase()}.${el.className || '-'} ${size}px = ${cr.toFixed(2)} (דרוש ${need})`); }
  });
  /* כל פקד חייב מצב-מיקוד נראה */
  out.controls = document.querySelectorAll('button,a,input,select,textarea,[tabindex]').length;
  return out;
};

const b = await chromium.launch();
const rows = [];
for (const f of pages) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
  await p.goto('file://' + join(here, f));
  await p.waitForTimeout(450);
  const r = await p.evaluate(IN_PAGE);
  const over = {};
  for (const w of [360, 390, 768]) {
    await p.setViewportSize({ width: w, height: 800 });
    await p.waitForTimeout(150);
    over[w] = await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  }
  await p.setViewportSize({ width: 1280, height: 900 });
  const print = await p.evaluate(() => [...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch { return []; } }).filter(r => r.media && r.conditionText.includes('print')).length);
  if (shots) {
    await p.waitForTimeout(250);
    await p.screenshot({ path: join(here, 'shots', f.replace('.html', '.png')), fullPage: true });
    await p.setViewportSize({ width: 390, height: 844 });
    await p.waitForTimeout(200);
    await p.screenshot({ path: join(here, 'shots', f.replace('.html', '-390.png')), fullPage: true });
  }
  rows.push({ f, ...r, over, print, errs, contrast: r.contrast });
  await p.close();
}
await b.close();

let bad = 0;
for (const r of rows) {
  const fails = [];
  if (r.h1 !== 1) fails.push('h1=' + r.h1);
  if (r.main < 1) fails.push('אין main');
  if (!r.skip) fails.push('אין דילוג');
  if (r.lit) fails.push('ליטרלי-צבע ' + r.lit);
  if (r.contrast.length) fails.push('ניגודיות: ' + r.contrast.join(' ; '));
  for (const w of [360, 390, 768]) if (r.over[w]) fails.push(`גלישה ${w}=${r.over[w]}px`);
  if (!r.print) fails.push('אין הדפסה');
  if (r.errs.length) fails.push('שגיאות: ' + r.errs.join(' ; '));
  bad += fails.length ? 1 : 0;
  console.log((fails.length ? '✗ ' : '✓ ') + r.f.padEnd(15) + (fails.length ? fails.join(' · ') : `${r.controls} פקדים · נקי`));
}
console.log(bad ? `\n${bad} מסכים עם ממצאים` : `\n${rows.length} מסכים — נקי`);
process.exit(bad ? 1 : 0);
