// 📦 קופסת-חיבורים · ניווט-אחורה + "נפתחו-לאחרונה" (Dart) — מחווטת 5 אטומי-Dart.
// מקבילה ל-new/boxes/navhist.mjs. חוזה משותף: new/boxes/navhist.contract.md.
// מקור-האמת (L4): maor-system/src/lib/navhist.ts + החיווט החי ב-useApp.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותו fixture ⇒ אותו JSON.
// אף אטום לא מייבא אטום; כל הכריכה — כולל התאמות-הטיפוס — חיה כאן בלבד.
import '../dart-maor/same-loc.dart' as sl;
import '../dart-maor/push-nav.dart' as pn;
import '../dart-maor/push-recent.dart' as pr;
import '../dart-maor/nav-hist-max.dart' as nhm;
import '../dart-maor/recent-max.dart' as rm;

// ── התקרות, מיוצאות מהחוטים (כמו `export { NAV_HIST_MAX, RECENT_MAX }` ב-JS) ──
const int NAV_HIST_MAX = nhm.navHistMax; // 20
const int RECENT_MAX = rm.RECENT_MAX; //     6

// ── שקעי-תוכן (מילון-הקופסה — App.tsx:635,639) ──
const String BACK_LABEL = '↩ חזרה';
const String BACK_TITLE = 'חזרה למסך הקודם';

// ── מתאם-טיפוס לחוט push-nav ─────────────────────────────────────────────────
// ⚠️ סטיית-טיפוס באטום push-nav.dart (מדווחת, לא נגעתי בקובץ-האטום): הוא הוקשח
//    ל-`List<String>`/`String`, בעוד חוזה-האטום עצמו (atoms/push-nav.contract.md)
//    קובע ש"כל איבר אטום מבחינת החוט" — כלומר מיקום-ניווט אטום, לא מחרוזת; והקופסה
//    (navStep⇒pushNav) דוחפת מיקומי-Map. קריאה ישרה עם List<Map> זורקת TypeError
//    (‏'List<Map>' is not a subtype of 'List<String>'). המתאם משמר את הלוגיקה של
//    האטום במלואה — התקרה-20, הסדר, וזריקת-הישן — ע"י מיפוי-אינדקסים אטום→מחרוזת→חזרה,
//    ומחזיר את מופעי-ה-Map המקוריים (זהות-הפניה נשמרת). אחיו sameLoc מוקלד dynamic —
//    כך גם push-nav צריך היה. (בית-האטום: push-nav.dart · חוזה: push-nav.contract.md.)
List<Map<String, dynamic>> _pushNavLoc(
    List<Map<String, dynamic>> hist, Map<String, dynamic> prev) {
  final tokens = [for (var i = 0; i < hist.length; i++) '$i'];
  final kept = pn.pushNav(tokens, '${hist.length}'); // אסימון-prev = hist.length
  final all = [...hist, prev];
  return [for (final t in kept) all[int.parse(t)]];
}

// ── החיווט ───────────────────────────────────────────────────────────────────

/// הכרעה 1: מעבר לאותו מיקום אינו נרשם כצעד (useApp.ts:1366).
List<Map<String, dynamic>> navStep(List<Map<String, dynamic>> hist,
        Map<String, dynamic> prev, Map<String, dynamic> next) =>
    sl.sameLoc(prev, next) ? hist : _pushNavLoc(hist, prev);

/// מעבר-מסך — הבחירות נשמרות, רק ה-view מתחלף (useApp.ts:1362-1367).
Map<String, dynamic> goTo({
  required List<Map<String, dynamic>> hist,
  required Map<String, dynamic> prev,
  required String view,
}) {
  final next = <String, dynamic>{
    'view': view,
    'selFamilyId': prev['selFamilyId'],
    'selCourseId': prev['selCourseId'],
  };
  return {'view': view, 'hist': navStep(hist, prev, next)};
}

/// פתיחת כרטיס-משפחה — הכרעה 2: רק id אמיתי מקדם את "נפתחו לאחרונה"
/// (useApp.ts:1368-1379; שורה 1377 — `id ? pushRecent : {}`).
Map<String, dynamic> openFamily({
  required List<Map<String, dynamic>> hist,
  required List<String> recentIds,
  required Map<String, dynamic> prev,
  required String? id,
}) {
  final next = <String, dynamic>{
    'view': 'families',
    'selFamilyId': id,
    'selCourseId': prev['selCourseId'],
  };
  return {
    'view': 'families',
    'selFamilyId': id,
    'hist': navStep(hist, prev, next),
    // truthiness של JS על String|null: null/'' ⇒ falsy, מחרוזת-לא-ריקה ⇒ truthy.
    'recentIds': (id != null && id.isNotEmpty)
        ? pr.pushRecent(recentIds, id)
        : recentIds,
  };
}

/// פתיחת חוג — ללא recent (useApp.ts:1380-1389).
Map<String, dynamic> openCourse({
  required List<Map<String, dynamic>> hist,
  required Map<String, dynamic> prev,
  required String id,
}) {
  final next = <String, dynamic>{
    'view': 'courses',
    'selFamilyId': prev['selFamilyId'],
    'selCourseId': id,
  };
  return {'view': 'courses', 'selCourseId': id, 'hist': navStep(hist, prev, next)};
}

/// הכרעה 3: החזרה אינה נרשמת כצעד (useApp.ts:1392-1405 · legacy:3147);
/// מחסנית ריקה ⇒ null (useApp.ts:1396).
Map<String, dynamic>? goBack(List<Map<String, dynamic>> hist) {
  if (hist.isEmpty) return null;
  final p = hist[hist.length - 1];
  return {'loc': p, 'hist': hist.sublist(0, hist.length - 1)};
}

/// "↩ חזרה" מוצג רק כשיש היסטוריה (App.tsx:630 · legacy:3146 showBack).
bool canGoBack(List<dynamic> hist) => hist.isNotEmpty;
