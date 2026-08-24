// בדיקת-חוזה (רתמת-זהב) · defaultPrices — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/default-prices.test.mjs:
//   1) t.base===290 · t.setup===1500
//   2) t.modules — 9 מפתחות בערכים המדויקים · supporters(180) הוא הגבוה ביותר
//   3) t.sizeMult === {small:1, medium:1.6, large:2.4}
//   4) t.enterprise === {oneTime:55000, annualMaintenance:9000}
//   5) ip={ai:120} ⇒ t.integrations === ip (אותה רפרנס — השקע משובץ, לא מועתק)
// המרה: === של JS ⇒ identical ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/default-prices_test.dart  ⇒ exit 0
import 'default-prices.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  final ip = {'ai': 120};
  final t = defaultPrices(ip);

  // 1) ליבה + הקמה
  _ok(t['base'] == 290, "base ⇒ ${t['base']} ≠ 290"); n++;
  _ok(t['setup'] == 1500, "setup ⇒ ${t['setup']} ≠ 1500"); n++;

  // 2) מודולים — 9 מפתחות בערכים המדויקים
  final modules = t['modules'] as Map;
  final wantModules = {
    'families': 0,
    'calendar': 0,
    'courses': 120,
    'diary': 70,
    'supporters': 180,
    'reports': 60,
    'tzedaka': 90,
    'shop': 90,
    'shop7': 80,
  };
  _ok(modules.length == 9, "modules — ${modules.length} מפתחות ≠ 9"); n++;
  wantModules.forEach((k, v) {
    _ok(modules[k] == v, "modules.$k ⇒ ${modules[k]} ≠ $v");
    n++;
  });
  // supporters הוא הערך הגבוה ביותר
  final maxVal = modules.values
      .map((e) => e as int)
      .reduce((a, b) => a > b ? a : b);
  _ok(maxVal == modules['supporters'], 'supporters אינו הערך הגבוה ביותר'); n++;

  // 3) מכפיל-גודל
  final sizeMult = t['sizeMult'] as Map;
  _ok(sizeMult['small'] == 1, "sizeMult.small ⇒ ${sizeMult['small']} ≠ 1"); n++;
  _ok(sizeMult['medium'] == 1.6, "sizeMult.medium ⇒ ${sizeMult['medium']} ≠ 1.6"); n++;
  _ok(sizeMult['large'] == 2.4, "sizeMult.large ⇒ ${sizeMult['large']} ≠ 2.4"); n++;
  _ok(sizeMult.length == 3, "sizeMult — ${sizeMult.length} מפתחות ≠ 3"); n++;

  // 4) enterprise
  final ent = t['enterprise'] as Map;
  _ok(ent['oneTime'] == 55000, "enterprise.oneTime ⇒ ${ent['oneTime']} ≠ 55000"); n++;
  _ok(ent['annualMaintenance'] == 9000, "enterprise.annualMaintenance ⇒ ${ent['annualMaintenance']} ≠ 9000"); n++;
  _ok(ent.length == 2, "enterprise — ${ent.length} מפתחות ≠ 2"); n++;

  // 5) השקע משובץ כמו-שהוא — אותה רפרנס (=== במקור ⇒ identical).
  _ok(identical(t['integrations'], ip), 'integrations אינו אותה רפרנס של השקע'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(defaultPrices(ip)['integrations'], ip), 'assert-live guard');

  print('OK defaultPrices: $n asserts passed');
}
