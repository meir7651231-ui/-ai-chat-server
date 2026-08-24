// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _opTag — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_safety.dart:474-483 (10 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _opTag(ConfigOp op) => switch (op) {
      SetText() => 'setText',
      SetEmoji() => 'setEmoji',
      SetHidden() => 'setHidden',
      SetOrder() => 'setOrder',
      SetStyle() => 'setStyle',
      SetAction() => 'setAction',
    };

/// Render ONE blocked entry to a plain-text audit line — a decision trace, no IO.
