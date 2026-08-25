// בדיקת-חוזה (רתמת-זהב) · entityCollections — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/entity-collections.test.mjs:
// הבדיקה שם היא צילום-ערך — JSON.stringify(ENTITY_COLLECTIONS) === הצילום המלא
// (23 שמות, בסדר מדויק). כאן מוכיחים את אותו הצילום איבר-איבר (חוק-8: לא join).
//   1) length === 23
//   2) [0] === 'families' · [22] === 'warehouse'
//   3) המערך המלא איבר-איבר === הצילום מ-.test.mjs
//   4) new Set(M).size === M.length  (אין כפילות)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/entity-collections_test.dart  ⇒ exit 0
import 'entity-collections.dart';

void main() {
  var n = 0;
  final m = entityCollections;

  // הצילום המלא — זהה ביט-אחר-ביט למחרוזת-הצילום שבבדיקת-ה-JS.
  const want = [
    'families',
    'courses',
    'enrollments',
    'events',
    'rooms',
    'teachers',
    'supporters',
    'tzCoordinators',
    'tzBoxes',
    'tzCampaigns',
    'tzEvents',
    'shopItems',
    'shopProducts',
    'shopStores',
    'shopCriteria',
    'shopAssignments',
    'shopEvents',
    'shopIntakes',
    'volunteers',
    'distributionDays',
    'deliveries',
    'tasks',
    'warehouse',
  ];

  // 1) אורך 23.
  assert(m.length == 23, 'FAIL: אורך ${m.length} ≠ 23');
  n++;

  // 2) גבולות — [0] ו-[22].
  assert(m[0] == 'families', "FAIL: [0] ≠ 'families'");
  n++;
  assert(m[22] == 'warehouse', "FAIL: [22] ≠ 'warehouse'");
  n++;

  // 3) איבר-איבר מול הצילום (חוק-8: גבול-איבר, לא join).
  assert(m.length == want.length, 'FAIL: אורך המערך המלא');
  for (var i = 0; i < want.length; i++) {
    assert(m[i] == want[i], "FAIL: [$i] '${m[i]}' ≠ '${want[i]}'");
  }
  n++;

  // 4) אין כפילות (Set.size === length).
  assert(m.toSet().length == m.length, 'FAIL: כפילות ברשימה');
  n++;

  print('OK entityCollections: $n asserts passed');
}
