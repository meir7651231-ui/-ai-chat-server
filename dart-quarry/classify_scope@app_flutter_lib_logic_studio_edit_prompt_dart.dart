// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · classifyScope — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_prompt.dart:147-167 (21 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): studioScopeTokens, matchElementId, contains, elementIds
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? classifyScope(String reply, RegistryView registry) {
  final r = reply.trim();
  if (r.isEmpty) return null; // fail-closed → clarify

  // The broadcast + per-namespace tokens are distinctive (`scope:` prefixed), so the
  // longest-contained matcher can't false-fire on prose (e.g. "install" ⊅ scope:all).
  final tokens = studioScopeTokens(registry);
  final t = matchElementId(FakeRegistryView.of(ids: tokens), r);
  if (t != null) return t;

  // A single concrete element — `scope:single:<id>` where <id> is a REAL registry id.
  if (r.contains(kScopeSinglePrefix)) {
    final id = matchElementId(registry, r); // grounds the id part against elementIds()
    if (id != null) return '$kScopeSinglePrefix$id';
  }
  return null; // nothing groundable → ambiguous → clarify (never a guessed scope)
}

/// The concrete in-scope element ids for [scope] (the Stage-B slice). `scope:all` →
/// every id; `scope:screen:<ns>` → the ids in that namespace; `scope:single:<id>` →
/// that one id IF real. An unrecognised scope → empty (fail-closed).
