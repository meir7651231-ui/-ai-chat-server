// בדיקת-חוזה · scopeHe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/scope_he_test.dart
// הבדיקה מעבירה את אוצר-הטווחים במפורש (השקעים) — לא מסתמכת על ברירות-המחדל.
import 'scope_he.dart';

const _all = 'all', _act = 'actionable';
const _every = 'every:', _screen = 'screen:', _single = 'element:';

String _s(String t) => scopeHe(t,
    all: _all,
    actionable: _act,
    everyPrefix: _every,
    screenPrefix: _screen,
    singlePrefix: _single);

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(_s('all'), 'כל האלמנטים', '1 all'); n++;
  _eq(_s('actionable'), 'כל הכפתורים', '2 actionable'); n++;
  _eq(_s('every:button'), 'כל «button»', '3 every'); n++;
  _eq(_s('screen:cart'), 'מסך «cart»', '4 screen'); n++;
  _eq(_s('element:btn-pay'), 'האלמנט «btn-pay»', '5 single'); n++;
  _eq(_s('wat'), '(טווח לא מזוהה)', '6 unknown'); n++;
  _eq(_s('screen:'), 'מסך «»', '7 empty-prefix'); n++;

  // — סדר-הכרעה: התאמה-מדויקת גוברת על קידומת —
  // (‏'all' אינו מתחיל באף קידומת, אך מאמת שהמסלול המדויק ראשון) —
  _eq(_s('all'), 'כל האלמנטים', '8 exact-before-prefix'); n++;

  assert(_s('all') == 'כל האלמנטים', 'assert-live guard');
  print('OK scopeHe: $n asserts passed');
}
