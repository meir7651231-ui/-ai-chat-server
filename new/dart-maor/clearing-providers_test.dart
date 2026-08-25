// בדיקת-חוזה (רתמת-זהב) · CLEARING_PROVIDERS — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/clearing-providers.test.mjs —
// צילום-הערך (SNAP): JSON.stringify(CLEARING_PROVIDERS) === ["נדרים","סולה"]
// כאן: אותה רשימה בדיוק, אותו סדר, אותם תווים. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/clearing-providers_test.dart  ⇒ exit 0
import 'clearing-providers.dart';

void _eq(List<String> got, List<String> want, String label) {
  final g = got.join('|');
  final w = want.join('|');
  if (g != w) {
    throw StateError('FAIL [$label]:\n got =[$g]\n want=[$w]');
  }
}

void main() {
  var n = 0;

  // צילום-הערך המדויק מהמקור (SNAP מפוענח).
  const want = <String>[
    'נדרים',
    'סולה',
  ];

  // 1) הרשימה כולה זהה ביט-אחר-ביט (סדר+תוכן).
  _eq(clearingProviders, want, 'צילום-ערך');
  n++;

  // 2) אורך = 2.
  if (clearingProviders.length != 2) {
    throw StateError('FAIL: אורך=${clearingProviders.length} (צפוי 2)');
  }
  n++;

  // 3) ברירת-המחדל/הראשי הוא 'נדרים' והשני 'סולה' (סדר-המקור).
  if (clearingProviders[0] != 'נדרים') {
    throw StateError('FAIL: [0]="${clearingProviders[0]}" (צפוי נדרים)');
  }
  if (clearingProviders[1] != 'סולה') {
    throw StateError('FAIL: [1]="${clearingProviders[1]}" (צפוי סולה)');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(clearingProviders.join('|') == want.join('|'), 'assert-live guard');

  print('OK CLEARING_PROVIDERS: $n asserts passed');
}
