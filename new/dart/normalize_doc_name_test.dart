// בדיקת-Golden · normalizeDocName — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'normalize_doc_name.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((normalizeDocName('')).toString(), '', '#0'); n++;
  _eq((normalizeDocName('abc')).toString(), 'abc', '#1'); n++;
  _eq((normalizeDocName('כהן לוי')).toString(), 'כהן לוי', '#2'); n++;
  _eq((normalizeDocName('2026-08-24')).toString(), '2026-08-24', '#3'); n++;
  _eq((normalizeDocName('0501234567')).toString(), '0501234567', '#4'); n++;
  _eq((normalizeDocName('  x  ')).toString(), 'x', '#5'); n++;
  print('✓ normalizeDocName: '+n.toString()+' Golden');
}
