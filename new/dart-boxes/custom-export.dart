// 📦 קופסת-חיבורים · דו"ח מותאם (Dart) — מחווטת 26 אטומי-Dart. מקבילה ל-new/boxes/custom-export.mjs.
// חוזה משותף: new/boxes/custom-export.contract.md · מקור-האמת (L4): maor/src/lib/customExport.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// ── ההכרעות שחיות כאן (חיווט, לא אטום) — כמו במקור-ה-JS ──
// · NAV_MODULE_KEYS — תשעת מודולי-הניווט (config.ts:20-30) — שקע-מילון של feature-on.
// · HEBREW_RECURRING — אירועים החוזרים שנתית לפי התאריך העברי (domain.ts:363-367).
// · scanHebYear — מטמון פר-שנה-עברית (רצף-חודשים + has30), verbatim מ-hebrew.ts:60-77
//   על אטום-hebParts. ‏JS `new Date(gy, 7, 1+i, 12)` — month index 0-based, 7=אוגוסט
//   ⇒ ב-Dart `DateTime(gy, 8, …)` (כמו hebdate.dart).
// · שרשרת-התאריך-העברי (hebDateFull על gem/gemYear/hebParts) + שרשרת-הסקור
//   (supScore על supTotalIls/supLast/supCount) — חיווט-שכנים verbatim מהמקור.
//
// שקע-IO יחיד: nowMs (טריות-supScore) — מוזרק אופציונלי; חסר ⇒ DateTime.now() בתוך
//   האטום, ביט-זהה למקור-ה-JS (Date.now() פנימי).
//
// מתאמי-טיפוס (חוק-3): termOf של האטום מחזיר dynamic — עטוף לשלוש חתימות-שקע
//   (Object?/Map/dynamic) שהאטומים featLabel/itemLabel/unitLabel דורשים. supCount/
//   supIls/supUsd מוחזרים כ-num מנורמל-JS (_jsNum) לשקעי-ExportSockets — האטומים
//   מחזירים double (חוק-17: ‏.toDouble() לדיוק), אך האטום build-custom-export משרשר
//   אותם ל-string; ‏JS ‏`String(4)`⇒"4" בעוד Dart ‏`(4.0).toString()`⇒"4.0", לכן
//   double שלם ⇒ int (זהות-ביט למחרוזת-ה-JS). hebParts(Map) ⇒ רשומות ל-hebAnnualEq.
import '../dart-maor/exp-field-defs.dart' as efd;
import '../dart-maor/override-column.dart' as oc;
import '../dart-maor/build-custom-export.dart' as bce;
import '../dart-maor/feature-on.dart' as fo;
import '../dart-maor/module-on.dart' as mo;
import '../dart-maor/term-of.dart' as tof;
import '../dart-maor/feat-label.dart' as fl;
import '../dart-maor/item-label.dart' as il;
import '../dart-maor/unit-label.dart' as ul;
import '../dart-maor/stage-label.dart' as sla;
import '../dart-maor/sessions-of.dart' as so;
import '../dart-maor/enroll-count.dart' as ec;
import '../dart-maor/heb-parts.dart' as hp;
import '../dart-maor/heb-annual-eq.dart' as hae;
import '../dart-maor/heb-date-full.dart' as hdf;
import '../dart-maor/gematria.dart' as gm;
import '../dart-maor/gem-year.dart' as gy;
import '../dart-maor/sup-count.dart' as sc;
import '../dart-maor/sup-ils.dart' as si;
import '../dart-maor/sup-usd.dart' as su;
import '../dart-maor/sup-last.dart' as sl;
import '../dart-maor/sup-total-ils.dart' as sti;
import '../dart-maor/sup-score.dart' as ss;
import '../dart-maor/sup-tier.dart' as st;
import '../dart-maor/ev-meta.dart' as em;
import '../dart-maor/day-names.dart' as dn;

// ── הכרעות-הקופסה (חיווט-הצבה, verbatim מהמקור) ──
/// תשעת מודולי-הניווט הניתנים-לכיבוי — maor/src/lib/config.ts:20-30.
const List<String> NAV_MODULE_KEYS = [ // ignore: constant_identifier_names
  'families',
  'courses',
  'calendar',
  'diary',
  'supporters',
  'reports',
  'tzedaka',
  'shop',
  'shop7',
];

/// אירועים החוזרים שנתית לפי התאריך העברי — maor/src/types/domain.ts:363-367.
final Set<String> HEBREW_RECURRING = {'memorial', 'anniversary', 'bday'};

/// שמות ימי-השבוע — אטום-DAY_NAMES (courses/lib.ts:80).
final List<String> DAY_NAMES = dn.dayNames();

// נרמול-מספר-JS: double שלם ⇒ int (כדי ש-`.toString()` יתאים ל-`String(n)` של JS).
num _jsNum(dynamic v) {
  final n = v as num;
  if (n is int) return n;
  return (n.isFinite && n == n.roundToDouble()) ? n.toInt() : n;
}

// ── מתאמי-termOf: האטום מחזיר dynamic; עטוף לשלוש חתימות-השקע הנדרשות (חוק-3) ──
String _termOfS(dynamic cfg, String key, String fb) => tof.termOf(cfg, key, fb) as String;
String _termOfObj(Object? cfg, String key, String fb) => tof.termOf(cfg, key, fb) as String;
String _termOfMap(Map<String, dynamic> cfg, String key, String fb) => tof.termOf(cfg, key, fb) as String;
dynamic _termOfDyn(dynamic cfg, String key, String fb) => tof.termOf(cfg, key, fb);

// ── חיווט-שכנים (השקעים של האטומים ⇐ אטומים אחרים) ──
bool _featureOn(dynamic cfg, String key) => fo.featureOn(cfg as Map<String, dynamic>, key, NAV_MODULE_KEYS, mo.moduleOn);
String _featLabel(dynamic cfg) => fl.featLabel(cfg, _termOfObj);
String _itemLabel(dynamic cfg) => il.itemLabel(cfg as Map<String, dynamic>, _termOfMap);
String _unitLabel(dynamic cfg) => ul.unitLabel(cfg, _termOfDyn) as String;
String _gemYear(String y) => gy.gemYear(y, gm.gem);
String _hebDateFull(String iso) => hdf.hebDateFull(iso, gm.gem, _gemYear, (d) => hp.hebParts(d));
dynamic _supTotalIls(dynamic sp, dynamic rate) => sti.supTotalIls(sp, rate: rate, supIls: si.supIls, supUsd: su.supUsd);

// ── מטמון פר-שנה-עברית (רצף-חודשים + has30) — חיווט-השכן של hebAnnualEq,
//    verbatim מ-maor/src/lib/hebrew.ts:60-77 על אטום-hebParts. ──
final Map<int, ({List<String> seq, Set<String> has30})> _hebYearScan = {};
({List<String> seq, Set<String> has30}) _scanHebYear(int hebYear) {
  final hit = _hebYearScan[hebYear];
  if (hit != null) return hit;
  final seq = <String>[];
  final has30 = <String>{};
  final gy = hebYear - 3761; // 1 באוגוסט של השנה הזו קודם תמיד לא' תשרי של hebYear
  for (var i = 0; i < 440; i++) {
    final p = hp.hebParts(DateTime(gy, 8, 1 + i, 12)); // JS month 7 (0-based) = אוגוסט ⇒ Dart 8
    if (p['year'] != hebYear) continue;
    final m = p['month'] as String;
    if (!seq.contains(m)) seq.add(m);
    if (p['day'] == 30) has30.add(m);
  }
  final res = (seq: seq, has30: has30);
  _hebYearScan[hebYear] = res;
  return res;
}

// hebAnnualEq: שכני-hebParts (Map) ⇒ רשומות-האטום; scanHebYear כשקע (חוק-3).
bool _hebAnnualEq(dynamic anchor, dynamic query) {
  final a = anchor as Map;
  final q = query as Map;
  return hae.hebAnnualEq(
    (day: a['day'] as int, month: a['month'] as String),
    (day: q['day'] as int, month: q['month'] as String, year: q['year'] as int?),
    _scanHebYear,
  );
}

// ── החשיפה (חתימות-המקור) ──────────────────────────────────────────────────
/// הגדרות-שדות (key+label) של הדו"ח המותאם לפי יעד: חוגים / אירועים / תומכות.
List<Map<String, String>> expFieldDefs(dynamic cfg, String target) =>
    efd.expFieldDefs<dynamic>(cfg, target, _featureOn, _termOfS, _featLabel, _itemLabel, _unitLabel);

/// דריסת עמודה בשורות (כותרת חסינה, אי-מוטציה, colIdx<0 ⇒ כניסה-כיציאה).
List<dynamic> overrideColumn(List<dynamic> rows, int colIdx, Map overrides) =>
    oc.overrideColumn(rows, colIdx, overrides);

/// בניית שורות הדו"ח המותאם. nowMs = שקע-IO אופציונלי (טריות-supScore) —
/// חסר ⇒ התנהגות-המקור (Date.now() פנימי).
List<List<String>> buildCustomExport(
  dynamic cfg,
  Map db,
  String target,
  Map range,
  List<String> selectedKeys, [
  dynamic nowMs,
]) {
  // supScore: המקור קורא supScore(sp, db.usdRate) עם Date.now() פנימי; nowMs (שקע-IO)
  // מוזרק רק כשהקורא מבקש דטרמיניזם — חסר ⇒ התנהגות-המקור.
  num supScore(dynamic sp, dynamic rate) =>
      ss.supScore(sp, rate: rate, nowMs: nowMs, supTotalIls: _supTotalIls, supLast: (s) => sl.supLast(s as Map), supCount: sc.supCount);
  return bce.buildCustomExport(
    cfg,
    db,
    target,
    range,
    selectedKeys,
    bce.ExportSockets(
      expFieldDefs: (c, t) => expFieldDefs(c, t),
      featureOn: _featureOn,
      termOf: _termOfS,
      sessionsOf: (course) => so.sessionsOf(course) as List,
      enrollCount: (d, courseId) => ec.enrollCount(d, courseId),
      hebParts: (d) => hp.hebParts(d),
      hebAnnualEq: _hebAnnualEq,
      hebDateFull: _hebDateFull,
      supCount: (sp) => _jsNum(sc.supCount(sp)),
      supIls: (sp) => _jsNum(si.supIls(sp)),
      supUsd: (sp) => _jsNum(su.supUsd(sp)),
      supScore: supScore,
      supTier: (score) => st.supTier(score),
      stageLabel: (c, stage) => sla.stageLabel(c, stage, tof.termOf) as String,
      evMeta: em.evMeta,
      hebrewRecurring: HEBREW_RECURRING,
      dayNames: DAY_NAMES,
    ),
  );
}
