import { signIn } from './sign-in.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

const AUTH = { tag: 'auth' };

// 1) הצלחה — resolve ל-undefined, השקע נקרא פעם אחת עם (auth, email, password)
{
  const calls = [];
  const res = await signIn('a@b.com', 'secret1',
    (...a) => { calls.push(a); return Promise.resolve({ user: {} }); },
    () => AUTH,
    (e) => new Error('לא אמור להיקרא'));
  ok(res === undefined, 'הצלחה לא נפתרה ל-undefined');
  ok(calls.length === 1, 'שקע-הכניסה לא נקרא בדיוק פעם אחת');
  ok(calls[0][0] === AUTH && calls[0][1] === 'a@b.com' && calls[0][2] === 'secret1',
    'סדר-הארגומנטים לשקע-הכניסה שגוי');
}

// 2) כשל-כניסה — נזרק בדיוק ה-Error שהתרגום החזיר, עם אובייקט-הדחייה המקורי
{
  const rejected = { code: 'auth/wrong-password' };
  const heb = new Error('אימייל או סיסמה שגויים');
  let got = null, passed = null;
  try {
    await signIn('a@b.com', 'bad', () => Promise.reject(rejected), () => AUTH,
      (e) => { passed = e; return heb; });
  } catch (e) { got = e; }
  ok(got === heb, 'לא נזרק ה-Error של hebrewAuthError');
  ok(passed === rejected, 'אובייקט-הדחייה לא הועבר כמות-שהוא לתרגום');
}

// 3) ענן לא אותחל — requireAuth זורק ⇒ עובר דרך התרגום; שקע-הכניסה לא נקרא
{
  const heb = new Error('הענן לא אותחל — פנו למנהל המערכת');
  let got = null, signInCalled = false;
  try {
    await signIn('a@b.com', 'x',
      () => { signInCalled = true; return Promise.resolve(); },
      () => { throw new Error('הענן לא אותחל'); },
      () => heb);
  } catch (e) { got = e; }
  ok(got === heb, 'זריקת-requireAuth לא עברה דרך התרגום');
  ok(!signInCalled, 'שקע-הכניסה נקרא למרות שהענן לא אותחל');
}

// 4) אין בליעה — מסלול-כשל תמיד מסתיים בזריקה (לא resolve שקט)
{
  let threw = false;
  try {
    await signIn('a@b.com', 'x', () => Promise.reject(new Error('כשל')), () => AUTH,
      () => new Error('הכניסה נכשלה — נסו שוב'));
  } catch { threw = true; }
  ok(threw, 'כשל נבלע בשקט במקום להיזרק');
}

if (f) process.exit(1);
console.log('✓ sign-in: 4 דוגמאות-חוזה — ירוק');
