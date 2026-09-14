// בדיקת-Golden · rad — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'rad.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((rad(0)).toString(), '0.0', '#0'); n++;
  _eq((rad(1)).toString(), '0.017453292519943295', '#1'); n++;
  _eq((rad(-3)).toString(), '-0.05235987755982988', '#2'); n++;
  _eq((rad(100)).toString(), '1.7453292519943295', '#3'); n++;
  _eq((rad(786)).toString(), '13.71828792067543', '#4'); n++;
  _eq((rad(3.14)).toString(), '0.05480333851262195', '#5'); n++;
  _eq((rad(0.5)).toString(), '0.008726646259971648', '#6'); n++;
  print('✓ rad: '+n.toString()+' Golden');
}
