// בדיקת-חוזה · hok-due — מוכיחה את 5 דוגמאות-החוזה. מייבאת רק את האטום-שלה.
// שקעי-הדוגמה מהחוזה: active לפי הדגל · recorded לפי סמן rec.
import { hokDue } from './hok-due.mjs';

const T = '2026-08-24';
const active = (sp) => !!sp.hok?.active;
const recorded = (sp) => !!sp.rec;
const due = (list) => hokDue(list, T, active, recorded);

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

const A = { name: 'א', hok: { active: true, day: 20 } };
const B = { name: 'ב', hok: { active: true, day: 5 } };
const C = { name: 'ג', hok: { active: false, day: 1 } };

// 1) סינון לא-פעיל + מיון עולה לפי יום-חיוב
const r1 = due([A, B, C]);
ok(r1.length === 2 && r1[0] === B && r1[1] === A, 'סינון/מיון [A,B,C] ≠ [B,A]');
// 2) נרשם-החודש נופל
const B2 = { ...B, rec: true };
const r2 = due([A, B2]);
ok(r2.length === 1 && r2[0] === A, 'תומך שנרשם החודש לא סונן');
// 3) חסר-day ⇒ 0 ⇒ ראשון
const D = { name: 'ד', hok: { active: true } };
const r3 = due([A, D]);
ok(r3.length === 2 && r3[0] === D && r3[1] === A, 'חסר-day לא מוין ראשון');
// 4) ריק בטוח
ok(due([]).length === 0, '[] לא החזיר []');
// 5) מערך-הקלט לא משתנה
const input = [A, B, C];
due(input);
ok(input[0] === A && input[1] === B && input[2] === C, 'מערך-הקלט שונה (מוטציה)');

if (f) process.exit(1);
console.log('✓ hok-due: 5 דוגמאות-חוזה — ירוק');
