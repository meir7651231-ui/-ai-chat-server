// בדיקת-חוזה (רתמת-זהב) · guideIntro — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/guide-intro.test.mjs:
//   הצילום (SNAP['GUIDE_INTRO']) הוא JSON.stringify של הקבוע — הערך עטוף במרכאות-כפולות.
//   ‏jsonEncode של Dart מקביל ל-JSON.stringify עבור מחרוזת (עטיפת-מרכאות + escaping זהה;
//   הערך נטול בקסלאש/מרכאה/בקרה ⇒ עטיפה בלבד) ⇒ מחרוזת זהה-ביט. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/guide-intro_test.dart  ⇒ exit 0
import 'dart:convert';
import 'guide-intro.dart';

// הצילום המדויק ממקור-ה-JS (SNAP['GUIDE_INTRO']) — הערך עטוף במרכאות-כפולות.
const String _snap =
    '"אי אפשר לקלקל — הכל נשמר לבד · ↩ חזרה מחזיר אחורה · Esc סוגר כל חלון · '
    'אבודים? ⌕ חיפוש מוצא הכל (גם עם שגיאות כתיב) · ▶ הדמיה מראה את המערכת לבד."';

void main() {
  var n = 0;

  // 1) רתמת-הזהב: jsonEncode ≡ JSON.stringify — מחרוזת זהה-ביט לצילום-המקור.
  final got = jsonEncode(guideIntro);
  if (got != _snap) {
    throw StateError('FAIL צילום-ערך סטה:\n got =$got\n want=$_snap');
  }
  n++;

  // 2) השוואת-ערך-גולמי מפורשת — הערך ללא-עטיפה זהה למקור (חיזוק ישיר).
  const want =
      'אי אפשר לקלקל — הכל נשמר לבד · ↩ חזרה מחזיר אחורה · Esc סוגר כל חלון · '
      'אבודים? ⌕ חיפוש מוצא הכל (גם עם שגיאות כתיב) · ▶ הדמיה מראה את המערכת לבד.';
  if (guideIntro != want) {
    throw StateError('FAIL ערך-גולמי סטה:\n got =$guideIntro\n want=$want');
  }
  n++;

  // 3) typeof === 'string' — ב-Dart: הטיפוס הוא String.
  if (guideIntro is! String) {
    throw StateError('FAIL guideIntro אינו String');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(jsonEncode(guideIntro) == _snap, 'assert-live guard');
  assert(guideIntro.startsWith('אי אפשר לקלקל'), 'assert-live guard prefix');

  print('✓ guideIntro: $n דוגמאות-חוזה — ירוק');
}
