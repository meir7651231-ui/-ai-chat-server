// בדיקת-Golden · norm — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'norm.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((norm(0)).toString(), '0.0', '#0'); n++;
  _eq((norm(1)).toString(), '1.0', '#1'); n++;
  _eq((norm(-3)).toString(), '-3.0', '#2'); n++;
  _eq((norm(100)).toString(), '100.0', '#3'); n++;
  _eq((norm(786)).toString(), '66.0', '#4'); n++;
  _eq((norm(3.14)).toString(), '3.1399999999999864', '#5'); n++;
  _eq((norm(0.5)).toString(), '0.5', '#6'); n++;
  print('✓ norm: '+n.toString()+' Golden');
}
