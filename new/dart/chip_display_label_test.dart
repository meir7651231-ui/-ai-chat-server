// בדיקת-Golden · chipDisplayLabel — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'chip_display_label.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((chipDisplayLabel('')).toString(), '', '#0'); n++;
  _eq((chipDisplayLabel('abc')).toString(), 'abc', '#1'); n++;
  _eq((chipDisplayLabel('כהן לוי')).toString(), 'כהן לוי', '#2'); n++;
  _eq((chipDisplayLabel('2026-08-24')).toString(), '2026-08-24', '#3'); n++;
  _eq((chipDisplayLabel('0501234567')).toString(), '0501234567', '#4'); n++;
  _eq((chipDisplayLabel('  x  ')).toString(), 'x', '#5'); n++;
  print('✓ chipDisplayLabel: '+n.toString()+' Golden');
}
