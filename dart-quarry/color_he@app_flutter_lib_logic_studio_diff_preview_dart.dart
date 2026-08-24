// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _colorHe — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/diff_preview.dart:196-206 (11 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _colorHe(String token) => switch (token) {
      'success' => 'ירוק',
      'danger' => 'אדום',
      'warn' => 'כתום',
      'muted' => 'אפור',
      'ink' => 'כהה',
      'brand' => 'מותג',
      'brandDark' => 'מותג כהה',
      _ => token,
    };

