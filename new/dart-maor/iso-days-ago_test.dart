// רתמת-הזהב: דוגמאות-החוזה של new/atoms/iso-days-ago.test.mjs, ביט-אחר-ביט ל-Dart.
// עובר ⇒ Dart ≡ JS. הרצה: dart run --enable-asserts iso-days-ago_test.dart
import 'iso-days-ago.dart';

// שקע-isoLocal אמיתי כמוסכמת-maor (מקומי לבדיקה — הבדיקה מייבאת רק את האטום שלה)
String p2(int n) => n.toString().padLeft(2, '0');
String isoLocalReal(DateTime d) => '${d.year}-${p2(d.month)}-${p2(d.day)}';

// מקבילה ל-shifted של ה-JS: new Date(); d.setDate(d.getDate()-days) ⇒ isoLocalReal
String shifted(int days) {
  final now = DateTime.now();
  final d = DateTime(now.year, now.month, now.day - days, now.hour, now.minute,
      now.second, now.millisecond, now.microsecond);
  return isoLocalReal(d);
}

void main() {
  // דוגמה 2 — שקע-זקיף: הפלט הוא פלט-השקע בלבד
  assert(isoDaysAgo(5, (d) => 'X') == 'X', 'שקע-זקיף — ציפינו X');

  // דוגמאות 1+3 — יחס מול השעון (חישוב לפני+אחרי, חסין לחציית-חצות)
  for (final days in [0, 7, 31, -1, 10]) {
    final before = shifted(days);
    final got = isoDaysAgo(days, isoLocalReal);
    final after = shifted(days);
    assert(got == before || got == after,
        'days=$days ⇒ $got ∉ {$before, $after}');
  }

  // דוגמה 3 — ה-Date הנמסר לשקע מוזז N ימים בדיוק (בדיקת-הארגומנט עצמו)
  {
    const days = 10;
    final seen = <DateTime>[];
    isoDaysAgo(days, (d) {
      seen.add(d);
      return '';
    });
    final now = DateTime.now();
    final want = DateTime(now.year, now.month, now.day - days, now.hour,
        now.minute, now.second, now.millisecond, now.microsecond);
    final diffMs =
        (want.millisecondsSinceEpoch - seen[0].millisecondsSinceEpoch).abs();
    assert(seen.length == 1 && diffMs <= 5000,
        'ה-Date שנמסר לשקע לא מוזז 10 ימים (סטייה ${diffMs}ms)');
  }

  print('✓ iso-days-ago (Dart): 7 דוגמאות-חוזה — ירוק');
}
