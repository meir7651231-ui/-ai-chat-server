// בדיקת-חוזה (רתמת-זהב) · credHelpText — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/cred-help-text.test.mjs:
//   הצילום (SNAP.CRED_HELP_TEXT) הוא JSON.stringify של הערך ⇒ המבחן = שוויון-ביט
//   מלא של המחרוזת. כאן זה נאכף בשלוש שכבות בלתי-תלויות:
//   1) אורך === 173 code-units (מדד-ה-JS: s.length).
//   2) עוגני-code-unit לכל התווים-המיוחדים (U+200E ×4, U+2013 ×1, U+00B7 ×7) —
//      אימות-ביט ישיר של הסימנים-הבלתי-נראים, בלתי-תלוי בהעתקה.
//   3) שוויון-מלא למחרוזת-הצפי (איבר-איבר על code-units, חוק-8 — לא join).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/cred-help-text_test.dart  ⇒ exit 0
import 'cred-help-text.dart';

void main() {
  var n = 0;
  final s = credHelpText;

  // 1) אורך === 173 (מדד-ה-JS s.length).
  assert(s.length == 173, 'FAIL: אורך ${s.length} ≠ 173');
  n++;

  // 2) עוגני-code-unit לתווים-המיוחדים (מ-JS codePointAt).
  //    U+200E (LEFT-TO-RIGHT MARK) — בדיוק 4, באינדקסים 71/79/94/111.
  for (final i in const [71, 79, 94, 111]) {
    assert(s.codeUnitAt(i) == 0x200E,
        'FAIL: [$i] אינו U+200E (הוא 0x${s.codeUnitAt(i).toRadixString(16)})');
  }
  //    U+2013 (en-dash) — יחיד, באינדקס 145 (הטווח 0.8–1.2).
  assert(s.codeUnitAt(145) == 0x2013,
      'FAIL: [145] אינו U+2013 (הוא 0x${s.codeUnitAt(145).toRadixString(16)})');
  //    U+00B7 (middle-dot) — 7 מפרידים, באינדקסים 10/20/40/56/84/99/119.
  for (final i in const [10, 20, 40, 56, 84, 99, 119]) {
    assert(s.codeUnitAt(i) == 0x00B7,
        'FAIL: [$i] אינו U+00B7 (הוא 0x${s.codeUnitAt(i).toRadixString(16)})');
  }
  // ואין תווי-RTL עודפים: בדיוק 4 מופעי U+200E בכל המחרוזת.
  final lrm = s.codeUnits.where((c) => c == 0x200E).length;
  assert(lrm == 4, 'FAIL: $lrm מופעי U+200E ≠ 4');
  n++;

  // 3) שוויון-ביט מלא לצילום (אותה מחרוזת שבמקור-ה-JS).
  const want = 'נוכחות +5 · דיוק +2 · פעולה קהילתית +15 · ביטול מוקדם 0 · '
      'ביטול מאוחר (\u200E<48ש׳) \u200E-10 · No-Show \u200E-20 · אי-פעילות \u200E-2/יום · '
      'מוכפל ב-TrendFactor (0.8–1.2) לפי 3 הפעולות האחרונות';
  assert(s.length == want.length, 'FAIL: אורך שונה מהצפי');
  for (var i = 0; i < want.length; i++) {
    assert(s.codeUnitAt(i) == want.codeUnitAt(i),
        "FAIL: [$i] 0x${s.codeUnitAt(i).toRadixString(16)} ≠ 0x${want.codeUnitAt(i).toRadixString(16)}");
  }
  assert(s == want, 'FAIL: שוויון-מלא נכשל');
  n++;

  print('OK credHelpText: $n asserts passed');
}
