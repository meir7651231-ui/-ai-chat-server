// 🧪 בדיקת-חוזה · smartKeyToId — מוכיחה את דוגמאות-החוזה עצמן (חוק-4).
// מייבאת אך ורק את האטום-שלה. הרצה: dart run --enable-asserts smart_key_to_id_test.dart
import 'smart_key_to_id.dart';

/// סכימת-המקור: _categoryId(key) = '$kPlumbingTradeId.cat.$key' (‏:32, trade='plumbing').
String plumbingCatId(String k) => 'plumbing.cat.$k';

void main() {
  // 1 — ids/keys אמיתיים: תת-עץ drainage.traps מ-catalog_tree.dart:44-72.
  {
    const tree = [
      CatalogNode(id: 'drainage', children: [
        CatalogNode(id: 'drainage.traps', children: [
          CatalogNode(id: 'drainage.traps.floor', smartKey: 'floorDrain'),
          CatalogNode(id: 'drainage.traps.visible', smartKey: 'visibleTrap'),
          CatalogNode(id: 'drainage.traps.manifold', smartKey: 'drainageManifold'),
        ]),
      ]),
    ];
    final map = smartKeyToId(tree,
        categoryIdOf: plumbingCatId, cache: SmartKeyToIdCache());
    assert(map['floorDrain'] == 'plumbing.cat.drainage.traps.floor',
        '1: floorDrain חייב למפות למזהה-הקטגוריה של הצומת שלו');
    assert(map['visibleTrap'] == 'plumbing.cat.drainage.traps.visible',
        '1: visibleTrap חייב למפות לצומת שלו');
  }

  // 2 — צומת בלי smartKey לא תורם, אבל ילדיו נסרקים (drainage.collectors:76-100).
  {
    const tree = [
      CatalogNode(id: 'drainage.collectors', children: [
        CatalogNode(id: 'drainage.collectors.roof', smartKey: 'roofCollector'),
        CatalogNode(id: 'drainage.collectors.floor'), // lipskey-בלבד במקור
      ]),
    ];
    final map = smartKeyToId(tree,
        categoryIdOf: plumbingCatId, cache: SmartKeyToIdCache());
    assert(map['roofCollector'] == 'plumbing.cat.drainage.collectors.roof',
        '2: ילד-עם-smartKey מתחת להורה-בלי חייב להיסרק');
    assert(map.length == 1, '2: צמתים בלי smartKey לא תורמים רשומות');
  }

  // 3 — כפילות-מפתח: הכתיבה האחרונה בקדם-סדר גוברת (drainageFittings ×3 בדאטה).
  {
    const tree = [
      CatalogNode(id: 'drainage', children: [
        CatalogNode(id: 'drainage.pipes', children: [
          CatalogNode(id: 'drainage.pipes.couplers', smartKey: 'drainageFittings'),
          CatalogNode(id: 'drainage.pipes.couplings', smartKey: 'drainageFittings'),
        ]),
        CatalogNode(id: 'drainage.accessories', children: [
          CatalogNode(
              id: 'drainage.accessories.connect', smartKey: 'drainageFittings'),
        ]),
      ]),
    ];
    final map = smartKeyToId(tree,
        categoryIdOf: plumbingCatId, cache: SmartKeyToIdCache());
    assert(map['drainageFittings'] == 'plumbing.cat.drainage.accessories.connect',
        '3: בכפילות-מפתח הצומת האחרון בקדם-סדר חייב לגבור');
    assert(map.length == 1, '3: שלוש כפילויות = רשומה אחת');
  }

  // 4 — יער ריק ⇒ מפה ריקה, והריקנות ממוטמנת.
  {
    final cache = SmartKeyToIdCache();
    final map = smartKeyToId(const [],
        categoryIdOf: plumbingCatId, cache: cache);
    assert(map.isEmpty, '4: יער ריק חייב להניב מפה ריקה');
    assert(cache.map != null, '4: גם מפה ריקה נשמרת במטמון (שורה 87)');
  }

  // 5 — memo: קריאה שנייה מחזירה את אותו אובייקט בלי לקרוא ל-categoryIdOf.
  {
    const tree = [CatalogNode(id: 'a', smartKey: 'k')];
    var calls = 0;
    final cache = SmartKeyToIdCache();
    String counting(String k) {
      calls++;
      return plumbingCatId(k);
    }

    final first = smartKeyToId(tree, categoryIdOf: counting, cache: cache);
    final second = smartKeyToId(tree, categoryIdOf: counting, cache: cache);
    assert(identical(first, second), '5: מטמון-מלא חייב להחזיר את אותו אובייקט');
    assert(calls == 1, '5: categoryIdOf נקרא רק בבנייה הראשונה (שורה 98)');
  }

  // 6 — מטמון-מלא ⇒ עץ חדש לא נסרק (במקור העץ const — כאן נצפה ומתועד).
  {
    final cache = SmartKeyToIdCache();
    final first = smartKeyToId(const [CatalogNode(id: 'a', smartKey: 'k')],
        categoryIdOf: plumbingCatId, cache: cache);
    final second = smartKeyToId(const [CatalogNode(id: 'b', smartKey: 'other')],
        categoryIdOf: plumbingCatId, cache: cache);
    assert(identical(first, second) && !second.containsKey('other'),
        '6: עם מטמון-מלא העץ החדש חייב להישאר לא-סרוק');
  }

  // 7 — מחזיק שהוזן-מראש מוחזר כמות-שהוא, אפס בנייה.
  {
    var calls = 0;
    final preset = SmartKeyToIdCache({'x': 'y'});
    final map = smartKeyToId(const [CatalogNode(id: 'a', smartKey: 'k')],
        categoryIdOf: (k) {
      calls++;
      return k;
    }, cache: preset);
    assert(map['x'] == 'y' && map.length == 1 && calls == 0,
        '7: מחזיק-מוזן חייב לחזור כמות-שהוא בלי בנייה');
  }

  // 8 — לולאת-היער (שורות 83-85): כל שורשי-היער נסרקים.
  {
    const forest = [
      CatalogNode(id: 'r1', smartKey: 'k1'),
      CatalogNode(id: 'r2', smartKey: 'k2'),
    ];
    final map = smartKeyToId(forest,
        categoryIdOf: plumbingCatId, cache: SmartKeyToIdCache());
    assert(
        map['k1'] == 'plumbing.cat.r1' && map['k2'] == 'plumbing.cat.r2',
        '8: שני שורשי-היער חייבים להיסרק');
  }

  print('OK smart_key_to_id: 8 asserts passed');
}
