// בדיקת-חוזה (רתמת-זהב) · ayinBoardItems — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/ayin-board-items.test.mjs:
//   supporters=[ {id:s1,name:דוד,phone:050, ayin:{stage:lead, names:[
//       {name:משה,eyes:'7',note:x,done:1}, {name:'',eyes:2}, {name:רות} ]}},
//     {id:s2,name:בלי-ayin} ]
//   ⇒ אורך=2 (שם-ריק + בלי-ayin מדולגים)
//   ⇒ [0] = {s1,דוד,050, name:משה, eyes:7 (מספר), note:x, done:true, stage:lead}
//   ⇒ [1] = {s1,דוד,050, name:רות, eyes:'' (undefined⇒''), note:'', done:false, stage:lead}
// המרה: JSON.stringify-שוויון של JS ⇒ השוואת-Map שטוחה ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/ayin-board-items_test.dart  ⇒ exit 0
import 'ayin-board-items.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

bool _mapEq(Map a, Map b) {
  if (a.length != b.length) return false;
  for (final k in a.keys) {
    if (!b.containsKey(k)) return false;
    if (a[k] != b[k]) return false;
  }
  return true;
}

// מימוש-שקע לבדיקה — נאמן למקור (domain.ts emptyAyin):
Map<String, Object?> emptyAyin() => {
      'stage': 'new',
      'note': '',
      'answeredNote': '',
      'answerPushed': false,
      'nextTalk': '',
      'nextTalkTime': '',
      'lastTouch': '',
      'names': <Object?>[],
      'answers': <Object?>[],
      'log': <Object?>[],
      'time': <Object?>[],
      'mat': <Object?>[],
    };

void main() {
  var n = 0;

  final supporters = <Object?>[
    {
      'id': 's1',
      'name': 'דוד',
      'phone': '050',
      'ayin': {
        'stage': 'lead',
        'names': [
          {'name': 'משה', 'eyes': '7', 'note': 'x', 'done': 1},
          {'name': '', 'eyes': 2},
          {'name': 'רות'},
        ],
      },
    },
    {'id': 's2', 'name': 'בלי-ayin'},
  ];

  final out = ayinBoardItems(supporters, emptyAyin);

  // אורך=2 — שם-ריק ('') ותומך בלי-ayin (s2) מדולגים.
  _ok(out.length == 2, 'אורך ${out.length} ≠ 2 (שם-ריק + בלי-ayin מדולגים)'); n++;

  // [0] פריט משה — שוויון-Map מלא.
  _ok(
      _mapEq(out[0], {
        'supporterId': 's1',
        'supporter': 'דוד',
        'phone': '050',
        'name': 'משה',
        'eyes': 7,
        'note': 'x',
        'done': true,
        'stage': 'lead',
      }),
      'פריט משה'); n++;

  // eyes:'7' ⇒ 7 מספר (num).
  _ok(out[0]['eyes'] == 7 && out[0]['eyes'] is num, "eyes:'7' ⇒ 7 מספר"); n++;

  // done:1 ⇒ true.
  _ok(out[0]['done'] == true, 'done:1 ⇒ true'); n++;

  // [1] פריט רות — שם ללא eyes/note/done: ברירות-מחדל ריקות.
  _ok(
      _mapEq(out[1], {
        'supporterId': 's1',
        'supporter': 'דוד',
        'phone': '050',
        'name': 'רות',
        'eyes': '',
        'note': '',
        'done': false,
        'stage': 'lead',
      }),
      'פריט רות'); n++;

  // eyes:undefined ⇒ '' (מחרוזת ריקה, לא null/0).
  _ok(out[1]['eyes'] == '', "eyes:undefined ⇒ ''"); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(out.length == 2, 'assert-live guard');

  print('OK ayinBoardItems: $n asserts passed');
}
