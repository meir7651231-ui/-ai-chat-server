import 'component-counts.dart';

/// רתמת-זהב: אותן 5 דוגמאות-חוזה בדיוק מ-new/atoms/component-counts.test.mjs.
Map<String, dynamic> p(List<String> kinds) =>
    {'components': kinds.map((kind) => {'kind': kind}).toList()};

bool eq(Map<String, int> a, Map<String, int> b) {
  const keys = ['meeting', 'coupon', 'gift', 'holidayGift'];
  if (a.length != b.length) return false;
  for (final k in keys) {
    if (a[k] != b[k]) return false;
  }
  return true;
}

void main() {
  final c = <List<dynamic>>[
    [p([]), {'meeting': 0, 'coupon': 0, 'gift': 0, 'holidayGift': 0}],
    [p(['meeting']), {'meeting': 1, 'coupon': 0, 'gift': 0, 'holidayGift': 0}],
    [p(['coupon', 'coupon', 'gift']), {'meeting': 0, 'coupon': 2, 'gift': 1, 'holidayGift': 0}],
    [p(['meeting', 'coupon', 'gift', 'holidayGift']), {'meeting': 1, 'coupon': 1, 'gift': 1, 'holidayGift': 1}],
    [p(['holidayGift', 'holidayGift', 'holidayGift']), {'meeting': 0, 'coupon': 0, 'gift': 0, 'holidayGift': 3}],
  ];
  var f = 0;
  for (var i = 0; i < c.length; i++) {
    final g = componentCounts(c[i][0] as Map<String, dynamic>);
    final w = (c[i][1] as Map).cast<String, int>();
    if (!eq(g, w)) {
      print('✗ דוגמה ${i + 1}: $g ≠ $w');
      f = 1;
    }
  }
  if (f != 0) throw StateError('component-counts: סטייה מהמקור');
  print('✓ component-counts: 5 דוגמאות-חוזה — ירוק');
}
