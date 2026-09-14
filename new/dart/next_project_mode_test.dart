// בדיקת-Golden · nextProjectMode — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'next_project_mode.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((nextProjectMode(ProjectMode.any)).toString(), 'ProjectMode.cold', '#0'); n++;
  _eq((nextProjectMode(ProjectMode.commercial)).toString(), 'ProjectMode.any', '#1'); n++;
  _eq((nextProjectMode(ProjectMode.hot)).toString(), 'ProjectMode.commercial', '#2'); n++;
  print('✓ nextProjectMode: '+n.toString()+' Golden');
}
