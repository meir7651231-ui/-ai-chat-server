// בדיקת-Golden · elementShown — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'element_shown.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((elementShown(const OrgConfig(), '')).toString(), 'true', '#0'); n++;
  _eq((elementShown(const OrgConfig(), 'abc')).toString(), 'true', '#1'); n++;
  _eq((elementShown(const OrgConfig(), 'כהן לוי')).toString(), 'true', '#2'); n++;
  _eq((elementShown(const OrgConfig(), '2026-08-24')).toString(), 'true', '#3'); n++;
  _eq((elementShown(const OrgConfig(), '0501234567')).toString(), 'true', '#4'); n++;
  _eq((elementShown(const OrgConfig(), '  x  ')).toString(), 'true', '#5'); n++;
  print('✓ elementShown: '+n.toString()+' Golden');
}
