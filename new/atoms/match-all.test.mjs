import { matchAll } from './match-all.mjs';
// שקע-דמה מתועד-בחוזה: שיוך-יחיד לפי-סכום, מחזיר את הפלן-הפתוח הראשון (מקומי לבדיקה)
const matcher = (inc, open) => {
  const r = open.find((o) => o.plan.amount === inc.amount);
  return r ? { ...r, incomingId: inc.id, confidence: 100 } : null;
};
const ref = (id, amount) => ({ entityId: 'e' + id, plan: { id, amount } });
const inc = (id, amount) => ({ id, amount });

let f = 0;
const bad = (msg) => { console.error('✗ ' + msg); f = 1; };

// 1) 2 תשלומים · 2 פלנים → 2 התאמות
let out = matchAll([inc('i1', 100), inc('i2', 200)], [ref('p1', 100), ref('p2', 200)], matcher);
if (out.length !== 2 || out[0].plan.id !== 'p1' || out[1].plan.id !== 'p2') bad(`2×2: ${JSON.stringify(out.map((o) => o.plan.id))}`);

// 2) 2 תשלומים זהים · 2 פלנים זהים → 2 התאמות בפלנים שונים (אנטי-כפילות בוחרת את הבא)
out = matchAll([inc('i1', 100), inc('i2', 100)], [ref('p1', 100), ref('p3', 100)], matcher);
if (out.length !== 2 || out[0].plan.id !== 'p1' || out[1].plan.id !== 'p3') bad(`2זהים×2: ${JSON.stringify(out.map((o) => o.plan.id))}`);

// 3) 2 תשלומים זהים · פלן-יחיד → התאמה-אחת (הפלן לא נתפס פעמיים)
out = matchAll([inc('i1', 100), inc('i2', 100)], [ref('p1', 100)], matcher);
if (out.length !== 1 || out[0].plan.id !== 'p1') bad(`2זהים×1: ${JSON.stringify(out.map((o) => o.plan.id))}`);

// 4) תשלום ללא-סכום-תואם → 0 התאמות
out = matchAll([inc('i1', 999)], [ref('p1', 100)], matcher);
if (out.length !== 0) bad(`ללא-תאום: ${JSON.stringify(out)}`);

if (f) process.exit(1);
console.log('✓ match-all: 4 דוגמאות-חוזה — ירוק');
