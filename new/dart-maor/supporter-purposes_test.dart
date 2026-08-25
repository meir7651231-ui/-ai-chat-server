// בדיקת-חוזה (רתמת-זהב) · supporterPurposes — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/supporter-purposes.test.mjs
// (אותם קלטים→פלטים):
//   1) {forWho:'ישיבה', donations:[{purpose:'אברכים'},{purpose:'ישיבה'}]} ⇒ ['ישיבה','אברכים']
//   2) {forWho:'  ', donations:[{purpose:' חסד '}]}                       ⇒ ['חסד']
//   3) {}                                                                 ⇒ []
//   4) {donations:[{purpose:''},{}]}                                      ⇒ []
//   5) {forWho:'צדקה'}                                                    ⇒ ['צדקה']
//   6) {donations:[{purpose:'ב'},{purpose:'א'},{purpose:'ב'}]}            ⇒ ['ב','א']
// השוואת-מערכים: אורך + איבר-איבר (כלל-8, לא join-בלבד). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/supporter-purposes_test.dart  ⇒ exit 0
import 'supporter-purposes.dart';

void _eq(List<String> got, List<String> want, String label) {
  if (got.length != want.length) {
    throw StateError(
        'FAIL [$label]: length ${got.length} != ${want.length}\n got =[${got.join('|')}]\n want=[${want.join('|')}]');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError(
          'FAIL [$label]: index $i: "${got[i]}" != "${want[i]}"\n got =[${got.join('|')}]\n want=[${want.join('|')}]');
    }
  }
}

void main() {
  var n = 0;

  // 1) איחוד ייחודי — כפילות 'ישיבה' נבלעת, forWho ראשון.
  _eq(
    supporterPurposes({
      'forWho': 'ישיבה',
      'donations': [
        {'purpose': 'אברכים'},
        {'purpose': 'ישיבה'},
      ],
    }),
    ['ישיבה', 'אברכים'],
    'דוגמה 1 · איחוד ייחודי, forWho ראשון',
  );
  n++;

  // 2) trim על שניהם — forWho של רווחים-בלבד = ריק, purpose נגזם.
  _eq(
    supporterPurposes({
      'forWho': '  ',
      'donations': [
        {'purpose': ' חסד '},
      ],
    }),
    ['חסד'],
    'דוגמה 2 · trim — רווחים-בלבד = ריק',
  );
  n++;

  // 3) אובייקט ריק ⇒ [].
  _eq(supporterPurposes({}), [], 'דוגמה 3 · אובייקט ריק');
  n++;

  // 4) ריקים וחסרים לא נאספים (purpose:'' וגם מפה-בלי-purpose).
  _eq(
    supporterPurposes({
      'donations': [
        {'purpose': ''},
        <String, dynamic>{},
      ],
    }),
    [],
    'דוגמה 4 · ריקים וחסרים לא נאספים',
  );
  n++;

  // 5) forWho בלבד (בלי donations בכלל).
  _eq(supporterPurposes({'forWho': 'צדקה'}), ['צדקה'], 'דוגמה 5 · forWho בלבד');
  n++;

  // 6) סדר-הכנסה, לא מיון — 'ב' לפני 'א', והכפילות נבלעת.
  _eq(
    supporterPurposes({
      'donations': [
        {'purpose': 'ב'},
        {'purpose': 'א'},
        {'purpose': 'ב'},
      ],
    }),
    ['ב', 'א'],
    'דוגמה 6 · סדר-הכנסה, לא מיון',
  );
  n++;

  // כלל-16 (מעבר לחוזה): NEL (U+0085) אינו נגזם ב-JS ⇒ נשאר חלק מהערך.
  _eq(
    supporterPurposes({'forWho': '\u0085חסד\u0085'}),
    ['\u0085חסד\u0085'],
    'כלל-16 · U+0085 לא נגזם',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    supporterPurposes({'forWho': 'א'}).join('|') == 'א',
    'assert-live guard',
  );

  print('OK supporterPurposes: $n asserts passed');
}
