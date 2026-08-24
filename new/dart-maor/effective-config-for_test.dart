// בדיקת-חוזה (רתמת-זהב) · effectiveConfigFor — מייבאת אך ורק את האטום-שלה (חוק-4).
// שמונה דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/effective-config-for.test.mjs:
//   מנהל ('boss@x.co')  ⇒ אותו אובייקט בדיוק (=== ⇒ identical)
//   בלי-כרטיס ('ghost') ⇒ אותו אובייקט בדיוק
//   עובד ('emp@x.co')   ⇒ modules.shop=false · modules.courses=true (true על מודול מתעלמים)
//                         features['a.x']=false · features['supporters.delete']=true (בסט)
//                         features['b.y']=undefined (true שלא-בסט מתעלמים)
//   הקלט לא השתנה (טהור) ⇒ orgConfig.modules.shop==true, features['supporters.delete']==false
// המרה: === של JS ⇒ identical · undefined ⇒ !containsKey.
// הרצה: dart run --enable-asserts new/dart-maor/effective-config-for_test.dart ⇒ exit 0
import 'effective-config-for.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // מימושי-שקע לבדיקה (בקופסה יחווטו האטומים האמיתיים):
  bool isOrgManager(String email, Map<String, dynamic> org) =>
      ((org['manager'] as String?) ?? '').trim().toLowerCase() ==
      email.trim().toLowerCase();

  Map<String, dynamic> overrideOf(String email, Map<String, dynamic> org) {
    final mc = org['memberConfigs'] as Map<String, dynamic>?;
    final card = mc?[email.trim().toLowerCase()];
    return (card as Map<String, dynamic>?) ?? {};
  }

  final grantable = {'supporters.delete'};

  final org = <String, dynamic>{
    'manager': 'boss@x.co',
    'memberConfigs': <String, dynamic>{
      'emp@x.co': <String, dynamic>{
        'modules': <String, dynamic>{'shop': false, 'courses': true},
        'features': <String, dynamic>{
          'a.x': false,
          'supporters.delete': true,
          'b.y': true,
        },
      },
    },
  };

  final orgConfig = <String, dynamic>{
    'modules': <String, dynamic>{'shop': true, 'courses': true},
    'features': <String, dynamic>{'a.x': true, 'supporters.delete': false},
  };

  // מנהל ⇒ אותו אובייקט בדיוק.
  _ok(
      identical(
          effectiveConfigFor('boss@x.co', org, orgConfig, isOrgManager,
              overrideOf, grantable),
          orgConfig),
      'מנהל ⇒ אותו אובייקט');
  n++;

  // בלי כרטיס ⇒ אותו אובייקט בדיוק.
  _ok(
      identical(
          effectiveConfigFor('ghost@x.co', org, orgConfig, isOrgManager,
              overrideOf, grantable),
          orgConfig),
      'בלי כרטיס ⇒ אותו אובייקט');
  n++;

  final eff = effectiveConfigFor(
      'emp@x.co', org, orgConfig, isOrgManager, overrideOf, grantable);
  final effModules = eff['modules'] as Map;
  final effFeatures = eff['features'] as Map;

  _ok(effModules['shop'] == false, 'modules.shop כובה');
  n++;
  _ok(effModules['courses'] == true,
      'true על מודול מתעלמים — נשאר כבארגון');
  n++;
  _ok(effFeatures['a.x'] == false, "features['a.x'] כובה");
  n++;
  _ok(effFeatures['supporters.delete'] == true,
      'הדלקה פר-עובד — מפתח בסט');
  n++;
  // undefined של JS ⇒ המפתח לא נוסף כלל (containsKey==false).
  _ok(!effFeatures.containsKey('b.y'), 'true שלא-בסט מתעלמים (undefined)');
  n++;

  // הקלט לא השתנה (טהור).
  _ok(
      (orgConfig['modules'] as Map)['shop'] == true &&
          (orgConfig['features'] as Map)['supporters.delete'] == false,
      'הקלט לא השתנה (טהור)');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(effModules['shop'] == false, 'assert-live guard');

  print('OK effectiveConfigFor: $n asserts passed');
}
