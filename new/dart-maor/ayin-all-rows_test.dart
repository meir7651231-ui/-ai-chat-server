import '../dart-data-maor/ayin-all-rows-terms.dart' as td_ayin_all_rows;
// בדיקת-חוזה (רתמת-זהב) · ayinAllRows — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/ayin-all-rows.test.mjs:
//   אורך=4 (שם-רווחים + בלי-ayin מדולגים) · כותרות · שורת-משה · eyes:''⇒'' · eyes:0 נשמר.
// מימושי-השקע נאמנים למקור (ayin.ts / domain.ts). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/ayin-all-rows_test.dart  ⇒ exit 0
import 'ayin-all-rows.dart';

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
  const fallback = {
    'new': 'חדש',
    'lead': 'בהכנה',
    'eyes': 'רישום',
    'answer': 'מסירה',
    'done': 'הושלם',
  };
  String stageLabel(Object? cfg, Object? st) => fallback[st] as String;

  final supporters = [
    {
      'name': 'דוד',
      'phone': '050',
      'ayin': {
        'stage': 'eyes',
        'names': [
          {'name': 'משה', 'eyes': 3, 'note': 'דחוף', 'done': true},
          {'name': '  ', 'eyes': 5},
          {'name': 'רות', 'eyes': ''},
          {'name': 'חנה', 'eyes': 0},
        ],
      },
    },
    {'name': 'בלי-ayin'},
  ];

  final rows = ayinAllRows({}, supporters, unitLabel, emptyAyin, stageLabel, term: (k)=>td_ayin_all_rows.kTerms[k]!);

  _ok(rows.length == 4,
      'אורך ${rows.length} ≠ 4 (שם-רווחים + בלי-ayin מדולגים)'); n++;
  _ok(_listEq(rows[0],
      ['תורם/ת', 'טלפון', 'שם', 'כמות', 'הערה', 'סטטוס', 'שלב']),
      'כותרות'); n++;
  _ok(_listEq(rows[1], ['דוד', '050', 'משה', 3, 'דחוף', 'טופל ✓', 'רישום']),
      'שורת משה'); n++;
  _ok(_listEq(rows[2], ['דוד', '050', 'רות', '', '', 'ממתין', 'רישום']),
      "eyes:'' ⇒ ''"); n++;
  _ok(_listEq(rows[3], ['דוד', '050', 'חנה', 0, '', 'ממתין', 'רישום']),
      'eyes:0 נשמר'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(rows.length == 4, 'assert-live guard');

  print('OK ayinAllRows: $n asserts passed');
}
