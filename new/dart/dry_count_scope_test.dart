// בדיקת-חוזה · dryCountScope — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/dry_count_scope_test.dart
import 'dry_count_scope.dart';

String _reject(int n) => 'REJECT:$n'; // שקע-בדיקה

// שקע-בדיקה: expandScope שמחזיר k מזהים מחוללים ('id0'..).
List<String> Function(String) _expandN(int k) =>
    (token) => List<String>.generate(k, (i) => 'id$i');

void main() {
  var n = 0;

  ({List<String> ids, int total, String? rejectedReasonHe}) run(int k) =>
      dryCountScope('t', expandScope: _expandN(k), batchRejectHe: _reject);

  // 1 — קטן ⇒ בסדר, ids מלא
  var r = run(3);
  if (r.total != 3 || r.ids.length != 3 || r.rejectedReasonHe != null) {
    throw StateError('FAIL [1]: $r');
  }
  n++;

  // 2 — ריק ⇒ 0, בסדר
  r = run(0);
  if (r.total != 0 || r.ids.isNotEmpty || r.rejectedReasonHe != null) {
    throw StateError('FAIL [2]: $r');
  }
  n++;

  // 3 — גבול-פנימי 25 ⇒ בסדר
  r = run(25);
  if (r.total != 25 || r.ids.length != 25 || r.rejectedReasonHe != null) {
    throw StateError('FAIL [3 boundary-25]: $r');
  }
  n++;

  // 4 — גבול-דחייה 26 ⇒ ids ריק + סיבה
  r = run(26);
  if (r.total != 26 || r.ids.isNotEmpty || r.rejectedReasonHe != 'REJECT:26') {
    throw StateError('FAIL [4 boundary-26]: $r');
  }
  n++;

  // 5 — הרבה ⇒ נדחה
  r = run(100);
  if (r.total != 100 || r.ids.isNotEmpty || r.rejectedReasonHe != 'REJECT:100') {
    throw StateError('FAIL [5]: $r');
  }
  n++;

  assert(run(2).rejectedReasonHe == null, 'assert-live guard');

  print('OK dryCountScope: $n asserts passed');
}
