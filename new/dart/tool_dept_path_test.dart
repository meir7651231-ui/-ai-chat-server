// בדיקת-Golden · toolDeptPath — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'tool_dept_path.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((toolDeptPath('🧰', const <String>[])).toString(), '[Instance of \'CatalogNode\']', '#0'); n++;
  _eq((toolDeptPath('', const <String>['a','a'])).toString(), '[Instance of \'CatalogNode\']', '#1'); n++;
  _eq((toolDeptPath('abc', const <String>['a','a'])).toString(), '[Instance of \'CatalogNode\']', '#2'); n++;
  _eq((toolDeptPath('כהן לוי', const <String>['a','a'])).toString(), '[Instance of \'CatalogNode\']', '#3'); n++;
  _eq((toolDeptPath('2026-08-24', const <String>['a','a'])).toString(), '[Instance of \'CatalogNode\']', '#4'); n++;
  _eq((toolDeptPath('0501234567', const <String>['a','a'])).toString(), '[Instance of \'CatalogNode\']', '#5'); n++;
  _eq((toolDeptPath('  x  ', const <String>['a','a'])).toString(), '[Instance of \'CatalogNode\']', '#6'); n++;
  _eq((toolDeptPath('🧰', const <String>['a','a'])).toString(), '[Instance of \'CatalogNode\']', '#7'); n++;
  _eq((toolDeptPath('', const <String>[])).toString(), '[Instance of \'CatalogNode\']', '#8'); n++;
  _eq((toolDeptPath('abc', const <String>[])).toString(), '[Instance of \'CatalogNode\']', '#9'); n++;
  _eq((toolDeptPath('כהן לוי', const <String>[])).toString(), '[Instance of \'CatalogNode\']', '#10'); n++;
  _eq((toolDeptPath('2026-08-24', const <String>[])).toString(), '[Instance of \'CatalogNode\']', '#11'); n++;
  print('✓ toolDeptPath: '+n.toString()+' Golden');
}
