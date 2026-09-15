/* mdm.mjs — בדיקה של רשימת ספקי-ה-MDM: האם הממשק שלהם בכלל נראה בלי חשבון,
   ואיך הוא נמדד מול חמשת האתרים שהבעלים בחר. אותו מכשיר מדידה בדיוק. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { EXTRACT } from '../measure/extract.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'mdm'), { recursive: true });

const V = [
  { id: 'semarchy', name: 'Semarchy', url: 'https://semarchy.com/' },
  { id: 'profisee', name: 'Profisee', url: 'https://profisee.com/' },
  { id: 'reltio', name: 'Reltio', url: 'https://www.reltio.com/' },
  { id: 'informatica', name: 'Informatica', url: 'https://www.informatica.com/products/master-data-management.html' },
  { id: 'ataccama', name: 'Ataccama', url: 'https://www.ataccama.com/' },
];

/* האם העמוד מציג ממשק, או רק «בקש הדגמה»? */
const GATE = () => {
  const txt = document.body.innerText.toLowerCase();
  const wall = ['request a demo', 'book a demo', 'get a demo', 'contact sales', 'talk to sales', 'schedule a demo']
    .filter(w => txt.includes(w));
  const imgs = [...document.querySelectorAll('img,video')].filter(e => {
    const r = e.getBoundingClientRect(); return r.width > 300 && r.height > 180;
  }).length;
  const freeTrial = ['start free', 'try free', 'sign up free', 'free trial'].filter(w => txt.includes(w));
  return { wall, freeTrial, bigMedia: imgs, words: txt.split(/\s+/).length };
};

const b = await chromium.launch();
const out = [];
for (const s of V) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3500);
    for (const t of ['Accept', 'Accept All', 'Accept all cookies', 'I agree', 'Got it', 'Allow all']) {
      const btn = p.locator(`button:has-text("${t}")`).first();
      if (await btn.count() && await btn.isVisible().catch(() => false)) { await btn.click().catch(() => { }); await p.waitForTimeout(800); break; }
    }
    const g = await p.evaluate(GATE);
    const m = await p.evaluate(EXTRACT);
    await p.screenshot({ path: join(here, 'mdm', s.id + '.png') });
    out.push({ ...s, ...g, body: m.body, radii: m.radii.slice(0, 4), type: m.type, buttons: m.buttons.length, elements: m.elements });
    console.log(`✓ ${s.name.padEnd(13)} חומת-מכירות: ${g.wall.length ? g.wall.join('/') : 'אין'} · ניסיון-חינם: ${g.freeTrial.length ? 'יש' : 'אין'} · מדיה-גדולה ${g.bigMedia} · ${m.elements} אלמנטים`);
  } catch (e) { console.log('✗ ' + s.name + ' — ' + String(e.message).slice(0, 60)); out.push({ ...s, err: String(e.message).slice(0, 60) }); }
  await p.close();
}
await b.close();
writeFileSync(join(here, 'mdm.json'), JSON.stringify(out, null, 1));
