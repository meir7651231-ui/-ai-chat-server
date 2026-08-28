// בדיקת-חוזה · drainNow — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/drain_now_test.dart
import 'drain_now.dart';

void main() async {
  var n = 0;

  // רתמה: מונים + יומנים לכל שקע.
  ({
    Future<int> Function() run,
    List<String> placed,
    List<List<String>> persisted,
    List<String> logs,
    int Function() probeCalls,
  }) rig(
    List<String> queue, {
    bool offline = false,
    Set<String> failOn = const {},
    bool loadThrows = false,
    int persistThrowsAt = -1, // אינדקס-קריאת-התמדה שזורק (0-based); -1=לעולם-לא
  }) {
    final placed = <String>[];
    final persisted = <List<String>>[];
    final logs = <String>[];
    var probeCalls = 0;
    var persistCalls = 0;
    Future<int> run() => drainNow<String>(
          loadPending: () async {
            if (loadThrows) throw StateError('prefs down');
            return List<String>.of(queue);
          },
          offlineSuspect: () {
            probeCalls++;
            return offline;
          },
          placeOrder: (intent) {
            if (failOn.contains(intent)) throw StateError('repo rejected $intent');
            placed.add(intent);
          },
          persistRemainder: (remainder) async {
            if (persistCalls++ == persistThrowsAt) throw StateError('disk full');
            persisted.add(List<String>.of(remainder));
          },
          log: logs.add,
        );
    return (
      run: run,
      placed: placed,
      persisted: persisted,
      logs: logs,
      probeCalls: () => probeCalls,
    );
  }

  void eq(Object? got, Object? want, String label) {
    if ('$got' != '$want') throw StateError('FAIL [$label]: got=$got want=$want');
  }

  // 1 · תור ריק ⇒ 0; הפרוב לא נקרא כלל (‏:274 לפני :275 — הריפו לא ננגע).
  final r1 = rig(const []);
  eq(await r1.run(), 0, '1 empty ret');
  eq(r1.probeCalls(), 0, '1 empty probe untouched');
  eq(r1.placed.length + r1.persisted.length + r1.logs.length, 0, '1 empty no-ops');
  n++;

  // 2 · אופליין + תור מלא ⇒ 0, אפס השמות/התמדות (התור נשמר, ‏:275).
  final r2 = rig(const ['a', 'b'], offline: true);
  eq(await r2.run(), 0, '2 offline ret');
  eq(r2.placed, const <String>[], '2 offline no place');
  eq(r2.persisted, const <List<String>>[], '2 offline no persist');
  n++;

  // 3 · הצלחה מלאה: FIFO, שארית-מתכווצת אחרי כל השמה, סוף=[] (‏:277-302).
  final r3 = rig(const ['a', 'b', 'c']);
  eq(await r3.run(), 3, '3 happy ret');
  eq(r3.placed, const ['a', 'b', 'c'], '3 FIFO order');
  eq(r3.persisted, const [['b', 'c'], ['c'], <String>[]], '3 shrinking remainders');
  eq(r3.probeCalls(), 1, '3 probe checked once (not per-iteration)');
  eq(r3.logs, const <String>[], '3 no logs');
  n++;

  // 4 · כשל-השמה ב-b ⇒ break: מוחזר 1, השארית שנשמרה=[b,c] (הכוונה נשמרת, ‏:293-298).
  final r4 = rig(const ['a', 'b', 'c'], failOn: const {'b'});
  eq(await r4.run(), 1, '4 fail ret partial');
  eq(r4.placed, const ['a'], '4 only a placed');
  eq(r4.persisted, const [['b', 'c']], '4 remainder kept b,c');
  eq(r4.logs.length, 1, '4 one log');
  if (!r4.logs.single.startsWith('OfflineOrderQueue: replay failed (kept queued):')) {
    throw StateError('FAIL [4 log text]: ${r4.logs.single}');
  }
  n++;

  // 5 · טעינה זורקת ⇒ 0 + "drain failed" — לא זורק החוצה (rule #1, ‏:305-308).
  final r5 = rig(const ['a'], loadThrows: true);
  eq(await r5.run(), 0, '5 load-throw ret');
  eq(r5.logs.length, 1, '5 one log');
  if (!r5.logs.single.startsWith('OfflineOrderQueue: drain failed (queue intact):')) {
    throw StateError('FAIL [5 log text]: ${r5.logs.single}');
  }
  n++;

  // 6 · התמדה זורקת אחרי ההשמה הראשונה ⇒ מונה חלקי 1 + "drain failed" (‏:305-308).
  final r6 = rig(const ['a', 'b'], persistThrowsAt: 0);
  eq(await r6.run(), 1, '6 persist-throw partial count');
  eq(r6.placed, const ['a'], '6 only a placed');
  eq(r6.logs.length, 1, '6 one log');
  if (!r6.logs.single.startsWith('OfflineOrderQueue: drain failed (queue intact):')) {
    throw StateError('FAIL [6 log text]: ${r6.logs.single}');
  }
  n++;

  // 7 · כשל בכוונה הראשונה ⇒ 0, אפס-התמדות (שום דבר לא הושם — התור שלם).
  final r7 = rig(const ['a', 'b'], failOn: const {'a'});
  eq(await r7.run(), 0, '7 first fails ret 0');
  eq(r7.persisted, const <List<String>>[], '7 no persist at all');
  n++;

  assert((await rig(const []).run()) == 0, 'assert-live guard');

  print('OK drainNow: $n asserts passed (מנוע-ריקון · 5 שקעים מוזרקים)');
}
