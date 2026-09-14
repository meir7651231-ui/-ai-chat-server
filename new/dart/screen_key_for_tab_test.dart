// בדיקת-Golden · screenKeyForTab — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'screen_key_for_tab.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((screenKeyForTab(0)).toString(), 'home', '#0'); n++;
  _eq((screenKeyForTab(1)).toString(), 'departments', '#1'); n++;
  _eq((screenKeyForTab(-3)).toString(), 'tab_-3', '#2'); n++;
  _eq((screenKeyForTab(100)).toString(), 'tab_100', '#3'); n++;
  _eq((screenKeyForTab(786)).toString(), 'tab_786', '#4'); n++;
  print('✓ screenKeyForTab: '+n.toString()+' Golden');
}
