import 'op_tag.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(opTag(SetText()), 'setText', '1');
  n++;
  _eq(opTag(SetOrder()), 'setOrder', '2');
  n++;
  _eq(opTag(SetAction()), 'setAction', '3');
  n++;
  _eq(opTag(SetEmoji()), 'setEmoji', '4');
  n++;
  print('✓ opTag: $n');
}
