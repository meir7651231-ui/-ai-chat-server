import 'tier-of.dart';

/// רתמת-זהב: אותן 7 דוגמאות-חוזה בדיוק מ-new/atoms/tier-of.test.mjs.
/// השוואת-מפות = מפתח-מפתח (המקבילה של אורך+איבר-איבר), לא join.
int f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ $msg');
    f = 1;
  }
}

void eqMap(dynamic a, Map<String, String> b, String msg) {
  var same = a is Map && a.length == b.length;
  if (same) {
    for (final k in b.keys) {
      if (!a.containsKey(k) || a[k] != b[k]) same = false;
    }
  }
  ok(same, '$msg ⇒ $a');
}

void main() {
  const red = 500;

  // 1) טיטאן — הרשומה כולה
  eqMap(tierOf(1000, red), {'key': 'titan', 'label': 'טיטאן', 'bg': '#fdf3dd', 'c': '#9a6414', 'dot': '#f3c76b'},
      'רשומת-טיטאן סטתה');

  // 2) גבול 950 כלול
  ok(tierOf(950, red)['key'] == 'titan', 'גבול-950 לא טיטאן');

  // 3) לביאה — הרשומה כולה
  eqMap(tierOf(949, red), {'key': 'lion', 'label': 'לביאה', 'bg': '#e4f5ea', 'c': '#12803c', 'dot': '#16a34a'},
      'רשומת-לביאה סטתה');

  // 4) גבול 800 כלול
  ok(tierOf(800, red)['key'] == 'lion', 'גבול-800 לא לביאה');

  // 5) טעון-שיפור — הרשומה כולה (הגבול = הסף-המוזרק)
  eqMap(tierOf(500, red), {'key': 'pale', 'label': 'טעון שיפור', 'bg': '#fdf1d4', 'c': '#9a6414', 'dot': '#d97706'},
      'רשומת-טעון-שיפור סטתה');

  // 6) מתחת לסף — סיכון-נטישה
  eqMap(tierOf(499, red), {'key': 'red', 'label': 'סיכון נטישה', 'bg': '#fdeaea', 'c': '#b91c1c', 'dot': '#dc2626'},
      'רשומת-סיכון סטתה');

  // 7) הסף חי בחיווט — סף אחר משנה את ההכרעה
  ok(tierOf(499, 300)['key'] == 'pale', 'סף-מוזרק לא כובד');

  if (f != 0) throw StateError('tier-of: סטייה מהמקור');
  print('✓ tier-of: 7 דוגמאות-חוזה — ירוק');
  print('OK');
}
