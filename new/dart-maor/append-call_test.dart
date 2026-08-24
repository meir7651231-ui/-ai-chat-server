// בדיקת-חוזה (רתמת-זהב) · appendCall — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/append-call.test.mjs (CAP=3):
//   (undefined,'skip')→undefined · (undefined,'answered','2026-08-24')→
//     [{at:'2026-08-24',outcome:'answered'}] · ([a],'donated',iso)→אורך 2, האחרון donated ·
//   ([a,b,c],'noanswer',iso)→אורך 3, הוותיקה a נשמטה, האחרונה noanswer ·
//   skip על מערך-קיים ⇒ אותה הפניה (identical) · המקור לא השתנה (אימוטביליות).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/append-call_test.dart  ⇒ exit 0
import 'append-call.dart';

const int cap = 3; // שקע-הבדיקה (בקופסה: האטום call-log-cap = 200) — verbatim מ-append-call.test.mjs.

void _check(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) skip על undefined ⇒ undefined (null), אותה הפניה.
  _check(identical(appendCall(null, 'skip', '2026-08-24', cap), null),
      'skip על null ⇒ null'); n++;

  // 2) רישום ראשון על null ⇒ [{at,outcome}].
  final one = appendCall(null, 'answered', '2026-08-24', cap);
  _check(one != null && one.length == 1 &&
      one[0]['at'] == '2026-08-24' && one[0]['outcome'] == 'answered',
      'רישום ראשון: $one'); n++;

  // 3) הוספה לסוף מערך-קיים.
  final a = {'at': '2026-08-20', 'outcome': 'noanswer'};
  final two = appendCall([a], 'donated', '2026-08-21', cap);
  _check(two != null && two.length == 2 && two[1]['outcome'] == 'donated',
      'הוספה לסוף'); n++;

  // 4) טבעת בגודל cap — הוותיקה נשמטה, האחרונה נשמרה.
  final full = [
    a,
    {'at': '2026-08-21', 'outcome': 'answered'},
    {'at': '2026-08-22', 'outcome': 'callback'},
  ];
  final ring = appendCall(full, 'noanswer', '2026-08-23', cap);
  _check(ring != null && ring.length == 3, 'טבעת: אורך נשאר $cap'); n++;
  _check(ring![0]['at'] == '2026-08-21' && ring[2]['outcome'] == 'noanswer',
      'הוותיקה נשמטה, האחרונה נשמרה'); n++;

  // 5) skip על מערך-קיים ⇒ אותה הפניה.
  final same = appendCall(full, 'skip', '2026-08-23', cap);
  _check(identical(same, full), 'skip ⇒ אותה הפניה'); n++;

  // 6) המקור לא השתנה (אימוטביליות).
  _check(full.length == 3 && identical(full[0], a),
      'המקור לא השתנה (אימוטביליות)'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(appendCall(null, 'skip', 'x', cap) == null, 'assert-live guard');

  print('OK appendCall: $n דוגמאות-חוזה — ירוק');
}
