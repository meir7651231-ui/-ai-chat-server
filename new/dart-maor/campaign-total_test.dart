// בדיקת-חוזה (רתמת-זהב) · campaignTotal — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/campaign-total.test.mjs:
//   1) סכום חוצה-קופות: c1 ⇒ 130
//   2) קמפיין שני:      c2 ⇒ 50
//   3) לא-סופי מדולג:   [NaN, 20] על c1 ⇒ 20
//   4) בלי קופות:       [] ⇒ 0
//   5) קמפיין לא-קיים:  'zzz' ⇒ 0
// המרה: === של JS על מספרים ⇒ == ב-Dart · NaN של JS ⇒ double.nan.
// הרצה: dart run --enable-asserts new/dart-maor/campaign-total_test.dart  ⇒ exit 0
import 'campaign-total.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  final boxes = [
    {
      'collections': [
        {'campaignId': 'c1', 'amount': 100},
        {'campaignId': 'c2', 'amount': 50},
      ],
    },
    {
      'collections': [
        {'campaignId': 'c1', 'amount': 30},
      ],
    },
  ];

  // 1) סכום חוצה-קופות
  _ok(campaignTotal(boxes, 'c1') == 130, 'c1 ≠ 130'); n++;
  // 2) קמפיין שני
  _ok(campaignTotal(boxes, 'c2') == 50, 'c2 ≠ 50'); n++;
  // 3) לא-סופי מדולג
  _ok(
    campaignTotal([
      {
        'collections': [
          {'campaignId': 'c1', 'amount': double.nan},
          {'campaignId': 'c1', 'amount': 20},
        ],
      },
    ], 'c1') == 20,
    'NaN לא דולג',
  ); n++;
  // 4) בלי קופות
  _ok(campaignTotal([], 'c1') == 0, 'ריק ≠ 0'); n++;
  // 5) קמפיין לא-קיים
  _ok(campaignTotal(boxes, 'zzz') == 0, 'לא-קיים ≠ 0'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(campaignTotal(boxes, 'c1') == 130, 'assert-live guard');

  print('OK campaignTotal: $n asserts passed');
}
