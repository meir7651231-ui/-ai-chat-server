// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · ruleActionIsMutating — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/rules_model.dart:167-179 (13 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool ruleActionIsMutating(String actionId) {
  for (final a in kRuleActions) {
    if (a.id == actionId) return a.mutating;
  }
  return false;
}

// ─── the closed-set matcher (COPY of registry_view.dart:237 `_matchClosed`) ────

/// Resolve [reply] to a member of [closed] — exact first, else the LONGEST key
/// CONTAINED in the trimmed reply, else `null`. Blank reply / empty set → `null`
/// (fail-closed). NEVER throws. Empty keys are skipped so a stray `''` can't
/// spuriously "contain". The ONE path from a model string to a real closed-set id.
