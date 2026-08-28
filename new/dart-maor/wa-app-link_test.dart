// רתמת-זהב · wa-app-link — בדיוק 4 דוגמאות-החוזה של new/atoms/wa-app-link.test.mjs.
// הפלטים-הצפויים = ליטרלים שנמדדו מריצת-Node על המקור (bytes-not-prose):
//   whatsapp://send?phone=972501234567
//   whatsapp://send?phone=972501234567&text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%95%D7%9C%D7%9D
//   null · whatsapp://send?phone=972501234567
// עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts new/dart-maor/wa-app-link_test.dart
import 'wa-app-link.dart';

// שקע waDigits — מימוש-inline כחוזה wa-digits (בדיקת-אטום לא מייבאת אטום — חוק-חיווט);
// המרה-נאמנה של ה-inline מבדיקת-ה-JS.
String? waDigits(dynamic phone) {
  var d = ((phone ?? '') as String).replaceAll(RegExp(r'\D'), '');
  if (d.isEmpty) return null;
  if (d.startsWith('00972')) {
    d = '972' + d.substring(5);
  } else if (d.startsWith('00')) {
    d = d.substring(2);
  }
  if (d.startsWith('9720')) d = '972' + d.substring(4);
  if (!d.startsWith('972') && !d.startsWith('0') && (d.length == 8 || d.length == 9)) {
    d = '0' + d;
  }
  if (d.startsWith('0')) {
    if (d.length == 9 || d.length == 10) {
      d = '972' + d.substring(1);
    } else {
      return null;
    }
  }
  if (d.length < 8 || d.length > 15) return null;
  return d;
}

void main() {
  // 1 · בלי-טקסט
  assert(waAppLink('050-123-4567', '', waDigits) ==
      'whatsapp://send?phone=972501234567', '✗ 1 בלי-טקסט');
  // 2 · עם-טקסט-עברי (הליטרל = encodeURIComponent('שלום עולם') כפי שנמדד ב-Node)
  assert(waAppLink('050-123-4567', 'שלום עולם', waDigits) ==
      'whatsapp://send?phone=972501234567&text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%95%D7%9C%D7%9D',
      '✗ 2 עם-טקסט-עברי');
  // 3 · לא-תקין ⇒ null
  assert(waAppLink('12', 'hi', waDigits) == null, '✗ 3 לא-תקין ⇒ null');
  // 4 · טקסט-רווחים ⇒ כמו-ריק
  assert(waAppLink('0501234567', '  ', waDigits) ==
      'whatsapp://send?phone=972501234567', '✗ 4 טקסט-רווחים ⇒ כמו-ריק');
  print('✓ wa-app-link (Dart): 4 דוגמאות-חוזה — ירוק');
}
