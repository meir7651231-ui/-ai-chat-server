// בדיקת-חוזה (רתמת-זהב) · groupPaletteResults — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/group-palette-results.test.mjs.
// המרה: `section: undefined` של JS ⇒ ערך null עם מפתח 'section' קיים (containsKey === 'section' in g).
// הרצה: dart run --enable-asserts new/dart-maor/group-palette-results_test.dart  ⇒ exit 0
import 'group-palette-results.dart';

// השקעים החוזיים (מראה של paletteGroups.ts:23-45, בלי termOf — config לא מוגדר)
const BUCKETS = <List<String>>[
  ['nav-', 'ניווט ופעולות'],
  ['act-', 'ניווט ופעולות'],
  ['fam-', 'משפחות'],
];
List<List<String>> buckets(Object? _) => BUCKETS;
int bucketOf(Object? key) {
  final k = key as String;
  final i = BUCKETS.indexWhere((pair) => k.startsWith(pair[0]));
  return i < 0 ? BUCKETS.length : i;
}

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  // כל מקרה: [items, want, msg]. section של want = null ⇒ המקבילה ל-undefined.
  final cases = <List<Object?>>[
    [
      [{'key': 'fam-1'}, {'key': 'nav-a'}],
      [{'key': 'nav-a', 'section': 'ניווט ופעולות'}, {'key': 'fam-1', 'section': 'משפחות'}],
      'מיון-לדליים + כותרת על ראשון-בדלי',
    ],
    [
      [{'key': 'nav-a'}, {'key': 'act-b'}],
      [{'key': 'nav-a', 'section': 'ניווט ופעולות'}, {'key': 'act-b', 'section': null}],
      'כותרת משותפת nav-/act- לא מוכפלת',
    ],
    [
      [{'key': 'fam-b'}, {'key': 'fam-a'}],
      [{'key': 'fam-b', 'section': 'משפחות'}, {'key': 'fam-a', 'section': null}],
      'יציבות: סדר-הרלוונטיות נשמר בתוך הדלי',
    ],
    [
      [{'key': 'zzz'}, {'key': 'nav-a'}],
      [{'key': 'nav-a', 'section': 'ניווט ופעולות'}, {'key': 'zzz', 'section': null}],
      'לא-מזוהה ⇒ אחרון, בלי כותרת',
    ],
    [
      <Map<String, Object?>>[],
      <Map<String, Object?>>[],
      'ריק ⇒ []',
    ],
  ];

  var n = 0;
  for (final c in cases) {
    final items = (c[0] as List).cast<Map<String, Object?>>();
    final want = (c[1] as List).cast<Map<String, Object?>>();
    final msg = c[2] as String;
    final got = groupPaletteResults(items, null, buckets, bucketOf);

    _ok(got.length == want.length, '$msg — אורך ${got.length} ≠ ${want.length}');
    for (var i = 0; i < want.length; i++) {
      _ok(got[i]['key'] == want[i]['key'], "$msg — key[$i] ${got[i]['key']} ≠ ${want[i]['key']}");
      _ok(got[i]['section'] == want[i]['section'],
          "$msg — section[$i] ${got[i]['section']} ≠ ${want[i]['section']}");
      // 'section' in g === true — המפתח קיים תמיד (גם כשהערך null).
      _ok(got[i].containsKey('section'), "$msg — [$i] חסר מפתח section");
      n++;
    }
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(() {
    final g = groupPaletteResults([{'key': 'nav-a'}, {'key': 'act-b'}], null, buckets, bucketOf);
    return g[1]['section'] == null && g[1].containsKey('section');
  }(), 'assert-live guard');

  print('OK groupPaletteResults: $n asserts passed');
}
