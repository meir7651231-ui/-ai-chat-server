// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _kindPlural — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/diff_preview.dart:151-164 (14 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _kindPlural(ConfigOpKind kind, bool styleAllColor) => switch (kind) {
      ConfigOpKind.setText => 'טקסטים',
      ConfigOpKind.setEmoji => 'אמוג׳ים',
      ConfigOpKind.setHidden => 'הסתרות',
      ConfigOpKind.setOrder => 'שינויי סדר',
      ConfigOpKind.setStyle => styleAllColor ? 'צבעים' : 'עיצובים',
      ConfigOpKind.setAction => 'פעולות',
    };

// ─── per-op Hebrew rows (small diff) ─────────────────────────────────────────

/// The human Hebrew line for ONE op — the target id plus the axis it edits, using
/// the action catalog's `he` for a `SetAction` and the §10 before→after for a
/// constrained `SetStyle(color)`. Exhaustive over the sealed family; always non-empty.
