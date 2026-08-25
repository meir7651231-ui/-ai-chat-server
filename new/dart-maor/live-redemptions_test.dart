// 🏅 רתמת-זהב · liveRedemptions — 5 דוגמאות-החוזה, זהות ביט-אחר-ביט לבדיקת-ה-JS
// (new/atoms/live-redemptions.test.mjs). עובר ⇒ Dart ≡ JS (חוק-4).
// הרצה: dart run --enable-asserts new/dart-maor/live-redemptions_test.dart ⇒ exit 0.
import 'live-redemptions.dart';

void main() {
  // 1) מבוטל מושמט, הסדר נשמר
  final r1 = <String, dynamic>{'id': 'r1'};
  final r2 = <String, dynamic>{'id': 'r2', 'voidedAt': '2026-08-01'};
  final r3 = <String, dynamic>{'id': 'r3'};
  final got1 = liveRedemptions(<String, dynamic>{
    'redemptions': <dynamic>[r1, r2, r3]
  });
  assert(
      got1.length == 2 &&
          (got1[0] as Map)['id'] == 'r1' &&
          (got1[1] as Map)['id'] == 'r3',
      'דוגמה 1 נשברה');

  // 2) ריק ⇒ ריק
  assert(
      liveRedemptions(<String, dynamic>{'redemptions': <dynamic>[]}).isEmpty,
      'דוגמה 2 נשברה');

  // 3) כולם מבוטלים ⇒ ריק
  assert(
      liveRedemptions(<String, dynamic>{
        'redemptions': <dynamic>[
          <String, dynamic>{'voidedAt': 'x'},
          <String, dynamic>{'voidedAt': 'y'}
        ]
      }).isEmpty,
      'דוגמה 3 נשברה');

  // 4) אף מבוטל ⇒ אותן רפרנסות (filter לא מעתיק)
  final got4 = liveRedemptions(<String, dynamic>{
    'redemptions': <dynamic>[r1, r3]
  });
  assert(
      got4.length == 2 &&
          identical(got4[0], r1) &&
          identical(got4[1], r3),
      'דוגמה 4 נשברה — לא אותן רפרנסות');

  // 5) voidedAt ריק (falsy) ⇒ חי
  assert(
      liveRedemptions(<String, dynamic>{
        'redemptions': <dynamic>[
          <String, dynamic>{'id': 'r5', 'voidedAt': ''}
        ]
      }).length ==
          1,
      'דוגמה 5 נשברה');

  print('✓ live-redemptions (Dart): 5 דוגמאות-חוזה — ירוק · Dart ≡ JS');
}
