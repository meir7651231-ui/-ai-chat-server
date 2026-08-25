// רתמת-זהב · GUIDE_RECIPES_LABEL — assert-ים = בדיוק דוגמאות-החוזה של בדיקת-ה-JS
// (new/atoms/guide-recipes-label.test.mjs): value · length=17 · endsWith(':') · startsWith('המתכונים').
// אותם קלטים→פלטים. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/guide-recipes-label_test.dart  ⇒ exit 0
import 'guide-recipes-label.dart';

void main() {
  var n = 0;

  // 1 · value — הצילום המלא, ביט-אחר-ביט.
  assert(
    guideRecipesLabel == 'המתכונים המהירים:',
    '✗ value: "$guideRecipesLabel" ≠ "המתכונים המהירים:"',
  );
  n++;

  // 2 · length — 17 יחידות-UTF-16 (JS .length ≡ Dart String.length).
  assert(
    guideRecipesLabel.length == 17,
    '✗ length: ${guideRecipesLabel.length} ≠ 17',
  );
  n++;

  // 3 · endsWith ':'.
  assert(
    guideRecipesLabel.endsWith(':'),
    '✗ endsWith ":" נכשל',
  );
  n++;

  // 4 · startsWith 'המתכונים'.
  assert(
    guideRecipesLabel.startsWith('המתכונים'),
    '✗ startsWith "המתכונים" נכשל',
  );
  n++;

  print('✓ guide-recipes-label (Dart): $n דוגמאות-חוזה — ירוק (נוסח-לגאסי שמור)');
}
