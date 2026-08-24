import { explodeSupporter } from './explode-supporter.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const pk = (d) => ((d.purpose ?? '').trim() || '_shared_'); // השקע האמיתי
// 1) בלי donations
ok(eq(explodeSupporter({ id: 's1' }, pk), []), 'תומך בלי donations לא החזיר []');
// 2) מסמך מלא
const d7 = { rid: 'D-7', amount: 100, purpose: 'חתן' };
ok(eq(explodeSupporter({ id: 's1', donations: [d7] }, pk),
  [{ id: 'D-7', supporterId: 's1', pkey: 'חתן', donation: d7 }]), 'מסמך D-7 שגוי');
// 3) ייעוד ריק ⇒ משותף
const r3 = explodeSupporter({ id: 's1', donations: [{ rid: 'D-8', amount: 50 }] }, pk);
ok(r3[0].pkey === '_shared_', 'ייעוד-ריק לא הפך _shared_');
// 4) ביט-זהה — זהות-הפניה
const r4 = explodeSupporter({ id: 's1', donations: [d7] }, pk);
ok(r4[0].donation === d7, 'התרומה הועתקה במקום להישמר בזהות-הפניה');
// 5) סדר-המקור נשמר, אפס מיון
const r5 = explodeSupporter({ id: 's1', donations: [{ rid: 'D-9', date: '2026-03-01' }, { rid: 'D-2', date: '2026-01-01' }] }, pk);
ok(eq(r5.map((x) => x.id), ['D-9', 'D-2']), 'הסדר שונה/מוין');
// 6) hist לא דולף + בדיוק 4 שדות
const r6 = explodeSupporter({ id: 's1', hist: [{ ils: 200 }], donations: [d7] }, pk);
ok(r6.every((x) => eq(Object.keys(x).sort(), ['donation', 'id', 'pkey', 'supporterId'])), 'שדה זר (hist?) דלף למסמך');
if (f) process.exit(1);
console.log('✓ explode-supporter: 6 דוגמאות-חוזה — ירוק');
