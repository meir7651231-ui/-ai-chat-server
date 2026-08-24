// בדיקת-חוזה (רתמת-זהב) · applyEntityPartial — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/apply-entity-partial.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/apply-entity-partial_test.dart ⇒ exit 0
import 'apply-entity-partial.dart';

int _f = 0;

void _ok(bool cond, String msg) {
  if (!cond) {
    _f = 1;
    print('✗ $msg');
  }
}

// השוואת-ערך תואמת JSON.stringify של ה-JS (סדר-מפתחות קובע).
void _eq(Object? a, Object? b, String msg) {
  _ok(_js(a) == _js(b), '$msg ⇒ ${_js(a)}');
}

String _js(Object? v) {
  if (v == null) return 'null';
  if (v is bool) return v ? 'true' : 'false';
  if (v is num) return v is int ? v.toString() : v.toString();
  if (v is String) return '"$v"';
  if (v is List) return '[${v.map(_js).join(',')}]';
  if (v is Map) {
    final parts = <String>[];
    v.forEach((k, val) => parts.add('"$k":${_js(val)}'));
    return '{${parts.join(',')}}';
  }
  return 'null';
}

// שקעים (זהים לבדיקת-ה-JS):
final List<String> COLS = ['families'];
Map<String, dynamic> idSan(String _c, Map<String, dynamic> item) => item;
Map<String, dynamic> cloudWins(
        String _c, Map<String, dynamic> _l, Map<String, dynamic> inc) =>
    inc;

void main() {
  // 1) אוסף לא-מוכר ⇒ no-op (אותה רפרנס)
  var db = <String, dynamic>{
    'families': [
      {'id': 'a', 'n': 1}
    ]
  };
  _ok(
      identical(
          applyEntityPartial(
              db,
              'ghosts',
              [
                {'id': 'x', 'data': <String, dynamic>{}, 'deleted': false}
              ],
              COLS,
              idSan,
              cloudWins),
          db),
      'אוסף לא-מוכר לא החזיר את אותו db');

  // 2) מסמך חדש ⇒ לראש-הרשימה, id מושתל
  db = {
    'families': [
      {'id': 'a', 'n': 1}
    ]
  };
  var out = applyEntityPartial(
      db,
      'families',
      [
        {'id': 'b', 'data': {'n': 2}, 'deleted': false}
      ],
      COLS,
      idSan,
      cloudWins);
  _eq(out['families'], [
    {'n': 2, 'id': 'b'},
    {'id': 'a', 'n': 1}
  ], 'חדש לא נכנס לראש');

  // 3) עדכון-במקומו ⇒ הסדר נשמר
  db = {
    'families': [
      {'id': 'a', 'n': 1},
      {'id': 'b', 'n': 2}
    ]
  };
  out = applyEntityPartial(
      db,
      'families',
      [
        {'id': 'b', 'data': {'n': 9}, 'deleted': false}
      ],
      COLS,
      idSan,
      cloudWins);
  _eq(out['families'], [
    {'id': 'a', 'n': 1},
    {'n': 9, 'id': 'b'}
  ], 'עדכון שבר את הסדר');

  // 4) deleted:true ⇒ יוצא
  db = {
    'families': [
      {'id': 'a', 'n': 1},
      {'id': 'b', 'n': 2}
    ]
  };
  out = applyEntityPartial(
      db,
      'families',
      [
        {'id': 'a', 'data': <String, dynamic>{}, 'deleted': true}
      ],
      COLS,
      idSan,
      cloudWins);
  _eq(out['families'], [
    {'id': 'b', 'n': 2}
  ], 'המחוק לא יצא');

  // 5) ביט-זהה ⇒ אותה רפרנס (data כולל id ⇒ סדר-המפתחות נשמר בהשוואת-ה-JSON)
  db = {
    'families': [
      {'id': 'a', 'n': 1}
    ]
  };
  _ok(
      identical(
          applyEntityPartial(
              db,
              'families',
              [
                {'id': 'a', 'data': {'id': 'a', 'n': 1}, 'deleted': false}
              ],
              COLS,
              idSan,
              cloudWins),
          db),
      'תוצאה ביט-זהה לא החזירה את אותו db');

  // 6) שקע-sanitize חל על כל נכנס
  db = {'families': <dynamic>[]};
  out = applyEntityPartial(
      db,
      'families',
      [
        {'id': 'c', 'data': {'n': 3}, 'deleted': false}
      ],
      COLS,
      (String _c, Map<String, dynamic> item) => {...item, 'tag': 'S'},
      cloudWins);
  _eq(out['families'], [
    {'n': 3, 'id': 'c', 'tag': 'S'}
  ], 'שקע-sanitize לא הופעל');

  // 7) שקע-merge קובע את העדכון-במקומו
  db = {
    'families': [
      {'id': 'a', 'n': 1}
    ]
  };
  out = applyEntityPartial(
      db,
      'families',
      [
        {'id': 'a', 'data': {'n': 9}, 'deleted': false}
      ],
      COLS,
      idSan,
      (String _c, Map<String, dynamic> _l, Map<String, dynamic> _i) =>
          {'id': 'a', 'n': 'M'});
  _eq(out['families'], [
    {'id': 'a', 'n': 'M'}
  ], 'תוצר-המיזוג לא נכנס');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_f == 0, 'apply-entity-partial contract examples must be green');

  if (_f != 0) {
    throw StateError('apply-entity-partial: דוגמאות-חוזה נכשלו');
  }
  print('✓ apply-entity-partial: 7 דוגמאות-חוזה — ירוק');
}
