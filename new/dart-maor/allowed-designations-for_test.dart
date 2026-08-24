// בדיקת-חוזה (רתמת-זהב) · allowedDesignationsFor — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/allowed-designations-for.test.mjs
// (אותם קלטים→פלטים; אותם מימושי-שקע):
//   isOrgManager = (email,org) => (org.manager ?? '').trim().toLowerCase() === email.trim().toLowerCase()
//   overrideOf   = (email,org) => org.memberConfigs?.[email.trim().toLowerCase()] ?? {}
//   org = { manager:'boss@x.co', memberConfigs:{ 'emp@x.co':{designations:['חתן','כללי']},
//                                                'emp2@x.co':{designations:[]} } }
//   1) 'boss@x.co'  ⇒ null        (מנהל ⇒ null)
//   2) 'emp@x.co'   ⇒ ['חתן','כללי'] (עובד עם רשימה ⇒ הרשימה)
//   3) 'emp2@x.co'  ⇒ null        (רשימה ריקה ⇒ null)
//   4) 'ghost@x.co' ⇒ null        (בלי כרטיס ⇒ null)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/allowed-designations-for_test.dart  ⇒ exit 0
import 'allowed-designations-for.dart';

// שקעי-הבדיקה — מקבילים למימושי-ה-JS בבדיקת-המקור.
bool _isOrgManager(String email, Map<String, dynamic> org) =>
    ((org['manager'] as String?) ?? '').trim().toLowerCase() ==
    email.trim().toLowerCase();

Map<String, dynamic> _overrideOf(String email, Map<String, dynamic> org) {
  final mc = org['memberConfigs'] as Map<String, dynamic>?;
  final card = mc?[email.trim().toLowerCase()];
  return (card as Map<String, dynamic>?) ?? <String, dynamic>{};
}

final Map<String, dynamic> _org = {
  'manager': 'boss@x.co',
  'memberConfigs': <String, dynamic>{
    'emp@x.co': {'designations': <String>['חתן', 'כללי']},
    'emp2@x.co': {'designations': <String>[]},
  },
};

void _eq(List<dynamic>? got, List<dynamic>? want, String label) {
  final g = got == null ? '<null>' : got.join('|');
  final w = want == null ? '<null>' : want.join('|');
  if (g != w) {
    throw StateError('FAIL [$label]:\n got =[$g]\n want=[$w]');
  }
}

void main() {
  var n = 0;

  // 1) מנהל ⇒ null.
  _eq(allowedDesignationsFor('boss@x.co', _org, _isOrgManager, _overrideOf),
      null, 'מנהל ⇒ null');
  n++;

  // 2) עובד עם רשימה ⇒ הרשימה.
  _eq(allowedDesignationsFor('emp@x.co', _org, _isOrgManager, _overrideOf),
      ['חתן', 'כללי'], 'עובד עם רשימה ⇒ הרשימה');
  n++;

  // 3) רשימה ריקה ⇒ null.
  _eq(allowedDesignationsFor('emp2@x.co', _org, _isOrgManager, _overrideOf),
      null, 'רשימה ריקה ⇒ null');
  n++;

  // 4) בלי כרטיס ⇒ null.
  _eq(allowedDesignationsFor('ghost@x.co', _org, _isOrgManager, _overrideOf),
      null, 'בלי כרטיס ⇒ null');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    allowedDesignationsFor('emp@x.co', _org, _isOrgManager, _overrideOf)
            ?.join('|') ==
        'חתן|כללי',
    'assert-live guard',
  );

  print('OK allowedDesignationsFor: $n asserts passed');
}
