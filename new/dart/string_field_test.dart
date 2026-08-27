// בדיקת-Golden · stringField — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'string_field.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((stringField('')).toString(), '', '#0'); n++;
  _eq((stringField('abc')).toString(), 'abc', '#1'); n++;
  _eq((stringField('כהן לוי')).toString(), 'כהן לוי', '#2'); n++;
  _eq((stringField('2026-08-24')).toString(), '2026-08-24', '#3'); n++;
  _eq((stringField('0501234567')).toString(), '0501234567', '#4'); n++;
  _eq((stringField('  x  ')).toString(), '  x  ', '#5'); n++;
  _eq((stringField(0)).toString(), '', '#6'); n++;
  _eq((stringField(1)).toString(), '', '#7'); n++;
  _eq((stringField(-3)).toString(), '', '#8'); n++;
  _eq((stringField(100)).toString(), '', '#9'); n++;
  _eq((stringField(786)).toString(), '', '#10'); n++;
  _eq((stringField(3.14)).toString(), '', '#11'); n++;
  print('✓ stringField: '+n.toString()+' Golden');
}
