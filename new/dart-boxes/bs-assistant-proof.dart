// 🧪 הוכחה · bs-assistant (בנייה-חכמה) — עוזר-ההכוונה דרך הקופסה.
// golden נגזר מהתנהגות-המקור (assistant_intent.dart) + נתוני-קטלוג-אמת (smart_tree.dart).
import 'bs-assistant.dart' as B;

int n = 0, fails = 0;
void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

void main() {
  // ── assistantCategories: דדופ + מיון (UTF-16; ASCII קודם-עברית) ──────────────
  ok('categories dedup+sort',
      B.assistantCategories(const ['ברזים', 'צנרת', 'ברזים', 'אמבט']).toString() ==
          const ['אמבט', 'ברזים', 'צנרת'].toString());
  ok('categories ascii-before-hebrew',
      B.assistantCategories(const ['PPR', 'ברז']).toString() ==
          const ['PPR', 'ברז'].toString());
  ok('categories empty ⇒ []', B.assistantCategories(const []).isEmpty);

  // ── matchAssistantCategory: מדויק גובר, אחרת המוכל-הארוך ────────────────────
  const cats = ['plumbing', 'electric', 'plumbingPro'];
  ok('matchCategory exact', B.matchAssistantCategory('electric', cats) == 'electric');
  ok('matchCategory longest-contained',
      B.matchAssistantCategory('רוצה plumbingPro בבקשה', cats) == 'plumbingPro');
  ok('matchCategory no-match ⇒ null', B.matchAssistantCategory('zzz', cats) == null);
  ok('matchCategory blank ⇒ null', B.matchAssistantCategory('   ', cats) == null);

  // ── matchAssistantRecipeKey: prefix-collision ⇒ המוכל-הארוך ─────────────────
  const keys = ['faucet', 'kitchenFaucet', 'basinTrap'];
  ok('matchRecipe exact-first', B.matchAssistantRecipeKey('faucet', keys) == 'faucet');
  ok('matchRecipe longest-contained',
      B.matchAssistantRecipeKey('הרכב לי kitchenFaucet', keys) == 'kitchenFaucet');
  ok('matchRecipe no-match ⇒ null', B.matchAssistantRecipeKey('zzz', keys) == null);

  // מתאם-הנוחות: קירקוע מול רשומות-ערכה (חילוץ .key) — נתוני-אמת מ-smart_tree.dart
  const recipes = <B.Recipe>[
    (key: 'basinTrap', name: 'סיפון לכיור רחצה'),
    (key: 'kitchenFaucet', name: 'ברז מטבח'),
  ];
  ok('matchRecipeFromList', B.matchRecipeFromList('addToCart basinTrap', recipes) == 'basinTrap');

  // ── assistantIntentPrompt: היסטוריה-ריקה ⇒ אין בלוק-שיחה; שורות-קבועות נוכחות ──
  final p1 = B.assistantIntentPrompt(const [], 'שלום',
      categories: const ['ברזים', 'צנרת'], recipes: recipes);
  ok('prompt no history block', !p1.contains('השיחה עד כה'));
  ok('prompt user line', p1.contains('המשתמש כתב: "שלום".'));
  ok('prompt recipe line', p1.contains('basinTrap=סיפון לכיור רחצה'));
  ok('prompt categories', p1.contains('ברזים\nצנרת'));
  ok('prompt format line', p1.contains('{"action":"...","key":"...","say":"..."}'));

  // ── חלון-השיחה (kIntentHistoryWindow=12): 13 תורים ⇒ הראשון נחתך ──────────────
  final many = [
    for (var i = 0; i < 13; i++)
      B.IntentTurn(user: true, text: 't$i'),
  ];
  final p2 = B.assistantIntentPrompt(many, 'q',
      categories: const ['ברזים'], recipes: recipes);
  ok('prompt window trims oldest (t0)', !p2.contains('משתמש: t0\n'));
  ok('prompt window keeps newest (t12)', p2.contains('משתמש: t12'));
  ok('prompt history header', p2.contains('השיחה עד כה:'));

  // ── דבק-החיטוי (_promptSafeText): קיצוץ ל-600 ───────────────────────────────
  final p3 = B.assistantIntentPrompt(const [], 'x' * 700,
      categories: const ['ברזים'], recipes: recipes);
  ok('sanitizer trims to 600', p3.contains('x' * 600) && !p3.contains('x' * 601));

  if (fails > 0) {
    print('❌ bs-assistant: $fails אי-התאמות');
    throw StateError('bs-assistant proof failed');
  }
  print('✓ קופסת-bs-assistant (בנייה-חכמה): $n טענות — עוזר-הכוונה (categories/prompt/match)');
}
