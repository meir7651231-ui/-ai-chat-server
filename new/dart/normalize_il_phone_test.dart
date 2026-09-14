// בדיקת-Golden · normalizeIlPhone — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'normalize_il_phone.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((normalizeIlPhone('')).toString(), 'null', '#0'); n++;
  _eq((normalizeIlPhone('abc')).toString(), 'null', '#1'); n++;
  _eq((normalizeIlPhone('כהן לוי')).toString(), 'null', '#2'); n++;
  _eq((normalizeIlPhone('2026-08-24')).toString(), 'null', '#3'); n++;
  _eq((normalizeIlPhone('0501234567')).toString(), '+972501234567', '#4'); n++;
  _eq((normalizeIlPhone('  x  ')).toString(), 'null', '#5'); n++;
  print('✓ normalizeIlPhone: '+n.toString()+' Golden');
}
