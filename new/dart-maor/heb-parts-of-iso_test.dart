// רתמת-זהב · heb-parts-of-iso — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS. השקע hebParts מוזרק מקומית (הבדיקה מייבאת רק את האטום שלה).
import 'heb-parts-of-iso.dart';

void main() {
  // שקע-hebParts אמיתי עם מונה-קריאות — ערכיו = פלטי-הלוח של בדיקת-ה-JS (Intl 'en-u-ca-hebrew').
  var calls = 0;
  Map<String, dynamic> hebParts(dynamic d) {
    calls++;
    final dt = d as DateTime; // נקרא רק לתאריכי-אמת (fill משתמש ב-stub נפרד)
    final key = '${dt.year.toString().padLeft(4, '0')}-'
        '${dt.month.toString().padLeft(2, '0')}-'
        '${dt.day.toString().padLeft(2, '0')}';
    if (key == '2026-08-24') return {'day': 11, 'month': 'Elul', 'year': 5786};
    if (key == '2026-04-02') return {'day': 15, 'month': 'Nisan', 'year': 5786};
    throw StateError('תאריך לא-צפוי בבדיקה: $key');
  }

  final p1 = hebPartsOfIso('2026-08-24', hebParts);
  assert(p1['day'] == 11 && p1['month'] == 'Elul' && p1['year'] == 5786,
      '✗ אלול: $p1');

  final p2 = hebPartsOfIso('2026-04-02', hebParts);
  assert(p2['day'] == 15 && p2['month'] == 'Nisan' && p2['year'] == 5786,
      '✗ פסח: $p2');

  // מימואיזציה: אותה מחרוזת שוב ⇒ אפס קריאה נוספת, אותו אובייקט
  final before = calls;
  final p1b = hebPartsOfIso('2026-08-24', hebParts);
  assert(calls == before, '✗ מימואיזציה: hebParts נקרא שוב');
  assert(identical(p1b, p1), '✗ מימואיזציה: אובייקט שונה');

  // זנב-שעה: מפתח נפרד (קריאה נוספת) אך אותם רכיבים
  final p1c = hebPartsOfIso('2026-08-24T23:59:00', hebParts);
  assert(p1c['day'] == 11 && p1c['month'] == 'Elul', '✗ חיתוך-זנב: $p1c');

  // תקרת-מטמון 3000: מציפים במפתחות שונים ⇒ מפתח ותיק מחושב מחדש (המטמון נוקה)
  Map<String, dynamic> cheap(dynamic d) {
    calls++;
    return {'day': 1, 'month': 'Tishri', 'year': 5786};
  }

  for (var i = 0; i < 3001; i++) {
    hebPartsOfIso('fill-$i', cheap);
  }
  final afterFill = calls;
  hebPartsOfIso('2026-08-24', hebParts);
  assert(calls == afterFill + 1,
      '✗ תקרה: המפתח הוותיק היה אמור להתחשב מחדש אחרי ניקוי');

  print('✓ heb-parts-of-iso (Dart): רכיבים מול הלוח + מימואיזציה + חיתוך-זנב + תקרת-3000 — ירוק');
}
