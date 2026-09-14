// בדיקת-Golden · fmtDateKey — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'fmt_date_key.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((fmtDateKey('')).toString(), '', '#0'); n++;
  _eq((fmtDateKey('abc')).toString(), 'abc', '#1'); n++;
  _eq((fmtDateKey('כהן לוי')).toString(), 'כהן לוי', '#2'); n++;
  _eq((fmtDateKey('2026-08-24')).toString(), '24.8', '#3'); n++;
  _eq((fmtDateKey('0501234567')).toString(), '0501234567', '#4'); n++;
  _eq((fmtDateKey('  x  ')).toString(), '  x  ', '#5'); n++;
  print('✓ fmtDateKey: '+n.toString()+' Golden');
}
