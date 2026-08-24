import { phoneIssue } from './phone-issue.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (inp, want) => {
  const got = phoneIssue(inp);
  ok(got === want, JSON.stringify(inp) + ' ⇒ ' + JSON.stringify(want) + ', בפועל ' + JSON.stringify(got));
};
eq('050-1234567', null);
eq('03-1234567', null);
eq('', null);
eq(undefined, null);
eq('-', null);
eq('31234567', 'כנראה חסרה ספרת 0 מובילה: 31234567');
eq('123', 'קצר מדי: 123');
eq('5012345678', 'לא מתחיל ב-0: 5012345678');
eq('0501234', 'אורך חריג (7 ספרות): 0501234');
if (f) process.exit(1);
console.log('✓ phone-issue: 9 דוגמאות-חוזה — ירוק');
