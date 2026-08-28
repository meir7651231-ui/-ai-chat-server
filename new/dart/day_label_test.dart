import '../dart-data/day_label-terms.dart' as td_day_label;
// בדיקת-Golden · dayLabel — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'day_label.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((dayLabel(0, term: (k)=>td_day_label.kTerms[k]!)).toString(), 'היום', '#0'); n++;
  _eq((dayLabel(1, term: (k)=>td_day_label.kTerms[k]!)).toString(), 'מחר', '#1'); n++;
  _eq((dayLabel(-3, term: (k)=>td_day_label.kTerms[k]!)).toString(), 'בעוד -3 ימים', '#2'); n++;
  _eq((dayLabel(100, term: (k)=>td_day_label.kTerms[k]!)).toString(), 'בעוד 100 ימים', '#3'); n++;
  _eq((dayLabel(786, term: (k)=>td_day_label.kTerms[k]!)).toString(), 'בעוד 786 ימים', '#4'); n++;
  print('✓ dayLabel: '+n.toString()+' Golden');
}
