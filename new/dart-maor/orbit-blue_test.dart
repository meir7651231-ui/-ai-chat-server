// בדיקת-חוזה (רתמת-זהב) · orbitBlue — מייבאת אך ורק את האטום-שלה (חוק-4).
// שמונה דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/orbit-blue.test.mjs:
//   scene==='Aurora' · Object.keys(vars).length===15 ·
//   vars['--o-accent']==='#6ea8fe' · vars['--accent']==='#6ea8fe' ·
//   vars['--o-accent-rgb']==='110,168,254' · vars['--o-g1']==='#1a2340' ·
//   vars['--o-btn-text']==='#ffffff' · vars['--o-glow']==='rgba(120,150,255,0.30)'
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/orbit-blue_test.dart  ⇒ exit 0
import 'orbit-blue.dart';

void _eq(Object? got, Object? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n got =$got\n want=$want');
  }
}

void main() {
  var n = 0;
  final vars = orbitBlue['vars'] as Map<String, String>;

  _eq(orbitBlue['scene'], 'Aurora', "scene==='Aurora'");
  n++;
  _eq(vars.length, 15, '15 מפתחות ב-vars');
  n++;
  _eq(vars['--o-accent'], '#6ea8fe', '--o-accent');
  n++;
  _eq(vars['--accent'], '#6ea8fe', '--accent');
  n++;
  _eq(vars['--o-accent-rgb'], '110,168,254', '--o-accent-rgb');
  n++;
  _eq(vars['--o-g1'], '#1a2340', '--o-g1');
  n++;
  _eq(vars['--o-btn-text'], '#ffffff', '--o-btn-text');
  n++;
  _eq(vars['--o-glow'], 'rgba(120,150,255,0.30)', '--o-glow');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(orbitBlue['scene'] == 'Aurora' && vars.length == 15, 'assert-live guard');

  print('OK orbitBlue: $n asserts passed');
}
