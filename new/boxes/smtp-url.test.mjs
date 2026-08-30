/** בדיקת-קצה: חשבון-המייל המלא — זיהוי-ספק ⇒ קדימות ⇒ הרכבה/שגיאה.
 *  DoD (נכתב לפני הקוד): node new/boxes/smtp-url.test.mjs ⇒ exit 0. */
import { KNOWN_SMTP_DOMAINS, detectSmtpHost, buildSmtpAccount } from './smtp-url.mjs';
const SMTP_URL_TERMS = {
  k1: "מייל: מלאו גם כתובת וגם סיסמת-אפליקציה",
  k2: "מייל: הספק לא מוכר — מלאו את שדה שרת-היציאה (host:port)",
};   // צילום-מקומי (מנוע-הטיהור v6 — מגני-המקור עודכנו לצורה החדשה)
let f = 0;
const err = (m) => { console.error('✗ ' + m); f = 1; };

// זיהוי-חי (דוגמאות-המקור smtpUrl.test.ts:11-20)
if (detectSmtpHost('receipts@gmail.com') !== 'smtp.gmail.com:465') err('gmail');
if (detectSmtpHost('a@GMAIL.com') !== 'smtp.gmail.com:465') err('אותיות-גדולות');
if (detectSmtpHost('x@shem-haamuta.org') !== '') err('לא-מוכר צריך להחזיר ריק');
if (detectSmtpHost('בלי-שטרודל') !== '' || detectSmtpHost('') !== '') err('קלט-שבור');
if (detectSmtpHost(null) !== '' || detectSmtpHost(undefined) !== '') err('null/undefined');
if (!KNOWN_SMTP_DOMAINS.includes('gmail.com') || !KNOWN_SMTP_DOMAINS.includes('walla.co.il')) err('רשימת-הדומיינים');

// הרכבה מלאה — ספק-מוכר, 465 ⇒ smtps, 587 ⇒ smtp
const g = buildSmtpAccount({ email: 'a@gmail.com', password: 'p' });
if (g.state !== 'ok' || g.url !== 'smtps://a%40gmail.com:p@smtp.gmail.com:465' || !g.known) err('gmail-465');
const o = buildSmtpAccount({ email: 'a@outlook.com', password: 'p' });
if (o.state !== 'ok' || o.url !== 'smtp://a%40outlook.com:p@smtp-mail.outlook.com:587') err('outlook-587');
// סיסמת-אפליקציה עם תווים מיוחדים לא שוברת (המקור: encodeURIComponent)
const sp = buildSmtpAccount({ email: 'a@gmail.com', password: 'p@ss:w/rd' });
if (sp.state !== 'ok' || !sp.url.includes('p%40ss%3Aw%2Frd')) err('קידוד-סיסמה');
// ספק-מוכר גובר על שדה-ידני (הכרעה 2)
const pr = buildSmtpAccount({ email: 'a@gmail.com', password: 'p', manualHost: 'evil.host:587' });
if (pr.state !== 'ok' || !pr.url.endsWith('@smtp.gmail.com:465')) err('קדימות-ספק-מוכר');
// ספק לא-מוכר + שרת-ידני ⇒ עובד
const mn = buildSmtpAccount({ email: 'x@unknown.org', password: 'p', manualHost: 'mail.org.il:587' });
if (mn.state !== 'ok' || mn.url !== 'smtp://x%40unknown.org:p@mail.org.il:587' || mn.known) err('שרת-ידני');

// שער-הדילוג ומילון-השגיאות (הכרעות 1+3, נוסח-המקור)
if (buildSmtpAccount({ email: '', password: '' }).state !== 'empty') err('שער-הדילוג');
if (buildSmtpAccount({}).state !== 'empty' || buildSmtpAccount().state !== 'empty') err('קלט-חסר');
const e1 = buildSmtpAccount({ email: 'a@gmail.com', password: '' });
if (e1.state !== 'error' || e1.message !== SMTP_URL_TERMS.k1) err('הודעה-1');
const e2 = buildSmtpAccount({ email: 'x@unknown.org', password: 'p' });
if (e2.state !== 'error' || e2.message !== SMTP_URL_TERMS.k2) err('הודעה-2');
// מייל-בלי-@ עם שרת-ידני ⇒ הודעה-1 (הקוד קדוש — ההכרעה לפי קיום-שרת, L4)
const e3 = buildSmtpAccount({ email: 'בלי-שטרודל', password: 'p', manualHost: 'h:465' });
if (e3.state !== 'error' || e3.message !== SMTP_URL_TERMS.k1) err('בלי-שטרודל+שרת');
// שרת-רווח-בלבד = "יש-שרת" לבורר-ההודעה (לא-מקוצץ, כמו המקור שורה 65)
const e4 = buildSmtpAccount({ email: 'x@unknown.org', password: 'p', manualHost: ' ' });
if (e4.state !== 'error' || e4.message !== SMTP_URL_TERMS.k1) err('שרת-רווח');

/* 🛡 מגן-הכרעה: ההכרעות חתומות verbatim במקור-הקופסה (דפוס theme.test). */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./smtp-url.mjs', import.meta.url), 'utf8');
if (!src.includes("SMTP_URL_TERMS.k1")) err('מגן: נוסח הודעה-1 שונה');
if (!src.includes("SMTP_URL_TERMS.k2")) err('מגן: נוסח הודעה-2 שונה');
if (!src.includes('composeSmtpUrl(em, pw, knownHost || mh)')) err('מגן: תפר-הקדימות (ספק-מוכר גובר) שונה');
if (!src.includes("if (!em.trim() && !pw.trim()) return { state: SMTP_STATE.empty }")) err('מגן: שער-הדילוג שונה');
if (!src.includes('knownHost || mh ? MSG_MISSING_FIELDS : MSG_UNKNOWN_PROVIDER')) err('מגן: בורר-ההודעות שונה');
if (src.indexOf('smtpHostFor(em)') > src.indexOf('composeSmtpUrl(em')) err('מגן: זיהוי-הספק חייב לקדום להרכבה');

if (f) process.exit(1);
console.log('✓ קופסת-חשבון-המייל: זיהוי+קדימות+הרכבה+מילון-שגיאות — כל דוגמאות-החוזה ירוקות');
