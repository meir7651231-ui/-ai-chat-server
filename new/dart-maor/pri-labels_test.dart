// בדיקת-חוזה (רתמת-זהב) · priLabels — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/pri-labels.test.mjs:
//   JSON.stringify(PRI_LABELS) === '{"1":"🔴 דחוף","2":"🟡 רגיל","3":"⚪ בהמשך"}'
// כאן משחזרים את מחרוזת-ה-JSON ידנית (בלי dart:convert — אפס import חיצוני) בסדר-הכנסה,
// כדי להוכיח סדר-מפתחות + תוכן בדיוק כמו הצילום. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/pri-labels_test.dart  ⇒ exit 0
import 'pri-labels.dart';

void main() {
  var n = 0;
  final m = priLabels;

  // 1) אורך 3.
  assert(m.length == 3, 'FAIL: אורך ${m.length} ≠ 3');
  n++;

  // 2) ערכים פר-מפתח (זהה למקור).
  assert(m['1'] == '🔴 דחוף', "FAIL: ['1'] ≠ '🔴 דחוף'");
  n++;
  assert(m['2'] == '🟡 רגיל', "FAIL: ['2'] ≠ '🟡 רגיל'");
  n++;
  assert(m['3'] == '⚪ בהמשך', "FAIL: ['3'] ≠ '⚪ בהמשך'");
  n++;

  // 3) סדר-מפתחות בעלייה '1','2','3' (כמו JSON.stringify על מפתחות-מספריים).
  assert(m.keys.toList().join(',') == '1,2,3',
      "FAIL: סדר-מפתחות ${m.keys.toList()} ≠ [1,2,3]");
  n++;

  // 4) שחזור-JSON זהה-ביט לצילום שבמקור-ה-JS.
  const expected = '{"1":"🔴 דחוף","2":"🟡 רגיל","3":"⚪ בהמשך"}';
  final buf = StringBuffer('{');
  var first = true;
  m.forEach((k, v) {
    if (!first) buf.write(',');
    buf.write('"$k":"$v"');
    first = false;
  });
  buf.write('}');
  assert(buf.toString() == expected,
      'FAIL: JSON ${buf.toString()} ≠ הצילום');
  n++;

  print('OK priLabels: $n asserts passed');
}
