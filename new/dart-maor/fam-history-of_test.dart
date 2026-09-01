import '../dart-data-maor/fam-history-of-sockets.dart' as sk_fam_history_of;
// 🥇 רתמת-זהב · famHistoryOf — אותם קלטים→פלטים בדיוק כמו new/atoms/fam-history-of.test.mjs.
// עובר ⇒ Dart ≡ JS (חוק-4). ריצה: dart run --enable-asserts fam-history-of_test.dart
import 'fam-history-of.dart';

// השקע האמיתי של termOf (מילון-הארגון או נסיגה) — כלשונו מבדיקת-ה-JS.
String termOf(dynamic cfg, dynamic key, dynamic fallback) {
  final v = (cfg as Map)['terms'] is Map ? (cfg['terms'] as Map)[key] : null;
  if (v is String) {
    final t = v.trim();
    if (t.isNotEmpty) return t;
  }
  return fallback as String;
}

// טביעת-רשומה לשם השוואה מלאה (date|tag|bg|c|text).
String rs(Map r) => '${r['date']}|${r['tag']}|${r['bg']}|${r['c']}|${r['text']}';

void main() {
  final emptyDb = {'events': [], 'enrollments': [], 'courses': []};
  final minFam = {
    'id': 'f1',
    'createdAt': '2026-01-05',
    'members': [],
    'docs': []
  };

  // 1) משפחה מינימלית — רשומת-הצטרפות יחידה
  final r1 = famHistoryOf(emptyDb, Map.of(minFam), {}, termOf, sk_fam_history_of.famHistoryOf_T);
  assert(r1.length == 1);
  assert(rs(r1[0]) == '2026-01-05|הצטרפות|#e7edf5|#3a5a86|המשפחה הצטרפה',
      'רשומת-ההצטרפות שגויה: ${rs(r1[0])}');

  // 2) מילון-הארגון
  final r2 = famHistoryOf(emptyDb, Map.of(minFam), {
    'terms': {'entity.family': 'לקוחה'}
  }, termOf, sk_fam_history_of.famHistoryOf_T);
  assert(r2[0]['text'] == 'הלקוחה הצטרפה', 'termOf לא הוחל על entity.family');

  // 3) אירוע-לוח — שלי נכנס (עם time+done), זר בחוץ, בלי-date נדלג
  final db3 = {
    'events': [
      {'famId': 'f1', 'date': '2026-02-01', 'title': 'ביקור-בית', 'time': '10:00', 'done': true},
      {'famId': 'f2', 'date': '2026-02-02', 'title': 'זר'},
      {'famId': 'f1', 'date': '', 'title': 'בלי-תאריך'},
    ],
    'enrollments': [],
    'courses': []
  };
  final r3 = famHistoryOf(db3, {...minFam, 'createdAt': ''}, {}, termOf, sk_fam_history_of.famHistoryOf_T);
  assert(
      r3.length == 1 &&
          r3[0]['tag'] == 'אירוע' &&
          r3[0]['text'] == 'ביקור-בית · 10:00 · ✓ בוצע',
      'אירוע-הלוח שגוי/דלף');

  // 4) לוג-אמינות — סימן + רק לחיובי
  final fam4 = {
    ...minFam,
    'createdAt': '',
    'cred': {
      'log': [
        {'date': '2026-04-01', 'reason': 'נוכחות', 'delta': 5},
        {'date': '2026-04-02', 'reason': 'No-Show', 'delta': -10},
      ]
    }
  };
  final r4 = famHistoryOf(emptyDb, fam4, {}, termOf, sk_fam_history_of.famHistoryOf_T);
  assert(
      r4.length == 2 &&
          r4[1]['tag'] == 'אמינות' &&
          r4[1]['text'] == 'נוכחות (+5 נק׳)',
      'לוג-אמינות חיובי שגוי');
  assert(r4[0]['text'] == 'No-Show (-10 נק׳)', 'דלתא שלילית קיבלה +');

  // 5) שיבוץ-wait + תשלום + No-Show
  final db5 = {
    'events': [],
    'courses': [
      {'id': 'c1', 'name': 'ציור'}
    ],
    'enrollments': [
      {
        'memberId': 'm1',
        'courseId': 'c1',
        'enrolledAt': '2026-03-01',
        'status': 'wait',
        'payments': [
          {'date': '2026-03-02', 'amount': 120, 'method': 'מזומן', 'rid': 'R-1'}
        ],
        'absences': [
          {'date': '2026-03-09', 'noshow': true}
        ],
      }
    ]
  };
  final fam5 = {
    'id': 'f1',
    'createdAt': '',
    'members': [
      {'id': 'm1', 'first': 'דנה'}
    ],
    'docs': []
  };
  final r5 = famHistoryOf(db5, fam5, {}, termOf, sk_fam_history_of.famHistoryOf_T);
  final r5pairs = r5.map((x) => '${x['tag']}|${x['text']}').toList();
  assert(
      r5pairs.length == 3 &&
          r5pairs[0] == 'No-Show|היעדרות — ציור' &&
          r5pairs[1] == 'תשלום|תשלום ₪120 (מזומן) — ציור · R-1' &&
          r5pairs[2] == 'שיבוץ|נרשמ/ה דנה לציור · ברשימת-המתנה',
      'שלישיית שיבוץ/תשלום/היעדרות שגויה: $r5pairs');

  // 5ב) בלי noshow ⇒ tag='היעדרות'
  final db5b = {
    'events': [],
    'courses': [
      {'id': 'c1', 'name': 'ציור'}
    ],
    'enrollments': [
      {
        'memberId': 'm1',
        'courseId': 'c1',
        'enrolledAt': '2026-03-01',
        'status': 'wait',
        'payments': [],
        'absences': [
          {'date': '2026-03-09', 'reason': 'מחלה', 'makeup': true}
        ],
      }
    ]
  };
  final r5b = famHistoryOf(db5b, fam5, {}, termOf, sk_fam_history_of.famHistoryOf_T);
  assert(
      r5b[0]['tag'] == 'היעדרות' &&
          r5b[0]['text'] == 'היעדרות — ציור · מחלה · זכאי/ת השלמה',
      'היעדרות-רגילה שגויה');

  // 6) מסמך
  final r6 = famHistoryOf(emptyDb, {
    ...minFam,
    'createdAt': '',
    'docs': [
      {'addedAt': '2026-05-01', 'name': 'ספח'}
    ]
  }, {}, termOf, sk_fam_history_of.famHistoryOf_T);
  assert(
      r6.length == 1 && r6[0]['tag'] == 'מסמך' && r6[0]['text'] == 'מסמך נוסף: ספח',
      'רשומת-המסמך שגויה');

  // 7) מיון יורד + קציצה ל-40
  final evs = List.generate(45, (i) {
    final n = (i + 1).toString().padLeft(2, '0');
    return {'famId': 'f1', 'date': '2026-06-$n', 'title': 'e${i + 1}'};
  });
  final r7 = famHistoryOf({'events': evs, 'enrollments': [], 'courses': []}, {...minFam, 'createdAt': ''}, {}, termOf, sk_fam_history_of.famHistoryOf_T);
  assert(r7.length == 40, 'הקציצה ל-40 נכשלה (אורך ${r7.length})');
  assert(r7[0]['date'] == '2026-06-45' && r7[39]['date'] == '2026-06-06',
      'המיון-היורד/הקצה שגויים');

  print('✓ fam-history-of (Dart): 7 דוגמאות-חוזה — ירוק');
}
