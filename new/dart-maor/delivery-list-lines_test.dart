import '../dart-data-maor/delivery-list-lines-terms.dart' as td_delivery_list_lines;
// רתמת-זהב · delivery-list-lines — דוגמאות-החוזה של בדיקת-ה-JS ביט-אחר-ביט.
// אם עובר: Dart ≡ JS. הרצה: dart run --enable-asserts delivery-list-lines_test.dart
import 'delivery-list-lines.dart';

void main() {
  // השקע — תוויות-הסטטוס של המקור
  String statusLabel(dynamic s) =>
      s == 'pickup' ? 'איסוף' : (s == 'enroute' ? 'בדרך' : 'נמסר');

  final rows = <Map<String, dynamic>>[
    {'familyName': 'כהן', 'volunteerName': 'דוד', 'status': 'pickup'},
    {'familyName': 'לוי', 'volunteerName': 'שרה', 'status': 'delivered', 'address': 'הרצל 3'},
    {'familyName': 'מזרחי', 'volunteerName': 'דוד', 'status': 'enroute', 'note': 'קומה 2'},
  ];
  final out = deliveryListLines(rows, statusLabel, term: (k)=>td_delivery_list_lines.kTerms[k]!);

  assert(out.length == 5, 'אורך ≠ 5');
  assert(out[0] == '🦺 דוד (2 מסירות)', '[0] כותרת-דוד שגויה: ${out[0]}');
  assert(out[1] == '  • כהן · איסוף', '[1] שגוי: ${out[1]}');
  assert(out[2] == '  • מזרחי · בדרך · קומה 2', '[2] הערה-בלי-📍 שגוי: ${out[2]}');
  assert(out[3] == '🦺 שרה (1 מסירות)', '[3] כותרת-שרה שגויה: ${out[3]}');
  assert(out[4] == '  • לוי · נמסר · 📍 הרצל 3', '[4] כתובת-עם-📍 שגוי: ${out[4]}');

  // ריק
  assert(deliveryListLines(<Map<String, dynamic>>[], statusLabel, term: (k)=>td_delivery_list_lines.kTerms[k]!).isEmpty,
      'rows=[] לא ריק');

  print('✓ delivery-list-lines: 6 דוגמאות-חוזה — ירוק');
}
