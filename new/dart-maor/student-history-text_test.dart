// בדיקת-חוזה (רתמת-זהב) · studentHistoryText — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/student-history-text.test.mjs:
//   1) רשומה מלאה               ⇒ '[2026/27] ציור · א — נוכחות 10, חיסורים 2 · פעיל'
//   2) בלי שנה ובלי קבוצה        ⇒ 'נגינה — נוכחות 0, חיסורים 0 · הסתיים' (אפס יתומים)
//   3) שתי רשומות               ⇒ שתי שורות ב-'\n', סדר-הקלט נשמר
//   4) []                        ⇒ '' (מערך ריק ⇒ מחרוזת ריקה)
//   5) קבוצה בלי שנה             ⇒ 'ציור · ב — נוכחות 3, חיסורים 1 · מושהה'
// כלל-8: התוצאה מחרוזת; בדיקת-הרב-שורתי גם כפירוק-שורות — אורך + איבר-איבר, לא join-מול-join.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/student-history-text_test.dart  ⇒ exit 0
import 'student-history-text.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void _eq(String name, String got, String want) {
  _ok(got == want, '$name:\n  "$got"\n≠ "$want"');
}

void main() {
  var n = 0;

  final full = {
    'yearLabel': '2026/27',
    'courseName': 'ציור',
    'group': 'א',
    'summary': {'presents': 10, 'absences': 2, 'statusLabel': 'פעיל'},
  };
  final bare = {
    'yearLabel': '',
    'courseName': 'נגינה',
    'group': '',
    'summary': {'presents': 0, 'absences': 0, 'statusLabel': 'הסתיים'},
  };

  // 1) שורה מלאה.
  _eq('דוגמה-1', studentHistoryText([full]),
      '[2026/27] ציור · א — נוכחות 10, חיסורים 2 · פעיל');
  n++;

  // 2) בלי שנה ובלי קבוצה — אפס סוגריים/מפרידים יתומים.
  _eq('דוגמה-2', studentHistoryText([bare]),
      'נגינה — נוכחות 0, חיסורים 0 · הסתיים');
  n++;

  // 3) שתי שורות ב-'\n', סדר-הקלט נשמר.
  _eq(
      'דוגמה-3',
      studentHistoryText([full, bare]),
      '[2026/27] ציור · א — נוכחות 10, חיסורים 2 · פעיל\n'
      'נגינה — נוכחות 0, חיסורים 0 · הסתיים');
  // כלל-8: פירוק-שורות — אורך + איבר-איבר (לא השוואת-join).
  final lines = studentHistoryText([full, bare]).split('\n');
  _ok(lines.length == 2, 'דוגמה-3: מספר-שורות ${lines.length} ≠ 2');
  _eq('דוגמה-3 שורה-0', lines[0],
      '[2026/27] ציור · א — נוכחות 10, חיסורים 2 · פעיל');
  _eq('דוגמה-3 שורה-1', lines[1], 'נגינה — נוכחות 0, חיסורים 0 · הסתיים');
  n++;

  // 4) מערך ריק ⇒ מחרוזת ריקה.
  _eq('דוגמה-4', studentHistoryText([]), '');
  n++;

  // 5) קבוצה בלי שנה.
  _eq(
      'דוגמה-5',
      studentHistoryText([
        {
          'yearLabel': '',
          'courseName': 'ציור',
          'group': 'ב',
          'summary': {'presents': 3, 'absences': 1, 'statusLabel': 'מושהה'},
        }
      ]),
      'ציור · ב — נוכחות 3, חיסורים 1 · מושהה');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(studentHistoryText([]) == '', 'assert-live guard');

  print('OK studentHistoryText: $n contract examples passed');
}
