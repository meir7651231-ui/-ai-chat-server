import 'default_value.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  const withZero = AttributeDef(values: [
    AttributeValue(labelHe: 'a', sortIndex: 2),
    AttributeValue(labelHe: 'b', sortIndex: 0),
    AttributeValue(labelHe: 'c', sortIndex: 1),
  ]);
  _eq(defaultValue(withZero).labelHe, 'b', '1');
  n++;
  const noZero = AttributeDef(values: [
    AttributeValue(labelHe: 'x', sortIndex: 5),
    AttributeValue(labelHe: 'y', sortIndex: 3),
  ]);
  _eq(defaultValue(noZero).labelHe, 'x', '2');
  n++;
  print('✓ defaultValue: $n');
}
