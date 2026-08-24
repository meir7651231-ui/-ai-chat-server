import { needsCare } from './needs-care-shop.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const TODAY = '2026-08-24';
// שקעי-בדיקה דטרמיניסטיים — בסיס ניטרלי, כל דוגמה דורסת מה שהיא צריכה
const base = {
  upcomingHolidays: () => [],
  itemRemaining: () => null,
  componentRemaining: () => null,
  beneficiaryLabel: () => 'משפ׳ לוי',
  itemOf: (db, comp) => comp.__item,
  holidayAllowed: () => true,
  assignmentRedeemed: () => false,
  couponExpiry: () => '',
  featureOn: () => true,
  expiringIntakes: () => [],
  shopHolidayDueDays: 30,
};
const emptyDb = { shopItems: [], shopProducts: [], shopAssignments: [] };

// 1) מלאי אזל — פריט פעיל, rem=0
{
  const db = { ...emptyDb, shopItems: [{ id: 'i1', name: 'סוכר', active: true }] };
  const out = needsCare(db, TODAY, undefined, { ...base, itemRemaining: () => 0 });
  ok(out.length === 1 && out[0].kind === 'stockOut' && out[0].componentId === 'i1'
    && out[0].label === 'סוכר — המלאי אזל' && out[0].hint === 'לחדש מלאי או לעדכן את הפריט',
    'דוגמה 1 (stockOut): ' + JSON.stringify(out));
}
// 2) מלאי נמוך — minStock=5, rem=2
{
  const db = { ...emptyDb, shopItems: [{ id: 'i1', name: 'סוכר', active: true, minStock: 5 }] };
  const out = needsCare(db, TODAY, undefined, { ...base, itemRemaining: () => 2 });
  ok(out.length === 1 && out[0].kind === 'restock' && out[0].label === 'סוכר — המלאי נמוך'
    && out[0].hint === 'להצטייד: נותרו 2 מתחת ל-5', 'דוגמה 2 (restock): ' + JSON.stringify(out));
}
// 3) רשימת-המתנה — waits=2, rem=null (בלי-מעקב ≠ 0); ובמלאי 0 ⇒ בלי waitingRestocked
{
  const db = { ...emptyDb, shopItems: [{ id: 'i1', name: 'סוכר', active: true, waits: ['f1', 'f2'] }] };
  const out = needsCare(db, TODAY, undefined, base); // rem=null
  ok(out.length === 1 && out[0].kind === 'waitingRestocked' && out[0].label === '2 ממתינים לסוכר',
    'דוגמה 3א (waitingRestocked): ' + JSON.stringify(out));
  const outZero = needsCare(db, TODAY, undefined, { ...base, itemRemaining: () => 0 });
  ok(!outZero.some((x) => x.kind === 'waitingRestocked'), 'דוגמה 3ב: במלאי 0 נפלטה התרעת-המתנה');
}
// עזר לשיוך פעיל עם רכיב יחיד
const assignDb = (item) => ({
  ...emptyDb,
  shopProducts: [{ id: 'p1', name: 'חבילה', active: true, components: [{ id: 'c1', itemId: 'i1', __item: item }] }],
  shopAssignments: [{ id: 'a1', productId: 'p1', status: 'active' }],
});
// 4) קופון פג-תוקף / קופון-ממתין
{
  const db = assignDb({ kind: 'coupon', name: 'קופון מזון' });
  const out = needsCare(db, TODAY, undefined, { ...base, couponExpiry: () => '2026-01-01' });
  ok(out.length === 1 && out[0].kind === 'couponExpired' && out[0].assignmentId === 'a1'
    && out[0].hint === 'הקופון פג בתוקף ב-2026-01-01 וטרם מומש', 'דוגמה 4א (couponExpired): ' + JSON.stringify(out));
  const out2 = needsCare(db, TODAY, undefined, base); // בלי תוקף
  ok(out2.length === 1 && out2[0].kind === 'couponPending' && out2[0].hint === 'קופון טרם מומש',
    'דוגמה 4ב (couponPending): ' + JSON.stringify(out2));
}
// 5) פגישה ממתינה; שיוך לא-פעיל ⇒ כלום
{
  const db = assignDb({ kind: 'meeting', name: 'פגישה' });
  const out = needsCare(db, TODAY, undefined, base);
  ok(out.length === 1 && out[0].kind === 'meetingPending' && out[0].label === 'משפ׳ לוי — פגישה'
    && out[0].hint === 'פגישת ליווי טרם התקיימה', 'דוגמה 5א (meetingPending): ' + JSON.stringify(out));
  db.shopAssignments[0].status = 'done';
  ok(needsCare(db, TODAY, undefined, base).length === 0, 'דוגמה 5ב: שיוך לא-פעיל פלט התרעות');
}
// 6) מתנת-חג לפני-מסירה — וקדימות holidayDue על-פני מלאי
{
  const db = assignDb({ kind: 'holidayGift', name: 'סל חג' });
  db.shopItems = [{ id: 'i9', name: 'שמן', active: true }];
  const sockets = {
    ...base,
    upcomingHolidays: () => [{ name: 'ראש השנה', iso: '2026-09-12' }],
    itemRemaining: () => 0, // ייצור גם stockOut — שחייב לבוא אחרי ה-holidayDue
  };
  const out = needsCare(db, TODAY, undefined, sockets);
  ok(out.length === 2 && out[0].kind === 'holidayDue'
    && out[0].hint === 'ראש השנה ב-2026-09-12 — טרם נמסרה' && out[1].kind === 'stockOut',
    'דוגמה 6 (holidayDue ראשון): ' + JSON.stringify(out));
}
// 7) גידור-תפוגה: featureOn=false ⇒ אפס expiring; בלי config ⇒ נפלט
{
  const expiring = () => [{ intake: { itemId: 'i1', expiry: '2026-08-20', qty: 4 }, itemName: 'חלב', expired: true }];
  const off = needsCare(emptyDb, TODAY, { flags: {} }, { ...base, featureOn: () => false, expiringIntakes: expiring });
  ok(off.length === 0, 'דוגמה 7א: דגל כבוי ועדיין נפלטה התרעת-תפוגה');
  const on = needsCare(emptyDb, TODAY, undefined, { ...base, expiringIntakes: expiring });
  ok(on.length === 1 && on[0].kind === 'expiring' && on[0].label === 'חלב — פג תוקף'
    && on[0].hint === 'פג ב-2026-08-20 · אצווה 4 יח׳', 'דוגמה 7ב (expiring): ' + JSON.stringify(on));
}
if (f) process.exit(1);
console.log('✓ needs-care-shop: 7 דוגמאות-חוזה — ירוק');
