// 📦 קופסת-חיבורים · bs-assistant (בנייה-חכמה) — עוזר-הכוונה (Intent) של BuildSmart.
// חוזה: אטומי-המקור ב-../dart/ (assistant_*). מקור-האמת: buildsmart/app_flutter/lib/logic/assistant_intent.dart.
// מחווטת 4 אטומי-בנייה-חכמה: assistantCategories · assistantIntentPrompt ·
// matchAssistantCategory · matchAssistantRecipeKey.
//
// ⚠️ בדיקת-שקע-fuzzy (הוראת-המשימה): match_assistant_* **אינם** דורשים שקע-fuzzy —
//    חתימתם (match_assistant_category.dart / match_assistant_recipe_key.dart) מקרקעת
//    ב-מדויק-גובר + המוכל-הארוך-ביותר (r.contains(c)) על רשימה מוזרקת בלבד; אפס
//    fuzzy_match/damerau_levenshtein. לכן — בשונה מ-bs-matching.dart — אין כאן שקעי-fuzzy.
//
// הכרעות-קופסה (חוק-5 · מדיניות/דבק שאינם אטומים):
//  1. kIntentHistoryWindow = 12 — const-מודול verbatim מהמקור (assistant_intent.dart) ⇒
//     שקע historyWindow. חלון-השיחה-האחרון שנשלח ל-prompt.
//  2. _promptSafeText — שקע-פונקציה. העוזר promptSafeText **אינו קיים ב-checkout ולא באטום**
//     (נמחק מהמקור; שאר-האטומים מזריקים אותו כשקע). הקופסה מספקת מימוש-חיטוי נאמן-לחוזה:
//     המרת-תווי-בקרה לרווח (מניעת-שבירת-שורות/הזרקה) → trim → קיצוץ-ל-maxLen.
//  3. מתאמי-טיפוס: re-export ל-IntentTurn (טיפוס-השכן המוטבע באטום) + חילוץ-מפתחות
//     מרשומות-הערכה (recipes.key) לצורך matchAssistantRecipeKey.
import '../dart/assistant_categories.dart' as ac;
import '../dart/assistant_intent_prompt.dart' as aip;
import '../dart-data/assistant-prompt-copy.dart' as apc; // דאטה — נוסחי-פרומפט מוזרקים
import '../dart/match_assistant_category.dart' as mac;
import '../dart/match_assistant_recipe_key.dart' as mark;

// ── מתאם-טיפוס: הטיפוס-המוטבע של האטום נחשף כלפי-חוץ ──────────────────────────
typedef IntentTurn = aip.IntentTurn;
typedef Recipe = ({String key, String name});

// ── הכרעת-קופסה 1: חלון-השיחה (verbatim const מ-assistant_intent.dart) ─────────
const int kIntentHistoryWindow = 12;

// ── הכרעת-קופסה 2: דבק-החיטוי (promptSafeText חסר ב-checkout ⇒ מימוש-קופסה) ────
// חתימת-השקע כפי שהאטום קורא: (String text, {required int maxLen}).
// חוזה: טקסט-בטוח באורך חסום. המרת-תווי-בקרה לרווח, trim, ואז קיצוץ ל-maxLen.
String _promptSafeText(String text, {required int maxLen}) {
  var t = text.replaceAll(RegExp(r'[\x00-\x1f]+'), ' ').trim();
  if (t.length > maxLen) t = t.substring(0, maxLen);
  return t;
}

// ── החיווט ────────────────────────────────────────────────────────────────────

/// קטגוריות-ייחודיות-ממוינות של הקטלוג הפעיל (assistantCategories verbatim).
List<String> assistantCategories(Iterable<String> categories) =>
    ac.assistantCategories(categories: categories);

/// prompt-סיווג-הכוונה: חלון-שיחה (kIntentHistoryWindow) + קטגוריות + ערכות (key=name),
/// עטוף בהוראות-ה-JSON. הזרקת historyWindow + promptSafeText היא הכרעת-קופסה.
String assistantIntentPrompt(
  List<IntentTurn> history,
  String userText, {
  required List<String> categories,
  required List<Recipe> recipes,
}) =>
    aip.assistantIntentPrompt(
      history,
      userText,
      historyWindow: kIntentHistoryWindow,
      categories: categories,
      recipes: recipes,
      promptSafeText: _promptSafeText,
      copy: apc.kAssistantIntentPromptCopyHe, // דאטה מוזרקת (dart-data/)
    );

/// מקרקע [reply] לקטגוריה-אמת מתוך [categories] — מדויק-גובר, אחרת המוכל-הארוך; null אם אין.
String? matchAssistantCategory(String reply, List<String> categories) =>
    mac.matchAssistantCategory(reply, categories: categories);

/// מקרקע [reply] למפתח-ערכה מתוך [productKeys] — מדויק-גובר, אחרת המוכל-הארוך; null אם אין.
String? matchAssistantRecipeKey(String reply, List<String> productKeys) =>
    mark.matchAssistantRecipeKey(reply, productKeys: productKeys);

/// נוחות: מקרקע [reply] ישירות מול רשומות-הערכה (מחלץ recipes.key ⇒ matchAssistantRecipeKey).
String? matchRecipeFromList(String reply, List<Recipe> recipes) =>
    matchAssistantRecipeKey(reply, [for (final r in recipes) r.key]);
