// בדיקת-חוזה (רתמת-זהב) · upcomingMeetings — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/upcoming-meetings.test.mjs:
//   1) סינון kind/done/טווח ⇒ בדיוק ['e1','e2']    2) מיון בתוך-יום — בלי-שעה לסוף (99:99)
//   3) who משיבוץ + השקע נקרא עם (db, השיבוץ, config) — זהות-רפרנס (===⇒identical)
//   4) who בנפילה — שיבוץ לא-קיים ⇒ ev.title        5) roomName: קיים / לא-קיים / בלי roomId
//   6) פגישת-אתמול לא מוחזרת (date >= todayIso)
// מערכים = אורך + איבר-איבר (חוק-8), לא join. כישלון ⇒ StateError.
// הרצה: dart run --enable-asserts new/dart-maor/upcoming-meetings_test.dart ⇒ exit 0
import 'upcoming-meetings.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// השוואת-מערך: אורך + איבר-איבר (חוק-8).
void _eqList(List a, List b, String msg) {
  _ok(a.length == b.length, '$msg — אורך ${a.length} ≠ ${b.length}');
  for (var i = 0; i < a.length; i++) {
    _ok(a[i] == b[i], '$msg — איבר $i: ${a[i]} ≠ ${b[i]}');
  }
}

String _pad2(int n) => n.toString().padLeft(2, '0');
// getFullYear/getMonth()+1/getDate של ה-JS ⇒ year/month/day (חד-אינדקס ב-Dart).
String _isoOf(DateTime d) => '${d.year}-${_pad2(d.month)}-${_pad2(d.day)}';
Object? _beneficiaryLabel(
        Map<String, Object?> db, Map<String, Object?> a, Map<String, Object?>? c) =>
    'מוטב:${a['familyId']}';

const _today = '2026-08-24';
Map<String, Object?> _mk(Map<String, Object?> over) => {
      'kind': 'meeting',
      'done': false,
      'date': _today,
      'title': 'ללא שיבוץ',
      ...over,
    };
Map<String, Object?> _db0() =>
    {'shopEvents': <Object?>[], 'shopAssignments': <Object?>[], 'rooms': <Object?>[]};

void main() {
  var n = 0;

  // 1) סינון: kind/done/טווח
  {
    final db = _db0()
      ..['shopEvents'] = [
        _mk({'id': 'e1'}), //                                היום — נכלל
        _mk({'id': 'e2', 'date': '2026-08-25'}), //          מחר — נכלל
        _mk({'id': 'e3', 'date': '2026-08-26'}), //          מחרתיים — מחוץ לטווח
        _mk({'id': 'e4', 'done': true}), //                  סגור — מוחרג
        _mk({'id': 'e5', 'kind': 'delivery'}), //            לא פגישה — מוחרג
      ];
    final out = upcomingMeetings(db, _today, 2, null, _isoOf, _beneficiaryLabel);
    _eqList(out.map((o) => (o['ev'] as Map)['id']).toList(), ['e1', 'e2'],
        'דוגמה 1: סינון');
    n++;
  }

  // 2) מיון בתוך יום — בלי-שעה לסוף (99:99)
  {
    final db = _db0()
      ..['shopEvents'] = [
        _mk({'id': 'late', 'time': '14:00'}),
        _mk({'id': 'none'}),
        _mk({'id': 'early', 'time': '09:00'}),
      ];
    final out = upcomingMeetings(db, _today, 2, null, _isoOf, _beneficiaryLabel);
    _eqList(out.map((o) => (o['ev'] as Map)['id']).toList(),
        ['early', 'late', 'none'], 'דוגמה 2: מיון');
    n++;
  }

  // 3) who משיבוץ — השקע נקרא עם (db, השיבוץ, config); זהות-רפרנס כמו === ב-JS.
  {
    final cfg = <String, Object?>{'tag': 'cfg'};
    List<Object?>? got;
    final db = _db0()
      ..['shopAssignments'] = [
        <String, Object?>{'id': 'as1', 'familyId': 'f7'}
      ]
      ..['shopEvents'] = [
        _mk({'id': 'e1', 'assignmentId': 'as1'})
      ];
    final out = upcomingMeetings(db, _today, 2, cfg, _isoOf, (d, a, c) {
      got = [d, a, c];
      return 'מוטב:${a['familyId']}';
    });
    _ok(out[0]['who'] == 'מוטב:f7', "דוגמה 3: who ≠ 'מוטב:f7'");
    _ok(
        got != null &&
            identical(got![0], db) &&
            identical(got![1], (db['shopAssignments'] as List)[0]) &&
            identical(got![2], cfg),
        'דוגמה 3: קריאת-השקע שגויה');
    n++;
  }

  // 4) who בנפילה — שיבוץ לא-קיים ⇒ ev.title
  {
    final db = _db0()
      ..['shopEvents'] = [
        _mk({'id': 'e1', 'assignmentId': 'missing', 'title': 'פגישת ייעוץ'})
      ];
    final out = upcomingMeetings(db, _today, 2, null, _isoOf, _beneficiaryLabel);
    _ok(out[0]['who'] == 'פגישת ייעוץ', 'דוגמה 4: נפילה ל-title');
    n++;
  }

  // 5) roomName: קיים / לא-קיים / בלי roomId
  {
    final db = _db0()
      ..['rooms'] = [
        <String, Object?>{'id': 'r1', 'name': 'חדר הדרכה'}
      ]
      ..['shopEvents'] = [
        _mk({'id': 'a', 'time': '09:00', 'roomId': 'r1'}),
        _mk({'id': 'b', 'time': '10:00', 'roomId': 'rX'}),
        _mk({'id': 'c', 'time': '11:00'}),
      ];
    final out = upcomingMeetings(db, _today, 2, null, _isoOf, _beneficiaryLabel);
    _eqList(out.map((o) => o['roomName']).toList(), ['חדר הדרכה', '', ''],
        'דוגמה 5: roomName');
    n++;
  }

  // 6) פגישת-אתמול לא מוחזרת
  {
    final db = _db0()
      ..['shopEvents'] = [
        _mk({'id': 'old', 'date': '2026-08-23'})
      ];
    final out = upcomingMeetings(db, _today, 2, null, _isoOf, _beneficiaryLabel);
    _ok(out.isEmpty, 'דוגמה 6: אתמול מוחרג — הוחזרו ${out.length}');
    n++;
  }

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      upcomingMeetings(_db0(), _today, 2, null, _isoOf, _beneficiaryLabel).isEmpty,
      'assert-live guard');

  print('OK upcomingMeetings: $n דוגמאות-חוזה — ירוק');
}
