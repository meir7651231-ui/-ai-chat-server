// בדיקת-חוזה · dayBucket — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/day_bucket_test.dart
import 'day_bucket.dart';

void _eq(DateTime got, DateTime want, String label) {
  if (got != want || !got.isUtc) {
    throw StateError('FAIL [$label]: got=$got(utc=${got.isUtc}) want=$want');
  }
}

void main() {
  var n = 0;

  // 1 — היסט +3ש חוצה חצות ⇒ יום הבא (UTC midnight)
  _eq(dayBucket(DateTime.utc(2026, 8, 26, 22, 30), const Duration(hours: 3)),
      DateTime.utc(2026, 8, 27), '1 forward-cross');
  n++;

  // 2 — היסט -3ש נסוג ⇒ יום קודם
  _eq(dayBucket(DateTime.utc(2026, 8, 26, 1, 0), const Duration(hours: -3)),
      DateTime.utc(2026, 8, 25), '2 backward-cross');
  n++;

  // 3 — offset אפס ⇒ אותו יום, midnight
  _eq(dayBucket(DateTime.utc(2026, 8, 26, 12, 0), Duration.zero),
      DateTime.utc(2026, 8, 26), '3 zero-offset');
  n++;

  // 4 — קלט לא-UTC מנורמל דרך toUtc (הפלט תמיד UTC-midnight)
  final local = DateTime.utc(2026, 1, 1, 5).toLocal();
  final got = dayBucket(local, Duration.zero);
  if (!got.isUtc) throw StateError('FAIL [4 always-utc]');
  n++;

  assert(dayBucket(DateTime.utc(2026, 8, 26, 12), Duration.zero) ==
      DateTime.utc(2026, 8, 26), 'assert-live guard');

  print('OK dayBucket: $n asserts passed');
}
