import '../dart-data-maor/phone-issue-sockets.dart' as sk_phone_issue;
// בדיקת-חוזה (רתמת-זהב) · phoneIssue — מייבאת אך ורק את האטום-שלה (חוק-4).
// תשע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/phone-issue.test.mjs:
//   '050-1234567' ⇒ null · '03-1234567' ⇒ null · '' ⇒ null · undefined(=null) ⇒ null ·
//   '-' ⇒ null · '31234567' ⇒ 'כנראה חסרה ספרת 0 מובילה: 31234567' ·
//   '123' ⇒ 'קצר מדי: 123' · '5012345678' ⇒ 'לא מתחיל ב-0: 5012345678' ·
//   '0501234' ⇒ 'אורך חריג (7 ספרות): 0501234'.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/phone-issue_test.dart  ⇒ exit 0
import 'phone-issue.dart';

void main() {
  var n = 0;
  void eq(String? inp, String? want) {
    final got = phoneIssue(inp, sk_phone_issue.phoneIssue_T);
    assert(got == want, 'FAIL: ${inp == null ? "null" : "\"$inp\""} ⇒ צפוי ${want == null ? "null" : "\"$want\""}, בפועל ${got == null ? "null" : "\"$got\""}');
    n++;
  }

  eq('050-1234567', null);
  eq('03-1234567', null);
  eq('', null);
  eq(null, null); // undefined-של-JS ⇒ null-של-Dart
  eq('-', null);
  eq('31234567', 'כנראה חסרה ספרת 0 מובילה: 31234567');
  eq('123', 'קצר מדי: 123');
  eq('5012345678', 'לא מתחיל ב-0: 5012345678');
  eq('0501234', 'אורך חריג (7 ספרות): 0501234');

  print('OK phoneIssue: $n asserts passed');
}
