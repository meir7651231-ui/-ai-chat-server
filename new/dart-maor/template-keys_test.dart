// בדיקת-חוזה (רתמת-זהב) · templateKeys — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/template-keys.test.mjs:
//   1) הגדרות-המקור המלאות (5 רשומות wa.*) ⇒
//      ['wa.delivery','wa.payment','wa.birthday','wa.dialer','wa.paylink']
//   2) [{key:'a'},{key:'b'}] ⇒ ['a','b'] — סדר-ההגדרה נשמר
//   3) [] ⇒ []
//   4) [{key:'x'},{key:'x'}] ⇒ ['x','x'] — כפילות לא מסוננת
// השוואת-מערך = אורך + איבר-איבר (חוק-8: לא join). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/template-keys_test.dart  ⇒ exit 0
import 'template-keys.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void _eqList(dynamic got, List want, String msg) {
  final g = got as List;
  _ok(g.length == want.length, '$msg — אורך ${g.length} ≠ ${want.length}');
  for (var i = 0; i < want.length; i++) {
    _ok(g[i] == want[i], "$msg — [$i] '${g[i]}' ≠ '${want[i]}'");
  }
}

void main() {
  var n = 0;

  // 1) הגדרות-המקור המלאות — הרשימה ההיסטורית.
  final defs = [
    {'key': 'wa.delivery'},
    {'key': 'wa.payment'},
    {'key': 'wa.birthday'},
    {'key': 'wa.dialer'},
    {'key': 'wa.paylink'},
  ];
  _eqList(
    templateKeys(defs),
    ['wa.delivery', 'wa.payment', 'wa.birthday', 'wa.dialer', 'wa.paylink'],
    'רשימת-המפתחות ההיסטורית סטתה',
  );
  n++;

  // 2) סדר-ההגדרה נשמר.
  _eqList(
    templateKeys([
      {'key': 'a'},
      {'key': 'b'},
    ]),
    ['a', 'b'],
    'הסדר לא נשמר',
  );
  n++;

  // 3) ריק ⇒ ריק.
  _eqList(templateKeys([]), [], 'מערך-ריק לא החזיר ריק');
  n++;

  // 4) כפילות לא מסוננת.
  _eqList(
    templateKeys([
      {'key': 'x'},
      {'key': 'x'},
    ]),
    ['x', 'x'],
    'כפילות סוננה',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert((templateKeys([]) as List).isEmpty, 'assert-live guard');

  print('OK templateKeys: $n contract examples passed');
}
