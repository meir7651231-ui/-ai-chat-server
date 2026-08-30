import { resetPassword as __pure_resetPassword } from './reset-password.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_reset_password_T = {
  k1: "auth/user-not-found",
  k2: "לא נמצא משתמש עם האימייל הזה",
  k3: "auth/invalid-email",
  k4: "כתובת האימייל אינה תקינה",
};
const resetPassword = (...a) => __pure_resetPassword(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_reset_password_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const threw = async (p, expected, msg) => {
  try { await p; ok(false, msg + ' — לא נזרקה שגיאה'); }
  catch (e) { ok(e.message === expected, msg + ' — נזרק: ' + e.message); }
};
// שקעים-מיני כמתועד בחוזה
const AUTH = { tag: 'AUTH' };
const reqAuth = () => AUTH;
const rejWith = (code) => () => Promise.reject({ code });
const heb = (e) => new Error('עברית:' + (e?.code ?? '') + '|' + (e?.message ?? ''));

// 1) הצלחה — sendReset נקרא פעם-אחת עם (auth, email); נפתר undefined
{
  const calls = [];
  const sendReset = (a, em) => { calls.push([a, em]); return Promise.resolve(); };
  const r = await resetPassword('a@b.com', reqAuth, sendReset, heb);
  ok(r === undefined, 'דוגמה 1 — לא נפתר undefined');
  ok(calls.length === 1 && calls[0][0] === AUTH && calls[0][1] === 'a@b.com',
    'דוגמה 1 — sendReset: ' + JSON.stringify(calls.map(([a, em]) => [a.tag, em])));
}
// 2) user-not-found
await threw(resetPassword('x@y.com', reqAuth, rejWith('auth/user-not-found'), heb),
  'לא נמצא משתמש עם האימייל הזה', 'דוגמה 2');
// 3) invalid-email
await threw(resetPassword('לא-אימייל', reqAuth, rejWith('auth/invalid-email'), heb),
  'כתובת האימייל אינה תקינה', 'דוגמה 3');
// 4) קוד אחר ⇒ hebrewAuthError עם השגיאה המקורית
await threw(resetPassword('a@b.com', reqAuth, rejWith('auth/too-many-requests'), heb),
  'עברית:auth/too-many-requests|', 'דוגמה 4');
// 5) דחייה בלי code ⇒ code נגזר '' ⇒ hebrewAuthError, בלי נפילה
await threw(resetPassword('a@b.com', reqAuth, () => Promise.reject(new Error('boom')), heb),
  'עברית:|boom', 'דוגמה 5');
// 6) requireAuth זורק ⇒ נתפס וממופה; sendReset לא נקרא
{
  let sent = 0;
  const boomAuth = () => { throw new Error('הענן לא אותחל — פנו למנהל המערכת'); };
  await threw(resetPassword('a@b.com', boomAuth, () => { sent++; return Promise.resolve(); }, heb),
    'עברית:|הענן לא אותחל — פנו למנהל המערכת', 'דוגמה 6');
  ok(sent === 0, 'דוגמה 6 — sendReset נקרא למרות כשל-requireAuth');
}

if (f) process.exit(1);
console.log('✓ reset-password: 6 דוגמאות-חוזה — ירוק');
