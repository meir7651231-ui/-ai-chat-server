// ⚛️ אטום-Dart (דרגת-חוזה) · productSuitableForTemp
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:65-157 (‏productSuitableForTemp
//        בראש-הקטע, :65-70; חוק-4 — התנהגות זהה, לא-משופרת).
// תפקיד: האם מוצר-אינסטלציה עומד בטמפרטורת-הקו — נכון אם אין דירוג-חום (null)
//        או שהטמפרטורה אינה גבוהה מהמקסימום המותר.
// טוהר: פונקציית top-level עצמאית. השכן `productMaxTempC(p)` (שקע-מועמד בכותרת-הטיוטה)
//        = דירוג-החום-המרבי של המוצר — הופך לשקע-ערך `maxTempC` (חוק-3/דיבר-3:
//        קריאה-לשכן ⇒ פרמטר-שקע). כך נשמט הצורך בטיפוס-השכן `LipskeyCatalogProduct`
//        (‏p שימש אך-ורק כדי לחלץ את maxTempC). אין import-אטום.
//
// קלט:  tempC    — טמפרטורת-הקו (int, °C).
//       maxTempC — שקע: דירוג-החום-המרבי של המוצר (int?, °C). `null` = אין דירוג/ללא-הגבלה.
// פלט:  bool — ‏maxTempC == null || tempC <= maxTempC (install_engine.dart:66-67).

/// Does the product tolerate the line temperature? Verbatim behaviour of
/// install_engine.dart:65-67, with the `productMaxTempC(p)` sibling call lifted
/// to the `maxTempC` value-socket. `maxTempC == null` (no rating) ⇒ always true.
bool productSuitableForTemp(int tempC, {required int? maxTempC}) =>
    maxTempC == null || tempC <= maxTempC;
