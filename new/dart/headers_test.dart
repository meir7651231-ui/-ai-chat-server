// בדיקת-Golden · headers — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'headers.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((headers('')).toString(), '{Content-Type: application/json}', '#0'); n++;
  _eq((headers('abc')).toString(), '{Content-Type: application/json, Authorization: Bearer abc}', '#1'); n++;
  _eq((headers('כהן לוי')).toString(), '{Content-Type: application/json, Authorization: Bearer כהן לוי}', '#2'); n++;
  _eq((headers('2026-08-24')).toString(), '{Content-Type: application/json, Authorization: Bearer 2026-08-24}', '#3'); n++;
  _eq((headers('0501234567')).toString(), '{Content-Type: application/json, Authorization: Bearer 0501234567}', '#4'); n++;
  _eq((headers('  x  ')).toString(), '{Content-Type: application/json, Authorization: Bearer   x  }', '#5'); n++;
  _eq((headers(null)).toString(), '{Content-Type: application/json}', '#6'); n++;
  print('✓ headers: '+n.toString()+' Golden');
}
