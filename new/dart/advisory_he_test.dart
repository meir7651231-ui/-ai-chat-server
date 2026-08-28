import '../dart-data/advisory_he-terms.dart' as td_advisory_he;
// בדיקת-Golden · advisoryHe — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'advisory_he.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((advisoryHe(0, term: (k)=>td_advisory_he.kTerms[k]!)).toString(), 'כרגע 0 הזמנות תואמות', '#0'); n++;
  _eq((advisoryHe(1, term: (k)=>td_advisory_he.kTerms[k]!)).toString(), 'כרגע 1 הזמנות תואמות', '#1'); n++;
  _eq((advisoryHe(-3, term: (k)=>td_advisory_he.kTerms[k]!)).toString(), 'כרגע -3 הזמנות תואמות', '#2'); n++;
  _eq((advisoryHe(100, term: (k)=>td_advisory_he.kTerms[k]!)).toString(), 'כרגע 100 הזמנות תואמות', '#3'); n++;
  _eq((advisoryHe(786, term: (k)=>td_advisory_he.kTerms[k]!)).toString(), 'כרגע 786 הזמנות תואמות', '#4'); n++;
  print('✓ advisoryHe: '+n.toString()+' Golden');
}
