// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _axisOf — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_intent.dart:218-230 (13 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): allowedValues
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _axisOf(ConfigOp op) => switch (op) {
      SetText() => 'text',
      SetEmoji() => 'emoji',
      SetHidden() => 'hidden',
      SetOrder() => 'order',
      SetStyle() => 'style',
      SetAction() => 'action',
    };

/// True when a free-content [value] for [prop] is acceptable: `null` (a clear) or an
/// UNCONSTRAINED axis (empty `allowedValues` — owner text/emoji), else it must ground
/// to a real member of the closed set (`matchValue`). "Where the registry constrains
/// it" = a non-empty `allowedValues(target, prop)`.
