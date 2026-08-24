import 'effective-price.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/effective-price.test.mjs.
/// מימוש-שקע לבדיקה (בקופסה יחווט האטום האמיתי maxDiscountPct).
num maxDiscountPct(List<String> ids, List<Map<String, dynamic>> criteria) {
  num pct = 0;
  for (final id in ids) {
    Map<String, dynamic>? c;
    for (final x in criteria) {
      if (x['id'] == id) {
        c = x;
        break;
      }
    }
    if (c != null) {
      final d = c['discountPct'];
      if (d is num && d.isFinite && d > pct) pct = d;
    }
  }
  return pct;
}

void main() {
  final criteria = <Map<String, dynamic>>[
    {'id': 'c1', 'discountPct': 30},
    {'id': 'c2', 'discountPct': 50},
    {'id': 'c3', 'discountPct': 110},
  ];
  int p(num base, List<String> ids) =>
      effectivePrice(base, ids, criteria, maxDiscountPct);

  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('✗ $msg');
      f = 1;
    }
  }

  ok(p(100, ['c1']) == 70, '100 עם 30% ⇒ 70');
  ok(p(100, ['c1', 'c2']) == 50, 'הגבוה מבין הקריטריונים — לא מצטבר');
  ok(p(99, ['c1']) == 69, '99·0.7=69.3 ⇒ עיגול 69');
  ok(p(100, []) == 100, 'בלי קריטריונים ⇒ מחיר מלא');
  ok(p(100, ['c3']) == 0, '110% ⇒ נחסם ב-0, לא שלילי');
  ok(p(double.nan, ['c1']) == 0, 'בסיס לא-סופי ⇒ 0');

  if (f != 0) throw StateError('effective-price: סטייה מהמקור');
  print('✓ effective-price: 6 דוגמאות-חוזה — ירוק');
}
