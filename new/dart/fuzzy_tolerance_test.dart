// בדיקת-Golden · fuzzyTolerance — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'fuzzy_tolerance.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((fuzzyTolerance(0)).toString(), '1', '#0'); n++;
  _eq((fuzzyTolerance(1)).toString(), '1', '#1'); n++;
  _eq((fuzzyTolerance(-3)).toString(), '0', '#2'); n++;
  _eq((fuzzyTolerance(100)).toString(), '34', '#3'); n++;
  _eq((fuzzyTolerance(786)).toString(), '263', '#4'); n++;
  print('✓ fuzzyTolerance: '+n.toString()+' Golden');
}
