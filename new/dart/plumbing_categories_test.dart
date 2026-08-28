// בדיקת-חוזה · plumbingCategories — מוכיחה את דוגמאות-החוזה (חוק-4).
// מייבאת אך ורק את האטום-שלה. הדאטה בבדיקה = תת-עץ verbatim מ-kCatalogTree
// (buildsmart data/catalog_tree.dart:36-71, ענף ה-drainage) — התנהגות-אמת.
// DoD: dart run --enable-asserts new/dart/plumbing_categories_test.dart ⇒ exit 0.
import 'plumbing_categories.dart';

void _eq(Object? got, Object? want, String lbl) {
  if ('$got' != '$want') throw StateError('FAIL [$lbl]: got=$got want=$want');
}

void main() {
  var n = 0;
  String catId(String k) => 'plumbing.cat.$k';
  const uncat = 'plumbing.cat._uncategorized';

  // ── דוגמה 1 · תת-עץ verbatim מ-kCatalogTree (drainage → traps → 3 עלים) ──
  const tree = [
    CatalogNode(
      id: 'drainage',
      title: 'ניקוז וצנרת',
      emoji: '🕳️',
      children: [
        CatalogNode(
          id: 'drainage.traps',
          title: 'סיפונים ומחסומים',
          emoji: '🌀',
          children: [
            CatalogNode(
                id: 'drainage.traps.floor',
                title: 'מחסומי רצפה',
                emoji: '🕳️',
                smartKey: 'floorDrain'),
            CatalogNode(
                id: 'drainage.traps.visible',
                title: 'מחסומים גלויים',
                emoji: '🚰',
                smartKey: 'visibleTrap'),
            CatalogNode(
                id: 'drainage.traps.manifold',
                title: 'מסעפים וחיבורי אסלה',
                emoji: '🔗',
                smartKey: 'drainageManifold'),
          ],
        ),
      ],
    ),
  ];
  final out = plumbingCategories(tree,
      categoryId: catId, tradeId: 'plumbing', uncategorizedCategoryId: uncat);

  // 5 צמתים + דלי-fallback = 6
  _eq(out.length, 6, '#1 length'); n++;
  // מיון לפי id: '_' (0x5F) לפני 'd' ⇒ ה-fallback ראשון; קידומת קצרה לפני ארוכה.
  _eq(out.map((c) => c.id).join('|'),
      '$uncat|plumbing.cat.drainage|plumbing.cat.drainage.traps|'
      'plumbing.cat.drainage.traps.floor|plumbing.cat.drainage.traps.manifold|'
      'plumbing.cat.drainage.traps.visible',
      '#1 sorted ids'); n++;

  // דלי-ה-fallback — verbatim המקור (:139-146): titleHe/emoji/parent/sortIndex=מספר-הצמתים.
  final u = out[0];
  _eq(u.titleHe, 'ללא קטגוריה', '#2 uncat title'); n++;
  _eq(u.emoji, '❓', '#2 uncat emoji'); n++;
  _eq(u.parentId, null, '#2 uncat parent'); n++;
  _eq(u.sortIndex, 5, '#2 uncat sortIndex=out.length לפני-הצירוף'); n++;
  _eq(u.tradeId, 'plumbing', '#2 uncat tradeId'); n++;
  _eq(u.smartFixtureId, null, '#2 uncat smartFixtureId'); n++;

  // קישור-הורים + sortIndex בין-אחים + smartFixtureId=smartKey.
  final root = out[1];
  _eq(root.titleHe, 'ניקוז וצנרת', '#3 root title'); n++;
  _eq(root.parentId, null, '#3 root parent=null'); n++;
  _eq(root.sortIndex, 0, '#3 root sortIndex'); n++;
  _eq(root.smartFixtureId, null, '#3 root smartKey null'); n++;
  final traps = out[2];
  _eq(traps.parentId, 'plumbing.cat.drainage', '#4 traps parent'); n++;
  _eq(traps.sortIndex, 0, '#4 traps sortIndex'); n++;
  final floor = out[3];
  _eq(floor.parentId, 'plumbing.cat.drainage.traps', '#5 floor parent'); n++;
  _eq(floor.sortIndex, 0, '#5 floor si=0 (ילד ראשון)'); n++;
  _eq(floor.smartFixtureId, 'floorDrain', '#5 floor smartFixtureId'); n++;
  _eq(floor.emoji, '🕳️', '#5 floor emoji'); n++;
  final manifold = out[4];
  _eq(manifold.sortIndex, 2, '#6 manifold si=2 (ילד שלישי, המיון לא נוגע)'); n++;
  final visible = out[5];
  _eq(visible.sortIndex, 1, '#6 visible si=1 (ילד שני)'); n++;
  _eq(visible.titleHe, 'מחסומים גלויים', '#6 visible title'); n++;
  // ברירת-מחדל של הסכמה: attributeSchemaIds ריק (האטום לא מציב).
  _eq(floor.attributeSchemaIds.length, 0, '#7 attributeSchemaIds ריק'); n++;

  // ── דוגמה 2 · עץ ריק ⇒ רק דלי-ה-fallback, sortIndex=0 ──
  final empty = plumbingCategories(const [],
      categoryId: catId, tradeId: 'plumbing', uncategorizedCategoryId: uncat);
  _eq(empty.length, 1, '#8 empty ⇒ 1'); n++;
  _eq(empty[0].id, uncat, '#8 empty id'); n++;
  _eq(empty[0].sortIndex, 0, '#8 empty sortIndex=0'); n++;

  // ── דוגמה 3 · המיון לפי id משנה-סדר אך משמר sortIndex-הכנסה ──
  const zThenA = [
    CatalogNode(id: 'z', title: 'זי', emoji: '🅉'),
    CatalogNode(id: 'a', title: 'איי', emoji: '🅐'),
  ];
  final s = plumbingCategories(zThenA,
      categoryId: (k) => 't.$k', tradeId: 't', uncategorizedCategoryId: 't._u');
  _eq(s.map((c) => c.id).join('|'), 't._u|t.a|t.z', '#9 sorted'); n++;
  _eq(s[1].sortIndex, 1, '#9 a נכנס שני ⇒ si=1 נשמר'); n++;
  _eq(s[2].sortIndex, 0, '#9 z נכנס ראשון ⇒ si=0 נשמר'); n++;
  _eq(s[0].sortIndex, 2, '#9 uncat si=2'); n++;

  // דטרמיניזם: שתי קריאות ⇒ אותה סדרת-ids (המקור: "two calls must stay byte-equal").
  final again = plumbingCategories(tree,
      categoryId: catId, tradeId: 'plumbing', uncategorizedCategoryId: uncat);
  _eq(again.map((c) => '${c.id}/${c.sortIndex}').join('|'),
      out.map((c) => '${c.id}/${c.sortIndex}').join('|'), '#10 דטרמיניזם'); n++;

  print('OK plumbingCategories: $n asserts passed');
}
