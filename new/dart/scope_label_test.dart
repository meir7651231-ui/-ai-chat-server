import '../dart-data/scope_label-terms.dart' as td_scope_label;
// בדיקת-חוזה · scopeLabel — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/scope_label_test.dart
import 'scope_label.dart';

String _s(String t) =>
    scopeLabel(t, all: 'all', screenPrefix: 'screen:', singlePrefix: 'element:', term: (k)=>td_scope_label.kTerms[k]!);

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(_s('all'), 'מתוך: כל האלמנטים', '1 all'); n++;
  _eq(_s('screen:cart'), 'מתוך: מרחב «cart»', '2 screen->מרחב'); n++;
  _eq(_s('element:btn-pay'), 'מתוך: האלמנט «btn-pay»', '3 single'); n++;
  _eq(_s('zzz'), 'מתוך: (טווח לא מזוהה)', '4 unknown'); n++;
  _eq(_s('screen:'), 'מתוך: מרחב «»', '5 empty-prefix'); n++;

  assert(_s('all') == 'מתוך: כל האלמנטים', 'assert-live guard');
  print('OK scopeLabel: $n asserts passed');
}
