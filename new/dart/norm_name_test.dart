import 'norm_name.dart';

// מימוש-אמת לשקע normSearch — העתק verbatim מהמקור (text_normalize.dart:24).
const Map<String, String> kHebrewFinalFold = {
  'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ',
};

String normSearch(String t) {
  var s = t.toLowerCase();
  s = s.replaceAll(RegExp('[֑-ׇ]'), '');
  final b = StringBuffer();
  for (final ch in s.split('')) {
    b.write(kHebrewFinalFold[ch] ?? ch);
  }
  s = b.toString().replaceAll(RegExp('[\'"׳״\\-–._]'), '');
  return s.trim();
}

void main() {
  // 'בן דוד' → fold ן→נ + הסרת רווח → 'בנדוד'.
  assert(normName('בן דוד', normSearch: normSearch) == 'בנדוד');
  // אותו מפתח בדיוק ללא רווח — קיפול-הסופית מאחד את השניים.
  assert(normName('בןדוד', normSearch: normSearch) == 'בנדוד');
  // אנגלית: lowercase + trim + הסרת רווחים.
  assert(normName('  A B ', normSearch: normSearch) == 'ab');
  print('normName OK');
}
