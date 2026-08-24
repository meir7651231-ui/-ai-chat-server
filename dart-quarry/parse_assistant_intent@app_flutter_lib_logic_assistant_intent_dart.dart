// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · parseAssistantIntent — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/assistant_intent.dart:170-213 (44 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): lastIndexOf, answer, jsonDecode, substring, matchAssistantCategory, matchAssistantRecipeKey
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
AssistantIntent parseAssistantIntent(String raw) {
  final text = raw.trim();
  final start = text.indexOf('{');
  final end = text.lastIndexOf('}');
  if (start < 0 || end <= start) {
    return AssistantIntent.answer(text); // not JSON → treat as a plain answer
  }
  try {
    final decoded = jsonDecode(text.substring(start, end + 1));
    if (decoded is! Map) return AssistantIntent.answer(text);
    final actionStr =
        decoded['action'] is String ? (decoded['action'] as String).trim() : '';
    final key =
        decoded['key'] is String ? (decoded['key'] as String).trim() : '';
    final say =
        decoded['say'] is String ? (decoded['say'] as String).trim() : '';
    final action = _actionFromString(actionStr);
    if (action == null) {
      // Unknown action → fall back to conversation (carry say if any).
      return AssistantIntent.answer(say.isNotEmpty ? say : text);
    }
    if (action == AssistantAction.findProduct) {
      final cat = matchAssistantCategory(key); // closed-set validation
      if (cat == null) {
        return AssistantIntent.answer(
            say.isNotEmpty ? say : 'לא הבנתי איזה מוצר — נסה לתאר אחרת.');
      }
      return AssistantIntent(action: action, key: cat, say: say);
    }
    if (action == AssistantAction.addToCart) {
      final recipe = matchAssistantRecipeKey(key); // closed-set validation
      if (recipe == null) {
        return AssistantIntent.answer(
            say.isNotEmpty ? say : 'לא הבנתי איזו ערכה — נסה לתאר אחרת.');
      }
      return AssistantIntent(action: action, key: recipe, say: say);
    }
    // Read-only, no key needed.
    return AssistantIntent(action: action, say: say);
  } catch (_) {
    return AssistantIntent.answer(text); // malformed JSON → plain answer
  }
}

