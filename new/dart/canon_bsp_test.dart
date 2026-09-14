// בדיקת-Golden · canonBsp — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'canon_bsp.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((canonBsp('')).toString(), '"', '#0'); n++;
  _eq((canonBsp('abc')).toString(), 'abc"', '#1'); n++;
  _eq((canonBsp('כהן לוי')).toString(), 'כהן לוי"', '#2'); n++;
  _eq((canonBsp('2026-08-24')).toString(), '2026-08-24"', '#3'); n++;
  _eq((canonBsp('0501234567')).toString(), '0501234567"', '#4'); n++;
  _eq((canonBsp('  x  ')).toString(), 'x"', '#5'); n++;
  print('✓ canonBsp: '+n.toString()+' Golden');
}
