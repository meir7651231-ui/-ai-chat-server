// 📦 קופסת-חיבורים · ics-feed (פיד-יומן חי) — מחווטת 4 אטומי-Dart. מקבילה ל-new/boxes/ics-feed.mjs.
// חוזה משותף: new/boxes/ics-feed.contract.md. מקור-האמת: maor/src/lib/icsFeed.ts.
// זו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// ההלחמות-לשעבר (publishIcsFeed קרא בעצמו ל-readIcsFeedToken+mintFeedToken+setDoc) —
// כאן החיווט הפנימי גלוי ומפורש (חוק-2/3 — הקופסה היחידה שמחווטת אטומים).
// שקעי-IO (Firestore: db/doc/getDoc/setDoc, חותם-זמן) = לוח-האם, מוזרקים כאובייקט
// Cloud — הקופסה עצמה טהורה (חוק-6: שום זהות/ידית-ענן נצרבת).
import '../dart-data-maor/publish-ics-feed-sockets.dart' as skb_pif;
import '../dart-maor/mint-feed-token.dart' as mint;
import '../dart-maor/read-ics-feed-token.dart' as read;
import '../dart-maor/publish-ics-feed.dart' as pub;
import '../dart-maor/ics-feed-url.dart' as url;

// ── שקעי לוח-האם (חתימות-Firestore המוזרקות) ────────────────────────────────
typedef DocFn = dynamic Function(dynamic db, String col, String id);
typedef GetDocFn = Future<dynamic> Function(dynamic ref);
typedef SetDocFn = Future<dynamic> Function(dynamic ref, dynamic data);
typedef NowIsoFn = String Function();

/// אובייקט-הענן המוזרק (מקביל ל-`cloud` שב-ics-feed.mjs): שקעי-Firestore +
/// חותם-זמן אופציונלי. nowIso חסר ⇒ ברירת-המחדל של האטום (new Date).
class Cloud {
  final dynamic db;
  final DocFn doc;
  final GetDocFn getDoc;
  final SetDocFn setDoc;
  final NowIsoFn? nowIso;
  Cloud({
    required this.db,
    required this.doc,
    required this.getDoc,
    required this.setDoc,
    this.nowIso,
  });
}

// ── מילון-הקופסה (הכרעת-חיווט) ──────────────────────────────────────────────
// שם-אוסף-הענן ICS_FEEDS (icsFeed.ts:11 verbatim) — מוטבע בחוט-הקריאה (בתוך האטום),
// ומחווט כאן גם לנתיב-הכתיבה (setDoc). זו הכרעת-הקופסה, לא של האטום.
const String ICS_FEEDS = 'icsFeeds';

// ── החשיפה (ממשק lib/icsFeed.ts אחד-לאחד — L4) ──────────────────────────────
/// token אקראי 32-hex (crypto של הפלטפורמה).
String mintFeedToken() => mint.mintFeedToken();

/// כתובת-המנוי הציבורית לפיד — פונקציית icsFeed בפרויקט-הענן.
String icsFeedUrl(String projectId, String slug, String token) =>
    url.icsFeedUrl(projectId, slug, token);

/// ה-token הקיים של הפיד (icsFeeds/{slug}) — שקעי-Firestore מוזרקים ב-cloud.
/// readFs שב-JS ({db,doc,getDoc}) מתפרק כאן לפרמטרים-הפוזיציוניים של האטום.
Future<String?> readIcsFeedToken(String slug, Cloud cloud) =>
    read.readIcsFeedToken(slug, cloud.db, cloud.doc, cloud.getDoc);

/// פרסום/רענון הפיד. החיווט הגלוי: readToken=חוט-הקריאה · mintToken=חוט-ההנפקה ·
/// writeFeed=setDoc על icsFeeds/{slug} (שם-האוסף מהמילון). token קיים נשמר,
/// rotate מנפיק חדש. חותם-הזמן = ברירת-המחדל של האטום, אלא-אם הוזרק cloud.nowIso.
Future<dynamic> publishIcsFeed(
  String slug,
  String ics,
  dynamic opts,
  Cloud cloud,
) =>
    pub.publishIcsFeed(
      slug,
      ics,
      opts,
      readToken: (s) =>
          read.readIcsFeedToken(s as String, cloud.db, cloud.doc, cloud.getDoc),
      mintToken: mint.mintFeedToken,
      writeFeed: (s, data) =>
          cloud.setDoc(cloud.doc(cloud.db, ICS_FEEDS, s as String), data),
      T: skb_pif.publishIcsFeed_T,
      // JS: `...(cloud.nowIso ? {nowIso} : {})` — חסר ⇒ null ⇒ ברירת-המחדל של האטום.
      nowIso: cloud.nowIso,
    );
