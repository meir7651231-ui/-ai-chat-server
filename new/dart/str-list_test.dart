// בדיקת-Golden · strList — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'str-list.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((strList('')).toString(), '[]', '#0'); n++;
  _eq((strList('abc')).toString(), '[]', '#1'); n++;
  _eq((strList('כהן לוי')).toString(), '[]', '#2'); n++;
  _eq((strList('2026-08-24')).toString(), '[]', '#3'); n++;
  _eq((strList('0501234567')).toString(), '[]', '#4'); n++;
  _eq((strList('  x  ')).toString(), '[]', '#5'); n++;
  _eq((strList(0)).toString(), '[]', '#6'); n++;
  _eq((strList(1)).toString(), '[]', '#7'); n++;
  _eq((strList(-3)).toString(), '[]', '#8'); n++;
  _eq((strList(100)).toString(), '[]', '#9'); n++;
  _eq((strList(786)).toString(), '[]', '#10'); n++;
  _eq((strList(3.14)).toString(), '[]', '#11'); n++;
  print('✓ strList: '+n.toString()+' Golden');
}
