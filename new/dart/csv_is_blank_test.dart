// בדיקת-Golden · csvIsBlank — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'csv_is_blank.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((csvIsBlank(const <String>[])).toString(), 'true', '#0'); n++;
  _eq((csvIsBlank(const <String>['a','a'])).toString(), 'false', '#1'); n++;
  print('✓ csvIsBlank: '+n.toString()+' Golden');
}
