// ⚛️ אטום-Dart (דרגת-חוזה) · galvanicallyDissimilar
// תפקיד: האם אוסף-חומרים מכיל צימוד-מתכות בלתי-דומה (נחושת/פליז יחד עם פלדה/נירוסטה) — מחייב מפריד דיאלקטרי.
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:158-170 (‏_galvanicallyDissimilar; חוק-4).
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). שתי ה-const-האחיות (copperGroup/ironGroup)
//        הוטבעו inline verbatim מגוף-הטיוטה. `Iterable.toSet`/`Set.intersection`/`isNotEmpty` = שפה/סטנדרט.
//        פרטי-במקור (`_`) ⇒ פורסם public. האח _isDirectionalDevice (:171) — לא נקרא ⇒ לא-הוטבע.
//
// קלט:  mats — אוסף שמות-חומרים (Iterable<String>; כפילויות מותרות, מכווצות ל-Set).
// פלט:  bool — true אם קיים לפחות חומר-נחושתי ולפחות חומר-ברזלי באוסף.

/// True iff the material set couples a copper-family metal with an iron-family
/// metal (needs a dielectric union). Verbatim of install_engine.dart:158-170.
bool galvanicallyDissimilar(Iterable<String> mats) {
  const copperGroup = {'נחושת', 'פליז'};
  const ironGroup = {'פלדה', 'נירוסטה'};
  final s = mats.toSet();
  return s.intersection(copperGroup).isNotEmpty &&
      s.intersection(ironGroup).isNotEmpty;
}
