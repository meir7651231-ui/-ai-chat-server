// בדיקת-Golden · nextProfessionMode — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'next_profession_mode.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((nextProfessionMode(ProfessionMode.diy)).toString(), 'ProfessionMode.contractor', '#0'); n++;
  _eq((nextProfessionMode(ProfessionMode.pro)).toString(), 'ProfessionMode.diy', '#1'); n++;
  _eq((nextProfessionMode(ProfessionMode.contractor)).toString(), 'ProfessionMode.pro', '#2'); n++;
  print('✓ nextProfessionMode: '+n.toString()+' Golden');
}
