// בדיקת-חוזה (רתמת-זהב) · nameMatches — מייבאת אך ורק את האטום-שלה (חוק-4).
// שמונה דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/name-matches.test.mjs
// (אותם קלטים→פלטים). השקע normName הוא מימוש-אמת של maor/plannedMatch, פורט מילה-במילה:
//   String(s||'') → הסרת-ניקוד-עברי → החלפת פיסוק ["'.,-()] ברווח → כיווץ-רווחים → trim → lowercase.
//   1) ("ישראל כהן","ישראל כהן") ⇒ true  (שווים-בדיוק)
//   2) ("ישראל כהן","כהן ישראל") ⇒ true  (2 מילים חופפות)
//   3) ("ישראל כהן","משה כהן")   ⇒ false (רק "כהן" חופפת — צריך 2)
//   4) ("דָּוִד כֹּהֵן","דוד כהן") ⇒ true  (ניקוד מנוקה ⇒ שווים)
//   5) ("דוד","דוד")            ⇒ true  (יחיד=יחיד שווה)
//   6) ("דוד","לוי")            ⇒ false (יחיד≠יחיד)
//   7) ("דוד","דוד לוי")        ⇒ false (צד-יחיד מול צד-כפול דורש 2)
//   8) ("","כהן")               ⇒ false (צד ריק אחרי נרמול)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/name-matches_test.dart  ⇒ exit 0
import 'name-matches.dart';

// שקע-הבדיקה — פורט מילה-במילה מ-normName של המקור (name-matches.test.mjs):
//   .replace(/[֑-ׇ]/g,'')  → הסרת ניקוד עברי U+0591..U+05C7
//   .replace(/["'.,\-()]/g,' ') → פיסוק לרווח
//   .replace(/\s+/g,' ').trim().toLowerCase()
final _niqqud = RegExp('[֑-ׇ]');
final _punct = RegExp(r"""["'.,\-()]""");
final _ws = RegExp(r'\s+');
String _normName(String s) => s
    .replaceAll(_niqqud, '')
    .replaceAll(_punct, ' ')
    .replaceAll(_ws, ' ')
    .trim()
    .toLowerCase();

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  _eq(nameMatches('ישראל כהן', 'ישראל כהן', _normName), true, 'שווים');
  n++;
  _eq(nameMatches('ישראל כהן', 'כהן ישראל', _normName), true, '2 חופפות');
  n++;
  _eq(nameMatches('ישראל כהן', 'משה כהן', _normName), false, 'רק כהן חופפת');
  n++;
  _eq(nameMatches('דָּוִד כֹּהֵן', 'דוד כהן', _normName), true, 'ניקוד מנוקה');
  n++;
  _eq(nameMatches('דוד', 'דוד', _normName), true, 'יחיד=יחיד שווה');
  n++;
  _eq(nameMatches('דוד', 'לוי', _normName), false, 'יחיד≠יחיד');
  n++;
  _eq(nameMatches('דוד', 'דוד לוי', _normName), false, 'יחיד מול כפול דורש 2');
  n++;
  _eq(nameMatches('', 'כהן', _normName), false, 'צד ריק');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    nameMatches('ישראל כהן', 'כהן ישראל', _normName) == true &&
        nameMatches('ישראל כהן', 'משה כהן', _normName) == false,
    'assert-live guard',
  );

  print('OK nameMatches: $n asserts passed');
}
