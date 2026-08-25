// בדיקת-חוזה (רתמת-זהב) · guideRecipes — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/guide-recipes.test.mjs:
//   הצילום (SNAP.GUIDE_RECIPES) = הערך המדויק — JSON.stringify(GUIDE_RECIPES) חייב
//   להתאים לצילום. כאן: guideRecipes חייב להיות שווה-ביט למחרוזת-הצפויה שלמטה
//   (הצילום המפוענח: גרשיים-כפולים פנימיים, ← ⚙ 💳 ＋ · ✦ ⬇ כלשונם).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/guide-recipes_test.dart  ⇒ exit 0
import 'guide-recipes.dart';

void main() {
  var n = 0;

  // הערך-הצפוי = הצילום מבדיקת-ה-JS, מפוענח מ-JSON (גרש-כפול פנימי כפשוטו).
  const expected =
      'תשלום + קבלה ← ⚙ ליד השיבוץ ← 💳 ← ＋ קבלת תשלום · ניקוב ← כפתור "ניקוב" בכרטיס · '
      'משפחה חדשה תוך כדי שיבוץ ← "לא נמצא/ה במערכת?" · חוג מתאים לילד ← ✦ מצא חוג · '
      'תרומה ← תומכות ← לחיצה על השם ← ＋ תרומה · רשימה למורה ← החוג ← ⬇ תדפיס למורה · '
      'גיבוי ← הגדרות ← גיבוי מלא.';

  // 1) זהות-ביט לצילום.
  assert(guideRecipes == expected, 'FAIL: guideRecipes סטה מהצילום');
  n++;

  // 2) אורך-תווים תואם (מגן נוסף על תו נשמט/נוסף).
  assert(guideRecipes.length == expected.length,
      'FAIL: אורך ${guideRecipes.length} ≠ ${expected.length}');
  n++;

  // 3) מסתיים ב'גיבוי מלא.' (זנב-המקור — האזור שהמנוע נוטה לפספס).
  assert(guideRecipes.endsWith('גיבוי ← הגדרות ← גיבוי מלא.'),
      'FAIL: זנב שגוי');
  n++;

  // 4) נושא את הגרשיים-הכפולים הפנימיים כלשונם.
  assert(guideRecipes.contains('כפתור "ניקוב" בכרטיס'),
      'FAIL: גרשיים פנימיים נאבדו');
  n++;

  print('OK guideRecipes: $n asserts passed — צילום-ערך זהה-ביט (Dart≡JS)');
}
