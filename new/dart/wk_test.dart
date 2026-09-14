// בדיקת-Golden · wk — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'wk.dart';

// --- מימוש-השקע verbatim מהמקור (לבדיקה בלבד; לא אטום מיובא) ---
final _src_kWorkers = ['רן (עובד)', 'עומר (עובד)'];

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((wk(0, kWorkers: _src_kWorkers)).toString(), 'רן (עובד)', '#0'); n++;
  _eq((wk(1, kWorkers: _src_kWorkers)).toString(), 'עומר (עובד)', '#1'); n++;
  _eq((wk(-3, kWorkers: _src_kWorkers)).toString(), 'רן (עובד)', '#2'); n++;
  _eq((wk(100, kWorkers: _src_kWorkers)).toString(), 'רן (עובד)', '#3'); n++;
  _eq((wk(786, kWorkers: _src_kWorkers)).toString(), 'רן (עובד)', '#4'); n++;
  print('✓ wk: '+n.toString()+' Golden');
}
