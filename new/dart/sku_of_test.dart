// 🧪 בדיקת-אטום · skuOf — מוכיחה את דוגמאות-החוזה (sku_of.contract.md).
// מייבאת אך ורק את האטום-שלה (חוק-4). הרצה:
//   dart run --enable-asserts new/dart/sku_of_test.dart  ⇒ exit 0
import 'sku_of.dart';

class _P {
  const _P(this.sku, this.n);
  final String sku;
  final int n;
}

void main() {
  // ── 1. פגיעה: מוצר קיים מוחזר ────────────────────────────────────────────
  final cat = <_P>[const _P('A', 1), const _P('B', 2)];
  final c1 = SkuCache<_P>();
  final hit = skuOf('B', catalog: cat, skuKey: (p) => p.sku, cache: c1);
  assert(hit != null && hit.n == 2, 'פגיעה: B ⇒ הרשומה עם 2');

  // ── 2. החטאה ⇒ null ─────────────────────────────────────────────────────
  assert(skuOf('C', catalog: cat, skuKey: (p) => p.sku, cache: c1) == null,
      'החטאה: C אינו בקטלוג ⇒ null');

  // ── 3. כפל-SKU: האחרון-בקטלוג מנצח (map-comprehension דורסת) ────────────
  final dup = <_P>[const _P('X', 1), const _P('X', 9)];
  final c2 = SkuCache<_P>();
  final winner = skuOf('X', catalog: dup, skuKey: (p) => p.sku, cache: c2);
  assert(winner != null && winner.n == 9, 'כפל-SKU: האחרון (9) מנצח');

  // ── 4. מטמון קפוא: שינוי-קטלוג אחרי הקריאה הראשונה אינו נראה (??=) ──────
  final mut = <_P>[const _P('A', 1)];
  final c3 = SkuCache<_P>();
  assert(skuOf('A', catalog: mut, skuKey: (p) => p.sku, cache: c3)!.n == 1);
  mut.add(const _P('NEW', 7)); // הקטלוג השתנה — המטמון כבר נבנה
  assert(skuOf('NEW', catalog: mut, skuKey: (p) => p.sku, cache: c3) == null,
      'מטמון קפוא: NEW נוסף אחרי הבנייה ⇒ עדיין null');

  // ── 5. מחזיק חדש ⇒ בנייה מחדש רואה את הקטלוג המורחב ─────────────────────
  final c4 = SkuCache<_P>();
  final fresh = skuOf('NEW', catalog: mut, skuKey: (p) => p.sku, cache: c4);
  assert(fresh != null && fresh.n == 7, 'מחזיק חדש ⇒ NEW=7 נראה');

  // ── 6. קטלוג ריק ⇒ null (לא קורס) ───────────────────────────────────────
  final c5 = SkuCache<_P>();
  assert(
      skuOf('A', catalog: <_P>[], skuKey: (p) => p.sku, cache: c5) == null,
      'קטלוג ריק ⇒ null');

  // ── 7. מחזיקים נפרדים בלתי-תלויים ───────────────────────────────────────
  assert(c1.map!.length == 2 && c2.map!.length == 1,
      'מחזיקים נפרדים: c1 מחזיק 2 מפתחות, c2 מחזיק 1 (X נדרס)');

  print('sku_of_test: 7/7 PASS');
}
