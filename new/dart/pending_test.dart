// בדיקת-חוזה · pending — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/pending_test.dart
import 'pending.dart';

Future<void> main() async {
  var n = 0;
  final logs = <String>[];
  void log(String s) => logs.add(s);

  // 1 — מסלול-תקין: raw מועבר as-is ל-decode, הרשימה המוחזרת = אותו-מופע, בלי-לוג
  logs.clear();
  String? seenRaw = 'unset';
  final decoded = <int>[1, 2];
  final r1 = await pending<int>(
    readRaw: () async => '[{"id":1},{"id":2}]',
    decode: (raw) {
      seenRaw = raw;
      return decoded;
    },
    log: log,
  );
  if (!identical(r1, decoded)) throw StateError('FAIL [1 identity]: $r1');
  if (seenRaw != '[{"id":1},{"id":2}]') {
    throw StateError('FAIL [1 raw-passthrough]: $seenRaw');
  }
  if (logs.isNotEmpty) throw StateError('FAIL [1 no-log]: $logs');
  n++;

  // 2 — readRaw מחזיר null ⇒ decode(null) נקרא; תוצאתו מוחזרת; בלי-לוג
  logs.clear();
  var sawNull = false;
  final r2 = await pending<int>(
    readRaw: () async => null,
    decode: (raw) {
      sawNull = raw == null;
      return <int>[];
    },
    log: log,
  );
  if (!sawNull) throw StateError('FAIL [2 null-passthrough]');
  if (r2.isNotEmpty || logs.isNotEmpty) throw StateError('FAIL [2]: $r2 $logs');
  n++;

  // 3 — readRaw זורק סינכרונית ⇒ ריק + לוג-יחיד עם הודעת-המקור וטקסט-השגיאה;
  //     decode לא-נקרא; הרשימה בלתי-ניתנת-לשינוי (במקור const [])
  logs.clear();
  var decodeCalled = false;
  final r3 = await pending<int>(
    readRaw: () => throw StateError('boom-sync'),
    decode: (_) {
      decodeCalled = true;
      return <int>[9];
    },
    log: log,
  );
  if (r3.isNotEmpty) throw StateError('FAIL [3 empty]: $r3');
  if (decodeCalled) throw StateError('FAIL [3 decode-not-called]');
  if (logs.length != 1 ||
      !logs.first.contains('OfflineOrderQueue: pending read failed (empty):') ||
      !logs.first.contains('boom-sync')) {
    throw StateError('FAIL [3 log]: $logs');
  }
  var threw = false;
  try {
    r3.add(7);
  } on UnsupportedError {
    threw = true;
  }
  if (!threw) throw StateError('FAIL [3 unmodifiable]');
  n++;

  // 4 — readRaw נכשל אסינכרונית (Future.error) ⇒ אותו-דין: ריק + לוג-יחיד
  logs.clear();
  final r4 = await pending<int>(
    readRaw: () => Future<String?>.error(StateError('net-down')),
    decode: (_) => <int>[9],
    log: log,
  );
  if (r4.isNotEmpty) throw StateError('FAIL [4 empty]: $r4');
  if (logs.length != 1 || !logs.first.contains('pending read failed (empty)')) {
    throw StateError('FAIL [4 log]: $logs');
  }
  n++;

  // 5 — decode זורק ⇒ נתפס (במקור _decode יושב בתוך אותו try): ריק + לוג-יחיד
  logs.clear();
  final r5 = await pending<int>(
    readRaw: () async => 'x',
    decode: (_) => throw FormatException('bad-decode'),
    log: log,
  );
  if (r5.isNotEmpty) throw StateError('FAIL [5 empty]: $r5');
  if (logs.length != 1 ||
      !logs.first.contains('pending read failed (empty)') ||
      !logs.first.contains('bad-decode')) {
    throw StateError('FAIL [5 log]: $logs');
  }
  n++;

  // 6 — לעולם-לא-זורק: שני-השקעים זורקים ⇒ עדיין חוזר בשקט
  logs.clear();
  final r6 = await pending<String>(
    readRaw: () => throw ArgumentError('everything-broken'),
    decode: (_) => throw StateError('unreachable'),
    log: log,
  );
  if (r6.isNotEmpty || logs.length != 1) throw StateError('FAIL [6]: $logs');
  n++;

  assert(
      (await pending<int>(
        readRaw: () async => null,
        decode: (_) => <int>[42],
        log: (_) {},
      ))
              .first ==
          42,
      'assert-live guard');

  print('OK pending: $n asserts passed');
}
