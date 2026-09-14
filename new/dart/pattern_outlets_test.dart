// בדיקת-Golden · patternOutlets — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'pattern_outlets.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((patternOutlets('')).toString(), '9', '#0'); n++;
  _eq((patternOutlets('abc')).toString(), '9', '#1'); n++;
  _eq((patternOutlets('כהן לוי')).toString(), '9', '#2'); n++;
  _eq((patternOutlets('2026-08-24')).toString(), '9', '#3'); n++;
  _eq((patternOutlets('0501234567')).toString(), '9', '#4'); n++;
  _eq((patternOutlets('  x  ')).toString(), '9', '#5'); n++;
  print('✓ patternOutlets: '+n.toString()+' Golden');
}
