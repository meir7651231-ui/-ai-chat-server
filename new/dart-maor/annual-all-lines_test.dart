// בדיקת-חוזה (רתמת-זהב) · annualAllLines — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/annual-all-lines.test.mjs
// (אותם קלטים→פלטים; השקעים: donationsOfYear=סינון-שנה לפי date · sectionMock=['['+name+']']):
//   1) 3 תורמים (א/2026, ב/2025, ג/2026) ⇒ ['[א]', '', '\f', '', '[ג]'] (ב דולג, מפריד יחיד)
//   2) payerId שהועבר למקטע הראשון = idNum ('111')
//   3) תורם יחיד ⇒ ['[א]'] בלי מפריד
//   4) אפס-מתאימים (year='2024') ⇒ ['אין תורמים עם תרומות בשנת 2024.']
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/annual-all-lines_test.dart  ⇒ exit 0
import 'annual-all-lines.dart';

// שקע-הבדיקה donationsOfYear — מקביל ל-(donations, year) => donations.filter(d =>
// (d.date || '').startsWith(year + '-')) במקור-ה-JS (`d.date || ''` = ?? '' כאן).
List<dynamic> _donationsOfYear(dynamic donations, String year) => (donations as List)
    .where((d) => (((d as Map)['date'] as String?) ?? '').startsWith(year + '-'))
    .toList();

// שקע-הבדיקה sectionMock — צובר payerId ומחזיר ['[' + supporterName + ']'].
final List<dynamic> _seenPayerIds = [];
List<String> _sectionMock(Map<String, dynamic> inp) {
  _seenPayerIds.add(inp['payerId']);
  return ['[' + (inp['supporterName'] as String) + ']'];
}

// סריאליזציה קנונית — כל איבר עטוף ב-<> (מבחין '' מ-'\f') ומחובר ב-'|'.
String _ser(List<String> xs) => xs.map((s) => '<$s>').join('|');

void _eq(List<String> got, List<String> want, String label) {
  final g = _ser(got);
  final w = _ser(want);
  if (g != w) {
    throw StateError('FAIL [$label]:\n got =[$g]\n want=[$w]');
  }
}

void main() {
  var n = 0;

  final supporters = <Map<String, dynamic>>[
    {'name': 'א', 'idNum': '111', 'donations': [{'date': '2026-01-01', 'amount': 50}]},
    {'name': 'ב', 'donations': [{'date': '2025-01-01', 'amount': 70}]},
    {'name': 'ג', 'donations': [{'date': '2026-05-05', 'amount': 30}]},
  ];

  // 1) שני מקטעים + מפריד-עמוד יחיד (ב עם תרומת-2025 בלבד דולג).
  final L = annualAllLines(
      'מאור', '580123456', '2026', supporters, null, _donationsOfYear, _sectionMock);
  _eq(L, ['[א]', '', '\f', '', '[ג]'], 'שני מקטעים + מפריד-עמוד');
  n++;

  // 2) payerId למקטע הראשון = idNum.
  if (_seenPayerIds[0] != '111') {
    throw StateError('FAIL [payerId=idNum]: got=${_seenPayerIds[0]} want=111');
  }
  n++;

  // 3) תורם יחיד ⇒ בלי מפריד.
  final one = annualAllLines(
      'מאור', null, '2026', [supporters[0]], null, _donationsOfYear, _sectionMock);
  _eq(one, ['[א]'], 'תורם יחיד בלי מפריד');
  n++;

  // 4) אפס-מתאימים (2024) ⇒ שורת-הריק העברית.
  final none = annualAllLines(
      'מאור', null, '2024', supporters, null, _donationsOfYear, _sectionMock);
  _eq(none, ['אין תורמים עם תרומות בשנת 2024.'], 'אפס-מתאימים');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_ser(L) == '<[א]>|<>|<\f>|<>|<[ג]>', 'assert-live guard');

  print('OK annualAllLines: $n asserts passed');
}
