// בדיקת-Golden · fmtTime — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'fmt_time.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((fmtTime(DateTime(2026, 8, 24))).toString(), '00:00', '#0'); n++;
  _eq((fmtTime(DateTime(2026, 1, 1, 13, 45))).toString(), '13:45', '#1'); n++;
  print('✓ fmtTime: '+n.toString()+' Golden');
}
