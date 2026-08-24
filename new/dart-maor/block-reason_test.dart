// בדיקת-חוזה (רתמת-זהב) · blockReason — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/block-reason.test.mjs:
//   אותם 7 קלטים→פלטים. השקע hebParts מוזרק עם אותם ערכים ש-Intl-hebrew הפיק
//   בבדיקת-ה-JS; holidays זהה למפת-הבדיקה. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/block-reason_test.dart  ⇒ exit 0
import 'block-reason.dart';

// שקע hebParts — טבלת-ערכים שמשקפת את פלט Intl-hebrew לתאריכי-הבדיקה (מפתח ISO).
// (לשבת/שישי המקור מחזיר לפני קריאת-השקע — הערכים כאן לשלמות בלבד.)
final _heb = <String, ({int day, String month, int year})>{
  '2026-09-21': (day: 10, month: 'Tishri', year: 5787),
  '2026-09-28': (day: 17, month: 'Tishri', year: 5787),
  '2022-08-07': (day: 10, month: 'Av', year: 5782),
  '2026-03-03': (day: 14, month: 'Adar', year: 5786),
  '2026-08-29': (day: 16, month: 'Elul', year: 5786),
  '2026-08-28': (day: 15, month: 'Elul', year: 5786),
};

({int day, String month, int year}) hebParts(DateTime d) {
  final key =
      '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
  final hp = _heb[key];
  if (hp == null) throw StateError('hebParts: no fixture for $key');
  return hp;
}

// שקע holidays — זהה למפת-הבדיקה של maor (block-reason.test.mjs).
const holidays = <String, String>{
  'Tishri 1': 'ראש השנה',
  'Tishri 10': 'יום כיפור',
  'Tishri 15': 'סוכות',
  'Nisan 15': 'פסח',
  'Av 9': 'תשעה באב',
  'Adar 14': 'פורים',
};

// at(iso) — צהריים מקומי, מקביל ל-new Date(iso+'T12:00:00') של הבדיקה.
DateTime at(int y, int m, int d) => DateTime(y, m, d, 12);

void _eq(String? got, String? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=${_s(got)} want=${_s(want)}');
  }
}

String _s(String? v) => v == null ? 'null' : '"$v"';

void main() {
  var n = 0;

  // — 7 דוגמאות-החוזה verbatim (block-reason.test.mjs) —
  _eq(blockReason(at(2026, 8, 29), hebParts, holidays), 'שבת', '1 שבת'); n++;
  _eq(blockReason(at(2026, 8, 28), hebParts, holidays),
      'יום שישי (שעתיים לפני שבת)', '2 שישי'); n++;
  _eq(blockReason(at(2026, 9, 21), hebParts, holidays), 'יום כיפור',
      '3 יום כיפור'); n++;
  _eq(blockReason(at(2026, 9, 28), hebParts, holidays), 'חול המועד',
      '4 חול המועד'); n++;
  _eq(blockReason(at(2022, 8, 7), hebParts, holidays), 'תשעה באב (נדחה)',
      '5 תשעה באב נדחה'); n++;
  _eq(blockReason(at(2026, 3, 3), hebParts, holidays), null,
      '6 פורים ⇒ null'); n++;
  _eq(blockReason(at(2026, 8, 29), hebParts, holidays, false), null,
      '7 הדגל כבוי ⇒ null'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(blockReason(at(2026, 8, 29), hebParts, holidays) == 'שבת',
      'assert-live guard');

  print('OK blockReason: $n asserts passed (כולל תשעה-באב-נדחה 7.8.2022)');
}
