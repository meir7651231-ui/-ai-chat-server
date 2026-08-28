// בדיקת-חוזה (רתמת-זהב) · renewTargets — מייבאת אך ורק את האטום-שלה (חוק-4).
// 5 דוגמאות-החוזה זהות למקור-ה-JS new/atoms/renew-targets.test.mjs (כולל אימוטבליות).
// הרצה: dart run --enable-asserts new/dart-maor/renew-targets_test.dart  ⇒ exit 0
import 'renew-targets.dart';

void main() {
  var n = 0;

  // 1) 'no'/'hold' בחוץ, וגם 'yes' שכבר-נרשם בחוץ — רק שורה-1
  final r1 = <Map>[
    {'id': 1, 'decision': 'yes', 'renewed': false},
    {'id': 2, 'decision': 'no', 'renewed': false},
    {'id': 3, 'decision': 'yes', 'renewed': true},
    {'id': 4, 'decision': 'hold', 'renewed': false},
  ];
  final o1 = renewTargets(r1);
  if (o1.length != 1 || o1[0]['id'] != 1) {
    throw StateError('FAIL ex1: אורך=${o1.length}');
  }
  n++;
  // אימוטבליות: הקלט לא שוכתב + אותה הפניה
  if (r1.length != 4) throw StateError('FAIL ex1 שוכתב הקלט');
  if (!identical(o1[0], r1[0])) throw StateError('FAIL ex1 אינה אותה הפניה');
  n++;

  // 2) שתי שורות 'yes' שטרם-נרשמו — באותו סדר
  final o2 = renewTargets(<Map>[
    {'id': 1, 'decision': 'yes', 'renewed': false},
    {'id': 2, 'decision': 'yes', 'renewed': false},
  ]);
  if (o2.length != 2 || o2[0]['id'] != 1 || o2[1]['id'] != 2) {
    throw StateError('FAIL ex2');
  }
  n++;

  // 3) '' (טרם-הוחלט) אינו מועמד
  if (renewTargets(<Map>[
    {'id': 1, 'decision': '', 'renewed': false}
  ]).isNotEmpty) {
    throw StateError('FAIL ex3');
  }
  n++;

  // 4) [] ⇒ []
  if (renewTargets(<Map>[]).isNotEmpty) throw StateError('FAIL ex4');
  n++;

  assert(renewTargets(<Map>[]).isEmpty, 'assert-live guard');
  print('OK renewTargets: $n asserts passed');
}
