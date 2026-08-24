// בדיקת-חוזה (רתמת-זהב) · ayinDailyRows — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/ayin-daily-rows.test.mjs:
//   אורך=4 (לא-נגע-היום + בלי-ayin מדולגים) · כותרות · שורת-דוד (log-היום 3+2=5) ·
//   שורת-לאה (ayin חלקי — eyesTotal+answers) · שורת-נח (חלקי לגמרי — eyesTotal=0 ⇒ '').
// מימושי-השקע נאמנים למקור (ayin.ts / domain.ts). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/ayin-daily-rows_test.dart  ⇒ exit 0
import 'ayin-daily-rows.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

bool _listEq(List<Object?> a, List<Object?> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

void main() {
  var n = 0;

  // מימושי-שקע לבדיקה — נאמנים למקור (ayin.ts / domain.ts):
  String unitLabel(Object? cfg) => 'כמות';
  String itemLabel(Object? cfg) => 'שם לטיפול';
  Map<dynamic, dynamic> emptyAyin() => {
        'stage': 'new',
        'note': '',
        'answeredNote': '',
        'answerPushed': false,
        'nextTalk': '',
        'nextTalkTime': '',
        'lastTouch': '',
        'names': [],
        'answers': [],
        'log': [],
        'time': [],
        'mat': [],
      };
  num eyesTotal(Map<dynamic, dynamic> a) {
    num t = 0;
    for (final xDyn in (a['names'] as List)) {
      final x = xDyn as Map;
      final e = x['eyes'];
      if (e is num) {
        t += e.isNaN ? 0 : e;
      } else if (e is String) {
        t += num.tryParse(e.trim()) ?? 0;
      } else if (e is bool) {
        t += e ? 1 : 0;
      }
    }
    return t;
  }

  const fallback = {
    'new': 'חדש',
    'lead': 'בהכנה',
    'eyes': 'רישום',
    'answer': 'מסירה',
    'done': 'הושלם',
  };
  String stageLabel(Object? cfg, Object? st) => fallback[st] as String;

  const today = '2026-08-24';
  final supporters = [
    {
      'name': 'דוד',
      'phone': '050',
      'ayin': {
        'stage': 'eyes',
        'lastTouch': '2026-08-20',
        'log': [
          {'date': '2026-08-24', 'eyes': '3'},
          {'date': '2026-08-24', 'eyes': 2},
          {'date': '2026-08-23', 'eyes': 9},
        ],
        'names': [
          {'name': 'משה', 'eyes': 4, 'done': true},
          {'name': 'רות', 'eyes': ''},
        ],
        'answers': [],
        'note': 'הערה כללית',
        'nextTalk': '2026-09-01',
      },
    },
    {
      'name': 'לאה',
      'ayin': {
        'stage': 'new',
        'lastTouch': '2026-08-24',
        'names': [
          {'name': 'יעל', 'eyes': 2},
        ],
        'answers': [
          {'note': 'א'},
          {'note': 'ב'},
        ],
      },
    }, // חלקי — בלי log
    {
      'name': 'נח',
      'ayin': {'stage': 'lead', 'lastTouch': '2026-08-24'},
    }, // חלקי לגמרי
    {
      'name': 'גד',
      'ayin': {'stage': 'eyes', 'lastTouch': '2026-08-20'},
    }, // לא-נגע היום
    {'name': 'בלי-ayin'},
  ];

  final rows = ayinDailyRows(
    {},
    supporters,
    today,
    unitLabel,
    itemLabel,
    emptyAyin,
    eyesTotal,
    stageLabel,
  );

  _ok(rows.length == 4,
      'אורך ${rows.length} ≠ 4 (לא-נגע-היום + בלי-ayin לא-בדוח)');
  n++;
  _ok(
      _listEq(rows[0], [
        'שם',
        'טלפון',
        'כמות היום',
        'שלב',
        'שם לטיפול',
        'מתי לדבר שוב',
        'הערה'
      ]),
      'כותרות');
  n++;
  _ok(
      _listEq(rows[1],
          ['דוד', '050', 5, 'רישום', 'משה ·4 ✓ · רות', '01/09/2026', 'הערה כללית']),
      'שורת דוד (log-היום 3+2)');
  n++;
  _ok(_listEq(rows[2], ['לאה', '', 2, 'חדש', 'יעל ·2', '', 'א | ב']),
      'שורת לאה (ayin חלקי — eyesTotal + answers)');
  n++;
  _ok(_listEq(rows[3], ['נח', '', '', 'בהכנה', '', '', '']),
      "שורת נח (חלקי לגמרי — eyesTotal=0 ⇒ '')");
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(rows.length == 4, 'assert-live guard');

  print('OK ayinDailyRows: $n asserts passed');
}
