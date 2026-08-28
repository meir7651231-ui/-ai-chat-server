import '../dart-data/humanize-terms.dart' as td_humanize;
// בדיקת-Golden · humanize — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'humanize.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((humanize('', term: (k)=>td_humanize.kTerms[k]!)).toString(), 'מסך', '#0'); n++;
  _eq((humanize('abc', term: (k)=>td_humanize.kTerms[k]!)).toString(), 'abc', '#1'); n++;
  _eq((humanize('כהן לוי', term: (k)=>td_humanize.kTerms[k]!)).toString(), 'כהן לוי', '#2'); n++;
  _eq((humanize('2026-08-24', term: (k)=>td_humanize.kTerms[k]!)).toString(), '2026-08-24', '#3'); n++;
  _eq((humanize('0501234567', term: (k)=>td_humanize.kTerms[k]!)).toString(), '0501234567', '#4'); n++;
  _eq((humanize('  x  ', term: (k)=>td_humanize.kTerms[k]!)).toString(), 'x', '#5'); n++;
  print('✓ humanize: '+n.toString()+' Golden');
}
