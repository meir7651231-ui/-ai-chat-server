/// רתמת-זהב · find-all-open-plans — דוגמאות-החוזה המדויקות של בדיקת-ה-JS
/// (new/atoms/find-all-open-plans.test.mjs) מומרות ל-Dart. עובר ⇒ Dart≡JS.
/// אפס-import (dart-core בלבד). הרצה: dart run --enable-asserts find-all-open-plans_test.dart

import 'find-all-open-plans.dart';

bool _deepEq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k)) return false;
      if (!_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

void main() {
  final db = {
    'supporters': [
      {
        'id': 's1',
        'name': 'ראובן',
        'plannedCharges': [
          {'id': 'p1'},
          {'id': 'p2', 'chargedRid': 'R-5'},
          {'id': 'p3', 'cancelledAt': '2026-01-01'},
        ],
      },
      {'id': 's2', 'name': 'שמעון'},
    ],
    'enrollments': [
      {
        'id': 'e1',
        'memberId': 'm1',
        'plannedCharges': [
          {'id': 'p4'},
        ],
      },
      {'id': 'e2', 'memberId': 'mX', 'plannedCharges': []},
      {
        'id': 'e3',
        'memberId': 'ghost',
        'plannedCharges': [
          {'id': 'p6'},
        ],
      },
    ],
    'families': [
      {
        'id': 'f1',
        'name': 'לוי',
        'members': [
          {'id': 'm1', 'first': 'יעקב'},
        ],
      },
    ],
    'shopAssignments': [
      {
        'id': 'a1',
        'famId': 'f1',
        'plannedCharges': [
          {'id': 'p5'},
        ],
      },
    ],
  };

  final expected = [
    {
      'entityType': 'supporter',
      'entityId': 's1',
      'plan': {'id': 'p1'},
      'name': 'ראובן',
    },
    {
      'entityType': 'enrollment',
      'entityId': 'e1',
      'plan': {'id': 'p4'},
      'name': 'יעקב לוי',
    },
    {
      'entityType': 'enrollment',
      'entityId': 'e3',
      'plan': {'id': 'p6'},
      'name': '',
    },
    {
      'entityType': 'shopAssignment',
      'entityId': 'a1',
      'plan': {'id': 'p5'},
      'name': 'לוי',
    },
  ];

  final got = findAllOpenPlans(db);
  if (!_deepEq(got, expected)) {
    print('✗ got: $got');
    throw StateError('find-all-open-plans: Dart≠JS');
  }
  print('✓ find-all-open-plans: דוגמת-חוזה (4 שורות, דילוגים) — ירוק');
}
