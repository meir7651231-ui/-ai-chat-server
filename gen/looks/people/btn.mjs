/* btn.mjs — איך הכפתור באמת נראה ומתנהג.
   לא צילום ולא זיכרון: מוצאים את הכפתור הראשי בעמוד ומודדים אותו בארבעה
   מצבים — מנוחה · ריחוף · מיקוד-מקלדת · לחיצה — כולל מעבר, צל ותזוזה.
   הרצה: node gen/looks/people/btn.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'btn'), { recursive: true });

const S = [
  { id: 'wise', name: 'Wise', url: 'https://wise.com/' },
  { id: 'monzo', name: 'Monzo', url: 'https://monzo.com/' },
  { id: 'stripe', name: 'Stripe', url: 'https://stripe.com/' },
  { id: 'duolingo', name: 'Duolingo', url: 'https://www.duolingo.com/' },
  { id: 'spotify', name: 'Spotify', url: 'https://www.spotify.com/' },
  { id: 'raycast', name: 'Raycast', url: 'https://www.raycast.com/' },
  { id: 'govuk', name: 'GOV.UK', url: 'https://design-system.service.gov.uk/components/button/' },
  { id: 'linear', name: 'Linear', url: 'https://linear.app/' },
];

/* איזה כפתור? הגדול והבולט ביותר שיש לו רקע — הכפתור הראשי של העמוד */
const PICK = () => {
  const cand = [...document.querySelectorAll('button,a[class*=btn],a[class*=Button],a[class*=cta],[role=button]')]
    .filter(el => { const r = el.getBoundingClientRect();
      if (r.height < 32 || r.height > 80 || r.width < 90 || r.top < 0 || r.top > innerHeight - 40) return false;
      const cs = getComputedStyle(el); const m = cs.backgroundColor.match(/[\d.]+/g);
      if (!m) return false; const a = m[3] === undefined ? 1 : +m[3]; return a > .5; })
    .sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width);
  if (!cand.length) return null;
  cand[0].setAttribute('data-probe', '1');
  return (cand[0].innerText || '').trim().slice(0, 28);
};

const READ = () => {
  const el = document.querySelector('[data-probe]'); if (!el) return null;
  const cs = getComputedStyle(el), r = el.getBoundingClientRect();
  const px = v => Math.round(parseFloat(v) || 0);
  return { bg: cs.backgroundColor, color: cs.color, border: cs.borderTopWidth + ' ' + cs.borderTopColor,
    radius: px(cs.borderTopLeftRadius), shadow: cs.boxShadow === 'none' ? '—' : cs.boxShadow.replace(/\s+/g, ' ').slice(0, 68),
    transform: cs.transform === 'none' ? '—' : cs.transform,
    outline: cs.outlineWidth === '0px' ? '—' : cs.outlineWidth + ' ' + cs.outlineStyle + ' ' + cs.outlineColor,
    filter: cs.filter === 'none' ? '—' : cs.filter, opacity: cs.opacity,
    h: Math.round(r.height), top: Math.round(r.top),
    transition: cs.transitionProperty === 'all' || cs.transitionProperty === 'none'
      ? cs.transitionProperty + ' ' + cs.transitionDuration
      : cs.transitionProperty.split(',').slice(0, 3).join(',') + ' ' + cs.transitionDuration.split(',')[0] + ' ' + cs.transitionTimingFunction.split(',')[0] };
};

const diff = (a, b) => { const d = {}; for (const k of Object.keys(a)) if (a[k] !== b[k]) d[k] = a[k] + ' → ' + b[k]; return d; };

const br = await chromium.launch();
const all = [];
for (const s of S) {
  const p = await br.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3200);
    for (const t of ['Accept', 'Accept all', 'Accept all cookies', 'I agree', 'Got it', 'Allow all', 'Accept additional cookies']) {
      const x = p.locator(`button:has-text("${t}")`).first();
      if (await x.count() && await x.isVisible().catch(() => false)) { await x.click().catch(() => { }); await p.waitForTimeout(800); break; }
    }
    const label = await p.evaluate(PICK);
    if (!label) { console.log(`✗ ${s.name} — לא נמצא כפתור ראשי`); await p.close(); continue; }
    const el = p.locator('[data-probe]').first();
    const rest = await p.evaluate(READ);
    await el.hover({ force: true }); await p.waitForTimeout(450);
    const hover = await p.evaluate(READ);
    await p.evaluate(() => document.querySelector('[data-probe]').focus()); await p.waitForTimeout(300);
    const focus = await p.evaluate(READ);
    const box = await el.boundingBox();
    if (box) await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await p.mouse.down(); await p.waitForTimeout(280);
    const active = await p.evaluate(READ);
    await p.screenshot({ path: join(here, 'btn', s.id + '.png'), clip: box ? { x: Math.max(0, box.x - 30), y: Math.max(0, box.y - 30), width: Math.min(520, box.width + 60), height: box.height + 60 } : undefined });
    await p.mouse.up();
    all.push({ ...s, label, rest, hover: diff(rest, hover), focus: diff(rest, focus), active: diff(hover, active) });
    console.log(`\n▸ ${s.name} — «${label}»`);
    console.log(`  מנוחה: ${rest.bg} / ${rest.color} · r${rest.radius} · גובה ${rest.h} · צל ${rest.shadow.slice(0, 40)}`);
    console.log(`  מעבר: ${rest.transition}`);
    const show = (n, d) => { const k = Object.keys(d); console.log(`  ${n}: ${k.length ? k.map(x => x + ' ' + d[x]).join(' · ').slice(0, 150) : 'לא משתנה'}`); };
    show('ריחוף', all[all.length - 1].hover); show('מיקוד', all[all.length - 1].focus); show('לחיצה', all[all.length - 1].active);
  } catch (e) { console.log(`✗ ${s.name} — ${String(e.message).slice(0, 50)}`); }
  await p.close();
}
await br.close();
writeFileSync(join(here, 'btn.json'), JSON.stringify(all, null, 1));
