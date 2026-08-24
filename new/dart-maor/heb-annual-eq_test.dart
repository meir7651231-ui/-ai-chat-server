// בדיקת-חוזה (רתמת-זהב) · hebAnnualEq — מייבאת אך ורק את האטום-שלה (חוק-4).
// 9 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/heb-annual-eq.test.mjs
// (אותם קלטים→פלטים). השקע scanHebYear כאן = stub דטרמיניסטי עם רצפי-החודשים
// האמיתיים של תשפ"ד/ה/ו (5784/5785/5786) — חולצו מ-Intl-en-u-ca-hebrew של הבדיקה
// המקורית, כך שהתנהגות-השקע זהה. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/heb-annual-eq_test.dart  ⇒ exit 0
import 'heb-annual-eq.dart';

// — רצפי-החודשים האמיתיים (מ-scanHebYear של הבדיקה המקורית על Intl) —
final Map<int, ({List<String> seq, Set<String> has30})> _tbl = {
  5784: (
    seq: [
      'Tishri', 'Heshvan', 'Kislev', 'Tevet', 'Shevat',
      'Adar I', 'Adar II', 'Nisan', 'Iyar', 'Sivan', 'Tamuz', 'Av', 'Elul'
    ],
    has30: {'Tishri', 'Shevat', 'Adar I', 'Nisan', 'Sivan', 'Av'},
  ),
  5785: (
    seq: [
      'Tishri', 'Heshvan', 'Kislev', 'Tevet', 'Shevat',
      'Adar', 'Nisan', 'Iyar', 'Sivan', 'Tamuz', 'Av', 'Elul'
    ],
    has30: {'Tishri', 'Heshvan', 'Kislev', 'Shevat', 'Nisan', 'Sivan', 'Av'},
  ),
  5786: (
    seq: [
      'Tishri', 'Heshvan', 'Kislev', 'Tevet', 'Shevat',
      'Adar', 'Nisan', 'Iyar', 'Sivan', 'Tamuz', 'Av', 'Elul'
    ],
    has30: {'Tishri', 'Kislev', 'Shevat', 'Nisan', 'Sivan', 'Av'},
  ),
};

({List<String> seq, Set<String> has30}) scanHebYear(int hebYear) {
  final hit = _tbl[hebYear];
  if (hit == null) {
    throw StateError('scanHebYear stub: no data for year $hebYear');
  }
  return hit;
}

void _eq(bool got, bool want, String why) {
  if (got != want) {
    throw StateError('FAIL [$why]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — 9 דוגמאות-החוזה verbatim מ-heb-annual-eq.test.mjs —
  _eq(hebAnnualEq((day: 15, month: 'Elul'), (day: 15, month: 'Elul', year: null), scanHebYear),
      true, 'התאמה ישירה');
  n++;
  _eq(hebAnnualEq((day: 15, month: 'Elul'), (day: 14, month: 'Elul', year: null), scanHebYear),
      false, 'יום שונה');
  n++;
  _eq(hebAnnualEq((day: 14, month: 'Adar'), (day: 14, month: 'Adar II', year: 5784), scanHebYear),
      true, 'אדר-רגיל⇒אדר-ב׳ במעוברת');
  n++;
  _eq(hebAnnualEq((day: 14, month: 'Adar I'), (day: 14, month: 'Adar II', year: 5784), scanHebYear),
      false, 'אדר-א׳ לא נופל על אדר-ב׳');
  n++;
  _eq(hebAnnualEq((day: 14, month: 'Adar I'), (day: 14, month: 'Adar', year: 5786), scanHebYear),
      true, 'שנה פשוטה בולעת כל עוגן-אדר');
  n++;
  _eq(hebAnnualEq((day: 14, month: 'Adar'), (day: 14, month: 'Nisan', year: null), scanHebYear),
      false, 'אחד אדר, השני לא');
  n++;
  _eq(hebAnnualEq((day: 30, month: 'Heshvan'), (day: 1, month: 'Kislev', year: 5786), scanHebYear),
      true, 'כלל ל׳: אין ל׳ חשוון בתשפ"ו');
  n++;
  _eq(hebAnnualEq((day: 30, month: 'Heshvan'), (day: 1, month: 'Kislev', year: 5785), scanHebYear),
      false, 'יש ל׳ חשוון בתשפ"ה — אין נפילה');
  n++;
  _eq(hebAnnualEq((day: 30, month: 'Adar I'), (day: 1, month: 'Nisan', year: 5786), scanHebYear),
      true, 'באג-האזכרה: 30 אדר-א׳ ⇒ א׳ ניסן בפשוטה');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      hebAnnualEq((day: 15, month: 'Elul'), (day: 15, month: 'Elul', year: null), scanHebYear),
      'assert-live guard');

  print('OK hebAnnualEq: $n asserts passed (Dart≡JS)');
}
