/* match.mjs — שער-ההתאמה. מודד את חמשת המסכים שלנו באותו מכשיר בדיוק שמדד את
   האתרים החיים (extract.mjs), ומשווה ערך-מול-ערך מול measured.json.
   כל בדיקה היא "הערך הזה מופיע במדידה של האתר?" — לא דעה, לא עין.
   חריגות-קריאוּת מוצהרות מראש ב-tokens.SWAPS ונספרות בנפרד.
   הרצה: node gen/looks/measure/match.mjs                                        */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { EXTRACT } from './extract.mjs';
import { SWAPS } from './tokens.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const M = JSON.parse(readFileSync(join(here, 'measured.json'), 'utf8'));
const full5 = join(here, '..', 'full5');

const PAGES = [
  { file: '1-raycast.html', site: 'raycast', name: 'Raycast' },
  { file: '2-spotify.html', site: 'spotify', name: 'Spotify' },
  { file: '3-duolingo.html', site: 'duolingo', name: 'Duolingo' },
  { file: '4-wise.html', site: 'wise', name: 'Wise' },
  { file: '5-monzo.html', site: 'monzo', name: 'Monzo' },
];

/* איחוד המדידות של כל כתובות-האתר תחת אותו אתר */
const refOf = (site) => {
  const keys = Object.keys(M.sites).filter(k => k === site || k.startsWith(site + '·'));
  const u = { colors: new Set(), radii: new Set(), gaps: new Set(), pads: new Set(), sizes: new Set(), weights: new Set(), buttons: [], body: [], h1: [] };
  for (const k of keys) {
    const s = M.sites[k];
    [...s.palette.bg, ...s.palette.ink].forEach(x => u.colors.add(x.v));
    u.colors.add(s.body.bg); if (s.body.color) u.colors.add(s.body.color);
    s.radii.forEach(x => u.radii.add(parseInt(x.v)));
    s.gaps.forEach(x => u.gaps.add(parseInt(x.v)));
    s.pads.forEach(x => u.pads.add(parseInt(x.v)));
    Object.values(s.type).forEach(t => { u.sizes.add(String(t.size)); u.weights.add(String(t.weight)); });
    u.sizes.add(String(s.body.size));
    s.buttons.forEach(b => u.buttons.push(b));
    u.body.push({ size: s.body.size, lh: Math.round(parseFloat(s.body.lh) || 0) });
    if (s.type.h1) u.h1.push(s.type.h1);
  }
  u.keys = keys;
  return u;
};

/* גוון פטור: הוכרז מראש כחריגת-קריאוּת לאותו אתר */
const swapped = (site, hex) => SWAPS.some(s => s.site === site && (s.used || '').toLowerCase().includes(hex.toLowerCase()));

const b = await chromium.launch();
const report = { checkedAt: new Date().toISOString().slice(0, 16), measuredAt: M.measuredAt, sites: {} };
let total = 0, hit = 0;

for (const pg of PAGES) {
  const ref = refOf(pg.site);
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('file://' + join(full5, pg.file));
  await p.waitForTimeout(600);
  const ours = await p.evaluate(EXTRACT);
  await p.close();

  const checks = [], waived = [];
  const add = (group, label, ok, note = '') => { checks.push({ group, label, ok, note }); };

  /* 1 — צבעים: כל גוון משמעותי שלנו חייב להופיע במדידה */
  const mine = new Set([...ours.palette.bg.map(x => x.v), ...ours.palette.ink.map(x => x.v)]);
  for (const hex of mine) {
    if (ref.colors.has(hex)) add('צבע', hex, true);
    else if (swapped(pg.site, hex)) waived.push({ group: 'צבע', label: hex, why: 'חריגת-קריאוּת מוצהרת' });
    else add('צבע', hex, false, 'אינו במדידה');
  }
  /* 1ב — כיסוי הפוך: הגוונים המובילים של האתר צריכים להופיע אצלנו */
  const topRef = M.sites[ref.keys[0]].palette.bg.slice(0, 4).map(x => x.v);
  for (const hex of topRef) add('צבע-מוביל', hex, mine.has(hex), 'גוון מוביל של האתר');

  /* 2 — רדיוסים */
  for (const r of ours.radii.map(x => parseInt(x.v))) {
    const ok = ref.radii.has(r) || [...ref.radii].some(v => v >= 999 && r >= 999);
    add('רדיוס', r + 'px', ok, ok ? '' : 'אינו במדידה');
  }
  /* 3 — מרווחים */
  for (const g of ours.gaps.map(x => parseInt(x.v))) add('מרווח', g + 'px', ref.gaps.has(g), 'gap');

  /* 4 — כפתורים: לאתר יש הרבה סוגי-כפתור, והסורק תופס רק את מה שהיה על הדפים
     שנטענו. לכן הבדיקה היא לפי **ערך-שדה**: כל ערך שאנחנו נותנים לגובה, לריפוד,
     לגודל-הגופן, למשקל, לרדיוס ולצבע חייב להופיע במדידה של אותו אתר. */
  const F = ['radius', 'padX', 'padY', 'size', 'weight'];
  const pool = {
    radius: new Set([...ref.radii].map(String)),
    /* ריפוד נמדד בכל האתר (pads + gaps), לא רק על כפתורים */
    padX: new Set([...ref.pads, ...ref.gaps, 0].map(String)),
    padY: new Set([...ref.pads, ...ref.gaps, 0].map(String)),
    size: new Set([...ref.sizes]), weight: new Set([...ref.weights]),
  };
  ref.buttons.forEach(b2 => F.forEach(f => pool[f].add(String(b2[f]))));
  /* גובה-הכפתור אינו נבדק: הוא תוצאה של הריפוד וגובה-השורה, ושניהם כבר נבדקים */
  for (const our of ours.buttons.slice(0, 4)) {
    for (const f of F) {
      const v = String(our[f]);
      const ok = pool[f].has(v) || (f === 'radius' && +v >= 48 && [...pool.radius].some(x => +x >= 48));
      add('כפתור', f + ' ' + v, ok, ok ? '' : 'במדידה: ' + [...pool[f]].sort((a, c) => +a - +c).join('/'));
    }
    for (const f of ['bg', 'color']) {
      const v = our[f];
      if (v === null) { add('כפתור', f + ' שקוף', true); continue; }
      add('כפתור', f + ' ' + v, ref.colors.has(v) || swapped(pg.site, v), 'אינו בפלטה המדודה');
    }
  }

  /* 5 — טיפוגרפיה */
  add('טיפוגרפיה', 'body ' + ours.body.size + 'px', ref.body.some(x => x.size === ours.body.size), 'במדידה: ' + ref.body.map(x => x.size).join('/'));
  /* גובה-שורה נבדק רק כשלאתר יש ערך מספרי; 'normal' אינו אילוץ */
  const ourLh = Math.round(parseFloat(ours.body.lh) || 0);
  const refLh = ref.body.map(x => x.lh).filter(x => x > 0);
  if (refLh.length) add('טיפוגרפיה', 'line-height ' + ourLh + 'px', refLh.some(x => Math.abs(x - ourLh) <= 1), 'במדידה: ' + refLh.join('/'));
  if (ours.type.h1 && ref.h1.length) add('טיפוגרפיה', 'h1 משקל ' + ours.type.h1.weight, ref.h1.some(x => x.weight === ours.type.h1.weight), 'במדידה: ' + ref.h1.map(x => x.weight).join('/'));

  const ok = checks.filter(c => c.ok).length;
  total += checks.length; hit += ok;
  const pctS = Math.round(ok / checks.length * 100);
  report.sites[pg.site] = { name: pg.name, source: ref.keys, pct: pctS, checks, waived };
  const misses = checks.filter(c => !c.ok);
  console.log(`${pctS === 100 ? '✓' : '·'} ${pg.name.padEnd(9)} ${String(pctS).padStart(3)}%  ${ok}/${checks.length} בדיקות` +
    (waived.length ? ` · ${waived.length} חריגות מוצהרות` : '') +
    (misses.length ? '\n    פערים: ' + misses.map(m => `${m.group}:${m.label}${m.note ? ' (' + m.note + ')' : ''}`).join(' · ') : ''));
}
await b.close();
const pct = Math.round(hit / total * 100);
report.total = { pct, hit, of: total };
writeFileSync(join(here, 'match.json'), JSON.stringify(report, null, 1));
console.log(`\nהתאמה כוללת: ${pct}%  (${hit}/${total} ערכים זהים למדידה) · match.json`);
process.exit(pct === 100 ? 0 : 1);
