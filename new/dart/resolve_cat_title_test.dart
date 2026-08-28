// בדיקת-חוזה golden · resolveCatTitle — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/resolve_cat_title_test.dart
import 'resolve_cat_title.dart';

void _ok(bool cond, String label) {
  if (!cond) throw StateError('FAIL [$label]');
}

void main() {
  var n = 0;
  // עץ בדמות המקור: שורש 'ניקוז וצנרת' → פנימי 'סיפונים ומחסומים' → עלה עם
  // lipskeyCategory 'מחסומי רצפה'; ושורש שני 'צנרת PPR'.
  const floor = CatalogNode(
      id: 'drainage.traps.floor',
      title: 'מחסומי רצפה — עלה',
      emoji: '🕳️',
      lipskeyCategory: 'מחסומי רצפה');
  const drainage = CatalogNode(id: 'drainage', title: 'ניקוז וצנרת', emoji: '🕳️', children: [
    CatalogNode(id: 'drainage.traps', title: 'סיפונים ומחסומים', emoji: '🌀', children: [floor]),
  ]);
  const ppr = CatalogNode(id: 'ppr', title: 'צנרת PPR', emoji: '💧');
  const tree = [drainage, ppr];

  // 1: התאמת title בשורש ⇒ הצומת עצמו (identity).
  _ok(identical(resolveCatTitle('ניקוז וצנרת', tree: tree, allProducts: const []), drainage),
      '1 root title'); n++;

  // 2: התאמת lipskeyCategory בעלה עמוק ⇒ העלה.
  _ok(identical(resolveCatTitle('מחסומי רצפה', tree: tree, allProducts: const []), floor),
      '2 deep lipskey'); n++;

  // 3: שני תואמים — 'צנרת' כ-title בשורש-א׳ וכ-lipskey בעץ-ב׳ ⇒ הראשון ב-pre-order.
  const a = CatalogNode(id: 'a', title: 'צנרת', emoji: '💧');
  const b = CatalogNode(id: 'b', title: 'אחר', emoji: '🟤', lipskeyCategory: 'צנרת');
  _ok(identical(resolveCatTitle('צנרת', tree: const [a, b], allProducts: const []), a),
      '3 pre-order first wins'); n++;

  // 4: אין צומת, יש מוצר categoryHe תואם ⇒ עלה-סינתטי (שורות 103-105 במקור).
  const products = [CatProduct(categoryHe: 'ברזי כיור'), CatProduct(categoryHe: 'אסלות')];
  final syn = resolveCatTitle('ברזי כיור', tree: tree, allProducts: products);
  _ok(syn != null &&
          syn.id == 'catdept.ברזי כיור' &&
          syn.title == 'ברזי כיור' &&
          syn.emoji == '📦' &&
          syn.lipskeyCategory == 'ברזי כיור' &&
          syn.isLeaf,
      '4 synthetic leaf'); n++;

  // 5: צומת-תואם גובר על מוצר-תואם (הסינתטי רק כשאין צומת).
  _ok(identical(
          resolveCatTitle('מחסומי רצפה',
              tree: tree, allProducts: const [CatProduct(categoryHe: 'מחסומי רצפה')]),
          floor),
      '5 node beats product'); n++;

  // 6: לא צומת ולא מוצר ⇒ null.
  _ok(resolveCatTitle('לא קיים', tree: tree, allProducts: products) == null, '6 null'); n++;

  // 7: עץ ריק ומוצרים ריקים ⇒ null.
  _ok(resolveCatTitle('כלום', tree: const [], allProducts: const []) == null, '7 empty'); n++;

  assert(resolveCatTitle('צנרת PPR', tree: tree, allProducts: const [])!.id == 'ppr',
      'assert-live');
  print('OK resolveCatTitle: $n asserts passed');
}
