// בדיקת-Golden · humanize — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'humanize.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((humanize('')).toString(), 'מסך', '#0'); n++;
  _eq((humanize('abc')).toString(), 'abc', '#1'); n++;
  _eq((humanize('כהן לוי')).toString(), 'כהן לוי', '#2'); n++;
  _eq((humanize('2026-08-24')).toString(), '2026-08-24', '#3'); n++;
  _eq((humanize('0501234567')).toString(), '0501234567', '#4'); n++;
  _eq((humanize('  x  ')).toString(), 'x', '#5'); n++;
  print('✓ humanize: '+n.toString()+' Golden');
}
