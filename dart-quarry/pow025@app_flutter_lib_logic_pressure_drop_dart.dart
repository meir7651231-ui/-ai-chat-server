// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _pow025 — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/pressure_drop.dart:327-333 (7 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): sqrt
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
double _pow025(double x) {
  // sqrt(sqrt(x)) — faster than dart's pow() for this hot path
  final s = x > 0 ? x : 1e-9;
  final r1 = _sqrt(s);
  return _sqrt(r1);
}

