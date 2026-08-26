import '../dart-data-maor/finder-axes-terms.dart';
// 📦 קופסת-חיבורים · families (Dart) — מחווטת 22 אטומי-Dart. מקבילה ל-new/boxes/families.mjs.
// חוזה משותף: new/boxes/families.contract.md. מקור-האמת: maor/src/components/families/lib.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// שקעי-IO (מוזרקים): now — שעון-המכונה. isoToday/ageOf מקבלים now מוזרק; ברירת-מחדל DateTime.now().
// שכנים חוצי-מודול שהם אטומים (חוק-3): term-of (מילון-המונחים) · iso-local. מחווטים כאטומים.
// מתאמי-טיפוס (Dart קשיח-טיפוס) גשרים את פערי-החתימה מול חתכי-ה-dynamic של ה-JS.
import '../dart-maor/fmt-date.dart' as fd;
import '../dart-maor/iso-today.dart' as it;
import '../dart-maor/iso-local.dart' as il;
import '../dart-maor/age-of.dart' as ao;
import '../dart-maor/status-meta.dart' as sm;
import '../dart-maor/cred-red-threshold.dart' as crt;
import '../dart-maor/cred-help-text.dart' as cht;
import '../dart-maor/tier-of.dart' as tof;
import '../dart-maor/fam-enrollments.dart' as fe;
import '../dart-maor/fam-live-enrollments.dart' as fle;
import '../dart-maor/finder-axes.dart' as fax;
import '../dart-maor/finder-axis-value.dart' as fav;
import '../dart-maor/finder-matches.dart' as fmx;
import '../dart-maor/num-match.dart' as nm;
import '../dart-maor/fam-history-of.dart' as fho;
import '../dart-maor/marital-options.dart' as mop;
import '../dart-maor/language-options.dart' as lop;
import '../dart-maor/other.dart' as oth;
import '../dart-maor/other-label.dart' as otl;
import '../dart-maor/chip-style.dart' as cs;
import '../dart-maor/marital-chip-style.dart' as mcs;
import '../dart-maor/term-of.dart' as tm;

// ── הכרעות-הקופסה (סדר/ברירות-מחדל/מילון) ──
// הקונפיג-הריק כברירת-מחדל ל-famHistoryOf. במקור זה DEFAULT_CONFIG (config.ts) חסר-terms ⇒
// termOf תמיד נופל ל-fallback ⇒ {} ביט-זהה. הכרעה חיה כאן, לא באטום (חוק-6).
final Map<String, dynamic> _defaultConfig = <String, dynamic>{};

// ── מתאמי-טיפוס לשקעים (Dart קשיח-טיפוס) ─────────────────────────────────────
// termOf של האטום מחזיר dynamic (fallback או מחרוזת-גזומה) — תמיד String; מותאם לפי הצורך.
String _termOfStr(dynamic c, String k, String fb) => tm.termOf(c, k, fb) as String;
String _termOfHist(dynamic c, dynamic k, dynamic fb) => tm.termOf(c, k, fb) as String;
// tierOf של האטום מחזיר {'key':.., 'label':..} כ-Map<String,String>; ה-socket מצפה
// Map<String,dynamic> ⇒ Map.from מגשר את אי-שוויון-הגנריקה (invariant) בלי לגעת-בערך.
Map<String, dynamic> _tierOfMap(num score) =>
    Map<String, dynamic>.from(tof.tierOf(score, crt.CRED_RED_THRESHOLD) as Map);
// famEnrollments מחזיר List<Object?> (הפניות-רשומה); ה-socket של famLive מצפה
// List<Map<String,dynamic>> ⇒ יישור-טיפוס (אותן הפניות בדיוק, סדר-מקור נשמר).
List<Map<String, dynamic>> _famEnrollmentsForLive(dynamic db, dynamic fam) =>
    fe.famEnrollments(db as Map, fam as Map).map((e) => e as Map<String, dynamic>).toList();

// ── החיווט (חוק-1: שכן ⇒ שקע-מוזרק; אפס import פנימי בין-אטומי) ──
// tierOf במקור נקרא עם ארגומנט-יחיד ונשען על הקבוע-שכן CRED_RED_THRESHOLD.
// הקופסה מלחימה את הסף פנימה כך שהחשיפה תואמת-מקור: tierOf(score).
dynamic _wiredTierOf(dynamic score) => tof.tierOf(score, crt.CRED_RED_THRESHOLD);

List<Map<String, dynamic>> _wiredFamLive(dynamic db, dynamic fam) =>
    fle.famLiveEnrollments(db, fam, _famEnrollmentsForLive);

// famLiveEnrollments כשקע ל-finderAxisValue (החתימה שהאטום מכריז).
List<dynamic> _famLiveSocket(dynamic db, Map<String, dynamic> f) => _wiredFamLive(db, f);

// finderAxisValue: מלחים את חבילת-השקעים {termOf, tierOf, famLiveEnrollments, STATUS_META}.
// config אופציונלי — במקור finderMatches קורא finderAxisValue(db,f,k) בלי config (undefined≡null).
String _wiredFinderAxisValue(dynamic db, Map<String, dynamic> f, String axis, [dynamic config]) =>
    fav.finderAxisValue(
      db, f, axis, config,
      termOf: _termOfStr,
      tierOf: _tierOfMap,
      famLiveEnrollments: _famLiveSocket,
      STATUS_META: sm.statusMeta,
    );

// finderAxisValue כשקע ל-finderMatches (החתימה: dynamic Function(Map,dynamic,dynamic)).
dynamic _favForMatches(Map<dynamic, dynamic> db, dynamic f, dynamic axis) =>
    _wiredFinderAxisValue(db, f as Map<String, dynamic>, axis as String);

// ── החשיפה: אותו חתך-API של families/lib.ts, עכשיו כחיווט גלוי ──
String fmtDate(String? iso) => fd.fmtDate(iso);
String isoToday([DateTime? now]) => it.isoToday(il.isoLocal, now);
int? ageOf(String? birth, [DateTime? now]) => ao.ageOf(birth, now ?? DateTime.now());

dynamic tierOf(dynamic score) => _wiredTierOf(score);
List<Map<String, dynamic>> famLiveEnrollments(dynamic db, dynamic fam) => _wiredFamLive(db, fam);
String finderAxisValue(dynamic db, Map<String, dynamic> f, String axis, [dynamic config]) =>
    _wiredFinderAxisValue(db, f, axis, config);
List<dynamic> finderMatches(dynamic db, Map<dynamic, dynamic> locks) =>
    fmx.finderMatches(db as Map<dynamic, dynamic>, locks, _favForMatches);
List<List<String>> finderAxes(Map<String, dynamic> config) => fax.finderAxes(config, _termOfStr, term: (k)=>kTerms[k]!);
List<Map<String, dynamic>> famHistoryOf(Map<String, dynamic> db, Map<String, dynamic> fam,
        [Map<String, dynamic>? config]) =>
    fho.famHistoryOf(db, fam, config ?? _defaultConfig, _termOfHist);
Map<String, dynamic> maritalChipStyle(String status) => mcs.maritalChipStyle(status, cs.chipStyle);

// חוטים בלי-שקעים — נבחרים כמות-שהם (החיווט = בחירת-האטום בלבד):
List<Object?> famEnrollments(Map db, Map fam) => fe.famEnrollments(db, fam);
bool numMatch(dynamic q, num n) => nm.numMatch(q, n);
Map<String, dynamic> chipStyle(String bg, String c) => cs.chipStyle(bg, c);

// קבועים/בוררים — נחשפים בשמות-המקור (SCREAMING_CASE) כמו ה-JS.
Map<String, dynamic> get STATUS_META => sm.statusMeta; // ignore: non_constant_identifier_names
int get CRED_RED_THRESHOLD => crt.CRED_RED_THRESHOLD; // ignore: non_constant_identifier_names
String get CRED_HELP_TEXT => cht.credHelpText; // ignore: non_constant_identifier_names
List<String> get MARITAL_OPTIONS => mop.maritalOptions; // ignore: non_constant_identifier_names
List<String> get LANGUAGE_OPTIONS => lop.languageOptions; // ignore: non_constant_identifier_names
String get OTHER => oth.other; // ignore: non_constant_identifier_names
String get OTHER_LABEL => otl.otherLabel; // ignore: non_constant_identifier_names
