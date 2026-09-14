// בדיקת-Golden · fxGroupInt — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'fx_group_int.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((fxGroupInt(0)).toString(), '0', '#0'); n++;
  _eq((fxGroupInt(1)).toString(), '1', '#1'); n++;
  _eq((fxGroupInt(-3)).toString(), '-3', '#2'); n++;
  _eq((fxGroupInt(100)).toString(), '100', '#3'); n++;
  _eq((fxGroupInt(786)).toString(), '786', '#4'); n++;
  print('✓ fxGroupInt: '+n.toString()+' Golden');
}
