// רתמת-זהב · run-audit — אותן 7 דוגמאות-חוזה (12 בדיקות) בדיוק
// מ-new/atoms/run-audit.test.mjs. עובר ⇒ Dart ≡ JS.
// השוואת-מערכים = אורך + איבר-איבר (כלל-8): כל בדיקה בודקת length ואז שדות.
// הרצה: dart run --enable-asserts run-audit_test.dart
import 'run-audit.dart';

// שקעי-בדיקה (כמתועד בחוזה) — תרגום נאמן של הבודק ב-JS.
bool validIsraeliId(dynamic x) {
  final s = x.toString();
  if (s.length > 9 || s.isEmpty) return false;
  final d = s.padLeft(9, '0');
  var sum = 0;
  for (var i = 0; i < 9; i++) {
    final di = int.tryParse(d[i]);
    if (di == null) return false; // JS: ‏+ספרה-רעה ⇒ NaN ⇒ הסכום NaN ⇒ false
    final n = di * ((i % 2) + 1);
    sum += n > 9 ? n - 9 : n;
  }
  return sum % 10 == 0;
}

final Map<String, dynamic> deps = {
  'termOf': (dynamic config, dynamic k, dynamic fb) =>
      k == 'nav.families' ? 'בתי-אב' : fb,
  'normName': (dynamic s) =>
      (s == null ? '' : s.toString()).trim().toLowerCase(),
  'validIsraeliId': validIsraeliId,
  'phoneIssue': (dynamic p) => p == '052' ? 'קצר מדי: 052' : null,
  'ageOf': (dynamic birth) => birth == '2030-01-01' ? -4 : 10,
  'supporterAggregates': (dynamic sp) => {'ils': 100, 'usd': 0, 'count': 1},
};

// משפחה "נקייה" — לא מייצרת שום ממצא
Map<String, dynamic> fam(String id, [Map<String, dynamic> over = const {}]) {
  final m = <String, dynamic>{
    'id': id,
    'name': 'לוי-' + id,
    'mother': 'רחל',
    'phone': '05299900' + id.substring(id.length - 2), // id.slice(-2)
    'city': 'צפת',
    'address': 'רח 1',
    'status': 'active',
    'members': [],
  };
  m.addAll(over);
  return m;
}

// תומך "נקי" — תואם את מצבור-השקע {ils:100,usd:0,count:1}
Map<String, dynamic> sup(String id, [Map<String, dynamic> over = const {}]) {
  final m = <String, dynamic>{
    'id': id,
    'name': 'תורם-' + id,
    'ils': 100,
    'usd': 0,
    'count': 1,
    'donations': [
      {'amount': 100, 'rid': 'R-' + id}
    ],
  };
  m.addAll(over);
  return m;
}

Map<String, dynamic> dbOf(
        {List families = const [],
        List enrollments = const [],
        List supporters = const []}) =>
    {
      'families': families,
      'enrollments': enrollments,
      'supporters': supporters,
    };

void main() {
  var f = 0;
  void chk(String name, bool cond) {
    if (!cond) {
      print('✗ ' + name);
      f = 1;
    }
  }

  // 1) שם+אם זהים ⇒ ממצא-כפילות יחיד
  final r1 = runAudit(
      dbOf(families: [
        fam('f01', {'name': 'כהן', 'mother': 'שרה'}),
        fam('f02', {'name': 'כהן', 'mother': 'שרה'}),
      ]),
      '',
      true,
      null,
      deps);
  chk(
      '1 כפילות שם+אם',
      r1.length == 1 &&
          r1[0]['cat'] == 'כפילות' &&
          r1[0]['title'] == 'שם + שם האם זהים: "כהן" — 2 רשומות' &&
          r1[0]['famId'] == 'f01');

  // 2) טלפון משותף — פעם אחת לזוג; termOf מחליף 'משפחות'
  final dbPhone = dbOf(families: [
    fam('f11', {'name': 'א', 'phone': '0521111111'}),
    fam('f12', {'name': 'ב', 'phone': '0521111111', 'phone2': '0521111111'}),
  ]);
  final r2 = runAudit(dbPhone, '', true, null, deps);
  chk(
      '2א טלפון משותף — ממצא יחיד בנוסח ברירת-המחדל',
      r2.length == 1 &&
          r2[0]['cat'] == 'כפילות' &&
          r2[0]['title'] == 'טלפון 0521111111 משותף ל-2 משפחות: א, ב');
  final r2b = runAudit(dbPhone, '', true, <String, dynamic>{}, deps);
  chk('2ב עם config ⇒ מונח termOf "בתי-אב"',
      r2b[0]['title'] == 'טלפון 0521111111 משותף ל-2 בתי-אב: א, ב');

  // 3) ת"ז אב עם ספרת-ביקורת שגויה; תקינה ⇒ נקי
  final r3 = runAudit(
      dbOf(families: [
        fam('f21', {'fatherId': '123456789'})
      ]),
      '',
      true,
      null,
      deps);
  chk(
      '3א ת"ז אב שגויה',
      r3.length == 1 &&
          r3[0]['cat'] == 'ת"ז' &&
          r3[0]['title'] ==
              'משפחת לוי-f21: ת"ז אב לא עוברת ספרת ביקורת (123456789)');
  final r3b = runAudit(
      dbOf(families: [
        fam('f22', {'fatherId': '123456782'})
      ]),
      '',
      true,
      null,
      deps);
  chk('3ב ת"ז תקינה ⇒ אפס ממצאים', r3b.length == 0);

  // 4) פעילה בלי עיר ⇒ 'כתובת'; inactive ⇒ מדולגת
  final r4 = runAudit(
      dbOf(families: [
        fam('f31', {'city': ''})
      ]),
      '',
      true,
      null,
      deps);
  chk(
      '4א חסרה עיר',
      r4.length == 1 &&
          r4[0]['cat'] == 'כתובת' &&
          r4[0]['title'] == 'משפחת לוי-f31: חסרה עיר');
  final r4b = runAudit(
      dbOf(families: [
        fam('f32', {'city': '', 'status': 'inactive'})
      ]),
      '',
      true,
      null,
      deps);
  chk('4ב ‏inactive לא נבדקת', r4b.length == 0);

  // 5) תשלום-יתר בשיבוץ ⇒ 'לוגיקה' עם famId של משפחת-החבר
  final r5 = runAudit(
      dbOf(
        families: [
          fam('f41', {
            'members': [
              {'id': 'm1', 'isParent': true}
            ]
          })
        ],
        enrollments: [
          {
            'memberId': 'm1',
            'totalDue': 200,
            'payments': [
              {'amount': 120},
              {'amount': 180}
            ]
          }
        ],
      ),
      '',
      true,
      null,
      deps);
  chk(
      '5 תשלום-יתר ₪300 > ₪200',
      r5.length == 1 &&
          r5[0]['cat'] == 'לוגיקה' &&
          r5[0]['famId'] == 'f41' &&
          r5[0]['title'] ==
              'משפחת לוי-f41: שולם ₪300 — יותר מסה"כ העסקה (₪200). בדקו החזר או עדכנו את הסכום');

  // 6) אי-התאמת מצבור/פירוט אצל תומך; תואם ⇒ נקי
  final r6 = runAudit(
      dbOf(supporters: [
        sup('s01', {'ils': 50})
      ]),
      '',
      true,
      null,
      deps);
  chk(
      '6א מצבור 50 מול נגזר 100 ⇒ לוגיקה',
      r6.length == 1 &&
          r6[0]['cat'] == 'לוגיקה' &&
          r6[0]['spId'] == 's01' &&
          (r6[0]['title'] as String).contains('הסכום המצטבר הרשום (₪50') &&
          (r6[0]['title'] as String).contains('(₪100'));
  chk(
      '6ב מצבור תואם ⇒ אפס ממצאים',
      runAudit(dbOf(supporters: [sup('s02')]), '', true, null, deps).length ==
          0);

  // 7) יעד-קשר שעבר — רק ב-extra=true
  final dbNext = dbOf(supporters: [
    sup('s03', {'nextDate': '2026-08-01'})
  ]);
  final r7 = runAudit(dbNext, '2026-08-24', true, null, deps);
  chk(
      '7א ‏extra=true ⇒ ממצא-קשר',
      r7.length == 1 &&
          r7[0]['cat'] == 'קשר' &&
          r7[0]['title'] == 'עבר יעד הקשר של "תורם-s03" (2026-08-01)');
  chk('7ב ‏extra=false ⇒ כבוי',
      runAudit(dbNext, '2026-08-24', false, null, deps).length == 0);

  if (f != 0) throw StateError('run-audit: סטייה מהמקור');
  print('✓ run-audit: 7 דוגמאות-חוזה (12 בדיקות) — ירוק');
  print('OK');
}
