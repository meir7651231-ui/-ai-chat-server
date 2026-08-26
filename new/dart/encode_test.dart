// בדיקת-חוזה · encode — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/encode_test.dart
import 'encode.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

// ישות-record סינתטית (במקור OfflineOrderIntent).
typedef _Intent = ({int id, String? note});

void main() {
  var n = 0;

  _eq(encode<_Intent>(const [], toJson: (i) => {'id': i.id}), '[]', '1 empty'); n++;

  _eq(
    encode<_Intent>([(id: 1, note: null)], toJson: (i) => {'id': i.id}),
    '[{"id":1}]',
    '2 single',
  ); n++;

  _eq(
    encode<_Intent>(
      [(id: 1, note: null), (id: 2, note: null)],
      toJson: (i) => {'id': i.id},
    ),
    '[{"id":1},{"id":2}]',
    '3 order preserved',
  ); n++;

  _eq(
    encode<_Intent>(
      [(id: 7, note: 'x')],
      toJson: (i) => {'a': i.note, 'b': true},
    ),
    '[{"a":"x","b":true}]',
    '4 mixed types',
  ); n++;

  assert(encode<_Intent>(const [], toJson: (i) => {}) == '[]',
      'assert-live guard');

  print('OK encode: $n asserts passed');
}
