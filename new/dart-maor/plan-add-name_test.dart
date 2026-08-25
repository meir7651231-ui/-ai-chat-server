// בדיקת-חוזה (רתמת-זהב) · planAddName — מייבאת אך ורק את האטום-שלה (חוק-4).
// עשר דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/plan-add-name.test.mjs
// (אותם קלטים → אותם פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/plan-add-name_test.dart  ⇒ exit 0
import 'plan-add-name.dart';

// שקעים זהים למקור-ה-JS: normName=הסרת-רווחים · isoToday='2026-08-24'.
String normName(String s) => s.replaceAll(RegExp(r'\s'), '');
String isoToday() => '2026-08-24';

Map<String, dynamic> mkA() => {
      'names': [
        {'id': 'n1', 'name': 'משה לוי', 'eyes': 3, 'done': false},
      ],
      'log': [
        {'date': '2026-08-01', 'eyes': 3, 'name': 'משה לוי'},
      ],
    };

// deep-equal על Map/List/פרימיטיבים — בלבד dart:core (אין package:collection).
bool deepEq(dynamic x, dynamic y) {
  if (x is Map && y is Map) {
    if (x.length != y.length) return false;
    for (final k in x.keys) {
      if (!y.containsKey(k) || !deepEq(x[k], y[k])) return false;
    }
    return true;
  }
  if (x is List && y is List) {
    if (x.length != y.length) return false;
    for (var i = 0; i < x.length; i++) {
      if (!deepEq(x[i], y[i])) return false;
    }
    return true;
  }
  return x == y;
}

void main() {
  var n = 0;

  // 1) שם ריק ⇒ {ok:false, error:'הקלידו שם לפני ההוספה'}.
  final r1 = planAddName(mkA(), '  ', '', 'n2', normName, isoToday);
  assert(deepEq(r1, {'ok': false, 'error': 'הקלידו שם לפני ההוספה'}), 'FAIL r1: $r1');
  n++;

  // 2) dedup מנורמל (רווחים שונים — אותו מפתח).
  final r2 = planAddName(mkA(), 'משה  לוי', '', 'n2', normName, isoToday);
  assert(r2['ok'] == false && r2['error'] == 'השם "משה  לוי" כבר ברשימה', 'FAIL r2: $r2');
  n++;

  // 3) הוספה בלי מונה — ok · names.length=2.
  final a3 = mkA();
  final r3 = planAddName(a3, ' דוד ', '', 'n2', normName, isoToday);
  assert(r3['ok'] == true && (r3['names'] as List).length == 2, 'FAIL r3 ok/len: $r3');
  n++;

  // 4) names[1] = {id:'n2', name:'דוד', eyes:'', done:false}.
  assert(deepEq((r3['names'] as List)[1], {'id': 'n2', 'name': 'דוד', 'eyes': '', 'done': false}),
      'FAIL r3.names[1]: ${(r3['names'] as List)[1]}');
  n++;

  // 5) eyes='' ⇒ אין מפתח log.
  assert(!r3.containsKey('log'), 'FAIL r3: log לא אמור להיות קיים');
  n++;

  // 6) a המקורי לא שונה (אימוטביליות).
  assert((a3['names'] as List).length == 1, 'FAIL a3 שונה: ${(a3['names'] as List).length}');
  n++;

  // 7) הוספה עם מונה — eyes=5 ⇒ log.length=2.
  final r4 = planAddName(mkA(), 'רות', 5, 'n3', normName, isoToday);
  assert(r4['ok'] == true && (r4['log'] as List).length == 2, 'FAIL r4 ok/loglen: $r4');
  n++;

  // 8) log[0] = {date:'2026-08-24', eyes:5, name:'רות'} (בראש).
  assert(deepEq((r4['log'] as List)[0], {'date': '2026-08-24', 'eyes': 5, 'name': 'רות'}),
      'FAIL r4.log[0]: ${(r4['log'] as List)[0]}');
  n++;

  // 9) הרשומה הישנה אחרי החדשה.
  assert(((r4['log'] as List)[1] as Map)['name'] == 'משה לוי', 'FAIL r4.log[1].name');
  n++;

  // 10) eyes=0 — מונה שסופק ⇒ log עם eyes=0.
  final r5 = planAddName(mkA(), 'חנה', 0, 'n4', normName, isoToday);
  assert(r5['ok'] == true && r5['log'] != null && ((r5['log'] as List)[0] as Map)['eyes'] == 0,
      'FAIL r5: $r5');
  n++;

  print('OK planAddName: $n asserts passed — Dart≡JS');
}
