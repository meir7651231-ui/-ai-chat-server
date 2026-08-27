// בדיקת-Golden · cleanSub — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'clean_sub.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((cleanSub('')).toString(), '', '#0'); n++;
  _eq((cleanSub('abc')).toString(), 'abc', '#1'); n++;
  _eq((cleanSub('כהן לוי')).toString(), 'כהן לוי', '#2'); n++;
  _eq((cleanSub('2026-08-24')).toString(), '2026-08-24', '#3'); n++;
  _eq((cleanSub('0501234567')).toString(), '0501234567', '#4'); n++;
  _eq((cleanSub('  x  ')).toString(), '  x  ', '#5'); n++;
  print('✓ cleanSub: '+n.toString()+' Golden');
}
