/* btn2.mjs — סבב שני: מי שלא נתפס, וכפתור ה-GOV.UK האמיתי (לא באנר-העוגיות). */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const here = dirname(fileURLToPath(import.meta.url));

const S = [
  { id: 'govuk', name: 'GOV.UK', url: 'https://design-system.service.gov.uk/components/button/', pick: '.govuk-button' },
  { id: 'duolingo', name: 'Duolingo', url: 'https://www.duolingo.com/', pick: null },
  { id: 'spotify', name: 'Spotify', url: 'https://www.spotify.com/', pick: null },
  { id: 'linear', name: 'Linear', url: 'https://linear.app/', pick: null },
  { id: 'raycast', name: 'Raycast', url: 'https://www.raycast.com/', pick: null },
];

const PICK = (sel) => {
  let list;
  if (sel) list = [...document.querySelectorAll(sel)];
  else list = [...document.querySelectorAll('button,a[class*=btn],a[class*=Button],a[class*=cta],a[class*=Cta],[role=button],a[href]')];
  const cand = list.filter(el => {
    const r = el.getBoundingClientRect();
    if (r.height < 30 || r.height > 90 || r.width < 80) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return false;
    const m = cs.backgroundColor.match(/[\d.]+/g); if (!m) return false;
    const a = m[3] === undefined ? 1 : +m[3]; if (a < .5) return false;
    const t = (el.innerText || '').trim();
    return t.length > 1 && t.length < 40 && !/cookie|accept|עוגיות/i.test(t);
  }).sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width);
  if (!cand.length) return null;
  cand[0].scrollIntoView({ block: 'center' });
  cand[0].setAttribute('data-probe', '1');
  return (cand[0].innerText || '').trim().slice(0, 30);
};
const READ = () => {
  const el = document.querySelector('[data-probe]'); if (!el) return null;
  const cs = getComputedStyle(el), r = el.getBoundingClientRect(), px = v => Math.round(parseFloat(v) || 0);
  return { bg: cs.backgroundColor, color: cs.color, border: cs.borderTopWidth + ' ' + cs.borderTopColor,
    radius: px(cs.borderTopLeftRadius),
    shadow: cs.boxShadow === 'none' ? '—' : cs.boxShadow.replace(/\s+/g, ' ').slice(0, 70),
    transform: cs.transform === 'none' ? '—' : cs.transform,
    outline: cs.outlineWidth === '0px' ? '—' : cs.outlineWidth + ' ' + cs.outlineStyle + ' ' + cs.outlineColor,
    opacity: cs.opacity, h: Math.round(r.height),
    transition: cs.transitionProperty.split(',').slice(0, 3).join(',') + ' ' + cs.transitionDuration.split(',')[0] + ' ' + cs.transitionTimingFunction.split(',')[0] };
};
const diff = (a, b) => { const d = {}; for (const k of Object.keys(a)) if (a[k] !== b[k]) d[k] = a[k] + ' → ' + b[k]; return d; };

const br = await chromium.launch();
const prev = existsSync(join(here, 'btn.json')) ? JSON.parse(readFileSync(join(here, 'btn.json'), 'utf8')) : [];
const add = [];
for (const s of S) {
  const p = await br.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3200);
    for (const t of ['Accept', 'Accept all', 'Accept additional cookies', 'I agree', 'Got it', 'Allow all', 'Hide cookie message']) {
      const x = p.locator(`button:has-text("${t}")`).first();
      if (await x.count() && await x.isVisible().catch(() => false)) { await x.click().catch(() => { }); await p.waitForTimeout(900); break; }
    }
    const label = await p.evaluate(PICK, s.pick);
    if (!label) { console.log(`✗ ${s.name} — לא נמצא`); await p.close(); continue; }
    await p.waitForTimeout(400);
    const el = p.locator('[data-probe]').first();
    const rest = await p.evaluate(READ);
    await el.hover({ force: true }); await p.waitForTimeout(450);
    const hover = await p.evaluate(READ);
    await p.evaluate(() => document.querySelector('[data-probe]').focus()); await p.waitForTimeout(300);
    const focus = await p.evaluate(READ);
    const box = await el.boundingBox();
    if (box) { await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await p.mouse.down(); await p.waitForTimeout(300); }
    const active = await p.evaluate(READ);
    if (box) await p.mouse.up();
    const rec = { ...s, label, rest, hover: diff(rest, hover), focus: diff(rest, focus), active: diff(hover, active) };
    add.push(rec);
    console.log(`\n▸ ${s.name} — «${label}»`);
    console.log(`  מנוחה: ${rest.bg} / ${rest.color} · r${rest.radius} · גובה ${rest.h} · צל ${rest.shadow.slice(0, 44)}`);
    console.log(`  מעבר: ${rest.transition}`);
    const show = (n, d) => { const k = Object.keys(d); console.log(`  ${n}: ${k.length ? k.map(x => x + ' ' + d[x]).join(' · ').slice(0, 155) : 'לא משתנה'}`); };
    show('ריחוף', rec.hover); show('מיקוד', rec.focus); show('לחיצה', rec.active);
  } catch (e) { console.log(`✗ ${s.name} — ${String(e.message).slice(0, 45)}`); }
  await p.close();
}
await br.close();
writeFileSync(join(here, 'btn.json'), JSON.stringify([...prev.filter(x => !add.some(y => y.id === x.id)), ...add], null, 1));
