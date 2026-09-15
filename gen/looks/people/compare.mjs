/* compare.mjs — הכפתור המלא מול המקור.
   אותה שיטה בדיוק על שני הצדדים: מוצאים את הכפתור, מרחפים, ממקדים, לוחצים —
   וחותכים צילום בכל מצב. פעם אחת על האתר החי, פעם אחת על המסך שלנו.
   הרצה: node gen/looks/people/compare.mjs */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'cmp'), { recursive: true });
const PAD = 26;

const S = [
  { id: 'govuk', name: 'GOV.UK', url: 'https://design-system.service.gov.uk/components/button/', sel: '.govuk-button', pad: '#ffffff' },
  { id: 'wise', name: 'Wise', url: 'https://wise.com/', sel: null, pad: '#ffffff' },
  { id: 'monzo', name: 'Monzo', url: 'https://monzo.com/', sel: null, pad: '#112231' },
  { id: 'stripe', name: 'Stripe', url: 'https://stripe.com/', sel: null, pad: '#ffffff' },
];

const PICK = (sel) => {
  const list = sel ? [...document.querySelectorAll(sel)]
    : [...document.querySelectorAll('button,a[class*=btn],a[class*=Button],a[class*=cta],[role=button]')];
  const c = list.filter(el => {
    const r = el.getBoundingClientRect();
    if (r.height < 30 || r.height > 80 || r.width < 90) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return false;
    const m = cs.backgroundColor.match(/[\d.]+/g); if (!m) return false;
    if ((m[3] === undefined ? 1 : +m[3]) < .5) return false;
    const t = (el.innerText || '').trim();
    return t.length > 1 && t.length < 40 && !/cookie|עוגיות/i.test(t);
  }).sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width);
  if (!c.length) return null;
  c[0].scrollIntoView({ block: 'center' });
  c[0].setAttribute('data-probe', '1');
  return (c[0].innerText || '').replace(/\s+/g, ' ').trim().slice(0, 30);
};

/* מצלם את אותו כפתור בארבעה מצבים */
async function shoot(p, prefix) {
  const el = p.locator('[data-probe]').first();
  const clip = async () => { const b = await el.boundingBox(); return b ? { x: Math.max(0, b.x - PAD), y: Math.max(0, b.y - PAD), width: b.width + PAD * 2, height: b.height + PAD * 2 } : null; };
  const out = {};
  let c = await clip(); if (!c) return null;
  await p.screenshot({ path: join(here, 'cmp', prefix + '-rest.png'), clip: c });
  await el.hover({ force: true }); await p.waitForTimeout(420);
  await p.screenshot({ path: join(here, 'cmp', prefix + '-hover.png'), clip: c });
  await p.mouse.move(5, 5); await p.waitForTimeout(220);
  await p.evaluate(() => { const e = document.querySelector('[data-probe]'); e.focus({ focusVisible: true }); });
  await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(320);
  await p.screenshot({ path: join(here, 'cmp', prefix + '-focus.png'), clip: c });
  const b = await el.boundingBox();
  if (b) { await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await p.mouse.down(); await p.waitForTimeout(280); }
  await p.screenshot({ path: join(here, 'cmp', prefix + '-active.png'), clip: c });
  if (b) await p.mouse.up();
  out.ok = true; return out;
}

const br = await chromium.launch();

/* ---- צד א׳: האתרים החיים ---- */
for (const s of S) {
  const p = await br.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3200);
    for (const t of ['Accept', 'Accept all', 'Accept all cookies', 'Accept additional cookies', 'Hide cookie message', 'I agree', 'Got it', 'Allow all']) {
      const x = p.locator(`button:has-text("${t}")`).first();
      if (await x.count() && await x.isVisible().catch(() => false)) { await x.click().catch(() => { }); await p.waitForTimeout(900); break; }
    }
    const label = await p.evaluate(PICK, s.sel);
    if (!label) { console.log(`✗ ${s.name} — לא נמצא כפתור`); await p.close(); continue; }
    await p.waitForTimeout(400);
    const r = await shoot(p, s.id + '-real');
    console.log(`✓ ${s.name.padEnd(9)} מקור — «${label}» ${r ? '· 4 מצבים' : ''}`);
    s.label = label;
  } catch (e) { console.log(`✗ ${s.name} — ${String(e.message).slice(0, 45)}`); }
  await p.close();
}

/* ---- צד ב׳: המסך שלנו, אותה שיטה ---- */
const p = await br.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto('file://' + join(here, 'btn-lab.html'));
await p.waitForTimeout(600);
for (const s of S) {
  try {
    await p.evaluate(id => {
      document.querySelectorAll('[data-probe]').forEach(e => e.removeAttribute('data-probe'));
      const e = document.querySelector('.b-' + id + '[data-go]');
      e.scrollIntoView({ block: 'center' }); e.setAttribute('data-probe', '1');
    }, s.id);
    await p.waitForTimeout(350);
    await shoot(p, s.id + '-ours');
    console.log(`✓ ${s.name.padEnd(9)} שלנו — 4 מצבים`);
  } catch (e) { console.log(`✗ ${s.name} שלנו — ${String(e.message).slice(0, 40)}`); }
}
await p.close();
await br.close();
writeFileSync(join(here, 'cmp.json'), JSON.stringify(S, null, 1));
console.log('\nקטעים ב-gen/looks/people/cmp');
