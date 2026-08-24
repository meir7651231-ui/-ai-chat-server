// בדיקת-חוזה (רתמת-זהב) · ayinActionVisible — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/ayin-action-visible.test.mjs:
//   1) {stage:'done', names:[{name:'א'}]}          ⇒ false
//   2) {stage:'new',  names:[]}                    ⇒ false
//   3) {stage:'new',  names:[{name:'א'}]}          ⇒ true
//   4) {stage:'eyes', names:[{eyes:''},{}]}        ⇒ false (ריק/undefined לא נספרים)
//   5) {stage:'eyes', names:[{eyes:0}]}            ⇒ true  (0 = כמות לגיטימית)
//   6) {stage:'lead', names:[]}                    ⇒ true
//   7) {stage:'answer', names:[]}                  ⇒ true
// המרה: undefined של JS (מפתח eyes חסר) ⇒ null ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/ayin-action-visible_test.dart  ⇒ exit 0
import 'ayin-action-visible.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  _ok(ayinActionVisible({'stage': 'done', 'names': [{'name': 'א'}]}) == false,
      'done ⇒ false'); n++;

  _ok(ayinActionVisible({'stage': 'new', 'names': []}) == false,
      'new בלי שמות ⇒ false'); n++;

  _ok(ayinActionVisible({'stage': 'new', 'names': [{'name': 'א'}]}) == true,
      'new עם שם ⇒ true'); n++;

  _ok(ayinActionVisible({'stage': 'eyes', 'names': [{'eyes': ''}, {}]}) == false,
      'eyes ריק/undefined ⇒ false'); n++;

  _ok(ayinActionVisible({'stage': 'eyes', 'names': [{'eyes': 0}]}) == true,
      'eyes=0 ⇒ true'); n++;

  _ok(ayinActionVisible({'stage': 'lead', 'names': []}) == true,
      'lead ⇒ true'); n++;

  _ok(ayinActionVisible({'stage': 'answer', 'names': []}) == true,
      'answer ⇒ true'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(ayinActionVisible({'stage': 'done', 'names': []}) == false,
      'assert-live guard');

  print('OK ayinActionVisible: $n asserts passed');
}
