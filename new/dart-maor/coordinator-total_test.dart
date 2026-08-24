// בדיקת-חוזה (רתמת-זהב) · coordinatorTotal — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/coordinator-total.test.mjs.
// השקעים החוזיים משוכפלים כלשונם מ-ה-JS:
//   coordinatorBoxes = (boxes, coordId) => boxes.filter(b => b.coordinatorId === coordId)
//   boxTotal         = box => box.collections.reduce((a,c)=> a + (Number.isFinite(c.amount)?c.amount:0), 0)
// קופות: b1(c1)=[100,50] · b2(c2)=[30] · b3(c1)=[] · b4(c1)=[200]
//   1) (B,'c1') ⇒ 150+0+200 = 350
//   2) (B,'c2') ⇒ 30
//   3) (B,'cX') ⇒ 0   (רכז לא-מוכר — reduce על ריק)
//   4) ([],'c1') ⇒ 0
// אם עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts new/dart-maor/coordinator-total_test.dart ⇒ exit 0
import 'coordinator-total.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// שקע 1: סינון קופות-הרכז לפי מזהה (מדמה את שכן-המקור coordinatorBoxes).
Iterable _coordinatorBoxes(dynamic boxes, Object? coordId) =>
    (boxes as List).where((b) => (b as Map)['coordinatorId'] == coordId);

// Number.isFinite של JS: false לכל לא-מספר/NaN/∞ (בלי המרה).
bool _isFiniteNumber(Object? v) => v is int || (v is double && v.isFinite);

// שקע 2: סך-הריקונים של קופה בודדת (מדמה את שכן-המקור boxTotal).
num _boxTotal(dynamic box) {
  num a = 0;
  for (final c in (box as Map)['collections'] as List) {
    final amount = (c as Map)['amount'];
    a += _isFiniteNumber(amount) ? (amount as num) : 0;
  }
  return a;
}

void main() {
  var n = 0;

  final B = [
    {'id': 'b1', 'coordinatorId': 'c1', 'collections': [{'amount': 100}, {'amount': 50}]},
    {'id': 'b2', 'coordinatorId': 'c2', 'collections': [{'amount': 30}]},
    {'id': 'b3', 'coordinatorId': 'c1', 'collections': []},
    {'id': 'b4', 'coordinatorId': 'c1', 'collections': [{'amount': 200}]},
  ];

  // 1) שלוש קופות ⇒ 350
  final t1 = coordinatorTotal(B, 'c1', _coordinatorBoxes, _boxTotal);
  _ok(t1 == 350, '1: (B,c1) ≠ 350 (קיבלנו $t1)'); n++;

  // 2) קופה אחת ⇒ 30
  _ok(coordinatorTotal(B, 'c2', _coordinatorBoxes, _boxTotal) == 30, '2: (B,c2) ≠ 30'); n++;

  // 3) רכז לא-מוכר ⇒ 0
  _ok(coordinatorTotal(B, 'cX', _coordinatorBoxes, _boxTotal) == 0, '3: רכז לא-מוכר ≠ 0'); n++;

  // 4) מערך ריק ⇒ 0
  _ok(coordinatorTotal([], 'c1', _coordinatorBoxes, _boxTotal) == 0, '4: ([],c1) ≠ 0'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(coordinatorTotal(B, 'c1', _coordinatorBoxes, _boxTotal) == 350, 'assert-live guard');

  print('OK coordinatorTotal: $n asserts passed');
}
