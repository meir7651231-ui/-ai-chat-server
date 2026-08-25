// בדיקת-חוזה (רתמת-זהב) · resolveLocalized — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/resolve-localized.test.mjs
// (7 דוגמאות-חוזה + בדיקת SITE_LANGS). השוואת-מערך = אורך + איבר-איבר (כלל-8 —
// לעולם לא join). כשל ⇒ StateError; סיום ירוק ⇒ הדפסת OK.
// הרצה: dart run --enable-asserts new/dart-maor/resolve-localized_test.dart ⇒ exit 0
import 'resolve-localized.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

// כלל-8: השוואת-מערכים אורך + איבר-איבר בלבד (לא join — לא מבחין ['']↔[]).
void _eqList(List<String> got, List<String> want, String label) {
  if (got.length != want.length) {
    throw StateError(
        'FAIL [$label]: length ${got.length} != ${want.length} ($got vs $want)');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('FAIL [$label][$i]: got="${got[i]}" want="${want[i]}"');
    }
  }
}

void main() {
  var n = 0;

  // — SITE_LANGS: סדר-הנפילה הקבוע (מקביל ל-JSON.stringify בבדיקת-ה-JS) —
  _eqList(siteLangs, const ['he', 'en', 'yi'], 'SITE_LANGS');
  n++;

  // 1 — undefined/null ⇒ '' (ב-Dart שניהם null; המקור בודק t == null רפוי)
  _eq(resolveLocalized(null, 'en'), '', 'דוגמה 1a');
  n++;
  _eq(resolveLocalized(null, 'he'), '', 'דוגמה 1b');
  n++;

  // 2 — מחרוזת עוברת כמות-שהיא, השפה לא נבדקת
  _eq(resolveLocalized('שלום', 'en'), 'שלום', 'דוגמה 2');
  n++;

  // 3 — השפה המבוקשת קיימת
  _eq(resolveLocalized({'he': 'שלום', 'en': 'Hello'}, 'en'), 'Hello', 'דוגמה 3');
  n++;

  // 4 — ערך רווחים-בלבד נחשב ריק ⇒ נפילה לעברית
  _eq(resolveLocalized({'he': 'שלום', 'en': '   '}, 'en'), 'שלום', 'דוגמה 4');
  n++;

  // 5 — אין he; הסריקה בסדר SITE_LANGS מדלגת על en הריק ומגיעה ל-yi
  _eq(resolveLocalized({'en': '', 'yi': 'העלא'}, 'he'), 'העלא', 'דוגמה 5');
  n++;

  // 6 — מפה ריקה ⇒ ''
  _eq(resolveLocalized(<String, dynamic>{}, 'yi'), '', 'דוגמה 6');
  n++;

  // 7 — הנפילה לעברית לפני הסריקה הכללית
  _eq(resolveLocalized({'he': 'שלום'}, 'yi'), 'שלום', 'דוגמה 7');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(resolveLocalized({'he': 'שלום'}, 'yi') == 'שלום', 'assert-live guard');

  print('OK resolveLocalized: $n asserts passed');
}
