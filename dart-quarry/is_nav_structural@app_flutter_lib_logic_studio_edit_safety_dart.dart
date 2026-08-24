// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _isNavStructural — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_safety.dart:213-225 (13 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool _isNavStructural(ElementDescriptor d) =>
    d.area == 'nav' || d.kind == ElementKind.container;

/// The role-visibility floor for a `SetHidden(hidden:true)` on [d] applied to the
/// [persona] layer (`roleProvider` dialect — `null`/'' = the GLOBAL/contractor base
/// that EVERY persona inherits; a non-empty string = ONE persona's layer). Returns a
/// non-empty Hebrew reason to BLOCK, or `null` when the hide is legal. Two harms (§4):
///   • a GLOBAL hide (null persona) strips the element from EVERYONE incl contractor
///     — refused for a nav/tab surface, or for any element floored ABOVE contractor
///     (a role that MUST keep it would lose it);
///   • a SINGLE-persona hide is legal UNLESS it hides the element from the exact role
///     it is FLOORED to (a manager-critical surface hidden from `manager`). Hiding
///     from ONE persona while others keep it (§7.3) is the legal escape hatch.
