// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · matchAssistantCategory — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/assistant_intent.dart:60-81 (22 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): assistantCategories, contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? matchAssistantCategory(String reply) {
  final r = reply.trim();
  if (r.isEmpty) return null;
  final cats = assistantCategories();
  for (final c in cats) {
    if (r == c) return c;
  }
  // Longest contained match (a category name may be a substring of a longer one);
  // first-match could grab a shorter prefix category on a wrapped reply.
  String? best;
  for (final c in cats) {
    if (r.contains(c) && (best == null || c.length > best.length)) {
      best = c;
    }
  }
  return best;
}

/// Resolve a recipe reply to a REAL `kSmartProducts` key — exact then contained.
/// Returns null when the reply names no real recipe (the closed-set guard for
/// `addToCart`; mirrors `matchRecipe`). The screen turns the key into the real
/// kit and only writes the cart on the user's confirm tap.
