// ⚛️ אטום-Dart (דרגת-חוזה) · colorHe
// תפקיד: תרגום token-צבע אנגלי לשם-צבע עברי (עם ברירת-מחדל = ה-token עצמו).
// מוצא: buildsmart/app_flutter/lib/logic/studio/diff_preview.dart:196-206 (‏_colorHe; חוק-4).
// אחים: אין — switch טהור, אפס שקע, אפס טיפוס-שכן.
// טוהר: dart:core בלבד.

/// token → שם-צבע עברי; token לא-מוכר ⇒ מוחזר כמות-שהוא. verbatim diff_preview.dart:196-206.
String colorHe(String token) => switch (token) {
      'success' => 'ירוק',
      'danger' => 'אדום',
      'warn' => 'כתום',
      'muted' => 'אפור',
      'ink' => 'כהה',
      'brand' => 'מותג',
      'brandDark' => 'מותג כהה',
      _ => token,
    };
