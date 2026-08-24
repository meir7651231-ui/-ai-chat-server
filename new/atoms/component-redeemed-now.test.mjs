import { componentRedeemedNow } from './component-redeemed-now.mjs';
const db = {};
const a = { id: 'as1' };
const comp = { id: 'c1' };
let f = 0;
const chk = (n, ok, got) => { if (!ok) { console.error(`✗ דוגמה ${n}: ${JSON.stringify(got)}`); f = 1; } };
// שקעים מזויפים עם רישום-קריאות
const mk = (kind, allowed) => {
  const calls = { itemOf: 0, redeemed: [] };
  return {
    calls,
    itemOf: (d, c) => { calls.itemOf++; return { kind, allowed }; },
    holidayAllowed: (item, name) => (item.allowed ?? []).includes(name),
    redeemed: (ret) => (as, cid, holiday) => { calls.redeemed.push([cid, holiday]); return ret; },
  };
};
const pesach = { iso: '2026-04-02', name: 'פסח' };
const sukkot = { iso: '2026-09-26', name: 'סוכות' };
// 1 — בלי holidays: נתיב היסטורי, itemOf לא נקרא
let s = mk('holidayGift', ['פסח']);
let r = componentRedeemedNow(db, a, comp, undefined, s.itemOf, s.holidayAllowed, s.redeemed(true));
chk(1, r === true && s.calls.itemOf === 0 && JSON.stringify(s.calls.redeemed) === JSON.stringify([['c1', undefined]]), s.calls);
// 2 — קופון: נתיב היסטורי גם עם holidays
s = mk('coupon', []);
r = componentRedeemedNow(db, a, comp, [pesach], s.itemOf, s.holidayAllowed, s.redeemed(false));
chk(2, r === false && JSON.stringify(s.calls.redeemed) === JSON.stringify([['c1', undefined]]), s.calls);
// 3 — מתנת-חג עם חג מותר: נבחן מול מופע-החג
s = mk('holidayGift', ['פסח']);
r = componentRedeemedNow(db, a, comp, [pesach], s.itemOf, s.holidayAllowed, s.redeemed(true));
chk(3, r === true && JSON.stringify(s.calls.redeemed) === JSON.stringify([['c1', pesach]]), s.calls);
// 4 — מתנת-חג בלי חג מותר: נתיב היסטורי
s = mk('holidayGift', []);
r = componentRedeemedNow(db, a, comp, [pesach, sukkot], s.itemOf, s.holidayAllowed, s.redeemed(false));
chk(4, r === false && JSON.stringify(s.calls.redeemed) === JSON.stringify([['c1', undefined]]), s.calls);
// 5 — הראשון המותר ברשימה (סוכות לא-מותר, פסח מותר) ⇒ פסח
s = mk('holidayGift', ['פסח']);
r = componentRedeemedNow(db, a, comp, [sukkot, pesach], s.itemOf, s.holidayAllowed, s.redeemed(true));
chk(5, r === true && JSON.stringify(s.calls.redeemed) === JSON.stringify([['c1', pesach]]), s.calls);
// 6 — הכרעת-המימוש בשקע: false לחג ⇒ false
s = mk('holidayGift', ['פסח']);
r = componentRedeemedNow(db, a, comp, [pesach], s.itemOf, s.holidayAllowed, s.redeemed(false));
chk(6, r === false, r);
if (f) process.exit(1);
console.log('✓ component-redeemed-now: 6 דוגמאות-חוזה — ירוק');
