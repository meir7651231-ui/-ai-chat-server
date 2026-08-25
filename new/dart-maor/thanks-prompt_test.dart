// בדיקת-חוזה (רתמת-זהב) · thanksPrompt — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה + בדיקות-ה-JS (new/atoms/thanks-prompt.test.mjs) ביט-אחר-ביט:
//   1) מינימלי ⇒ 4 שורות בדיוק, נוסח מלא.
//   2) מלא (designation+totalSoFar) ⇒ 6 שורות; שורה-3 ייעוד · שורה-4 מצטבר.
//   3) orgName:'' ⇒ השורה הראשונה מסתיימת ב-'מארגון "הארגון"'.
//   4) רק totalSoFar ⇒ 5 שורות, בלי שורת-הייעוד.
// השוואת-מערכים: אורך + איבר-איבר (חוק-8). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/thanks-prompt_test.dart  ⇒ exit 0
import 'thanks-prompt.dart';

void _eq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n got =$got\n want=$want');
  }
}

void _eqLines(List<String> got, List<String> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: אורך ${got.length} ≠ ${want.length}');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('FAIL [$label] שורה $i:\n got =${got[i]}\n want=${want[i]}');
    }
  }
}

void main() {
  var n = 0;

  // 1) מינימלי — 4 שורות בדיוק (דוגמה-1 בחוזה).
  final min = thanksPrompt({
    'orgName': 'מאור',
    'supporterName': 'דנה לוי',
    'lastAmount': '₪500',
  });
  _eq(
    min,
    'כתוב מכתב תודה קצר (4-6 שורות), חם ואישי, בעברית, מארגון "מאור"\n'
        'לתורם/ת בשם "דנה לוי" על תרומה של ₪500.\n'
        'בלי הגזמות, בלי סופרלטיבים ריקים, בלי לציין סכומים מעבר לנאמר. לסיים בברכה חמה.\n'
        'להחזיר את המכתב בלבד — בלי הקדמות.',
    'הפרומפט-המינימלי סטה',
  );
  n++;
  _eq(min.split('\n').length, 4, 'מספר-שורות מינימלי שגוי');
  n++;

  // 2) מלא — 6 שורות; ייעוד + מצטבר במקומם (דוגמה-2), איבר-איבר (חוק-8).
  final full = thanksPrompt({
    'orgName': 'מאור',
    'supporterName': 'דנה לוי',
    'lastAmount': '₪500',
    'designation': 'אמץ חתן',
    'totalSoFar': '₪2,000',
  });
  final lines = full.split('\n');
  _eqLines(
    lines,
    [
      'כתוב מכתב תודה קצר (4-6 שורות), חם ואישי, בעברית, מארגון "מאור"',
      'לתורם/ת בשם "דנה לוי" על תרומה של ₪500.',
      'התרומה יועדה ל: אמץ חתן.',
      'סה"כ תרומותיו/ה עד כה: ₪2,000 — אפשר לרמוז לנאמנות בעדינות.',
      'בלי הגזמות, בלי סופרלטיבים ריקים, בלי לציין סכומים מעבר לנאמר. לסיים בברכה חמה.',
      'להחזיר את המכתב בלבד — בלי הקדמות.',
    ],
    'הפרומפט-המלא סטה',
  );
  n++;
  _eq(lines.length, 6, 'מספר-שורות מלא שגוי');
  n++;
  _eq(lines[2], 'התרומה יועדה ל: אמץ חתן.', 'שורת-הייעוד שגויה');
  n++;
  _eq(
    lines[3],
    'סה"כ תרומותיו/ה עד כה: ₪2,000 — אפשר לרמוז לנאמנות בעדינות.',
    'שורת-המצטבר שגויה',
  );
  n++;

  // 3) orgName ריק ⇒ 'הארגון' (דוגמה-3; || של JS על '' — חוק-7).
  final emptyOrg = thanksPrompt({
    'orgName': '',
    'supporterName': 'א',
    'lastAmount': '₪1',
  });
  if (!emptyOrg.split('\n')[0].endsWith('מארגון "הארגון"')) {
    throw StateError('FAIL: orgName ריק לא נפל ל"הארגון"');
  }
  n++;

  // 3ב) orgName חסר לגמרי (undefined) ⇒ אותו נפילת-ברירת-מחדל.
  final noOrg = thanksPrompt({'supporterName': 'א', 'lastAmount': '₪1'});
  if (!noOrg.split('\n')[0].endsWith('מארגון "הארגון"')) {
    throw StateError('FAIL: orgName חסר לא נפל ל"הארגון"');
  }
  n++;

  // 4) רק totalSoFar ⇒ 5 שורות, בלי שורת-ייעוד (דוגמה-4).
  final half = thanksPrompt({
    'orgName': 'מאור',
    'supporterName': 'א',
    'lastAmount': '₪1',
    'totalSoFar': '₪9',
  });
  _eq(half.split('\n').length, 5, 'מספר-שורות חלקי שגוי');
  n++;
  if (half.contains('התרומה יועדה')) {
    throw StateError('FAIL: שורת-ייעוד הופיעה שלא-כדין');
  }
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    thanksPrompt({
          'orgName': 'x',
          'supporterName': 'y',
          'lastAmount': 'z',
        }).split('\n').length ==
        4,
    'assert-live guard',
  );

  print('OK thanksPrompt: $n asserts passed');
}
