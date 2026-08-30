// 🧬 הוכחת-איחוד-יסוד · norm-search — נקודת-המפגש העמוקה ביותר בין מאור לבנייה-חכמה.
// מריץ את שני אטומי-היסוד המקבילים על אותם קלטים ומוכיח פלט זהה-ביט:
//   מאור:        new/dart-maor/norm-search.dart  (normSearch, dynamic)
//   בנייה-חכמה:  new/dart/norm_search.dart        (normSearch, String)
// ירוק ⇒ אותה יכולת-יסוד בדיוק — מועמדת לאטום-משותף יחיד ששתי המערכות מזריקות ממנו.
import '../dart-data/norm_search-data.dart' as tdb_ns;
import '../dart-data-maor/norm-search-sockets.dart' as sk_ns;
import '../dart-maor/norm-search.dart' as maor;
import '../dart/norm_search.dart' as bs;

int n = 0, fails = 0;
void same(String input) {
  final a = maor.normSearch(input, sk_ns.normSearch_T);
  final b = bs.normSearch(input, kHebrewFinalFold: tdb_ns.kHebrewFinalFold);
  if (a != b) { print('✗ "$input": מאור="$a" ≠ בנייה-חכמה="$b"'); fails++; } else { n++; }
}

void main() {
  const inputs = [
    'כהן משה', 'שָׁלוֹם', 'רחל בן-צבי', 'א"ב ג׳', 'ABC.def', 'משפחת_כהן',
    'שלום־עולם', 'ניקוד: בְּרֵאשִׁית', 'MixedעברןAnglaית', 'סוף-פסוק ן ם ץ ף ך',
    '  רווחים  ', 'טל: 050-123', '', 'a.b.c-d', 'ישראלי דוד',
  ];
  for (final s in inputs) same(s);

  if (fails > 0) { print('❌ איחוד-היסוד: $fails הבדלים — לא זהים'); throw StateError('foundation unity failed'); }
  print('✓ איחוד-היסוד (norm-search): ${n} קלטים — מאור≡בנייה-חכמה, פלט זהה-ביט · יסוד-משותף מוכח');
}
