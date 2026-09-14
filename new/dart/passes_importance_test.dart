// בדיקת-Golden · passesImportance — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'passes_importance.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((passesImportance(NotifImportance.all, true)).toString(), 'true', '#0'); n++;
  _eq((passesImportance(NotifImportance.critical, false)).toString(), 'false', '#1'); n++;
  _eq((passesImportance(NotifImportance.all, false)).toString(), 'true', '#2'); n++;
  _eq((passesImportance(NotifImportance.critical, true)).toString(), 'true', '#3'); n++;
  print('✓ passesImportance: '+n.toString()+' Golden');
}
