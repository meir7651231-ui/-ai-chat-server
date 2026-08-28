// בדיקת-חוזה · enqueue — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/enqueue_test.dart
// רתמת-השרשור בבדיקה משחזרת verbatim את סמנטיקת `_serialized` מהמקור
// (offline_order_queue.dart:175-184) — כדי להוכיח שהאטום, מחווט למסדר-המקור,
// מתנהג זהה-ביט: FIFO, עצלנות, חלחול-שגיאה, שרשרת-שורדת.
import 'dart:async';

import 'enqueue.dart';

void _must(bool cond, String label) {
  if (!cond) throw StateError('FAIL [$label]');
}

Future<void> main() async {
  var n = 0;

  // רתמה נאמנת-מקור (‏:175-184): שרשרת ש-run רוכב עליה; העתק-בולע שומר אותה חיה.
  Future<void> chain = Future<void>.value();
  Future<void> serialized(Future<void> Function() op) {
    final run = chain.then((_) => op());
    chain = run.then((_) {}).catchError((Object _) {});
    return run;
  }

  // 1 · הכוונה מגיעה כמות-שהיא (identity) לשקע enqueueNow.
  final intent = <String, Object>{'who': 'קבלן', 'sum': 445};
  Object? seen;
  await enqueue<Map<String, Object>>(intent,
      serialized: serialized, enqueueNow: (i) async => seen = i);
  _must(identical(seen, intent), '1 intent identity');
  n++;

  // 2 · עצלנות: מסדר שלא מריץ את op ⇒ enqueueNow לא נקרא (המקור עוטף ב-closure,
  //     ‏:227 — הפעולה שייכת למסדר, לא לאטום).
  var called = false;
  final parked = Completer<void>();
  unawaited(enqueue<int>(7,
      serialized: (_) => parked.future, enqueueNow: (i) async => called = true));
  await Future<void>.delayed(Duration.zero);
  _must(called == false, '2 lazy — op deferred to the serializer');
  n++;

  // 3 · FIFO דרך שרשרת-המקור: איטי-לפני-מהיר ⇒ סדר-קריאה == סדר-ריצה (‏:177 "FIFO").
  final order = <String>[];
  final f1 = enqueue<String>('slow', serialized: serialized,
      enqueueNow: (i) async {
    await Future<void>.delayed(const Duration(milliseconds: 20));
    order.add(i);
  });
  final f2 = enqueue<String>('fast',
      serialized: serialized, enqueueNow: (i) async => order.add(i));
  await Future.wait([f1, f2]);
  _must(order.join(',') == 'slow,fast', '3 FIFO — enqueue order == run order');
  n++;

  // 4a · הפלט = ה-future של המסדר עצמו: שגיאת-op מחלחלת למחזיר (‏:179+183 —
  //      ‏catchError חל רק על עותק-השרשרת, לא על run המוחזר).
  var threw = false;
  try {
    await enqueue<String>('boom', serialized: serialized,
        enqueueNow: (_) async => throw StateError('x'));
  } on StateError {
    threw = true;
  }
  _must(threw, '4a error propagates on the returned future');
  n++;

  // 4b · השרשרת שורדת את השגיאה — פעולה הבאה עדיין רצה (‏:181-183 belt-and-braces).
  var alive = false;
  await enqueue<String>('after',
      serialized: serialized, enqueueNow: (_) async => alive = true);
  _must(alive, '4b chain survives a thrown op');
  n++;

  assert(order.length == 2, 'assert-live guard');
  print('OK enqueue: $n asserts passed (שקעי-מסדר · FIFO זהה-מקור)');
}
