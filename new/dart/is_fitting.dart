// ⚛️ אטום-Dart (דרגת-חוזה) · isFitting
// תפקיד: האם המוצר הוא אביזר-חיבור (fitting) — לפי קטגוריה ב-_fittingCats, או (כשקטלוג-החברה פעיל)
//        לפי productType ב-fittingTypes.
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:816-851 (‏isFitting; חוק-4 — התנהגות-הטיוטה).
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד).
//        · ה-const `_fittingCats` הוטבע inline verbatim (install_engine.dart:615-621 — עוגן חי, אומת).
//        · הדגל-הגלובלי `companyCatalogActive` (state חיצוני) קופל לשקע-bool (חוק-3/חוק-6).
//        · הקריאות-לשדה p.categoryHe/p.productType קופלו לשקעי-מחרוזת (LipskeyCatalogProduct גדול, לא-inline).
//        · ה-const `_fittingTypes` (הסעיף השני) **אינו-בר-שחזור** — הטיוטה מפנה אליו אך אין לו הגדרה במקור-החי
//          (grep ב-install_engine.dart ריק; ה-isFitting החי :622 בעל-סעיף-יחיד) ⇒ סוקק כ-`fittingTypes` (דיבר-9).
//        האחים _pipeCats/_isPipe/isPipe (:624+) — לא נקראים ⇒ לא-הוטבעו.
//
// קלט:  categoryHe          — שקע: קטגוריית-המוצר (במקור p.categoryHe).
//        productType         — שקע: סוג-המוצר (במקור p.productType; nullable).
//        companyCatalogActive — שקע: דגל קטלוג-חברה פעיל (state חיצוני).
//        fittingTypes        — שקע: סוגי-אביזר (const _fittingTypes בלתי-בר-שחזור).
// פלט:  bool — _fittingCats מכיל categoryHe, או (companyCatalogActive ∧ fittingTypes מכיל productType).

// עוגן חי — install_engine.dart:615-621 (verbatim).
const _fittingCats = {
  'אביזרי נחושת', 'אביזרי תבריג', 'מחברי HDPE', 'מחברי NTM', 'אביזרי שקע-תקע',
  'ברכיים', 'מסעפים וחיבורי אסלה', 'אטמים ופקקים', 'מצמדים וצינורות', 'צינורות',
  'צינורות אפורות', 'צינורות PP', 'אביזרי חיבור', 'סטי הידוק וחיבורים',
  'פקקים וצינורות', 'זקיף אסלה',
};

/// True iff the product is a connector/fitting. Behaviour of install_engine.dart:816-851
/// with `_fittingCats` inlined, and the company-catalog flag + product fields +
/// the unrecoverable `_fittingTypes` const injected as sockets (law-3/דיבר-9).
bool isFitting({
  required String categoryHe,
  required String? productType,
  required bool companyCatalogActive,
  required Set<String> fittingTypes,
}) =>
    _fittingCats.contains(categoryHe) ||
    (companyCatalogActive && fittingTypes.contains(productType));
