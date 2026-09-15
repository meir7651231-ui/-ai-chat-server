/* probe.mjs — רפרנסים ל«תרומות»: עמודי-מגבית.
   נבחרו כי עמוד-מגבית **חייב** להיות ציבורי — הוא נועד להישלח.
   הכלי מאמת בעצמו שזה באמת עמוד-מגבית: סכום שנאסף · יעד · מונה-תורמים ·
   פס-התקדמות · כפתור-תרומה. דף שלא עומד בזה נפסל ולא נמדד.
   הרצה: node gen/looks/trumot/probe.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { EXTRACT } from '../measure/extract.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'shots'), { recursive: true });

const SITES = [
  { id: 'gofundme', name: 'GoFundMe', users: 'הגדול בעולם', url: 'https://www.gofundme.com/discover' },
  { id: 'kickstarter', name: 'Kickstarter', users: '$8 מיליארד', url: 'https://www.kickstarter.com/discover/advanced?sort=popularity' },
  { id: 'indiegogo', name: 'Indiegogo', users: '$2 מיליארד', url: 'https://www.indiegogo.com/explore/all?project_type=campaign&sort=trending' },
  { id: 'justgiving', name: 'JustGiving', users: 'בריטניה', url: 'https://www.justgiving.com/' },
  { id: 'charitywater', name: 'charity: water', users: 'עיצוב-מופת', url: 'https://www.charitywater.org/' },
  { id: 'patreon', name: 'Patreon', users: '8 מיליון', url: 'https://www.patreon.com/explore' },
  { id: 'chuffed', name: 'Chuffed', users: 'לא-למטרות-רווח', url: 'https://chuffed.org/discover' },
  { id: 'causematch', name: 'CauseMatch', users: 'מגביות יהודיות', url: 'https://www.causematch.com/' },
  { id: 'charidy', name: 'Charidy', users: 'מגביות יהודיות', url: 'https://www.charidy.com/' },
  { id: 'jgive', name: 'JGive', users: 'ישראל', url: 'https://www.jgive.com/new/he/ils' },
];

/* ---- מאמת: זה באמת עמוד-מגבית? ---- */
const VERIFY = () => {
  const t = document.body.innerText, low = t.toLowerCase();
  const wall = ['create account', 'join now', 'sign up to continue', 'log in to continue'].filter(w => low.includes(w));
  const els = document.querySelectorAll('body *').length;
  /* ראיות של עמוד-מגבית */
  const money = (t.match(/[₪$£€]\s?[\d,]{2,}/g) || []).length;          /* סכומים */
  const goal = /goal|raised|target|יעד|נאספו|גויס/i.test(t);
  const donors = /donor|backer|supporter|תורמ|תומכ/i.test(t);
  const cta = [...document.querySelectorAll('button,a')].filter(e => /donate|give|back this|support|תרומה|תרמו|לתרום/i.test(e.innerText || '')).length;
  /* פס-התקדמות: אלמנט רחב ונמוך מאוד */
  const bars = [...document.querySelectorAll('body *')].filter(el => {
    const r = el.getBoundingClientRect();
    return r.width > 90 && r.height >= 3 && r.height <= 16 && getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)';
  }).length;
  return { wall, els, money, goal, donors, cta, bars, title: document.title.slice(0, 58) };
};
const reject = v => v.wall.length ? 'חומת-הרשמה' : v.els < 150 ? `דף ריק (${v.els})`
  : v.money < 2 ? `רק ${v.money} סכומים — לא עמוד-מגבית`
    : v.cta < 1 ? 'אין כפתור-תרומה' : null;

const b = await chromium.launch();
const out = [];
for (const s of SITES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3800);
    for (const t of ['Accept', 'Accept all', 'Accept All Cookies', 'I agree', 'Got it', 'Allow all', 'אישור', 'קבל']) {
      const x = p.locator(`button:has-text("${t}")`).first();
      if (await x.count() && await x.isVisible().catch(() => false)) { await x.click().catch(() => { }); await p.waitForTimeout(900); break; }
    }
    const v = await p.evaluate(VERIFY);
    await p.screenshot({ path: join(here, 'shots', s.id + '.png') });
    const why = reject(v);
    if (why) { console.log(`✗ ${s.name.padEnd(15)} נפסל — ${why}`); out.push({ ...s, rejected: why, v }); await p.close(); continue; }
    const m = await p.evaluate(EXTRACT);
    out.push({ ...s, v, m });
    console.log(`✓ ${s.name.padEnd(15)} ${String(v.money).padStart(3)} סכומים · ${v.cta} כפתורי-תרומה · ${v.bars} פסים · גוף ${m.body.size}/${m.body.lh} · רקע ${m.body.bg} · r ${m.radii.slice(0, 3).map(x => x.v).join(' ')}`);
  } catch (e) { console.log(`✗ ${s.name.padEnd(15)} ${String(e.message).slice(0, 40)}`); out.push({ ...s, rejected: String(e.message).slice(0, 40) }); }
  await p.close();
}
await b.close();
writeFileSync(join(here, 'probe.json'), JSON.stringify(out, null, 1));
const good = out.filter(x => x.m).length;
console.log(`\n${good} עברו אימות · ${out.length - good} נפסלו`);
