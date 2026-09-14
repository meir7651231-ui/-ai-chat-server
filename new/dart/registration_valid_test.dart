// בדיקת-Golden · registrationValid — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'registration_valid.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((registrationValid('', '')).toString(), 'false', '#0'); n++;
  _eq((registrationValid('', 'abc')).toString(), 'false', '#1'); n++;
  _eq((registrationValid('', 'כהן לוי')).toString(), 'false', '#2'); n++;
  _eq((registrationValid('', '2026-08-24')).toString(), 'false', '#3'); n++;
  _eq((registrationValid('', '0501234567')).toString(), 'false', '#4'); n++;
  _eq((registrationValid('', '  x  ')).toString(), 'false', '#5'); n++;
  _eq((registrationValid('abc', '')).toString(), 'false', '#6'); n++;
  _eq((registrationValid('abc', 'abc')).toString(), 'true', '#7'); n++;
  _eq((registrationValid('abc', 'כהן לוי')).toString(), 'true', '#8'); n++;
  _eq((registrationValid('abc', '2026-08-24')).toString(), 'true', '#9'); n++;
  _eq((registrationValid('abc', '0501234567')).toString(), 'true', '#10'); n++;
  _eq((registrationValid('abc', '  x  ')).toString(), 'true', '#11'); n++;
  print('✓ registrationValid: '+n.toString()+' Golden');
}
