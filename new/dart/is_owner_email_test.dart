// בדיקת-Golden · isOwnerEmail — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'is_owner_email.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((isOwnerEmail('', kOwnerEmails: {'meir7651231@gmail.com'})).toString(), 'false', '#0'); n++;
  _eq((isOwnerEmail('abc', kOwnerEmails: {'meir7651231@gmail.com'})).toString(), 'false', '#1'); n++;
  _eq((isOwnerEmail('כהן לוי', kOwnerEmails: {'meir7651231@gmail.com'})).toString(), 'false', '#2'); n++;
  _eq((isOwnerEmail('2026-08-24', kOwnerEmails: {'meir7651231@gmail.com'})).toString(), 'false', '#3'); n++;
  _eq((isOwnerEmail('0501234567', kOwnerEmails: {'meir7651231@gmail.com'})).toString(), 'false', '#4'); n++;
  _eq((isOwnerEmail('  x  ', kOwnerEmails: {'meir7651231@gmail.com'})).toString(), 'false', '#5'); n++;
  _eq((isOwnerEmail(null, kOwnerEmails: {'meir7651231@gmail.com'})).toString(), 'false', '#6'); n++;
  print('✓ isOwnerEmail: '+n.toString()+' Golden');
}
