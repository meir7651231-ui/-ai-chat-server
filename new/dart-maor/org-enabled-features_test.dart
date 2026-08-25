// בדיקת-חוזה (רתמת-זהב) · orgEnabledFeatures — מייבאת אך ורק את האטום-שלה (חוק-4).
// הדוגמאות זהות ביט-אחר-ביט למקור-ה-JS new/atoms/org-enabled-features.test.mjs:
//   אותם שקעי-בדיקה (מרשם-מודולים קטן + מימוש נאמן-למקור של org-enabled-modules),
//   אותם קלטים ⇒ אותם פלטים. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/org-enabled-features_test.dart  ⇒ exit 0
import 'org-enabled-features.dart';

// מימושי-שקע לבדיקה (מתעתקים את shim ה-JS ביט-אחר-ביט):
//   const allModules = ['families', 'courses'];
//   const orgEnabledModules = (cfg, mods) => mods.filter((m) => cfg.modules?.[m] !== false);
const List<String> allModules = ['families', 'courses'];

List<String> orgEnabledModules(Map<String, dynamic> cfg, List<String> mods) {
  final modules = cfg['modules'];
  return mods.where((m) {
    final v = modules is Map ? modules[m] : null; // cfg.modules?.[m]
    return v != false; // !== false
  }).toList();
}

// אותם ארבעה אובייקטי-דגל של ה-JS (A/B/C/D) + המרשם REG.
const Map<String, dynamic> A = {'key': 'families.a', 'module': 'families'};
const Map<String, dynamic> B = {'key': 'courses.b', 'module': 'courses'};
const Map<String, dynamic> C = {'key': 'core.c', 'module': 'core', 'optIn': true};
const Map<String, dynamic> D = {'key': 'core.d', 'module': 'core'};
const List<Map<String, dynamic>> REG = [A, B, C, D];

// keys(cfg) ≡ orgEnabledFeatures(...).map(x => x.key).join(',') של ה-JS.
String keys(Map<String, dynamic> cfg) => orgEnabledFeatures(cfg, REG, allModules, orgEnabledModules)
    .map((x) => x['key'] as String)
    .join(',');

void main() {
  var n = 0;

  // דוגמה 1 — קונפיג ריק: רגילים דלוקים, opt-in בחוץ.
  assert(keys({}) == 'families.a,courses.b,core.d', 'ריק: ${keys({})}');
  n++;

  // דוגמה 2 — מודול-אב כבוי מפיל את דגליו.
  assert(keys({'modules': {'courses': false}}) == 'families.a,core.d',
      'מודול-אב כבוי: ${keys({'modules': {'courses': false}})}');
  n++;

  // דוגמה 3 — מודול-אב כבוי גובר על דגל true.
  assert(
      keys({'modules': {'courses': false}, 'features': {'courses.b': true}}) ==
          'families.a,core.d',
      'מודול-כבוי גובר על true');
  n++;

  // דוגמה 4 — opt-in נדלק רק ב-true מפורש.
  assert(keys({'features': {'core.c': true}}) == 'families.a,courses.b,core.c,core.d',
      'opt-in true: ${keys({'features': {'core.c': true}})}');
  n++;

  // דוגמה 5 — דגל רגיל: false מכבה.
  assert(keys({'features': {'families.a': false}}) == 'courses.b,core.d',
      'רגיל false מכבה: ${keys({'features': {'families.a': false}})}');
  n++;

  // דוגמה 6 — truthy שאינו true אינו מדליק opt-in (הקלט 1).
  assert(keys({'features': {'core.c': 1}}) == 'families.a,courses.b,core.d',
      'truthy≠true לא מדליק opt-in: ${keys({'features': {'core.c': 1}})}');
  n++;

  // דוגמה 7 — הפלט = אותם אובייקטים (לא עותקים): identical ≡ `=== A` של ה-JS.
  final out = orgEnabledFeatures({}, REG, allModules, orgEnabledModules);
  assert(identical(out[0], A), 'אותם אובייקטים בפלט');
  n++;

  print('OK orgEnabledFeatures: $n asserts passed');
}
