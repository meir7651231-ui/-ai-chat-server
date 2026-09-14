// בדיקת-Golden · slug — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'slug.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((slug('')).toString(), '', '#0'); n++;
  _eq((slug('abc')).toString(), 'abc', '#1'); n++;
  _eq((slug('כהן לוי')).toString(), 'כהן-לוי', '#2'); n++;
  _eq((slug('2026-08-24')).toString(), '2026-08-24', '#3'); n++;
  _eq((slug('0501234567')).toString(), '0501234567', '#4'); n++;
  _eq((slug('  x  ')).toString(), 'x', '#5'); n++;
  print('✓ slug: '+n.toString()+' Golden');
}
