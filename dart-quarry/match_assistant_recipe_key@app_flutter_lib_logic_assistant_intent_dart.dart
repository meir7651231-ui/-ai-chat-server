// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · matchAssistantRecipeKey — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/assistant_intent.dart:82-98 (17 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? matchAssistantRecipeKey(String reply) {
  final r = reply.trim();
  if (r.isEmpty) return null;
  for (final p in kSmartProducts) {
    if (r == p.key) return p.key;
  }
  // Longest contained key — keys collide by prefix (faucet⊂kitchenFaucet,
  // basin⊂basinTrap), so first-match would propose the wrong kit on a wrapped reply.
  String? best;
  for (final p in kSmartProducts) {
    if (r.contains(p.key) && (best == null || p.key.length > best.length)) {
      best = p.key;
    }
  }
  return best;
}

