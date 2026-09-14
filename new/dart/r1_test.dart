// בדיקת-Golden · r1 — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'r1.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((r1(0)).toString(), '0.0', '#0'); n++;
  _eq((r1(1)).toString(), '1.0', '#1'); n++;
  _eq((r1(-3)).toString(), '-3.0', '#2'); n++;
  _eq((r1(100)).toString(), '100.0', '#3'); n++;
  _eq((r1(786)).toString(), '786.0', '#4'); n++;
  _eq((r1(3.14)).toString(), '3.1', '#5'); n++;
  _eq((r1(0.5)).toString(), '0.5', '#6'); n++;
  print('✓ r1: '+n.toString()+' Golden');
}
