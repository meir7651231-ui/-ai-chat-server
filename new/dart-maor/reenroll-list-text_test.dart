// בדיקת-חוזה (רתמת-זהב) · reenrollListText — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/reenroll-list-text.test.mjs
// (אותם קלטים→פלטים, מומרים ל-Map של Dart):
//   1) [r1] ⇒ 'דוד · ציור — נוכחות 12, חיסורים 2 · ממשיך ✓נרשם'
//   2) [r2] ⇒ 'רות · מוזיקה — נוכחות 0, חיסורים 5 · טרם הוחלט'  (decision חסר, renewed:false)
//   3) [{...r2, decision:'no'}] מסתיים ב-'· לא ממשיך'
//   4) [{...r2, decision:'hold'}] מסתיים ב-'· בהמתנה'
//   5) [r1, r2] === שורת-r1 + '\n' + שורת-r2  (חיבור ב-'\n')
//   6) [] ⇒ ''  (מחרוזת ריקה)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/reenroll-list-text_test.dart  ⇒ exit 0
import 'reenroll-list-text.dart';

// עותק-רך של Map (מקביל ל-{...r2, decision:'x'} של JS).
Map<String, dynamic> _with(Map<String, dynamic> base, Map<String, dynamic> patch) =>
    {...base, ...patch};

void main() {
  var n = 0;

  final r1 = <String, dynamic>{
    'memberName': 'דוד',
    'courseName': 'ציור',
    'summary': {'presents': 12, 'absences': 2},
    'decision': 'yes',
    'renewed': true,
  };
  final r2 = <String, dynamic>{
    'memberName': 'רות',
    'courseName': 'מוזיקה',
    'summary': {'presents': 0, 'absences': 5},
    'renewed': false,
  };

  // 1) שורת r1.
  assert(
    reenrollListText([r1]) == 'דוד · ציור — נוכחות 12, חיסורים 2 · ממשיך ✓נרשם',
    'FAIL r1: ${reenrollListText([r1])}',
  );
  n++;

  // 2) שורת r2 (decision חסר ⇒ טרם הוחלט; renewed:false ⇒ בלי ✓נרשם).
  assert(
    reenrollListText([r2]) == 'רות · מוזיקה — נוכחות 0, חיסורים 5 · טרם הוחלט',
    'FAIL r2: ${reenrollListText([r2])}',
  );
  n++;

  // 3) decision 'no' ⇒ מסתיים ב-'· לא ממשיך'.
  assert(
    reenrollListText([_with(r2, {'decision': 'no'})]).endsWith('· לא ממשיך'),
    "FAIL decision 'no'",
  );
  n++;

  // 4) decision 'hold' ⇒ מסתיים ב-'· בהמתנה'.
  assert(
    reenrollListText([_with(r2, {'decision': 'hold'})]).endsWith('· בהמתנה'),
    "FAIL decision 'hold'",
  );
  n++;

  // 5) חיבור ב-'\n'.
  final two = reenrollListText([r1, r2]);
  assert(
    two == reenrollListText([r1]) + '\n' + reenrollListText([r2]),
    'FAIL חיבור \\n: $two',
  );
  n++;

  // 6) rows=[] ⇒ מחרוזת ריקה.
  assert(reenrollListText([]) == '', 'FAIL rows=[] ⇒ ריק');
  n++;

  print('OK reenrollListText: $n asserts passed');
}
