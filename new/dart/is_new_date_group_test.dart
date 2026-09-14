// בדיקת-Golden · isNewDateGroup — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'is_new_date_group.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((isNewDateGroup('', '')).toString(), 'false', '#0'); n++;
  _eq((isNewDateGroup('', 'abc')).toString(), 'true', '#1'); n++;
  _eq((isNewDateGroup('', 'כהן לוי')).toString(), 'true', '#2'); n++;
  _eq((isNewDateGroup('', '2026-08-24')).toString(), 'true', '#3'); n++;
  _eq((isNewDateGroup('', '0501234567')).toString(), 'true', '#4'); n++;
  _eq((isNewDateGroup('', '  x  ')).toString(), 'true', '#5'); n++;
  _eq((isNewDateGroup('abc', '')).toString(), 'true', '#6'); n++;
  _eq((isNewDateGroup('abc', 'abc')).toString(), 'false', '#7'); n++;
  _eq((isNewDateGroup('abc', 'כהן לוי')).toString(), 'true', '#8'); n++;
  _eq((isNewDateGroup('abc', '2026-08-24')).toString(), 'true', '#9'); n++;
  _eq((isNewDateGroup('abc', '0501234567')).toString(), 'true', '#10'); n++;
  _eq((isNewDateGroup('abc', '  x  ')).toString(), 'true', '#11'); n++;
  print('✓ isNewDateGroup: '+n.toString()+' Golden');
}
