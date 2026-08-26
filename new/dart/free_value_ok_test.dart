// בדיקת-חוזה · freeValueOk — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/free_value_ok_test.dart
import 'free_value_ok.dart';

void _eqb(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  // מעקב short-circuit: מונה קריאות-שכן מוודא שלא-נקראים כשלא-צפוי.
  var avCalls = 0, mvCalls = 0;
  Iterable<String> av(String t, String p, List<String> ret) {
    avCalls++;
    return ret;
  }

  // 1 — value null ⇒ true, אף שקע לא נקרא.
  avCalls = 0;
  mvCalls = 0;
  _eqb(
    freeValueOk('t', 'color', null,
        allowedValues: (t, p) => av(t, p, ['red']),
        matchValue: (t, p, v) {
      mvCalls++;
      return null;
    }),
    true,
    '1 null',
  );
  if (avCalls != 0 || mvCalls != 0) throw StateError('FAIL 1: sockets called');
  n++;

  // 2 — אוסף ריק ⇒ true, matchValue לא נקרא.
  mvCalls = 0;
  _eqb(
    freeValueOk('t', 'color', 'x',
        allowedValues: (t, p) => const <String>[],
        matchValue: (t, p, v) {
      mvCalls++;
      return null;
    }),
    true,
    '2 empty set free',
  );
  if (mvCalls != 0) throw StateError('FAIL 2: matchValue called');
  n++;

  // 3 — נפתר.
  _eqb(
    freeValueOk('t', 'color', 'red',
        allowedValues: (t, p) => const ['red', 'blue'],
        matchValue: (t, p, v) => v == 'red' ? 'red' : null),
    true,
    '3 resolved',
  );
  n++;

  // 4 — לא-נפתר (המצאה).
  _eqb(
    freeValueOk('t', 'color', 'pink',
        allowedValues: (t, p) => const ['red', 'blue'],
        matchValue: (t, p, v) => v == 'red' ? 'red' : null),
    false,
    '4 invented',
  );
  n++;

  // 5 — null גובר גם כשיש אוסף.
  _eqb(
    freeValueOk('t', 'color', null,
        allowedValues: (t, p) => const ['red'],
        matchValue: (t, p, v) => null),
    true,
    '5 null over set',
  );
  n++;

  assert(
    freeValueOk('t', 'c', null,
            allowedValues: (t, p) => const [], matchValue: (t, p, v) => null) ==
        true,
    'assert-live guard',
  );

  print('OK freeValueOk: $n asserts passed');
}
