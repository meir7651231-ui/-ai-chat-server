// בדיקת-Golden · parseCsvRecords — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'parse_csv_records.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((parseCsvRecords('', '')).toString(), '[]', '#0'); n++;
  _eq((parseCsvRecords('', 'abc')).toString(), '[]', '#1'); n++;
  _eq((parseCsvRecords('', 'כהן לוי')).toString(), '[]', '#2'); n++;
  _eq((parseCsvRecords('', '2026-08-24')).toString(), '[]', '#3'); n++;
  _eq((parseCsvRecords('', '0501234567')).toString(), '[]', '#4'); n++;
  _eq((parseCsvRecords('', '  x  ')).toString(), '[]', '#5'); n++;
  _eq((parseCsvRecords('abc', '')).toString(), '[Instance of \'CsvRecord\']', '#6'); n++;
  _eq((parseCsvRecords('abc', 'abc')).toString(), '[Instance of \'CsvRecord\']', '#7'); n++;
  _eq((parseCsvRecords('abc', 'כהן לוי')).toString(), '[Instance of \'CsvRecord\']', '#8'); n++;
  _eq((parseCsvRecords('abc', '2026-08-24')).toString(), '[Instance of \'CsvRecord\']', '#9'); n++;
  _eq((parseCsvRecords('abc', '0501234567')).toString(), '[Instance of \'CsvRecord\']', '#10'); n++;
  _eq((parseCsvRecords('abc', '  x  ')).toString(), '[Instance of \'CsvRecord\']', '#11'); n++;
  print('✓ parseCsvRecords: '+n.toString()+' Golden');
}
