import '../dart-data/label-terms.dart' as td_label;
// בדיקת-Golden · label — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'label.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((label('', term: (k)=>td_label.kTerms[k]!)).toString(), 'כללי', '#0'); n++;
  _eq((label('abc', term: (k)=>td_label.kTerms[k]!)).toString(), 'abc', '#1'); n++;
  _eq((label('כהן לוי', term: (k)=>td_label.kTerms[k]!)).toString(), 'כהן לוי', '#2'); n++;
  _eq((label('2026-08-24', term: (k)=>td_label.kTerms[k]!)).toString(), '2026-08-24', '#3'); n++;
  _eq((label('0501234567', term: (k)=>td_label.kTerms[k]!)).toString(), '0501234567', '#4'); n++;
  _eq((label('  x  ', term: (k)=>td_label.kTerms[k]!)).toString(), '  x  ', '#5'); n++;
  print('✓ label: '+n.toString()+' Golden');
}
