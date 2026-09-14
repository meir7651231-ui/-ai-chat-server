// בדיקת-Golden · attendanceDateKey — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'attendance_date_key.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((attendanceDateKey(DateTime(2026, 8, 24))).toString(), '2026-08-24', '#0'); n++;
  _eq((attendanceDateKey(DateTime(2026, 1, 1, 13, 45))).toString(), '2026-01-01', '#1'); n++;
  print('✓ attendanceDateKey: '+n.toString()+' Golden');
}
