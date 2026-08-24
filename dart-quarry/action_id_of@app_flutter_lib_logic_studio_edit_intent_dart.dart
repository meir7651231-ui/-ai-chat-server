// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _actionIdOf — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_intent.dart:287-302 (16 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? _actionIdOf(Map<String, dynamic> m) {
  final a = m['action'];
  if (a is String) {
    final t = a.trim();
    return t.isEmpty ? null : t;
  }
  if (a is Map) {
    final k = a['kind'];
    if (k is String && k.trim().isNotEmpty) return k.trim();
  }
  return null;
}

/// The list of raw op entries from a decoded reply: a top-level JSON array (the
/// grammar), an `{"ops":[…]}` envelope, or a single op object. Anything else → empty
/// (so a `{}` / `{"key":"x"}` / a bare scalar yields no ops — a clean empty).
