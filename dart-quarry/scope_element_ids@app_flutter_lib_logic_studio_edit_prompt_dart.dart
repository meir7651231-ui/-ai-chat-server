// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · scopeElementIds — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_prompt.dart:168-188 (21 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): elementIds, substring, contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Set<String> scopeElementIds(String scope, RegistryView registry) {
  final ids = registry.elementIds();
  if (scope == kScopeAll) return ids;
  if (scope.startsWith(kScopeScreenPrefix)) {
    final ns = scope.substring(kScopeScreenPrefix.length);
    return {
      for (final id in ids)
        if (_namespaceOf(id) == ns) id,
    };
  }
  if (scope.startsWith(kScopeSinglePrefix)) {
    final id = scope.substring(kScopeSinglePrefix.length);
    return ids.contains(id) ? {id} : const <String>{};
  }
  return const <String>{}; // fail-closed
}

/// The Hebrew preview label for [scope] — the "מתוך: …" line surfaced before the
/// changes (§4), so step-79/83 can confirm the TARGET ("מתוך: מרחב «cart»" /
/// "מתוך: כל האלמנטים") before showing a diff. Shows the grounded token verbatim —
/// there is no Hebrew screen name to translate through the frozen seam.
