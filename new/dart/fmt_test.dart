// בדיקת-Golden · fmt — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'fmt.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((fmt(0)).toString(), '0', '#0'); n++;
  _eq((fmt(1)).toString(), '1', '#1'); n++;
  _eq((fmt(-3)).toString(), '-3', '#2'); n++;
  _eq((fmt(100)).toString(), '100', '#3'); n++;
  _eq((fmt(786)).toString(), '786', '#4'); n++;
  _eq((fmt(3.14)).toString(), '3.14', '#5'); n++;
  _eq((fmt(0.5)).toString(), '0.5', '#6'); n++;
  print('✓ fmt: '+n.toString()+' Golden');
}
