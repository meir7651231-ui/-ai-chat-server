import { appendCall } from './append-call.mjs';
const CAP = 3; // שקע-הבדיקה (בקופסה: האטום call-log-cap = 200)
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(appendCall(undefined, 'skip', '2026-08-24', CAP) === undefined, 'skip על undefined ⇒ undefined');
const one = appendCall(undefined, 'answered', '2026-08-24', CAP);
ok(JSON.stringify(one) === '[{"at":"2026-08-24","outcome":"answered"}]', 'רישום ראשון: ' + JSON.stringify(one));
const a = { at: '2026-08-20', outcome: 'noanswer' };
const two = appendCall([a], 'donated', '2026-08-21', CAP);
ok(two.length === 2 && two[1].outcome === 'donated', 'הוספה לסוף');
const full = [a, { at: '2026-08-21', outcome: 'answered' }, { at: '2026-08-22', outcome: 'callback' }];
const ring = appendCall(full, 'noanswer', '2026-08-23', CAP);
ok(ring.length === 3, 'טבעת: אורך נשאר ' + CAP);
ok(ring[0].at === '2026-08-21' && ring[2].outcome === 'noanswer', 'הוותיקה נשמטה, האחרונה נשמרה');
const same = appendCall(full, 'skip', '2026-08-23', CAP);
ok(same === full, 'skip ⇒ אותה הפניה');
ok(full.length === 3 && full[0] === a, 'המקור לא השתנה (אימוטביליות)');
if (f) process.exit(1);
console.log('✓ append-call: 7 דוגמאות-חוזה — ירוק');
