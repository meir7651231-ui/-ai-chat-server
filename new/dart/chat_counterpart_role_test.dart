// בדיקת-Golden · chatCounterpartRole — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'chat_counterpart_role.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((chatCounterpartRole(const <BsRole>[], BsRole.contractor)).toString(), 'null', '#0'); n++;
  _eq((chatCounterpartRole(const <BsRole>[BsRole.contractor,BsRole.bot], BsRole.bot)).toString(), 'BsRole.contractor', '#1'); n++;
  _eq((chatCounterpartRole(const <BsRole>[BsRole.bot], BsRole.worker)).toString(), 'null', '#2'); n++;
  _eq((chatCounterpartRole(const <BsRole>[], BsRole.bot)).toString(), 'null', '#3'); n++;
  _eq((chatCounterpartRole(const <BsRole>[], BsRole.worker)).toString(), 'null', '#4'); n++;
  _eq((chatCounterpartRole(const <BsRole>[BsRole.contractor,BsRole.bot], BsRole.contractor)).toString(), 'null', '#5'); n++;
  _eq((chatCounterpartRole(const <BsRole>[BsRole.contractor,BsRole.bot], BsRole.worker)).toString(), 'BsRole.contractor', '#6'); n++;
  _eq((chatCounterpartRole(const <BsRole>[BsRole.bot], BsRole.contractor)).toString(), 'null', '#7'); n++;
  _eq((chatCounterpartRole(const <BsRole>[BsRole.bot], BsRole.bot)).toString(), 'null', '#8'); n++;
  print('✓ chatCounterpartRole: '+n.toString()+' Golden');
}
