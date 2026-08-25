// בדיקת-חוזה (רתמת-זהב) · outcomeLabels — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/outcome-labels.test.mjs:
//   ה-JS מצלם את OUTCOME_LABELS דרך JSON.stringify (סדר-מפתחות נשמר) ומשווה:
//     {"donated":"תרם/ה","noanswer":"לא ענה","refused":"סירב/ה",
//      "callback":"לחזור","done":"טופל","skip":"דילוג"}
//   כאן: אורך 6 · כל 6 הזוגות מפתח→ערך · וסדר-המפתחות זהה (JSON תלוי-סדר).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/outcome-labels_test.dart  ⇒ exit 0
import 'outcome-labels.dart';

void main() {
  var n = 0;
  final m = outcomeLabels;

  // 1) אורך 6.
  assert(m.length == 6, 'FAIL: אורך ${m.length} ≠ 6');
  n++;

  // 2) donated → 'תרם/ה'.
  assert(m['donated'] == 'תרם/ה', "FAIL: donated ≠ 'תרם/ה'");
  n++;

  // 3) noanswer → 'לא ענה'.
  assert(m['noanswer'] == 'לא ענה', "FAIL: noanswer ≠ 'לא ענה'");
  n++;

  // 4) refused → 'סירב/ה'.
  assert(m['refused'] == 'סירב/ה', "FAIL: refused ≠ 'סירב/ה'");
  n++;

  // 5) callback → 'לחזור'.
  assert(m['callback'] == 'לחזור', "FAIL: callback ≠ 'לחזור'");
  n++;

  // 6) done → 'טופל'.
  assert(m['done'] == 'טופל', "FAIL: done ≠ 'טופל'");
  n++;

  // 7) skip → 'דילוג'.
  assert(m['skip'] == 'דילוג', "FAIL: skip ≠ 'דילוג'");
  n++;

  // 8) סדר-המפתחות זהה למקור (JSON.stringify תלוי-סדר).
  assert(
    m.keys.join(',') == 'donated,noanswer,refused,callback,done,skip',
    'FAIL: סדר-מפתחות סטה: ${m.keys.join(',')}',
  );
  n++;

  print('OK outcomeLabels: $n asserts passed');
}
