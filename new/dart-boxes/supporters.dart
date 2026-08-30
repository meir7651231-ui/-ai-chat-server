import '../dart-data-maor/personal-cal-entries-sockets.dart' as skb_personal_cal_entries;
import '../dart-data-maor/sup-tier-sockets.dart' as skb_sup_tier;
import '../dart-data-maor/sup-don-events-sockets.dart' as skb_sde;
import '../dart-data-maor/org-cal-entries-sockets.dart' as skb_oce;
import '../dart-data-maor/plan-add-name-sockets.dart' as skb_pan;
import '../dart-data-maor/hok-effectively-active-sockets.dart' as skb_hea;
import '../dart-data-maor/hok-recorded-this-month-sockets.dart' as skb_hrtm;
import '../dart-data-maor/hok-method-label-terms.dart' as td_hok_method_label;
import '../dart-data-maor/don-cal-month-line-terms.dart';
// 📦 קופסת-חיבורים · תומכים (Dart) — מחווטת 45 אטומי-Dart. מקבילה ל-new/boxes/supporters.mjs.
// חוזה משותף: new/boxes/supporters.contract.md. מקור-האמת: maor/src/components/supporters/lib.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// הכרעות-הקופסה (emptyAyin/fillEmpty/visibleSupportersForDesignations) = ידע-קופסה (חוק-5),
// חיות כאן verbatim. שקעי-IO אמיתיים (clockIso/mkId/config) = פרמטרים מוזרקים.

// ── חוטי-התומכים (new/dart-maor) ──
import '../dart-maor/fmt-date.dart' as fd;
import '../dart-maor/supporter-purposes.dart' as sp_;
import '../dart-maor/supporter-visible-for-designations.dart' as svfd;
import '../dart-maor/all-donation-purposes.dart' as adp;
import '../dart-maor/sup-ils.dart' as si;
import '../dart-maor/sup-usd.dart' as su;
import '../dart-maor/sup-count.dart' as scnt;
import '../dart-maor/sup-last.dart' as sl;
import '../dart-maor/sup-last-in-period.dart' as slip;
import '../dart-maor/sup-total-ils.dart' as sti;
import '../dart-maor/sup-score.dart' as ss;
import '../dart-maor/sup-tier.dart' as st;
import '../dart-maor/tier-order.dart' as tord;
import '../dart-maor/sup-score-bins.dart' as ssb;
import '../dart-maor/sup-avg-don.dart' as sad;
import '../dart-maor/sup12m.dart' as s12;
import '../dart-maor/chip-style.dart' as cs;
import '../dart-maor/fix-phone.dart' as fp;
import '../dart-maor/total-label.dart' as tl;
import '../dart-maor/sup-don-events.dart' as sde;
import '../dart-maor/personal-cal-entries.dart' as pce;
import '../dart-maor/org-cal-entries.dart' as oce;
import '../dart-maor/don-cal-month-line.dart' as dcml;
import '../dart-maor/norm-name.dart' as nn;
import '../dart-maor/sup-name-keys.dart' as snk;
import '../dart-maor/excel-serial-to-iso.dart' as esti;
import '../dart-maor/parse-supporter-grid.dart' as psg;
import '../dart-maor/parse-supporter-csv.dart' as psc;
import '../dart-maor/apply-ayin-names.dart' as aan;
import '../dart-maor/merge-hist.dart' as mh;
import '../dart-maor/plan-supporter-import.dart' as psi;
import '../dart-maor/merge-supporter-row.dart' as msr;
import '../dart-maor/new-supporter-from-row.dart' as nsfr;
import '../dart-maor/hok-cat.dart' as hc;
import '../dart-maor/hok-effectively-active.dart' as hea;
import '../dart-maor/hok-recorded-this-month.dart' as hrtm;
import '../dart-maor/hok-due.dart' as hd;
import '../dart-maor/hok-monthly-total.dart' as hmt;
import '../dart-maor/hok-method-label.dart' as hml;

// ── חוטי-מודולים-אחרים (אטומים חיצוניים; קריאות-שכן ⇒ שקע, LAW חוק-1/3) ──
import '../dart-maor/term-of.dart' as to;
import '../dart-maor/norm-search.dart' as ns;
import '../dart-maor/format-israeli-phone.dart' as fip;
import '../dart-maor/parse-any-date.dart' as pad;
import '../dart-maor/parse-csv.dart' as pc;
import '../dart-maor/plan-add-name.dart' as pan;

// ── שקעי-IO (מוזרקים, לא ממומשים כאן) ──────────────────────────────────────
// clockIso: () => 'YYYY-MM-DD' — שעון-מקומי. שעון אמיתי (IO); ברירת-המחדל אצל הקורא.

// ── מילון-החלטות (חי בקופסה) ────────────────────────────────────────────────
/// ברירת-מחדל: תיק-מעקב ריק — ביט-זהה ל-domain.emptyAyin. החלטת-קופסה (חוק-5).
Map<String, dynamic> emptyAyin() => {
      'stage': 'new', 'note': '', 'answeredNote': '', 'answerPushed': false,
      'nextTalk': '', 'nextTalkTime': '', 'lastTouch': '',
      'names': [], 'answers': [], 'log': [], 'time': [], 'mat': [],
    };

/// מדיניות-מיזוג-שדות בייבוא (a גובר; b ממלא חוסרים; hist/ayinNames מצטרפים) —
/// verbatim מ-lib.ts:522-531. helper-חיווט מקומי (המדיניות שייכת לקופסה).
dynamic _fillEmpty(dynamic a, dynamic b) {
  final out = <String, dynamic>{...(a as Map).cast<String, dynamic>()};
  (b as Map).forEach((k, v) {
    if (k == 'hist') return;
    if (!_truthy(out[k]) && _truthy(v)) out[k as String] = v;
  });
  final aHist = a['hist'], bHist = b['hist'];
  if (_len(aHist) > 0 || _len(bHist) > 0) {
    out['hist'] = [...(aHist as List? ?? const []), ...(bHist as List? ?? const [])];
  }
  final aAyin = a['ayinNames'], bAyin = b['ayinNames'];
  if (_len(aAyin) > 0 || _len(bAyin) > 0) {
    out['ayinNames'] = [...(aAyin as List? ?? const []), ...(bAyin as List? ?? const [])];
  }
  return out;
}

bool _truthy(dynamic v) =>
    !(v == null || v == false || v == 0 || v == '' || (v is num && v.isNaN));
int _len(dynamic v) => v is List ? v.length : 0;

// ── פורמט / זהות ─────────────────────────────────────────────────────────────
String fmtDate(String? iso) => fd.fmtDate(iso);
String normName(dynamic s) => nn.normName(s, ns.normSearch);
String fixPhone(dynamic p) => fp.fixPhone(p, fip.formatIsraeliPhone);

// ── אגרגטים (pass-through — האטום כבר מקבל dynamic sp) ────────────────────────
dynamic supIls(dynamic sp) => si.supIls(sp);
dynamic supUsd(dynamic sp) => su.supUsd(sp);
dynamic supCount(dynamic sp) => scnt.supCount(sp);
dynamic supLast(Map sp) => sl.supLast(sp);
bool supLastInPeriod(dynamic sp, dynamic year, dynamic month) =>
    slip.supLastInPeriod(sp, year, month, sl.supLast);
dynamic supTotalIls(dynamic sp, [dynamic rate = 3.7]) =>
    sti.supTotalIls(sp, rate: rate, supIls: si.supIls, supUsd: su.supUsd);
dynamic totalLabel(dynamic sp) => tl.totalLabel(sp, si.supIls, su.supUsd);

// ── ניקוד / דרגות ────────────────────────────────────────────────────────────
int supScore(dynamic sp, [dynamic rate = 3.7]) => ss.supScore(sp,
    rate: rate,
    supTotalIls: (s, r) => supTotalIls(s, r),
    supLast: (s) => sl.supLast(s),
    supCount: scnt.supCount);
Map<String, String> supTier(dynamic sc) => st.supTier(sc, skb_sup_tier.supTier_T);
List<String> get tierOrder => tord.tierOrder;
List<int> supScoreBins(List<dynamic> supporters, [dynamic rate = 3.7]) =>
    ssb.supScoreBins(supporters, rate: rate, supScore: (s, r) => supScore(s, r));
dynamic supAvgDon(dynamic supporters, [dynamic rate = 3.7]) =>
    sad.supAvgDon(supporters, (s, r) => supTotalIls(s, r), scnt.supCount, rate);
dynamic sup12m(dynamic supporters, dynamic todayIso) =>
    s12.sup12m(supporters, todayIso, sl.supLast);

// ── פריטי-עזר ────────────────────────────────────────────────────────────────
Map<String, dynamic> chipStyle(String bg, String c) => cs.chipStyle(bg, c);
List<String> supporterPurposes(Map sup) => sp_.supporterPurposes(sup);
bool supporterVisibleForDesignations(dynamic sup, dynamic allowed) =>
    svfd.supporterVisibleForDesignations(sup, allowed);
List<String> allDonationPurposes(List supporters) =>
    adp.allDonationPurposes<Map>(supporters.cast<Map>(), sp_.supporterPurposes);

// ── אירועי-לוח (config אופציונלי מחווט ל-termOf) ──────────────────────────────
List<Map<String, dynamic>> supDonEvents(dynamic sp, [Map? config]) => sde.supDonEvents(
    sp, skb_sde.supDonEvents_T2, config != null ? (String k, String fb) => to.termOf(config, k, fb) : null);
List<Map<String, dynamic>> personalCalEntries(Map sp) =>
    pce.personalCalEntries(sp, (s) => supDonEvents(s), skb_personal_cal_entries.personalCalEntries_T);
List<Map<String, dynamic>> orgCalEntries(List<Map<String, dynamic>> supporters) =>
    oce.orgCalEntries(supporters, (s) => supDonEvents(s), skb_oce.orgCalEntries_T);
String donCalMonthLine(Iterable entries, bool Function(dynamic date) inMonth, [Map? config]) =>
    dcml.donCalMonthLine(entries, inMonth, config,
        (Map c, String k, String fb) => to.termOf(c, k, fb) as String, term: (k)=>kTerms[k]!);

// ── ראוּת-רשימה פר-ייעוד (verbatim מ-lib.ts:81-91; מחווט מעל האטום-הבודד התקין) ──
List<dynamic> visibleSupportersForDesignations(List<dynamic> supporters, dynamic allowed) {
  if (allowed == null || (allowed as List).isEmpty) return supporters;
  final set = <String>{for (final s in allowed) (s as String).trim()};
  return [
    for (final sup in supporters)
      if (svfd.supporterVisibleForDesignations(sup, allowed))
        {
          ...(sup as Map),
          'donations': [
            for (final d in (((sup['donations']) ?? const []) as List))
              if (_purposeVisible(d, set)) d,
          ],
        },
  ];
}

bool _purposeVisible(dynamic d, Set<String> set) {
  final p = (((d as Map)['purpose'] ?? '') as String).trim();
  return p.isEmpty || set.contains(p);
}

// ── ייבוא ────────────────────────────────────────────────────────────────────
List<String> get supNameKeys => snk.supNameKeys;
String excelSerialToIso(Object? serial) => esti.excelSerialToIso(serial);
List<Map<String, dynamic>> parseSupporterGrid(List<List<Object?>> rows) =>
    psg.parseSupporterGrid(rows, snk.supNameKeys, pad.parseAnyDate, esti.excelSerialToIso);
List<Map<String, dynamic>> parseSupporterCsv(String text) =>
    psc.parseSupporterCsv<Map<String, dynamic>>(text, pc.parseCsv, parseSupporterGrid);
Map<String, dynamic> planSupporterImport(List rows, List existing) =>
    psi.planSupporterImport(rows, existing, normName, _fillEmpty);
List<Object?> mergeHist(Object? existing, Object? incoming) => mh.mergeHist(existing, incoming);
Map<String, Object?> mergeSupporterRow(Map<String, Object?> sp, Map<String, Object?> row) =>
    msr.mergeSupporterRow(sp, row, mh.mergeHist, fixPhone);
Map<String, dynamic> newSupporterFromRow(dynamic id, Map<String, dynamic> row) =>
    nsfr.newSupporterFromRow(id, row, fixPhone, mh.mergeHist);

/// שם-לטיפול מהייבוא ⇒ תיק-המעקב. planAddName מחווט עם normName + שקע-שעון
/// (clockIso, מוזרק); בנתיב הזה eyes='' ⇒ isoToday לעולם לא נקרא (חוזה).
Map<String, dynamic> applyAyinNames(
        Map<String, dynamic> sp, List<String> names, String Function() mkId, String Function() clockIso) =>
    aan.applyAyinNames(sp, names, mkId, emptyAyin,
        (Map<String, dynamic> a, String nm, String eyes, String id) =>
            pan.planAddName(a, nm, eyes, id, normName, clockIso, skb_pan.planAddName_T));

// ── הו"ק ─────────────────────────────────────────────────────────────────────
String get hokCat => hc.hokCat;
String hokMethodLabel(String m) => hml.hokMethodLabel(m, term: (k)=>td_hok_method_label.kTerms[k]!);
bool hokEffectivelyActive(Map sp, String iso) =>
    hea.hokEffectivelyActive(sp.cast<String, Object?>(), iso, skb_hea.hokEffectivelyActive_T);
bool hokRecordedThisMonth(Map sp, String iso) =>
    hrtm.hokRecordedThisMonth(sp, iso, hc.hokCat, skb_hrtm.hokRecordedThisMonth_T);
List<Map<String, Object?>> hokDue(List supporters, String todayIso) {
  final sups = [for (final s in supporters) (s as Map).cast<String, Object?>()];
  return hd.hokDue(sups, todayIso, (s, i) => hea.hokEffectivelyActive(s, i, skb_hea.hokEffectivelyActive_T),
      (s, i) => hrtm.hokRecordedThisMonth(s, i, hc.hokCat, skb_hrtm.hokRecordedThisMonth_T));
}

int hokMonthlyTotal(List supporters, num usdRate, [Object? todayIso]) => hmt.hokMonthlyTotal(
    supporters, usdRate, todayIso,
    (s, i) => hea.hokEffectivelyActive((s as Map).cast<String, Object?>(), i as String, skb_hea.hokEffectivelyActive_T));

// ── שקע-שעון (IO): ISO של היום. מוזרק — הקופסה לא מממשת שעון. ──────────────────
dynamic isoToday(dynamic Function() clockIso) => clockIso();
