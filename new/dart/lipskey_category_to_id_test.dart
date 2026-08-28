// 🧪 בדיקת-חוזה · lipskeyCategoryToId — מוכיחה את דוגמאות-החוזה עצמן (חוק-4).
// מייבאת אך ורק את האטום-שלה. הרצה: dart run --enable-asserts lipskey_category_to_id_test.dart
import 'lipskey_category_to_id.dart';

/// סכימת-המקור: _categoryId(key) = '$kPlumbingTradeId.cat.$key' (‏:32, trade='plumbing').
String plumbingCatId(String k) => 'plumbing.cat.$k';

void main() {
  // 1 — ids/ערכים אמיתיים: תת-עץ drainage.traps מ-catalog_tree.dart:44-72.
  {
    const tree = [
      CatalogNode(id: 'drainage', children: [
        CatalogNode(id: 'drainage.traps', children: [
          CatalogNode(
              id: 'drainage.traps.floor', lipskeyCategory: 'מחסומי רצפה'),
          CatalogNode(
              id: 'drainage.traps.visible', lipskeyCategory: 'מחסומים גלויים'),
          CatalogNode(
              id: 'drainage.traps.manifold',
              lipskeyCategory: 'מסעפים וחיבורי אסלה'),
        ]),
      ]),
    ];
    final map = lipskeyCategoryToId(tree,
        categoryIdOf: plumbingCatId, cache: LipskeyCategoryToIdCache());
    assert(map['מחסומי רצפה'] == 'plumbing.cat.drainage.traps.floor',
        '1: מחסומי-רצפה חייב למפות למזהה-הקטגוריה של הצומת שלו');
    assert(map['מחסומים גלויים'] == 'plumbing.cat.drainage.traps.visible',
        '1: מחסומים-גלויים חייב למפות לצומת שלו');
  }

  // 2 — צומת בלי lipskeyCategory לא תורם, אבל ילדיו נסרקים
  //     (drainage.collectors:75-100 — roof הוא smart-בלבד במקור).
  {
    const tree = [
      CatalogNode(id: 'drainage.collectors', children: [
        CatalogNode(id: 'drainage.collectors.roof'), // smartKey-בלבד במקור
        CatalogNode(
            id: 'drainage.collectors.floor', lipskeyCategory: 'מאספי רצפה'),
      ]),
    ];
    final map = lipskeyCategoryToId(tree,
        categoryIdOf: plumbingCatId, cache: LipskeyCategoryToIdCache());
    assert(map['מאספי רצפה'] == 'plumbing.cat.drainage.collectors.floor',
        '2: ילד-עם-lipskey מתחת להורה-בלי חייב להיסרק');
    assert(map.length == 1, '2: צמתים בלי lipskeyCategory לא תורמים רשומות');
  }

  // 3 — כפילות-מפתח: הכתיבה האחרונה בקדם-סדר גוברת (סינתטי — בדאטה האמיתית
  //     ערכי-lipskeyCategory ייחודיים; זו סמנטיקת-ההשמה של Map במקור :75).
  {
    const tree = [
      CatalogNode(id: 'drainage', children: [
        CatalogNode(id: 'drainage.pipes', children: [
          CatalogNode(id: 'drainage.pipes.couplers', lipskeyCategory: 'כפול'),
          CatalogNode(id: 'drainage.pipes.couplings', lipskeyCategory: 'כפול'),
        ]),
        CatalogNode(id: 'drainage.accessories', children: [
          CatalogNode(
              id: 'drainage.accessories.connect', lipskeyCategory: 'כפול'),
        ]),
      ]),
    ];
    final map = lipskeyCategoryToId(tree,
        categoryIdOf: plumbingCatId, cache: LipskeyCategoryToIdCache());
    assert(map['כפול'] == 'plumbing.cat.drainage.accessories.connect',
        '3: בכפילות-מפתח הצומת האחרון בקדם-סדר חייב לגבור');
    assert(map.length == 1, '3: שלוש כפילויות = רשומה אחת');
  }

  // 4 — יער ריק ⇒ מפה ריקה, והריקנות ממוטמנת.
  {
    final cache = LipskeyCategoryToIdCache();
    final map = lipskeyCategoryToId(const [],
        categoryIdOf: plumbingCatId, cache: cache);
    assert(map.isEmpty, '4: יער ריק חייב להניב מפה ריקה');
    assert(cache.map != null, '4: גם מפה ריקה נשמרת במטמון (שורה 86)');
  }

  // 5 — memo: קריאה שנייה מחזירה את אותו אובייקט בלי לקרוא ל-categoryIdOf.
  {
    const tree = [CatalogNode(id: 'a', lipskeyCategory: 'ק')];
    var calls = 0;
    final cache = LipskeyCategoryToIdCache();
    String counting(String k) {
      calls++;
      return plumbingCatId(k);
    }

    final first = lipskeyCategoryToId(tree, categoryIdOf: counting, cache: cache);
    final second =
        lipskeyCategoryToId(tree, categoryIdOf: counting, cache: cache);
    assert(identical(first, second), '5: מטמון-מלא חייב להחזיר את אותו אובייקט');
    assert(calls == 1, '5: categoryIdOf נקרא רק בבנייה הראשונה (שורה 92)');
  }

  // 6 — מטמון-מלא ⇒ עץ חדש לא נסרק (במקור העץ const — כאן נצפה ומתועד).
  {
    final cache = LipskeyCategoryToIdCache();
    final first = lipskeyCategoryToId(
        const [CatalogNode(id: 'a', lipskeyCategory: 'ק')],
        categoryIdOf: plumbingCatId,
        cache: cache);
    final second = lipskeyCategoryToId(
        const [CatalogNode(id: 'b', lipskeyCategory: 'אחר')],
        categoryIdOf: plumbingCatId,
        cache: cache);
    assert(identical(first, second) && !second.containsKey('אחר'),
        '6: עם מטמון-מלא העץ החדש חייב להישאר לא-סרוק');
  }

  // 7 — מחזיק שהוזן-מראש מוחזר כמות-שהוא, אפס בנייה.
  {
    var calls = 0;
    final preset = LipskeyCategoryToIdCache({'x': 'y'});
    final map = lipskeyCategoryToId(
        const [CatalogNode(id: 'a', lipskeyCategory: 'ק')], categoryIdOf: (k) {
      calls++;
      return k;
    }, cache: preset);
    assert(map['x'] == 'y' && map.length == 1 && calls == 0,
        '7: מחזיק-מוזן חייב לחזור כמות-שהוא בלי בנייה');
  }

  // 8 — לולאת-היער (שורות 83-85): כל שורשי-היער נסרקים.
  {
    const forest = [
      CatalogNode(id: 'r1', lipskeyCategory: 'ק1'),
      CatalogNode(id: 'r2', lipskeyCategory: 'ק2'),
    ];
    final map = lipskeyCategoryToId(forest,
        categoryIdOf: plumbingCatId, cache: LipskeyCategoryToIdCache());
    assert(map['ק1'] == 'plumbing.cat.r1' && map['ק2'] == 'plumbing.cat.r2',
        '8: שני שורשי-היער חייבים להיסרק');
  }

  print('OK lipskey_category_to_id: 8 asserts passed');
}
