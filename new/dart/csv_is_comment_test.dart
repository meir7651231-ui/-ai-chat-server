import 'csv_is_comment.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(csvIsComment(['# legend', 'a']), true, '1');
  n++;
  _eq(csvIsComment(['  # spaced', 'a']), true, '2');
  n++;
  _eq(csvIsComment(['name', 'qty']), false, '3');
  n++;
  _eq(csvIsComment(<String>[]), false, '4');
  n++;
  print('✓ csvIsComment: $n');
}
