// רתמת-זהב · reassemble-donations — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS
// (new/atoms/reassemble-donations.test.mjs, אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// JSON.stringify-eq של מיפוי-rid ⇒ השוואת-רשימה; === על הפניה ⇒ identical().
// הרצה: dart run --enable-asserts new/dart-maor/reassemble-donations_test.dart ⇒ exit 0
import 'reassemble-donations.dart';

List<dynamic> _rids(Map<String, dynamic> out) =>
    [for (final d in out['donations'] as List) (d as Map)['rid']];

bool _listEq(List<dynamic> a, List<dynamic> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

void main() {
  // 1) סינון-זר + מיון-תאריך + החלפת donations + שימור-בסיס
  final base = <String, dynamic>{
    'id': 's1',
    'name': 'לוי',
    'hist': [
      {'note': 'ישן'},
    ],
    'donations': [
      {'rid': 'D-1', 'date': '2020-01-01', 'ils': 5},
    ],
  };
  final d7 = {'rid': 'D-7', 'date': '2026-03-01', 'ils': 200};
  final d3 = {'rid': 'D-3', 'date': '2026-01-15', 'ils': 100};
  final docs = <dynamic>[
    {'id': 'D-7', 'supporterId': 's1', 'pkey': '_shared_', 'donation': d7},
    {'id': 'D-3', 'supporterId': 's1', 'pkey': '_shared_', 'donation': d3},
    {
      'id': 'D-9',
      'supporterId': 's2',
      'pkey': '_shared_',
      'donation': {'rid': 'D-9', 'date': '2026-02-01', 'ils': 50},
    },
  ];
  final out = reassembleDonations(base, docs);
  assert(
    _listEq(_rids(out), ['D-3', 'D-7']),
    '✗ 1 מיון-תאריך [D-3,D-7], הזר סונן, D-1 הוחלף',
  );
  assert(
    out['name'] == 'לוי' && identical(out['hist'], base['hist']),
    '✗ 1 name ו-hist נשמרו',
  );

  // 2) שובר-שוויון rid — השוואת-מחרוזות ('1'<'9')
  final out2 = reassembleDonations(<String, dynamic>{'id': 's1'}, <dynamic>[
    {
      'id': 'a',
      'supporterId': 's1',
      'donation': {'rid': 'D-9', 'date': '2026-05-01'},
    },
    {
      'id': 'b',
      'supporterId': 's1',
      'donation': {'rid': 'D-12', 'date': '2026-05-01'},
    },
  ]);
  assert(
    _listEq(_rids(out2), ['D-12', 'D-9']),
    "✗ 2 אותו תאריך ⇒ ['D-12','D-9'] (מחרוזתי)",
  );

  // 3) docs ריק ⇒ donations=[]
  final out3 = reassembleDonations(base, <dynamic>[]);
  assert(
    out3['donations'] is List && (out3['donations'] as List).isEmpty,
    '✗ 3 docs=[] ⇒ donations=[]',
  );

  // 4) אי-מוטציה
  assert(
    !identical(out, base) &&
        (base['donations'] as List).length == 1 &&
        ((base['donations'] as List)[0] as Map)['rid'] == 'D-1',
    '✗ 4 תוצאה חדשה + base לא נגוע',
  );

  // 5) זהות-הפניה של התרומה
  final od = out['donations'] as List;
  assert(
    identical(od[0], d3) && identical(od[1], d7),
    '✗ 5 התרומה עוברת בזהות-הפניה',
  );

  // ignore: avoid_print
  print(
    '✓ reassemble-donations: 5 דוגמאות-חוזה (סינון+מיון-דטרמיניסטי+אי-מוטציה) — ירוק',
  );
}
