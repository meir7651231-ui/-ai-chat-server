// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _colorForToken — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_safety.dart:254-277 (24 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): computeLuminance
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Color? _colorForToken(String? token) {
  switch (token) {
    case 'brand':
      return BsTokens.brand;
    case 'brandDark':
      return BsTokens.brandDark;
    case 'success':
      return BsTokens.success;
    case 'danger':
      return BsTokens.danger;
    case 'warn':
      return BsTokens.warnText;
    case 'ink':
      return BsTokens.inkLight;
    case 'muted':
      return BsTokens.mutedLight;
    default:
      return null;
  }
}

/// The WCAG contrast ratio between two colors: (L_lighter+0.05)/(L_darker+0.05),
/// each luminance from `dart:ui`'s `Color.computeLuminance()` (relative sRGB
/// luminance). Symmetric; ≥ 1.0. Pure.
