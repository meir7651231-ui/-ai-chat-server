// בדיקת-חוזה (רתמת-זהב) · orgSecretKeys — מייבאת אך ורק את האטום-שלה (חוק-4).
// מקור-האמת: new/atoms/org-secret-keys.test.mjs — צילום-ערך:
//   JSON.stringify(ORG_SECRET_KEYS) === '["yemotToken","nedarimMosad","nedarimApiPass","smsApiKey","smtpUrl","solaXKey"]'
// כלל-המרה 8 (DART-PORTING-RULES): אין השוואת-join — אורך + איבר-איבר.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/org-secret-keys_test.dart  ⇒ exit 0
import 'org-secret-keys.dart';

void main() {
  var n = 0;
  final k = orgSecretKeys;

  // הצילום המדויק מהמקור, איבר-איבר ובסדר.
  const expected = [
    'yemotToken',
    'nedarimMosad',
    'nedarimApiPass',
    'smsApiKey',
    'smtpUrl',
    'solaXKey',
  ];

  // 1) אורך 6.
  assert(k.length == 6, 'FAIL: אורך ${k.length} ≠ 6');
  n++;

  // 2) איבר-איבר בסדר-המקור.
  for (var i = 0; i < expected.length; i++) {
    assert(k[i] == expected[i], "FAIL: [$i] '${k[i]}' ≠ '${expected[i]}'");
    n++;
  }

  // 3) אין כפילות (Set.size === length).
  assert(k.toSet().length == k.length, 'FAIL: כפילות ברשימה');
  n++;

  print('OK orgSecretKeys: $n asserts passed');
}
