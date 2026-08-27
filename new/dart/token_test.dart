import 'token.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(token(const AttributeValue(labelHe: 'זווית', canonical: '90')), '90', '1');
  n++;
  _eq(token(const AttributeValue(labelHe: 'זווית')), 'זווית', '2');
  n++;
  _eq(token(const AttributeValue(labelHe: 'אדום', canonical: '')), '', '3');
  n++;
  print('✓ token: $n');
}
