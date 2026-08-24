// רתמת-זהב · boq-total — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart≡JS. הקלטים/פלטים הועתקו verbatim מ-new/atoms/boq-total.test.mjs.
// הבדיקה מייבאת אך ורק את האטום שלה (חוק-4); שקע boqLineAmount משוכפל
// מבדיקת-ה-JS: (n) => (+n.eyes || 0) * (n.rate || 0) — שעתוק-אמת JS.
import 'boq-total.dart';

// שקע boqLineAmount — העתק-חוזה של האטום-האחות, כמו בבדיקת-ה-JS.
num _boqLineAmount(Map<String, dynamic> n) {
  final num a = _jsNumber(n['eyes']);        // +n.eyes
  final num left = (a != 0 && !a.isNaN) ? a : 0; // (+n.eyes || 0)
  final Object? r = _jsTruthy(n['rate']) ? n['rate'] : 0; // (n.rate || 0)
  return left * _jsNumber(r);
}

num _jsNumber(Object? v) {
  if (v is num) return v;
  if (v is bool) return v ? 1 : 0;
  if (v is String) {
    final t = v.trim();
    if (t.isEmpty) return 0;
    return num.tryParse(t) ?? double.nan;
  }
  return double.nan;
}

bool _jsTruthy(Object? v) {
  if (v == null) return false;
  if (v is bool) return v;
  if (v is num) return v != 0 && !v.isNaN;
  if (v is String) return v.isNotEmpty;
  return true;
}

void main() {
  final cases = <List<Object?>>[
    [{'names': [{'eyes': 2, 'rate': 100}, {'eyes': 3, 'rate': 50}]}, 350],
    [{'names': []}, 0],
    [{'names': [{'eyes': '4', 'rate': 2.5}]}, 10],
    [{'names': [{'eyes': 5}, {'eyes': 1, 'rate': 99}]}, 99],
    [{'names': [{'eyes': '', 'rate': 1000}, {'eyes': 0, 'rate': 7}]}, 0],
  ];
  for (final c in cases) {
    final a = (c[0] as Map).cast<String, dynamic>();
    final w = c[1] as num;
    final g = boqTotal(a, _boqLineAmount);
    assert(g == w, '✗ $a ⇒ $g ≠ $w');
  }
  print('✓ boq-total (Dart): 5 דוגמאות-חוזה — ירוק');
}
