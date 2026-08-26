// 🧪 הוכחת-חוצה-שפות · דו"ח מותאם (Dart) — אותם קלטים/WANT כמו new/boxes/custom-export.test.mjs.
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה: הגדרות-שדות (14/7·17/11) · שורת-חוג ·
// דין-אדר+חסם-רפאים · תומכות (טווח/hist/עין) · override — פלט זהה-ביט.
// הערה: 5 "מגני-ההכרעה" של בדיקת-ה-JS (readFileSync + regex על מקור-ה-mjs עצמו) הם
//   תלויי-מקור-JS ולא התנהגות חוצה-שפות ⇒ מדולגים כאן (חוק המקרה-תלוי-ריצת-JS).
import 'dart:convert';
import 'custom-export.dart' as X;

int n = 0, fails = 0;
void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  } else {
    n++;
  }
}

// cfg כ-Map<String,dynamic> (השקע featureOn מקלט cfg as Map<String,dynamic>).
Map<String, dynamic> cfgWith([Map<String, dynamic>? over]) => <String, dynamic>{
      'terms': <String, dynamic>{},
      'modules': <String, dynamic>{},
      'features': <String, dynamic>{},
      ...?over,
    };

void main() {
  final cfg = cfgWith();

  // ── דוגמה 1: הגדרות-שדות לחוגים — מלא (חסר=פעיל) 14, מקוצר 7 ──
  final full = X.expFieldDefs(cfg, 'courses');
  ok('חוגים-מלא: 14', full.length == 14);
  ok('חוגים-מלא ראשון', full[0]['key'] == 'name' && full[0]['label'] == 'שם החוג');
  final brief = X.expFieldDefs(cfgWith({'features': {'reports.custom.full': false}}), 'courses');
  ok('חוגים-מקוצר: 7', brief.length == 7);
  ok('אירועים: 8 שדות', X.expFieldDefs(cfg, 'events').length == 8);

  // ── דוגמה 2: תומכות — עם עין 17, בלי עין 11 (אין stage/names/…) ──
  final supDefs = X.expFieldDefs(cfg, 'supporters');
  ok('תומכות-עם-עין: 17', supDefs.length == 17);
  final noAyin = X.expFieldDefs(cfgWith({'features': {'supporters.ayin': false}}), 'supporters');
  ok('תומכות-בלי-עין: 11', noAyin.length == 11);
  ok('שדות-עין לא דלפו',
      !noAyin.any((d) => ['stage', 'names', 'eyesTotal', 'paid', 'answers', 'next'].contains(d['key'])));
  // כיבוי מודול-האב supporters מכבה גם את תת-הדגל (NAV_MODULE_KEYS)
  final modOff = X.expFieldDefs(cfgWith({'modules': {'supporters': false}}), 'supporters');
  ok('מודול-כבוי כיבה את העין: 11', modOff.length == 11);

  // ── חוגים: שורת-נתונים מלאה דרך הקופסה ──
  final db = <String, dynamic>{
    'families': [
      {'id': 'f1', 'name': 'כהן', 'phone': '02-000', 'members': [{'id': 'm1', 'first': 'רות', 'phone': ''}]}
    ],
    'rooms': [{'id': 'r1', 'name': 'אולם'}],
    'teachers': [{'id': 't1', 'name': 'שרה', 'phone': '050'}],
    'courses': [
      {'id': 'c1', 'name': 'ציור', 'teacherId': 't1', 'roomId': 'r1', 'weekday': 2, 'time': '16:00', 'model': 'punch', 'price': 120, 'maxStudents': 10, 'notes': ''}
    ],
    'enrollments': [
      {'id': 'e1', 'courseId': 'c1', 'memberId': 'm1', 'payments': [{'date': '2025-01-05', 'amount': 100}], 'absences': [{'date': '2025-01-12'}], 'totalDue': 400}
    ],
    'events': [
      {'id': 'v1', 'type': 'memorial', 'title': 'אזכרה לסבא', 'date': '2024-03-24', 'time': '', 'famId': 'f1', 'notes': '', 'done': false}
    ],
    'supporters': [],
    'usdRate': 3.7,
  };
  final jan = {'from': '2025-01-01', 'to': '2025-01-31'};
  final cr = X.buildCustomExport(cfg, db, 'courses', jan, ['name', 'teacher', 'schedule', 'occ', 'students', 'pays', 'abs']);
  ok('חוגים: 2 שורות', cr.length == 2);
  eq('שורת-חוג', cr[1], ['ציור', 'שרה 050', 'יום שלישי 16:00', '1/10', 'רות', '1 תשלומים · ₪100', '1 חיסורים']);

  // ── דוגמה 3: אזכרה עברית-חוזרת — דין-אדר + חסם-רפאים ──
  final ev = X.buildCustomExport(cfg, db, 'events', {'from': '2025-03-01', 'to': '2025-03-31'}, ['title', 'type', 'hdate', 'gdate', 'fam', 'done']);
  ok('אזכרה: 2 שורות (דין-אדר: אדר-ב⇒אדר)', ev.length == 2);
  eq('שורת-אזכרה', ev[1], ['אזכרה לסבא', 'אזכרה', 'י״ד אדר תשפ״ה', '14/03/2025', 'כהן', 'לא']);
  final ghost = X.buildCustomExport(cfg, db, 'events', {'from': '2023-03-01', 'to': '2023-03-31'}, ['title']);
  ok('שורת-רפאים לפני ev.date: אין', ghost.length == 1);

  // ── דוגמה 4: תומכות — סינון-טווח, donsAll כולל hist, מדולגת-בלי-פעילות ──
  final sdb = <String, dynamic>{
    ...db,
    'supporters': [
      {'id': 's1', 'name': 'לוי', 'phone': '', 'email': '', 'donations': [{'date': '2025-01-10', 'amount': 200, 'cur': '₪'}, {'date': '2025-01-20', 'amount': 50, 'cur': '\$'}, {'date': '2023-05-01', 'amount': 999, 'cur': '₪'}], 'count': 3, 'ils': 1199, 'usd': 50, 'hist': [{'d': '2022-01-01', 'a': 100, 'c': '₪'}], 'last': '2025-01-20', 'notes': ''},
      {'id': 's2', 'name': 'רדומה', 'donations': [{'date': '2020-01-01', 'amount': 10, 'cur': '₪'}]},
      {'id': 's3', 'name': 'גולן', 'donations': [], 'ayin': {'stage': 'eyes', 'names': [{'name': 'דוד', 'eyes': 5, 'done': true}, {'name': 'חנה', 'eyes': '', 'done': false}], 'answers': [{'date': '2025-01-15', 'note': 'כן'}], 'log': [], 'lastTouch': '', 'paid': false, 'nextTalk': '2025-02-01', 'nextTalkTime': '10:00'}},
    ],
  };
  final sr = X.buildCustomExport(cfg, sdb, 'supporters', jan, ['name', 'dons', 'donsAll', 'tier']);
  ok('תומכות: 3 שורות (הרדומה מדולגת)', sr.length == 3);
  eq('שורת-לוי', sr[1], ['לוי', '2 תרומות · ₪200 + \$50', '4 תרומות · ₪1299 + \$50', 'ארד']);
  final ay = X.buildCustomExport(cfg, sdb, 'supporters', jan, ['name', 'stage', 'names', 'eyesTotal', 'paid', 'answers', 'next']);
  final ayRow = ay.firstWhere((r) => r[0] == 'גולן', orElse: () => <String>[]);
  ok('גולן (תשובה-בטווח) קיים', ayRow.isNotEmpty);
  eq('שורת-עין', ayRow, ['גולן', 'רישום', 'דוד ·5 ✓ · חנה', '5', 'לא', 'כן', '01/02/2025 10:00']);

  // ── דוגמה 5: overrideColumn — כותרת חסינה, אי-מוטציה, colIdx<0 ──
  final rows = [['א', 'ב'], ['1', '2']];
  final od = X.overrideColumn(rows, 1, {0: 'X', 1: 'Y'});
  eq('override', od, [['א', 'ב'], ['1', 'Y']]);
  ok('override לא מוטט את המקור', rows[1][1] == '2');
  ok('colIdx<0 ⇒ כניסה-כיציאה', identical(X.overrideColumn(rows, -1, {1: 'Z'}), rows));

  // ── קצוות: אפס-שדות ⇒ כותרת-ריקה בלבד; טווח-פתוח כולל הכול ──
  eq('אפס-שדות', X.buildCustomExport(cfg, db, 'courses', jan, []), [[]]);
  final open = X.buildCustomExport(cfg, sdb, 'supporters', {'from': '', 'to': ''}, ['name']);
  ok('טווח-פתוח: 4 שורות (גבול ריק = בלי-סינון; גם הרדומה נכנסת)', open.length == 4);

  // 🛡 מדולג (מגן-מקור-JS): חמשת מגני-ההכרעה של הבדיקה קוראים את מקור-ה-mjs (readFileSync
  //   + regex) — תלויי-מקור-JS, לא התנהגות חוצה-שפות. הכרעות-הקופסה מאומתות ב-analyze עצמו.

  if (fails > 0) {
    print('❌ קופסת הדו"ח-המותאם (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('custom-export dart proof failed');
  }
  print('✓ קופסת הדו"ח-המותאם (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
