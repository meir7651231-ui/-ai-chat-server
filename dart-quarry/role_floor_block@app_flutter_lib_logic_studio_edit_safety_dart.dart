// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _roleFloorBlock — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_safety.dart:226-253 (28 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? _roleFloorBlock(ElementDescriptor d, String? persona) {
  final floor = d.kRoleFloor;
  final isGlobal = persona == null || persona.isEmpty; // null = every persona
  if (isGlobal) {
    if (_isNavStructural(d)) {
      return 'אי-אפשר להסתיר «${d.labelHe}» מכל הפרסונות (כולל קבלן) — '
          'רכיב ניווט חייב להישאר גלוי';
    }
    if (floor != _kRoleContractor) {
      return 'אי-אפשר להסתיר «${d.labelHe}» מכל הפרסונות — '
          'הרכיב חייב להישאר גלוי לתפקיד «$floor»';
    }
    return null; // a mundane, non-structural element MAY be hidden app-wide.
  }
  // SINGLE persona: legal unless we hide it from the very role it is critical for.
  if (persona == floor && floor != _kRoleContractor) {
    return 'אי-אפשר להסתיר «${d.labelHe}» מהתפקיד «$floor» — קריטי לתפקיד זה';
  }
  return null;
}

// ─── color / contrast helpers (§4 — no existing helper, per the plan) ────────

/// Resolve an owner-facing color TOKEN to its concrete [Color], or `null` for an
/// unknown token (e.g. a raw hex the model invented — which never resolves). Reads
/// the concrete colors straight from the `BsTokens` SSOT (mirrors the wrappers'
/// `cfgColorFromToken` vocabulary, widgets/studio/cfg_text.dart:21) — never a raw
/// hex here, so the safety layer stays widget-free AND clears the color-ratchet.
