// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _matchClosed — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/rules_model.dart:180-200 (21 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains, matchTriggerId
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? _matchClosed(Set<String> closed, String reply) {
  final r = reply.trim();
  if (r.isEmpty) return null;
  for (final k in closed) {
    if (r == k) return k; // exact wins outright (`>` isn't shadowed by `>=`).
  }
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

/// Ground [reply] to a REAL trigger id, or `null` (drop the rule).
String? matchTriggerId(String reply) => _matchClosed(kRuleTriggerIds, reply);

/// Ground [reply] to a REAL condition field, or `null` (drop).
