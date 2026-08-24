import { signOutCloud } from './sign-out-cloud.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

const AUTH = { tag: 'auth' };

// 1) הצלחה — נפתר ל-undefined, השקע נקרא פעם אחת עם ה-auth
{
  const calls = [];
  const res = await signOutCloud((a) => { calls.push(a); return Promise.resolve(); }, () => AUTH);
  ok(res === undefined, 'הצלחה לא נפתרה ל-undefined');
  ok(calls.length === 1 && calls[0] === AUTH, 'שקע-הניתוק לא נקרא פעם אחת עם ה-auth');
}

// 2) כשל-רשת — הדחייה נבלעת, נפתר בכל-זאת
{
  let threw = false, res;
  try {
    res = await signOutCloud(() => Promise.reject(new Error('network')), () => AUTH);
  } catch { threw = true; }
  ok(!threw && res === undefined, 'כשל-רשת לא נבלע (כשל-רך נשבר)');
}

// 3) ענן לא אותחל — זריקת requireAuth נבלעת גם היא
{
  let threw = false, res;
  try {
    res = await signOutCloud(() => Promise.resolve(), () => { throw new Error('הענן לא אותחל'); });
  } catch { threw = true; }
  ok(!threw && res === undefined, 'זריקת-requireAuth לא נבלעה');
}

if (f) process.exit(1);
console.log('✓ sign-out-cloud: 3 דוגמאות-חוזה — ירוק');
