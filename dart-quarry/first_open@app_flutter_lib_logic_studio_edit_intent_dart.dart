// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _firstOpen — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_intent.dart:314-322 (9 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int _firstOpen(String s) {
  final brace = s.indexOf('{');
  final bracket = s.indexOf('[');
  if (brace < 0) return bracket;
  if (bracket < 0) return brace;
  return brace < bracket ? brace : bracket;
}

/// The latest closing `}` or `]` in [s], or -1 (nothing closed).
