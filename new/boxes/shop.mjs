/** קופסת-חיבורים · מודול-החנות (components-shop). חוזה: shop.contract.md
 *  מקור-אמת: maor/src/components/shop/lib.ts (L4 — הקוד-החלוץ קדוש; החיווט מתכופף למקור).
 *  זה המקום היחיד שבו 31 חוטי-החנות נפגשים (חוקי-החשמלאי, LAW.md). מייבא אך-ורק אטומים.
 *
 *  הכרעת-קופסה · שקעים חוצי-מודול (מקבילה ל-distribution.mjs: termOf מיובא, smartFilter מוזרק):
 *   · עלי-שכן חסרי-שקע (termOf · dateInRange · hebParts · isoLocal=isoOf) — מיובאים כאטומים ומחווטים כאן.
 *   · מנועי-קופסה-שכנה (holidayOf=לוח-עברי · smartFilter=חיפוש · featureOn=קונפיג) — מוזרקים
 *     כשקעים מתועדים; לוח-האם מספק את הגרסה כבר-המחווטת (קופסה לא מרכיבה קופסה אחרת).
 *   · שקעי-IO אמיתיים — אין (המנוע טהור מהמקור; אין DOM/localStorage/fetch/ענן).
 */
import { liveRedemptions } from '../atoms/live-redemptions.mjs';
import { itemOf } from '../atoms/item-of.mjs';
import { holidayAllowed } from '../atoms/holiday-allowed.mjs';
import { itemRemaining as _itemRemaining } from '../atoms/item-remaining.mjs';
import { effectivePrice as _effectivePrice } from '../atoms/effective-price.mjs';
import { maxDiscountPct } from '../atoms/max-discount-pct.mjs';
import { upcomingHolidays as _upcomingHolidays } from '../atoms/upcoming-holidays.mjs';
import { holidayNames as _holidayNames } from '../atoms/holiday-names.mjs';
import { assignmentRedeemed as _assignmentRedeemed } from '../atoms/assignment-redeemed.mjs';
import { componentRemaining as _componentRemaining } from '../atoms/component-remaining.mjs';
import { couponExpiry as _couponExpiry } from '../atoms/coupon-expiry.mjs';
import { SHOP_HOLIDAY_DUE_DAYS } from '../atoms/shop-holiday-due-days.mjs';
import { needsCare as __pure_needsCare } from '../atoms/needs-care-shop.mjs';
import { NEEDS_CARE_SHOP_T as __d_needsCare_NEEDS_CARE_SHOP_T } from '../atoms/needs-care-shop-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _needsCare = (...a) => __pure_needsCare(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_needsCare_NEEDS_CARE_SHOP_T);
import { SHOP_EXPIRY_WARN_DAYS } from '../atoms/shop-expiry-warn-days.mjs';
import { expiringIntakes as _expiringIntakes } from '../atoms/expiring-intakes.mjs';
import { upcomingMeetings as __pure_upcomingMeetings } from '../atoms/upcoming-meetings.mjs';
import { UPCOMING_MEETINGS_T as __d_upcomingMeetings_UPCOMING_MEETINGS_T } from '../atoms/upcoming-meetings-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _upcomingMeetings = (...a) => __pure_upcomingMeetings(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_upcomingMeetings_UPCOMING_MEETINGS_T);
import { givenValue as _givenValue } from '../atoms/given-value.mjs';
import { collectedPaid as _collectedPaid } from '../atoms/collected-paid.mjs';
import { subsidyTotal as _subsidyTotal } from '../atoms/subsidy-total.mjs';
import { productAssignments } from '../atoms/product-assignments.mjs';
import { componentRedeemedNow as __pure_componentRedeemedNow } from '../atoms/component-redeemed-now.mjs';
import { COMPONENT_REDEEMED_NOW_T as __d_componentRedeemedNow_COMPONENT_REDEEMED_NOW_T } from '../atoms/component-redeemed-now-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _componentRedeemedNow = (...a) => __pure_componentRedeemedNow(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_componentRedeemedNow_COMPONENT_REDEEMED_NOW_T);
import { filterAssignments as _filterAssignments } from '../atoms/filter-assignments.mjs';
import { filterProducts as _filterProducts } from '../atoms/filter-products.mjs';
import { filterItems as __pure_filterItems } from '../atoms/filter-items.mjs';
import { FILTER_ITEMS_T as __d_filterItems_FILTER_ITEMS_T } from '../atoms/filter-items-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _filterItems = (...a) => __pure_filterItems(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_filterItems_FILTER_ITEMS_T);
import { filterRedemptions as _filterRedemptions } from '../atoms/filter-redemptions.mjs';
import { intakeLog } from '../atoms/intake-log.mjs';
import { eligibleFamilies as __pure_eligibleFamilies } from '../atoms/eligible-families.mjs';
import { ELIGIBLE_ASSIGNMENTS_FOR_DAY_T as __d_eligibleFamilies_ELIGIBLE_FAMILIES_T } from '../atoms/eligible-assignments-for-day-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const eligibleFamilies = (...a) => __pure_eligibleFamilies(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_eligibleFamilies_ELIGIBLE_FAMILIES_T);
import { distributionListLines as __pure_distributionListLines } from '../atoms/distribution-list-lines.mjs';
import { DISTRIBUTION_LIST_LINES_T as __d_distributionListLines_DISTRIBUTION_LIST_LINES_T } from '../atoms/distribution-list-lines-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _distributionListLines = (...a) => __pure_distributionListLines(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_distributionListLines_DISTRIBUTION_LIST_LINES_T);
import { redemptionsCsvRows as __pure_redemptionsCsvRows } from '../atoms/redemptions-csv-rows.mjs';
import { REDEMPTIONS_CSV_ROWS_T as __d_redemptionsCsvRows_REDEMPTIONS_CSV_ROWS_T } from '../atoms/redemptions-csv-rows-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _redemptionsCsvRows = (...a) => __pure_redemptionsCsvRows(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_redemptionsCsvRows_REDEMPTIONS_CSV_ROWS_T);
import { beneficiaryLabel as __pure_beneficiaryLabel } from '../atoms/beneficiary-label.mjs';
import { BENEFICIARY_LABEL_T as __d_beneficiaryLabel_BENEFICIARY_LABEL_T } from '../atoms/beneficiary-label-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const _beneficiaryLabel = (...a) => __pure_beneficiaryLabel(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_beneficiaryLabel_BENEFICIARY_LABEL_T);
import { componentCounts } from '../atoms/component-counts.mjs';
// עלי-שכן חסרי-שקע — מיובאים ומחווטים בקופסה
import { termOf } from '../atoms/term-of.mjs';
import { dateInRange } from '../atoms/date-in-range.mjs';
import { hebParts as __pure_hebParts } from '../atoms/heb-parts.mjs';
import { HEB_PARTS_T as __d_hebParts_HEB_PARTS_T } from '../atoms/heb-parts-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hebParts = (...a) => __pure_hebParts(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_hebParts_HEB_PARTS_T);
import { isoLocal } from '../atoms/iso-local.mjs';

/* ── חיווט-פנימי · הכרעות שחיות בקופסה (מקור: shop/lib.ts) ── */

// hebYearOf — השנה-העברית של ISO; כלל-הצהריים הוא הכרעת-הקופסה (shop/lib.ts:171-173).
const hebYearOf = (iso) => hebParts(new Date(iso + 'T12:00:00')).year;

// re-export ישיר של החוטים חסרי-השקע (טהורים מהמקור, אפס-חיווט)
export { liveRedemptions, itemOf, holidayAllowed, maxDiscountPct, productAssignments, intakeLog, eligibleFamilies, componentCounts, SHOP_HOLIDAY_DUE_DAYS, SHOP_EXPIRY_WARN_DAYS };

/* ── חוטים מחווטים (שקע-שכן פנימי) ── */

/** תווית-מוטב — termOf (אטום) מחווט; נקרא רק כשיש config (כמו במקור). */
export function beneficiaryLabel(db, a, config) {
  return _beneficiaryLabel(db, a, config, termOf);
}

/** הנותר-במלאי של פריט-קטלוג — liveRedemptions מחווט פנימית. */
export function itemRemaining(db, itemId) {
  return _itemRemaining(db, itemId, liveRedemptions);
}

/** מחיר-אפקטיבי — maxDiscountPct (אטום) מחווט פנימית. */
export function effectivePrice(basePrice, criterionIds, criteria) {
  return _effectivePrice(basePrice, criterionIds, criteria, maxDiscountPct);
}

/** הנותר-במלאי לרכיב-מוצר — liveRedemptions מחווט פנימית. */
export function componentRemaining(componentId, productId, assignments, stock) {
  return _componentRemaining(componentId, productId, assignments, stock, liveRedemptions);
}

/** תאריך-פקיעת-קופון — isoOf(=isoLocal) מחווט פנימית. */
export function couponExpiry(a, comp) {
  return _couponExpiry(a, comp, isoLocal);
}

/** האם רכיב מומש בשיוך — liveRedemptions + hebYearOf מחווטים פנימית. */
export function assignmentRedeemed(a, componentId, holiday) {
  return _assignmentRedeemed(a, componentId, holiday, liveRedemptions, hebYearOf);
}

/** קליטות-מתכלות שפגו/עומדות-לפוג — isoOf מחווט; חלון ברירת-מחדל 7 מהאטום. */
export function expiringIntakes(db, todayIso, windowDays) {
  return _expiringIntakes(db, todayIso, isoLocal, windowDays);
}

/** פגישות-קרובות — isoOf + beneficiaryLabel מחווטים פנימית (days ברירת-מחדל 2). */
export function upcomingMeetings(db, todayIso, days = 2, config) {
  return _upcomingMeetings(db, todayIso, days, config, isoLocal, beneficiaryLabel);
}

/** Σ שווי-שנמסר — liveRedemptions מחווט פנימית. */
export function givenValue(assignments) {
  return _givenValue(assignments, liveRedemptions);
}

/** Σ מה-ששולם — liveRedemptions מחווט פנימית. */
export function collectedPaid(assignments) {
  return _collectedPaid(assignments, liveRedemptions);
}

/** הסבסוד-הכולל — givenValue/collectedPaid המחווטים מוזנים לאטום. */
export function subsidyTotal(assignments) {
  return _subsidyTotal(assignments, givenValue, collectedPaid);
}

/** האם רכיב מומש עכשיו — itemOf/holidayAllowed/assignmentRedeemed מחווטים פנימית. */
export function componentRedeemedNow(db, a, comp, holidays) {
  return _componentRedeemedNow(db, a, comp, holidays, itemOf, holidayAllowed, assignmentRedeemed);
}

/** רשימת-חלוקה מודפסת — itemOf + beneficiaryLabel מחווטים פנימית. */
export function distributionListLines(db, productId, config) {
  return _distributionListLines(db, productId, config, itemOf, beneficiaryLabel);
}

/** שורות-CSV של מימושים — beneficiaryLabel + itemOf מחווטים פנימית. */
export function redemptionsCsvRows(db, config) {
  return _redemptionsCsvRows(db, config, beneficiaryLabel, itemOf);
}

/** סינון-מימושים — dateInRange (אטום) מחווט פנימית. */
export function filterRedemptions(a, fromIso, toIso, includeVoided) {
  return _filterRedemptions(a, fromIso, toIso, includeVoided, dateInRange);
}

/* ── חוטים עם שקע-מנוע-שכנה מוזרק (holidayOf/smartFilter/featureOn) ── */

/** החגים-הקרובים — holidayOf (מנוע לוח-עברי) שקע-מוזרק; isoOf מחווט פנימית. */
export function upcomingHolidays(fromIso, days = 45, holidayOf) {
  return _upcomingHolidays(fromIso, days, holidayOf, isoLocal);
}

/** כל שמות-החגים — holidayOf שקע-מוזרק. */
export function holidayNames(holidayOf) {
  return _holidayNames(holidayOf);
}

/** סינון-חבילות — smartFilter (מנוע-חיפוש) שקע-מוזרק. */
export function filterProducts(products, q, onlyActive, smartFilter) {
  return _filterProducts(products, q, onlyActive, smartFilter);
}

/** סינון-פריטים — itemRemaining מחווט פנימית; smartFilter שקע-מוזרק. */
export function filterItems(db, q, stockState, smartFilter) {
  return _filterItems(db, q, stockState, itemRemaining, smartFilter);
}

// pendingCount / progressOf — עוזרי-מיון פרטיים מהמקור (shop/lib.ts:484-496), חיים כחיווט-קופסה.
// componentRedeemedNow (המחווט) לא-תלוי-holidayOf: מקבל את מערך-החגים כפרמטר.
function pendingCount(db, a, holidays) {
  const product = db.shopProducts.find((p) => p.id === a.productId);
  if (!product) return 0;
  return product.components.filter((c) => !componentRedeemedNow(db, a, c, holidays)).length;
}
function progressOf(db, a, holidays) {
  const product = db.shopProducts.find((p) => p.id === a.productId);
  const total = product?.components.length ?? 0;
  if (!total) return 1;
  return (total - pendingCount(db, a, holidays)) / total;
}

/** סינון+מיון שיוכים — smartFilter (חיפוש) + holidayOf (לוח-עברי) שקעים-מוזרקים;
 *  pendingCount/progressOf + upcomingHolidays מחווטים פנימית. */
export function filterAssignments(db, q, status, pendingOnly, productId, sort, todayIso, holidayOf, smartFilter) {
  const wiredUpcoming = (fromIso, days) => _upcomingHolidays(fromIso, days, holidayOf, isoLocal);
  return _filterAssignments(db, q, status, pendingOnly, productId, sort, todayIso, wiredUpcoming, SHOP_HOLIDAY_DUE_DAYS, pendingCount, smartFilter, progressOf);
}

/** רשימת-הטיפול של החנות — holidayOf (לוח-עברי) + featureOn (קונפיג) שקעים-מוזרקים;
 *  כל שאר השכנים (11 שקעים) מחווטים פנימית מאטומי-הקופסה. */
export function needsCare(db, todayIso, config, holidayOf, featureOn) {
  const sockets = {
    upcomingHolidays: (fromIso, days) => _upcomingHolidays(fromIso, days, holidayOf, isoLocal),
    itemRemaining,
    componentRemaining,
    beneficiaryLabel,
    itemOf,
    holidayAllowed,
    assignmentRedeemed,
    couponExpiry,
    featureOn,
    expiringIntakes,
    shopHolidayDueDays: SHOP_HOLIDAY_DUE_DAYS,
  };
  return _needsCare(db, todayIso, config, sockets);
}
