// 📦 קופסת-חיבורים · זיהוי-השיחה (Dart) — מחווטת 5 אטומי-Dart. מקבילה ל-new/boxes/caller-id.mjs.
// חוזה משותף: התנהגות זהה-ביט ל-new/boxes/caller-id.mjs. מקור-האמת: maor/src/lib/callerId.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// כאן ורק כאן נפגשים החוטים (חוק-2). אף אטום לא מייבא אטום — כל הכריכה (כולל מתאמי-טיפוס
// ל-Dart קשיח-הטיפוס) חיה בקופסה בלבד (חוק-5).
import '../dart-maor/phone-key.dart' as pk;
import '../dart-maor/find-caller.dart' as fc;
import '../dart-maor/caller-kind-label.dart' as ckl;
import '../dart-maor/family-context.dart' as fcx;
import '../dart-maor/term-of.dart' as tof;

// ── re-exports (passthrough — כמו `export { phoneKey, familyContext }` במקור) ──
String phoneKey(String? raw) => pk.phoneKey(raw);
Map<String, int> familyContext(Map db, Object? famId) => fcx.familyContext(db, famId);

// ── מתאם-טיפוס לשקע-המונחים: termOf מחזיר dynamic, caller-kind-label דורש String;
//    כאן ה-fallback והדריסה תמיד מחרוזת ⇒ המרה בטוחה (הקופסה מיישרת את פער-הטיפוס). ──
String _termLabel(dynamic cfg, String key, String fb) => tof.termOf(cfg, key, fb) as String;

// ── JS-truthiness עבור famId (חוק-7): `famId ? ...` — null/מחרוזת-ריקה = כוזב. ──
bool _truthy(Object? v) {
  if (v == null) return false;
  if (v is String) return v.isNotEmpty;
  if (v is bool) return v;
  if (v is num) return v != 0;
  return true;
}

// ── הכרעת-החיווט: שקע-הנירמול של המאתר = phone-key (ניכוי 972/0, ספרות-בלבד). ──
Map<String, Object?>? identifyCaller(Map<String, Object?> db, String rawNumber) =>
    fc.findCaller(db, rawNumber, pk.phoneKey);

// ── תווית-הסוג דרך מילון-המונחים של הארגון (white-label — termOf האמיתי מחווט). ──
String? kindLabel(dynamic cfg, String kind) => ckl.callerKindLabel(cfg, kind, _termLabel);

// ── כרטיס-שיחה שלם: מתקשר + תווית + הקשר-משפחה (כשזה משפחה/בן-משפחה). ──
Map<String, Object?>? screenPop(Map<String, Object?> db, dynamic cfg, String rawNumber) {
  final caller = identifyCaller(db, rawNumber);
  if (caller == null) return null;
  final label = kindLabel(cfg, caller['kind'] as String);
  final kind = caller['kind'];
  final famId = kind == 'family'
      ? caller['id']
      : kind == 'member'
          ? caller['famId']
          : null;
  return {
    ...caller,
    'label': label,
    'context': _truthy(famId) ? familyContext(db, famId) : null,
  };
}
