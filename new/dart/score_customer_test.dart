// בדיקת-חוזה · scoreCustomer — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/score_customer_test.dart
// ספים מפורשים (השקעים) — לא מסתמכים על ברירות-המחדל.
import 'score_customer.dart';

CustomerScore _s(int orders, num spend, int? recency) => scoreCustomer(
      RfmInput(orderCount: orders, totalSpend: spend, recencyDays: recency),
      freqHigh: 5,
      freqMid: 2,
      moneyHigh: 1000,
      moneyMid: 300,
      recentDays: 30,
      staleDays: 90,
    );

void _check(
  CustomerScore s, {
  required int r,
  required int f,
  required int m,
  required int points,
  required int maxPoints,
  required String tier,
  required bool atRisk,
  required String label,
}) {
  final got =
      'r$r f$f m$m p$points/$maxPoints $tier ${atRisk ? "risk" : "ok"}';
  final want =
      'r${s.r} f${s.f} m${s.m} p${s.points}/${s.maxPoints} ${s.tier} ${s.atRisk ? "risk" : "ok"}';
  if (got != want) throw StateError('FAIL [$label]: got="$want" want="$got"');
}

void main() {
  var n = 0;

  _check(_s(6, 2000, 10),
      r: 2, f: 2, m: 2, points: 6, maxPoints: 6, tier: 'champion', atRisk: false, label: '1 champion'); n++;
  _check(_s(6, 2000, 200),
      r: 0, f: 2, m: 2, points: 4, maxPoints: 6, tier: 'loyal', atRisk: true, label: '2 loyal at-risk'); n++;
  _check(_s(0, 0, null),
      r: -1, f: 0, m: 0, points: 0, maxPoints: 4, tier: 'dormant', atRisk: false, label: '3 dormant no-R'); n++;
  _check(_s(3, 500, 50),
      r: 1, f: 1, m: 1, points: 3, maxPoints: 6, tier: 'loyal', atRisk: false, label: '4 loyal'); n++;
  _check(_s(3, 500, 200),
      r: 0, f: 1, m: 1, points: 2, maxPoints: 6, tier: 'occasional', atRisk: false, label: '5 occasional'); n++;

  assert(_s(6, 2000, 10).tier == 'champion', 'assert-live guard');
  print('OK scoreCustomer: $n asserts passed');
}
