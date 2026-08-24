// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _galvanicallyDissimilar — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:158-170 (13 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toSet, intersection
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool _galvanicallyDissimilar(Iterable<String> mats) {
  const copperGroup = {'נחושת', 'פליז'};
  const ironGroup = {'פלדה', 'נירוסטה'};
  final s = mats.toSet();
  return s.intersection(copperGroup).isNotEmpty &&
      s.intersection(ironGroup).isNotEmpty;
}

/// A one-way (directional) flow device — a copper check valve (אל-חזור / אלחוזר,
/// flap or spring) or a sewage backflow preventer (category 'אל חזור'). These
/// must be installed facing the flow; the engine models their two ends as
/// identical (so it cannot yet reject a backwards orientation), so a line that
/// contains one is flagged for manual orientation verification.
