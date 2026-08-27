import 'fmt_date.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(fmtDate(DateTime(2026, 8, 27)), '27/8/2026', '1'); n++;
  _eq(fmtDate(DateTime(2026, 12, 5)), '5/12/2026', '2'); n++;
  _eq(fmtDate(DateTime(2000, 1, 1)), '1/1/2000', '3'); n++;
  print('✓ fmtDate: $n');
}
