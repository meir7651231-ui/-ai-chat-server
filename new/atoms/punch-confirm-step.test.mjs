import { punchConfirmStep, PUNCH_CONFIRM_MS } from './punch-confirm-step.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (r, fire, next, label) => {
  ok(r.fire === fire, label + ': fire=' + r.fire + ' ≠ ' + fire);
  if (next === null) ok(r.next === null, label + ': next ≠ null');
  else ok(r.next && r.next.id === next.id && r.next.armedAt === next.armedAt, label + ': next=' + JSON.stringify(r.next) + ' ≠ ' + JSON.stringify(next));
};
ok(PUNCH_CONFIRM_MS === 3000, 'PUNCH_CONFIRM_MS ≠ 3000');
// 1) דגל כבוי ⇒ ביצוע מיידי, גם עם זריון ישן
eq(punchConfirmStep(false, { id: 'e1', armedAt: 0 }, 'e1', 999999), true, null, 'דגל-כבוי');
// 2) לחיצה ראשונה ⇒ זריון
eq(punchConfirmStep(true, null, 'e1', 10000), false, { id: 'e1', armedAt: 10000 }, 'לחיצה-ראשונה');
// 3) לחיצה שנייה בתוך החלון — קצה-כולל (בדיוק 3000ms)
eq(punchConfirmStep(true, { id: 'e1', armedAt: 10000 }, 'e1', 13000), true, null, 'קצה-החלון');
// 4) החלון פג (3001ms) ⇒ זריון-מחדש מהרגע הנוכחי
eq(punchConfirmStep(true, { id: 'e1', armedAt: 10000 }, 'e1', 13001), false, { id: 'e1', armedAt: 13001 }, 'חלון-פג');
// 5) שיבוץ אחר ⇒ הזריון עובר אליו
eq(punchConfirmStep(true, { id: 'e1', armedAt: 10000 }, 'e2', 10500), false, { id: 'e2', armedAt: 10500 }, 'שיבוץ-אחר');
if (f) process.exit(1);
console.log('✓ punch-confirm-step: 5 דוגמאות-חוזה — ירוק');
