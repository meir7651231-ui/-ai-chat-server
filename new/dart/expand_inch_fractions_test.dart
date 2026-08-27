// בדיקת-Golden · expandInchFractions — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'expand_inch_fractions.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((expandInchFractions('')).toString(), '', '#0'); n++;
  _eq((expandInchFractions('abc')).toString(), 'abc', '#1'); n++;
  _eq((expandInchFractions('כהן לוי')).toString(), 'כהן לוי', '#2'); n++;
  _eq((expandInchFractions('2026-08-24')).toString(), '2026-08-24', '#3'); n++;
  _eq((expandInchFractions('0501234567')).toString(), '0501234567', '#4'); n++;
  _eq((expandInchFractions('  x  ')).toString(), '  x  ', '#5'); n++;
  print('✓ expandInchFractions: '+n.toString()+' Golden');
}
