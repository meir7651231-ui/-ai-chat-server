// בדיקת-חוזה (רתמת-זהב) · campaignProgress — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה (6 asserts) זהות ביט-אחר-ביט למקור-ה-JS
// new/atoms/campaign-progress.test.mjs. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/campaign-progress_test.dart ⇒ exit 0
import 'campaign-progress.dart';

// שקע-campaignTotal בסמנטיקת-המקור (tzedaka/lib.ts:68-73).
num campaignTotal(List boxes, Object? campaignId) {
  num sum = 0;
  for (final b in boxes) {
    for (final c in (b as Map)['collections'] as List) {
      final m = c as Map;
      if (m['campaignId'] == campaignId) {
        final a = m['amount'];
        sum += (a is num && a.isFinite) ? a : 0;
      }
    }
  }
  return sum;
}

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void _eqMap(String n, Map<String, num> got, Map<String, num> want) {
  _ok(got['sum'] == want['sum'] && got['goal'] == want['goal'] && got['pct'] == want['pct'],
      'דוגמה $n: $got ≠ $want');
}

void main() {
  var n = 0;

  final boxes = [
    {'collections': [{'campaignId': 'k1', 'amount': 100}, {'campaignId': 'k2', 'amount': 999}]},
    {'collections': [{'campaignId': 'k1', 'amount': 150}]},
  ];

  // 1 · 250 מתוך 1000 — ריקון של מבצע-אחר לא נספר.
  _eqMap('1', campaignProgress({'id': 'k1', 'goal': 1000}, boxes, campaignTotal),
      {'sum': 250, 'goal': 1000, 'pct': 25}); n++;

  // 2 · חריגה מהיעד — קטום ל-100.
  _ok(campaignProgress({'id': 'k1', 'goal': 1000},
          [{'collections': [{'campaignId': 'k1', 'amount': 1500}]}], campaignTotal)['pct'] == 100,
      'דוגמה 2: pct ≠ 100'); n++;

  // 3 · יעד חסר ⇒ goal 0, pct 0.
  _eqMap('3', campaignProgress({'id': 'k1'}, boxes, campaignTotal),
      {'sum': 250, 'goal': 0, 'pct': 0}); n++;

  // 4 · עיגול round (לא floor).
  _ok(campaignProgress({'id': 'x', 'goal': 1000},
          [{'collections': [{'campaignId': 'x', 'amount': 333}]}], campaignTotal)['pct'] == 33,
      'דוגמה 4a: 333/1000 ≠ 33'); n++;
  _ok(campaignProgress({'id': 'x', 'goal': 1000},
          [{'collections': [{'campaignId': 'x', 'amount': 335}]}], campaignTotal)['pct'] == 34,
      'דוגמה 4b: 335/1000 ≠ 34'); n++;

  // 5 · בלי קופות.
  _eqMap('5', campaignProgress({'id': 'k1', 'goal': 500}, [], campaignTotal),
      {'sum': 0, 'goal': 500, 'pct': 0}); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(campaignProgress({'id': 'k1', 'goal': 1000}, boxes, campaignTotal)['pct'] == 25,
      'assert-live guard');

  print('OK campaignProgress: $n asserts passed');
}
