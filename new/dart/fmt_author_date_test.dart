// בדיקת-Golden · fmtAuthorDate — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'fmt_author_date.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((fmtAuthorDate(DateTime(2026, 8, 24))).toString(), '24.08.2026', '#0'); n++;
  _eq((fmtAuthorDate(DateTime(2026, 1, 1, 13, 45))).toString(), '01.01.2026', '#1'); n++;
  print('✓ fmtAuthorDate: '+n.toString()+' Golden');
}
