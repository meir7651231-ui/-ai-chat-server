// בדיקת-Golden · sizeStructurePattern — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'size_structure_pattern.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((sizeStructurePattern('')).toString(), '0×', '#0'); n++;
  _eq((sizeStructurePattern('abc')).toString(), '1', '#1'); n++;
  _eq((sizeStructurePattern('כהן לוי')).toString(), '1', '#2'); n++;
  _eq((sizeStructurePattern('2026-08-24')).toString(), '1', '#3'); n++;
  _eq((sizeStructurePattern('0501234567')).toString(), '1', '#4'); n++;
  _eq((sizeStructurePattern('  x  ')).toString(), '0×', '#5'); n++;
  print('✓ sizeStructurePattern: '+n.toString()+' Golden');
}
