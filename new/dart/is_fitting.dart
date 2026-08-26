// ⚛️ אטום-Dart (דרגת-חוזה) · isFitting
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:615-622
//        (‏_fittingCats + isFitting; חוק-4 — התנהגות זהה בדיוק, לא-משופרת).
//        אימות-עוגן: ‏install_engine.dart:622 = `bool isFitting(p) =>
//        _fittingCats.contains(p.categoryHe);` — סעיף-יחיד, ללא companyCatalog.
// טוהר: פונקציית top-level עצמאית, אפס import פנימי (רק שפה/סטנדרט).
//       ‏_fittingCats = דאטה-קבוע פנימי של האטום (רשימת-קטגוריות, לא הקשר/זהות/סוד).
//
// אין שקע: האטום קורא אך ורק את `p.categoryHe` — מועבר ישירות כ-String.
//   (במקור `isFitting(LipskeyCatalogProduct p) => _fittingCats.contains(p.categoryHe)`).
//
// התנהגות (מקור:622): קטגוריות מחבר/מתאם טהורות — פטמות, בושינגים, מצמדים,
//   ברכיים, אטמים, קטעי-צינור. אלה מה שאינסטלטור מוסיף *רק* לגישור-פער, ולכן
//   מותרים כמילוי-אוטומטי; התקנים תפקודיים (ברזים/מחלקים/משאבות) אינם כאן.
//
// קלט:  categoryHe — קטגוריית-המוצר בעברית (‏p.categoryHe).
// פלט:  bool — האם המוצר הוא אביזר-מחבר (fitting).

/// Pure connector/adapter categories — nipples, bushings, couplers, elbows,
/// gaskets, pipe segments (verbatim: install_engine.dart:615-620).
const _fittingCats = {
  'אביזרי נחושת', 'אביזרי תבריג', 'מחברי HDPE', 'מחברי NTM', 'אביזרי שקע-תקע',
  'ברכיים', 'מסעפים וחיבורי אסלה', 'אטמים ופקקים', 'מצמדים וצינורות', 'צינורות',
  'צינורות אפורות', 'צינורות PP', 'אביזרי חיבור', 'סטי הידוק וחיבורים',
  'פקקים וצינורות', 'זקיף אסלה',
};

bool isFitting(String categoryHe) => _fittingCats.contains(categoryHe);
