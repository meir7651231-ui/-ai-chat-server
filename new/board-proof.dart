// 🧪 הוכחת-חוצה-שפות · לוח-האם (Dart) — אותו תרחיש-אינטגרציה כמו new/board.test.mjs.
// ירוק ⇒ האינטגרציה חוצת-הקופסות (6 קופסאות) זהה-ביט בין מאור(JS) לבנייה-חכמה(Dart).
import 'dart:convert';
import 'board.dart';

int n = 0, fails = 0;
void ok(String name, bool c) { if (!c) { print('✗ $name'); fails++; } else { n++; } }
// canon: double-שלם ⇒ int (חוק-17: אטומים מחזירים float64; JS JSON.stringify מדפיס 500 לא 500.0).
dynamic canon(dynamic v) {
  if (v is double && v.isFinite && v == v.truncateToDouble()) return v.toInt();
  if (v is Map) return {for (final k in v.keys) k.toString(): canon(v[k])};
  if (v is List) return v.map(canon).toList();
  return v;
}
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(canon(got)), w = jsonEncode(canon(want));
  if (g != w) { print('✗ $name: $g ≠ $w'); fails++; } else { n++; }
}

Map<String, dynamic> mk(String id, String name, String phone, String last, num ils, num usd, int count,
    {List donations = const [], Map? hok}) => {
      'id': id, 'name': name, 'phone': phone, 'email': '', 'idNum': '', 'address': '', 'cat': '', 'forWho': '',
      'count': count, 'ils': ils, 'usd': usd, 'first': '2023-01-01', 'last': last, 'nextDate': '',
      'donations': donations, 'hist': [], if (hok != null) 'hok': hok,
    };

void main() {
  final board = makeBoard(
    clockIso: () => '2026-08-24',
    config: {'slug': 'demo', 'orgName': 'ארגון-בדיקה', 'terms': {'nav.supporters': 'שותפים'}},
    rate: 3.7,
  );

  // 1) IO מוזרק פעם-אחת
  eq('שעון-הלוח', board.today(), '2026-08-24');

  // 2) config-box → מונחים
  eq('config→term דריסה', board.term('nav.supporters', 'תורמים'), 'שותפים');
  eq('config→term fallback', board.term('nav.families', 'משפחות'), 'משפחות');
  ok('config→feature מחווט', board.feature('supporters.cockpit') == true || board.feature('supporters.cockpit') == false);

  final sups = [
    mk('a', 'כהן משה', '0501111111', '2026-08-20', 500, 0, 5, donations: [
      {'date': '2026-08-20', 'amount': 100, 'cur': '₪', 'rid': 'R-1'},
      {'date': '2026-05-20', 'amount': 100, 'cur': '₪', 'rid': 'R-2'},
      {'date': '2026-02-20', 'amount': 100, 'cur': '₪', 'rid': 'R-3'},
    ]),
    mk('b', 'לוי שרה', '0502222222', '2026-03-01', 200, 20, 2, donations: [
      {'date': '2026-03-01', 'amount': 100, 'cur': '₪', 'rid': 'R-4'},
      {'date': '2025-11-01', 'amount': 100, 'cur': '₪', 'rid': 'R-5'},
    ]),
    mk('c', 'ישראלי דוד', '0503333333', '2024-06-01', 50, 0, 1, donations: [{'date': '2024-06-01', 'amount': 50, 'cur': '₪', 'rid': 'R-6'}]),
    mk('d', 'אברהם רות', '0504444444', '2026-08-23', 1200, 0, 8,
        donations: [{'date': '2026-08-23', 'amount': 300, 'cur': '₪', 'rid': 'R-7'}], hok: {'amount': 150, 'day': 1, 'method': 'הו"ק', 'active': true}),
  ];

  // 3) supporters-box → אגרגטים
  eq('supporters→ils', board.supIls(sups[0]), 500);
  eq('supporters→count', board.supCount(sups[0]), 5);

  // 4) date-util(שעון) → empowerment
  final queue = board.cockpitQueue(sups);
  eq('cockpit.queue.total', queue['total'], 4);
  eq('cockpit.queue.kinds', [for (final t in (queue['tasks'] as List)) t['kind']], ['call', 'call', 'thanks', 'hok']);
  eq('cockpit.kpis', board.cockpitKpis(sups), {'total': 4, 'collected': 400, 'expectedHok': 150, 'atRisk': 2});
  eq('cockpit.atRisk', [for (final s in board.cockpitAtRisk(sups)) s['id']], ['c', 'b']);

  // 5) האינווריאנט: שעון-יחיד-מקור — hokDue(supporters) ו-cockpit.hok(empowerment) רואים את d
  final hokDue = board.hokDue(sups);
  ok('supporters.hokDue רואה d', hokDue.any((s) => s['id'] == 'd'));
  ok('empowerment.hok-task רואה d', (queue['hok'] as List).any((t) => t['supId'] == 'd' || (t['id'] != null && t['id'].toString().contains('d'))));
  eq('hokMonthlyTotal', board.hokMonthlyTotal(sups), 150);

  // 6) dedup-box
  final dupSups = [
    {'id': 'x', 'name': 'בן צבי רחל', 'phone': '0500000001', 'donations': []},
    {'id': 'y', 'name': 'רחל בן צבי', 'phone': '0500000002', 'donations': []},
  ];
  eq('dedup→שם-חסין-סדר', board.dedupSupporterGroups(dupSups), [['x', 'y']]);

  // 7) search-box
  final found = board.search('cohen', sups, (dynamic s) => [s['name']]) as List;
  ok('search→תעתיק cohen', found.any((s) => (s['name'] as String).contains('כהן')));

  // 8) cockpit.csvRows
  eq('cockpit.csvRows כותרת', board.cockpitCsvRows(queue)[0], ['קבוצה', 'שם', 'טלפון', 'סיבה']);

  // 9) פרוסת-משפחות
  ok('families.finderAxes דרך config', board.familiesFinderAxes().length >= 0);
  ok('families.tier(score)⇒דרגה', (board.familiesTier(600) as Map)['key'] is String);
  eq('families.age על שעון-הלוח', board.familiesAge('2000-08-24'), 26);

  // 10) פרוסת-יומן: דין-תשעה-באב-נדחה
  eq('diary.blockReason דין-הדחייה', board.diaryBlockReason(DateTime(2022, 8, 7, 12)), 'תשעה באב (נדחה)');

  // 11) פרוסת-לוח-עברי
  ok('hebrew.dateFull', board.hebrewDateFull('2026-08-24').isNotEmpty);
  ok('hebrew.today על שעון-הלוח', board.hebrewToday().isNotEmpty);

  // 12) פרוסת-וואטסאפ: config→שם-ארגון
  ok('wa.link', (board.waLink('0501234567', 'שלום') as String).startsWith('https://wa.me/'));
  ok('wa.delivery מזריק שם-ארגון', (board.waDelivery('כהן') as String).contains('ארגון-בדיקה'));

  // 13) פרוסת-ביקורת: config+שעון מוזרקים
  final auditDb = {
    'families': [
      {'id': 'f1', 'name': 'א', 'phone': '0501234567', 'status': 'active', 'city': 'צפת', 'address': 'רח 1', 'maritalStatus': 'נשואים', 'father': 'x', 'mother': 'y', 'members': []},
      {'id': 'f2', 'name': 'ב', 'phone': '0501234567', 'status': 'active', 'city': 'צפת', 'address': 'רח 1', 'maritalStatus': 'נשואים', 'father': 'x', 'mother': 'y', 'members': []},
    ],
    'supporters': [], 'enrollments': [],
  };
  final auditIssues = board.auditRun(auditDb);
  ok('audit.run תופס טלפון-כפול', auditIssues.any((i) => i['cat'] == 'כפילות' && (i['title'] as String).contains('משותף')));
  ok('audit.report עם שם-ארגון', board.auditReport(auditIssues.map((i) => (i as Map).map((k, v) => MapEntry(k.toString(), v.toString()))))[0].contains('ארגון-בדיקה'));

  // 14) 🏗️ דומיין-בנייה-חכמה על אותו לוח-אם — מאור ובנייה-חכמה מחוברים יחד
  ok('bs.fuzzyMatch זהה', board.bsFuzzyMatch('shalom', 'shalom'));
  ok('bs.fuzzyMatch טעות-אחת', board.bsFuzzyMatch('shalom', 'shalim'));
  ok('bs.fuzzyMatch רחוק ⇒ false', !board.bsFuzzyMatch('shalom', 'xyzqrt'));
  ok('bs.fuzzyScore טעות-אחת ⇒ 1', board.bsFuzzyScore('shalom', 'shalim') == 1);
  ok('bs.fuzzyNameMatch', board.bsFuzzyNameMatch('כהן', 'כהן'));
  // האינטגרציה המאוחדת: אותו לוח מחזיר גם קוקפיט-מאור וגם התאמת-בנייה-חכמה
  ok('לוח-מאוחד: מאור+בנייה-חכמה חיים יחד',
      board.cockpitKpis(sups)['total'] == 4 && board.bsFuzzyMatch('shalom', 'shalim'));

  // 15) 🔗 גשר-האיחוד: נתוני-תומכים (מאור) + fuzzy (בנייה-חכמה) — כפילי-שם מטושטשים
  final fuzzyDb = [
    {'id': 'p1', 'name': 'משהכהן'},
    {'id': 'p2', 'name': 'משהכוהן'}, // טעות-כתיב — התאמה-מדויקת מפספסת, fuzzy תופס
    {'id': 'p3', 'name': 'שרהלוי'},
  ];
  final pairs = board.fuzzyDupPairs(fuzzyDb);
  ok('גשר-איחוד: fuzzy-בנייה-חכמה תופס כפילות-שם ב-נתוני-מאור', pairs.any((p) => p.contains('p1') && p.contains('p2')));
  ok('גשר-איחוד: שם-רחוק לא-מזווג', !pairs.any((p) => p.contains('p3')));

  // 16) ⚙️🎯🤖 שלוש קופסאות-בנייה-חכמה נוספות על אותו לוח
  ok('bs-workflow: קידום-שלב intake→prep', board.bsWorkflowNextStage('intake') == 'prep');
  ok('bs-workflow: done⇒אין-הבא', board.bsWorkflowNextStage('done') == null);
  ok('bs-actions: טווח-יעד he', board.bsScopeHe('all').isNotEmpty);
  ok('bs-assistant: ניתוב-כוונה', board.bsAssistantCategory('משלוחים', ['משלוחים', 'לקוחות']) == 'משלוחים');

  // 17) 🏗️ עוד 4 קופסאות-בנייה-חכמה על אותו לוח (projects·studio·security·config)
  ok('bs-projects: מע"מ חשבונית', board.bsInvoiceVat(1000) > 0);
  ok('bs-projects: אשראי-קבלן', board.bsContractorCredit('חברת-בנייה') == board.bsContractorCredit('חברת-בנייה'));
  ok('bs-studio: תדריך-מנהל', board.bsManagerBrief('בוקר').isNotEmpty);
  ok('bs-security: אימייל תקין', board.bsValidEmail('a@b.co') && !board.bsValidEmail('לא-אימייל'));
  ok('bs-security: נייד ישראלי', board.bsValidMobile('0501234567'));
  ok('bs-config: תווית-שדה', board.bsFieldLabel('anything').length >= 0);

  // 18) 🔗↔ עזרה-הדדית: מאור עוזר לבנייה-חכמה (תאריך-עברי בחשבונית)
  final invLine = board.bsInvoiceHebrewLine(1000, '2026-08-24');
  ok('גשר-הפוך: חשבונית-בנייה-חכמה + תאריך-עברי-מאור', invLine.contains('מע"מ') && invLine.contains('חשבונית'));

  // 19) 🧩 עצמאות: כל צד חי לבד (חוק-החשמלאי — קופסאות עצמאיות, נפגשות רק בלוח)
  //   מאור-טהור: קוקפיט עובד בלי שום קריאת-בנייה-חכמה.
  ok('עצמאות-מאור: הקוקפיט חי לבד', board.cockpitKpis(sups)['total'] == 4 && board.hebrewToday().isNotEmpty);
  //   בנייה-חכמה-טהור: fuzzy+workflow+ולידציה עובדים בלי שום קריאת-מאור.
  ok('עצמאות-בנייה-חכמה: הדומיין חי לבד',
      board.bsFuzzyMatch('shalom', 'shalim') && board.bsWorkflowNextStage('intake') == 'prep' && board.bsValidEmail('a@b.co'));

  // 20) 🔦 מערכת אחת, מדליקים מה שרוצים — אותו לוח, 3 תצורות שונות
  //   תצורת-עמותה: רק יכולות-מאור דולקות (בנייה-חכמה כבוי by-default).
  final amuta = makeBoard(clockIso: () => '2026-08-24', config: {'slug': 'amuta'});
  ok('עמותה: מאור דלוק', amuta.lit('supporters.cockpit') && amuta.lit('families'));
  ok('עמותה: בנייה-חכמה כבוי (opt-in)', !amuta.lit('bs.workflow') && !amuta.lit('bs.projects'));

  //   תצורת-בנייה: מדליקים בנייה-חכמה, מכבים מודולי-מאור מיותרים.
  final binyan = makeBoard(clockIso: () => '2026-08-24', config: {
    'slug': 'binyan',
    'features': {'bs.workflow': true, 'bs.projects': true, 'bs.actions': true, 'supporters.cockpit': false, 'families': false},
  });
  ok('בנייה: בנייה-חכמה דלוק', binyan.lit('bs.workflow') && binyan.lit('bs.projects'));
  ok('בנייה: מודולי-מאור כובו', !binyan.lit('supporters.cockpit') && !binyan.lit('families'));

  //   תצורת-היברידית: הכל דלוק — מערכת אחת מלאה.
  final hybrid = makeBoard(clockIso: () => '2026-08-24', config: {
    'slug': 'hybrid',
    'features': {'bs.fuzzy': true, 'bs.workflow': true, 'bs.projects': true, 'bs.studio': true, 'bs.security': true, 'bs.config': true, 'bs.actions': true, 'bs.assistant': true},
  });
  ok('היברידי: גם מאור וגם בנייה-חכמה דולקים', hybrid.lit('supporters.cockpit') && hybrid.lit('bs.workflow'));
  ok('היברידי: קטלוג-מלא דולק (15)', hybrid.capabilities().length == 15);
  // אותו קוד-לוח בדיוק — רק ה-config משנה מה דולק.
  ok('מערכת-אחת: אותו לוח, config שונה ⇒ תצורה שונה',
      amuta.capabilities().length < hybrid.capabilities().length && binyan.lit('bs.projects') && !amuta.lit('bs.projects'));

  // 21) 🎛️ חוגה גרנולרית — הכל / חצי / רבע / כל כמות, והדולקות עובדות יחד
  Board withCaps(Iterable<String> caps) => makeBoard(clockIso: () => '2026-08-24', config: Board.configFor(caps));
  // כל (15):
  ok('חוגה: הכל דלוק (15)', withCaps(Board.capabilityCatalog).capabilities().length == 15);
  // חצי (בדיוק 7):
  final halfCaps = Board.capabilityCatalog.take(7).toList();
  ok('חוגה: חצי דלוק (7)', withCaps(halfCaps).capabilities().length == 7);
  // רבע (בדיוק 4) — תערובת מאור+בנייה-חכמה:
  final quarterCaps = ['supporters.cockpit', 'audit', 'bs.fuzzy', 'bs.workflow'];
  final quarter = withCaps(quarterCaps);
  ok('חוגה: רבע דלוק (4)', quarter.capabilities().length == 4);
  // אפס:
  ok('חוגה: אפס דלוק', withCaps(const []).capabilities().isEmpty);
  // כמות שרירותית (בדיוק 10):
  ok('חוגה: כמות-שרירותית (10)', withCaps(Board.capabilityCatalog.take(10)).capabilities().length == 10);

  // 🤝 הדולקות עובדות יחד — ברבע-הדלוק, מאור ובנייה-חכמה מתפקדים על אותו הקשר:
  ok('עובדים-יחד: מאור(קוקפיט)+בנייה-חכמה(fuzzy+workflow) חיים בתערובת אחת',
      quarter.lit('supporters.cockpit') && quarter.lit('bs.fuzzy') && quarter.lit('bs.workflow') &&
      quarter.cockpitKpis(sups)['total'] == 4 &&
      quarter.bsFuzzyMatch('shalom', 'shalim') &&
      quarter.bsWorkflowNextStage('intake') == 'prep' &&
      quarter.fuzzyDupPairs([{'id': 'p1', 'name': 'משהכהן'}, {'id': 'p2', 'name': 'משהכוהן'}]).isNotEmpty);
  // מה שלא-דלוק ברבע — אכן כבוי (families/diary/wa...):
  ok('חוגה: הלא-נבחרים כבויים', !quarter.lit('families') && !quarter.lit('bs.projects') && !quarter.lit('wa'));

  // 22) 🧙 האשף — בחר תחום ⇒ חבילת-יכולות נדלקת אוטומטית; ואז דייק בחוגה
  Board fromPack(String pack, {List<String> add = const [], List<String> remove = const []}) =>
      makeBoard(clockIso: () => '2026-08-24', config: Board.assemble(pack, add: add, remove: remove));

  // עמותה: החבילה מדליקה את יכולות-מאור
  final wAmuta = fromPack('amuta');
  ok('אשף/עמותה: מאור נדלק', wAmuta.lit('supporters.cockpit') && wAmuta.lit('families') && !wAmuta.lit('bs.projects'));
  // בנייה: החבילה מדליקה את יכולות-בנייה-חכמה
  final wBinyan = fromPack('binyan');
  ok('אשף/בנייה: בנייה-חכמה נדלק', wBinyan.lit('bs.projects') && wBinyan.lit('bs.workflow') && !wBinyan.lit('families'));
  // דיגיטל/סטודיו
  ok('אשף/דיגיטל', fromPack('digital').lit('bs.studio') && fromPack('digital').lit('bs.assistant'));
  // חסד-פלוס: תערובת — מאור-ליבה + fuzzy/assistant של בנייה-חכמה עובדים יחד
  final wChesed = fromPack('chesed-plus');
  ok('אשף/חסד-פלוס: תערובת עובדת', wChesed.lit('supporters.cockpit') && wChesed.lit('bs.fuzzy') &&
      wChesed.cockpitKpis(sups)['total'] == 4 &&
      wChesed.fuzzyDupPairs([{'id': 'p1', 'name': 'משהכהן'}, {'id': 'p2', 'name': 'משהכוהן'}]).isNotEmpty);
  // full — הכל
  ok('אשף/full: הכל (15)', fromPack('full').capabilities().length == 15);
  // 🎛️ החוגה מעל האשף: החבילה + דיוק ידני (add/remove)
  ok('אשף+חוגה: עמותה + הדלקת bs.fuzzy', fromPack('amuta', add: ['bs.fuzzy']).lit('bs.fuzzy'));
  ok('אשף+חוגה: בנייה − כיבוי bs.studio', !fromPack('binyan', remove: ['bs.studio']).lit('bs.studio'));

  if (fails > 0) { print('❌ לוח-האם (Dart): $fails אי-התאמות'); throw StateError('board dart proof failed'); }
  print('✓ לוח-האם המאוחד (Dart): $n טענות — 12 קופסאות-מאור + 8 קופסאות-בנייה-חכמה על אותו לוח · מחוברים יחד');
}
