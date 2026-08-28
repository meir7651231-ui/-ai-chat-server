import '../dart-data/method_he-terms.dart' as td_method_he;
// בדיקת-Golden · methodHe — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'method_he.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((methodHe('', term: (k)=>td_method_he.kTerms[k]!)).toString(), '', '#0'); n++;
  _eq((methodHe('abc', term: (k)=>td_method_he.kTerms[k]!)).toString(), 'abc', '#1'); n++;
  _eq((methodHe('כהן לוי', term: (k)=>td_method_he.kTerms[k]!)).toString(), 'כהן לוי', '#2'); n++;
  _eq((methodHe('2026-08-24', term: (k)=>td_method_he.kTerms[k]!)).toString(), '2026-08-24', '#3'); n++;
  _eq((methodHe('0501234567', term: (k)=>td_method_he.kTerms[k]!)).toString(), '0501234567', '#4'); n++;
  _eq((methodHe('  x  ', term: (k)=>td_method_he.kTerms[k]!)).toString(), '  x  ', '#5'); n++;
  print('✓ methodHe: '+n.toString()+' Golden');
}
