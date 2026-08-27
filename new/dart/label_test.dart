// בדיקת-Golden · label — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'label.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((label('')).toString(), 'כללי', '#0'); n++;
  _eq((label('abc')).toString(), 'abc', '#1'); n++;
  _eq((label('כהן לוי')).toString(), 'כהן לוי', '#2'); n++;
  _eq((label('2026-08-24')).toString(), '2026-08-24', '#3'); n++;
  _eq((label('0501234567')).toString(), '0501234567', '#4'); n++;
  _eq((label('  x  ')).toString(), '  x  ', '#5'); n++;
  print('✓ label: '+n.toString()+' Golden');
}
