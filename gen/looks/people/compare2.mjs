/* compare2.mjs — השלמה: GOV.UK (הדוגמה יושבת ב-iframe ⇒ טוענים אותה ישירות)
   ו-Monzo (הכפתור גלל מחוץ למסך ⇒ גוללים ומודדים מחדש). */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'cmp'), { recursive: true });
const PAD = 26;

const S = [
  { id: 'govuk', name: 'GOV.UK', url: 'https://design-system.service.gov.uk/components/button/default/index.html', sel: '.govuk-button' },
  { id: 'monzo', name: 'Monzo', url: 'https://monzo.com/', sel: null },
];

async function shoot(p, prefix) {
  const el = p.locator('[data-probe]').first();
  await el.scrollIntoViewIfNeeded().catch(() => { });
  await p.waitForTimeout(400);
  const bb = await el.boundingBox(); if (!bb || bb.width < 10) return false;
  const clip = { x: Math.max(0, bb.x - PAD), y: Math.max(0, bb.y - PAD), width: bb.width + PAD * 2, height: bb.height + PAD * 2 };
  await p.screenshot({ path: join(here, 'cmp', prefix + '-rest.png'), clip });
  await el.hover({ force: true }); await p.waitForTimeout(420);
  await p.screenshot({ path: join(here, 'cmp', prefix + '-hover.png'), clip });
  await p.mouse.move(5, 5); await p.waitForTimeout(220);
  await p.evaluate(() => document.querySelector('[data-probe]').focus());
  await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(320);
  await p.screenshot({ path: join(here, 'cmp', prefix + '-focus.png'), clip });
  await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.waitForTimeout(280);
  await p.screenshot({ path: join(here, 'cmp', prefix + '-active.png'), clip });
  await p.mouse.up();
  return true;
}

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
  c[0].setAttribute('data-probe', '1');
  return (c[0].innerText || '').replace(/\s+/g, ' ').trim().slice(0, 30);
};

const br = await chromium.launch();
for (const s of S) {
  const p = await br.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3000);
    for (const t of ['Accept', 'Accept all', 'Accept additional cookies', 'Got it', 'Allow all']) {
      const x = p.locator(`button:has-text("${t}")`).first();
      if (await x.count() && await x.isVisible().catch(() => false)) { await x.click().catch(() => { }); await p.waitForTimeout(800); break; }
    }
    const label = await p.evaluate(PICK, s.sel);
    if (!label) { console.log(`✗ ${s.name} — לא נמצא`); await p.close(); continue; }
    const ok = await shoot(p, s.id + '-real');
    console.log(`${ok ? '✓' : '✗'} ${s.name.padEnd(9)} מקור — «${label}»`);
  } catch (e) { console.log(`✗ ${s.name} — ${String(e.message).slice(0, 50)}`); }
  await p.close();
}
await br.close();
