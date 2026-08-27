// בדיקת-Golden · stripKind — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'strip_kind.dart';

void _eq(String got, String want, String lbl) {
  if (got != want) throw StateError('FAIL [$lbl]: got="$got" want="$want"');
}

// מימוש-אמת לשקע: מספרה⇒מידה, {לבן,שחור}⇒צבע, אחרת null (העתק-התנהגות דטרמיניסטי).
AttrKind? _kindOf(String w) {
  if (RegExp(r'\d').hasMatch(w)) return AttrKind.size;
  if (w == 'לבן' || w == 'שחור') return AttrKind.color;
  return null;
}

void main() {
  var n = 0;
  // 'ברך'→null · '90'→size · 'לבן'→color. הסרת size ⇒ נשארים ברך+לבן.
  _eq(stripKind('ברך 90 לבן', AttrKind.size, kindOf: _kindOf), 'ברך לבן', '#0');
  n++;
  // הסרת color ⇒ 'לבן' יורד.
  _eq(stripKind('ברך 90 לבן', AttrKind.color, kindOf: _kindOf), 'ברך 90', '#1');
  n++;
  // אף מילה אינה model ⇒ הכול נשמר.
  _eq(stripKind('ברך 90 לבן', AttrKind.model, kindOf: _kindOf), 'ברך 90 לבן', '#2');
  n++;
  // מחרוזת ריקה ⇒ ריק (הטוקן היחיד '' מסונן ב-isNotEmpty).
  _eq(stripKind('', AttrKind.size, kindOf: _kindOf), '', '#3');
  n++;
  print('✓ stripKind: ' + n.toString() + ' Golden');
}
