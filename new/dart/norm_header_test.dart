// בדיקת-Golden · normHeader — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'norm_header.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((normHeader('', kCsvBom: '﻿')).toString(), '', '#0'); n++;
  _eq((normHeader('abc', kCsvBom: '﻿')).toString(), 'abc', '#1'); n++;
  _eq((normHeader('כהן לוי', kCsvBom: '﻿')).toString(), 'כהן לוי', '#2'); n++;
  _eq((normHeader('2026-08-24', kCsvBom: '﻿')).toString(), '2026-08-24', '#3'); n++;
  _eq((normHeader('0501234567', kCsvBom: '﻿')).toString(), '0501234567', '#4'); n++;
  _eq((normHeader('  x  ', kCsvBom: '﻿')).toString(), 'x', '#5'); n++;
  print('✓ normHeader: '+n.toString()+' Golden');
}
