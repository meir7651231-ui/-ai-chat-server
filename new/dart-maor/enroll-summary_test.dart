import '../dart-data-maor/enroll-summary-sockets.dart' as sk_enroll_summary;
import 'enroll-summary.dart';

/// רתמת-זהב: אותן 5 דוגמאות-חוזה בדיוק מ-new/atoms/enroll-summary.test.mjs.
/// אם עובר — Dart ≡ JS.
/// שקעים אמיתיים כסמנטיקת-maor (מקומיים לבדיקה):
num _paidOf(Map<String, dynamic> e) {
  final payments = (e['payments'] ?? const []) as List;
  num a = 0;
  for (final p in payments) {
    final amount = p['amount'];
    a += (amount is num && amount.isFinite) ? amount : 0;
  }
  return a;
}

num _payBal(Map<String, dynamic> e) {
  final due = (e['totalDue'] ?? 0) as num;
  final bal = due - _paidOf(e);
  return bal > 0 ? bal : 0;
}

bool _eq(Map<String, dynamic> g, Map<String, dynamic> w) {
  if (g.length != w.length) return false;
  for (final k in w.keys) {
    if (g[k] != w[k]) return false;
  }
  return true;
}

void main() {
  final c = <List<Map<String, dynamic>>>[
    [
      {
        'presents': ['2026-01-05', '2026-03-02', '2026-02-10'],
        'absences': [
          {'date': '2026-01-12', 'noshow': true},
          {'date': '2026-02-03'},
        ],
        'payments': [
          {'amount': 200},
          {'amount': 150},
        ],
        'totalDue': 500,
        'status': 'active',
      },
      {
        'presents': 3,
        'absences': 2,
        'noshow': 1,
        'balance': 150,
        'paid': 350,
        'statusLabel': 'פעיל',
        'lastPresent': '2026-03-02',
      },
    ],
    [
      {'status': 'wait'},
      {
        'presents': 0,
        'absences': 0,
        'noshow': 0,
        'balance': 0,
        'paid': 0,
        'statusLabel': 'רשימת-המתנה',
        'lastPresent': '',
      },
    ],
    [
      {
        'presents': [],
        'absences': [],
        'payments': [
          {'amount': 100},
        ],
        'totalDue': 600,
        'status': 'paused',
      },
      {
        'presents': 0,
        'absences': 0,
        'noshow': 0,
        'balance': 500,
        'paid': 100,
        'statusLabel': 'מושהה',
        'lastPresent': '',
      },
    ],
    [
      {
        'presents': ['2025-09-01'],
        'payments': [
          {'amount': 400},
        ],
        'totalDue': 400,
        'status': 'ended',
      },
      {
        'presents': 1,
        'absences': 0,
        'noshow': 0,
        'balance': 0,
        'paid': 400,
        'statusLabel': 'הסתיים',
        'lastPresent': '2025-09-01',
      },
    ],
    [
      {'status': 'weird'},
      {
        'presents': 0,
        'absences': 0,
        'noshow': 0,
        'balance': 0,
        'paid': 0,
        'statusLabel': '',
        'lastPresent': '',
      },
    ],
  ];
  var f = 0;
  for (final row in c) {
    final e = row[0];
    final w = row[1];
    final g = enrollSummary(e, _payBal, _paidOf, sk_enroll_summary.enrollSummary_T);
    if (!_eq(g, w)) {
      print('✗ $e ⇒ $g ≠ $w');
      f = 1;
    }
  }
  if (f != 0) throw StateError('enroll-summary: סטייה מהמקור');
  print('✓ enroll-summary: 5 דוגמאות-חוזה — ירוק');
}
