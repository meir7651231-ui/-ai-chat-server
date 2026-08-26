// 🧪 הוכחת-חוצה-שפות · חשבון-המייל (smtp-url · Dart) — מריצה את smtp-url.dart על אותם
// קלטים/WANT כמו new/boxes/smtp-url.test.mjs (זיהוי+קדימות+הרכבה+מילון-שגיאות).
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה, פלט זהה-ביט.
import 'dart:convert';
import 'smtp-url.dart' as B;

int n = 0, fails = 0;
void ok(String name, bool c) {
  if (!c) { print('✗ $name'); fails++; } else { n++; }
}

void main() {
  // ── זיהוי-חי (דוגמאות-המקור smtpUrl.test.ts:11-20) ──
  ok('gmail', B.detectSmtpHost('receipts@gmail.com') == 'smtp.gmail.com:465');
  ok('אותיות-גדולות', B.detectSmtpHost('a@GMAIL.com') == 'smtp.gmail.com:465');
  ok('לא-מוכר צריך להחזיר ריק', B.detectSmtpHost('x@shem-haamuta.org') == '');
  ok('קלט-שבור', B.detectSmtpHost('בלי-שטרודל') == '' && B.detectSmtpHost('') == '');
  // JS: null && undefined ⇒ ''. ל-Dart אין undefined ⇒ null בלבד (String(v ?? '')).
  ok('null', B.detectSmtpHost(null) == '');
  ok('רשימת-הדומיינים',
      B.KNOWN_SMTP_DOMAINS.contains('gmail.com') && B.KNOWN_SMTP_DOMAINS.contains('walla.co.il'));

  // ── הרכבה מלאה — ספק-מוכר, 465 ⇒ smtps, 587 ⇒ smtp ──
  final g = B.buildSmtpAccount(email: 'a@gmail.com', password: 'p');
  ok('gmail-465',
      g['state'] == 'ok' &&
          g['url'] == 'smtps://a%40gmail.com:p@smtp.gmail.com:465' &&
          g['known'] == true);
  final o = B.buildSmtpAccount(email: 'a@outlook.com', password: 'p');
  ok('outlook-587',
      o['state'] == 'ok' && o['url'] == 'smtp://a%40outlook.com:p@smtp-mail.outlook.com:587');
  // סיסמת-אפליקציה עם תווים מיוחדים לא שוברת (המקור: encodeURIComponent)
  final sp = B.buildSmtpAccount(email: 'a@gmail.com', password: 'p@ss:w/rd');
  ok('קידוד-סיסמה', sp['state'] == 'ok' && (sp['url'] as String).contains('p%40ss%3Aw%2Frd'));
  // ספק-מוכר גובר על שדה-ידני (הכרעה 2)
  final pr = B.buildSmtpAccount(email: 'a@gmail.com', password: 'p', manualHost: 'evil.host:587');
  ok('קדימות-ספק-מוכר',
      pr['state'] == 'ok' && (pr['url'] as String).endsWith('@smtp.gmail.com:465'));
  // ספק לא-מוכר + שרת-ידני ⇒ עובד
  final mn = B.buildSmtpAccount(email: 'x@unknown.org', password: 'p', manualHost: 'mail.org.il:587');
  ok('שרת-ידני',
      mn['state'] == 'ok' &&
          mn['url'] == 'smtp://x%40unknown.org:p@mail.org.il:587' &&
          mn['known'] == false);
  // מבנה-הרשומה המלא (jsonEncode) — לוודא זהות-שדות מול ה-golden
  ok('מבנה-רשומת-ok',
      jsonEncode(mn) ==
          '{"state":"ok","url":"smtp://x%40unknown.org:p@mail.org.il:587","host":"mail.org.il:587","known":false}');

  // ── שער-הדילוג ומילון-השגיאות (הכרעות 1+3, נוסח-המקור) ──
  ok('שער-הדילוג', B.buildSmtpAccount(email: '', password: '')['state'] == 'empty');
  ok('קלט-חסר', B.buildSmtpAccount()['state'] == 'empty');
  final e1 = B.buildSmtpAccount(email: 'a@gmail.com', password: '');
  ok('הודעה-1',
      e1['state'] == 'error' && e1['message'] == 'מייל: מלאו גם כתובת וגם סיסמת-אפליקציה');
  final e2 = B.buildSmtpAccount(email: 'x@unknown.org', password: 'p');
  ok('הודעה-2',
      e2['state'] == 'error' &&
          e2['message'] == 'מייל: הספק לא מוכר — מלאו את שדה שרת-היציאה (host:port)');
  // מייל-בלי-@ עם שרת-ידני ⇒ הודעה-1 (ההכרעה לפי קיום-שרת)
  final e3 = B.buildSmtpAccount(email: 'בלי-שטרודל', password: 'p', manualHost: 'h:465');
  ok('בלי-שטרודל+שרת',
      e3['state'] == 'error' && e3['message'] == 'מייל: מלאו גם כתובת וגם סיסמת-אפליקציה');
  // שרת-רווח-בלבד = "יש-שרת" לבורר-ההודעה (לא-מקוצץ, כמו המקור)
  final e4 = B.buildSmtpAccount(email: 'x@unknown.org', password: 'p', manualHost: ' ');
  ok('שרת-רווח',
      e4['state'] == 'error' && e4['message'] == 'מייל: מלאו גם כתובת וגם סיסמת-אפליקציה');

  if (fails > 0) {
    print('❌ קופסת-חשבון-המייל (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('smtp-url dart proof failed');
  }
  print('✓ קופסת-חשבון-המייל (Dart): $n טענות — זיהוי+קדימות+הרכבה+מילון-שגיאות · פלט זהה-ביט ל-JS');
}
