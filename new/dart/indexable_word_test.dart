// בדיקת-Golden · indexableWord — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'indexable_word.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((indexableWord('', kIndexMinWordLen: 2)).toString(), 'false', '#0'); n++;
  _eq((indexableWord('abc', kIndexMinWordLen: 2)).toString(), 'true', '#1'); n++;
  _eq((indexableWord('כהן לוי', kIndexMinWordLen: 2)).toString(), 'true', '#2'); n++;
  _eq((indexableWord('2026-08-24', kIndexMinWordLen: 2)).toString(), 'true', '#3'); n++;
  _eq((indexableWord('0501234567', kIndexMinWordLen: 2)).toString(), 'true', '#4'); n++;
  _eq((indexableWord('  x  ', kIndexMinWordLen: 2)).toString(), 'true', '#5'); n++;
  print('✓ indexableWord: '+n.toString()+' Golden');
}
