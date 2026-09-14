// בדיקת-Golden · canonicalizeWord — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'canonicalize_word.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((canonicalizeWord('', const <String, String>{})).toString(), '', '#0'); n++;
  _eq((canonicalizeWord('', const <String, String>{'a': 'a'})).toString(), '', '#1'); n++;
  _eq((canonicalizeWord('abc', const <String, String>{})).toString(), 'abc', '#2'); n++;
  _eq((canonicalizeWord('abc', const <String, String>{'a': 'a'})).toString(), 'abc', '#3'); n++;
  _eq((canonicalizeWord('כהן לוי', const <String, String>{})).toString(), 'כהן לוי', '#4'); n++;
  _eq((canonicalizeWord('כהן לוי', const <String, String>{'a': 'a'})).toString(), 'כהן לוי', '#5'); n++;
  _eq((canonicalizeWord('2026-08-24', const <String, String>{})).toString(), '2026-08-24', '#6'); n++;
  _eq((canonicalizeWord('2026-08-24', const <String, String>{'a': 'a'})).toString(), '2026-08-24', '#7'); n++;
  _eq((canonicalizeWord('0501234567', const <String, String>{})).toString(), '0501234567', '#8'); n++;
  _eq((canonicalizeWord('0501234567', const <String, String>{'a': 'a'})).toString(), '0501234567', '#9'); n++;
  _eq((canonicalizeWord('  x  ', const <String, String>{})).toString(), '  x  ', '#10'); n++;
  _eq((canonicalizeWord('  x  ', const <String, String>{'a': 'a'})).toString(), '  x  ', '#11'); n++;
  print('✓ canonicalizeWord: '+n.toString()+' Golden');
}
