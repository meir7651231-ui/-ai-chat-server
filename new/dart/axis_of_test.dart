// בדיקת-חוזה golden · axisOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/axis_of_test.dart
import 'axis_of.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  _eq(axisOf(const SetText()), 'text', '1'); n++;
  _eq(axisOf(const SetEmoji()), 'emoji', '2'); n++;
  _eq(axisOf(const SetHidden()), 'hidden', '3'); n++;
  _eq(axisOf(const SetOrder()), 'order', '4'); n++;
  _eq(axisOf(const SetStyle()), 'style', '5'); n++;
  _eq(axisOf(const SetAction()), 'action', '6'); n++;
  assert(axisOf(const SetStyle()) == 'style', 'assert-live');
  print('OK axisOf: $n asserts passed');
}
