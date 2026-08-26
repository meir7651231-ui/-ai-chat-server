// בדיקת-חוזה golden · actionIdsFor — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/action_ids_for_test.dart
import 'action_ids_for.dart';

void main() {
  var n = 0;
  // descriptor קיים ⇒ עותק חדש של הפעולות
  final r1 = actionIdsFor('btn', allowedActionsOf: (id) =>
      id == 'btn' ? ['tap', 'longPress'] : null);
  if (r1.length != 2 || !r1.contains('tap') || !r1.contains('longPress')) {
    throw StateError('FAIL 1: $r1');
  }
  n++;
  // אין descriptor (null) ⇒ קבוצה-ריקה
  final r2 = actionIdsFor('missing', allowedActionsOf: (id) => null);
  if (r2.isNotEmpty) throw StateError('FAIL 2: $r2');
  n++;
  // רשימת-פעולות ריקה ⇒ קבוצה-ריקה (לא null)
  final r3 = actionIdsFor('x', allowedActionsOf: (id) => const <String>[]);
  if (r3.isNotEmpty) throw StateError('FAIL 3: $r3');
  n++;
  // עותק — שינוי המקור לא משפיע (Set.of)
  final src = ['a'];
  final r4 = actionIdsFor('x', allowedActionsOf: (id) => src);
  src.add('b');
  if (r4.length != 1) throw StateError('FAIL 4 copy: $r4');
  n++;
  // כפילויות בקלט ⇒ קבוצה מנטרלת
  final r5 = actionIdsFor('x', allowedActionsOf: (id) => ['a', 'a', 'b']);
  if (r5.length != 2) throw StateError('FAIL 5 dedup: $r5');
  n++;
  assert(actionIdsFor('x', allowedActionsOf: (_) => ['z']).contains('z'), 'assert-live');
  print('OK actionIdsFor: $n asserts passed');
}
