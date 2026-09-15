/* audit.mjs — השער של האפליקציה. עובר על כל המסלולים ובודק:
   נגישות (h1 · ציוני-דרך · ניגודיות בהרכבת-אלפא · מיקוד) · גלישה ב-360/390/768 ·
   אפס שגיאות · פלטה במקלדת · חסימת-תפקיד · וכלל-מהאפיון שבאמת חוסם.
   הרצה: node gen/looks/app/audit.mjs [--shots]                                  */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const shots = process.argv.includes('--shots');
if (shots) mkdirSync(join(here, 'shots'), { recursive: true });

const ROUTES = ['bait', 'anashim', 'hinuch', 'tzevet', 'gviya', 'trumot', 'ksafim', 'medrash', 'hatzer',
  'hesed', 'tifol', 'shiduch', 'tikshor', 'family/f1', 'student/s5', 'staffp/t2', 'loanp/l1', 'donorp/d0', 'log', 'spec'];

const A11Y = () => {
  const out = { h1: document.querySelectorAll('#app h1').length, main: document.querySelectorAll('main').length, contrast: [], lit: 0, why: document.querySelectorAll('[data-why]').length };
  document.querySelectorAll('#app [style]').forEach(e => { if (/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(e.getAttribute('style'))) out.lit++; });
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
    const t = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).length;
    if (!t) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || !el.getClientRects().length) return;
    if (el.closest('[aria-hidden=true]') || el.matches(':disabled,[disabled]') || el.closest('[hidden]')) return;
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
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errs = [];
p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });
await p.goto('file://' + join(here, 'mosad.html'));
await p.waitForTimeout(600);

let bad = 0;
for (const r of ROUTES) {
  await p.evaluate(x => { location.hash = '#/' + x; }, r);
  await p.waitForTimeout(260);
  const a = await p.evaluate(A11Y);
  const over = {};
  for (const w of [360, 390, 768]) {
    await p.setViewportSize({ width: w, height: 820 });
    await p.waitForTimeout(140);
    over[w] = await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  }
  await p.setViewportSize({ width: 1280, height: 900 });
  await p.waitForTimeout(120);
  if (shots) { await p.screenshot({ path: join(here, 'shots', r.replace('/', '-') + '.png'), fullPage: true }); }
  const f = [];
  if (a.h1 !== 1) f.push('h1=' + a.h1);
  if (a.main !== 1) f.push('main=' + a.main);
  if (a.lit) f.push('ליטרלי-צבע ' + a.lit);
  if (a.contrast.length) f.push('ניגודיות: ' + a.contrast.join(' ; '));
  for (const w of [360, 390, 768]) if (over[w]) f.push(`גלישה ${w}=${over[w]}`);
  bad += f.length ? 1 : 0;
  console.log((f.length ? '✗ ' : '✓ ') + r.padEnd(13) + (f.length ? f.join(' · ') : `${a.why} מספרים עם גזירה · נקי`));
}

/* בדיקות-התנהגות */
const beh = {};
await p.evaluate(() => location.hash = '#/bait'); await p.waitForTimeout(200);
await p.keyboard.press('Control+k'); await p.waitForTimeout(150);
await p.fill('#palq', 'רוזן'); await p.waitForTimeout(160);
beh.palette = await p.evaluate(() => document.querySelectorAll('#palr li').length);
await p.keyboard.press('Enter'); await p.waitForTimeout(260);
beh.jumped = await p.evaluate(() => location.hash.startsWith('#/family/'));
beh.palClosed = await p.evaluate(() => document.getElementById('pal').hidden);
await p.click('[data-pay]'); await p.waitForTimeout(200);
beh.paid = await p.evaluate(() => DB.log[0].what.startsWith('נרשם תשלום'));
await p.click('#undoBtn'); await p.waitForTimeout(200);
beh.undone = await p.evaluate(() => DB.log[0].what.includes('בוטל'));
await p.evaluate(() => location.hash = '#/hesed'); await p.waitForTimeout(280);
beh.ruleBlocks = await p.evaluate(() => {
  const w = DB.loans.find(l => l.guarantors < 2);
  const c = () => document.querySelector('.card[data-id="' + w.id + '"] [data-dir="1"]');
  c().click(); const mid = w.stage; c().click();
  return mid !== w.stage ? 'לא נחסם' : (document.querySelector('.rule') || {}).textContent || 'לא נחסם';
});
await p.keyboard.press('Escape');
await p.selectOption('#role', 'מלמד'); await p.waitForTimeout(250);
await p.evaluate(() => location.hash = '#/gviya'); await p.waitForTimeout(250);
beh.denied = await p.evaluate(() => !!document.querySelector('.deny'));
beh.masked = await p.evaluate(() => { location.hash = '#/family/f1'; return true; });
await p.waitForTimeout(250);
beh.maskedCount = await p.evaluate(() => document.querySelectorAll('#app .masked').length);
await p.selectOption('#role', 'מנהל כללי'); await p.waitForTimeout(200);
beh.reconcile = await p.evaluate(() => totals().due === DB.families.reduce((a, f) => a + discounted(f), 0));

const behFails = [];
if (beh.palette < 2) behFails.push('פלטה לא מצאה');
if (!beh.jumped || !beh.palClosed) behFails.push('Enter בפלטה');
if (!beh.paid) behFails.push('תשלום לא נרשם');
if (!beh.undone) behFails.push('ביטול לא עבד');
if (beh.ruleBlocks === 'לא נחסם') behFails.push('הכלל מהאפיון לא חסם');
if (!beh.denied) behFails.push('חסימת-תפקיד');
if (!beh.maskedCount) behFails.push('הסתרת-כסף');
if (!beh.reconcile) behFails.push('הסכומים לא מתאזנים');
console.log((behFails.length ? '✗ ' : '✓ ') + 'התנהגות'.padEnd(13) +
  (behFails.length ? behFails.join(' · ') : `פלטה ${beh.palette} · חסימה ${beh.ruleBlocks} · ${beh.maskedCount} סכומים הוסתרו · מאוזן`));
if (errs.length) console.log('✗ שגיאות: ' + errs.slice(0, 6).join(' | '));
bad += behFails.length ? 1 : 0;
bad += errs.length ? 1 : 0;
console.log(bad ? `\n${bad} ממצאים` : `\n${ROUTES.length} מסלולים + התנהגות — נקי`);
await b.close();
process.exit(bad ? 1 : 0);
