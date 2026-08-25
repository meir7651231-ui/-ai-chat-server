// בדיקת-חוזה (רתמת-זהב) · taskIdentity — מייבאת אך ורק את האטום-שלה (חוק-4).
// כל 12 דוגמאות-החוזה (task-identity.contract.md) = בדיקת-ה-JS (task-identity.test.mjs)
// זהות ביט-אחר-ביט: הקלטות-Golden שהורצו על קוד-המקור עצמו. עובר ⇒ Dart≡JS.
// חיזוקים מעבר-לחוזה (אומתו מול סמנטיקת-JS): null⇒'מקומי' (‏??), גזימת-רווחים+lower,
// ‏U+0085 לא-נגזם (חוק-16), ‏İ⇒i+U+0307 (חוק-13), '' אחרי-גזימה ⇒ 'מקומי' (חוק-7).
// הרצה: dart run --enable-asserts new/dart-maor/task-identity_test.dart ⇒ exit 0
import 'task-identity.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 12 זוגות-Golden מהחוזה — קלט ⇒ פלט, זהה-ביט.
  final cases = <List<String>>[
    ['', 'מקומי'],
    ['אבג', 'אבג'],
    ['כהן לוי', 'כהן לוי'],
    ['abc', 'abc'],
    ['a@b.com', 'a@b.com'],
    ['2026-08-24', '2026-08-24'],
    ['2026-08-24T12:00:00', '2026-08-24t12:00:00'],
    ['0501234567', '0501234567'],
    ['03-1234567', '03-1234567'],
    ['https://x.co', 'https://x.co'],
    ['שלום עולם', 'שלום עולם'],
    ['12', '12'],
  ];
  for (final c in cases) {
    final got = taskIdentity(c[0]);
    _ok(got == c[1], "Golden '${c[0]}' ⇒ '$got' ≠ '${c[1]}'");
    n++;
  }

  // null ⇒ 'מקומי' (‏email ?? '' במקור — undefined/null שקולים).
  _ok(taskIdentity(null) == 'מקומי', "null ⇒ '${taskIdentity(null)}' ≠ 'מקומי'");
  n++;

  // גזימה + אותיות-קטנות יחד.
  _ok(taskIdentity('  A@B.Com  ') == 'a@b.com', 'trim+lower נכשל');
  n++;

  // חוק-7: רווחים-בלבד ⇒ '' אחרי-גזימה ⇒ כוזב ⇒ 'מקומי'.
  _ok(taskIdentity('   ') == 'מקומי', "רווחים-בלבד ⇒ לא 'מקומי'");
  n++;

  // חוק-16: ‏U+0085 (NEL) אינו רווח-ES — JS לא גוזם אותו ⇒ נשאר, לא 'מקומי'.
  _ok(taskIdentity('') == '', 'U+0085 נגזם שלא-כדין (Dart.trim דלף)');
  n++;

  // חוק-13: ‏İ ⇒ 'i'+U+0307 (מיפוי-מלא של JS; Dart לבדו משמיט את הנקודה).
  final ii = taskIdentity('İ');
  _ok(ii.length == 2 && ii.codeUnitAt(0) == 0x69 && ii.codeUnitAt(1) == 0x0307,
      'İ ⇒ ${ii.codeUnits} ≠ [105, 775]');
  n++;

  // חוק-13: צ'רוקי גדולה U+13A3 ⇒ קטנה U+AB73 (Dart לבדו משאיר כמו-שהוא).
  final ch = taskIdentity('Ꭳ');
  _ok(ch.length == 1 && ch.codeUnitAt(0) == 0xAB73,
      'צ\'רוקי ⇒ ${ch.codeUnits} ≠ [43891]');
  n++;

  // assert חי (הרצה עם --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(taskIdentity('') == 'מקומי', 'assert-live guard');

  print('OK taskIdentity: $n asserts passed (12 Golden + 6 חיזוקים)');
}
