// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _frictionFactor — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/pressure_drop.dart:319-326 (8 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
double _frictionFactor(double reynolds) {
  if (reynolds < 100) return 0.64; // very slow trickle — cap to avoid blow-up
  if (reynolds < 2300) return 64.0 / reynolds;
  // Blasius — valid up to Re ≈ 1e5; beyond that real Colebrook would tweak
  // by < 10%, an error band well below the K-value uncertainty anyway.
  return 0.316 / _pow025(reynolds);
}

