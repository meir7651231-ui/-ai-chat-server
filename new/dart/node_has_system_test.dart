// בדיקת-חוזה · nodeHasSystem — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/node_has_system_test.dart
import 'node_has_system.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  // דאטה-מקור (system_division.dart:40) מוזרקת דרך השקע — לא צרובה במנוע.
  const fixtures = {'אסלות', 'מקלחות ואמבטיות', 'גופי תברואה'};
  const tally = {
    'צנרת': (sup: 5, dr: 2),
    'מרזבים': (sup: 0, dr: 7),
    'ברזים': (sup: 3, dr: 3),
  };
  Map<String, bool> fresh() => <String, bool>{};

  bool run(CatalogNode node, WaterSystem sys, {Map<String, bool>? cache}) =>
      nodeHasSystem(node, sys,
          fixtureTitles: fixtures,
          catSystemTally: tally,
          cache: cache ?? fresh());

  // 1-2: קבועה (fixture) ⇒ true בשתי המערכות, גם בלי שום דאטה.
  const fixture = CatalogNode(id: 'f1', title: 'אסלות');
  _eq(run(fixture, WaterSystem.drainage), true, '1 fixture drainage'); n++;
  _eq(run(fixture, WaterSystem.supply), true, '2 fixture supply'); n++;

  // 3-4: עלה 'צנרת' (5,2) ⇒ דומיננטית supply.
  const pipes = CatalogNode(id: 'l-pipes', title: 'צנרת-עלה', lipskeyCategory: 'צנרת');
  _eq(run(pipes, WaterSystem.supply), true, '3 pipes supply'); n++;
  _eq(run(pipes, WaterSystem.drainage), false, '4 pipes drainage'); n++;

  // 5-6: עלה 'מרזבים' (0,7) ⇒ דומיננטית drainage.
  const gutters = CatalogNode(id: 'l-gut', title: 'מרזבים-עלה', lipskeyCategory: 'מרזבים');
  _eq(run(gutters, WaterSystem.drainage), true, '5 gutters drainage'); n++;
  _eq(run(gutters, WaterSystem.supply), false, '6 gutters supply'); n++;

  // 7-8: תיקו (3,3) ⇒ supply מנצחת (`>=` במקור, שורה 93).
  const taps = CatalogNode(id: 'l-taps', title: 'ברזים-עלה', lipskeyCategory: 'ברזים');
  _eq(run(taps, WaterSystem.supply), true, '7 tie -> supply'); n++;
  _eq(run(taps, WaterSystem.drainage), false, '8 tie not drainage'); n++;

  // 9: עלה בלי קטגוריה ⇒ אפס-נתונים ⇒ false לשתיהן.
  const bare = CatalogNode(id: 'l-bare', title: 'ריק');
  _eq(run(bare, WaterSystem.supply), false, '9a no-cat supply'); n++;
  _eq(run(bare, WaterSystem.drainage), false, '9b no-cat drainage'); n++;

  // 10: קטגוריה שאינה ב-tally ⇒ מדולגת ⇒ false.
  const unknown = CatalogNode(id: 'l-unk', title: 'זר', lipskeyCategory: 'לא-קיים');
  _eq(run(unknown, WaterSystem.supply), false, '10 missing tally'); n++;

  // 11-12: הורה סוכם תת-עץ: צנרת(5,2)+מרזבים(0,7) ⇒ sup=5,dr=9 ⇒ drainage.
  const parent = CatalogNode(id: 'p1', title: 'הורה', children: [pipes, gutters]);
  _eq(run(parent, WaterSystem.drainage), true, '11 parent drainage'); n++;
  _eq(run(parent, WaterSystem.supply), false, '12 parent supply'); n++;

  // 11b: עומק — נכד דרך שתי רמות; עלה-חסר-tally באמצע לא מפריע.
  const deep = CatalogNode(id: 'root', title: 'שורש', children: [
    CatalogNode(id: 'mid', title: 'אמצע', children: [gutters, unknown]),
  ]);
  _eq(run(deep, WaterSystem.drainage), true, '11b grandchild drainage'); n++;

  // 13: memo קדום גובר על החישוב (מפתח '${id}|${system.name}').
  final seeded = <String, bool>{'l-bare|supply': true};
  _eq(run(bare, WaterSystem.supply, cache: seeded), true, '13 cache wins'); n++;

  // 14: התוצאה נכתבת ל-cache תחת המפתח הנכון.
  final c = fresh();
  _eq(run(pipes, WaterSystem.supply, cache: c), true, '14a computed'); n++;
  _eq(c['l-pipes|supply'] == true, true, '14b cache written'); n++;

  // 15: קבועה אינה נכתבת ל-cache (short-circuit לפני המפתח, שורה 71).
  final c2 = fresh();
  run(fixture, WaterSystem.supply, cache: c2);
  _eq(c2.isEmpty, true, '15 fixture not cached'); n++;

  assert(run(pipes, WaterSystem.drainage) == false, 'assert-live guard');
  print('OK nodeHasSystem: $n asserts passed');
}
