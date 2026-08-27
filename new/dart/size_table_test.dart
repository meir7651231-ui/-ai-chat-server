// בדיקת-Golden · sizeTable — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'size_table.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((sizeTable('')).toString(), 'null', '#0'); n++;
  _eq((sizeTable('abc')).toString(), 'null', '#1'); n++;
  _eq((sizeTable('כהן לוי')).toString(), 'null', '#2'); n++;
  _eq((sizeTable('2026-08-24')).toString(), 'null', '#3'); n++;
  _eq((sizeTable('0501234567')).toString(), 'null', '#4'); n++;
  _eq((sizeTable('  x  ')).toString(), 'null', '#5'); n++;
  _eq((sizeTable(0)).toString(), 'null', '#6'); n++;
  _eq((sizeTable(1)).toString(), 'null', '#7'); n++;
  _eq((sizeTable(-3)).toString(), 'null', '#8'); n++;
  _eq((sizeTable(100)).toString(), 'null', '#9'); n++;
  _eq((sizeTable(786)).toString(), 'null', '#10'); n++;
  _eq((sizeTable(3.14)).toString(), 'null', '#11'); n++;
  print('✓ sizeTable: '+n.toString()+' Golden');
}
