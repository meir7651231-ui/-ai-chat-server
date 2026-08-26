// ⚡ לוח-האם (Dart) — הקובץ היחיד שמחבר קופסאות (LAW חוק-3). מקביל ל-new/board.mjs.
// מייבא אך-ורק מ-dart-boxes/. כאן, ורק כאן, מוזרקים ה-IO והזהות (חוק-6): שעון,
// קונפיג-ארגון, שער-דולר. פרוסת-התורמים: config·date-util·supporters·empowerment·dedup·search.
// זהו ההוכחה שהאינטגרציה חוצת-הקופסות זהה-ביט בין מאור(JS) לבנייה-חכמה(Dart).
import 'dart-boxes/config.dart' as configBox;
import 'dart-boxes/date-util.dart' as dateUtil;
import 'dart-boxes/supporters.dart' as supportersBox;
import 'dart-boxes/empowerment.dart' as empowerment;
import 'dart-boxes/dedup.dart' as dedupBox;
import 'dart-boxes/search.dart' as searchBox;
import 'dart-boxes/families.dart' as familiesBox;
import 'dart-boxes/diary.dart' as diaryBox;
import 'dart-boxes/reports.dart' as reportsBox;
import 'dart-boxes/hebrew.dart' as hebrewBox;
import 'dart-boxes/wa.dart' as waBox;
import 'dart-boxes/audit.dart' as auditBox;
import 'dart-boxes/date-util.dart' as dateUtilBox;

class Board {
  final Map<String, dynamic> config;
  final String Function() _clock;
  final num rate;
  Board(this.config, this._clock, this.rate);

  // ── IO/זהות — מקור-אמת יחיד ──
  String today() => _clock();
  DateTime todayDate() => DateTime.parse('${today()}T12:00:00');

  // ── config-box → צרכני-מונחים ──
  dynamic term(String key, dynamic fb) => configBox.termOf(config, key, fb);
  bool feature(String key) => configBox.featureOn(config, key);

  // ── supporters-box (אגרגטים + config/שעון מוזרקים) ──
  dynamic supIls(dynamic sp) => supportersBox.supIls(sp);
  dynamic supCount(dynamic sp) => supportersBox.supCount(sp);
  dynamic supLast(Map sp) => supportersBox.supLast(sp);
  List<Map<String, dynamic>> supDonEvents(dynamic sp) => supportersBox.supDonEvents(sp, config);
  List hokDue(List sups) => supportersBox.hokDue(sups, today());
  int hokMonthlyTotal(List sups) => supportersBox.hokMonthlyTotal(sups, rate, today());

  // ── empowerment-box (הקוקפיט, על שעון-הלוח) ──
  List cockpitAtRisk(List sups) => empowerment.cockpitAtRisk(sups, today());
  Map<String, dynamic> cockpitQueue(List sups) => empowerment.cockpitQueue(sups, today(), rate);
  Map<String, dynamic> cockpitKpis(List sups) => empowerment.cockpitKpis(sups, today(), rate);
  List<Map<String, dynamic>> segmentCounts(List sups) => empowerment.segmentCounts(sups, today(), rate);
  List<List> cockpitCsvRows(Map queue) => empowerment.cockpitCsvRows(queue);

  // ── dedup/search (כלים חוצי-מודול) ──
  List<List<dynamic>> dedupSupporterGroups(List<Map<String, dynamic>> sups) =>
      dedupBox.findSupporterDupGroups(sups);
  dynamic search(dynamic q, dynamic items, dynamic getTerms, [dynamic limit]) =>
      searchBox.search(q, items, getTerms, limit);

  // ── פרוסת-משפחות (config→מונחים · שעון→גיל) ──
  dynamic familiesTier(dynamic score) => familiesBox.tierOf(score);
  int? familiesAge(String? birth) => familiesBox.ageOf(birth, todayDate());
  List<List<String>> familiesFinderAxes() => familiesBox.finderAxes(config);
  List<dynamic> familiesFinderMatches(dynamic db, Map<dynamic, dynamic> locks) =>
      familiesBox.finderMatches(db, locks);

  // ── פרוסת-יומן-חדרים (config→חדר-inline · שעון→תאריך) ──
  String? diaryBlockReason(DateTime d) => diaryBox.blockReason(d);
  num diaryWeeklySessions(Map<String, dynamic> db, dynamic roomId, String iso) =>
      diaryBox.weeklyRoomSessions(db, roomId, iso);
  List<Map<String, dynamic>> diarySlots(Map<String, dynamic> db, Map<String, dynamic> room, String iso, dynamic blocked,
          [bool cleaningOn = true]) =>
      diaryBox.buildSlots(db, room, iso, blocked, config, cleaningOn);

  // ── פרוסת-דוחות (טהור) ──
  bool reportsInRange(String? iso, Map range) => reportsBox.inRange(iso, range);
  num reportsBalanceOf(Map<String, Object?> e) => reportsBox.balanceOf(e);
  String reportsMonthKey(String iso) => reportsBox.monthKey(iso);

  // ── פרוסת-לוח-עברי ──
  String hebrewDateFull(String? iso) => hebrewBox.hebDateFull(iso);
  String? hebrewHoliday(DateTime d) => hebrewBox.holidayOf(d);
  String hebrewToday() => hebrewBox.hebDateFull(today());

  // ── פרוסת-וואטסאפ (config→שם-ארגון) ──
  dynamic waLink(dynamic phone, [dynamic text = '']) => waBox.waLink(phone, text);
  dynamic waDelivery(dynamic famName) => waBox.waDeliveryText(config['orgName'], famName, config);

  // ── פרוסת-ביקורת (config+שעון מוזרקים) ──
  List auditRun(dynamic db, [dynamic extra = true]) => auditBox.runAudit(db, today(), extra, config, todayDate());
  List<String> auditReport(Iterable<Map<String, String>> issues) =>
      auditBox.auditReportLines(config['orgName'] as String?, issues, dateUtilBox.isoLocal(todayDate()));
}

Board makeBoard({Map<String, dynamic>? config, String Function()? clockIso, num rate = 3.7}) {
  final cfg = configBox.normalizeConfig(config ?? {}) ?? Map<String, dynamic>.from(configBox.DEFAULT_CONFIG);
  final clock = clockIso ?? () => dateUtil.isoToday();
  return Board(cfg, clock, rate);
}
