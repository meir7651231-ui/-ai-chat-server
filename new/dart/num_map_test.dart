// בדיקת-Golden · numMap — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'num_map.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((numMap('')).toString(), '{}', '#0'); n++;
  _eq((numMap('abc')).toString(), '{}', '#1'); n++;
  _eq((numMap('כהן לוי')).toString(), '{}', '#2'); n++;
  _eq((numMap('2026-08-24')).toString(), '{}', '#3'); n++;
  _eq((numMap('0501234567')).toString(), '{}', '#4'); n++;
  _eq((numMap('  x  ')).toString(), '{}', '#5'); n++;
  _eq((numMap(0)).toString(), '{}', '#6'); n++;
  _eq((numMap(1)).toString(), '{}', '#7'); n++;
  _eq((numMap(-3)).toString(), '{}', '#8'); n++;
  _eq((numMap(100)).toString(), '{}', '#9'); n++;
  _eq((numMap(786)).toString(), '{}', '#10'); n++;
  _eq((numMap(3.14)).toString(), '{}', '#11'); n++;
  print('✓ numMap: '+n.toString()+' Golden');
}
