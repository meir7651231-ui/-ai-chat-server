import '../dart-data/toks-terms.dart' as td_toks;
// בדיקת-Golden · toks — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'toks.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((toks('', term: (k)=>td_toks.kTerms[k]!)).toString(), '[]', '#0'); n++;
  _eq((toks('abc', term: (k)=>td_toks.kTerms[k]!)).toString(), '[abc]', '#1'); n++;
  _eq((toks('כהן לוי', term: (k)=>td_toks.kTerms[k]!)).toString(), '[כהן, לוי]', '#2'); n++;
  _eq((toks('2026-08-24', term: (k)=>td_toks.kTerms[k]!)).toString(), '[]', '#3'); n++;
  _eq((toks('0501234567', term: (k)=>td_toks.kTerms[k]!)).toString(), '[]', '#4'); n++;
  _eq((toks('  x  ', term: (k)=>td_toks.kTerms[k]!)).toString(), '[]', '#5'); n++;
  print('✓ toks: '+n.toString()+' Golden');
}
