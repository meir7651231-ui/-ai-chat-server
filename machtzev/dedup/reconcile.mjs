#!/usr/bin/env node
/** מחצב · 🚨 המשטרה — משוואות-השלמות. כל הפרה = exit 1 אדום. */
import fs from 'node:fs';
import { rminhu, had, pliga, lo } from '../../yeshiva/rminhu.mjs';   // 🕯️ «אין» = «לא-חיפשת» (הכרעה-23)
const R = new URL('../registry/', import.meta.url).pathname;
let fail = 0;
const alarm = (msg) => { console.error('🚨 ' + msg); fail = 1; };
const ok = (msg) => console.log('✓ ' + msg);

// משוואה 1: אפס יתומים בכל מפקד
for (const f of fs.readdirSync(R).filter(f => f.startsWith('census-'))) {
  const c = JSON.parse(fs.readFileSync(R + f));
  c.totals.orphans === 0 ? ok(`מפקד ${c.repo}: ‏${c.totals.files} קבצים · 100% משויכים`)
                         : alarm(`מפקד ${c.repo}: ‏${c.totals.orphans} קבצים יתומים!`);
}
// משוואה 2: כל מזהה-אטום ייחודי גלובלית
const seen = new Map();
for (const f of fs.readdirSync(R).filter(f => f.startsWith('atoms-'))) {
  for (const a of JSON.parse(fs.readFileSync(R + f))) {
    if (seen.has(a.id) && seen.get(a.id) !== a.source) alarm(`מזהה כפול: ${a.id} (${seen.get(a.id)} ↔ ${a.source})`);
    seen.set(a.id, a.source);
  }
}
ok(`‏${seen.size} אטומים רשומים · אפס כפילויות-מזהה`);
// משוואה 3: כל אטום מצביע לקובץ-מקור קיים במפקד
const censusFiles = new Set();
for (const f of fs.readdirSync(R).filter(f => f.startsWith('census-'))) {
  const c = JSON.parse(fs.readFileSync(R + f));
  c.files.forEach(x => censusFiles.add(`${c.repo}/${x.path}`));
}
let ghosts = 0;
for (const [id, src] of seen) if (!censusFiles.has(src.replace(/:\d+(-\d+)?$/, ''))) { alarm(`רשומת-רפאים: ${id} ← ${src}`); ghosts++; }
if (!ghosts) ok('אפס רשומות-רפאים — כל אטום מגובה בקובץ חי');
// 🕯️ ורמינהו על שלוש המשוואות: `ok('אפס רשומות-רפאים')` הוא «אין» — ו«אין» שלא אומר על
//    כמה נסרק הוא ירוק-חלול (L110 §1). שער שמאמת 0 אטומים מדפיס בדיוק את אותו ✓ כמו שער
//    שאימת 50,000. עכשיו כל משוואה נפסקת עם **ההיקף שלה**, ואפס-היקף הוא פליגא, לא ✓.
rminhu({ engine: 'reconcile', matter: 'משוואות-השלמות של המרשם', searched: [R],
  rulings: [
    seen.size ? had(`משוואה 2: ${seen.size} אטומים רשומים`, 'אפס כפילויות-מזהה על היקף שנמדד') : pliga('משוואה 2', '0 אטומים רשומים — ✓ על אפס-היקף הוא ירוק-חלול (L110 §1): השער אימת ריקנות, לא שלמות'),
    censusFiles.size ? had(`משוואה 3: ${censusFiles.size} קובצי-מפקד`, `${ghosts} רשומות-רפאים`) : pliga('משוואה 3', '0 קובצי-מפקד — «אפס רשומות-רפאים» נובע מחוסר-מפקד ולא מגיבוי-מלא'),
  ] });
(await import('../../yeshiva/rminhu.mjs')).printNotes('reconcile');
process.exit(fail);
