// בדיקת-חוזה (רתמת-זהב) · hebMonthsOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/heb-months-of.test.mjs
// (אותם קלטים→פלטים). השקעים מקומיים לבדיקה:
//   isHebLeapYear = (y)=> (7*y+1) % 19 < 7   (מחזור-המטונים, זהה לתשובת Intl)
//   monthHeOf = חיפוש בטבלת [en,he] ⇒ he; לא-מוכר ⇒ '' (כמו ?.[1] ?? '' ב-JS)
//   5786 (פשוטה) → 12 תוויות תשרי→אלול עם 'אדר'
//   5784 (מעוברת) → 13, אינדקסים 5,6 = 'אדר א׳','אדר ב׳', בלי 'אדר'; שאר הסדר זהה
//   5787 (מעוברת) → אורך 13 · 5785 (פשוטה) → אורך 12 עם 'אדר'
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/heb-months-of_test.dart  ⇒ exit 0
import 'heb-months-of.dart';

// שקע isHebLeapYear — מקביל ל-(y)=> (7*y+1) % 19 < 7.
bool _isHebLeapYear(int y) => (7 * y + 1) % 19 < 7;

// שקע monthHeOf — מקביל ל-MONTHS.find(m=>m[0]===en)?.[1] ?? ''.
const List<List<String>> _months = [
  ['Tishri', 'תשרי'], ['Heshvan', 'חשוון'], ['Kislev', 'כסלו'], ['Tevet', 'טבת'],
  ['Shevat', 'שבט'], ['Adar', 'אדר'], ['Adar I', 'אדר א׳'], ['Adar II', 'אדר ב׳'],
  ['Nisan', 'ניסן'], ['Iyar', 'אייר'], ['Sivan', 'סיוון'], ['Tamuz', 'תמוז'],
  ['Av', 'אב'], ['Elul', 'אלול'],
];
String _monthHeOf(String en) {
  for (final m in _months) {
    if (m[0] == en) return m[1];
  }
  return '';
}

void _eqList(List<String> got, List<String> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: length ${got.length} != ${want.length}\n got=$got');
  }
  for (var i = 0; i < got.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('FAIL [$label] @$i:\n got =[${got[i]}]\n want=[${want[i]}]');
    }
  }
}

void main() {
  var n = 0;

  // 5786 פשוטה → 12 תוויות.
  final common = hebMonthsOf(5786, _isHebLeapYear, _monthHeOf);
  _eqList(common, const [
    'תשרי', 'חשוון', 'כסלו', 'טבת', 'שבט', 'אדר',
    'ניסן', 'אייר', 'סיוון', 'תמוז', 'אב', 'אלול',
  ], '5786 פשוטה');
  n++;

  // 5784 מעוברת → 13, אדר א׳/ב׳ באינדקסים 5,6, בלי 'אדר' יחיד.
  final leap = hebMonthsOf(5784, _isHebLeapYear, _monthHeOf);
  if (leap.length != 13 || leap[5] != 'אדר א׳' || leap[6] != 'אדר ב׳' || leap.contains('אדר')) {
    throw StateError('FAIL [5784 מעוברת]: $leap');
  }
  n++;

  // 5784 סדר-שאר-החודשים.
  if (leap[4] != 'שבט' || leap[7] != 'ניסן' || leap[12] != 'אלול') {
    throw StateError('FAIL [5784 סדר-שאר-החודשים]: $leap');
  }
  n++;

  // 5787 מעוברת → אורך 13.
  if (hebMonthsOf(5787, _isHebLeapYear, _monthHeOf).length != 13) {
    throw StateError('FAIL [5787 אורך]');
  }
  n++;

  // 5785 פשוטה → אורך 12 עם 'אדר'.
  final y5785 = hebMonthsOf(5785, _isHebLeapYear, _monthHeOf);
  if (y5785.length != 12 || y5785[5] != 'אדר') {
    throw StateError('FAIL [5785 פשוטה]: $y5785');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    hebMonthsOf(5784, _isHebLeapYear, _monthHeOf).length == 13,
    'assert-live guard',
  );

  print('OK hebMonthsOf: $n asserts passed');
}
