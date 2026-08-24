import { signUp } from './sign-up.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const AUTH = { tag: 'auth' };
const noTranslate = () => new Error('לא אמור להיקרא');

const expectThrow = async (fn, wantMsg, label) => {
  let got = null;
  try { await fn(); } catch (e) { got = e; }
  ok(got instanceof Error && got.message === wantMsg, `${label} ⇒ ${got && got.message}`);
};

// 1) הצלחה — מוחזר uid, מייל-אימות נשלח פעם אחת עם אותו user
{
  const USER = { uid: 'u1' };
  const sent = [];
  const uid = await signUp('a@b.com', '123456',
    (a, e, p) => { ok(a === AUTH && e === 'a@b.com' && p === '123456', 'ארגומנטים לשקע-היצירה שגויים'); return Promise.resolve({ user: USER }); },
    () => AUTH,
    (u) => { sent.push(u); return Promise.resolve(); },
    noTranslate);
  ok(uid === 'u1', 'לא הוחזר ה-uid');
  ok(sent.length === 1 && sent[0] === USER, 'מייל-אימות לא נשלח פעם אחת עם אותו user');
}

// 2) כשל-מייל-אימות — best-effort: עדיין מוחזר uid, שום זריקה
{
  const uid = await signUp('a@b.com', '123456',
    () => Promise.resolve({ user: { uid: 'u1' } }), () => AUTH,
    () => Promise.reject(new Error('smtp down')), noTranslate);
  ok(uid === 'u1', 'כשל-מייל-אימות הפיל את ההרשמה');
  await new Promise((r) => setTimeout(r, 0)); // הדחייה הרכה נבלעת בלי unhandled-rejection
}

// 3+4) ארבעת הקודים הממופים
const mapped = [
  ['auth/email-already-in-use', 'האימייל כבר רשום — נסו להתחבר או לאפס סיסמה'],
  ['auth/weak-password', 'הסיסמה חלשה מדי — לפחות 6 תווים'],
  ['auth/invalid-email', 'כתובת האימייל אינה תקינה'],
  ['auth/operation-not-allowed', 'ההרשמה סגורה כרגע — פנו למנהל המערכת'],
];
for (const [code, msg] of mapped) {
  await expectThrow(
    () => signUp('a@b.com', '123456', () => Promise.reject({ code }), () => AUTH, () => Promise.resolve(), noTranslate),
    msg, `מיפוי ${code} שגוי`);
}

// 5) קוד לא-ממופה — נזרק בדיוק ה-Error של hebrewAuthError, הדחייה עברה כמות-שהיא
{
  const rejected = { code: 'auth/whatever' };
  const heb = new Error('הכניסה נכשלה — נסו שוב');
  let got = null, passed = null;
  try {
    await signUp('a@b.com', '123456', () => Promise.reject(rejected), () => AUTH,
      () => Promise.resolve(), (e) => { passed = e; return heb; });
  } catch (e) { got = e; }
  ok(got === heb, 'קוד לא-ממופה לא עבר דרך hebrewAuthError');
  ok(passed === rejected, 'אובייקט-הדחייה לא הועבר כמות-שהוא');
}

// 6) ענן לא אותחל — requireAuth זורק ⇒ דרך התרגום; שקע-היצירה לא נקרא
{
  const heb = new Error('הענן לא אותחל — פנו למנהל המערכת');
  let got = null, created = false;
  try {
    await signUp('a@b.com', '123456',
      () => { created = true; return Promise.resolve({ user: { uid: 'x' } }); },
      () => { throw new Error('הענן לא אותחל'); },
      () => Promise.resolve(), () => heb);
  } catch (e) { got = e; }
  ok(got === heb && !created, 'זריקת-requireAuth לא טופלה נכון');
}

if (f) process.exit(1);
console.log('✓ sign-up: 6 דוגמאות-חוזה — ירוק');
