/* compare3.mjs — תיקון: הדף גולל בין המצבים (מיקוד גורר גלילה), ולכן חיתוך
   שחושב פעם אחת החטיא. כאן החיתוך מחושב **מחדש לפני כל צילום**. */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'cmp'), { recursive: true });
const PAD = 26;

const S = [
  { id: 'wise', name: 'Wise', url: 'https://wise.com/', want: /send money|get started|sign up/i },
  { id: 'monzo', name: 'Monzo', url: 'https://monzo.com/', want: /open a free|sign up|get started/i },
];

const PICK = (want) => {
  const re = new RegExp(want, 'i');
  const list = [...document.querySelectorAll('button,a[class*=btn],a[class*=Button],a[class*=cta],[role=button]')];
  const c = list.filter(el => {
    const r = el.getBoundingClientRect();
    if (r.height < 34 || r.height > 72 || r.width < 100) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return false;
    const m = cs.backgroundColor.match(/[\d.]+/g); if (!m) return false;
    if ((m[3] === undefined ? 1 : +m[3]) < .5) return false;
    return re.test((el.innerText || '').trim());
  });
  const pick = c[0] || null; if (!pick) return null;
  pick.setAttribute('data-probe', '1');
  return (pick.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 30);
};

/* חיתוך מחושב מחדש לפני כל צילום — זה כל התיקון */
async function snap(p, path) {
  const el = p.locator('[data-probe]').first();
  const b = await el.boundingBox();
  if (!b || b.width < 10 || b.y < 0) return false;
  await p.screenshot({ path, clip: { x: Math.max(0, b.x - PAD), y: Math.max(0, b.y - PAD), width: b.width + PAD * 2, height: b.height + PAD * 2 } });
  return true;
}

const br = await chromium.launch();
for (const s of S) {
  const p = await br.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3200);
    for (const t of ['Accept', 'Accept all', 'Accept all cookies', 'Got it', 'Allow all']) {
      const x = p.locator(`button:has-text("${t}")`).first();
      if (await x.count() && await x.isVisible().catch(() => false)) { await x.click().catch(() => { }); await p.waitForTimeout(900); break; }
    }
    const label = await p.evaluate(PICK, s.want.source);
    if (!label) { console.log(`✗ ${s.name} — לא נמצא`); await p.close(); continue; }
    const el = p.locator('[data-probe]').first();
    await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
    const base = join(here, 'cmp', s.id + '-real-');
    await snap(p, base + 'rest.png');
    await el.hover({ force: true }); await p.waitForTimeout(450);
    await snap(p, base + 'hover.png');
    await p.mouse.move(4, 4); await p.waitForTimeout(250);
    await p.evaluate(() => document.querySelector('[data-probe]').focus());
    await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(400);
    await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
    await snap(p, base + 'focus.png');
    const bb = await el.boundingBox();
    if (bb) { await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.waitForTimeout(300); }
    await snap(p, base + 'active.png');
    if (bb) await p.mouse.up();
    console.log(`✓ ${s.name.padEnd(7)} «${label}» — 4 מצבים`);
  } catch (e) { console.log(`✗ ${s.name} — ${String(e.message).slice(0, 45)}`); }
  await p.close();
}
await br.close();
