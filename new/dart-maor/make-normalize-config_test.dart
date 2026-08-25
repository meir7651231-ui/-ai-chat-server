// רתמת-זהב · make-normalize-config — asserts זהים-לבדיקת-ה-JS (חוזה=מקור-אמת).
// מקור: new/atoms/make-normalize-config.test.mjs — אותם קלטים→פלטים.
// הרצה: dart run --enable-asserts make-normalize-config_test.dart  (יציאה 0 = Dart≡JS).
import 'make-normalize-config.dart';

/// שוויון-עומק (Map/List/סקלר) — מקביל ל-assert.deepStrictEqual.
bool _eq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_eq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_eq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

void _assert(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  final nc = makeNormalizeConfig(
    DEFAULT_CONFIG: {'slug': 'default', 'orgName': 'מאור החסד', 'theme': 'or-rishon'},
    INTEGRATION_KEYS: ['whatsapp', 'payments', 'ai'],
    INTEGRATION_SETTING_KEYS: {
      'payments': ['payUrl']
    },
    MOTION_KEYS: ['calm', 'snappy', 'bold'],
    TEMPLATE_KEYS: ['waFamily', 'waDonor'],
    normalizeSite: (raw) => (raw is Map && raw['enabled'] == true) ? {'enabled': true} : null,
    normalizeTelephony: (raw) =>
        (raw is Map && raw['enabled'] == true) ? {'enabled': true, 'numbers': <dynamic>[]} : null,
  );

  // 1) זבל => null; בסיס מברירת-המחדל
  for (final junk in <dynamic>[null, 'x', <dynamic>[], <String, dynamic>{}, {'random': 1}]) {
    _assert(nc(junk) == null, 'junk=$junk');
  }
  final c1 = nc({'slug': 'demo'})!;
  _assert(c1['orgName'] == 'מאור החסד', 'c1.orgName');
  _assert(_eq([c1['modules'], c1['features'], c1['terms']], [{}, {}, {}]), 'c1 modules/features/terms');

  // 2) דגלי true-מפורש
  final c2 = nc({'slug': 'demo', 'cloudRoot': 'yes', 'donationSplit': 1, 'supporterEnforce': true})!;
  _assert(!c2.containsKey('cloudRoot') && !c2.containsKey('donationSplit'), 'c2 flags removed');
  _assert(c2['supporterEnforce'] == true, 'c2.supporterEnforce');

  // 3) allowlist-הרחבות: typo נזרק, הגדרה-זרה נזרקת, payUrl שורד עם trim
  final c3 = nc({
    'slug': 'demo',
    'integrations': {
      'whatsapp': {'enabled': true, 'evil': 'x'},
      'payments': {'enabled': false, 'payUrl': '  https://pay.co  ', 'hack': 'z'},
      'typo': {'enabled': true},
      'ai': 'not-object',
    }
  })!;
  _assert(
      _eq(c3['integrations'], {
        'whatsapp': {'enabled': true},
        'payments': {'enabled': false, 'payUrl': 'https://pay.co'}
      }),
      'c3.integrations');

  // 4) firebase: חלקי נמחק; מלא נשמר
  _assert(!nc({'slug': 'd', 'firebase': {'apiKey': 'K'}})!.containsKey('firebase'), 'fb partial removed');
  final fb = {'apiKey': 'K', 'authDomain': 'a', 'projectId': 'p', 'appId': 'i'};
  _assert(_eq(nc({'slug': 'd', 'firebase': fb})!['firebase'], fb), 'fb full kept');

  // 5) emoji נגזם ל-12; motion allowlist; accentCustom true-בלבד
  final c5 = nc({'slug': 'd', 'emoji': 'א' * 20, 'motion': 'hacker', 'accentCustom': 'yes'})!;
  _assert((c5['emoji'] as String).length == 12, 'c5.emoji length');
  _assert(!c5.containsKey('motion') && !c5.containsKey('accentCustom'), 'c5 motion/accentCustom removed');
  _assert(nc({'slug': 'd', 'motion': 'bold'})!['motion'] == 'bold', 'motion bold kept');
  _assert(nc({'slug': 'd', 'accentCustom': true})!['accentCustom'] == true, 'accentCustom true kept');

  // 6) תבניות: מפתח-זר/ערך-לא-מחרוזת נזרקים
  final c6 = nc({'slug': 'd', 'templates': {'waFamily': 'שלום {name}', 'evil': 'x', 'waDonor': 7}})!;
  _assert(_eq(c6['templates'], {'waFamily': 'שלום {name}'}), 'c6.templates');

  // 7) site/telephony דרך השקעים
  final c7 = nc({'slug': 'd', 'site': {'enabled': true}, 'telephony': {'enabled': true}})!;
  _assert(_eq(c7['site'], {'enabled': true}), 'c7.site');
  _assert(_eq(c7['telephony'], {'enabled': true, 'numbers': <dynamic>[]}), 'c7.telephony');
  _assert(!nc({'slug': 'd', 'site': {'enabled': false}})!.containsKey('site'), 'site disabled removed');

  print('OK make-normalize-config');
}
