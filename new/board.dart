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
// ── דומיין-בנייה-חכמה (buildsmart) — נכנס לאותו לוח-אם מאוחד ──
import 'dart-boxes/bs-matching.dart' as bsMatching;
import 'dart-boxes/bs-workflow.dart' as bsWorkflow;
import 'dart-boxes/bs-actions.dart' as bsActions;
import 'dart-boxes/bs-assistant.dart' as bsAssistant;
import 'dart-boxes/bs-projects.dart' as bsProjects;
import 'dart-boxes/bs-studio.dart' as bsStudio;
import 'dart-boxes/bs-security.dart' as bsSecurity;
import 'dart-boxes/bs-config.dart' as bsConfig;
import 'dart-boxes/bs-pipe.dart' as bsPipe;
// צורות-הנתונים של מנוע-הצנרת נחשפות דרך הלוח (המסך בונה PipeProduct ומזין).
export 'dart-boxes/bs-pipe.dart' show PipeProduct, PipeBox, FlowRole, KitItem;

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

  // ── 🔦 קטלוג-היכולות המאוחד — מאור + בנייה-חכמה = מערכת אחת. מדליקים דרך config.
  //   מערכת אחת שמדליקים בה מה שרוצים: כל הצבה בוחרת אילו יכולות דולקות.
  static const List<String> capabilityCatalog = [
    // מאור (ליבה — חסר-דגל = דלוק, רק false מכבה):
    'supporters.cockpit', 'families', 'diary', 'reports', 'audit', 'wa', 'hebrew',
    // בנייה-חכמה (opt-in — חסר-דגל = כבוי, רק true מדליק; כמו הרחבות-מאור):
    'bs.fuzzy', 'bs.workflow', 'bs.actions', 'bs.assistant',
    'bs.projects', 'bs.studio', 'bs.security', 'bs.config', 'bs.pipe',
  ];
  // יכולת דולקת? מאור-ליבה דרך featureOn (חסר=דלוק); בנייה-חכמה = opt-in מפורש (רק true).
  bool lit(String cap) => cap.startsWith('bs.')
      ? ((config['features'] as Map?)?[cap] == true)
      : configBox.featureOn(config, cap);
  // כל היכולות הדולקות בהצבה הזו — התצורה של "המערכת האחת".
  List<String> capabilities() => capabilityCatalog.where(lit).toList();

  // 🎛️ בונה-תצורה: מדליק **בדיוק** את היכולות הנבחרות (כיבוי-מפורש לכל היתר).
  //   מאפשר להדליק הכל / חצי / רבע / כל כמות — חוגה גרנולרית אחת. הדולקות עובדות יחד.
  static Map<String, dynamic> configFor(Iterable<String> lit, {String slug = 'custom', Map<String, dynamic>? extra}) {
    final want = lit.toSet();
    final features = <String, dynamic>{for (final cap in capabilityCatalog) cap: want.contains(cap)};
    return {'slug': slug, 'features': features, ...?extra};
  }

  // 🧙 האשף · חבילות-ורטיקל — תחום ⇒ חבילת-יכולות מוכנה (מדליקה אוטומטית).
  //   מערכת אחת: בוחר תחום, מקבל חבילה; ואז מדייק בחוגה (add/remove) כמה שרוצה.
  static final Map<String, List<String>> verticalPacks = {
    'amuta': ['supporters.cockpit', 'families', 'diary', 'reports', 'audit', 'wa', 'hebrew'],
    'binyan': ['bs.projects', 'bs.studio', 'bs.workflow', 'bs.actions', 'bs.security', 'bs.config', 'bs.pipe'],
    'digital': ['bs.studio', 'bs.workflow', 'bs.actions', 'bs.assistant', 'bs.fuzzy'],
    'chesed-plus': ['supporters.cockpit', 'families', 'audit', 'wa', 'hebrew', 'bs.fuzzy', 'bs.assistant'],
    'full': [...capabilityCatalog],
  };

  // האשף: בחר תחום ⇒ תצורה. add/remove = החוגה הגרנולרית מעל החבילה.
  static Map<String, dynamic> assemble(String pack, {Iterable<String> add = const [], Iterable<String> remove = const []}) {
    final caps = {...?verticalPacks[pack]}..addAll(add)..removeAll(remove);
    return configFor(caps, slug: pack);
  }

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

  // ── 🏗️ פרוסת-בנייה-חכמה: התאמה-מטושטשת (bs-matching) — דומיין-בנייה על אותו לוח ──
  bool bsFuzzyMatch(String query, String candidate) => bsMatching.fuzzyMatch(query, candidate);
  bool bsFuzzyNameMatch(String query, String candidate) => bsMatching.fuzzyNameMatch(query, candidate);
  int bsFuzzyScore(String query, String candidate) => bsMatching.fuzzyScore(query, candidate);

  // ── 🔗 גשר-האיחוד: dedup-מאור (נתוני-התומכים) פוגש fuzzy-בנייה-חכמה (מנוע-ההתאמה).
  //     מוצא זוגות-תומכים שֶׁשמותיהם מטושטשים-תואמים — כפילות שהתאמה-מדויקת מפספסת.
  //     זו הפגישה האמיתית: יכולת-בנייה-חכמה משדרגת קופסת-מאור, על אותו לוח.
  List<List<String>> fuzzyDupPairs(List<Map<String, dynamic>> sups) {
    final out = <List<String>>[];
    for (var i = 0; i < sups.length; i++) {
      for (var j = i + 1; j < sups.length; j++) {
        final a = (sups[i]['name'] ?? '').toString();
        final b = (sups[j]['name'] ?? '').toString();
        if (a.isNotEmpty && b.isNotEmpty && bsMatching.fuzzyNameMatch(a, b)) {
          out.add([sups[i]['id'].toString(), sups[j]['id'].toString()]);
        }
      }
    }
    return out;
  }

  // ── ⚙️ בנייה-חכמה: מנוע-workflow — קידום-שלב לפי מפתח (intake→prep→…→done) ──
  String? bsWorkflowNextStage(String key) {
    final stage = bsWorkflow.wfStageFromKey(key);
    if (stage == null) return null;
    final next = bsWorkflow.wfNextStage(stage);
    return next == null ? null : bsWorkflow.wfStageKey(next);
  }

  // ── 🎯 בנייה-חכמה: טווח-יעד לפעולה (all/screen/single/every/actionable) ──
  String bsScopeHe(String token) => bsActions.scopeHe(token);
  String bsScopeLabel(String scope) => bsActions.scopeLabel(scope);

  // ── 🤖 בנייה-חכמה: ניתוב-כוונה — תשובת-משתמש → קטגוריה (קופיילוט-עברית) ──
  String? bsAssistantCategory(String reply, List<String> categories) =>
      bsAssistant.matchAssistantCategory(reply, categories);

  // ── 🏗️💰 בנייה-חכמה: תמחיר-פרויקט (חשבונית/מע"מ, אשראי-קבלן) ──
  int bsInvoiceVat(int gross) => bsProjects.invoiceVatOf(gross);
  int bsContractorCredit(String name) => bsProjects.contractorCredit(name);

  // ── 🏢 בנייה-חכמה: קופיילוט-סטודיו (תדריך-בוקר למנהל) ──
  String bsManagerBrief(String context) => bsStudio.managerMorningBriefPrompt(context);

  // ── 🔐 בנייה-חכמה: ולידציה (אימייל/נייד ישראלי) ──
  bool bsValidEmail(String input) => bsSecurity.validEmail(input);
  bool bsValidMobile(String input) => bsSecurity.validIsraeliMobile(input);

  // ── 🎛️ בנייה-חכמה: תווית-שדה-כלל בעברית ──
  String bsFieldLabel(String id) => bsConfig.fieldLabelHe(id);

  // ── 🔧 בנייה-חכמה: מנוע-הצנרת (מסלול·לחץ·ערכה·תמחיר·צ׳קליסט) ──
  //     PipeBox נבנה-מנתונים (specs+catalog מוזרקים ע"י המסך פעם-אחת); הלוח מספק
  //     את המפעל המוכן. 38 אטומי-מנוע מחווטים בקופסה — הלוח רק חושף אותה.
  bsPipe.PipeBox bsPipeBox({
    required Map<String, dynamic> specs,
    List<dynamic> catalog = const [],
    bool companyCatalogActive = false,
  }) =>
      bsPipe.PipeBox(specs: specs, catalog: catalog, companyCatalogActive: companyCatalogActive);

  // ── 🔗↔ גשר-הדדי: מאור עוזר לבנייה-חכמה — חשבונית-בנייה-חכמה בתאריך-עברי-מאור.
  //     המקבילה ל-fuzzyDupPairs (בנייה-חכמה→מאור): כאן מאור→בנייה-חכמה. עזרה הדדית.
  String bsInvoiceHebrewLine(int gross, String iso) {
    final vat = bsProjects.invoiceVatOf(gross); // בנייה-חכמה: מע"מ
    final heb = hebrewBox.hebDateFull(iso); // מאור: תאריך-עברי
    return 'חשבונית · מע"מ ₪$vat · $heb';
  }
}

Board makeBoard({Map<String, dynamic>? config, String Function()? clockIso, num rate = 3.7}) {
  final cfg = configBox.normalizeConfig(config ?? {}) ?? Map<String, dynamic>.from(configBox.DEFAULT_CONFIG);
  final clock = clockIso ?? () => dateUtil.isoToday();
  return Board(cfg, clock, rate);
}
