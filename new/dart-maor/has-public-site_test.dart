// בדיקת-חוזה (רתמת-זהב) · hasPublicSite — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/has-public-site.test.mjs:
//   {site:{title:'מאור'}}→true (enabled חסר = פעיל) ·
//   {site:{enabled:true}}→true ·
//   {site:{enabled:false}}→false (כיבוי מפורש) ·
//   {}→false (אין site) ·
//   {site:null}→false (‏!!null) ·
//   {site:{enabled:0}}→true (רק false ממש מכבה — ‏!==false)
// הרצה: dart run --enable-asserts new/dart-maor/has-public-site_test.dart ⇒ exit 0
import 'has-public-site.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  final cases = <List<Object?>>[
    [{'site': {'title': 'מאור'}}, true, 'enabled חסר = פעיל'],
    [{'site': {'enabled': true}}, true, 'enabled מפורש'],
    [{'site': {'enabled': false}}, false, 'כיבוי מפורש'],
    [<String, Object?>{}, false, 'אין site'],
    [{'site': null}, false, 'site=null'],
    [{'site': {'enabled': 0}}, true, 'רק false ממש מכבה'],
  ];

  for (final c in cases) {
    final cfg = c[0] as Map;
    final want = c[1] as bool;
    final why = c[2] as String;
    final got = hasPublicSite(cfg);
    _ok(got == want, '$why: $cfg ⇒ $got ≠ $want');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(hasPublicSite({'site': {'enabled': false}}) == false, 'assert-live guard');

  print('OK hasPublicSite: $n asserts passed');
}
