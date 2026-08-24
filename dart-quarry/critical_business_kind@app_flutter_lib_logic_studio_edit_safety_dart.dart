// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _criticalBusinessKind — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_safety.dart:189-212 (24 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
_CriticalKind? _criticalBusinessKind(ElementDescriptor d) {
  final id = d.id.toLowerCase();
  final label = d.labelHe;
  // (c) order-confirmation control — the plan's exact "אשר הזמנה" surface.
  if (label.contains('אשר הזמנה') ||
      id.contains('confirmorder') ||
      id.contains('approveorder')) {
    return _CriticalKind.confirmOrder;
  }
  // (b) price control.
  if (id.contains('price') || label.contains('מחיר')) {
    return _CriticalKind.price;
  }
  return null;
}

// ─── role-visibility floor (R1-6 · §4 · derived from the registry, §9 addition-a) ─
// The floor is read from the FROZEN descriptor (`kRoleFloor` in the `roleProvider`
// string space + the structural `area`/`kind` signal) — NOT a hard-coded persona
// list, so it tracks the registry as the model grows (§9 addition-a).

/// True when [d] is a NAVIGATION / structural surface (a nav bar / tab container)
/// whose GLOBAL hide would orphan the app for EVERY persona. Derived from the
/// registry (`area == 'nav'` or a container kind), never an id list.
