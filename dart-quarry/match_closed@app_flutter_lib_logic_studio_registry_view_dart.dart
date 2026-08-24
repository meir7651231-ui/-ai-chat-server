// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _matchClosed — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/registry_view.dart:237-260 (24 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? _matchClosed(Set<String> closed, String reply) {
  final r = reply.trim();
  if (r.isEmpty) return null; // early guard (assistant_intent.dart:60,82)
  // Exact wins outright — short-circuits before the contained scan, so an exact
  // short key isn't shadowed by a longer key that merely contains it.
  for (final k in closed) {
    if (r == k) return k;
  }
  // Longest-contained fallback (the model may wrap the key in quotes/prose). Many
  // keys are prefixes of others (faucet⊂kitchenFaucet, card⊂card.order); first-match
  // would grab the short prefix → the wrong key (the central collision defect).
  String? best;
  for (final k in closed) {
    if (k.isNotEmpty &&
        r.contains(k) &&
        (best == null || k.length > best.length)) {
      best = k;
    }
  }
  return best;
}

/// The pure core for addition-a: EVERY key from [closed] contained in [reply] (not
/// just the best). A blank reply → empty set; only real, non-empty keys. NEVER throws.
