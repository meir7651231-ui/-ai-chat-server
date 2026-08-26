// 📦 קופסת-חיבורים · cloud-merge (Dart) — מחווטת 5 אטומי-Dart. מקבילה ל-new/boxes/cloud-merge.mjs.
// חוזה משותף: new/boxes/cloud-merge.contract.md. מקור-האמת: maor/src/lib/cloud-merge.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// ── החיווט (זהה למקור-ה-JS) ──
// חוט applyEntityPartial במקור קורא ל-3 שכנים (entityCollections · sanitizeIncoming ·
// mergeDonationsPreserving) שהוזרקו כשקעים בחוט (חוק-1). כאן, בקופסה, מחווטים אותם
// חזרה verbatim: אוסף-הישויות המותר = entityCollections, החיזוק = sanitizeIncoming,
// והמיזוג-במקומו = mergeDonationsPreserving. זו *המשמעות* של המיזוג, והיא חיה כאן —
// אפס נגיעה בחוטים. שאר שלושת החוטים (sanitize/merge/meta) חשופים ישירות מהאטום.
import '../dart-maor/entity-collections.dart' as ec;
import '../dart-maor/sanitize-incoming.dart' as si;
import '../dart-maor/merge-donations-preserving.dart' as md;
import '../dart-maor/apply-entity-partial.dart' as aep;
import '../dart-maor/apply-meta-partial.dart' as amp;

// ── שקעי-IO (מתועדים, לא ממומשים) ──
// המקור טהור לחלוטין: אין DOM/localStorage/fetch/ענן בצד-הקבלה. הקורא (cloudSync
// בצד-מאור / שכבת-הענן בצד-בנייה-חכמה) מזריק את db הנוכחי ואת ה-docs/meta שהגיעו
// מ-Firestore — אלה פרמטרים. אין locale/תאריך/לוח-עברי ⇒ אין שקעי-שפה.

// ── ה-API הפומבי (ביט-זהה לחתימות cloud-merge.mjs) ───────────────────────────

/// חיזוק מסמך-ישות מרוחק: שדות-רשימה תמיד מערכים. (חוט חשוף ישירות.)
Map<String, dynamic> sanitizeIncoming(String col, Map<String, dynamic> item) =>
    si.sanitizeIncoming(col, item);

/// מיזוג-תרומות חסין-אובדן (איחוד לפי rid, מונים רק עולים). (חוט חשוף ישירות.)
Map<String, dynamic> mergeDonationsPreserving(
        String col, Map<String, dynamic> local, Map<String, dynamic> incoming) =>
    md.mergeDonationsPreserving(col, local, incoming);

/// מיזוג שינויי-אוסף מרוחקים (upsert לפי id) — **מחווט 3-שקעים** כמו במקור.
/// entityCollections/sanitizeIncoming/mergeDonationsPreserving מוזרקים כאן, בקופסה.
/// חתימות-האטום תואמות בדיוק לשקעי-הפרמטר ⇒ העברה ישירה (בלי מתאמי-טיפוס).
Map<String, dynamic> applyEntityPartial(
        Map<String, dynamic> db, String col, List<Map<String, dynamic>> docs) =>
    aep.applyEntityPartial(
        db, col, docs, ec.entityCollections, si.sanitizeIncoming, md.mergeDonationsPreserving);

/// מיזוג מסמך-meta מרוחק (הענן-מנצח; מונים רק-עולים). (חוט עצמאי, חשוף ישירות.)
Map<String, Object?> applyMetaPartial(Map<String, Object?> db, Map<String, Object?> meta) =>
    amp.applyMetaPartial(db, meta);
