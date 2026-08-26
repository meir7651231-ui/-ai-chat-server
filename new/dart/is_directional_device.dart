// ⚛️ אטום-Dart (דרגת-חוזה) · isDirectionalDevice
// תפקיד: האם המוצר הוא התקן-כיווני (אל-חזור) — לפי קטגוריה 'אל חזור' או שם-מנורמל המכיל 'אלחזור'/'אלחוזר'.
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:171-180 (‏_isDirectionalDevice; חוק-4 — verbatim).
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). שתי קריאות-שדה מטיפוס-השכן
//        LipskeyCatalogProduct (‏p.categoryHe, p.nameHe) קופלו לשקעי-מחרוזת (חוק-3) — הטיפוס גדול, לא-inline.
//        `String.replaceAll`/`contains` = שפה/סטנדרט. פרטי-במקור (`_`) ⇒ פורסם public.
//
// קלט:  categoryHe — שקע: קטגוריית-המוצר העברית (במקור p.categoryHe).
//        nameHe     — שקע: שם-המוצר העברי (במקור p.nameHe).
// פלט:  bool — true אם קטגוריה=='אל חזור', או שהשם ללא מקפים/רווחים מכיל 'אלחזור' או 'אלחוזר'.

/// True iff the product is a one-way (directional / check) device.
/// Verbatim of install_engine.dart:171-180 with the two product fields socketed (law-3).
bool isDirectionalDevice({required String categoryHe, required String nameHe}) {
  if (categoryHe == 'אל חזור') return true;
  final n = nameHe.replaceAll('-', '').replaceAll(' ', '');
  return n.contains('אלחזור') || n.contains('אלחוזר');
}
