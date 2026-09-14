// בדיקת-Golden · fmtJournalDate — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'fmt_journal_date.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((fmtJournalDate(DateTime(2026, 8, 24))).toString(), '24.8', '#0'); n++;
  _eq((fmtJournalDate(DateTime(2026, 1, 1, 13, 45))).toString(), '1.1', '#1'); n++;
  print('✓ fmtJournalDate: '+n.toString()+' Golden');
}
