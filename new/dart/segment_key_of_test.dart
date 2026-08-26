// בדיקת-חוזה · segmentKeyOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/segment_key_of_test.dart
import 'segment_key_of.dart';

String _s({String? uid, String? actorKey}) =>
    segmentKeyOf(uid: uid, actorKey: actorKey, anonymousKey: 'anonymous');

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(_s(uid: 'u1', actorKey: 'a1'), 'u1', '1 uid wins'); n++;
  _eq(_s(uid: null, actorKey: 'a1'), 'a1', '2 actorKey fallback'); n++;
  _eq(_s(uid: '', actorKey: 'a1'), 'a1', '3 empty uid skipped'); n++;
  _eq(_s(uid: null, actorKey: null), 'anonymous', '4 both null'); n++;
  _eq(_s(uid: '', actorKey: ''), 'anonymous', '5 both empty'); n++;
  _eq(_s(uid: 'u1', actorKey: null), 'u1', '6 uid only'); n++;

  assert(_s(uid: 'u1', actorKey: 'a1') == 'u1', 'assert-live guard');
  print('OK segmentKeyOf: $n asserts passed');
}
