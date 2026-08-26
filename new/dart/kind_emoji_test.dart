// בדיקת-חוזה · kindEmoji — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/kind_emoji_test.dart
import 'kind_emoji.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  _eq(kindEmoji(ConfigOpKind.setText), '✏️', '1'); n++;
  _eq(kindEmoji(ConfigOpKind.setEmoji), '🙂', '2'); n++;
  _eq(kindEmoji(ConfigOpKind.setHidden), '🙈', '3'); n++;
  _eq(kindEmoji(ConfigOpKind.setOrder), '↕️', '4'); n++;
  _eq(kindEmoji(ConfigOpKind.setStyle), '🎨', '5'); n++;
  _eq(kindEmoji(ConfigOpKind.setAction), '⚙️', '6'); n++;

  assert(kindEmoji(ConfigOpKind.setText) == '✏️', 'assert-live guard');
  print('OK kindEmoji: $n asserts passed');
}
