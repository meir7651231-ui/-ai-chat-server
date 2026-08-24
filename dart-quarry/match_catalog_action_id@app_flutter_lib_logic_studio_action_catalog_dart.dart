// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · matchCatalogActionId — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/action_catalog.dart:266-279 (14 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): matchElementId, actionIdsFor, catalogActionIdsFor
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? matchCatalogActionId(String reply) =>
    matchElementId(_catalogActionView, reply);

/// Addition-a (§7.5 precursor): the catalog subset legal for an element's editing
/// CONTEXT. A read-only surface (a display-only card / an immutable region,
/// [readOnly] = true) must NEVER expose a MUTATOR — it sees only nav / open /
/// share, never `cart.add`; a mutable context sees the whole catalog.
///
/// This is the CONTEXT axis that COMPLEMENTS — does not duplicate —
/// [RegistryView.actionIdsFor]: the registry says which actions an element ALLOWS
/// (its per-element closed set); THIS says which catalog actions the element's
/// read/write context permits. The step-82 builder intersects the two
/// (`reg.actionIdsFor(id) ∩ catalogActionIdsFor(id, readOnly: …)`). A blank
/// [elementId] is fail-closed (empty), mirroring the matchers.
