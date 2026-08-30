import { coordinatorPrintLines as __pure_coordinatorPrintLines } from './coordinator-print-lines.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_coordinatorPrintLines_COORDINATOR_PRINT_LINES_T = {
  k1: "home",
  k2: "office",
  k3: "רשימת קופות — ",
  k4: "entity.familyOf",
  k5: "משפחת",
  k6: "במשרד",
  k7: "ריקון אחרון: ",
  k8: "טרם רוקנה",
  k9: "אין קופות פעילות",
  k10: 30,
};
const coordinatorPrintLines = (...a) => __pure_coordinatorPrintLines(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_coordinatorPrintLines_COORDINATOR_PRINT_LINES_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקעים חוזיים (מדמים את שכני-המקור)
const termOf = (config, key, fb) => config?.terms?.[key] ?? fb;
const coordinatorBoxes = (boxes, coordId) => boxes.filter((b) => b.coordinatorId === coordId);
const lastCollectionIso = (box) => {
  let last = '';
  for (const c of box.collections) if (c.date > last) last = c.date;
  return last;
};
const db = {
  tzCoordinators: [{ id: 'c1', name: 'רחל' }],
  families: [{ id: 'f1', name: 'לוי', address: 'הרצל 3', city: 'צפת', phone: '050-1' }],
  tzBoxes: [
    { id: 'b1', num: 7, coordinatorId: 'c1', status: 'home', famId: 'f1', collections: [{ date: '2026-05-01' }, { date: '2026-06-15' }] },
    { id: 'b2', num: 9, coordinatorId: 'c1', status: 'office', famId: '', collections: [] },
    { id: 'b3', num: 11, coordinatorId: 'c1', status: 'lost', famId: '', collections: [] },
    { id: 'b4', num: 12, coordinatorId: 'c2', status: 'home', famId: 'f1', collections: [] },
  ],
};
// 1) בלי config — נוסח היסטורי
const r1 = coordinatorPrintLines(db, 'c1', undefined, termOf, coordinatorBoxes, lastCollectionIso);
ok(r1.length === 4, '1: מספר-שורות ≠ 4 (קיבלנו ' + r1.length + ')');
ok(r1[0] === 'רשימת קופות — רחל', '1: כותרת שגויה: "' + r1[0] + '"');
ok(r1[1] === '='.repeat(30), '1: קו-מפריד ≠ 30×"="');
ok(r1[2] === '#7 · משפחת לוי · הרצל 3, צפת · 050-1 · ריקון אחרון: 2026-06-15', '1: שורת-#7 שגויה: "' + r1[2] + '"');
ok(r1[3] === '#9 · במשרד · טרם רוקנה', '1: שורת-#9 שגויה: "' + r1[3] + '"');
// 2) עם config — דריסת-מונח
const cfg = { terms: { 'entity.familyOf': 'בית' } };
const r2 = coordinatorPrintLines(db, 'c1', cfg, termOf, coordinatorBoxes, lastCollectionIso);
ok(r2[2].startsWith('#7 · בית לוי · '), '2: דריסת-מונח לא כובדה: "' + r2[2] + '"');
// 3) רכז לא-מוכר
const r3 = coordinatorPrintLines(db, 'cX', undefined, termOf, coordinatorBoxes, lastCollectionIso);
ok(r3.length === 3 && r3[0] === 'רשימת קופות — ' && r3[2] === 'אין קופות פעילות', '3: מקרה-רכז-לא-מוכר שגוי');
if (f) process.exit(1);
console.log('✓ coordinator-print-lines: 3 דוגמאות-חוזה (8 בדיקות) — ירוק');
