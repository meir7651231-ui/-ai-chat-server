// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _kindEmoji — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/diff_preview.dart:140-150 (11 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _kindEmoji(ConfigOpKind kind) => switch (kind) {
      ConfigOpKind.setText => '✏️',
      ConfigOpKind.setEmoji => '🙂',
      ConfigOpKind.setHidden => '🙈',
      ConfigOpKind.setOrder => '↕️',
      ConfigOpKind.setStyle => '🎨',
      ConfigOpKind.setAction => '⚙️',
    };

/// The Hebrew plural noun for a kind's grouped count (§9). A SetStyle group is
/// "צבעים" only when [styleAllColor] (every op is a color change), else "עיצובים".
