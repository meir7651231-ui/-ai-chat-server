import '../dart-data-maor/ayin-sheet-rows-terms.dart' as td_ayin_sheet_rows;
import '../dart-data-maor/ayin-daily-rows-terms.dart' as td_ayin_daily_rows;
import '../dart-data-maor/ayin-all-rows-terms.dart' as td_ayin_all_rows;
import '../dart-data-maor/ayin-advance-label-terms.dart';
import '../dart-data-maor/stage-label.dart';
import '../dart-data-maor/ayin-sheet-rows.dart';
// 📦 קופסת-חיבורים · ayin (Dart) — מחווטת 30 אטומי-Dart + 2 שכנים (termOf/normSearch).
// מקבילה ל-new/boxes/ayin.mjs. חוזה משותף: new/boxes/ayin.contract.md. מקור-האמת: maor/src/lib/ayin.ts.
// זו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט (ayin-proof.dart).
//
// שקעי-IO (החלטת-הקופסה): isoToday · emptyAyin · nextId · today · todayIso מוזרקים ע"י הקורא —
// לעולם לא ממומשים כאן (שעון/דאטה/מזהה אינם אטומים; טוהר-הקופסה ⇒ אפס-IO נסתר בגוף).
// פער-הטיפוס JS-דינמי↔Dart-קשיח מגושר במתאמי-טיפוס (חוק-הקופסה מיישרת) — האטומים נשארים נקיים.
import '../dart-maor/ayin-stages.dart' as ast;
import '../dart-maor/stage-label.dart' as sl;
import '../dart-maor/feat-label.dart' as fl;
import '../dart-maor/item-label.dart' as il;
import '../dart-maor/unit-label.dart' as ul;
import '../dart-maor/stage-index.dart' as si;
import '../dart-maor/next-stage.dart' as nsg;
import '../dart-maor/revert-patch.dart' as rp;
import '../dart-maor/norm-name.dart' as nn;
import '../dart-maor/ayin-active.dart' as aa;
import '../dart-maor/eyes-total.dart' as et;
import '../dart-maor/boq-line-amount.dart' as bla;
import '../dart-maor/boq-total.dart' as bt;
import '../dart-maor/time-hours-total.dart' as tht;
import '../dart-maor/time-cost-total.dart' as tct;
import '../dart-maor/mat-cost-total.dart' as mct;
import '../dart-maor/names-to-template-lines.dart' as ntl;
import '../dart-maor/template-lines-to-names.dart' as tltn;
import '../dart-maor/ayin-action-visible.dart' as av;
import '../dart-maor/ayin-advance-label.dart' as aal;
import '../dart-maor/plan-ayin-advance.dart' as pa;
import '../dart-maor/plan-add-name.dart' as pan;
import '../dart-maor/ayin-daily-rows.dart' as adr;
import '../dart-maor/ayin-all-rows.dart' as aar;
import '../dart-maor/ayin-board-items.dart' as abi;
import '../dart-maor/filter-ayin-board.dart' as fab;
import '../dart-maor/ayin-sheet-header.dart' as ash;
import '../dart-maor/ayin-sheet-rows.dart' as asr;
import '../dart-maor/parse-ayin-sheet.dart' as pas;
import '../dart-maor/apply-ayin-sheet.dart' as aps;

// ── אטומי-שכן טהורים (מודולים אחרים; אטומים-על-המדף ⇒ מיובאים ומחווטים) ──
import '../dart-maor/term-of.dart' as tof;
import '../dart-maor/norm-search.dart' as ns;

// ── מתאמי-טיפוס לשקע termOf (Dart קשיח-טיפוס; האטום מחזיר dynamic) ─────────────
String _termOfStr(Object? cfg, String key, String fb) => tof.termOf(cfg, key, fb) as String;
String _termOfMap(Map<String, dynamic> cfg, String key, String fb) => tof.termOf(cfg, key, fb) as String;
Map<String, dynamic> _cfgMap(dynamic cfg) => (cfg is Map) ? cfg.cast<String, dynamic>() : <String, dynamic>{};

// ── החיווט ──
// תוויות-העין: termOf האטום מחווט לכל אחת (הפער בין תצוגה למפתח-קבוע חי כאן).
String stageLabel(dynamic cfg, dynamic stage) => sl.stageLabel(cfg, stage, tof.termOf, stageFallback: kStageFallback) as String;
String featLabel(dynamic cfg) => fl.featLabel(cfg, _termOfStr);
String itemLabel(dynamic cfg) => il.itemLabel(_cfgMap(cfg), _termOfMap);
String unitLabel(dynamic cfg) => ul.unitLabel(cfg, tof.termOf) as String;

// סדר-השלבים: nextStage מחווט ל-stageIndex+ayinStages; revertPatch ל-stageIndex.
int stageIndex(dynamic stage) => si.stageIndex(stage);
String? nextStage(dynamic stage) => nsg.nextStage(stage as String, si.stageIndex, ast.ayinStages);
Map<String, dynamic> revertPatch(dynamic stage) => rp.revertPatch(stage, si.stageIndex);

// נרמול-שם: normSearch האטום שוקע לתוך normName; דרכו dedup+סינון-הלוח.
String normName(dynamic s) => nn.normName(s, ns.normSearch);

// אגרגטים טהורים (אפס שקעים, פרט ל-boqTotal↔boqLineAmount).
num eyesTotal(dynamic a) => et.eyesTotal(_cfgMap(a));
num boqLineAmount(dynamic n) => bla.boqLineAmount(_cfgMap(n));
num boqTotal(dynamic a) => bt.boqTotal(_cfgMap(a), bla.boqLineAmount);
num timeHoursTotal(dynamic a) => tht.timeHoursTotal(a as Map);
num timeCostTotal(dynamic a) => tct.timeCostTotal(a as Map);
num matCostTotal(dynamic a) => mct.matCostTotal(a as Map);
List<Map<String, dynamic>> namesToTemplateLines(dynamic names) =>
    ntl.namesToTemplateLines([for (final n in (names as List)) (n as Map).cast<String, dynamic>()]);
// nextId = שקע-מזהה מוזרק ע"י הקורא.
List<dynamic> templateLinesToNames(dynamic lines, dynamic nextId) => tltn.templateLinesToNames(lines, nextId);

// הכפתור-החכם: התווית ל-stageLabel; התכנון לחבילת-6-השכנים.
bool ayinActionVisible(dynamic a) => av.ayinActionVisible(_cfgMap(a));
String ayinAdvanceLabel(dynamic cfg, dynamic a) =>
    aal.ayinAdvanceLabel(cfg, _cfgMap(a), (c, st) => stageLabel(c, st), term: (k)=>kTerms[k]!);
dynamic planAyinAdvance(dynamic cfg, dynamic name, dynamic a) => pa.planAyinAdvance(
      cfg as Map,
      name as String,
      a as Map,
      (m) => ayinActionVisible(m),
      (m) => featLabel(m),
      (m) => itemLabel(m),
      (m) => unitLabel(m),
      (m, st) => stageLabel(m, st),
      (m) => eyesTotal(m),
    );

// הוספת-פריט: normName המחווט + isoToday מוזרק (שעון = שקע-IO).
Map<String, dynamic> planAddName(dynamic a, dynamic rawName, dynamic eyes, dynamic id, String Function() isoToday) =>
    pan.planAddName(_cfgMap(a), rawName as String, eyes, id as String, normName, isoToday);

// דוחות-העין: emptyAyin מוזרק (מפעל-domain = שקע-דאטה); תוויות ואגרגטים מחווטים.
bool ayinActive(dynamic a) => aa.ayinActive(a);
List<List<Object?>> ayinDailyRows(dynamic cfg, dynamic supporters, dynamic todayIso, Map Function() emptyAyin) =>
    adr.ayinDailyRows(
      cfg,
      supporters as List,
      todayIso as String,
      (c) => unitLabel(c),
      (c) => itemLabel(c),
      emptyAyin,
      (m) => eyesTotal(m),
      (c, st) => stageLabel(c, st),
     term: (k)=>td_ayin_daily_rows.kTerms[k]!);
List<List<Object?>> ayinAllRows(dynamic cfg, dynamic supporters, Map Function() emptyAyin) => aar.ayinAllRows(
      cfg,
      supporters as List,
      (c) => unitLabel(c),
      emptyAyin,
      (c, st) => stageLabel(c, st),
     term: (k)=>td_ayin_all_rows.kTerms[k]!);
List<Map<String, Object?>> ayinBoardItems(dynamic supporters, Map Function() emptyAyin) => abi.ayinBoardItems(
      List<Object?>.from(supporters as List),
      () => emptyAyin().cast<String, Object?>(),
    );
List<Map<String, dynamic>> filterAyinBoard(dynamic items, dynamic q, dynamic status, dynamic stage) =>
    fab.filterAyinBoard(
      [for (final e in (items as List)) (e as Map).cast<String, dynamic>()],
      q,
      status,
      stage,
      ns.normSearch,
    );

// גיליון-העיניים (round-trip): normName המחווט לפענוח; ייצוא/החלה טהורים.
List<List<String>> ayinSheetRows(dynamic supporters) => asr.ayinSheetRows(supporters as List, ayinSheetHeader: kAyinSheetHeader, term: (k)=>td_ayin_sheet_rows.kTerms[k]!);
Map<String, dynamic> parseAyinSheet(dynamic rows, dynamic supporters) =>
    pas.parseAyinSheet(rows as List, supporters as List, normName);
Map<String, dynamic> applyAyinSheet(dynamic supporters, dynamic upds, dynamic today) =>
    aps.applyAyinSheet(supporters as List, upds as List, today as String);

// ── החשיפה (ביט-זהה לחתימות ayin.mjs; קבועים כ-re-export) ──────────────────────
final List<String> AYIN_STAGES = ast.ayinStages; // ignore: non_constant_identifier_names
final List<String> AYIN_SHEET_HEADER = ash.ayinSheetHeader; // ignore: non_constant_identifier_names
