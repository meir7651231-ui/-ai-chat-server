// בדיקת-Golden · focusIndex — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'focus_index.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((focusIndex(0)).toString(), '0', '#0'); n++;
  _eq((focusIndex(1)).toString(), '0', '#1'); n++;
  _eq((focusIndex(-3)).toString(), '0', '#2'); n++;
  _eq((focusIndex(100)).toString(), '7', '#3'); n++;
  _eq((focusIndex(786)).toString(), '8', '#4'); n++;
  _eq((focusIndex(3.14)).toString(), '0', '#5'); n++;
  _eq((focusIndex(0.5)).toString(), '0', '#6'); n++;
  print('✓ focusIndex: '+n.toString()+' Golden');
}
