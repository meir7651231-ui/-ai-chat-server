// בדיקת-Golden · thousands — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'thousands.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((thousands(0)).toString(), '0', '#0'); n++;
  _eq((thousands(1)).toString(), '1', '#1'); n++;
  _eq((thousands(-3)).toString(), '-3', '#2'); n++;
  _eq((thousands(100)).toString(), '100', '#3'); n++;
  _eq((thousands(786)).toString(), '786', '#4'); n++;
  print('✓ thousands: '+n.toString()+' Golden');
}
