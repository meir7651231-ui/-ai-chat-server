// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _rawOps — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_intent.dart:303-313 (11 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<Object?> _rawOps(Object? decoded) {
  if (decoded is List) return decoded;
  if (decoded is Map) {
    final ops = decoded['ops'];
    if (ops is List) return ops;
    if (decoded['op'] != null) return <Object?>[decoded]; // a lone op object.
  }
  return const <Object?>[];
}

/// The earliest opening `{` or `[` in [s], or -1 (no JSON structure at all).
