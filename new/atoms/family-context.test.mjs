import { familyContext } from './family-context.mjs';
let f = 0;
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// 1) מסירות: 'delivered' ומשפחה-אחרת לא נספרים
eq(familyContext({ deliveries: [{ familyId: 'f1', status: 'pickup' }, { familyId: 'f1', status: 'delivered' }, { familyId: 'f2', status: 'pickup' }] }, 'f1'),
  { openDeliveries: 1, activeAssignments: 0 }, 'ספירת-מסירות שגויה');

// 2) שיוכים: רק 'active'
eq(familyContext({ shopAssignments: [{ famId: 'f1', status: 'active' }, { famId: 'f1', status: 'redeemed' }, { famId: 'f2', status: 'active' }] }, 'f1'),
  { openDeliveries: 0, activeAssignments: 1 }, 'ספירת-שיוכים שגויה');

// 3) db בלי המערכים ⇒ אפסים בלי קריסה
eq(familyContext({}, 'f1'), { openDeliveries: 0, activeAssignments: 0 }, 'db ריק קרס/שגוי');

// 4) מסירה בלי status = פתוחה; שיוך בלי status = לא נספר
eq(familyContext({ deliveries: [{ familyId: 'f1' }], shopAssignments: [{ famId: 'f1' }] }, 'f1'),
  { openDeliveries: 1, activeAssignments: 0 }, 'דין חסר-סטטוס שגוי');

// 5) הצלבת-שדות: famId במסירה / familyId בשיוך — לא נספרים
eq(familyContext({ deliveries: [{ famId: 'f1', status: 'pickup' }], shopAssignments: [{ familyId: 'f1', status: 'active' }] }, 'f1'),
  { openDeliveries: 0, activeAssignments: 0 }, 'שמות-השדה התחלפו');

if (f) process.exit(1);
console.log('✓ family-context: 5 דוגמאות-חוזה — ירוק');
