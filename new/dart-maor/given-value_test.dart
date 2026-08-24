import 'given-value.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/given-value.test.mjs.
/// השקע live = a.redemptions.filter(r => !r.voidedAt) — נאמן ל-truthiness של JS
/// (voidedAt חסר/null/'' ⇒ falsy ⇒ נשמר; מחרוזת לא-ריקה ⇒ מוחרג).
bool _falsy(dynamic v) {
  if (v == null) return true;
  if (v is bool) return !v;
  if (v is num) return v == 0 || v.isNaN;
  if (v is String) return v.isEmpty;
  return false;
}

List live(dynamic a) =>
    (a['redemptions'] as List).where((r) => _falsy(r['voidedAt'])).toList();

void main() {
  final c = [
    [
      [
        {
          'redemptions': [
            {'value': 100},
            {'value': 40}
          ]
        },
        {
          'redemptions': [
            {'value': 60}
          ]
        }
      ],
      200,
      'שני שיוכים חיים'
    ],
    [
      [
        {
          'redemptions': [
            {'value': 80},
            {'value': 500, 'voidedAt': '2026-08-01'}
          ]
        }
      ],
      80,
      'מבוטל מוחרג'
    ],
    [
      [
        {
          'redemptions': [
            {'value': null}, // undefined ב-JS ⇒ לא-מספרי
            {'value': double.nan}, // NaN ⇒ לא-מספרי
            {'value': 25}
          ]
        }
      ],
      25,
      'לא-מספרי נספר 0'
    ],
    [[], 0, 'אין שיוכים'],
    [
      [
        {
          'redemptions': [
            {'value': 70, 'voidedAt': 'x'}
          ]
        }
      ],
      0,
      'הכול מבוטל'
    ],
    [
      [
        {
          'redemptions': [
            {'value': 0},
            {'value': 15}
          ]
        }
      ],
      15,
      'value=0 חוקי'
    ],
  ];
  var f = 0;
  for (final row in c) {
    final assignments = row[0] as List;
    final want = row[1] as num;
    final msg = row[2] as String;
    final got = givenValue(assignments, live);
    if (got != want) {
      print('✗ $msg ⇒ $got ≠ $want');
      f = 1;
    }
  }
  if (f != 0) throw StateError('given-value: סטייה מהמקור');
  print('✓ given-value: 6 דוגמאות-חוזה — ירוק');
}
