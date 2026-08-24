// בדיקת-חוזה (רתמת-זהב) · coordinatorBoxes — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/coordinator-boxes.test.mjs:
//   B = [{b1,c1},{b2,c2},{b3,c1}]
//   1) (B,'c1') ⇒ [b1,b3]  (שתי קופות בסדר-המקור)
//   2) (B,'c2') ⇒ [b2]      (קופה אחת)
//   3) (B,'cX') ⇒ []        (רכז לא-מוכר)
//   4) ([],'c1') ⇒ []       (מערך ריק)
//   + הקלט B נשאר באורך 3 (האטום לא נגע במערך-המקור).
// המרה: === של JS ⇒ == ב-Dart; filter ⇒ where().toList(). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/coordinator-boxes_test.dart  ⇒ exit 0
import 'coordinator-boxes.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  final B = <Map<String, dynamic>>[
    {'id': 'b1', 'coordinatorId': 'c1'},
    {'id': 'b2', 'coordinatorId': 'c2'},
    {'id': 'b3', 'coordinatorId': 'c1'},
  ];

  // 1) שתי קופות בסדר-המקור.
  final r1 = coordinatorBoxes(B, 'c1');
  _ok(r1.length == 2 && r1[0]['id'] == 'b1' && r1[1]['id'] == 'b3',
      "1: (B,c1) ≠ [b1,b3]"); n++;

  // 2) קופה אחת.
  final r2 = coordinatorBoxes(B, 'c2');
  _ok(r2.length == 1 && r2[0]['id'] == 'b2', '2: (B,c2) ≠ [b2]'); n++;

  // 3) רכז לא-מוכר.
  _ok(coordinatorBoxes(B, 'cX').isEmpty, '3: רכז לא-מוכר ≠ []'); n++;

  // 4) מערך ריק.
  _ok(coordinatorBoxes(<Map<String, dynamic>>[], 'c1').isEmpty,
      '4: ([],c1) ≠ []'); n++;

  // הקלט לא שונה — האטום לא נגע במערך-המקור (filter טהור).
  _ok(B.length == 3, 'הקלט שונה — האטום נגע במערך-המקור'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(coordinatorBoxes(B, 'c1').length == 2, 'assert-live guard');

  print('OK coordinatorBoxes: $n asserts passed');
}
