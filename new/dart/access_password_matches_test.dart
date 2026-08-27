// בדיקת-Golden · accessPasswordMatches — אפיון-חצב (חוק-4/6). מייבאת רק את האטום.
import 'access_password_matches.dart';

void _eq(bool got, bool want, String lbl) {
  if (got != want) throw StateError('FAIL [$lbl]: got=$got want=$want');
}

// שקע-אמת: גיבוב-דטרמיניסטי עם trim (מדמה את hashAccessPassword — trim ואז קידומת).
String _hash(String plain) {
  final p = plain.trim();
  return p.isEmpty ? '' : 'H:$p';
}

void main() {
  var n = 0;
  // hash-שמור ריק ⇒ "אין נעילה" — כל קלט עובר.
  _eq(accessPasswordMatches('', 'anything', hashAccessPassword: _hash), true, '#0');
  n++;
  // הסיסמה הנכונה מגובבת ומתאימה ל-hash-השמור.
  _eq(accessPasswordMatches('H:secret', 'secret', hashAccessPassword: _hash), true, '#1');
  n++;
  // סיסמה שגויה ⇒ גיבוב שונה ⇒ false.
  _eq(accessPasswordMatches('H:secret', 'wrong', hashAccessPassword: _hash), false, '#2');
  n++;
  // רווחים סביב-הסיסמה מנוקים ע"י הגיבוב ⇒ עדיין תואם.
  _eq(accessPasswordMatches('H:secret', '  secret  ', hashAccessPassword: _hash), true, '#3');
  n++;
  print('✓ accessPasswordMatches: ' + n.toString() + ' Golden');
}
