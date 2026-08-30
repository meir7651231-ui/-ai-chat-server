import '../dart-data-maor/plan-label-of-sockets.dart' as sk_plan_label_of;
// 🥇 רתמת-זהב · planLabelOf — Dart≡JS. ה-assert-ים = דוגמאות-החוזה של new/atoms/plan-label-of.test.mjs
// (אותם קלטים→פלטים). עובר ⇒ הפורט זהה-התנהגות למקור-ה-JS. הרצה:
//   dart run --enable-asserts new/dart-maor/plan-label-of_test.dart  ⇒  exit 0.
// השקעים משכפלים את התנהגות-מאור (courses/lib.ts): planWord + payBal (totalDue - paid, לא שלילי).

import 'plan-label-of.dart';

String planWord(String m) => m == 'punch'
    ? 'כרטיסייה'
    : m == 'half_year'
        ? 'מנוי חצי-שנתי'
        : m == 'year'
            ? 'מנוי שנתי'
            : 'מנוי חודשי';

num payBal(Map<String, dynamic> e) {
  final due = (e['totalDue'] as num?) ?? 0;
  final paid = (e['paid'] as num?) ?? 0;
  final b = due - paid;
  return b > 0 ? b : 0; // Math.max(0, ...)
}

void run(Map<String, dynamic> e, String want) {
  final got = planLabelOf(e, planWord, payBal, sk_plan_label_of.planLabelOf_T);
  if (got != want) {
    throw AssertionError('✗ צפוי: $want — בפועל: $got');
  }
}

void main() {
  run({'plan': 'punch', 'purchased': 10, 'status': 'active', 'absences': []},
      'כרטיסייה · 10');
  run({'plan': 'month', 'status': 'paused', 'absences': []},
      'מנוי חודשי · מוקפא ⏸');
  run({
    'plan': 'year',
    'status': 'ended',
    'absences': [
      {'date': '2026-01-01'},
      {'date': '2026-02-01'}
    ],
    'totalDue': 200,
    'paid': 50
  }, 'מנוי שנתי · הסתיים · 2 חיס׳ · 💳 ₪150');
  run({
    'plan': 'half_year',
    'status': 'active',
    'absences': [
      {'date': '2026-03-01'}
    ]
  }, 'מנוי חצי-שנתי · 1 חיס׳');
  run({
    'plan': 'punch',
    'purchased': 4,
    'status': 'wait',
    'absences': [],
    'totalDue': 80
  }, 'כרטיסייה · 4 · 💳 ₪80');

  print('✓ plan-label-of: 5 דוגמאות-חוזה — Dart≡JS ירוק');
}
