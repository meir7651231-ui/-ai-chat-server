// בדיקת-חוזה (רתמת-זהב) · publicSiteOn — מייבאת אך ורק את האטום-שלה (חוק-4).
// 6 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/public-site-on.test.mjs:
//   אותם קלטים→פלטים, הזיוף המינימלי fOn=(c,k)=>c.features?.[k]!==false מומר ל-Dart.
//   דוגמה 6 מוכיחה קיצור-חישוב: כשהדגל כבוי — site לא נבדק (גישת-site זורקת אם נגעו).
// הרצה: dart run --enable-asserts new/dart-maor/public-site-on_test.dart  ⇒ exit 0
import 'public-site-on.dart';

// זיוף-מינימלי מקביל ל-JS: c.features?.[k] !== false (חסר-מפתח⇒פעיל, רק false מכבה).
bool fOn(dynamic c, String k) => c['features']?[k] != false;

// cfg לדוגמה 6: קריאת 'site' זורקת ⇒ אם ה-&& לא מקצר, הבדיקה נופלת (הוכחת קיצור-חישוב).
class _ThrowOnSite {
  final Map<String, dynamic> _m;
  _ThrowOnSite(this._m);
  dynamic operator [](Object? k) {
    if (k == 'site') {
      throw StateError('site נבדק למרות שהדגל כבוי (אין קיצור-&&)');
    }
    return _m[k];
  }
}

void main() {
  var n = 0;
  void ok(bool cond, String msg) {
    if (!cond) throw StateError('FAIL $msg');
    n++;
  }

  // 1) דגל דלוק + site פעיל ⇒ true
  ok(publicSiteOn(<String, dynamic>{'features': {}, 'site': {'enabled': true}}, fOn) == true,
      'דגל+site לא החזיר true');
  // 2) בלי site ⇒ false
  ok(publicSiteOn(<String, dynamic>{'features': {}}, fOn) == false,
      'בלי site החזיר true');
  // 3) site כבוי במפורש ⇒ false
  ok(publicSiteOn(<String, dynamic>{'features': {}, 'site': {'enabled': false}}, fOn) == false,
      'enabled:false החזיר true');
  // 4) enabled חסר ⇒ פעיל (רק false מכבה) ⇒ true
  ok(publicSiteOn(<String, dynamic>{'features': {}, 'site': <String, dynamic>{}}, fOn) == true,
      'enabled חסר החזיר false');
  // 5) הדגל כבוי ⇒ false
  ok(
      publicSiteOn(
              <String, dynamic>{'features': {'shell.publicsite': false}, 'site': {'enabled': true}}, fOn) ==
          false,
      'דגל כבוי החזיר true');

  // 6) צורת-הקריאה לשקע + קיצור-חישוב: השקע נקרא עם המפתח המדויק פעם-אחת; site לא נבדק.
  final calls = <String>[];
  bool spy(dynamic c, String k) {
    calls.add(k);
    return false;
  }

  final cfg6 = _ThrowOnSite({'features': {}}); // גישת 'site' תזרוק אם ייגעו
  final r6 = publicSiteOn(cfg6, spy);
  ok(r6 == false, 'קיצור-חישוב לא החזיר false');
  ok(calls.length == 1 && calls[0] == 'shell.publicsite',
      'השקע לא נקרא עם המפתח המדויק');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(publicSiteOn(<String, dynamic>{'features': {}, 'site': {'enabled': true}}, fOn),
      'assert-live guard');

  print('OK publicSiteOn: $n asserts passed (6 דוגמאות-חוזה — Dart≡JS)');
}
