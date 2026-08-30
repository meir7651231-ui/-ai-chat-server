/** קופסת-חיבורים · שכבת-ההעצמה (הקוקפיט). חוזה: empowerment.contract.md
 *  מקור-האמת: maor/src/components/supporters/{cockpit,intel,segments,portfolio,
 *  constellation,commands}.ts (L4). זו הנקודה היחידה שבה 27 חוטי-ההעצמה נפגשים
 *  (חוקי-החשמלאי, LAW.md) — הכרעות (סדר-ההצתה, ברירות-מחדל, כריכת-שכנים) חיות
 *  כאן; שקעי-האגרגט (sup·hok·org-cal) = חוטים חיצוניים הנכרכים כאן מהמחסן.
 *  אף אטום לא מייבא אטום — הכריכה כולה בקופסה (חוק-1/2). */

// ── חוטי-ההעצמה (new/atoms) ──────────────────────────────────────────────────
import { cockpitDaysSince } from '../atoms/cockpit-days-since.mjs';
import { cockpitAtRisk as cockpitAtRiskAtom } from '../atoms/cockpit-at-risk.mjs';
import { cockpitThanks as __pure_cockpitThanks } from '../atoms/cockpit-thanks.mjs';
import { COCKPIT_THANKS_T as __d_cockpitThanks_COCKPIT_THANKS_T } from '../atoms/cockpit-thanks-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const cockpitThanksAtom = (...a) => __pure_cockpitThanks(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_cockpitThanks_COCKPIT_THANKS_T);
import { cockpitCalls as __pure_cockpitCalls } from '../atoms/cockpit-calls.mjs';
import { COCKPIT_CALLS_T as __d_cockpitCalls_COCKPIT_CALLS_T } from '../atoms/cockpit-calls-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const cockpitCallsAtom = (...a) => __pure_cockpitCalls(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_cockpitCalls_COCKPIT_CALLS_T);
import { cockpitHokTasks as __pure_cockpitHokTasks } from '../atoms/cockpit-hok-tasks.mjs';
import { COCKPIT_HOK_TASKS_T as __d_cockpitHokTasks_COCKPIT_HOK_TASKS_T } from '../atoms/cockpit-hok-tasks-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const cockpitHokTasksAtom = (...a) => __pure_cockpitHokTasks(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_cockpitHokTasks_COCKPIT_HOK_TASKS_T);
import { cockpitFeed as __pure_cockpitFeed } from '../atoms/cockpit-feed.mjs';
import { COCKPIT_FEED_T as __d_cockpitFeed_COCKPIT_FEED_T } from '../atoms/cockpit-feed-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const cockpitFeedAtom = (...a) => __pure_cockpitFeed(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_cockpitFeed_COCKPIT_FEED_T);
import { cockpitKpis as cockpitKpisAtom } from '../atoms/cockpit-kpis.mjs';
import { cockpitQueue as cockpitQueueAtom } from '../atoms/cockpit-queue.mjs';
import { cockpitCollectedThisMonth } from '../atoms/cockpit-collected-this-month.mjs';
import { cockpitProgress } from '../atoms/cockpit-progress.mjs';
import { cockpitCsvRows as __pure_cockpitCsvRows } from '../atoms/cockpit-csv-rows.mjs';
import { COCKPIT_CSV_ROWS_T as __d_cockpitCsvRows_COCKPIT_CSV_ROWS_T } from '../atoms/cockpit-csv-rows-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const cockpitCsvRows = (...a) => __pure_cockpitCsvRows(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_cockpitCsvRows_COCKPIT_CSV_ROWS_T);
import { cockpitWorkListText as __pure_cockpitWorkListText } from '../atoms/cockpit-work-list-text.mjs';
import { COCKPIT_WORK_LIST_TEXT_T as __d_cockpitWorkListText_COCKPIT_WORK_LIST_TEXT_T } from '../atoms/cockpit-work-list-text-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const cockpitWorkListText = (...a) => __pure_cockpitWorkListText(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_cockpitWorkListText_COCKPIT_WORK_LIST_TEXT_T);
import { dayDiff as __pure_dayDiff } from '../atoms/intel-day-diff.mjs';
import { INTEL_DAY_DIFF_T as __d_intel_day_diff_T } from '../atoms/intel-day-diff-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const dayDiff = (...a) => __pure_dayDiff(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_intel_day_diff_T);
import { donorScan as __pure_donorScan } from '../atoms/intel-donor-scan.mjs';
import { INTEL_DONOR_SCAN_T as __d_intel_donor_scan_T } from '../atoms/intel-donor-scan-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const donorScan = (...a) => __pure_donorScan(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_intel_donor_scan_T);
import { rfmFromScan as __pure_rfmFromScan } from '../atoms/intel-rfm-from-scan.mjs';
import { INTEL_RFM_FROM_SCAN_T as __d_intel_rfm_from_scan_T } from '../atoms/intel-rfm-from-scan-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const rfmFromScanAtom = (...a) => __pure_rfmFromScan(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_intel_rfm_from_scan_T);
import { churnFromScan as __pure_churnFromScan } from '../atoms/intel-churn-from-scan.mjs';
import { INTEL_CHURN_FROM_SCAN_T as __d_intel_churn_from_scan_T } from '../atoms/intel-churn-from-scan-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const churnFromScanAtom = (...a) => __pure_churnFromScan(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_intel_churn_from_scan_T);
import { forecastFromScan as __pure_forecastFromScan } from '../atoms/intel-forecast-from-scan.mjs';
import { INTEL_FORECAST_FROM_SCAN_T as __d_intel_forecast_from_scan_T } from '../atoms/intel-forecast-from-scan-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const forecastFromScanAtom = (...a) => __pure_forecastFromScan(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_intel_forecast_from_scan_T);
import { trendFromScan as __pure_trendFromScan } from '../atoms/intel-trend-from-scan.mjs';
import { INTEL_TREND_FROM_SCAN_T as __d_trendFromScan_INTEL_TREND_FROM_SCAN_T } from '../atoms/intel-trend-from-scan-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const trendFromScan = (...a) => __pure_trendFromScan(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_trendFromScan_INTEL_TREND_FROM_SCAN_T);
import { donorIntel as donorIntelAtom } from '../atoms/intel-donor-intel.mjs';
import { matchSegment as __pure_matchSegment } from '../atoms/segments-match-segment.mjs';
import { SEGMENTS_MATCH_SEGMENT_T as __d_matchSegment_SEGMENTS_MATCH_SEGMENT_T } from '../atoms/segments-match-segment-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const matchSegmentAtom = (...a) => __pure_matchSegment(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_matchSegment_SEGMENTS_MATCH_SEGMENT_T);
import { segmentCounts as __pure_segmentCounts } from '../atoms/segments-segment-counts.mjs';
import { SEGMENTS_SEGMENT_COUNTS_T as __d_segmentCounts_SEGMENTS_SEGMENT_COUNTS_T } from '../atoms/segments-segment-counts-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const segmentCountsAtom = (...a) => __pure_segmentCounts(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_segmentCounts_SEGMENTS_SEGMENT_COUNTS_T);
import { activeByMonth as activeByMonthAtom } from '../atoms/portfolio-active-by-month.mjs';
import { portfolioIntel as __pure_portfolioIntel } from '../atoms/portfolio-portfolio-intel.mjs';
import { RISK as __d_portfolioIntel_RISK } from '../atoms/portfolio-portfolio-intel-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const portfolioIntelAtom = (...a) => __pure_portfolioIntel(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_portfolioIntel_RISK);
import { tierTrendCounts as __pure_tierTrendCounts } from '../atoms/portfolio-tier-trend-counts.mjs';
import { PORTFOLIO_TIER_TREND_COUNTS_T as __d_tierTrendCounts_PORTFOLIO_TIER_TREND_COUNTS_T } from '../atoms/portfolio-tier-trend-counts-strings.mjs';
import { order } from '../atoms/portfolio-tier-trend-counts-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const tierTrendCountsAtom = (...a) => __pure_tierTrendCounts(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), order, __d_tierTrendCounts_PORTFOLIO_TIER_TREND_COUNTS_T);
import { donorConstellation as __pure_donorConstellation } from '../atoms/constellation-donor-constellation.mjs';
import { CONSTELLATION_DONOR_CONSTELLATION_T as __d_donorConstellation_CONSTELLATION_DONOR_CONSTELLATION_T } from '../atoms/constellation-donor-constellation-strings.mjs';
import { TIER_KEY } from '../atoms/constellation-donor-constellation-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const donorConstellationAtom = (...a) => __pure_donorConstellation(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), TIER_KEY, __d_donorConstellation_CONSTELLATION_DONOR_CONSTELLATION_T);
import { buildCommands as __pure_buildCommands } from '../atoms/commands-build-commands.mjs';
import { COMMANDS_BUILD_COMMANDS_T as __d_buildCommands_COMMANDS_BUILD_COMMANDS_T } from '../atoms/commands-build-commands-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const buildCommands = (...a) => __pure_buildCommands(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_buildCommands_COMMANDS_BUILD_COMMANDS_T);
import { filterCommands as __pure_filterCommands } from '../atoms/commands-filter-commands.mjs';
import { COMMANDS_FILTER_COMMANDS_T as __d_filterCommands_COMMANDS_FILTER_COMMANDS_T } from '../atoms/commands-filter-commands-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const filterCommands = (...a) => __pure_filterCommands(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_filterCommands_COMMANDS_FILTER_COMMANDS_T);

// ── שקעי-האגרגט (new/atoms) — חוטים חיצוניים משכבת-התומכים, נכרכים כאן ──────────
import { supCount } from '../atoms/sup-count.mjs';
import { supLast } from '../atoms/sup-last.mjs';
import { supIls } from '../atoms/sup-ils.mjs';
import { supUsd } from '../atoms/sup-usd.mjs';
import { supTier as __pure_supTier } from '../atoms/sup-tier.mjs';
import { SUP_TIER_T as __d_supTier_SUP_TIER_T } from '../atoms/sup-tier-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const supTier = (...a) => __pure_supTier(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_supTier_SUP_TIER_T);
import { hokDue as hokDueAtom } from '../atoms/hok-due.mjs';
import { hokMonthlyTotal as hokMonthlyTotalAtom } from '../atoms/hok-monthly-total.mjs';
import { hokEffectivelyActive as __pure_hokEffectivelyActive } from '../atoms/hok-effectively-active.mjs';
import { HOK_EFFECTIVELY_ACTIVE_T as __d_hokEffectivelyActive_HOK_EFFECTIVELY_ACTIVE_T } from '../atoms/hok-effectively-active-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hokEffectivelyActive = (...a) => __pure_hokEffectivelyActive(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_hokEffectivelyActive_HOK_EFFECTIVELY_ACTIVE_T);
import { hokRecordedThisMonth as __pure_hokRecordedThisMonth } from '../atoms/hok-recorded-this-month.mjs';
import { HOK_EFFECTIVELY_ACTIVE_T as __d_hokRecordedThisMonth_HOK_RECORDED_THIS_MONTH_T } from '../atoms/hok-effectively-active-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hokRecordedThisMonthAtom = (...a) => __pure_hokRecordedThisMonth(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_hokRecordedThisMonth_HOK_RECORDED_THIS_MONTH_T);
import { HOK_CAT } from '../atoms/hok-cat.mjs';
import { orgCalEntries as __pure_orgCalEntries } from '../atoms/org-cal-entries.mjs';
import { ORG_CAL_ENTRIES_T as __d_orgCalEntries_ORG_CAL_ENTRIES_T } from '../atoms/org-cal-entries-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const orgCalEntriesAtom = (...a) => __pure_orgCalEntries(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_orgCalEntries_ORG_CAL_ENTRIES_T);
import { supDonEvents as __pure_supDonEvents } from '../atoms/sup-don-events.mjs';
import { SUP_DON_EVENTS_T as __d_supDonEvents_SUP_DON_EVENTS_T } from '../atoms/sup-don-events-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const supDonEventsAtom = (...a) => __pure_supDonEvents(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_supDonEvents_SUP_DON_EVENTS_T);

// ── כריכת-האגרגטים (השקעים-החיצוניים) ────────────────────────────────────────
//  5 האגרגטים supCount/supLast/supIls/supUsd/supTier טהורים ⇒ מיוצאים כמות-שהם.
//  שלושה דורשים כריכת תת-אטום — ביט-זהה לחיווט קופסת-התומכים:
const hokRecordedThisMonth = (sp, todayIso) => hokRecordedThisMonthAtom(sp, todayIso, HOK_CAT);
const hokDue = (supporters, todayIso) =>
  hokDueAtom(supporters, todayIso, hokEffectivelyActive, hokRecordedThisMonth);
const hokMonthlyTotal = (supporters, usdRate, todayIso) =>
  hokMonthlyTotalAtom(supporters, usdRate, todayIso, hokEffectivelyActive);
const supDonEvents = (sp) => supDonEventsAtom(sp); // ללא-config ⇒ fallback עברי (ביט-זהה)
const orgCalEntries = (supporters) => orgCalEntriesAtom(supporters, supDonEvents);

// ── סדר-ההצתה · שכבה-פנימית 1: בסיסים חסרי-תלות-אח ──────────────────────────
const daysSince = cockpitDaysSince; // כינוי-שקע: השם שהחוטים-האחים מצפים לו

// ── שכבה-פנימית 2: נגזרות שמקבלות את הבסיס כרוך ──────────────────────────────
const cockpitAtRisk = (supporters, todayIso, silentDays = 60) =>
  cockpitAtRiskAtom(supporters, todayIso, silentDays, { supCount, supLast, daysSince });
const cockpitThanks = (supporters, todayIso, windowDays = 3) =>
  cockpitThanksAtom(supporters, todayIso, windowDays, { daysSince });
const rfmFromScan = (scan, todayIso) => rfmFromScanAtom(scan, todayIso, { dayDiff });
const churnFromScan = (scan, todayIso) => churnFromScanAtom(scan, todayIso, { dayDiff });
const forecastFromScan = (scan, todayIso) => forecastFromScanAtom(scan, todayIso, { dayDiff });

// ── שכבה-פנימית 3: מורכבי-על (מקבלים את השכנים כבר-כרוכים) ────────────────────
const cockpitCalls = (supporters, todayIso, rate = 3.7, silentDays = 60) =>
  cockpitCallsAtom(supporters, todayIso, rate, silentDays,
    { supIls, supUsd, supLast, daysSince, cockpitAtRisk });
const cockpitHokTasks = (supporters, todayIso) =>
  cockpitHokTasksAtom(supporters, todayIso, { hokDue });
const cockpitFeed = (supporters, limit = 8) =>
  cockpitFeedAtom(supporters, limit, { orgCalEntries });
const cockpitKpis = (supporters, todayIso, rate = 3.7) =>
  cockpitKpisAtom(supporters, todayIso, rate,
    { cockpitCollectedThisMonth, hokMonthlyTotal, cockpitAtRisk });
const cockpitQueue = (supporters, todayIso, rate = 3.7) =>
  cockpitQueueAtom(supporters, todayIso, rate,
    { cockpitCalls, cockpitThanks, cockpitHokTasks });

const donorIntel = (sp, todayIso, rate = 3.7, months = 12) =>
  donorIntelAtom(sp, todayIso, rate, months,
    { donorScan, rfmFromScan, churnFromScan, forecastFromScan, trendFromScan });

const matchSegment = (sp, key, supporters, todayIso, rate = 3.7) =>
  matchSegmentAtom(sp, key, supporters, todayIso, rate,
    { cockpitAtRisk, supIls, supUsd, supLast, daysSince });
const segmentCounts = (supporters, todayIso, rate = 3.7) =>
  segmentCountsAtom(supporters, todayIso, rate,
    { cockpitAtRisk, supIls, supUsd, supLast, daysSince });

const activeByMonth = (supporters, todayIso, months = 12, rate = 3.7) =>
  activeByMonthAtom(supporters, todayIso, months, rate, { donorScan });
const portfolioIntel = (supporters, todayIso, rate = 3.7, topN = 10) =>
  portfolioIntelAtom(supporters, todayIso, rate, topN,
    { donorScan, dayDiff, rfmFromScan, churnFromScan, forecastFromScan, supTier });
const tierTrendCounts = (supporters, todayIso, rate = 3.7) =>
  tierTrendCountsAtom(supporters, todayIso, rate,
    { donorScan, rfmFromScan, trendFromScan, supTier });

const donorConstellation = (supporters, todayIso, opts = {}) =>
  donorConstellationAtom(supporters, todayIso, opts,
    { donorScan, dayDiff, rfmFromScan, churnFromScan, supTier });

// ── החשיפה ──────────────────────────────────────────────────────────────────
export {
  // קוקפיט
  cockpitDaysSince, cockpitAtRisk, cockpitThanks, cockpitCalls, cockpitHokTasks,
  cockpitFeed, cockpitKpis, cockpitQueue, cockpitCollectedThisMonth,
  cockpitProgress, cockpitCsvRows, cockpitWorkListText,
  // מודיעין
  dayDiff, donorScan, rfmFromScan, churnFromScan, forecastFromScan, trendFromScan, donorIntel,
  // סגמנטים
  matchSegment, segmentCounts,
  // תיק
  activeByMonth, portfolioIntel, tierTrendCounts,
  // גלקסיה
  donorConstellation,
  // פיקוד
  buildCommands, filterCommands,
  // אגרגטים-חיצוניים כרוכים (לשקיפות-חיווט; ה-board מזין מהתומכים)
  supCount, supLast, supIls, supUsd, supTier, hokDue, hokMonthlyTotal, orgCalEntries,
};
