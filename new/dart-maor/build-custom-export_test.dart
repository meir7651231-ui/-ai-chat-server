// בדיקת-חוזה (רתמת-זהב) · buildCustomExport — מייבאת אך ורק את האטום-שלה (חוק-4).
// 7 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/build-custom-export.test.mjs
// (אותם קלטים → אותם פלטים; הערכים הומרו ל-Dart). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/build-custom-export_test.dart  ⇒ exit 0
import 'build-custom-export.dart';

// ---------- אובייקט-השקעים לבדיקה (מתועד בחוזה) ----------
const COURSE_DEFS = ['name', 'teacher', 'grade', 'room', 'schedule', 'model', 'occ', 'students', 'studentsFull', 'pays', 'revenue', 'abs'];
const EVENT_DEFS = ['title', 'type', 'hdate', 'gdate', 'time', 'fam', 'done'];
const SUP_DEFS = ['name', 'dons', 'donsAll', 'tier', 'stage', 'names', 'eyesTotal', 'paid', 'answers', 'next'];

final s = ExportSockets(
  expFieldDefs: (cfg, target) => (target == 'courses'
          ? COURSE_DEFS
          : target == 'events'
              ? EVENT_DEFS
              : SUP_DEFS)
      .map((k) => {'key': k, 'label': 'ת:' + k})
      .toList(),
  featureOn: (cfg, k) => (cfg['features'] as Map?)?[k] != false,
  termOf: (cfg, k, fb) => fb,
  sessionsOf: (c) => (c['sessions'] != null && (c['sessions'] as List).isNotEmpty)
      ? c['sessions'] as List
      : [
          {'day': c['weekday'], 'time': c['time'], 'label': ''}
        ],
  enrollCount: (db, id) => 1,
  // לוח-מדומה לועזי — getMonth של JS 0-מבוסס ⇒ month = (DateTime.month - 1).
  hebParts: (d) => {'day': d.day, 'month': (d.month - 1).toString(), 'year': d.year},
  hebAnnualEq: (a, q) => a['day'] == q['day'] && a['month'] == q['month'],
  hebDateFull: (iso) => 'ע:' + iso,
  supCount: (sp) => (sp['donations'] as List).length,
  supIls: (sp) => (sp['donations'] as List)
      .where((d) => d['cur'] != '\$')
      .fold<num>(0, (x, d) => x + _plusT(d['amount'])),
  supUsd: (sp) => (sp['donations'] as List)
      .where((d) => d['cur'] == '\$')
      .fold<num>(0, (x, d) => x + _plusT(d['amount'])),
  supScore: (sp, usdRate) => (sp['donations'] as List).length * 10,
  supTier: (sc) => {'label': sc >= 30 ? 'זהב' : 'רגיל'},
  stageLabel: (cfg, st) => 'ש:' + st.toString(),
  evMeta: {
    'org': {'label': 'אירוע'},
    'memorial': {'label': 'אזכרה'}
  },
  hebrewRecurring: {'memorial', 'anniversary', 'bday'},
  dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
);

// מקביל ל-`+x || 0` של JS — בשקעי-הבדיקה בלבד (המחרוזת '20' ⇒ 20).
num _plusT(dynamic x) {
  if (x is num) return x;
  if (x is String) return num.tryParse(x.trim()) ?? 0;
  return 0;
}

final cfg = {'features': {}};
final AUG = {'from': '2026-08-01', 'to': '2026-08-31'};

int f = 0;
String _j(dynamic v) {
  if (v is List) return '[' + v.map(_j).join(',') + ']';
  if (v is String) return '"$v"';
  return v.toString();
}

void eq(String name, dynamic got, dynamic want) {
  if (_j(got) != _j(want)) {
    print('✗ $name:\n  ${_j(got)}\n≠ ${_j(want)}');
    f = 1;
  }
}

void main() {
  // 1 — אפס שדות
  eq('1 · selectedKeys ריק',
      buildCustomExport(cfg, {'courses': []}, 'courses', AUG, [], s), [[]]);

  // 2 — courses
  final dbC = {
    'courses': [
      {'id': 'c1', 'name': 'ציור', 'teacherId': 't1', 'roomId': 'r1', 'model': 'punch', 'price': 120, 'maxStudents': 10, 'weekday': 0, 'time': '16:00', 'gradeMin': 'ג', 'gradeMax': 'ה'}
    ],
    'teachers': [
      {'id': 't1', 'name': 'הדס', 'phone': '050'}
    ],
    'rooms': [
      {'id': 'r1', 'name': 'אולם'}
    ],
    'families': [
      {'id': 'f1', 'name': 'פרץ', 'phone': '03', 'members': [{'id': 'm1', 'first': 'רות', 'phone': ''}]}
    ],
    'enrollments': [
      {'courseId': 'c1', 'memberId': 'm1', 'totalDue': 300, 'payments': [{'amount': 100, 'date': '2026-08-05'}, {'amount': 50, 'date': '2026-05-01'}], 'absences': [{'date': '2026-08-10'}, {'date': '2026-01-01'}]}
    ],
  };
  final r2 = buildCustomExport(cfg, dbC, 'courses', AUG, COURSE_DEFS, s);
  eq('2 · כותרות', r2[0], COURSE_DEFS.map((k) => 'ת:' + k).toList());
  eq('2 · שורת-החוג', r2[1], ['ציור', 'הדס 050', 'ג–ה', 'אולם', 'יום ראשון 16:00', 'כרטיסייה · ₪120', '1/10', 'רות', 'רות 03 · יתרה ₪150', '1 תשלומים · ₪100', '₪150', '1 חיסורים']);

  // 3 — events רגיל: הכללה-בטווח, customType, מיון
  final dbE = {
    'families': [
      {'id': 'f1', 'name': 'פרץ'}
    ],
    'events': [
      {'type': 'org', 'title': 'ישיבה', 'date': '2026-08-20', 'time': '10:00', 'famId': 'f1', 'done': true},
      {'type': 'custom', 'customType': 'מסיבה', 'title': 'חגיגה', 'date': '2026-08-10', 'done': false},
      {'type': 'org', 'title': 'ישן', 'date': '2025-01-01'},
    ],
  };
  final r3 = buildCustomExport(cfg, dbE, 'events', AUG, EVENT_DEFS, s);
  eq('3 · שתי שורות ממוינות', r3.length, 3);
  eq('3 · חגיגה (customType דורס)', r3[1], ['חגיגה', 'מסיבה', 'ע:2026-08-10', '10/08/2026', '', '', 'לא']);
  eq('3 · ישיבה', r3[2], ['ישיבה', 'אירוע', 'ע:2026-08-20', '20/08/2026', '10:00', 'פרץ', 'כן']);

  // 4 — events חוזר (הלוח-המדומה)
  final memA = {'type': 'memorial', 'title': 'אזכרה-א', 'date': '2025-08-20'};
  final r4a = buildCustomExport(cfg, {'families': [], 'events': [memA]}, 'events', AUG, ['title', 'gdate'], s);
  eq('4 · מופע שנתי בטווח החסום', r4a.sublist(1), [['אזכרה-א', '20/08/2026']]);
  final memB = {'type': 'memorial', 'title': 'אזכרה-ב', 'date': '2026-08-25'};
  final r4b = buildCustomExport(cfg, {'families': [], 'events': [memB]}, 'events', {'from': '2025-08-01', 'to': '2026-08-31'}, ['title', 'gdate'], s);
  eq('4 · חסם iso≥ev.date — אין רפאים ב-2025', r4b.sublist(1), [['אזכרה-ב', '25/08/2026']]);
  final r4c = buildCustomExport(cfg, {'families': [], 'events': [memA]}, 'events', {'from': '', 'to': ''}, ['title', 'gdate'], s);
  eq('4 · טווח ריק ⇒ החוזר בתאריך-המקור בלבד', r4c.sublist(1), [['אזכרה-א', '20/08/2025']]);

  // 5 — supporters: סינון-נגיעה + סכומי-מטבע
  final sp1 = {'name': 'שרה', 'donations': [{'date': '2026-08-05', 'amount': 100, 'cur': '₪'}, {'date': '2026-08-06', 'amount': '20', 'cur': '\$'}, {'date': '2025-01-01', 'amount': 999, 'cur': '₪'}]};
  final sp0 = {'name': 'רחל', 'donations': [{'date': '2025-01-01', 'amount': 5, 'cur': '₪'}]};
  final r5 = buildCustomExport(cfg, {'usdRate': 3.7, 'supporters': [sp0, sp1]}, 'supporters', AUG, SUP_DEFS, s);
  eq('5 · רחל מוחרגת', r5.length, 2);
  eq('5 · שורת שרה', r5[1], ['שרה', '2 תרומות · ₪100 + \$20', '3 תרומות · ₪1099 + \$20', 'זהב', '', '', '', '', '', '']);

  // 6 — supporters עם ayin דלוק (חסר-דגל = דלוק)
  final sp2 = {
    'name': 'לאה', 'donations': [],
    'ayin': {'stage': 'eyes', 'lastTouch': '2026-08-15', 'log': [], 'paid': true, 'nextTalk': '2026-09-01', 'nextTalkTime': '10:30',
      'names': [{'name': 'משה', 'eyes': 4, 'done': true}, {'name': 'רות', 'eyes': ''}],
      'answers': [{'date': '2026-08-10', 'note': 'א'}, {'date': '2025-01-01', 'note': 'ישן'}]},
  };
  final r6 = buildCustomExport(cfg, {'usdRate': 3.7, 'supporters': [sp2]}, 'supporters', AUG, SUP_DEFS, s);
  eq('6 · שורת לאה', r6[1], ['לאה', '0 תרומות · ₪0', '0 תרומות · ₪0', 'רגיל', 'ש:eyes', 'משה ·4 ✓ · רות', '4', 'כן', 'א', '01/09/2026 10:30']);

  // 7 — ayin כבוי: מגע-בלבד מוחרג; תשובה-בטווח נשארת אך עמודות-ayin ריקות
  final sp3 = {'name': 'מרים', 'donations': [], 'ayin': {'stage': 'new', 'lastTouch': '2026-08-15', 'log': [], 'names': [], 'answers': []}};
  final cfgOff = {'features': {'supporters.ayin': false}};
  final r7 = buildCustomExport(cfgOff, {'usdRate': 3.7, 'supporters': [sp3, sp2]}, 'supporters', AUG, SUP_DEFS, s);
  eq('7 · רק לאה (מרים מוחרגת)', r7.sublist(1).map((r) => r[0]).toList(), ['לאה']);
  eq('7 · עמודות-ayin ריקות', r7[1].sublist(4), ['', '', '', '', '', '']);

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(f == 0, 'רתמת-הזהב אדומה — Dart ≠ JS');

  if (f != 0) {
    print('build-custom-export: אדום');
    throw StateError('golden mismatch');
  }
  print('✓ build-custom-export: 7 דוגמאות-חוזה — ירוק');
}
