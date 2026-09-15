/* probe.mjs — רפרנסים ל«בית המדרש»: לוח-זמנים ומפת-מקומות.
   🔴 התיקון בשורש: הכלי **מאמת בעצמו** שהדף הוא מה שהוא אמור להיות,
   ופוסל אוטומטית חומת-הרשמה, דף-עיון או פיד. דף שנפסל לא נמדד ולא מדווח.
   הרצה: node gen/looks/medrash/probe.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { EXTRACT } from '../measure/extract.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'shots'), { recursive: true });

const SITES = [
  /* --- לוח-זמנים: לוחות-יציאה ולוחות-זמנים שמרונדרים בשרת --- */
  { id: 'nre-board', kind: 'לוח-זמנים', name: 'National Rail · לוח-יציאה', url: 'https://ojp.nationalrail.co.uk/service/ldbboard/dep/KGX', need: ['time'] },
  { id: 'heathrow', kind: 'לוח-זמנים', name: 'Heathrow · יציאות', url: 'https://www.heathrow.com/departures', need: ['time'] },
  { id: 'sbb', kind: 'לוח-זמנים', name: 'SBB · רכבת שווייץ', url: 'https://www.sbb.ch/en', need: ['time'] },
  { id: 'hebcal-sh', kind: 'לוח-זמנים', name: 'Hebcal · שבת ירושלים', url: 'https://www.hebcal.com/shabbat?geonameid=281184', need: ['time'] },
  { id: 'chabad-cl', kind: 'לוח-זמנים', name: 'chabad · הדלקת נרות', url: 'https://www.chabad.org/calendar/candlelighting.htm', need: ['time'] },
  { id: 'islamicfinder', kind: 'לוח-זמנים', name: 'IslamicFinder · זמני תפילה', url: 'https://www.islamicfinder.org/world/', need: ['time'] },
  { id: 'myzmanim', kind: 'לוח-זמנים', name: 'MyZmanim', url: 'https://www.myzmanim.com/search.aspx', need: ['time'] },
  /* --- מפת-מקומות --- */
  { id: 'aerolopa', kind: 'מפת-מקומות', name: 'AeroLOPA', url: 'https://www.aerolopa.com/', need: ['seat'] },
  { id: 'aerolopa-ba', kind: 'מפת-מקומות', name: 'AeroLOPA · BA A320', url: 'https://www.aerolopa.com/ba-a320', need: ['seat'] },
  { id: 'seatmaps', kind: 'מפת-מקומות', name: 'SeatMaps', url: 'https://seatmaps.com/airlines/dl-delta-air-lines/', need: ['seat'] },
  { id: 'telecharge', kind: 'מפת-מקומות', name: 'Telecharge · תיאטרון', url: 'https://www.telecharge.com/', need: ['seat'] },
];

/* ---- מאמת: הדף באמת מה שהוא אמור להיות? ---- */
const VERIFY = (need) => {
  const t = document.body.innerText;
  const low = t.toLowerCase();
  /* פסילה 1 — חומת-הרשמה/התחברות */
  const wallWords = ['create account', 'join now', 'sign up to continue', 'log in to continue', 'password (6+', 'agree & join'];
  const wall = wallWords.filter(w => low.includes(w));
  /* פסילה 2 — הדף ריק מדי */
  const els = document.querySelectorAll('body *').length;
  /* אישור — הראיה שהדף הוא מה שביקשנו */
  const proof = {};
  if (need.includes('time')) {
    const times = t.match(/\b([01]?\d|2[0-3]):[0-5]\d\b/g) || [];
    proof.times = times.length;                     /* לוח-זמנים חייב הרבה שעות */
  }
  if (need.includes('seat')) {
    /* מפת-מקומות = הרבה אלמנטים קטנים ושווי-גודל בשורות */
    const small = [...document.querySelectorAll('body *')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width >= 12 && r.width <= 46 && r.height >= 12 && r.height <= 46;
    });
    const byRow = {};
    small.forEach(el => { const y = Math.round(el.getBoundingClientRect().top / 8) * 8; byRow[y] = (byRow[y] || 0) + 1; });
    const rows = Object.values(byRow).filter(n => n >= 5);
    proof.cells = small.length; proof.rows = rows.length;
  }
  return { wall, els, proof, title: document.title.slice(0, 60) };
};

const ok = (v, need) => {
  if (v.wall.length) return 'חומת-הרשמה: ' + v.wall[0];
  if (v.els < 120) return 'דף ריק (' + v.els + ' אלמנטים)';
  if (need.includes('time') && v.proof.times < 8) return 'רק ' + v.proof.times + ' שעות — לא לוח-זמנים';
  if (need.includes('seat') && v.proof.rows < 3) return 'רק ' + v.proof.rows + ' שורות-תאים — לא מפת-מקומות';
  return null;
};

const b = await chromium.launch();
const out = [];
for (const s of SITES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3600);
    for (const t of ['Accept', 'Accept all', 'Accept all cookies', 'I agree', 'Got it', 'Allow all', 'אישור', 'קבל הכל', 'סגור']) {
      const x = p.locator(`button:has-text("${t}")`).first();
      if (await x.count() && await x.isVisible().catch(() => false)) { await x.click().catch(() => { }); await p.waitForTimeout(900); break; }
    }
    const v = await p.evaluate(VERIFY, s.need);
    const why = ok(v, s.need);
    await p.screenshot({ path: join(here, 'shots', s.id + '.png') });
    if (why) { console.log(`✗ ${s.kind} · ${s.name.padEnd(22)} נפסל — ${why}`); out.push({ ...s, rejected: why, v }); await p.close(); continue; }
    const m = await p.evaluate(EXTRACT);
    out.push({ ...s, v, m });
    console.log(`✓ ${s.kind} · ${s.name.padEnd(22)} ${v.proof.times ? v.proof.times + ' שעות' : v.proof.rows + ' שורות/' + v.proof.cells + ' תאים'} · גוף ${m.body.size}/${m.body.lh} · רקע ${m.body.bg}`);
  } catch (e) { console.log(`✗ ${s.kind} · ${s.name.padEnd(22)} ${String(e.message).slice(0, 40)}`); out.push({ ...s, rejected: String(e.message).slice(0, 40) }); }
  await p.close();
}
await b.close();
writeFileSync(join(here, 'probe.json'), JSON.stringify(out, null, 1));
const good = out.filter(x => x.m).length;
console.log(`\n${good} עברו אימות · ${out.length - good} נפסלו אוטומטית`);
