// בדיקת-חוזה (רתמת-זהב) · hokRecordedThisMonth — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/hok-recorded-this-month.test.mjs:
//   HOK_CAT='הו"ק' · T='2026-08-24' · hok={amount:100,cur:'₪'} · 8 מקרים.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/hok-recorded-this-month_test.dart  ⇒ exit 0
import 'hok-recorded-this-month.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  const hokCat = 'הו"ק';
  const T = '2026-08-24';
  final hok = {'amount': 100, 'cur': '₪'};
  var n = 0;

  // 1 בלי-הו"ק ⇒ false
  _eq(hokRecordedThisMonth({'donations': []}, T, hokCat), false, '1 no-hok');
  n++;

  // 2 קטגוריית-הו"ק ⇒ true
  _eq(
      hokRecordedThisMonth({
        'hok': hok,
        'donations': [
          {'date': '2026-08-05', 'cat': 'הו"ק', 'amount': 50}
        ]
      }, T, hokCat),
      true,
      '2 hok-category');
  n++;

  // 3 סכום-מדויק+מטבע-חסר ⇒ true
  _eq(
      hokRecordedThisMonth({
        'hok': hok,
        'donations': [
          {'date': '2026-08-05', 'cat': 'כללי', 'amount': 100}
        ]
      }, T, hokCat),
      true,
      '3 exact-amount+missing-cur');
  n++;

  // 4 חודש-קודם ⇒ false
  _eq(
      hokRecordedThisMonth({
        'hok': hok,
        'donations': [
          {'date': '2026-07-30', 'cat': 'הו"ק', 'amount': 100}
        ]
      }, T, hokCat),
      false,
      '4 previous-month');
  n++;

  // 5 נדרים-בלי-סכום ⇒ true
  _eq(
      hokRecordedThisMonth({
        'hok': hok,
        'donations': [],
        'hist': [
          {'d': '2026-08-12', 'clearer': 'נדרים', 'a': 37}
        ]
      }, T, hokCat),
      true,
      '5 nedarim-no-amount');
  n++;

  // 5ב סולה-בלי-סכום ⇒ true
  _eq(
      hokRecordedThisMonth({
        'hok': hok,
        'donations': [],
        'hist': [
          {'d': '2026-08-12', 'clearer': 'סולה', 'a': 5}
        ]
      }, T, hokCat),
      true,
      '5b sola-no-amount');
  n++;

  // 6 hist-לגאסי-סכום-מדויק ⇒ true
  _eq(
      hokRecordedThisMonth({
        'hok': hok,
        'donations': [],
        'hist': [
          {'d': '2026-08-12', 'a': 100}
        ]
      }, T, hokCat),
      true,
      '6 legacy-hist-exact');
  n++;

  // 7 hist-סכום-שגוי ⇒ false
  _eq(
      hokRecordedThisMonth({
        'hok': hok,
        'donations': [],
        'hist': [
          {'d': '2026-08-12', 'a': 70}
        ]
      }, T, hokCat),
      false,
      '7 hist-wrong-amount');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(hokRecordedThisMonth({'donations': []}, T, hokCat) == false,
      'assert-live guard');

  print('OK hokRecordedThisMonth: $n asserts passed');
}
