// בדיקת-חוזה (רתמת-זהב) · donationsOfYear — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/donations-of-year.test.mjs
// (אותם קלטים→פלטים; משווים את רשימת-התאריכים של הפלט):
//   BASE = [{date:'2026-07-07',amount:100},{date:'2024-03-01'},{date:'2026-01-05'}]
//   1) (BASE,'2026')                                  ⇒ ['2026-01-05','2026-07-07']
//   2) (BASE,'2024')                                  ⇒ ['2024-03-01']
//   3) (BASE,'2025')                                  ⇒ []
//   4) ([{date:''},{},{date:'2026'}],'2026')          ⇒ []   (falsy/חסר/בלי מקף)
//   5) ([{date:'2026-12-31'},{date:'2026-12-01'}],'2026') ⇒ ['2026-12-01','2026-12-31']
// + שימור-שדות: donationsOfYear(BASE,'2026')[1]['amount'] == 100.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/donations-of-year_test.dart  ⇒ exit 0
import 'donations-of-year.dart';

List<String> _dates(List<Map<String, dynamic>> arr) =>
    [for (final d in arr) d['date'] as String];

void _eq(List<String> got, List<String> want, String label) {
  final g = got.join('|');
  final w = want.join('|');
  if (g != w) {
    throw StateError('FAIL [$label]:\n got =[$g]\n want=[$w]');
  }
}

void main() {
  var n = 0;

  final base = <Map<String, dynamic>>[
    {'date': '2026-07-07', 'amount': 100},
    {'date': '2024-03-01'},
    {'date': '2026-01-05'},
  ];

  // 1) שנת 2026 — שתי תרומות ממוינות עולה.
  _eq(_dates(donationsOfYear(base, '2026')),
      ['2026-01-05', '2026-07-07'], "(BASE,'2026')");
  n++;

  // 2) שנת 2024 — אחת.
  _eq(_dates(donationsOfYear(base, '2024')), ['2024-03-01'], "(BASE,'2024')");
  n++;

  // 3) שנה בלי תרומות ⇒ [].
  _eq(_dates(donationsOfYear(base, '2025')), [], "(BASE,'2025')");
  n++;

  // 4) date-ריק / מפתח-חסר / '2026' בלי מקף ⇒ אף אחד לא עובר את startsWith('2026-').
  _eq(
    _dates(donationsOfYear(<Map<String, dynamic>>[
      {'date': ''},
      <String, dynamic>{},
      {'date': '2026'},
    ], '2026')),
    [],
    'falsy/חסר/בלי-מקף',
  );
  n++;

  // 5) מיון עולה בתוך אותו חודש.
  _eq(
    _dates(donationsOfYear(<Map<String, dynamic>>[
      {'date': '2026-12-31'},
      {'date': '2026-12-01'},
    ], '2026')),
    ['2026-12-01', '2026-12-31'],
    'מיון-עולה',
  );
  n++;

  // שימור-שדות: הרשומה עוברת כמו-שהיא (amount נשמר).
  if (donationsOfYear(base, '2026')[1]['amount'] != 100) {
    throw StateError('FAIL: שדות-התרומה לא נשמרו');
  }
  n++;

  // הקלט לא-משתנה (המקור מחזיר מערך-חדש).
  if (base.length != 3) throw StateError('FAIL: הקלט שונה');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    _dates(donationsOfYear(base, '2026')).join('|') == '2026-01-05|2026-07-07',
    'assert-live guard',
  );

  print('OK donationsOfYear: $n asserts passed');
}
