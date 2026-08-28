// 🧪 בדיקת-חוזה · walk — מוכיחה את דוגמאות-החוזה עצמן (חוק-4).
// מייבאת אך ורק את האטום-שלה. הרצה: dart run --enable-asserts walk_test.dart
import 'walk.dart';

void main() {
  // 1 — התאמת-title על השורש.
  {
    const root = CatalogNode(title: 'צנרת');
    final hit = CatalogHit();
    walk(root, 'צנרת', hit);
    assert(identical(hit.node, root), '1: שורש-מתאים-בכותרת חייב להיתפס');
  }

  // 2 — התאמת-lipskeyCategory בעלה עמוק (מקרה resolveCatTitle לעלה-מפוצל).
  {
    const leaf = CatalogNode(title: 'ב', lipskeyCategory: 'ברזי כיור');
    const root = CatalogNode(title: 'א', children: [leaf]);
    final hit = CatalogHit();
    walk(root, 'ברזי כיור', hit);
    assert(identical(hit.node, leaf), '2: התאמה על lipskeyCategory חייבת להיתפס');
  }

  // 3 — עצירה-מוקדמת: hit כבר מלא ⇒ לא נגוע גם כשהעץ מכיל התאמה.
  {
    const alien = CatalogNode(title: 'זר');
    const root = CatalogNode(title: 'צנרת');
    final hit = CatalogHit(alien);
    walk(root, 'צנרת', hit);
    assert(identical(hit.node, alien), '3: hit-מלא חייב להישאר ללא-שינוי');
  }

  // 4 — אין התאמה ⇒ null.
  {
    const root = CatalogNode(title: 'א', children: [CatalogNode(title: 'ב')]);
    final hit = CatalogHit();
    walk(root, 'ג', hit);
    assert(hit.node == null, '4: בלי התאמה hit חייב להישאר null');
  }

  // 5 — קדם-סדר: אב-מתאים גובר על ילד-מתאים.
  {
    const child = CatalogNode(title: 'x');
    const root = CatalogNode(title: 'x', children: [child]);
    final hit = CatalogHit();
    walk(root, 'x', hit);
    assert(identical(hit.node, root), '5: קדם-סדר — האב נבדק לפני הילד');
  }

  // 6 — סדר-אחים: האח השמאלי (הראשון) גובר.
  {
    const first = CatalogNode(title: 'x', lipskeyCategory: 'ראשון');
    const second = CatalogNode(title: 'x', lipskeyCategory: 'שני');
    const root = CatalogNode(title: 'א', children: [first, second]);
    final hit = CatalogHit();
    walk(root, 'x', hit);
    assert(identical(hit.node, first), '6: העלה הראשון בסדר-האחים חייב לנצח');
  }

  // 7 — לולאת-יער עם מחזיק משותף (דפוס resolveCatTitle:97-99): עץ-1 נועל.
  {
    const t1 = CatalogNode(title: 'משותף', lipskeyCategory: 'עץ-1');
    const t2 = CatalogNode(title: 'משותף', lipskeyCategory: 'עץ-2');
    final hit = CatalogHit();
    for (final t in [t1, t2]) {
      walk(t, 'משותף', hit);
    }
    assert(identical(hit.node, t1), '7: ההתאמה הראשונה ביער חייבת לנעול');
  }

  print('OK walk: 7 asserts passed');
}
