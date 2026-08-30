/** קופסת-חיבורים · שכבת-ההעצמה (הקוקפיט). חוזה: empowerment.contract.md
 *  מקור-האמת: maor/src/components/supporters/{cockpit,intel,segments,portfolio,
 *  constellation,commands}.ts (L4). זו הנקודה היחידה שבה 27 חוטי-ההעצמה נפגשים
 *  (חוקי-החשמלאי, LAW.md) — הכרעות (סדר-ההצתה, ברירות-מחדל, כריכת-שכנים) חיות
 *  כאן; שקעי-האגרגט (sup·hok·org-cal) = חוטים חיצוניים הנכרכים כאן מהמחסן.
 *  אף אטום לא מייבא אטום — הכריכה כולה בקופסה (חוק-1/2). */

// ── חוטי-ההעצמה (new/atoms) ──────────────────────────────────────────────────
import { cockpitDaysSince } from '../atoms/cockpit-days-since.mjs';
import { cockpitAtRisk as cockpitAtRiskAtom } from '../atoms/cockpit-at-risk.mjs';
import { cockpitThanks as cockpitThanksAtom } from '../atoms/cockpit-thanks.mjs';
import { cockpitCalls as cockpitCallsAtom } from '../atoms/cockpit-calls.mjs';
import { cockpitHokTasks as cockpitHokTasksAtom } from '../atoms/cockpit-hok-tasks.mjs';
import { cockpitFeed as cockpitFeedAtom } from '../atoms/cockpit-feed.mjs';
import { cockpitKpis as cockpitKpisAtom } from '../atoms/cockpit-kpis.mjs';
import { cockpitQueue as cockpitQueueAtom } from '../atoms/cockpit-queue.mjs';
import { cockpitCollectedThisMonth } from '../atoms/cockpit-collected-this-month.mjs';
import { cockpitProgress } from '../atoms/cockpit-progress.mjs';
import { cockpitCsvRows } from '../atoms/cockpit-csv-rows.mjs';
import { cockpitWorkListText } from '../atoms/cockpit-work-list-text.mjs';
import { dayDiff } from '../atoms/intel-day-diff.mjs';
import { donorScan } from '../atoms/intel-donor-scan.mjs';
import { rfmFromScan as rfmFromScanAtom } from '../atoms/intel-rfm-from-scan.mjs';
import { churnFromScan as churnFromScanAtom } from '../atoms/intel-churn-from-scan.mjs';
import { forecastFromScan as forecastFromScanAtom } from '../atoms/intel-forecast-from-scan.mjs';
import { trendFromScan } from '../atoms/intel-trend-from-scan.mjs';
import { donorIntel as donorIntelAtom } from '../atoms/intel-donor-intel.mjs';
import { matchSegment as matchSegmentAtom } from '../atoms/segments-match-segment.mjs';
import { segmentCounts as segmentCountsAtom } from '../atoms/segments-segment-counts.mjs';
import { activeByMonth as activeByMonthAtom } from '../atoms/portfolio-active-by-month.mjs';
import { portfolioIntel as portfolioIntelAtom } from '../atoms/portfolio-portfolio-intel.mjs';
import { tierTrendCounts as __pure_tierTrendCounts } from '../atoms/portfolio-tier-trend-counts.mjs';
import { order } from '../atoms/portfolio-tier-trend-counts-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const tierTrendCountsAtom = (...a) => __pure_tierTrendCounts(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), order);
import { donorConstellation as __pure_donorConstellation } from '../atoms/constellation-donor-constellation.mjs';
import { TIER_KEY } from '../atoms/constellation-donor-constellation-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const donorConstellationAtom = (...a) => __pure_donorConstellation(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), TIER_KEY);
import { buildCommands } from '../atoms/commands-build-commands.mjs';
import { filterCommands } from '../atoms/commands-filter-commands.mjs';

// ── שקעי-האגרגט (new/atoms) — חוטים חיצוניים משכבת-התומכים, נכרכים כאן ──────────
import { supCount } from '../atoms/sup-count.mjs';
import { supLast } from '../atoms/sup-last.mjs';
import { supIls } from '../atoms/sup-ils.mjs';
import { supUsd } from '../atoms/sup-usd.mjs';
import { supTier } from '../atoms/sup-tier.mjs';
import { hokDue as hokDueAtom } from '../atoms/hok-due.mjs';
import { hokMonthlyTotal as hokMonthlyTotalAtom } from '../atoms/hok-monthly-total.mjs';
import { hokEffectivelyActive } from '../atoms/hok-effectively-active.mjs';
import { hokRecordedThisMonth as hokRecordedThisMonthAtom } from '../atoms/hok-recorded-this-month.mjs';
import { HOK_CAT } from '../atoms/hok-cat.mjs';
import { orgCalEntries as orgCalEntriesAtom } from '../atoms/org-cal-entries.mjs';
import { supDonEvents as supDonEventsAtom } from '../atoms/sup-don-events.mjs';

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
