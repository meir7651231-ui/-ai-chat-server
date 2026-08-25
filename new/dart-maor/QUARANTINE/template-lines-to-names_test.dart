/// בדיקות-חוזה · template-lines-to-names — כל 5 הדוגמאות המחייבות
/// (template-lines-to-names.contract.md ≡ template-lines-to-names.test.mjs).
import 'template-lines-to-names.dart';

void ok(bool cond, String msg) {
  if (!cond) throw StateError('✗ ' + msg);
}

/// השוואת-מפה: אותם מפתחות בדיוק (מפתח-חסר ≠ null — חוק-2) + ערך-ערך.
void eqMap(Map actual, Map expected, String msg) {
  ok(actual.length == expected.length,
      '$msg — מספר-מפתחות ${actual.length} במקום ${expected.length}: $actual');
  for (final k in expected.keys) {
    ok(actual.containsKey(k), '$msg — מפתח "$k" חסר: $actual');
    ok(actual[k] == expected[k],
        '$msg — [$k] = ${actual[k]} במקום ${expected[k]}');
  }
}

/// השוואת-מערך-מפות: אורך + איבר-איבר (חוק-8 — לעולם לא join).
void eqList(List actual, List<Map> expected, String msg) {
  ok(actual.length == expected.length,
      '$msg — אורך ${actual.length} במקום ${expected.length}');
  for (var i = 0; i < expected.length; i++) {
    eqMap(actual[i] as Map, expected[i], '$msg [איבר $i]');
  }
}

void main() {
  dynamic nid(int i) => 'id$i';

  // 1) שורה מלאה: trim + eyes + done:false + rate
  final r1 = templateLinesToNames(
      [{'name': ' צבע ', 'qty': 3, 'rate': 120}], nid);
  eqList(r1, [
    {'id': 'id0', 'name': 'צבע', 'eyes': 3, 'done': false, 'rate': 120}
  ], 'דוגמה 1: שורה מלאה שגויה');

  // 2) rate לא-חיובי ⇒ אין מפתח rate כלל
  final r2 = templateLinesToNames([
    {'name': 'א', 'qty': 1, 'rate': 0},
    {'name': 'ב', 'qty': 1, 'rate': -5},
  ], nid);
  ok(r2.length == 2, 'דוגמה 2: אורך שגוי');
  ok(!(r2[0] as Map).containsKey('rate') && !(r2[1] as Map).containsKey('rate'),
      'דוגמה 2: rate לא-חיובי נכנס');
  eqList(r2, [
    {'id': 'id0', 'name': 'א', 'eyes': 1, 'done': false},
    {'id': 'id1', 'name': 'ב', 'eyes': 1, 'done': false},
  ], 'דוגמה 2: תוכן שגוי');

  // 3) ריקי-שם מסולקים (גם רווחים-בלבד)
  final r3 = templateLinesToNames([
    {'name': '  ', 'qty': 1, 'rate': 9},
    {'name': '', 'qty': 2, 'rate': 9},
  ], nid);
  ok(r3.isEmpty, 'דוגמה 3: ריק-שם לא סולק');

  // 4) qty שבור ⇒ 0; חסר ⇒ 0; מחרוזת-מספר ⇒ מספר
  final r4 = templateLinesToNames([
    {'name': 'א', 'qty': 'ab', 'rate': 0},
    {'name': 'ב', 'rate': 0},
    {'name': 'ג', 'qty': '4', 'rate': 0},
  ], nid);
  ok(r4.length == 3, 'דוגמה 4: אורך שגוי');
  ok((r4[0] as Map)['eyes'] == 0 &&
          (r4[1] as Map)['eyes'] == 0 &&
          (r4[2] as Map)['eyes'] == 4,
      'דוגמה 4: המרת-qty שגויה — ${(r4[0] as Map)['eyes']}/${(r4[1] as Map)['eyes']}/${(r4[2] as Map)['eyes']}');

  // 5) מזהים לפי מקום-אחרי-סינון (הריק לא צורך מזהה)
  final r5 = templateLinesToNames([
    {'name': '', 'qty': 1, 'rate': 0},
    {'name': 'א', 'qty': 1, 'rate': 0},
    {'name': 'ב', 'qty': 1, 'rate': 0},
  ], nid);
  ok(r5.length == 2 &&
          (r5[0] as Map)['id'] == 'id0' &&
          (r5[1] as Map)['id'] == 'id1',
      'דוגמה 5: הריק צרך מזהה');

  print('OK');
}
