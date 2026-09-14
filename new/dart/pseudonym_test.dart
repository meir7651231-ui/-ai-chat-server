// בדיקת-Golden · pseudonym — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'pseudonym.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((pseudonym('')).toString(), '', '#0'); n++;
  _eq((pseudonym('abc')).toString(), 'abc', '#1'); n++;
  _eq((pseudonym('כהן לוי')).toString(), 'כהן לוי', '#2'); n++;
  _eq((pseudonym('2026-08-24')).toString(), '2026-08-', '#3'); n++;
  _eq((pseudonym('0501234567')).toString(), '05012345', '#4'); n++;
  _eq((pseudonym('  x  ')).toString(), '  x  ', '#5'); n++;
  print('✓ pseudonym: '+n.toString()+' Golden');
}
