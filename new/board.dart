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

class Board {
  final Map<String, dynamic> config;
  final String Function() _clock;
  final num rate;
  Board(this.config, this._clock, this.rate);

  // ── IO/זהות — מקור-אמת יחיד ──
  String today() => _clock();

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
}

Board makeBoard({Map<String, dynamic>? config, String Function()? clockIso, num rate = 3.7}) {
  final cfg = configBox.normalizeConfig(config ?? {}) ?? Map<String, dynamic>.from(configBox.DEFAULT_CONFIG);
  final clock = clockIso ?? () => dateUtil.isoToday();
  return Board(cfg, clock, rate);
}
