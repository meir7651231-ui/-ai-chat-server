// בדיקת-חוזה (רתמת-זהב) · productAssignments — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/product-assignments.test.mjs:
//   a1={id:'a1',productId:'p1'} · a2={id:'a2',productId:'p2'} · a3={id:'a3',productId:'p1'} · all=[a1,a2,a3]
//   1) productAssignments(all,'p1') ⇒ [a1,a3]  (סדר-מקור, אותן רפרנסים)
//   2) productAssignments(all,'p2') ⇒ [a2]
//   3) productAssignments(all,'p9') ⇒ []        (אין התאמות)
//   4) productAssignments([],'p1')  ⇒ []        (מערך ריק)
//   5) productAssignments([{id:'x',productId:1}],'1') ⇒ []  (התאמה קפדנית === : מחרוזת≠מספר)
// המרה: === של JS ⇒ == ב-Dart (String↔int ⇒ false בשתי השפות). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/product-assignments_test.dart  ⇒ exit 0
import 'product-assignments.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// השוואת-רשימות מבוססת-זהות: אורך זהה + כל איבר אותה רפרנס בסדר (מחקה JSON.stringify
// על מבנה-הזהה של filter, ומחזק שהאיברים לא שוכפלו). לא join — כלל-8 (גבול-איבר/זהות).
void _sameRefs(List<Map<String, dynamic>> got, List<Map<String, dynamic>> want,
    String label) {
  _ok(got.length == want.length, '$label: אורך ${got.length} ≠ ${want.length}');
  for (var i = 0; i < want.length; i++) {
    _ok(identical(got[i], want[i]), '$label: איבר $i אינו אותה רפרנס');
  }
}

void main() {
  var n = 0;

  final a1 = {'id': 'a1', 'productId': 'p1'};
  final a2 = {'id': 'a2', 'productId': 'p2'};
  final a3 = {'id': 'a3', 'productId': 'p1'};
  final all = [a1, a2, a3];

  // 1) p1 — סדר-מקור, שני האיברים אותן רפרנסים.
  _sameRefs(productAssignments(all, 'p1'), [a1, a3], "p1 — סדר-מקור"); n++;

  // 2) p2 — התאמה יחידה.
  _sameRefs(productAssignments(all, 'p2'), [a2], 'p2'); n++;

  // 3) p9 — אין התאמות ⇒ רשימה ריקה.
  _ok(productAssignments(all, 'p9').isEmpty, 'p9 — אין התאמות'); n++;

  // 4) מערך ריק ⇒ רשימה ריקה.
  _ok(productAssignments(<Map<String, dynamic>>[], 'p1').isEmpty, 'מערך ריק'); n++;

  // 5) התאמה קפדנית === : productId:1 (int) מול '1' (String) ⇒ אין התאמה.
  final numRow = {'id': 'x', 'productId': 1};
  _ok(productAssignments([numRow], '1').isEmpty,
      'התאמה קפדנית === (מחרוזת≠מספר)'); n++;

  // חיזוק: הרשימה המוחזרת חדשה (filter של JS מחזיר מערך חדש) — לא אותה רפרנס לקלט.
  _ok(!identical(productAssignments(all, 'p1'), all), 'הרשימה המוחזרת אינה הקלט'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(productAssignments(all, 'p1').length == 2, 'assert-live guard');

  print('OK productAssignments: $n asserts passed');
}
