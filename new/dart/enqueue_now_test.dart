// בדיקת-חוזה · enqueueNow — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/enqueue_now_test.dart
import 'enqueue_now.dart';

/// מזהה-פריפס מזויף — האטום רק משחיל אותו בין השקעים (גנרי <P>).
class _FakePrefs {
  String? stored;
}

Future<void> main() async {
  var n = 0;
  const k = 'bs.offline-orders.v1';
  // קודק-בדיקה פשוט: רשימה מופרדת-פסיקים ('' ⇒ ריק; null ⇒ ריק — כמו _decode הסובלני).
  List<String> dec(String? raw) =>
      (raw == null || raw.isEmpty) ? <String>[] : raw.split(',');
  String enc(List<String> xs) => xs.join(',');

  // 1 · store ריק (getString ⇒ null): decode(null) ⇒ [] ⇒ נכתב encode(['a']); אפס log.
  {
    final p = _FakePrefs();
    final logs = <String>[];
    String? rawSeen = 'sentinel';
    await enqueueNow<String, _FakePrefs>('a',
        getInstance: () async => p,
        getString: (pr, key) {
          rawSeen = pr.stored;
          return pr.stored;
        },
        setString: (pr, key, v) async => pr.stored = v,
        decode: dec,
        encode: enc,
        key: k,
        log: logs.add);
    assert(rawSeen == null, '1: decode מקבל את הגולמי כמות-שהוא (null)');
    assert(p.stored == 'a', '1: store ריק ⇒ נכתב "a", got ${p.stored}');
    assert(logs.isEmpty, '1: הצלחה ⇒ אפס log');
    n += 3;
  }

  // 2 · צירוף-לסוף (FIFO, מקור :232 ..add): 'a,b' + 'c' ⇒ 'a,b,c'; key זהה בקריאה ובכתיבה.
  {
    final p = _FakePrefs()..stored = 'a,b';
    final keysSeen = <String>[];
    var writes = 0;
    await enqueueNow<String, _FakePrefs>('c',
        getInstance: () async => p,
        getString: (pr, key) {
          keysSeen.add('r:$key');
          return pr.stored;
        },
        setString: (pr, key, v) async {
          keysSeen.add('w:$key');
          writes++;
          pr.stored = v;
        },
        decode: dec,
        encode: enc,
        key: k,
        log: (m) => throw StateError('2: log אסור בהצלחה: $m'));
    assert(p.stored == 'a,b,c', '2: intent מצורף לסוף, got ${p.stored}');
    assert(writes == 1, '2: כתיבה אחת בדיוק');
    assert(keysSeen.join('|') == 'r:$k|w:$k', '2: אותו key בקריאה ובכתיבה');
    n += 3;
  }

  // 3 · getInstance זורק ⇒ log יחיד verbatim (מקור :234-236), אפס כתיבות, לא זורק.
  {
    final logs = <String>[];
    var writes = 0;
    await enqueueNow<String, _FakePrefs>('a',
        getInstance: () async => throw StateError('boom'),
        getString: (pr, key) => pr.stored,
        setString: (pr, key, v) async => writes++,
        decode: dec,
        encode: enc,
        key: k,
        log: logs.add);
    assert(writes == 0, '3: כשל-getInstance ⇒ אפס כתיבות');
    assert(logs.length == 1, '3: log יחיד, got ${logs.length}');
    assert(
        logs.single ==
            'OfflineOrderQueue: enqueue failed (ignored): Bad state: boom',
        '3: הודעה verbatim מהמקור, got "${logs.single}"');
    n += 3;
  }

  // 4 · setString נכשל אסינכרונית ⇒ נבלע + log באותה קידומת (rule #1), לא זורק.
  {
    final p = _FakePrefs()..stored = 'a';
    final logs = <String>[];
    await enqueueNow<String, _FakePrefs>('b',
        getInstance: () async => p,
        getString: (pr, key) => pr.stored,
        setString: (pr, key, v) async => throw StateError('disk full'),
        decode: dec,
        encode: enc,
        key: k,
        log: logs.add);
    assert(p.stored == 'a', '4: הכתיבה נכשלה ⇒ ה-store לא השתנה');
    assert(
        logs.length == 1 &&
            logs.single.startsWith('OfflineOrderQueue: enqueue failed (ignored): '),
        '4: log יחיד עם הקידומת, got $logs');
    n += 2;
  }

  // 5 · decode זורק ⇒ נתפס (on Object), אפס כתיבות, log יחיד, לא זורק.
  {
    final logs = <String>[];
    var writes = 0;
    await enqueueNow<String, _FakePrefs>('a',
        getInstance: () async => _FakePrefs()..stored = '###',
        getString: (pr, key) => pr.stored,
        setString: (pr, key, v) async => writes++,
        decode: (raw) => throw const FormatException('corrupt'),
        encode: enc,
        key: k,
        log: logs.add);
    assert(writes == 0 && logs.length == 1, '5: decode זורק ⇒ אפס כתיבות + log יחיד');
    n += 1;
  }

  // 6 · getString זורק (סינכרוני) ⇒ אותו שומר, לא זורק.
  {
    final logs = <String>[];
    await enqueueNow<String, _FakePrefs>('a',
        getInstance: () async => _FakePrefs(),
        getString: (pr, key) => throw StateError('read fail'),
        setString: (pr, key, v) async {},
        decode: dec,
        encode: enc,
        key: k,
        log: logs.add);
    assert(logs.length == 1, '6: getString זורק ⇒ log יחיד, לא זורק');
    n += 1;
  }

  assert(n >= 13, 'assert-live guard');
  print('OK enqueueNow: $n asserts passed (שקעים מוזרקים · מוגן-מוחלט verbatim)');
}
