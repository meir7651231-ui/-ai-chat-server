// רתמת-זהב · integer-in-words — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות: אותם קלטים→פלטים).
// השקעים (joinHeb · words0_999 · thousandWords) מקומיים לבדיקה, כלשון-המקור
// (maor/src/lib/hebrewNumber.ts). אם עובר — Dart≡JS.
import 'integer-in-words.dart';

const ONES = ['', 'אחד', 'שניים', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה'];
const TEENS = ['עשרה', 'אחד עשר', 'שנים עשר', 'שלושה עשר', 'ארבעה עשר', 'חמישה עשר', 'שישה עשר', 'שבעה עשר', 'שמונה עשר', 'תשעה עשר'];
const TENS = ['', '', 'עשרים', 'שלושים', 'ארבעים', 'חמישים', 'שישים', 'שבעים', 'שמונים', 'תשעים'];
const HUNDREDS = ['', 'מאה', 'מאתיים', 'שלוש מאות', 'ארבע מאות', 'חמש מאות', 'שש מאות', 'שבע מאות', 'שמונה מאות', 'תשע מאות'];
const THOUSAND_CONSTRUCT = {3: 'שלושת', 4: 'ארבעת', 5: 'חמשת', 6: 'ששת', 7: 'שבעת', 8: 'שמונת', 9: 'תשעת', 10: 'עשרת'};

List<String> words0_999(int n) {
  final out = <String>[];
  final h = n ~/ 100;
  final rem = n % 100;
  if (h != 0) out.add(HUNDREDS[h]);
  if (rem != 0) {
    if (rem < 10) {
      out.add(ONES[rem]);
    } else if (rem < 20) {
      out.add(TEENS[rem - 10]);
    } else {
      final t = rem ~/ 10;
      final u = rem % 10;
      out.add(TENS[t]);
      if (u != 0) out.add(ONES[u]);
    }
  }
  return out;
}

String joinHeb(List<String> words) {
  final w = words.where((s) => s.isNotEmpty).toList();
  if (w.isEmpty) return '';
  if (w.length == 1) return w[0];
  return '${w.sublist(0, w.length - 1).join(' ')} ו${w.last}';
}

List<String> thousandWords(int th) {
  if (th == 1) return ['אלף'];
  if (th == 2) return ['אלפיים'];
  final c = THOUSAND_CONSTRUCT[th];
  if (c != null) return ['$c אלפים'];
  return ['${joinHeb(words0_999(th))} אלף'];
}

String? iw(num n) => integerInWords(n, joinHeb, words0_999, thousandWords);

void main() {
  final cases = <(num, String?)>[
    (0, 'אפס'),
    (123, 'מאה עשרים ושלושה'),
    (3000, 'שלושת אלפים'),
    (18000, 'שמונה עשר אלף'), // הבאג ההיסטורי — לא "שמונה עשר ואלף"
    (2000005, 'שני מיליון וחמישה'),
    (1234567, 'מיליון מאתיים שלושים וארבעה אלף חמש מאות שישים ושבעה'),
    (-1, null),
    (1.5, null),
    (1000000000, null),
  ];
  for (final c in cases) {
    final got = iw(c.$1);
    assert(got == c.$2, '✗ ${c.$1} ⇒ $got ≠ ${c.$2}');
  }
  print('✓ integer-in-words (Dart): 9 דוגמאות-חוזה — ירוק');
}
