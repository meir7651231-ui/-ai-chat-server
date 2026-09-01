// בדיקת-חוזה · smtp-host-for — 6 דוגמאות-החוזה מ-smtp-host-for.test.mjs +
// ratchet להסגר: ‏NEL ‏U+0085 אחרי הדומיין ⇒ '' (‏JS לא-גוזם NEL).
import 'smtp-host-for.dart';

int _f = 0;
void eq(dynamic a, dynamic b, String msg) {
  if (a != b) {
    print('FAIL $msg => ${a is String ? '"$a"' : a}');
    _f = 1;
  }
}

void main() {
  // 1) ספק מוכר
  eq(smtpHostFor('user@gmail.com'), 'smtp.gmail.com:465', 'gmail שגוי');
  // 2) הנמכה + גיזום על הדומיין
  eq(smtpHostFor('Me@HOTMAIL.Com '), 'smtp-mail.outlook.com:587', 'הנמכה/גיזום שגויים');
  // 3) ספק ישראלי
  eq(smtpHostFor('vaad@walla.co.il'), 'out.walla.co.il:465', 'walla שגוי');
  // 4) ספק לא-מוכר ⇒ ''
  eq(smtpHostFor('office@myorg.org.il'), '', 'לא-מוכר החזיר ערך');
  // 5) אין @ ⇒ ''
  eq(smtpHostFor('nodomain'), '', 'בלי @ החזיר ערך');
  // 6) @ בעמדה 0 ⇒ ''
  eq(smtpHostFor('@gmail.com'), '', '@ ראשון החזיר ערך');

  final nel = String.fromCharCode(0x0085); // NEL — Dart-trim גוזם, JS לא
  final mvs = String.fromCharCode(0x180E); // Mongolian vowel sep — כנ"ל
  final nbsp = String.fromCharCode(0x00A0); // NBSP — נגזם בשתי-השפות
  // 7) ratchet-הסגר · NEL אחרי הדומיין: JS לא-גוזם ⇒ 'gmail.com' לא-במפה ⇒ ''
  eq(smtpHostFor('user@gmail.com$nel'), '', 'NEL נגזם בטעות (חוק-16)');
  // 8) U+180E — גם-הוא נגזם ב-Dart אך לא ב-JS ⇒ ''
  eq(smtpHostFor('user@gmail.com$mvs'), '', 'U+180E נגזם בטעות');
  // 9) רווח-ES אמיתי (NBSP U+00A0) כן-נגזם בשתי-השפות ⇒ ספק-מוכר
  eq(smtpHostFor('user@gmail.com$nbsp'), 'smtp.gmail.com:465', 'NBSP לא-נגזם');

  if (_f != 0) {
    throw StateError('smtp-host-for: יש כשלים');
  }
  print('OK smtp-host-for: 9 בדיקות (6 חוזה + 3 הסגר) — ירוק');
}
