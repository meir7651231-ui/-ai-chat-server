// ⚛️ אטום-Dart (דרגת-חוזה) · smtpHostFor — שרת-היציאה (host:port) לפי דומיין כתובת-המייל.
// מוצא: maor/src/lib/smtpUrl.ts:21-26 · המקור: new/atoms/smtp-host-for.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart-core). חוק-4 — התנהגות זהה-ביט למקור-ה-JS.
//
// תפקיד: ספק-מייל מוכר ⇒ 'host:port' (‏465=TLS מלא · 587=STARTTLS); ספק לא-מוכר /
//        כתובת שבורה ⇒ '' (נדרש שרת ידני). הדומיין = אחרי ה-@ האחרון, נגזם ומונמך;
//        ‏@ בעמדה 0 או היעדר @ ⇒ ''.
// נתון-פנימי: SMTP_HOSTS הוטבע כקבוע-פרטי — נתון של האטום, לא קריאת-שכן (חוק-1;
//        קיים גם כאטום-קבוע smtp-hosts).
//
// הערות-המרה (מקור→Dart):
// · ‏slice(at+1) של JS ⇒ substring(at+1) — בטוח כאן: at>=1 מובטח ⇒ at+1<=length (חוק-5 לא נדרש).
// · ‏SMTP_HOSTS[domain] ?? '' — Map של Dart מחזיר null למפתח-חסר ⇒ ‏?? '' זהה-ביט.
// · חוק-13 (toLowerCase): ‏JS ממפה ‏U+0130 ‏(İ) ל-'i'+U+0307 (2 יחידות); ‏Dart-VM בולע את
//   הנקודה ⇒ 'i' — מה שהיה הופך 'GMAİL.COM' בטעות ל-'gmail.com' ומדליק ספק-מוכר.
//   ⇒ קדם-מיפוי ‏U+0130→'i̇' לפני ה-toLowerCase של Dart. שאר חריגי-SpecialCasing
//   (‏Σ-סופית וכו') מניבים ממילא תווים לא-ASCII ⇒ לא-במפה ⇒ '' בשתי השפות.

/// ספקים מוכרים — דומיין-המייל ⇒ שרת-היציאה שלו. לא מוכר ⇒ שדה-שרת ידני.
const Map<String, String> _smtpHosts = {
  'gmail.com': 'smtp.gmail.com:465',
  'googlemail.com': 'smtp.gmail.com:465',
  'outlook.com': 'smtp-mail.outlook.com:587',
  'hotmail.com': 'smtp-mail.outlook.com:587',
  'yahoo.com': 'smtp.mail.yahoo.com:465',
  'walla.co.il': 'out.walla.co.il:465',
};

/// הנמכה נאמנת-JS (חוק-13): ‏U+0130 ⇒ 'i'+U+0307 כמו מיפוי-full של JS, ואז toLowerCase.
String _jsToLowerCase(String s) =>
    s.replaceAll('İ', 'i̇').toLowerCase();

/// שרת-היציאה 'host:port' של ספק-מייל מוכר לפי דומיין הכתובת; לא-מוכר/שבורה ⇒ ''.
/// Verbatim behaviour of the JS source `smtpHostFor`.
dynamic smtpHostFor(dynamic email) {
  final int at = email.lastIndexOf('@');
  if (at < 1) return '';
  final String domain = _jsToLowerCase(email.substring(at + 1).trim());
  return _smtpHosts[domain] ?? '';
}
