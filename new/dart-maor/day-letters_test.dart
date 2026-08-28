import '../dart-data-maor/day-letters-terms.dart' as td_day_letters;
// בדיקת-חוזה (רתמת-זהב) · dayLetters — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/day-letters.test.mjs:
//   1) DAY_LETTERS.length ⇒ 6
//   2) [0]⇒'א׳' · [1]⇒'ב׳' · [5]⇒'ו׳'
//   3) המערך המלא ⇒ ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳']
//   4) כל איבר באורך 2 והתו השני הוא גרש-עברי U+05F3 (׳) — לא apostrophe U+0027
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/day-letters_test.dart  ⇒ exit 0
import 'day-letters.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;
  final d = dayLetters(term: (k)=>td_day_letters.kTerms[k]!);
  const want = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳'];
  const geresh = '׳'; // ׳ גרש-עברי — לא apostrophe

  // 1) אורך המערך = 6 בדיוק
  _ok(d.length == 6, 'length ⇒ ${d.length} ≠ 6');
  n++;

  // 2) אינדקסים נקודתיים מהחוזה
  final idx = <List<dynamic>>[
    [0, 'א׳'],
    [1, 'ב׳'],
    [5, 'ו׳'],
  ];
  for (final e in idx) {
    final i = e[0] as int;
    final w = e[1] as String;
    _ok(d[i] == w, '[$i] ⇒ ${d[i]} ≠ $w');
    n++;
  }

  // 3) המערך המלא זהה לחוזה (איבר-איבר — לא join, לקח כלל-8)
  _ok(d.length == want.length, 'אורך שונה מהחוזה');
  n++;
  for (var i = 0; i < want.length; i++) {
    _ok(d[i] == want[i], "המערך המלא שונה בחוזה באינדקס $i");
    n++;
  }

  // 4) כל איבר: אורך 2 והתו השני הוא גרש-עברי U+05F3
  for (final s in d) {
    _ok(s.length == 2 && s[1] == geresh,
        '"$s" — לא אות+גרש-עברי U+05F3');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(dayLetters(term: (k)=>td_day_letters.kTerms[k]!).join('|') == 'א׳|ב׳|ג׳|ד׳|ה׳|ו׳', 'assert-live guard');

  print('OK dayLetters: $n asserts passed');
}
