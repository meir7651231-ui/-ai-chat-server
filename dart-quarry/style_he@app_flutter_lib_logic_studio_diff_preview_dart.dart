// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _styleHe — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/diff_preview.dart:184-195 (12 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): allowedValues, contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _styleHe(String id, CfgStyle? style, RegistryView registry) {
  final token = style?.colorToken;
  if (token == null) return 'שינוי עיצוב: $id';
  // §10 — precise only when the registry vouches for the token (skip when unknown).
  if (registry.allowedValues(id, 'color').contains(token)) {
    return 'שינוי צבע: $id ← ${_colorHe(token)}';
  }
  return 'שינוי צבע: $id';
}

/// The Hebrew name for a `BsTokens` color token (§10 before→after). An unrecognised
/// token degrades to itself (never throws). Mirrors the owner-facing color vocabulary.
