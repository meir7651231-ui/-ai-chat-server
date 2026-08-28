// בדיקת-חוזה · endPairMemoized — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/end_pair_memoized_test.dart
import 'end_pair_memoized.dart';

/// מחזיק-קלט מקומי-לבדיקה (לא חלק מהאטום — האטום גנרי).
class _End {
  final String type;
  final String size;
  const _End(this.type, this.size);
}

void main() {
  var n = 0;
  var calls = 0;
  final memo = <String, String>{};
  String eval(_End a, _End b) {
    calls++;
    return 'pair(${a.type}:${a.size},${b.type}:${b.size})#$calls';
  }

  String run(_End a, _End b, Map<String, String> m) => endPairMemoized<_End, String>(
        a,
        b,
        connectorTypeId: (e) => e.type,
        sizeValue: (e) => e.size,
        memo: m,
        endPair: eval,
      );

  const a = _End('t1', '1/2');
  const b = _End('t2', '3/4');

  // 1 — מפתח חסר ⇒ חישוב פעם-אחת, המפתח verbatim ‏(:224-225).
  final r1 = run(a, b, memo);
  assert(calls == 1, 'FAIL 1: endPair נקרא $calls פעמים (צפוי 1)');
  assert(r1 == 'pair(t1:1/2,t2:3/4)#1', 'FAIL 1: r1=$r1');
  assert(memo.length == 1 && memo.containsKey('t1|1/2|t2|3/4'),
      'FAIL 1: memo=${memo.keys}');
  n++;

  // 2 — אותו זוג שוב ⇒ endPair לא נקרא, מוחזר הערך השמור (putIfAbsent ‏:226).
  final r2 = run(a, b, memo);
  assert(calls == 1, 'FAIL 2: endPair נקרא שוב (calls=$calls)');
  assert(identical(r2, r1), 'FAIL 2: לא הערך השמור');
  n++;

  // 3 — RAW לא-מנורמל (‏:179-181): '1/2"' הוא מפתח *אחר* מ-'1/2' ⇒ חישוב חדש.
  final r3 = run(const _End('t1', '1/2"'), b, memo);
  assert(calls == 2, 'FAIL 3: ציפינו חישוב-חדש למפתח RAW (calls=$calls)');
  assert(memo.containsKey('t1|1/2"|t2|3/4'), 'FAIL 3: memo=${memo.keys}');
  assert(r3 != r1, 'FAIL 3: תוצאה זהה למרות מפתח שונה');
  n++;

  // 4 — כיווניות: (B,A) מפתח שונה מ-(A,B) ⇒ חישוב נפרד.
  run(b, a, memo);
  assert(calls == 3, 'FAIL 4: כיוון-הפוך לא חושב (calls=$calls)');
  assert(memo.containsKey('t2|3/4|t1|1/2'), 'FAIL 4: memo=${memo.keys}');
  n++;

  // 5 — המפתח מזהה את הזוג, לא את האובייקט: end-אחר עם אותם 4 שדות ⇒ cache-hit.
  final r5 = run(const _End('t1', '1/2'), const _End('t2', '3/4'), memo);
  assert(calls == 3, 'FAIL 5: חושב מחדש למרות מפתח זהה (calls=$calls)');
  assert(identical(r5, r1), 'FAIL 5: לא הערך השמור');
  n++;

  // 6 — הסטייט מוזרק: מטמון-אחר ריק ⇒ חישוב מחדש (הסטייט אצל הקופסה, לא באטום).
  final memo2 = <String, String>{};
  run(a, b, memo2);
  assert(calls == 4, 'FAIL 6: מטמון-חדש לא חישב (calls=$calls)');
  assert(memo2.length == 1, 'FAIL 6: memo2=${memo2.keys}');
  n++;

  // 7 — putIfAbsent שומר את הערך שחושב (memo mutation, לא רק החזרה).
  assert(memo['t1|1/2|t2|3/4'] == r1, 'FAIL 7: הערך לא נשמר במפה');
  n++;

  print('OK endPairMemoized: $n asserts passed (שכן+סטייט ⇒ שקעים · מפתח RAW verbatim)');
}
