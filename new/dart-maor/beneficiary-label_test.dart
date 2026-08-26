import '../dart-data-maor/beneficiary-label-terms.dart';
import 'beneficiary-label.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/beneficiary-label.test.mjs.
/// שקע termOf זהה למקור: מונח-הארגון או ברירת-מחדל; ריק/רווחים ⇒ נסיגה.
String termOf(Map<String, dynamic> cfg, String key, String fallback) {
  final terms = cfg['terms'];
  if (terms is Map) {
    final v = terms[key];
    if (v is String) {
      final t = v.trim();
      if (t.isNotEmpty) return t;
    }
  }
  return fallback;
}

void main() {
  final db = <String, dynamic>{
    'families': [
      {
        'id': 'f1',
        'name': 'כהן',
        'members': [
          {'id': 'm1', 'first': 'דוד'},
        ],
      },
    ],
  };

  final cases = <List<dynamic>>[
    [<String, dynamic>{'famId': 'f1'}, null, 'משפחת כהן'],
    [<String, dynamic>{'famId': 'f1', 'memberId': 'm1'}, null, 'משפחת כהן — דוד'],
    [<String, dynamic>{'famId': 'f1', 'memberId': 'mX'}, null, 'משפחת כהן'],
    [<String, dynamic>{'famId': 'zzz', 'memberId': 'm1'}, null, 'משפחה לא ידועה'],
    [
      <String, dynamic>{'famId': 'f1', 'memberId': 'm1'},
      <String, dynamic>{'terms': {'entity.familyOf': 'לקוח'}},
      'לקוח כהן — דוד',
    ],
    [<String, dynamic>{'famId': 'f1'}, <String, dynamic>{'terms': <String, dynamic>{}}, 'משפחת כהן'],
  ];

  var f = 0;
  for (final row in cases) {
    final a = row[0] as Map<String, dynamic>;
    final cfg = row[1] as Map<String, dynamic>?;
    final w = row[2] as String;
    final g = beneficiaryLabel(db, a, cfg, termOf, term: (k)=>kTerms[k]!);
    if (g != w) {
      print('✗ $a + cfg=$cfg ⇒ "$g" ≠ "$w"');
      f = 1;
    }
  }
  if (f != 0) throw StateError('beneficiary-label: סטייה מהמקור');
  print('✓ beneficiary-label: 6 דוגמאות-חוזה — ירוק');
}
