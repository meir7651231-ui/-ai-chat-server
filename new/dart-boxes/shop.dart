import '../dart-data-maor/beneficiary-label-terms.dart';
// 📦 קופסת-חיבורים · מודול-החנות (shop) (Dart) — מחווטת 35 אטומי-Dart. מקבילה ל-new/boxes/shop.mjs.
// חוזה משותף: new/boxes/shop.contract.md. מקור-האמת: maor/src/components/shop/lib.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// הכרעת-קופסה (מקבילה ל-shop.mjs): עלי-שכן חסרי-שקע (termOf · dateInRange · hebParts ·
//   isoLocal=isoOf) מיובאים כאטומים ומחווטים כאן; מנועי-קופסה-שכנה (holidayOf · smartFilter ·
//   featureOn) מוזרקים כשקעים מתועדים; אין שקעי-IO אמיתיים (המנוע טהור מהמקור).
// דבקי-החיווט (hebYearOf · pendingCount · progressOf) = ידע-קופסה (חוק-5), לא אטומים.
// מתאמי-טיפוס: Dart קשיח-טיפוס גשר על שקעי-ה-dynamic של האטומים (מקביל למתאמי dedup.dart).
import '../dart-maor/live-redemptions.dart' as lr;
import '../dart-maor/item-of.dart' as iof;
import '../dart-maor/holiday-allowed.dart' as ha;
import '../dart-maor/item-remaining.dart' as ir;
import '../dart-maor/effective-price.dart' as ep;
import '../dart-maor/max-discount-pct.dart' as mdp;
import '../dart-maor/upcoming-holidays.dart' as uh;
import '../dart-maor/holiday-names.dart' as hn;
import '../dart-maor/assignment-redeemed.dart' as ar;
import '../dart-maor/component-remaining.dart' as cr;
import '../dart-maor/coupon-expiry.dart' as ce;
import '../dart-maor/shop-holiday-due-days.dart' as shd;
import '../dart-maor/needs-care-shop.dart' as ncs;
import '../dart-maor/shop-expiry-warn-days.dart' as sewd;
import '../dart-maor/expiring-intakes.dart' as ei;
import '../dart-maor/upcoming-meetings.dart' as um;
import '../dart-maor/given-value.dart' as gv;
import '../dart-maor/collected-paid.dart' as cp;
import '../dart-maor/subsidy-total.dart' as st;
import '../dart-maor/product-assignments.dart' as pa;
import '../dart-maor/component-redeemed-now.dart' as crn;
import '../dart-maor/filter-assignments.dart' as fa;
import '../dart-maor/filter-products.dart' as fp;
import '../dart-maor/filter-items.dart' as fi;
import '../dart-maor/filter-redemptions.dart' as fr;
import '../dart-maor/intake-log.dart' as il;
import '../dart-maor/eligible-families.dart' as ef;
import '../dart-maor/distribution-list-lines.dart' as dll;
import '../dart-maor/redemptions-csv-rows.dart' as rcr;
import '../dart-maor/beneficiary-label.dart' as bl;
import '../dart-maor/component-counts.dart' as cc;
// עלי-שכן חסרי-שקע — מיובאים ומחווטים בקופסה
import '../dart-maor/term-of.dart' as tof;
import '../dart-maor/date-in-range.dart' as dr;
import '../dart-maor/heb-parts.dart' as hp;
import '../dart-maor/iso-local.dart' as isl;

// ── חיווט-פנימי · הכרעות שחיות בקופסה (מקור: shop/lib.ts) ─────────────────────

// hebYearOf — השנה-העברית של ISO; כלל-הצהריים הוא הכרעת-הקופסה (shop/lib.ts:171-173).
int _hebYearOf(String iso) => hp.hebParts(DateTime.parse('${iso}T12:00:00'))['year'] as int;

// ── מתאמי-טיפוס לשקעים (Dart קשיח-טיפוס גשר על ה-dynamic של המקור) ────────────
// liveRedemptions בשתי צורות-החזרה שהאטומים-הצרכנים מצפים להן (List<dynamic> / typed).
List<dynamic> _lr(dynamic a) => lr.liveRedemptions((a as Map).cast<String, dynamic>());
List<Map<String, dynamic>> _lrTyped(dynamic a) =>
    lr.liveRedemptions((a as Map).cast<String, dynamic>()).cast<Map<String, dynamic>>();
String _termOf(Map<String, dynamic> config, String key, String fallback) =>
    tof.termOf(config, key, fallback) as String;
bool _dateInRange(dynamic iso, String fromIso, String toIso) => dr.dateInRange(iso as String, fromIso, toIso);
// שקעי-crn/needsCare (גישת-Map דרך Object?/dynamic — עוטפים את ה-API-המחווט)
Map _itemOfCRN(Object? db, Object? comp) =>
    iof.itemOf((db as Map).cast<String, dynamic>(), (comp as Map).cast<String, dynamic>());
bool _haCRN(Object? ri, Object? name) => ha.holidayAllowed(ri as Map, name);
Map<String, dynamic> _itemOfDL(Map<String, dynamic> db, dynamic comp) =>
    iof.itemOf(db, (comp as Map).cast<String, dynamic>());
String _benLabel3(Map<String, dynamic> db, dynamic a, dynamic config) => beneficiaryLabel(
    db, (a as Map).cast<String, dynamic>(), config == null ? null : (config as Map).cast<String, dynamic>());
int? _itemRemDyn(dynamic db, dynamic id) => itemRemaining((db as Map).cast<String, dynamic>(), id as String);
int? _compRemForCare(dynamic c, dynamic p, dynamic a, dynamic s) {
  final r = componentRemaining(c, p, a as List, s as num?);
  return r?.toInt();
}
String _couponExpiryDyn(dynamic a, dynamic ri) => couponExpiry(a as Map, ri as Map);

// ── re-export ישיר של החוטים חסרי-השקע (טהורים מהמקור, אפס-חיווט) ─────────────
List<dynamic> liveRedemptions(Map<String, dynamic> a) => lr.liveRedemptions(a);
Map<String, dynamic> itemOf(Map<String, dynamic> db, Map<String, dynamic> comp) => iof.itemOf(db, comp);
bool holidayAllowed(Map ri, Object? holidayName) => ha.holidayAllowed(ri, holidayName);
num maxDiscountPct(List<String> criterionIds, List<Map<String, dynamic>> criteria) =>
    mdp.maxDiscountPct(criterionIds, criteria);
List<Map<String, dynamic>> productAssignments(List<Map<String, dynamic>> assignments, Object? productId) =>
    pa.productAssignments(assignments, productId);
Map<String, Object?> intakeLog(Map<String, Object?> db) => il.intakeLog(db);
List<Map<String, dynamic>> eligibleFamilies(Map db, List criterionIds, [dynamic excludeProductId]) =>
    ef.eligibleFamilies(db, criterionIds, excludeProductId);
Map<String, int> componentCounts(Map<String, dynamic> p) => cc.componentCounts(p);
final int SHOP_HOLIDAY_DUE_DAYS = shd.shopHolidayDueDays; // ignore: non_constant_identifier_names
final int SHOP_EXPIRY_WARN_DAYS = sewd.shopExpiryWarnDays; // ignore: non_constant_identifier_names

// ── חוטים מחווטים (שקע-שכן פנימי) ────────────────────────────────────────────

/// תווית-מוטב — termOf (אטום) מחווט; נקרא רק כשיש config (כמו במקור).
String beneficiaryLabel(Map<String, dynamic> db, Map<String, dynamic> a, [Map<String, dynamic>? config]) =>
    bl.beneficiaryLabel(db, a, config, _termOf, term: (k)=>kTerms[k]!);

/// הנותר-במלאי של פריט-קטלוג — liveRedemptions מחווט פנימית.
int? itemRemaining(Map<String, dynamic> db, String itemId) => ir.itemRemaining(db, itemId, _lr);

/// מחיר-אפקטיבי — maxDiscountPct (אטום) מחווט פנימית.
int effectivePrice(num basePrice, List<String> criterionIds, List<Map<String, dynamic>> criteria) =>
    ep.effectivePrice(basePrice, criterionIds, criteria, mdp.maxDiscountPct);

/// הנותר-במלאי לרכיב-מוצר — liveRedemptions מחווט פנימית.
num? componentRemaining(Object? componentId, Object? productId, List<dynamic> assignments, num? stock) =>
    cr.componentRemaining(componentId, productId, assignments, stock, _lr);

/// תאריך-פקיעת-קופון — isoOf(=isoLocal) מחווט פנימית.
String couponExpiry(Map a, Map comp) => ce.couponExpiry(a, comp, isl.isoLocal);

/// האם רכיב מומש בשיוך — liveRedemptions + hebYearOf מחווטים פנימית.
bool assignmentRedeemed(dynamic a, dynamic componentId, [dynamic holiday]) => ar.assignmentRedeemed(
    a, componentId as String, holiday == null ? null : (holiday as Map).cast<String, String>(), _lrTyped, _hebYearOf);

/// קליטות-מתכלות שפגו/עומדות-לפוג — isoOf מחווט; חלון ברירת-מחדל 7 מהאטום.
List<Map<String, dynamic>> expiringIntakes(Map<String, dynamic> db, String todayIso, [int? windowDays]) =>
    windowDays == null
        ? ei.expiringIntakes(db, todayIso, isl.isoLocal)
        : ei.expiringIntakes(db, todayIso, isl.isoLocal, windowDays);

/// פגישות-קרובות — isoOf + beneficiaryLabel מחווטים פנימית (days ברירת-מחדל 2).
List<Map<String, Object?>> upcomingMeetings(Map<String, Object?> db, String todayIso,
        [num days = 2, Map<String, Object?>? config]) =>
    um.upcomingMeetings(db, todayIso, days, config, isl.isoLocal, _benLabelMeetings);
Object? _benLabelMeetings(Map<String, Object?> db, Map<String, Object?> a, Map<String, Object?>? config) =>
    beneficiaryLabel(db.cast<String, dynamic>(), a.cast<String, dynamic>(), config?.cast<String, dynamic>());

/// Σ שווי-שנמסר — liveRedemptions מחווט פנימית.
num givenValue(List assignments) => gv.givenValue(assignments, _lr);

/// Σ מה-ששולם — liveRedemptions מחווט פנימית.
num collectedPaid(List assignments) => cp.collectedPaid(assignments, _lrTyped);

/// הסבסוד-הכולל — givenValue/collectedPaid המחווטים מוזנים לאטום.
dynamic subsidyTotal(dynamic assignments) => st.subsidyTotal(assignments, givenValue, collectedPaid);

/// האם רכיב מומש עכשיו — itemOf/holidayAllowed/assignmentRedeemed מחווטים פנימית.
Object? componentRedeemedNow(Map<String, dynamic> db, dynamic a, dynamic comp, dynamic holidays) =>
    crn.componentRedeemedNow(db, a, comp, holidays, _itemOfCRN, _haCRN, assignmentRedeemed);

/// רשימת-חלוקה מודפסת — itemOf + beneficiaryLabel מחווטים פנימית.
List<String> distributionListLines(Map<String, dynamic> db, Object? productId, [Object? config]) =>
    dll.distributionListLines(db, productId, config, _itemOfDL, _benLabel3);

/// שורות-CSV של מימושים — beneficiaryLabel + itemOf מחווטים פנימית.
List<List<dynamic>> redemptionsCsvRows(Map<String, dynamic> db, [dynamic config]) =>
    rcr.redemptionsCsvRows(db, config, _benLabel3, _itemOfDL);

/// סינון-מימושים — dateInRange (אטום) מחווט פנימית.
List<dynamic> filterRedemptions(Map<String, dynamic> a, String fromIso, String toIso, bool includeVoided) =>
    fr.filterRedemptions(a, fromIso, toIso, includeVoided, _dateInRange);

// ── חוטים עם שקע-מנוע-שכנה מוזרק (holidayOf/smartFilter/featureOn) ────────────

/// החגים-הקרובים — holidayOf (מנוע לוח-עברי) שקע-מוזרק; isoOf מחווט פנימית.
List<Map<String, dynamic>> upcomingHolidays(String fromIso, [num days = 45, dynamic Function(DateTime)? holidayOf]) =>
    uh.upcomingHolidays(fromIso, holidayOf!, isl.isoLocal, days.toInt());

/// כל שמות-החגים — holidayOf שקע-מוזרק.
List<String> holidayNames(Object? Function(DateTime) holidayOf) => hn.holidayNames(holidayOf);

/// סינון-חבילות — smartFilter (מנוע-חיפוש) שקע-מוזרק.
dynamic filterProducts(List products, Object? q, Object? onlyActive,
        dynamic Function(Object? q, List base, List Function(dynamic p) getTerms) smartFilter) =>
    fp.filterProducts(products, q, onlyActive, smartFilter);

/// סינון-פריטים — itemRemaining מחווט פנימית; smartFilter שקע-מוזרק.
List<dynamic> filterItems(Map<String, dynamic> db, String q, String stockState,
        List<dynamic> Function(String, List<dynamic>, List<dynamic> Function(dynamic)) smartFilter) =>
    fi.filterItems(db, q, stockState, _itemRemDyn, smartFilter);

// pendingCount / progressOf — עוזרי-מיון פרטיים מהמקור (shop/lib.ts:484-496), חיים כחיווט-קופסה.
// componentRedeemedNow (המחווט) לא-תלוי-holidayOf: מקבל את מערך-החגים כפרמטר.
bool _truthy(Object? v) {
  if (v == null) return false;
  if (v is bool) return v;
  if (v is num) return v != 0 && !v.isNaN;
  if (v is String) return v.isNotEmpty;
  return true;
}

num _pendingCount(Map<String, dynamic> db, dynamic a, dynamic holidays) {
  Map<String, dynamic>? product;
  for (final p in (db['shopProducts'] as List)) {
    if ((p as Map)['id'] == (a as Map)['productId']) {
      product = p.cast<String, dynamic>();
      break;
    }
  }
  if (product == null) return 0;
  return (product['components'] as List)
      .where((c) => !_truthy(componentRedeemedNow(db, a, c, holidays)))
      .length;
}

num _progressOf(Map<String, dynamic> db, dynamic a, dynamic holidays) {
  Map<String, dynamic>? product;
  for (final p in (db['shopProducts'] as List)) {
    if ((p as Map)['id'] == (a as Map)['productId']) {
      product = p.cast<String, dynamic>();
      break;
    }
  }
  final total = product == null ? 0 : (product['components'] as List).length;
  if (total == 0) return 1;
  return (total - _pendingCount(db, a, holidays)) / total;
}

num _pendingCountDyn(dynamic db, dynamic a, dynamic holidays) =>
    _pendingCount((db as Map).cast<String, dynamic>(), a, holidays);
num _progressOfDyn(dynamic db, dynamic a, dynamic holidays) =>
    _progressOf((db as Map).cast<String, dynamic>(), a, holidays);

/// סינון+מיון שיוכים — smartFilter (חיפוש) + holidayOf (לוח-עברי) שקעים-מוזרקים;
/// pendingCount/progressOf + upcomingHolidays מחווטים פנימית.
List<dynamic> filterAssignments(Map<String, dynamic> db, String q, String status, bool pendingOnly,
    String productId, String sort, String? todayIso, dynamic Function(DateTime) holidayOf,
    List<dynamic> Function(String, List<dynamic>, List<dynamic> Function(dynamic)) smartFilter) {
  List<dynamic> wiredUpcoming(String fromIso, int days) =>
      uh.upcomingHolidays(fromIso, holidayOf, isl.isoLocal, days);
  return fa.filterAssignments(db, q, status, pendingOnly, productId, sort, todayIso, wiredUpcoming,
      shd.shopHolidayDueDays, _pendingCountDyn, smartFilter, _progressOfDyn);
}

/// רשימת-הטיפול של החנות — holidayOf (לוח-עברי) + featureOn (קונפיג) שקעים-מוזרקים;
/// כל שאר השכנים מחווטים פנימית מאטומי-הקופסה.
List<dynamic> needsCare(Map<String, dynamic> db, String todayIso, dynamic config,
    dynamic Function(DateTime) holidayOf, bool Function(dynamic config, String key) featureOn) {
  List<dynamic> wiredUpcoming(String fromIso, int days) =>
      uh.upcomingHolidays(fromIso, holidayOf, isl.isoLocal, days);
  return ncs.needsCare(
    db, todayIso, config,
    wiredUpcoming,
    _itemRemDyn,
    _compRemForCare,
    _benLabel3,
    _itemOfDL,
    _haCRN,
    assignmentRedeemed,
    _couponExpiryDyn,
    featureOn,
    expiringIntakes,
    shd.shopHolidayDueDays,
  );
}
