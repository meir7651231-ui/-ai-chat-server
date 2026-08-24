// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _isDirectionalDevice — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:171-180 (10 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): replaceAll, contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool _isDirectionalDevice(LipskeyCatalogProduct p) {
  if (p.categoryHe == 'אל חזור') return true;
  final n = p.nameHe.replaceAll('-', '').replaceAll(' ', '');
  return n.contains('אלחזור') || n.contains('אלחוזר');
}

/// Where a directional device at [i] sits in the built [chain], named by its
/// neighbours — so the installer knows EXACTLY which valve, and between which two
/// parts, to orient for flow (concrete, always-correct guidance; the engine can't
/// compute the flow direction itself since the valve's two ends are identical).
