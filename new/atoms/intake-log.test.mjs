import { intakeLog } from './intake-log.mjs';
const items = [{ id: 'i1', name: 'סל מזון' }, { id: 'i2', name: 'שמיכה' }];
let f = 0;
const chk = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`✗ ${name}: ${g} ≠ ${w}`); f = 1; }
};

// 1) מיון תאריך-יורד + שמות + סה"כ
const a = { itemId: 'i1', date: '2026-08-01', cost: 120 };
const b = { itemId: 'i2', date: '2026-08-20', cost: 80 };
chk('חדש-ראשון+סהכ', intakeLog({ shopIntakes: [a, b], shopItems: items }), {
  rows: [{ intake: b, itemName: 'שמיכה' }, { intake: a, itemName: 'סל מזון' }],
  totalCost: 200,
});
// 2) פריט לא-קיים ⇒ "—" (העלות נספרת)
const x = { itemId: 'iX', date: '2026-08-10', cost: 50 };
chk('פריט-חסר', intakeLog({ shopIntakes: [x], shopItems: items }), {
  rows: [{ intake: x, itemName: '—' }], totalCost: 50,
});
// 3) תרומה-בעין cost=0 — ביומן, לא בסכום
const z = { itemId: 'i2', date: '2026-08-05', cost: 0 };
chk('תרומה-בעין', intakeLog({ shopIntakes: [a, z], shopItems: items }), {
  rows: [{ intake: z, itemName: 'שמיכה' }, { intake: a, itemName: 'סל מזון' }],
  totalCost: 120,
});
// 4) שוויון-תאריך ⇒ סדר-ההזנה (מיון יציב)
const s1 = { itemId: 'i1', date: '2026-08-15', cost: 10 };
const s2 = { itemId: 'i2', date: '2026-08-15', cost: 20 };
chk('מיון-יציב', intakeLog({ shopIntakes: [s1, s2], shopItems: items }).rows.map((r) => r.intake),
  [s1, s2]);
// 5) ריק
chk('ריק', intakeLog({ shopIntakes: [], shopItems: items }), { rows: [], totalCost: 0 });

if (f) process.exit(1);
console.log('✓ intake-log: 5 דוגמאות-חוזה — ירוק');
