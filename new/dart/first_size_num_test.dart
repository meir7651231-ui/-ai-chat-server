// בדיקת-Golden · firstSizeNum — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'first_size_num.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((firstSizeNum('')).toString(), '0.0', '#0'); n++;
  _eq((firstSizeNum('abc')).toString(), '0.0', '#1'); n++;
  _eq((firstSizeNum('כהן לוי')).toString(), '0.0', '#2'); n++;
  _eq((firstSizeNum('2026-08-24')).toString(), '2026.0', '#3'); n++;
  _eq((firstSizeNum('0501234567')).toString(), '501234567.0', '#4'); n++;
  _eq((firstSizeNum('  x  ')).toString(), '0.0', '#5'); n++;
  print('✓ firstSizeNum: '+n.toString()+' Golden');
}
