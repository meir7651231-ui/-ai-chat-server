// בדיקת-חוזה (רתמת-זהב) · smtpHostFor — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/smtp-host-for.test.mjs
// (הפלט = מחרוזת ⇒ השוואת-שוויון ישירה; אין מערכים ⇒ כלל-8 לא נדרש).
// תוספת-הקשחה (חוק-13): ‏U+0130 בדומיין לא הופך לספק-מוכר — כמו JS.
// הרצה: dart run --enable-asserts new/dart-maor/smtp-host-for_test.dart  ⇒ OK
import 'smtp-host-for.dart';

void _eq(Object? got, Object? want, String msg) {
  if (got != want) throw StateError('FAIL: $msg ⇒ $got (ציפינו: $want)');
}

void main() {
  var n = 0;

  // 1) ספק מוכר
  _eq(smtpHostFor('user@gmail.com'), 'smtp.gmail.com:465', 'gmail שגוי'); n++;

  // 2) הנמכה + גיזום על הדומיין
  _eq(smtpHostFor('Me@HOTMAIL.Com '), 'smtp-mail.outlook.com:587',
      'הנמכה/גיזום שגויים'); n++;

  // 3) ספק ישראלי
  _eq(smtpHostFor('vaad@walla.co.il'), 'out.walla.co.il:465', 'walla שגוי'); n++;

  // 4) ספק לא-מוכר ⇒ ''
  _eq(smtpHostFor('office@myorg.org.il'), '', 'לא-מוכר החזיר ערך'); n++;

  // 5) אין @ ⇒ ''
  _eq(smtpHostFor('nodomain'), '', 'בלי @ החזיר ערך'); n++;

  // 6) @ בעמדה 0 ⇒ ''
  _eq(smtpHostFor('@gmail.com'), '', '@ ראשון החזיר ערך'); n++;

  // הקשחת חוק-13: ב-JS ‏'GMAİL.COM'.toLowerCase() = 'gmai̇l.com' (i+U+0307) ⇒ לא-במפה ⇒ ''.
  // בלי קדם-המיפוי, Dart-VM היה בולע את הנקודה ומחזיר בטעות 'smtp.gmail.com:465'.
  _eq(smtpHostFor('me@GMAİL.COM'), '', 'İ (U+0130) הודלק כספק-מוכר'); n++;

  // ‏@ אחרון קובע (lastIndexOf) — כמו JS: 'a@b@gmail.com' ⇒ דומיין 'gmail.com'.
  _eq(smtpHostFor('a@b@gmail.com'), 'smtp.gmail.com:465', '@ אחרון לא נבחר'); n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(smtpHostFor('user@gmail.com') == 'smtp.gmail.com:465', 'assert-live guard');

  print('OK smtpHostFor: $n asserts passed');
}
