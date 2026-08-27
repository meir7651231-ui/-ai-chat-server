// בדיקת-Golden · basename — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'basename.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((basename('')).toString(), '', '#0'); n++;
  _eq((basename('abc')).toString(), 'abc', '#1'); n++;
  _eq((basename('כהן לוי')).toString(), 'כהן לוי', '#2'); n++;
  _eq((basename('2026-08-24')).toString(), '2026-08-24', '#3'); n++;
  _eq((basename('0501234567')).toString(), '0501234567', '#4'); n++;
  _eq((basename('  x  ')).toString(), '  x  ', '#5'); n++;
  _eq((basename(null)).toString(), 'null', '#6'); n++;
  print('✓ basename: '+n.toString()+' Golden');
}
