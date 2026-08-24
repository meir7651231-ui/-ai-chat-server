import { liveRedemptions } from './live-redemptions.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) מבוטל מושמט, הסדר נשמר
const r1 = { id: 'r1' }, r2 = { id: 'r2', voidedAt: '2026-08-01' }, r3 = { id: 'r3' };
const got1 = liveRedemptions({ redemptions: [r1, r2, r3] });
ok(got1.length === 2 && got1[0].id === 'r1' && got1[1].id === 'r3', 'דוגמה 1 נשברה');
// 2) ריק ⇒ ריק
ok(liveRedemptions({ redemptions: [] }).length === 0, 'דוגמה 2 נשברה');
// 3) כולם מבוטלים ⇒ ריק
ok(liveRedemptions({ redemptions: [{ voidedAt: 'x' }, { voidedAt: 'y' }] }).length === 0, 'דוגמה 3 נשברה');
// 4) אף מבוטל ⇒ אותן רפרנסות
const got4 = liveRedemptions({ redemptions: [r1, r3] });
ok(got4.length === 2 && got4[0] === r1 && got4[1] === r3, 'דוגמה 4 נשברה — לא אותן רפרנסות');
// 5) voidedAt ריק (falsy) ⇒ חי
ok(liveRedemptions({ redemptions: [{ id: 'r5', voidedAt: '' }] }).length === 1, 'דוגמה 5 נשברה');
if (f) process.exit(1);
console.log('✓ live-redemptions: 5 דוגמאות-חוזה — ירוק');
