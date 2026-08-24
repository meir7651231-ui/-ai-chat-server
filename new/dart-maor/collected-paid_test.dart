// בדיקת-חוזה (רתמת-זהב) · collectedPaid — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/collected-paid.test.mjs:
//   שקע מזויף כמתועד בחוזה —
//     liveRedemptions = (a) => a.redemptions.filter((r) => !r.voidedAt)  (מחריג מבוטלים)
//   1) שני שיוכים חיים ⇒ 35
//   2) מבוטל מוחרג ⇒ 10
//   3) לא-מספרי (undefined/NaN) נספר 0 ⇒ 7
//   4) אין שיוכים ⇒ 0
//   5) הכול מבוטל ⇒ 0
//   6) paid=0 חוקי ⇒ 12
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/collected-paid_test.dart  ⇒ exit 0
import 'collected-paid.dart';

// שקע-הבדיקה — מקביל ביט-אחר-ביט למקור-ה-JS: (a) => a.redemptions.filter(r => !r.voidedAt).
// !r.voidedAt : falsy = null/missing/'' ⇒ נשמר; מחרוזת-לא-ריקה ⇒ מוחרג.
List<Map<String, dynamic>> _live(Map<String, dynamic> a) =>
    (a['redemptions'] as List)
        .cast<Map<String, dynamic>>()
        .where((r) => r['voidedAt'] == null || r['voidedAt'] == '')
        .toList();

void _eq(num got, num want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // 1) שני שיוכים חיים ⇒ 35.
  final a1 = [
    {
      'redemptions': [
        {'paid': 10},
        {'paid': 20},
      ],
    },
    {
      'redemptions': [
        {'paid': 5},
      ],
    },
  ];
  _eq(collectedPaid(a1, _live), 35, 'שני שיוכים חיים');
  n++;

  // 2) מבוטל מוחרג ⇒ 10.
  final a2 = [
    {
      'redemptions': [
        {'paid': 10},
        {'paid': 50, 'voidedAt': '2026-08-01'},
      ],
    },
  ];
  _eq(collectedPaid(a2, _live), 10, 'מבוטל מוחרג');
  n++;

  // 3) לא-מספרי נספר 0 ⇒ 7. undefined→null (מפתח-חסר) · NaN→double.nan.
  final a3 = [
    {
      'redemptions': [
        {'paid': null},
        {'paid': double.nan},
        {'paid': 7},
      ],
    },
  ];
  _eq(collectedPaid(a3, _live), 7, 'לא-מספרי נספר 0');
  n++;

  // 4) אין שיוכים ⇒ 0.
  final a4 = <Map<String, dynamic>>[];
  _eq(collectedPaid(a4, _live), 0, 'אין שיוכים');
  n++;

  // 5) הכול מבוטל ⇒ 0.
  final a5 = [
    {
      'redemptions': [
        {'paid': 9, 'voidedAt': 'x'},
      ],
    },
  ];
  _eq(collectedPaid(a5, _live), 0, 'הכול מבוטל');
  n++;

  // 6) paid=0 חוקי ⇒ 12.
  final a6 = [
    {
      'redemptions': [
        {'paid': 0},
        {'paid': 12},
      ],
    },
  ];
  _eq(collectedPaid(a6, _live), 12, 'paid=0 חוקי');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(collectedPaid(a1, _live) == 35, 'assert-live guard');

  print('OK collectedPaid: $n asserts passed');
}
