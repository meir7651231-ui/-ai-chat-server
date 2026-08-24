// בדיקת-חוזה · compliance — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/compliance_test.dart
import 'compliance.dart';

// שקע-בדיקה מקליט: רושם את הארגומנטים שקיבל ומחזיר רשימה-ידועה קבועה (R).
class _Rec<P, C> {
  List<P>? gotItems;
  int? gotTemp;
  Set<String>? gotAcc;
  final List<C> ret;
  _Rec(this.ret);
  List<C> call(List<P> items, int tempC, Set<String> accessories) {
    gotItems = items;
    gotTemp = tempC;
    gotAcc = accessories;
    return ret;
  }
}

void _t(bool cond, String label) {
  if (!cond) throw StateError('FAIL [$label]');
}

void main() {
  var n = 0;

  // — דוגמה 1: מסירת-דרך + accessories מושמט ⇒ const {} + זהות-ההחזרה —
  final r1 = ['ok'];
  final rec1 = _Rec<String, String>(r1);
  final out1 = compliance<String, String>(60,
      items: ['a', 'b'], checklist: rec1.call);
  _t(identical(out1, r1), '1 return identical to checklist result'); n++;
  _t(rec1.gotItems!.length == 2 &&
      rec1.gotItems![0] == 'a' &&
      rec1.gotItems![1] == 'b', '1 items passed verbatim'); n++;
  _t(rec1.gotTemp == 60, '1 tempC passed'); n++;
  _t(rec1.gotAcc != null && rec1.gotAcc!.isEmpty, '1 default accessories = {}'); n++;

  // — דוגמה 2: accessories מפורש נמסר כפי-שהוא —
  final rec2 = _Rec<String, String>(['x']);
  compliance<String, String>(60,
      items: ['a', 'b'], checklist: rec2.call, accessories: {'HW-INSUL'});
  _t(rec2.gotAcc!.length == 1 && rec2.gotAcc!.contains('HW-INSUL'),
      '2 explicit accessories passed'); n++;

  // — דוגמה 3: items ריק + tempC=0 נמסרים verbatim —
  final rec3 = _Rec<String, String>(const []);
  final out3 = compliance<String, String>(0, items: [], checklist: rec3.call);
  _t(rec3.gotItems!.isEmpty, '3 empty items verbatim'); n++;
  _t(rec3.gotTemp == 0, '3 tempC=0 verbatim'); n++;
  _t(out3.isEmpty, '3 returns checklist result (empty)'); n++;

  // — דוגמה 4 (עדשה-עוינת): tempC שלילי נמסר verbatim, האטום לא מגן —
  final rec4 = _Rec<String, String>(['y']);
  compliance<String, String>(-5, items: ['x'], checklist: rec4.call);
  _t(rec4.gotTemp == -5, '4 negative tempC passed verbatim'); n++;

  // — דוגמה 5: אורך-ההחזרה נקבע ע"י השקע בלבד (בלי סינון/מיון) —
  final rec5 = _Rec<int, int>([10, 20, 30]);
  final out5 = compliance<int, int>(75, items: [1], checklist: rec5.call);
  _t(out5.length == 3 && out5[0] == 10 && out5[2] == 30,
      '5 result unfiltered, length 3'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(
      compliance<String, String>(1, items: const [], checklist: _Rec<String, String>(r1).call),
      r1), 'assert-live guard');

  print('OK compliance: $n asserts passed');
}
