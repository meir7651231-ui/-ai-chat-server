// בדיקת-Golden · two — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'two.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((two(0)).toString(), '00', '#0'); n++;
  _eq((two(1)).toString(), '01', '#1'); n++;
  _eq((two(-3)).toString(), '-3', '#2'); n++;
  _eq((two(100)).toString(), '100', '#3'); n++;
  _eq((two(786)).toString(), '786', '#4'); n++;
  print('✓ two: '+n.toString()+' Golden');
}
