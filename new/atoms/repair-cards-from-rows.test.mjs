import { repairCardsFromRows } from './repair-cards-from-rows.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

// שקע-המילוי מהחוזה: ממלא טלפון רק אם ריק; אותה הפניה כשאין מה למלא
const fill = (sp, row) => (row.phone && !(sp.phone || '').trim() ? { ...sp, phone: row.phone } : sp);

// 1) תיוג-מחדש
const r1 = repairCardsFromRows([{ id: 's1', hist: [{ txn: 'T1', clearer: 'נדרים' }] }], [{ txnId: 'T1' }], 'סולה', fill);
ok(r1.relabeled === 1 && r1.enriched === 0, `תיוג-מחדש: מונים שגויים (${r1.relabeled},${r1.enriched})`);
eq(r1.supporters[0].hist[0].clearer, 'סולה', 'התווית לא תוקנה');

// 2) אידמפוטנטיות — הרצה שנייה 0/0 + אותה הפניה
const r2 = repairCardsFromRows(r1.supporters, [{ txnId: 'T1' }], 'סולה', fill);
ok(r2.relabeled === 0 && r2.enriched === 0, `אידמפוטנטיות: מונים שגויים (${r2.relabeled},${r2.enriched})`);
ok(r2.supporters[0] === r1.supporters[0], 'כרטיס-ללא-שינוי שוכתב בהרצה שנייה');

// 3) העשרה — מילוי טלפון ריק
const r3 = repairCardsFromRows(
  [{ id: 's1', phone: '', hist: [{ txn: 'T1', clearer: 'סולה' }] }],
  [{ txnId: 'T1', phone: '0501234567' }], 'סולה', fill);
ok(r3.relabeled === 0 && r3.enriched === 1, `העשרה: מונים שגויים (${r3.relabeled},${r3.enriched})`);
eq(r3.supporters[0].phone, '0501234567', 'הטלפון לא מולא');

// 4) נפילת-מפתח ל-ref/reference
const r4 = repairCardsFromRows(
  [{ id: 's1', hist: [{ ref: 'R9', clearer: 'x' }] }],
  [{ txnId: '', reference: 'R9' }], 'סולה', fill);
ok(r4.relabeled === 1, 'נפילה ל-ref לא עבדה');
eq(r4.supporters[0].hist[0].clearer, 'סולה', 'תווית-ref לא תוקנה');

// 5) רשומות בלי מפתח — החזרה מיידית של אותו מערך
const sup5 = [{ id: 's1', hist: [{ txn: 'T1', clearer: 'x' }] }];
const r5 = repairCardsFromRows(sup5, [{ txnId: '', reference: '' }], 'סולה', fill);
ok(r5.supporters === sup5 && r5.relabeled === 0 && r5.enriched === 0, 'אין-קלט לא הוחזר כמות-שהוא');

// 6) כפילות-מפתח — המופע הראשון גובר
const r6 = repairCardsFromRows(
  [{ id: 's1', phone: '', hist: [{ txn: 'T1', clearer: 'סולה' }] }],
  [{ txnId: 'T1', phone: '050' }, { txnId: 'T1', phone: '052' }], 'סולה', fill);
eq(r6.supporters[0].phone, '050', 'המופע הראשון לא גבר');
ok(r6.enriched === 1, `כפילות-מפתח: enriched שגוי (${r6.enriched})`);

// 7) כרטיס לא-קשור חוזר באותה הפניה
const spA = { id: 'a', hist: [{ txn: 'ZZZ', clearer: 'x' }] };
const spB = { id: 'b' }; // בלי hist
const r7 = repairCardsFromRows([spA, spB], [{ txnId: 'T1' }], 'סולה', fill);
ok(r7.supporters[0] === spA && r7.supporters[1] === spB, 'כרטיס לא-קשור שוכתב');

if (f) process.exit(1);
console.log('✓ repair-cards-from-rows: 7 דוגמאות-חוזה — ירוק');
