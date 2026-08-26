// 📦 קופסת-חיבורים · שורות-הייצוא (Dart) — מחווטת 9 אטומי-Dart. מקבילה ל-new/boxes/export-rows.mjs.
// חוזה משותף: new/boxes/export-rows.contract.md. מקור-האמת: maor/src/lib/exportRows.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// החיווט הגלוי (כבמקור-ה-JS): משפחות/תומכות = חוטים ישירים (בלי שקעים);
// אירועים = חוט + שרשרת-התאריך-העברי (hebDateFull על gem/gemYear/hebParts,
// סדר-שקעים כבמקור hebrew.ts:160) + מילון-הסוגים (EV_META) + termOf.
//
// ⚠️ גבול-פלטפורמה (חוק-6): toCsv/downloadCsv (DOM) אינם בקופסה — שקע של
//   שער-הייצוא/לוח-האם, מוזרק פר-פלטפורמה. מה שמוכח כאן = בניית-השורות, זהה-ביט.
import '../dart-maor/families-import-format-rows.dart' as fif;
import '../dart-maor/supporters-import-format-rows.dart' as sif;
import '../dart-maor/events-csv-rows.dart' as ecr;
import '../dart-maor/term-of.dart' as tof;
import '../dart-maor/heb-date-full.dart' as hdf;
import '../dart-maor/gematria.dart' as gm;
import '../dart-maor/gem-year.dart' as gy;
import '../dart-maor/heb-parts.dart' as hp;
import '../dart-maor/ev-meta.dart' as em;

// ── החיווט: שרשרת-התאריך-העברי — הכרעת-הקופסה (hebrew.ts:160) ──
// JS: const hebFull = (iso) => hebDateFull(iso, gem, (y) => gemYear(y, gem), hebParts);
// סדר-השקעים (iso, gem, gemYear(·,gem), hebParts) verbatim; gemYear מקבל את gem כשקע (חוק-1).
String _hebFull(dynamic iso) =>
    hdf.hebDateFull(iso as String?, gm.gem, (y) => gy.gemYear(y, gm.gem), hp.hebParts);

// ── החשיפה ──────────────────────────────────────────────────────────────────
/// משפחות בפורמט-הייבוא (13 עמודות) — חוט ישיר, בלי שקעים (כבמקור).
List<List<dynamic>> familiesImportFormatRows(Map<String, dynamic> db) =>
    fif.familiesImportFormatRows(db);

/// תומכות בפורמט-הייבוא (7 עמודות) — חוט ישיר, בלי שקעים (כבמקור).
List<List<dynamic>> supportersImportFormatRows(Map<String, dynamic> db) =>
    sif.supportersImportFormatRows(db);

/// שורות ייצוא-CSV של האירועים (9 עמודות, ממוין לפי תאריך) — החוט מחווט
/// עם termOf + שרשרת-התאריך-העברי + מילון-הסוגים (EV_META). config אופציונלי כבמקור.
List<List<dynamic>> eventsCsvRows(dynamic db, [dynamic config]) =>
    ecr.eventsCsvRows(db, config, tof.termOf, _hebFull, em.evMeta);
