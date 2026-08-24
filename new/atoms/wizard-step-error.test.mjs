import { wizardStepError } from './wizard-step-error.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const base = {
  industry: '', size: '', needs: [], orgName: '', contactName: '',
  phone: '', email: '', password: '', password2: '',
};
const noCall = () => { throw new Error('signUpError לא אמור להיקרא בשלבים 0-3'); };

// 1) שלב 0 — תחום
chk('1 שלב 0',
  wizardStepError(0, base, noCall) === 'בחרו את תחום העסק כדי להמשיך' &&
  wizardStepError(0, { ...base, industry: 'studio' }, noCall) === null);

// 2) שלב 1 — גודל
chk('2 שלב 1',
  wizardStepError(1, base, noCall) === 'בחרו את גודל הארגון' &&
  wizardStepError(1, { ...base, size: 'small' }, noCall) === null);

// 3) שלב 2 — תמיד תקין
chk('3 שלב 2 אופציונלי', wizardStepError(2, base, noCall) === null);

// 4) שלב 3 — סדר-הבדיקה
chk('4 שלב 3 סדר-הבדיקה',
  wizardStepError(3, { ...base, orgName: '  ' }, noCall) === 'שם הארגון חובה' &&
  wizardStepError(3, { ...base, orgName: 'מאור' }, noCall) === 'שם איש קשר חובה' &&
  wizardStepError(3, { ...base, orgName: 'מאור', contactName: 'לוי' }, noCall) === 'טלפון חובה — נחזור אליכם לאישור' &&
  wizardStepError(3, { ...base, orgName: 'מאור', contactName: 'לוי', phone: '050-1234567' }, noCall) === null);

// 5) שלב 4 — האצלה לשקע: סדר-ארגומנטים מדויק + שגיאה כלשונה
const s4 = {
  ...base, orgName: 'מאור', contactName: 'לוי', phone: '050-1234567',
  email: 'a@b.co', password: '123456', password2: '654321',
};
const calls = [];
const err5 = wizardStepError(4, s4, (...a) => { calls.push(a); return 'הסיסמאות אינן זהות'; });
chk('5 שלב 4 האצלה',
  err5 === 'הסיסמאות אינן זהות' && calls.length === 1 &&
  eq(calls[0], ['מאור', 'לוי', '050-1234567', 'a@b.co', '123456', '654321']));

// 6) שלב 4 — '' מנורמל ל-null
chk('6 נרמול הצלחה ⇒ null', wizardStepError(4, s4, () => '') === null);

// 7) שלב לא-מוכר ⇒ null
chk('7 שלב 9 ⇒ null', wizardStepError(9, base, noCall) === null);

if (f) process.exit(1);
console.log('✓ wizard-step-error: 7 דוגמאות-חוזה (5 שלבים+האצלה+נרמול) — ירוק');
