/** בדיקת-קצה · קופסת-החנות — 10 דוגמאות-החוזה דרך הקופסה בלבד + מגן-הכרעה.
 *  DoD (לפני-הקוד, דיבר 12): node shop.test.mjs ⇒ exit 0. מייבא רק את הקופסה-שלה. */
import * as SHOP from './shop.mjs';
import { readFileSync } from 'node:fs';

let f = 0;
const bad = (m) => { console.error('✗ ' + m); f = 1; };
const eq = (got, want, m) => { if (JSON.stringify(got) !== JSON.stringify(want)) bad(`${m}: קיבלתי ${JSON.stringify(got)} במקום ${JSON.stringify(want)}`); };

// 1) liveRedemptions — מבוטל מוחרג
eq(SHOP.liveRedemptions({ redemptions: [{ value: 1, voidedAt: null }, { value: 2, voidedAt: '2026-01-01' }] }).length, 1, 'liveRedemptions');

// 2) maxDiscountPct — הגבוה
eq(SHOP.maxDiscountPct(['c1', 'c2'], [{ id: 'c1', discountPct: 10 }, { id: 'c2', discountPct: 25 }]), 25, 'maxDiscountPct');

// 3) effectivePrice — 100 פחות 25% = 75
eq(SHOP.effectivePrice(100, ['c2'], [{ id: 'c2', discountPct: 25 }]), 75, 'effectivePrice');

// 4) subsidyTotal — 100-30=70; אחרי ביטול=0
eq(SHOP.subsidyTotal([{ redemptions: [{ value: 100, paid: 30, voidedAt: null }] }]), 70, 'subsidyTotal חי');
eq(SHOP.subsidyTotal([{ redemptions: [{ value: 100, paid: 30, voidedAt: 'x' }] }]), 0, 'subsidyTotal מבוטל');

// 5) itemRemaining — 5 פחות מימוש-חי אחד = 4 (מבוטל אינו נספר)
const dbStock = {
  shopItems: [{ id: 'it', stock: 5 }],
  shopProducts: [{ id: 'p', components: [{ id: 'c', itemId: 'it' }] }],
  shopAssignments: [{ id: 'a', productId: 'p', redemptions: [{ componentId: 'c', voidedAt: null }, { componentId: 'c', voidedAt: 'x' }] }],
};
eq(SHOP.itemRemaining(dbStock, 'it'), 4, 'itemRemaining');

// 6) beneficiaryLabel — בלי/עם config (termOf מחווט)
const dbFam = { families: [{ id: 'f', name: 'לוי', members: [] }] };
eq(SHOP.beneficiaryLabel(dbFam, { famId: 'f' }), 'משפחת לוי', 'beneficiaryLabel default');
eq(SHOP.beneficiaryLabel(dbFam, { famId: 'f' }, { terms: { 'entity.familyOf': 'בית' } }), 'בית לוי', 'beneficiaryLabel term');

// 7) couponExpiry — since+validDays; בלי validDays ⇒ ''
eq(SHOP.couponExpiry({ since: '2026-08-01' }, { validDays: 10 }), '2026-08-11', 'couponExpiry');
eq(SHOP.couponExpiry({ since: '2026-08-01' }, {}), '', 'couponExpiry ריק');

// 8) upcomingHolidays — holidayOf מוזרק (מחזיר 'X' ב-3 לחודש) ⇒ פריט יחיד (שם-כפול מנוכה)
const holidayOfX = (d) => (d.getDate() === 3 ? 'X' : null);
eq(SHOP.upcomingHolidays('2026-08-01', 45, holidayOfX), [{ iso: '2026-08-03', name: 'X' }], 'upcomingHolidays');

// 9) filterProducts — smartFilter מוזרק (זהות) + onlyActive
const identity = (_q, items) => items.slice();
eq(SHOP.filterProducts([{ name: 'א', active: true }, { name: 'ב', active: false }], '', true, identity).length, 1, 'filterProducts onlyActive');

// 10) needsCare — קופון-שפקע ⇒ couponExpired; featureOn מוזרק מגדר 'expiring'
const dbCare = {
  shopItems: [{ id: 'it1', name: 'חלב', kind: 'coupon', active: true }],
  shopProducts: [{ id: 'p1', name: 'סל', active: true, components: [{ id: 'cmp1', kind: 'coupon', label: 'קופון', validDays: 10 }] }],
  shopAssignments: [{ id: 'a1', productId: 'p1', famId: 'f1', status: 'active', since: '2026-01-01', redemptions: [] }],
  families: [{ id: 'f1', name: 'כהן', members: [] }],
  shopIntakes: [{ id: 'in1', itemId: 'it1', expiry: '2026-07-01', qty: 5, date: '2026-06-01', cost: 0 }],
  rooms: [], shopEvents: [],
};
const holidayOfNull = () => null;
const careOff = SHOP.needsCare(dbCare, '2026-08-01', { features: {} }, holidayOfNull, () => false);
if (!careOff.some((x) => x.kind === 'couponExpired')) bad('needsCare: קופון-שפקע לא דווח');
if (careOff.some((x) => x.kind === 'expiring')) bad('needsCare: featureOn=false לא גידר expiring');
const careOn = SHOP.needsCare(dbCare, '2026-08-01', { features: {} }, holidayOfNull, () => true);
if (!careOn.some((x) => x.kind === 'expiring')) bad('needsCare: featureOn=true לא הפיק expiring');

/* 🛡 מגן-הכרעה: קריאת מקור-הקופסה — ההכרעות מאומתות verbatim (דפוס theme.test). */
const src = readFileSync(new URL('./shop.mjs', import.meta.url), 'utf8');
// כלל-הצהריים ל-hebYearOf חי בקופסה, מילה-במילה מהמקור (lib.ts:171-173)
if (!src.includes("hebParts(new Date(iso + 'T12:00:00')).year")) bad('מגן: כלל-הצהריים ל-hebYearOf שונה מהמקור');
// holidayOf/smartFilter/featureOn מוזרקים — אסור שיובאו כאטומים (הכרעת-הזרקה)
for (const inj of ['holiday-of.mjs', 'smart-filter.mjs', 'feature-on.mjs']) {
  if (src.includes(inj)) bad('מגן: ' + inj + ' יובא כאטום במקום להיות שקע-מוזרק');
}
// עלי-השכן חסרי-השקע דווקא מיובאים כאטומים (הכרעת-חיווט)
for (const leaf of ['term-of.mjs', 'date-in-range.mjs', 'heb-parts.mjs', 'iso-local.mjs']) {
  if (!src.includes(leaf)) bad('מגן: ' + leaf + ' לא מיובא כאטום-שכן');
}
// סדר-הקדימות ב-needsCare מסופק ע"י האטום, לא נדרס בקופסה
if (!src.includes('_needsCare(db, todayIso, config, sockets)')) bad('מגן: needsCare עוקף את חיווט-האטום');

if (f) process.exit(1);
console.log('✓ קופסת-החנות: 10 דוגמאות-חוזה דרך הקופסה + מגן-הכרעה (צהריים/הזרקה/עלי-שכן) — ירוקים');
