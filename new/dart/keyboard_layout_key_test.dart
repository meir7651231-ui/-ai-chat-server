// בדיקת-Golden · keyboardLayoutKey — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'keyboard_layout_key.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((keyboardLayoutKey('')).toString(), 'kbd:', '#0'); n++;
  _eq((keyboardLayoutKey('abc')).toString(), 'kbd:abc', '#1'); n++;
  _eq((keyboardLayoutKey('כהן לוי')).toString(), 'kbd:כהן לוי', '#2'); n++;
  _eq((keyboardLayoutKey('2026-08-24')).toString(), 'kbd:2026-08-24', '#3'); n++;
  _eq((keyboardLayoutKey('0501234567')).toString(), 'kbd:0501234567', '#4'); n++;
  _eq((keyboardLayoutKey('  x  ')).toString(), 'kbd:  x  ', '#5'); n++;
  print('✓ keyboardLayoutKey: '+n.toString()+' Golden');
}
