// בדיקת-Golden · is45 — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'is45.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((is45('')).toString(), 'false', '#0'); n++;
  _eq((is45('abc')).toString(), 'false', '#1'); n++;
  _eq((is45('כהן לוי')).toString(), 'false', '#2'); n++;
  _eq((is45('2026-08-24')).toString(), 'false', '#3'); n++;
  _eq((is45('0501234567')).toString(), 'true', '#4'); n++;
  _eq((is45('  x  ')).toString(), 'false', '#5'); n++;
  print('✓ is45: '+n.toString()+' Golden');
}
