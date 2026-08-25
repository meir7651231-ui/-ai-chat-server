// בדיקת-חוזה (רתמת-זהב) · receiptFmtOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/receipt-fmt-of.test.mjs:
//   1) עדות-שאילתה: featureOn נקרא פעם-אחת עם (config עצמו, 'core.receipt.pdf')
//   2) דלוק + 'pdf' ⇒ 'pdf'
//   3) דלוק + 'txt' ⇒ 'txt'
//   4) דלוק + {} (אין בחירה) ⇒ null (≡undefined)
//   5) כבוי + 'pdf' ⇒ null (מתג-חירום) והבחירה השמורה לא נמחקה
// המרה: undefined של JS ⇒ null ב-Dart; זהות-אובייקט === ⇒ identical. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/receipt-fmt-of_test.dart  ⇒ exit 0
import 'receipt-fmt-of.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) עדות-שאילתה: config עצמו + המפתח המדויק, פעם אחת.
  final config = {'features': {}};
  final calls = <List>[];
  receiptFmtOf(config, {'receiptFmt': 'pdf'}, (c, k) {
    calls.add([c, k]);
    return true;
  });
  _ok(
    calls.length == 1 &&
        identical(calls[0][0], config) &&
        calls[0][1] == 'core.receipt.pdf',
    "featureOn(config,'core.receipt.pdf') פעם אחת",
  );
  n++;

  // 2) דגל דלוק + בחירת pdf ⇒ 'pdf'.
  _ok(receiptFmtOf(config, {'receiptFmt': 'pdf'}, (c, k) => true) == 'pdf',
      "דלוק+'pdf' ⇒ 'pdf'");
  n++;

  // 3) דגל דלוק + בחירת txt ⇒ 'txt'.
  _ok(receiptFmtOf(config, {'receiptFmt': 'txt'}, (c, k) => true) == 'txt',
      "דלוק+'txt' ⇒ 'txt'");
  n++;

  // 4) דגל דלוק + אין בחירה ⇒ null (≡undefined).
  _ok(receiptFmtOf(config, {}, (c, k) => true) == null, 'דלוק+{} ⇒ null');
  n++;

  // 5) מתג-חירום: דגל כבוי ⇒ null גם כשנבחר pdf, והבחירה השמורה שורדת.
  final ui5 = {'receiptFmt': 'pdf'};
  _ok(receiptFmtOf(config, ui5, (c, k) => false) == null,
      "כבוי+'pdf' ⇒ null (מתג-חירום)");
  n++;
  _ok(ui5['receiptFmt'] == 'pdf', 'הבחירה השמורה לא נמחקה');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(receiptFmtOf(config, {'receiptFmt': 'pdf'}, (c, k) => true) == 'pdf',
      'assert-live receiptFmtOf');

  print('OK receiptFmtOf: $n asserts passed');
}
