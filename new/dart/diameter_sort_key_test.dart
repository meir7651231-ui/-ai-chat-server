// בדיקת-Golden · diameterSortKey — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'diameter_sort_key.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((diameterSortKey('')).toString(), '9999.0', '#0'); n++;
  _eq((diameterSortKey('abc')).toString(), '9999.0', '#1'); n++;
  _eq((diameterSortKey('כהן לוי')).toString(), '9999.0', '#2'); n++;
  _eq((diameterSortKey('2026-08-24')).toString(), '2026.0', '#3'); n++;
  _eq((diameterSortKey('0501234567')).toString(), '501234567.0', '#4'); n++;
  _eq((diameterSortKey('  x  ')).toString(), '9999.0', '#5'); n++;
  print('✓ diameterSortKey: '+n.toString()+' Golden');
}
