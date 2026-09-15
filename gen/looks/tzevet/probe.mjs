/* probe.mjs — רפרנסים ל«צוות»: לוח-משמרות ועקומת-עומס.
   הכלי מאמת בעצמו ופוסל דף שאינו מה שנטען. הרצה: node gen/looks/tzevet/probe.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { EXTRACT } from '../measure/extract.mjs';
const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'shots'), { recursive: true });

const SITES = [
  { id: 'deputy', name: 'Deputy', url: 'https://www.deputy.com/features/scheduling-software' },
  { id: 'wheniwork', name: 'When I Work', url: 'https://wheniwork.com/features/employee-scheduling' },
  { id: 'homebase', name: 'Homebase', url: 'https://joinhomebase.com/scheduling/' },
  { id: 'pco-services', name: 'Planning Center Services', url: 'https://www.planningcenter.com/services' },
  { id: 'bamboohr', name: 'BambooHR', url: 'https://www.bamboohr.com/time-tracking' },
  { id: 'calendly', name: 'Calendly', url: 'https://calendly.com/' },
  { id: 'connecteam', name: 'Connecteam', url: 'https://connecteam.com/employee-scheduling-software/' },
  { id: 'sling', name: 'Sling', url: 'https://getsling.com/' },
];

const VERIFY = () => {
  const t = document.body.innerText, low = t.toLowerCase();
  const wall = ['create account', 'join now', 'log in to continue', 'sign up to continue'].filter(w => low.includes(w));
  const els = document.querySelectorAll('body *').length;
  const times = (t.match(/\b([01]?\d|2[0-3]):[0-5]\d\b|\b\d{1,2}\s?(am|pm)\b/gi) || []).length;
  /* פס-משמרת = אלמנט רחב ונמוך, עם רקע, בתוך שורה */
  const bars = [...document.querySelectorAll('body *')].filter(el => {
    const r = el.getBoundingClientRect();
    if (r.width < 40 || r.height < 14 || r.height > 56) return false;
    if (r.width / r.height < 2.2) return false;
    const c = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
    return c && (c[3] === undefined || +c[3] > .5);
  }).length;
  const words = ['shift', 'schedule', 'roster', 'coverage', 'who\'s working', 'timesheet'].filter(w => low.includes(w));
  return { wall, els, times, bars, words, title: document.title.slice(0, 55) };
};
const reject = v => v.wall.length ? 'חומת-הרשמה' : v.els < 150 ? `דף ריק (${v.els})`
  : !v.words.length ? 'לא מדבר על משמרות' : v.bars < 6 ? `רק ${v.bars} פסים — אין לוח` : null;

const b = await chromium.launch();
const out = [];
for (const s of SITES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3600);
    for (const t of ['Accept', 'Accept all', 'Accept All Cookies', 'I agree', 'Got it', 'Allow all']) {
      const x = p.locator(`button:has-text("${t}")`).first();
      if (await x.count() && await x.isVisible().catch(() => false)) { await x.click().catch(() => { }); await p.waitForTimeout(800); break; }
    }
    const v = await p.evaluate(VERIFY);
    await p.screenshot({ path: join(here, 'shots', s.id + '.png') });
    const why = reject(v);
    if (why) { console.log(`✗ ${s.name.padEnd(24)} נפסל — ${why}`); out.push({ ...s, rejected: why, v }); await p.close(); continue; }
    const m = await p.evaluate(EXTRACT);
    out.push({ ...s, v, m });
    console.log(`✓ ${s.name.padEnd(24)} ${v.bars} פסים · ${v.times} שעות · ${v.words.join('/')} · גוף ${m.body.size}/${m.body.lh} · r ${m.radii.slice(0, 3).map(x => x.v).join(' ')}`);
  } catch (e) { console.log(`✗ ${s.name.padEnd(24)} ${String(e.message).slice(0, 38)}`); out.push({ ...s, rejected: String(e.message).slice(0, 38) }); }
  await p.close();
}
await b.close();
writeFileSync(join(here, 'probe.json'), JSON.stringify(out, null, 1));
console.log(`\n${out.filter(x => x.m).length} עברו · ${out.filter(x => !x.m).length} נפסלו`);
