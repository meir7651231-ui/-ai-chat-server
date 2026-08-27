// בדיקת-Golden · strListOrNull — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'str-list-or-null.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((strListOrNull('')).toString(), 'null', '#0'); n++;
  _eq((strListOrNull('abc')).toString(), 'null', '#1'); n++;
  _eq((strListOrNull('כהן לוי')).toString(), 'null', '#2'); n++;
  _eq((strListOrNull('2026-08-24')).toString(), 'null', '#3'); n++;
  _eq((strListOrNull('0501234567')).toString(), 'null', '#4'); n++;
  _eq((strListOrNull('  x  ')).toString(), 'null', '#5'); n++;
  _eq((strListOrNull(0)).toString(), 'null', '#6'); n++;
  _eq((strListOrNull(1)).toString(), 'null', '#7'); n++;
  _eq((strListOrNull(-3)).toString(), 'null', '#8'); n++;
  _eq((strListOrNull(100)).toString(), 'null', '#9'); n++;
  _eq((strListOrNull(786)).toString(), 'null', '#10'); n++;
  _eq((strListOrNull(3.14)).toString(), 'null', '#11'); n++;
  print('✓ strListOrNull: '+n.toString()+' Golden');
}
