import { changePassword } from './change-password.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const threw = async (p, expected, msg) => {
  try { await p; ok(false, msg + ' — לא נזרקה שגיאה'); }
  catch (e) { ok(e.message === expected, msg + ' — נזרק: ' + e.message); }
};
// שקעים-מיני כמתועד בחוזה
const U = { email: 'a@b.com' };
const rejWith = (code) => () => Promise.reject({ code });
const okAsync = () => Promise.resolve();
const heb = (e) => new Error('עברית:' + (e?.code ?? ''));

// 1) אין משתמש — reauth/update לא נקראו
{
  let called = 0;
  const spy = () => { called++; return Promise.resolve(); };
  await threw(changePassword('a', 'b', () => null, spy, spy, heb), 'אין משתמש מחובר — התחברו ונסו שוב', 'דוגמה 1');
  ok(called === 0, 'דוגמה 1 — reauth/update נקראו למרות שאין משתמש');
}
// 2) משתמש בלי email
await threw(changePassword('a', 'b', () => ({ email: '' }), okAsync, okAsync, heb), 'אין משתמש מחובר — התחברו ונסו שוב', 'דוגמה 2');
// 3) שלושת קודי סיסמה-נוכחית-שגויה — update לא נקרא
for (const code of ['auth/wrong-password', 'auth/invalid-credential', 'auth/invalid-login-credentials']) {
  let upd = 0;
  await threw(changePassword('old', 'new', () => U, rejWith(code), () => { upd++; return Promise.resolve(); }, heb), 'הסיסמה הנוכחית שגויה', 'דוגמה 3 (' + code + ')');
  ok(upd === 0, 'דוגמה 3 — update נקרא אחרי כשל-reauth');
}
// 4) קוד-reauth אחר ⇒ hebrewAuthError קיבל את השגיאה המקורית
await threw(changePassword('old', 'new', () => U, rejWith('auth/too-many-requests'), okAsync, heb), 'עברית:auth/too-many-requests', 'דוגמה 4');
// 5) update ⇒ weak-password
await threw(changePassword('old', 'new', () => U, okAsync, rejWith('auth/weak-password'), heb), 'הסיסמה החדשה חלשה מדי — לפחות 6 תווים', 'דוגמה 5');
// 6) קוד-update אחר ⇒ hebrewAuthError
await threw(changePassword('old', 'new', () => U, okAsync, rejWith('auth/network-request-failed'), heb), 'עברית:auth/network-request-failed', 'דוגמה 6');
// 7) הצלחה — סדר-קריאות וארגומנטים
{
  const calls = [];
  const reauth = (u, p) => { calls.push(['reauth', u, p]); return Promise.resolve(); };
  const update = (u, p) => { calls.push(['update', u, p]); return Promise.resolve(); };
  const r = await changePassword('old1', 'new123', () => U, reauth, update, heb);
  ok(r === undefined, 'דוגמה 7 — ההבטחה לא נפתרה ל-undefined');
  ok(calls.length === 2 && calls[0][0] === 'reauth' && calls[0][1] === U && calls[0][2] === 'old1'
    && calls[1][0] === 'update' && calls[1][1] === U && calls[1][2] === 'new123', 'דוגמה 7 — סדר/ארגומנטים שגויים: ' + JSON.stringify(calls.map((c) => [c[0], c[2]])));
}
if (f) process.exit(1);
console.log('✓ change-password — כל דוגמאות-החוזה ירוקות');
