import '../dart-data-maor/sup-tier-sockets.dart' as skb_sup_tier;
import '../dart-data-maor/hok-recorded-this-month-sockets.dart' as skb_hrtm;
import '../dart-data-maor/hok-effectively-active-sockets.dart' as skb_hea;
import '../dart-data-maor/sup-don-events-sockets.dart' as skb_sde;
import '../dart-data-maor/org-cal-entries-sockets.dart' as skb_oce;
import '../dart-data-maor/cockpit-csv-rows-sockets.dart' as skb_ccr;
import '../dart-data-maor/cockpit-work-list-text-sockets.dart' as skb_cwl;
import '../dart-data-maor/segments-segment-counts-terms.dart' as td_segments_segment_counts;
import '../dart-data-maor/portfolio-tier-trend-counts-terms.dart' as td_portfolio_tier_trend_counts;
import '../dart-data-maor/commands-build-commands-terms.dart' as td_commands_build_commands;
import '../dart-data-maor/cockpit-thanks-terms.dart' as td_cockpit_thanks;
import '../dart-data-maor/cockpit-hok-tasks-terms.dart' as td_cockpit_hok_tasks;
import '../dart-data-maor/cockpit-feed-terms.dart' as td_cockpit_feed;
import '../dart-data-maor/cockpit-calls-terms.dart';
// 📦 קופסת-חיבורים · שכבת-ההעצמה (Dart) — מחווטת 27 אטומי-Dart. מקבילה ל-new/boxes/empowerment.mjs.
// חוזה משותף: new/boxes/empowerment.contract.md. אותם 27 חוטים, אותו סדר-הצתה, אותן ברירות-מחדל.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותו fixture ⇒ אותו JSON.
// אף אטום לא מייבא אטום (חוק-1/2); כל הכריכה — כולל התאמות-טיפוס ל-Dart — חיה כאן בלבד.
import '../dart-maor/cockpit-days-since.dart' as dsc;
import '../dart-maor/cockpit-at-risk.dart' as ar;
import '../dart-maor/cockpit-thanks.dart' as th;
import '../dart-maor/cockpit-calls.dart' as ca;
import '../dart-maor/cockpit-hok-tasks.dart' as htk;
import '../dart-maor/cockpit-feed.dart' as fd;
import '../dart-maor/cockpit-kpis.dart' as kp;
import '../dart-maor/cockpit-queue.dart' as qu;
import '../dart-maor/cockpit-collected-this-month.dart' as cctm;
import '../dart-maor/cockpit-progress.dart' as cp;
import '../dart-maor/cockpit-csv-rows.dart' as ccr;
import '../dart-maor/cockpit-work-list-text.dart' as cwl;
import '../dart-maor/intel-day-diff.dart' as di;
import '../dart-maor/intel-donor-scan.dart' as dscan;
import '../dart-maor/intel-rfm-from-scan.dart' as rf;
import '../dart-maor/intel-churn-from-scan.dart' as ch;
import '../dart-maor/intel-forecast-from-scan.dart' as fc;
import '../dart-maor/intel-trend-from-scan.dart' as tr;
import '../dart-maor/intel-donor-intel.dart' as dintl;
import '../dart-maor/segments-match-segment.dart' as msg;
import '../dart-maor/segments-segment-counts.dart' as sgc;
import '../dart-maor/portfolio-active-by-month.dart' as abm;
import '../dart-maor/portfolio-portfolio-intel.dart' as pi;
import '../dart-maor/portfolio-tier-trend-counts.dart' as ttc;
import '../dart-maor/constellation-donor-constellation.dart' as con;
import '../dart-maor/commands-build-commands.dart' as bc;
import '../dart-maor/commands-filter-commands.dart' as flc;
import '../dart-maor/sup-count.dart' as sc;
import '../dart-maor/sup-last.dart' as sl;
import '../dart-maor/sup-ils.dart' as si;
import '../dart-maor/sup-usd.dart' as su;
import '../dart-maor/sup-tier.dart' as st;
import '../dart-maor/hok-due.dart' as hd;
import '../dart-maor/hok-monthly-total.dart' as hm;
import '../dart-maor/hok-effectively-active.dart' as hea;
import '../dart-maor/hok-recorded-this-month.dart' as hr;
import '../dart-maor/hok-cat.dart' as hc;
import '../dart-maor/org-cal-entries.dart' as oce;
import '../dart-maor/sup-don-events.dart' as sde;

// ── מתאמי-טיפוס (Dart קשיח-ארינות; ה-JS גמיש — כאן מיישרים) ──────────────────
int _scMap(Map sp) => (sc.supCount(sp) as num).toInt();
String _slMap(Map sp) => (sl.supLast(sp) ?? '') as String;
dynamic _slDyn(dynamic sp) => sl.supLast(sp);
num _ilsMap(Map sp) => si.supIls(sp) as num;
num _usdMap(Map sp) => su.supUsd(sp) as num;
num _ilsDyn(dynamic sp) => si.supIls(sp) as num;
num _usdDyn(dynamic sp) => su.supUsd(sp) as num;
Map _tier(num score) => st.supTier(score, skb_sup_tier.supTier_T);
num _dsSS(String iso, String today) => dsc.cockpitDaysSince(iso, today);
num _dsDS(dynamic iso, String today) => dsc.cockpitDaysSince(iso as String, today);
num _ddSS(String iso, String today) => di.dayDiff(iso, today);
num _ddDS(dynamic iso, String today) => di.dayDiff(iso as String, today);

// ── כריכת-האגרגטים (השקעים-החיצוניים — 3 דורשים תת-אטום) ─────────────────────
bool _hrtm(Map<String, Object?> sp, String today) => hr.hokRecordedThisMonth(sp, today, hc.hokCat, skb_hrtm.hokRecordedThisMonth_T);
bool _heaDyn(dynamic sp, dynamic today) =>
    hea.hokEffectivelyActive(sp as Map<String, Object?>, (today ?? '') as String, skb_hea.hokEffectivelyActive_T);
List _hokDue(List sups, String today) => hd.hokDue(
      sups.cast<Map<String, Object?>>(), today, (sp, t) => hea.hokEffectivelyActive(sp, t, skb_hea.hokEffectivelyActive_T), _hrtm);
num _hokMonthlyTotal(List sups, num rate, String today) =>
    hm.hokMonthlyTotal(sups, rate, today, _heaDyn);
List<Map<String, dynamic>> _supDon(Map<String, dynamic> sp) => sde.supDonEvents(sp, skb_sde.supDonEvents_T2);
List _orgCal(List sups) => oce.orgCalEntries(sups.cast<Map<String, dynamic>>(), _supDon, skb_oce.orgCalEntries_T);

Map _scanLoose(dynamic sp, String t, num r, int m) => dscan.donorScan(sp as Map<String, dynamic>, t, r, m);
Map _rfmLoose(Map scan, String t) => rf.rfmFromScan(scan as Map<String, dynamic>, t, _ddSS);
num _churnLoose(Map scan, String t) => ch.churnFromScan(scan as Map<String, dynamic>, t, _ddSS);
Map? _forecastLoose(Map scan, String t) => fc.forecastFromScan(scan as Map<String, dynamic>, t, _ddSS);
Map _trendLoose(Map scan) => tr.trendFromScan(scan as Map<String, dynamic>);

// ── שכבה 1: בסיסים (passthrough — כינויי-שקע לחוטים-האחים) ────────────────────
num cockpitDaysSince(String iso, String today) => dsc.cockpitDaysSince(iso, today);
num dayDiff(String iso, String today) => di.dayDiff(iso, today);
Map<String, dynamic> donorScan(Map<String, dynamic> sp, String today, [num rate = 3.7, int months = 12]) =>
    dscan.donorScan(sp, today, rate, months);
Map<String, dynamic> trendFromScan(Map<String, dynamic> scan) => tr.trendFromScan(scan);
int cockpitCollectedThisMonth(List sups, String today, [num rate = 3.7]) =>
    cctm.cockpitCollectedThisMonth(sups, today, rate);
Map<String, dynamic> cockpitProgress(Map queue, Set doneIds) => cp.cockpitProgress(queue, doneIds);
List<List> cockpitCsvRows(Map queue) => ccr.cockpitCsvRows(queue, skb_ccr.cockpitCsvRows_T);
String cockpitWorkListText(Map queue) => cwl.cockpitWorkListText(queue, skb_cwl.cockpitWorkListText_T);
List<Map<String, dynamic>> buildCommands(Map<String, dynamic> ctx) => bc.buildCommands(ctx, term: (k)=>td_commands_build_commands.kTerms[k]!);
List<Map<String, dynamic>> filterCommands(List<Map<String, dynamic>> commands, String query, [int limit = 12]) =>
    flc.filterCommands(commands, query, limit);
int supCount(dynamic sp) => sc.supCount(sp);
dynamic supLast(dynamic sp) => sl.supLast(sp);
num supIls(dynamic sp) => si.supIls(sp);
num supUsd(dynamic sp) => su.supUsd(sp);
Map<String, String> supTier(dynamic score) => st.supTier(score, skb_sup_tier.supTier_T);
List hokDue(List sups, String today) => _hokDue(sups, today);
num hokMonthlyTotal(List sups, num rate, String today) => _hokMonthlyTotal(sups, rate, today);
List orgCalEntries(List sups) => _orgCal(sups);

// ── שכבה 2: נגזרות ─────────────────────────────────────────────────────────
List cockpitAtRisk(List sups, String today, [int silentDays = 60]) =>
    ar.cockpitAtRisk(sups, today, silentDays, _scMap, _slMap, _dsSS);
List<Map<String, dynamic>> cockpitThanks(List sups, String today, [int windowDays = 3]) =>
    th.cockpitThanks(sups, today, windowDays, _dsSS, term: (k)=>td_cockpit_thanks.kTerms[k]!);
Map<String, dynamic> rfmFromScan(Map<String, dynamic> scan, String today) =>
    rf.rfmFromScan(scan, today, _ddSS);
num churnFromScan(Map<String, dynamic> scan, String today) => ch.churnFromScan(scan, today, _ddSS);
Map<String, dynamic>? forecastFromScan(Map<String, dynamic> scan, String today) =>
    fc.forecastFromScan(scan, today, _ddSS);

// ── שכבה 3: מורכבי-על ──────────────────────────────────────────────────────
List<Map<String, dynamic>> cockpitCalls(List sups, String today, [num rate = 3.7, int silentDays = 60]) =>
    ca.cockpitCalls(sups, today, rate, silentDays, _ilsMap, _usdMap, _slMap, _dsSS, cockpitAtRisk, term: (k)=>kTerms[k]!);
List<Map<String, dynamic>> cockpitHokTasks(List sups, String today) =>
    htk.cockpitHokTasks(sups, today, _hokDue, term: (k)=>td_cockpit_hok_tasks.kTerms[k]!);
List<Map<String, dynamic>> cockpitFeed(List sups, [int limit = 8]) =>
    fd.cockpitFeed(sups, limit, _orgCal, term: (k)=>td_cockpit_feed.kTerms[k]!);
Map<String, dynamic> cockpitKpis(List sups, String today, [num rate = 3.7]) => kp.cockpitKpis(
      sups, today, rate,
      cctm.cockpitCollectedThisMonth,
      (List ls, num r) => _hokMonthlyTotal(ls, r, today),
      cockpitAtRisk,
    );
Map<String, dynamic> cockpitQueue(List sups, String today, [num rate = 3.7]) =>
    qu.cockpitQueue(sups, today, rate, cockpitCalls, cockpitThanks, cockpitHokTasks);

Map<String, dynamic> donorIntel(Map<String, dynamic> sp, String today, [num rate = 3.7, int months = 12]) =>
    dintl.donorIntel(
      sp, today, rate: rate, months: months,
      donorScan: (Map<String, dynamic> s, String t, num r, int m) => dscan.donorScan(s, t, r, m),
      rfmFromScan: rfmFromScan,
      churnFromScan: churnFromScan,
      forecastFromScan: forecastFromScan,
      trendFromScan: (Map<String, dynamic> s) => tr.trendFromScan(s),
    );

List<Map<String, dynamic>> segmentCounts(List sups, String today, [num rate = 3.7]) => sgc.segmentCounts(
      sups, today, rate: rate,
      cockpitAtRisk: cockpitAtRisk, supIls: _ilsDyn, supUsd: _usdDyn, supLast: _slDyn, daysSince: _dsDS,
     term: (k)=>td_segments_segment_counts.kTerms[k]!);
bool matchSegment(dynamic sp, String key, List sups, String today, [num rate = 3.7]) => msg.matchSegment(
      sp, key, sups, today, rate: rate,
      cockpitAtRisk: cockpitAtRisk, supIls: _ilsDyn, supUsd: _usdDyn, supLast: _slDyn, daysSince: _dsDS,
    );

List<int> activeByMonth(List sups, String today, [int months = 12, num rate = 3.7]) =>
    abm.activeByMonth(sups, today, months: months, rate: rate, donorScan: _scanLoose);
Map<String, dynamic> portfolioIntel(List sups, String today, [num rate = 3.7, int topN = 10]) => pi.portfolioIntel(
      sups, today, rate: rate, topN: topN,
      donorScan: _scanLoose, dayDiff: _ddDS,
      rfmFromScan: _rfmLoose, churnFromScan: _churnLoose, forecastFromScan: _forecastLoose, supTier: _tier,
    );
List<Map<String, dynamic>> tierTrendCounts(List sups, String today, [num rate = 3.7]) => ttc.tierTrendCounts(
      sups, today, rate: rate,
      donorScan: _scanLoose, rfmFromScan: _rfmLoose, trendFromScan: _trendLoose, supTier: _tier,
     term: (k)=>td_portfolio_tier_trend_counts.kTerms[k]!);
List<Map<String, dynamic>> donorConstellation(List sups, String today, [Map opts = const {}]) =>
    con.donorConstellation(
      sups, today, opts: opts,
      donorScan: _scanLoose, dayDiff: _ddDS, rfmFromScan: _rfmLoose, churnFromScan: _churnLoose, supTier: _tier,
    );
