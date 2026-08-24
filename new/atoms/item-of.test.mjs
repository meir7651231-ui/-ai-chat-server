import { itemOf } from './item-of.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eqJ = (a, b, msg) => {
  const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A !== B) { console.error(`✗ ${msg}\n  קיבלנו: ${A}\n  ציפינו: ${B}`); f = 1; }
};

const i1 = { id: 'i1', name: 'קופון מזון', kind: 'coupon', storeId: 's1', value: 100, basePrice: 20, stock: 5, validDays: 30, holidays: ['פסח'], active: false };
const db = { shopItems: [i1] };

// 1) רכיב מצביע בלי דריסות — הפריט גובר על שדות-התאימות
eqJ(
  itemOf(db, { itemId: 'i1', label: 'ישן', kind: 'x', storeId: 'sX' }),
  { itemId: 'i1', name: 'קופון מזון', kind: 'coupon', storeId: 's1', value: 100, basePrice: 20, stock: 5, validDays: 30, holidays: ['פסח'], active: false },
  '1: פענוח בלי דריסות שגוי',
);

// 2) דריסות value/basePrice — גם 0 דורס (?? ולא ||)
const r2 = itemOf(db, { itemId: 'i1', label: 'ישן', kind: 'x', storeId: 'sX', value: 80, basePrice: 0 });
ok(r2.value === 80, '2: value=80 לא דרס');
ok(r2.basePrice === 0, '2: basePrice=0 לא דרס (?? ולא ||)');
ok(r2.name === 'קופון מזון' && r2.stock === 5 && r2.active === false, '2: שאר-השדות לא מהפריט');

// 3) מצביע שבור — נפילת-תאימות לשדות-הרכיב, active:true, בלי holidays
eqJ(
  itemOf(db, { itemId: 'iZZZ', label: 'רכיב ישן', kind: 'gift', storeId: 's9', value: 50, basePrice: 10, stock: 3, validDays: 7 }),
  { itemId: 'iZZZ', name: 'רכיב ישן', kind: 'gift', storeId: 's9', value: 50, basePrice: 10, stock: 3, validDays: 7, active: true },
  '3: נפילת-תאימות שגויה',
);
ok(!('holidays' in itemOf(db, { itemId: 'iZZZ', label: 'x', kind: 'gift', storeId: '' })), '3: נפילה לא אמורה לשאת holidays');

// 4) מצביע שבור בלי שדות-תאימות — ברירות ?? 0
const r4 = itemOf(db, { itemId: '', label: 'ריק', kind: 'meet', storeId: '' });
ok(r4.value === 0 && r4.basePrice === 0, '4: value/basePrice לא נפלו ל-0');
ok(r4.stock === undefined && r4.validDays === undefined && r4.active === true, '4: stock/validDays/active שגויים');

if (f) process.exit(1);
console.log('✓ item-of: 4 דוגמאות-חוזה — ירוק');
