// בדיקת-Golden · cycleDisplayTemp — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'cycle_display_temp.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((cycleDisplayTemp(0)).toString(), '60', '#0'); n++;
  _eq((cycleDisplayTemp(1)).toString(), '60', '#1'); n++;
  _eq((cycleDisplayTemp(-3)).toString(), '60', '#2'); n++;
  _eq((cycleDisplayTemp(100)).toString(), '60', '#3'); n++;
  _eq((cycleDisplayTemp(786)).toString(), '60', '#4'); n++;
  print('✓ cycleDisplayTemp: '+n.toString()+' Golden');
}
