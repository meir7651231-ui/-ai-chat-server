// בדיקת-Golden · pp — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'pp.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((pp(0, '')).toString(), 'ppr_p0_.jpg', '#0'); n++;
  _eq((pp(0, 'abc')).toString(), 'ppr_p0_abc.jpg', '#1'); n++;
  _eq((pp(0, 'כהן לוי')).toString(), 'ppr_p0_כהן לוי.jpg', '#2'); n++;
  _eq((pp(0, '2026-08-24')).toString(), 'ppr_p0_2026-08-24.jpg', '#3'); n++;
  _eq((pp(0, '0501234567')).toString(), 'ppr_p0_0501234567.jpg', '#4'); n++;
  _eq((pp(0, '  x  ')).toString(), 'ppr_p0_  x  .jpg', '#5'); n++;
  _eq((pp(1, '')).toString(), 'ppr_p1_.jpg', '#6'); n++;
  _eq((pp(1, 'abc')).toString(), 'ppr_p1_abc.jpg', '#7'); n++;
  _eq((pp(1, 'כהן לוי')).toString(), 'ppr_p1_כהן לוי.jpg', '#8'); n++;
  _eq((pp(1, '2026-08-24')).toString(), 'ppr_p1_2026-08-24.jpg', '#9'); n++;
  _eq((pp(1, '0501234567')).toString(), 'ppr_p1_0501234567.jpg', '#10'); n++;
  _eq((pp(1, '  x  ')).toString(), 'ppr_p1_  x  .jpg', '#11'); n++;
  print('✓ pp: '+n.toString()+' Golden');
}
