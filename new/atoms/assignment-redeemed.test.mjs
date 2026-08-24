import { assignmentRedeemed } from './assignment-redeemed.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקעים מזויפים כמתועד בחוזה
const liveRedemptions = (a) => a.redemptions.filter((r) => !r.voidedAt);
const hebYearOf = (iso) => Number(iso.slice(0, 4)); // זיוף דטרמיניסטי — האטום עיוור לחשבון-הלוח
const S = liveRedemptions, Y = hebYearOf;
// 1) בלי חג — מימוש-חי של הרכיב
const a1 = { redemptions: [{ componentId: 'c1' }] };
ok(assignmentRedeemed(a1, 'c1', undefined, S, Y) === true, 'בלי-חג: מימוש-קיים ⇒ אמור true');
ok(assignmentRedeemed(a1, 'c2', undefined, S, Y) === false, 'בלי-חג: רכיב-אחר ⇒ אמור false');
// 2) מימוש מבוטל מוחרג
const a2 = { redemptions: [{ componentId: 'c1', voidedAt: '2026-01-01' }] };
ok(assignmentRedeemed(a2, 'c1', undefined, S, Y) === false, 'מבוטל לא הוחרג');
// 3) מתנת-חג — אותו שם, אותה שנה
const h = { iso: '2026-04-02', name: 'פסח' };
const a3 = { redemptions: [{ componentId: 'c1', holiday: 'פסח', date: '2026-04-20' }] };
ok(assignmentRedeemed(a3, 'c1', h, S, Y) === true, 'חג: אותה-שנה ⇒ אמור true');
// 4) שנה אחרת — לא מכסה
const a4 = { redemptions: [{ componentId: 'c1', holiday: 'פסח', date: '2025-04-10' }] };
ok(assignmentRedeemed(a4, 'c1', h, S, Y) === false, 'חג-אשתקד כיסה בטעות');
// 5) בלי תאריך — לא נספר
const a5 = { redemptions: [{ componentId: 'c1', holiday: 'פסח', date: '' }] };
ok(assignmentRedeemed(a5, 'c1', h, S, Y) === false, 'מימוש בלי-תאריך נספר בטעות');
// 6) שם-חג שונה
const a6 = { redemptions: [{ componentId: 'c1', holiday: 'סוכות', date: '2026-10-01' }] };
ok(assignmentRedeemed(a6, 'c1', h, S, Y) === false, 'שם-חג-שונה נספר בטעות');
if (f) process.exit(1);
console.log('✓ assignment-redeemed: 6 דוגמאות-חוזה — ירוק');
