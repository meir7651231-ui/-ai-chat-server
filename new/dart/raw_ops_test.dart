// בדיקת-חוזה · rawOps — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/raw_ops_test.dart
import 'raw_ops.dart';

void _eqList(List<Object?> got, List<Object?> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: len got=${got.length} want=${want.length}');
  }
  for (var i = 0; i < got.length; i++) {
    if (got[i].toString() != want[i].toString()) {
      throw StateError('FAIL [$label] #$i: got=${got[i]} want=${want[i]}');
    }
  }
}

void main() {
  var n = 0;

  // — רשימה-ישירה עוברת —
  _eqList(rawOps([1, 2, 3]), [1, 2, 3], '1 direct-list'); n++;
  _eqList(rawOps([]), [], '7 empty-list');                n++;

  // — Map עם רשימת ops —
  _eqList(rawOps({'ops': [4, 5]}), [4, 5], '2 ops-list'); n++;

  // — Map כאובייקט-פעולה-בודד (op != null) עטוף —
  final lone = {'op': 'x', 'v': 1};
  final r3 = rawOps(lone);
  if (r3.length != 1 || !identical(r3[0], lone)) {
    throw StateError('FAIL [3 lone-op]: expected [lone map], got $r3');
  }
  n++;

  // — Map ללא ops/op ⇒ ריק —
  _eqList(rawOps({'foo': 1}), [], '4 map-no-ops');        n++;

  // — פרימיטיב / null ⇒ ריק —
  _eqList(rawOps(42), [], '5 int');                       n++;
  _eqList(rawOps(null), [], '6 null');                    n++;

  // — סדר-הכרעה: ops(List ריק) גובר לפני op —
  _eqList(rawOps({'ops': [], 'op': 1}), [], '8 ops-wins-over-op'); n++;

  // — ops שאינו List ⇒ נופל, op==null ⇒ ריק —
  _eqList(rawOps({'ops': 'notalist'}), [], '9 ops-notlist'); n++;

  // — op == null ⇒ לא עוטף; רק null מסונן (false עובר) —
  _eqList(rawOps({'op': null}), [], '10 op-null');        n++;
  final falseOp = {'op': false};
  final r11 = rawOps(falseOp);
  if (r11.length != 1 || !identical(r11[0], falseOp)) {
    throw StateError('FAIL [11 op-false]: expected wrap, got $r11');
  }
  n++;

  // assert חי (חוק: --enable-asserts) —
  assert(rawOps(const [1]).length == 1, 'assert-live guard');

  print('OK rawOps: $n asserts passed');
}
