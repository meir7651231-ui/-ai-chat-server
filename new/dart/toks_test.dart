// בדיקת-Golden · toks — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'toks.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((toks('')).toString(), '[]', '#0'); n++;
  _eq((toks('abc')).toString(), '[abc]', '#1'); n++;
  _eq((toks('כהן לוי')).toString(), '[כהן, לוי]', '#2'); n++;
  _eq((toks('2026-08-24')).toString(), '[]', '#3'); n++;
  _eq((toks('0501234567')).toString(), '[]', '#4'); n++;
  _eq((toks('  x  ')).toString(), '[]', '#5'); n++;
  print('✓ toks: '+n.toString()+' Golden');
}
