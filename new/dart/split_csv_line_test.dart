// בדיקת-Golden · splitCsvLine — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'split_csv_line.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((splitCsvLine('')).toString(), '[]', '#0'); n++;
  _eq((splitCsvLine('abc')).toString(), '[abc]', '#1'); n++;
  _eq((splitCsvLine('כהן לוי')).toString(), '[כהן לוי]', '#2'); n++;
  _eq((splitCsvLine('2026-08-24')).toString(), '[2026-08-24]', '#3'); n++;
  _eq((splitCsvLine('0501234567')).toString(), '[0501234567]', '#4'); n++;
  _eq((splitCsvLine('  x  ')).toString(), '[  x  ]', '#5'); n++;
  print('✓ splitCsvLine: '+n.toString()+' Golden');
}
