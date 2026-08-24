// רתמת-זהב · diff-db — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS. JSON.stringify של JS ⇒ jsonEncode (dart:convert, ספריית-שפה).
// השקעים = מימושי-המקור בזעיר-אנפין (זהים ל-diff-db.test.mjs).
import 'dart:convert';
import 'diff-db.dart';

void main() {
  final entityCollections = <String>['families', 'rooms'];
  final metaKeys = <String>['orgName', 'seq'];
  // sameJson: === או JSON.stringify זהה ⇒ == או jsonEncode זהה.
  bool sameJson(dynamic a, dynamic b) =>
      a == b || jsonEncode(a) == jsonEncode(b);
  Map<String, dynamic> metaOf(Map<String, dynamic> db) =>
      {'orgName': db['orgName'], 'seq': db['seq'], 'savedAt': db['savedAt']};
  Map<String, dynamic> run(Map<String, dynamic> p, Map<String, dynamic> n) =>
      diffDb(p, n, entityCollections, metaKeys, sameJson, metaOf);

  final rooms = <Map<String, dynamic>>[
    {'id': 'r1', 'cap': 10}
  ];
  final prev = <String, dynamic>{
    'families': [
      {'id': 'f1', 'name': 'כהן'},
      {'id': 'f2', 'name': 'לוי'}
    ],
    'rooms': rooms,
    'orgName': 'מאור',
    'seq': 5,
    'savedAt': 't1',
  };
  final next = <String, dynamic>{
    'families': [
      {'id': 'f1', 'name': 'כהן-לוי'},
      {'id': 'f3', 'name': 'ברק'}
    ],
    'rooms': prev['rooms'], // אותה רפרנס — דילוג-identical
    'orgName': 'מאור',
    'seq': 6,
    'savedAt': 't2',
  };
  final d = run(prev, next);

  // 1) sets: שינוי + חדש; rooms מדולג
  final sets = d['sets'] as List;
  final deletes = d['deletes'] as List;
  assert(sets.length == 2, '✗ 1: sets.length ≠ 2');
  assert(
      jsonEncode(sets[0]) ==
          jsonEncode({
            'col': 'families',
            'id': 'f1',
            'data': {'id': 'f1', 'name': 'כהן-לוי'}
          }),
      '✗ 1: set-השינוי שגוי');
  assert(
      jsonEncode(sets[1]) ==
          jsonEncode({
            'col': 'families',
            'id': 'f3',
            'data': {'id': 'f3', 'name': 'ברק'}
          }),
      '✗ 1: set-החדש שגוי');
  assert(
      !sets.any((s) => (s as Map)['col'] == 'rooms') &&
          !deletes.any((x) => (x as Map)['col'] == 'rooms'),
      '✗ 1: rooms לא דולג');

  // 2) deletes: f2 נעלמה
  assert(
      deletes.length == 1 &&
          (deletes[0] as Map)['col'] == 'families' &&
          (deletes[0] as Map)['id'] == 'f2',
      '✗ 2: deletes שגוי');

  // 3) meta: seq השתנה ⇒ המסמך המלא
  assert(
      jsonEncode(d['meta']) ==
          jsonEncode({'orgName': 'מאור', 'seq': 6, 'savedAt': 't2'}),
      '✗ 3: meta שגוי');

  // 4) אותו DB ⇒ diff ריק
  final same = run(prev, prev);
  assert(
      (same['sets'] as List).isEmpty &&
          (same['deletes'] as List).isEmpty &&
          same['meta'] == null,
      '✗ 4: diff לא ריק על אותו DB');

  // 5) עותק-עמוק שווה-ערך (רק savedAt שונה — מחוץ ל-metaKeys) ⇒ אפס-רעש
  final copy = <String, dynamic>{
    ...prev,
    'families': (prev['families'] as List)
        .map((x) => {...(x as Map)})
        .toList(),
    'rooms': (prev['rooms'] as List).map((x) => {...(x as Map)}).toList(),
    'savedAt': 't9',
  };
  final d5 = run(prev, copy);
  assert(
      (d5['sets'] as List).isEmpty &&
          (d5['deletes'] as List).isEmpty &&
          d5['meta'] == null,
      '✗ 5: עותק שווה-ערך הפיק רעש');

  print('✓ diff-db (Dart): 5 דוגמאות-חוזה — ירוק');
}
