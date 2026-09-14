// בדיקת-Golden · fmtDayMonth — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'fmt_day_month.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((fmtDayMonth(DateTime(2026, 8, 24))).toString(), '24.08', '#0'); n++;
  _eq((fmtDayMonth(DateTime(2026, 1, 1, 13, 45))).toString(), '01.01', '#1'); n++;
  print('✓ fmtDayMonth: '+n.toString()+' Golden');
}
