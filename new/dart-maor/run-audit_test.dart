// בדיקת-חוזה · run-audit — פורט נאמן מ-new/atoms/run-audit.test.mjs.
// 7 דוגמאות-חוזה (12 בדיקות). מריצים: dart run --enable-asserts run-audit_test.dart
import 'dart:io';
import 'run-audit.dart';

int _f = 0;
void chk(String name, bool cond) {
  if (!cond) {
    stderr.writeln('✗ ' + name);
    _f = 1;
  }
}

// שקעי-בדיקה (כמתועד בחוזה)
bool validIsraeliId(dynamic x) {
  final str = x.toString();
  final d = str.padLeft(9, '0');
  if (str.length > 9 || str.isEmpty) return false;
  var s = 0;
  for (var i = 0; i < 9; i++) {
    final n = int.parse(d[i]) * ((i % 2) + 1);
    s += n > 9 ? n - 9 : n;
  }
  return s % 10 == 0;
}

final deps = <String, Function>{
  'termOf': (dynamic config, dynamic k, dynamic fb) =>
      k == 'nav.families' ? 'בתי-אב' : fb,
  'normName': (dynamic s) =>
      ((s == null || s == '') ? '' : s.toString()).trim().toLowerCase(),
  'validIsraeliId': validIsraeliId,
  'phoneIssue': (dynamic p) => p == '052' ? 'קצר מדי: 052' : null,
  'ageOf': (dynamic birth) => birth == '2030-01-01' ? -4 : 10,
  'supporterAggregates': (dynamic sp) =>
      <String, dynamic>{'ils': 100, 'usd': 0, 'count': 1},
};

// משפחה "נקייה" — לא מייצרת שום ממצא
Map fam(String id, [Map over = const {}]) => {
      'id': id,
      'name': 'לוי-' + id,
      'mother': 'רחל',
      'phone': '05299900' + id.substring(id.length - 2),
      'city': 'צפת',
      'address': 'רח 1',
      'status': 'active',
      'members': [],
      ...over,
    };

// תומך "נקי" — תואם את מצבור-השקע {ils:100,usd:0,count:1}
Map sup(String id, [Map over = const {}]) => {
      'id': id,
      'name': 'תורם-' + id,
      'ils': 100,
      'usd': 0,
      'count': 1,
      'donations': [
        {'amount': 100, 'rid': 'R-' + id}
      ],
      ...over,
    };

final emptyDb = {'families': [], 'enrollments': [], 'supporters': []};

void main() {
  // 1) שם+אם זהים ⇒ ממצא-כפילות יחיד
  final r1 = runAudit({
    ...emptyDb,
    'families': [
      fam('f01', {'name': 'כהן', 'mother': 'שרה'}),
      fam('f02', {'name': 'כהן', 'mother': 'שרה'}),
    ]
  }, '', true, null, deps);
  chk(
      '1 כפילות שם+אם',
      r1.length == 1 &&
          r1[0]['cat'] == 'כפילות' &&
          r1[0]['title'] == 'שם + שם האם זהים: "כהן" — 2 רשומות' &&
          r1[0]['famId'] == 'f01');

  // 2) טלפון משותף — פעם אחת לזוג; termOf מחליף 'משפחות'
  final dbPhone = {
    ...emptyDb,
    'families': [
      fam('f11', {'name': 'א', 'phone': '0521111111'}),
      fam('f12', {'name': 'ב', 'phone': '0521111111', 'phone2': '0521111111'}),
    ]
  };
  final r2 = runAudit(dbPhone, '', true, null, deps);
  chk(
      '2א טלפון משותף — ממצא יחיד בנוסח ברירת-המחדל',
      r2.length == 1 &&
          r2[0]['cat'] == 'כפילות' &&
          r2[0]['title'] == 'טלפון 0521111111 משותף ל-2 משפחות: א, ב');
  final r2b = runAudit(dbPhone, '', true, {}, deps);
  chk('2ב עם config ⇒ מונח termOf "בתי-אב"',
      r2b[0]['title'] == 'טלפון 0521111111 משותף ל-2 בתי-אב: א, ב');

  // 3) ת"ז אב עם ספרת-ביקורת שגויה; תקינה ⇒ נקי
  final r3 = runAudit({
    ...emptyDb,
    'families': [
      fam('f21', {'fatherId': '123456789'})
    ]
  }, '', true, null, deps);
  chk(
      '3א ת"ז אב שגויה',
      r3.length == 1 &&
          r3[0]['cat'] == 'ת"ז' &&
          r3[0]['title'] ==
              'משפחת לוי-f21: ת"ז אב לא עוברת ספרת ביקורת (123456789)');
  final r3b = runAudit({
    ...emptyDb,
    'families': [
      fam('f22', {'fatherId': '123456782'})
    ]
  }, '', true, null, deps);
  chk('3ב ת"ז תקינה ⇒ אפס ממצאים', r3b.length == 0);

  // 4) פעילה בלי עיר ⇒ 'כתובת'; inactive ⇒ מדולגת
  final r4 = runAudit({
    ...emptyDb,
    'families': [
      fam('f31', {'city': ''})
    ]
  }, '', true, null, deps);
  chk(
      '4א חסרה עיר',
      r4.length == 1 &&
          r4[0]['cat'] == 'כתובת' &&
          r4[0]['title'] == 'משפחת לוי-f31: חסרה עיר');
  final r4b = runAudit({
    ...emptyDb,
    'families': [
      fam('f32', {'city': '', 'status': 'inactive'})
    ]
  }, '', true, null, deps);
  chk('4ב ‏inactive לא נבדקת', r4b.length == 0);

  // 5) תשלום-יתר בשיבוץ ⇒ 'לוגיקה' עם famId של משפחת-החבר
  final r5 = runAudit({
    'families': [
      fam('f41', {
        'members': [
          {'id': 'm1', 'isParent': true}
        ]
      })
    ],
    'enrollments': [
      {
        'memberId': 'm1',
        'totalDue': 200,
        'payments': [
          {'amount': 120},
          {'amount': 180}
        ]
      }
    ],
    'supporters': [],
  }, '', true, null, deps);
  chk(
      '5 תשלום-יתר ₪300 > ₪200',
      r5.length == 1 &&
          r5[0]['cat'] == 'לוגיקה' &&
          r5[0]['famId'] == 'f41' &&
          r5[0]['title'] ==
              'משפחת לוי-f41: שולם ₪300 — יותר מסה"כ העסקה (₪200). בדקו החזר או עדכנו את הסכום');

  // 6) אי-התאמת מצבור/פירוט אצל תומך; תואם ⇒ נקי
  final r6 = runAudit({
    ...emptyDb,
    'supporters': [
      sup('s01', {'ils': 50})
    ]
  }, '', true, null, deps);
  chk(
      '6א מצבור 50 מול נגזר 100 ⇒ לוגיקה',
      r6.length == 1 &&
          r6[0]['cat'] == 'לוגיקה' &&
          r6[0]['spId'] == 's01' &&
          (r6[0]['title'] as String).contains('הסכום המצטבר הרשום (₪50') &&
          (r6[0]['title'] as String).contains('(₪100'));
  chk(
      '6ב מצבור תואם ⇒ אפס ממצאים',
      runAudit({
        ...emptyDb,
        'supporters': [sup('s02')]
      }, '', true, null, deps).length ==
          0);

  // 7) יעד-קשר שעבר — רק ב-extra=true
  final dbNext = {
    ...emptyDb,
    'supporters': [
      sup('s03', {'nextDate': '2026-08-01'})
    ]
  };
  final r7 = runAudit(dbNext, '2026-08-24', true, null, deps);
  chk(
      '7א ‏extra=true ⇒ ממצא-קשר',
      r7.length == 1 &&
          r7[0]['cat'] == 'קשר' &&
          r7[0]['title'] == 'עבר יעד הקשר של "תורם-s03" (2026-08-01)');
  chk('7ב ‏extra=false ⇒ כבוי',
      runAudit(dbNext, '2026-08-24', false, null, deps).length == 0);

  // ── ratchet-הסגר (26.8) · אופרטור `+` פולימורפי + null↔undefined ─────────────
  // הבאג-שהיה: הפורט חיבר מספרית (_jsAddNum) במקום `+` של JS (שרשור-מחרוזות
  // כשאופרנד מחרוזתי), ו-_jsStr(null)⇒'undefined' גם ל-null-מפורש. אומת מול Node.
  final famM = {
    ...fam('fR', {'name': 'רץ'}),
    'members': [
      {'id': 'mR', 'first': 'איל', 'birth': '2015-01-01'}
    ]
  };
  List overTitles(List pays, dynamic due) {
    final r = runAudit({
      ...emptyDb,
      'families': [famM],
      'enrollments': [
        {'memberId': 'mR', 'totalDue': due, 'payments': pays}
      ]
    }, '', true, null, deps);
    return r.where((x) => x['cat'] == 'לוגיקה').map((x) => x['title']).toList();
  }

  chk(
      'R1 reduce מחרוזת ⇒ שרשור (0+"100"="0100")',
      overTitles([
        {'amount': '100'}
      ], 50).any((t) => (t as String).contains('שולם ₪0100')));
  chk(
      'R2 reduce ["1","2"] ⇒ "012"',
      overTitles([
        {'amount': '1'},
        {'amount': '2'}
      ], 5).any((t) => (t as String).contains('שולם ₪012')));
  chk(
      'R3 null-מפורש ב-reduce ⇒ 0 (0+null+250=250)',
      overTitles([
        {'amount': null},
        {'amount': 250}
      ], 100).any((t) => (t as String).contains('שולם ₪250')));
  chk(
      'R4 מפתח-חסר ב-reduce ⇒ undefined⇒NaN ⇒ אפס-ממצא',
      overTitles([
        {'foo': 1},
        {'amount': 250}
      ], 100).isEmpty);
  chk(
      'R5 "0b101" מחרוזתי ⇒ שרשור "00b101"⇒NaN ⇒ אפס-ממצא',
      overTitles([
        {'amount': '0b101'}
      ], 5).isEmpty);

  // תרומה: null-מפורש⇒'null' · מפתח-חסר⇒'undefined' (שרשור-property של JS)
  List donTitles(List dons) => runAudit({
        ...emptyDb,
        'supporters': [
          {'id': 'sR', 'name': 'ד', 'ils': 100, 'usd': 0, 'count': 1, 'donations': dons}
        ]
      }, '', true, null, deps)
          .where((x) => (x['title'] as String).contains('בסכום'))
          .map((x) => x['title'])
          .toList();
  chk('R6 תרומה amount:null ⇒ "בסכום null"',
      donTitles([{'amount': null, 'rid': 'RX'}]).any((t) => (t as String).contains('בסכום null ')));
  chk('R7 תרומה ללא-amount ⇒ "בסכום undefined"',
      donTitles([{'rid': 'RY'}]).any((t) => (t as String).contains('בסכום undefined ')));

  if (_f != 0) exit(1);
  print('✓ run-audit: 7 דוגמאות-חוזה + 7 ratchet (`+` פולימורפי · null↔undefined) — ירוק');
}
