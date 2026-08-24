// בדיקת-אטום · catalogActionIdsFor — מוכיחה בדיוק את catalog_action_ids_for.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/catalog_action_ids_for_test.dart
//                ⇒ exit 0 + "catalogActionIdsFor OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'catalog_action_ids_for.dart';

void main() {
  // הקטלוג-החי (action_catalog.dart:131-181) — 7 פעולות, רק cart.add מוטטור.
  const live = <CatalogAction>[
    CatalogAction(id: 'nav.screen'),
    CatalogAction(id: 'sheet.scanPlan'),
    CatalogAction(id: 'sheet.cheaperAlt'),
    CatalogAction(id: 'sheet.priceCompare'),
    CatalogAction(id: 'cart.add', mutates: true),
    CatalogAction(id: 'cart.open'),
    CatalogAction(id: 'share.text'),
  ];

  bool eq(Set<String> a, Set<String> b) =>
      a.length == b.length && a.containsAll(b);

  // #1 — הקשר-כתיבה ⇒ כל 7 ה-id-ים כולל המוטטור cart.add.
  final r1 = catalogActionIdsFor('card1', readOnly: false, catalog: live);
  assert(eq(r1, {
    'nav.screen',
    'sheet.scanPlan',
    'sheet.cheaperAlt',
    'sheet.priceCompare',
    'cart.add',
    'cart.open',
    'share.text',
  }));
  assert(r1.length == 7);

  // #2 — הקשר-קריאה-בלבד ⇒ 6 id-ים, cart.add מסונן.
  final r2 = catalogActionIdsFor('card1', readOnly: true, catalog: live);
  assert(eq(r2, {
    'nav.screen',
    'sheet.scanPlan',
    'sheet.cheaperAlt',
    'sheet.priceCompare',
    'cart.open',
    'share.text',
  }));
  assert(r2.length == 6);
  assert(!r2.contains('cart.add')); // המוטטור לא נחשף בקריאה-בלבד.

  // #3 — elementId ריק ⇒ fail-closed (Set ריק), גם ב-readOnly=false.
  assert(catalogActionIdsFor('', readOnly: false, catalog: live).isEmpty);

  // #4 — רווחים-בלבד ⇒ trim().isEmpty ⇒ ריק.
  assert(catalogActionIdsFor('   ', readOnly: true, catalog: live).isEmpty);

  // #5 — קטלוג ריק + readOnly=true ⇒ ריק.
  assert(catalogActionIdsFor('x', readOnly: true, catalog: const [])
      .isEmpty);

  // #6 — קטלוג ריק + readOnly=false ⇒ ריק.
  assert(catalogActionIdsFor('x', readOnly: false, catalog: const [])
      .isEmpty);

  // #7 — עדשה-עוינת: קטלוג שכולו מוטטורים + readOnly=true ⇒ הכול סונן ⇒ ריק.
  assert(catalogActionIdsFor(
    'x',
    readOnly: true,
    catalog: const [
      CatalogAction(id: 'm1', mutates: true),
      CatalogAction(id: 'm2', mutates: true),
    ],
  ).isEmpty);

  // #8 — id כפול ⇒ סמנטיקת-Set מדדפת לפריט-יחיד.
  final r8 = catalogActionIdsFor(
    'x',
    readOnly: false,
    catalog: const [
      CatalogAction(id: 'k'),
      CatalogAction(id: 'k'),
    ],
  );
  assert(eq(r8, {'k'}));
  assert(r8.length == 1);

  print('catalogActionIdsFor OK — 8/8 contract examples proven');
}
