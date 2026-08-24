// 🥇 רתמת-זהב · distributionListLines — Dart ≡ JS.
// ה-assert-ים הם *בדיוק* דוגמאות-החוזה של new/atoms/distribution-list-lines.test.mjs
// (אותם קלטים → אותם פלטים), מומרים ל-Dart. עובר ⇒ הפורט זהה-התנהגות למקור.
// הרצה: dart run --enable-asserts distribution-list-lines_test.dart  (חייב exit 0)

import 'distribution-list-lines.dart';

// שקעים המדמים את שכני-המקור (כמו בבדיקת-ה-JS):
// itemOf פותר רכיב לפריט-קטלוג; beneficiaryLabel = שם-המשפחה.
Map<String, dynamic> itemOf(Map<String, dynamic> db, dynamic c) {
  final items = (db['shopItems'] as List).cast<Map<String, dynamic>>();
  for (final i in items) {
    if (i['id'] == c['itemId']) return i;
  }
  return {'name': ''};
}

String beneficiaryLabel(Map<String, dynamic> db, dynamic a, Object? config) {
  final fams = (db['families'] as List).cast<Map<String, dynamic>>();
  for (final f in fams) {
    if (f['id'] == a['famId']) return (f['name'] as String?) ?? '';
  }
  return '';
}

final db = <String, dynamic>{
  'shopProducts': [
    {
      'id': 'p1',
      'name': 'סל חג',
      'components': [
        {'itemId': 'i1'},
        {'itemId': 'i2'},
      ],
    },
  ],
  'shopItems': [
    {'id': 'i1', 'name': 'עוף'},
    {'id': 'i2', 'name': 'יין'},
  ],
  'families': [
    {'id': 'f1', 'name': 'כהן', 'address': 'הרצל 3', 'city': 'צפת', 'phone': '050-1'},
    {'id': 'f2', 'name': 'לוי', 'address': '', 'city': '', 'phone': ''},
  ],
  'shopAssignments': [
    {'id': 'a1', 'productId': 'p1', 'famId': 'f1', 'status': 'active'},
    {'id': 'a2', 'productId': 'p1', 'famId': 'f2', 'status': 'active'},
    {'id': 'a3', 'productId': 'p1', 'famId': 'f1', 'status': 'redeemed'},
    {'id': 'a4', 'productId': 'p2', 'famId': 'f1', 'status': 'active'},
  ],
};

void eq(String name, List<String> got, List<String> want) {
  if (got.length != want.length) {
    throw StateError('✗ $name: length ${got.length} ≠ ${want.length}\n  got=$got\n want=$want');
  }
  for (var i = 0; i < got.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('✗ $name[$i]: "${got[i]}" ≠ "${want[i]}"');
    }
  }
}

void main() {
  // דוגמאות 1+2 — חבילה עם 2 שיוכים active (ה-redeemed לא נספר; ריקים מסוננים)
  eq('p1', distributionListLines(db, 'p1', null, itemOf, beneficiaryLabel), [
    'רשימת חלוקה — סל חג',
    '=' * 30,
    'כהן · הרצל 3, צפת · 050-1 · עוף + יין · ☐ נמסר',
    'לוי · עוף + יין · ☐ נמסר',
  ]);

  // דוגמה 3 — חבילה לא-קיימת ובלי שיוכים
  eq('p3', distributionListLines(db, 'p3', null, itemOf, beneficiaryLabel), [
    'רשימת חלוקה — ',
    '=' * 30,
    'אין שיוכים פעילים לחבילה',
  ]);

  // דוגמה 4 — שיוך active לחבילה שאינה בקטלוג ⇒ בלי שם-חבילה ובלי רכיבים
  eq('p2', distributionListLines(db, 'p2', null, itemOf, beneficiaryLabel), [
    'רשימת חלוקה — ',
    '=' * 30,
    'כהן · הרצל 3, צפת · 050-1 · ☐ נמסר',
  ]);

  print('✓ distribution-list-lines (Dart): 4 דוגמאות-חוזה — ירוק');
}
