// 📦 קופסת-חיבורים · sup-partition (Dart) — מחווטת 8 אטומי-Dart. מקבילה ל-new/boxes/sup-partition.mjs.
// חוזה משותף: new/boxes/sup-partition.contract.md. מקור-האמת: maor/src/lib/supporterPartition.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// אכיפת-הרשאה בשכבת-הנתונים (פירוק-תומכים): forWho ⇒ skey plaintext על מסמך-הענן.
// הכרעות-החיווט (המפתח-המשותף המוזרק לכל שקע, וההזרקה של supKeyOf המחווט לשכניו)
// חיות בקופסה — לא באטום (חוק-1/חוק-5). האטומים עיוורים לחיווט.
import '../dart-maor/shared-sup-key.dart' as ssk;
import '../dart-maor/sup-key-of.dart' as sko;
import '../dart-maor/sup-keyed-cols.dart' as skc;
import '../dart-maor/doc-skey.dart' as dsk;
import '../dart-maor/sup-key-map-of.dart' as skm;
import '../dart-maor/sup-allowed-keys.dart' as sak;
import '../dart-maor/strip-sup-key.dart' as ssp;
import '../dart-maor/strip-audit-meta.dart' as sam;

// ── קבועי-המילון (הכרעות-החיווט חיות כאן) ──
// המפתח-המשותף שמוזרק לכל שקע-shared בקופסה — תומך ללא-ייעוד = משותף (מקור:23).
final String SHARED = ssk.sharedSupKey; // ignore: non_constant_identifier_names

// ── החיווט ──
// supKeyOf: הזרקת המפתח-המשותף לשקע-shared (מקור:26-29).
// מתאם-טיפוס (Dart קשיח-טיפוס): האטום מחזיר dynamic; הקופסה חושפת String (skey תמיד מחרוזת).
dynamic supKeyOf(dynamic sp) {
  return sko.supKeyOf(sp, SHARED);
}

// docSkey: הזרקת השכן supKeyOf (המחווט, כבר קשור-shared) + המפתח-המשותף (מקור:42-49).
// שקע-הטיפוס: האטום מצפה ל-`String Function(Map<String,dynamic>)` — עוטפים את supKeyOf המחווט.
String docSkey(String col, Map<String, dynamic> data, Map<String, String> supKeyBySpId) {
  return dsk.docSkey(col, data, supKeyBySpId, (d) => supKeyOf(d) as String, SHARED);
}

// supKeyMapOf: הזרקת השכן supKeyOf כגוזר-מפתח (מקור:52-54).
dynamic supKeyMapOf(dynamic supporters) {
  return skm.supKeyMapOf(supporters, supKeyOf);
}

// supAllowedKeys: הזרקת המפתח-המשותף כזנב-הרשימה (מקור:61-64).
List<dynamic> supAllowedKeys(dynamic allowed) {
  return sak.supAllowedKeys(allowed, SHARED);
}

// קבועים + מקלפי-הענן עוברים כמות-שהם (אין להם שקע-שכן).
final String SHARED_SUP_KEY = ssk.sharedSupKey; // ignore: non_constant_identifier_names
final List<String> SUP_KEYED_COLS = skc.supKeyedCols; // ignore: non_constant_identifier_names
dynamic stripSupKey(dynamic data) => ssp.stripSupKey(data);
dynamic stripAuditMeta(dynamic meta) => sam.stripAuditMeta(meta);
