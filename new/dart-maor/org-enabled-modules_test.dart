// בדיקת-חוזה (רתמת-זהב) · orgEnabledModules — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/org-enabled-modules.test.mjs
// (allModules = ['families','courses','supporters']):
//   1) {modules:{courses:false}}                          ⇒ ['families','supporters']
//   2) {}                                                  ⇒ allModules (בלי modules ⇒ הכול דלוק)
//   3) {modules:{}}                                        ⇒ allModules (ריק ⇒ הכול דלוק)
//   4) {modules:{courses:true}}                            ⇒ allModules (true אינו משנה)
//   5) {modules:{families:false,courses:false,supporters:false}} ⇒ []  (הכול false)
// המרה: JSON.stringify של רשימות ⇒ השוואת-רשימות איבר-איבר ב-Dart (כלל-8: לא join).
// הרצה: dart run --enable-asserts new/dart-maor/org-enabled-modules_test.dart  ⇒ exit 0
import 'org-enabled-modules.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// השוואת-רשימות בטוחה (כלל-8): אורך + איבר-איבר, לא join.
bool _eq(List<String> a, List<String> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

void main() {
  var n = 0;
  final allModules = ['families', 'courses', 'supporters'];

  // 1) courses:false מסונן — הסדר נשמר.
  _ok(_eq(orgEnabledModules({'modules': {'courses': false}}, allModules),
      ['families', 'supporters']), 'courses:false מסונן'); n++;

  // 2) בלי modules ⇒ הכול דלוק (optional-chaining ⇒ undefined !== false ⇒ true).
  _ok(_eq(orgEnabledModules({}, allModules), allModules),
      'בלי modules ⇒ הכול דלוק'); n++;

  // 3) modules ריק ⇒ הכול דלוק (מפתח חסר ⇒ נשאר).
  _ok(_eq(orgEnabledModules({'modules': {}}, allModules), allModules),
      'modules ריק ⇒ הכול דלוק'); n++;

  // 4) true אינו משנה (true !== false ⇒ true).
  _ok(_eq(orgEnabledModules({'modules': {'courses': true}}, allModules), allModules),
      'true אינו משנה'); n++;

  // 5) הכול false ⇒ [].
  _ok(_eq(orgEnabledModules(
      {'modules': {'families': false, 'courses': false, 'supporters': false}},
      allModules), <String>[]), 'הכול false ⇒ []'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_eq(orgEnabledModules({'modules': {'courses': false}}, allModules),
      ['families', 'supporters']), 'assert-live guard');

  print('OK orgEnabledModules: $n asserts passed');
}
