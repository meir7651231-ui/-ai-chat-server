// 📦 קופסת-חיבורים · donation-partition (Dart) — מחווטת 6 אטומי-Dart. מקבילה ל-new/boxes/donation-partition.mjs.
// חוזה משותף: new/boxes/donation-partition.contract.md. מקור-האמת: maor/src/lib/donationPartition.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// זה המקום היחיד שבו חוטי-הפיצול נפגשים (חוקי-החשמלאי, LAW.md). 6 החוטים חולצו לאטומים;
// החיווט — סדר-ההזרקות, המפתח-המשותף, ובחירת-purposeKeyOf שמזין את הפירוק — חי כאן.
// שקעי-IO אמיתיים: אין — donationPartition טהור לגמרי (בלי DOM/localStorage/fetch/ענן).
//
// ⚠️ פער-ייצוג (חוק-המרה): במקור-ה-JS purposeKeyOf של האטום מקבל את **אובייקט-התרומה** d
//   וניגש ל-d.purpose בפנים; באטום-ה-Dart purposeKeyOf מקבל את **מחרוזת-ה-purpose** בלבד
//   (השקע הוזרק בגרנולריות עדינה יותר). הקופסה מגשרת: purposeKeyOf הפומבי מקבל תרומה-Map,
//   מחלץ d['purpose'], ומזין את האטום — כך שה-API הפומבי ביט-זהה למקור-ה-JS.
import '../dart-maor/shared-purpose-key.dart' as spk;
import '../dart-maor/purpose-key-of.dart' as pko;
import '../dart-maor/don-allowed-keys.dart' as dak;
import '../dart-maor/explode-supporter.dart' as es;
import '../dart-maor/reassemble-donations.dart' as rd;
import '../dart-maor/donation-partition-diff.dart' as dpd;

// ── המפתח-המשותף '_shared_' (הכרעת-החיווט; ידע-קופסה — verbatim מהמקור) ────────
// ignore: non_constant_identifier_names
final String SHARED_PURPOSE_KEY = spk.sharedPurposeKey;

// ── החשיפה (ה-API הפומבי, ביט-זהה לחתימות donationPartition.ts) ────────────────

/// מפתח-הפיצול של תרומה: d.purpose גזום, ריק/חסר ⇒ '_shared_'.
/// גישה d['purpose'] היא גישור-הייצוג (האטום-JS ניגש בפנים; האטום-Dart מקבל את המחרוזת).
String purposeKeyOf(Map<String, dynamic> d) => pko.purposeKeyOf(d['purpose'] as String?);

// המפתח-המשותף '_shared_' מוזרק לאטום — הערך-הנוסף בשאילתת-ה-in של עובד מוגבל.
List<String> donAllowedKeys(List<String> allowed) => dak.donAllowedKeys(allowed, SHARED_PURPOSE_KEY);

// purposeKeyOf המחווט מוזן ל-explodeSupporter (השכן הפנימי במקור, כאן שקע-מוזרק).
List<Map<String, dynamic>> explodeSupporter(Map<String, dynamic> sp) => es.explodeSupporter(sp, purposeKeyOf);

// reassembleDonations — ישיר (אין שקע פנימי).
Map<String, dynamic> reassembleDonations(Map<String, dynamic> base, List<dynamic> docs) =>
    rd.reassembleDonations(base, docs);

// explodeSupporter המחווט מוזן ל-diff — הצד-הדוחף של מסלול-B.
Map<String, dynamic> donationPartitionDiff(Iterable prev, Iterable next) =>
    dpd.donationPartitionDiff(prev, next, (dynamic sp) => explodeSupporter(sp as Map<String, dynamic>));
