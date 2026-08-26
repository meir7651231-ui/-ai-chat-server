// 🧪 הוכחת-חוצה-שפות · audit (Dart) — אותם קלטים/WANT כמו new/boxes/audit.test.mjs.
// (הושלם ידנית לאחר שסוכן-הבנייה נפל בשגיאת-API לפני כתיבת ההוכחה; הקופסה עצמה תקינה.)
// מגן-מקור-ה-JS (readFileSync על audit.mjs) דולג — תלוי-טקסט-מקור-JS, לא התנהגות.
import 'dart:convert';
import 'audit.dart' as A;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) { print('✗ $name: got $g want $w'); fails++; } else { n++; }
}
void ok(String name, bool c) { if (!c) { print('✗ $name'); fails++; } else { n++; } }

final now = DateTime(2026, 8, 24, 12, 0, 0);

Map<String, dynamic> fam(String id, String name, String phone, {String? fatherId, List members = const []}) => {
      'status': 'active', 'city': 'צפת', 'address': 'רח 1', 'maritalStatus': 'נשואים',
      'father': 'א', 'mother': 'ב', 'members': members, 'id': id, 'name': name, 'phone': phone,
      if (fatherId != null) 'fatherId': fatherId,
    };

void main() {
  // ── קבועי-התצוגה ──
  eq('סדר-הקטגוריות', A.AUDIT_CATEGORIES, ['כפילות', 'ת"ז', 'טלפון', 'אימייל', 'כתובת', 'לוגיקה', 'ילדים', 'קשר']);
  eq('צבעי-כפילות', A.AUDIT_CAT_COLORS['כפילות'], ['#fdeaea', '#b91c1c']);
  eq('צבעי-קשר', A.AUDIT_CAT_COLORS['קשר'], ['#f6ead1', '#9a6414']);
  ok('לכל קטגוריה צבע', A.AUDIT_CAT_COLORS.keys.join() == A.AUDIT_CATEGORIES.join());

  // ── phoneIssue — טבלת-החוזה ──
  eq('טלפון ריק', A.phoneIssue(null), null);
  eq('טלפון מחרוזת-ריקה', A.phoneIssue(''), null);
  eq('טלפון מקף', A.phoneIssue('-'), null);
  eq('טלפון 10 ספרות', A.phoneIssue('050-1234567'), null);
  eq('טלפון 9 ספרות', A.phoneIssue('03-5551234'), null);
  eq('8 ספרות', A.phoneIssue('12345678'), 'כנראה חסרה ספרת 0 מובילה: 12345678');
  eq('6 ספרות', A.phoneIssue('123456'), 'קצר מדי: 123456');
  eq('קידומת-ללא-0', A.phoneIssue('972501234567'), 'לא מתחיל ב-0: 972501234567');
  eq('11 ספרות', A.phoneIssue('05012345678'), 'אורך חריג (11 ספרות): 05012345678');

  // ── runAudit — קורפוס-הדוגמאות ──
  final db = {
    'families': [
      fam('f1', 'א', '0501234567'),
      fam('f2', 'ב', '0501234567'),
      fam('f3', 'לוי', '0525550001', fatherId: '123456789'),
      fam('f4', 'ולידי', '0525550002', fatherId: '123456782'),
      fam('f5', 'ילדים', '0525550003', members: [
        {'id': 'm1', 'first': 'זקן', 'birth': '1990-01-01'},
        {'id': 'm2', 'first': 'שבור', 'birth': 'bad-date'},
        {'id': 'm3', 'first': 'תקין', 'birth': '2015-06-10'},
      ]),
    ],
    'enrollments': [{'memberId': 'm3', 'totalDue': 100, 'payments': [{'amount': 80}, {'amount': 40}]}],
    'supporters': [
      {'id': 's1', 'name': 'תורם', 'phone': '0501112222', 'ils': 100, 'count': 1, 'donations': [{'amount': 50, 'date': '2026-01-01', 'rid': 'R-1'}]},
      {'id': 's2', 'name': 'איחר', 'phone': '0501112223', 'ils': 0, 'usd': 0, 'count': 1, 'nextDate': '2026-01-01', 'donations': [{'amount': 0, 'date': '2026-01-02', 'rid': 'D-7'}]},
    ],
  };
  final issues = A.runAudit(db, '2026-08-24', true, null, now);
  bool has(String cat, String part) => issues.any((i) => i['cat'] == cat && (i['title'] as String).contains(part));
  ok('טלפון-משותף', has('כפילות', 'טלפון 0501234567 משותף ל-2 משפחות: א, ב'));
  ok('ת"ז שגויה', has('ת"ז', 'לא עוברת ספרת ביקורת (123456789)'));
  ok('ת"ז תקינה לא-סומנה', !issues.any((i) => (i['title'] as String).contains('123456782')));
  ok('גיל 36 מוזרק', has('ילדים', 'גיל חריג לזקן (36)'));
  ok('birth שבור ⇒ בלי גיל', !issues.any((i) => i['cat'] == 'ילדים' && (i['title'] as String).contains('שבור') && (i['title'] as String).contains('גיל')));
  ok('מצבור/פירוט', has('לוגיקה', 'לא תואם את פירוט ה'));
  ok('יעד-קשר', has('קשר', 'עבר יעד הקשר של "איחר" (2026-01-01)'));
  ok('תרומת-אפס', has('לוגיקה', 'תרומה בסכום 0 אצל "איחר" (D-7)'));
  ok('תשלום-יתר', has('לוגיקה', 'שולם ₪120 — יותר מסה"כ העסקה (₪100)'));
  final ff = issues.firstWhere((i) => (i['title'] as String).contains('משותף'), orElse: () => null);
  ok('famId על ממצא-משפחה', ff != null && ff['famId'] == 'f1');
  final ss = issues.firstWhere((i) => i['cat'] == 'קשר', orElse: () => null);
  ok('spId על ממצא-תומך', ss != null && ss['spId'] == 's2');

  // ברירות-מחדל
  final defIssues = A.runAudit(db, '', true, null, now);
  ok("ברירת todayIso='' דילגה יעד-קשר", !defIssues.any((i) => (i['title'] as String).contains('עבר יעד הקשר')));
  ok('ברירת extra=true בדקה תרומת-אפס', defIssues.any((i) => (i['title'] as String).contains('תרומה בסכום 0')));
  final offIssues = A.runAudit(db, '2026-08-24', false, null, now);
  ok('extra=false כיבה מורחבת', !offIssues.any((i) => (i['title'] as String).contains('עבר יעד הקשר') || (i['title'] as String).contains('תרומה בסכום 0')));

  // termOf דרך config
  final cfg = {'terms': {'nav.families': 'לקוחות'}};
  ok('termOf דריסת-מונח', A.runAudit(db, '2026-08-24', true, cfg, now).any((i) => (i['title'] as String).contains('משותף ל-2 לקוחות')));

  // נרמול-שם בכפילות-תומכים
  final dupDb = {
    'families': [],
    'supporters': [
      {'id': 'd1', 'name': 'בן דוד', 'phone': '0501234567', 'donations': []},
      {'id': 'd2', 'name': 'בןדוֹד', 'phone': '0501234568', 'donations': []},
    ],
  };
  ok('נרמול-שם', A.runAudit(dupDb, '', true, null, now).any((i) => i['cat'] == 'כפילות' && (i['title'] as String).contains('מופיע/ה 2 פעמים')));

  // חסינות
  eq('db ריק ⇒ []', A.runAudit({}, '', true, null, now), []);
  final brokenDb = {
    'families': [{...fam('x', 'שבורה', '0525550009'), 'members': 'לא-מערך'}],
    'enrollments': 'לא-מערך',
    'supporters': [{'id': 'y', 'name': 'בלי-פירוט', 'phone': '0525550008', 'donations': null}],
  };
  try { A.runAudit(brokenDb, '2026-08-24', true, null, now); n++; } catch (e) { print('✗ קריסה על פגום: $e'); fails++; }

  // auditReportLines
  eq('שורות-הדוח + ברירת-שם', A.auditReportLines('', [{'cat': 'טלפון', 'title': 'X'}], '24.8.2026'),
      ['דוח תקינות נתונים — מאור החסד', 'הופק: 24.8.2026', '', '[טלפון] X']);
  eq('שם-ארגון מפורש', A.auditReportLines('אור ראשון', [], 'עכשיו'),
      ['דוח תקינות נתונים — אור ראשון', 'הופק: עכשיו', '']);

  if (fails > 0) { print('❌ קופסת-audit (Dart): $fails אי-התאמות'); throw StateError('audit dart proof failed'); }
  print('✓ קופסת-הביקורת (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
