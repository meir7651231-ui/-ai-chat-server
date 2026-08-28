// בדיקת-חוזה · plumbingFixtures — מוכיחה את דוגמאות-החוזה עצמן (חוק-4).
// מייבאת אך ורק את האטום-שלה. הרצה:
//   dart run --enable-asserts new/dart/plumbing_fixtures_test.dart  ⇒ exit 0
import 'plumbing_fixtures.dart';

void _eq(Object? got, Object? want, String lbl) {
  if ('$got' != '$want') throw StateError('FAIL [$lbl]: got=$got want=$want');
}

void main() {
  const trade = 'plumbing';
  const uncat = 'plumbing.cat._uncategorized';

  // דגימה נאמנת-מקור (basinTrap מ-smart_tree.dart) — קלט לא-ממוין במכוון:
  // 'zz' לפני 'basinTrap' כדי להוכיח את מיון-הפלט (דוגמה 4 בחוזה).
  final products = <SmartProduct>[
    const SmartProduct(
      key: 'zz',
      name: 'מוצר יתום',
      emoji: '❔',
      brands: [],
      acc: [],
    ),
    const SmartProduct(
      key: 'basinTrap',
      name: 'סיפון לכיור רחצה',
      emoji: '🌀',
      diagramTitle: 'התקנת סיפון — מהברגה עד בדיקת ניקוז',
      brands: [
        SmartBrand(
          name: 'סיפון אמריקאי 1¼" לבן',
          tag: 'מחיר לפי ספק',
          rec: true,
          sku: '217861',
          imageAsset: 'assets/lipskey/products/217861.jpeg',
        ),
        SmartBrand(name: 'סיפון 1¼" + יציאה למזגן', tag: 'עם יציאה למזגן', sku: '213055', price: 45),
      ],
      acc: [SmartAcc(), SmartAcc()],
      stages: [
        SmartStage(emoji: '🔩', label: 'רכיבים', sub: 'טפלון, מפתח', match: ['סרט טפלון', 'מפתח צינורות']),
        SmartStage(emoji: '✅', label: 'סיפון מותקן', sub: 'בדיקת ניקוז', match: ['סיליקון סניטרי'], isFinal: true),
      ],
    ),
  ];
  final map = <String, String>{'basinTrap': 'plumbing.cat.k1'}; // 'zz' חסר במכוון

  final out = plumbingFixtures(
    products: products,
    smartKeyToId: map,
    kPlumbingTradeId: trade,
    kUncategorizedCategoryId: uncat,
  );

  // מיון לפי id: 'plumbing.fixture.basinTrap' < 'plumbing.fixture.zz' (דוגמה 4)
  _eq(out.length, 2, 'len');
  _eq(out[0].id, 'plumbing.fixture.basinTrap', 'sort/id-scheme'); // דוגמה 1
  _eq(out[1].id, 'plumbing.fixture.zz', 'sort#2');

  // דוגמה 1 — פתירת-קטגוריה מהמפה
  final f = out[0];
  _eq(f.tradeId, 'plumbing', 'tradeId');
  _eq(f.categoryId, 'plumbing.cat.k1', 'categoryId-resolved');
  _eq(f.nameHe, 'סיפון לכיור רחצה', 'nameHe');
  _eq(f.emoji, '🌀', 'emoji');
  _eq(f.diagramTitleHe, 'התקנת סיפון — מהברגה עד בדיקת ניקוז', 'diagramTitleHe');

  // דוגמה 2 — fallback ללא-קטגוריה
  _eq(out[1].categoryId, uncat, 'categoryId-fallback');
  _eq(out[1].diagramTitleHe, '', 'diagramTitle-default');
  _eq(out[1].brandRefs.length, 0, 'brands-empty');
  _eq(out[1].accessoryRuleIds, <String>[], 'acc-empty');
  _eq(out[1].stages.length, 0, 'stages-empty');

  // brandRefs — מיפוי 1:1 שדה-שדה (שורות 215-226 במקור)
  _eq(f.brandRefs.length, 2, 'brands-len');
  _eq(f.brandRefs[0].name, 'סיפון אמריקאי 1¼" לבן', 'brand0-name');
  _eq(f.brandRefs[0].tag, 'מחיר לפי ספק', 'brand0-tag');
  _eq(f.brandRefs[0].rec, true, 'brand0-rec');
  _eq(f.brandRefs[0].sku, '217861', 'brand0-sku');
  _eq(f.brandRefs[0].imageAsset, 'assets/lipskey/products/217861.jpeg', 'brand0-img');
  _eq(f.brandRefs[0].price, null, 'brand0-price-null');
  _eq(f.brandRefs[1].rec, false, 'brand1-rec-default');
  _eq(f.brandRefs[1].imageAsset, null, 'brand1-img-null');
  _eq(f.brandRefs[1].price, 45, 'brand1-price');

  // דוגמה 3 — accessoryRuleIds לפי אינדקס
  _eq(f.accessoryRuleIds, ['plumbing.acc.basinTrap.0', 'plumbing.acc.basinTrap.1'], 'accIds');

  // stages — מיפוי 1:1 (label→labelHe · sub→subHe · match→matchTokens)
  _eq(f.stages.length, 2, 'stages-len');
  _eq(f.stages[0].emoji, '🔩', 'st0-emoji');
  _eq(f.stages[0].labelHe, 'רכיבים', 'st0-label');
  _eq(f.stages[0].subHe, 'טפלון, מפתח', 'st0-sub');
  _eq(f.stages[0].isFinal, false, 'st0-final');
  _eq(f.stages[0].matchTokens, ['סרט טפלון', 'מפתח צינורות'], 'st0-match');
  _eq(f.stages[1].isFinal, true, 'st1-final');
  _eq(f.stages[1].matchTokens, ['סיליקון סניטרי'], 'st1-match');

  // דוגמה 5 — קלט ריק ⇒ פלט ריק
  final empty = plumbingFixtures(
    products: const [],
    smartKeyToId: const {},
    kPlumbingTradeId: trade,
    kUncategorizedCategoryId: uncat,
  );
  _eq(empty.length, 0, 'empty');

  print('✓ plumbingFixtures: 33 asserts');
}
