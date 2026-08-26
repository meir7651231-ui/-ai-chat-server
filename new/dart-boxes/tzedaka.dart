// 📦 קופסת-חיבורים · tzedaka (Dart) — מחווטת 22 אטומי-Dart. מקבילה ל-new/boxes/tzedaka.mjs.
// חוזה משותף: new/boxes/tzedaka.contract.md · מקור-האמת (L4): maor/src/components/tzedaka/lib.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// דבקי-החיווט (isoOf=isoLocal · העזר-הפרטי coordinatorLastCollection · סדר-הבינדינג ·
// ברירות-המחדל TZ_SCORE_RULES/TZ_STALE_DAYS) = ידע-קופסה (חוק-5), לא אטומים.
// קופסה מייבאת אך-ורק אטומים; קופסה לא מייבאת קופסה.
//
// ── שני שקעי-מנוע חוצי-קופסה (חוק-3, מוזרקים ע"י לוח-האם — לא נגזרים כאן) ──
//   · smartFilter(q, items, getTerms) ⇒ פריטים מסוננים+ממוינים — מנוע קופסת-החיפוש.
//   · buildMonthGrid(events, anchorIso, hebMode) ⇒ גריד — מנוע קופסת-הלוח-העברי.
//   שאר החוטים חוצי-המודול (termOf · dateInRange · isoOf) הם אטומים עצמאיים ⇒ מחווטים כאן.
//
// ── מתאמי-טיפוס (Dart קשיח-טיפוס) ──
// המקור-ה-JS מזריק שכנים כפונקציות דינמיות; ב-Dart האטומים-הצרכנים מכריזים חתימות-שקע
// טיפוסיות ⇒ הקופסה עוטפת כל שכן במתאם דק (dynamic⇄טיפוסי) בלי לשנות התנהגות.
import '../dart-maor/tz-score-rules.dart' as tsr;
import '../dart-maor/tz-stale-days.dart' as tsd;
import '../dart-maor/week-day-names.dart' as wdn;
import '../dart-maor/last-collection-iso.dart' as lci;
import '../dart-maor/collection-score-delta.dart' as csd;
import '../dart-maor/box-total.dart' as bt;
import '../dart-maor/coordinator-boxes.dart' as cb;
import '../dart-maor/coordinator-total.dart' as cot;
import '../dart-maor/grand-total.dart' as gt;
import '../dart-maor/campaign-total.dart' as ct;
import '../dart-maor/stale-boxes.dart' as sb;
import '../dart-maor/needs-care-tzedaka.dart' as nc;
import '../dart-maor/leaderboard.dart' as lb;
import '../dart-maor/campaign-progress.dart' as cp;
import '../dart-maor/filter-coordinators.dart' as fco;
import '../dart-maor/boxes-overview.dart' as bo;
import '../dart-maor/filter-collections.dart' as fcl;
import '../dart-maor/coordinator-print-lines.dart' as cpl;
import '../dart-maor/collections-csv-rows.dart' as ccr;
import '../dart-maor/build-tz-grid.dart' as btg;
import '../dart-maor/term-of.dart' as to;
import '../dart-maor/date-in-range.dart' as dir;
import '../dart-maor/iso-local.dart' as il;

// ── הכינוי (הכרעת-קופסה): isoOf של הלוח = isoLocal — מקור calLib.ts:30-32 מאציל ל-isoLocal ──
String _isoOf(DateTime d) => il.isoLocal(d);

// ── מתאמי-שקע דקים (dynamic⇄טיפוסי) ──────────────────────────────────────────
String _lciDyn(dynamic box) => lci.lastCollectionIso(box as Map<String, dynamic>);
num _btDyn(dynamic box) => bt.boxTotal(box as Map);
List<Map<String, dynamic>> _cbTyped(dynamic boxes, Object? coordId) =>
    cb.coordinatorBoxes((boxes as List).cast<Map<String, dynamic>>(), coordId);
Iterable _cbIter(dynamic boxes, Object? coordId) => _cbTyped(boxes, coordId);
List<dynamic> _cbList(dynamic boxes, dynamic coordId) => _cbTyped(boxes, coordId);
String _termOf(Map<String, dynamic> config, String key, String fb) =>
    to.termOf(config, key, fb) as String;

// ── הרכב-העזר הפרטי coordinatorLastCollection (מקור lib.ts:161-168) —
//    היה פונקציה-פנימית שאינה מיוצאת; ההרכב (coordinatorBoxes⊕lastCollectionIso
//    + השוואת '>' על מחרוזות-ISO, '' ראשון) הוא הכרעת-חיווט של הקופסה. ──
String _coordinatorLastCollection(dynamic boxes, dynamic coordId) {
  var last = '';
  for (final b in _cbTyped(boxes, coordId)) {
    final l = lci.lastCollectionIso(b);
    if (l.compareTo(last) > 0) last = l; // JS: if (l > last) — השוואת-מחרוזת
  }
  return last;
}

// ── חשיפה: חוטים זהי-ביט למקור (אפס שקעים) — חיווט ישיר ──────────────────────
Map<String, dynamic> get TZ_SCORE_RULES => tsr.tzScoreRules; // ignore: non_constant_identifier_names
int get TZ_STALE_DAYS => tsd.tzStaleDays; // ignore: non_constant_identifier_names
List<String> get DAY_NAMES => wdn.dayNames; // ignore: non_constant_identifier_names
String lastCollectionIso(Map<String, dynamic> box) => lci.lastCollectionIso(box);
num boxTotal(Map box) => bt.boxTotal(box);
List<Map<String, dynamic>> coordinatorBoxes(
        List<Map<String, dynamic>> boxes, Object? coordId) =>
    cb.coordinatorBoxes(boxes, coordId);
num campaignTotal(dynamic boxes, dynamic campaignId) =>
    ct.campaignTotal(boxes, campaignId);

// ── חיווט-שכנים (חוק-3): השכן מוזרק פנימה בקופסה; חתימות-המקור נשמרות ──────────

/// מקור lib.ts:33-48 — ברירת-מחדל rules=TZ_SCORE_RULES (פיגמנט).
num collectionScoreDelta(dynamic box, String date, num amount,
        [Map<String, num>? rules]) =>
    csd.collectionScoreDelta(
        box, date, amount, _lciDyn, rules ?? tsr.tzScoreRules.cast<String, num>());

/// מקור lib.ts:60-62.
num coordinatorTotal(dynamic boxes, dynamic coordId) =>
    cot.coordinatorTotal(boxes, coordId, _cbIter, _btDyn);

/// מקור lib.ts:64-66.
num grandTotal(List boxes) => gt.grandTotal(boxes, _btDyn);

/// מקור lib.ts:80-89 — ברירת-מחדל days=TZ_STALE_DAYS; isoOf+lastCollectionIso מוזרקים.
dynamic staleBoxes(dynamic boxes, dynamic todayIso, [num? days]) =>
    sb.staleBoxes(boxes, todayIso, days ?? tsd.tzStaleDays, _isoOf, _lciDyn);

/// מקור lib.ts:101-131 — סדר סוגי-הטיפול (ישנות→אבודות→רכזים→מבצעים) חי באטום;
/// הקופסה מזריקה את חמשת השכנים כאובייקט-שקעים.
List<Map<String, dynamic>> needsCare(Map<String, dynamic> db, String todayIso,
        [Map<String, dynamic>? config]) =>
    nc.needsCare(db, todayIso, config, {
      'termOf': _termOf,
      'staleBoxes': (dynamic b, dynamic t) => staleBoxes(b, t),
      'lastCollectionIso': _lciDyn,
      'coordinatorBoxes': _cbList,
      'isoOf': _isoOf,
    });

/// מקור lib.ts:142-147.
List<Map<String, dynamic>> leaderboard(List<dynamic> coordinators, List<dynamic> boxes) =>
    lb.leaderboard(coordinators, boxes, coordinatorTotal, _cbList);

/// מקור lib.ts:149-154.
Map<String, num> campaignProgress(Map campaign, List boxes) =>
    cp.campaignProgress(campaign, boxes, ct.campaignTotal);

/// מקור lib.ts:174-192 — smartFilter (מנוע-החיפוש) מוזרק מלוח-האם;
/// coordinatorTotal + העזר-הפרטי coordinatorLastCollection מחווטים בקופסה.
List<dynamic> filterCoordinators(List<dynamic> coords, dynamic boxes, String q,
        bool onlyActive, String sort, Function smartFilter) =>
    fco.filterCoordinators(
      coords,
      boxes,
      q,
      onlyActive,
      sort,
      (String qq, List<dynamic> items, List<dynamic> Function(dynamic) getTerms) =>
          (smartFilter(qq, items, getTerms) as List).cast<dynamic>(),
      coordinatorTotal,
      _coordinatorLastCollection,
    );

/// מקור lib.ts:203-230 — smartFilter מוזרק; lastCollectionIso+boxTotal מחווטים.
List<Map<String, dynamic>> boxesOverview(
        Map<String, dynamic> db, String q, String status, String sort, Function smartFilter) =>
    bo.boxesOverview(
      db,
      q,
      status,
      sort,
      lci.lastCollectionIso,
      bt.boxTotal,
      (String qq, List<Map<String, dynamic>> items,
              List<dynamic> Function(Map<String, dynamic>) getTerms) =>
          (smartFilter(qq, items, getTerms) as List).cast<Map<String, dynamic>>(),
    );

/// מקור lib.ts:233-242.
List<Map<String, dynamic>> filterCollections(
        Map<String, dynamic> box, String fromIso, String toIso, String campaignId) =>
    fcl.filterCollections(box, fromIso, toIso, campaignId, dir.dateInRange);

/// מקור lib.ts:250-275.
List<String> coordinatorPrintLines(Map<String, dynamic> db, String coordinatorId,
        [Map<String, dynamic>? config]) =>
    cpl.coordinatorPrintLines(db, coordinatorId, config, _termOf, _cbList, _lciDyn);

/// מקור lib.ts:281-293.
List<List<Object>> collectionsCsvRows(Map<String, dynamic> db,
        [Map<String, dynamic>? config]) =>
    ccr.collectionsCsvRows(db, config, _termOf);

/// מקור lib.ts:302-304 — buildMonthGrid (מנוע-הלוח) מוזרק מלוח-האם.
dynamic buildTzGrid(
        dynamic tzEvents, dynamic anchorIso, dynamic hebMode, Function buildMonthGrid) =>
    btg.buildTzGrid(tzEvents, anchorIso, hebMode,
        (Object? e, Object? a, Object? h) => buildMonthGrid(e, a, h));
