// בדיקת-אטום · recommendedKitForProduct — מוכיחה בדיוק את דוגמאות החוזה.
// DoD (דיבר-12): dart run --enable-asserts new/dart/recommended_kit_for_product_test.dart ⇒ exit 0 + "OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'recommended_kit_for_product.dart';

void main() {
  // #1 — שער-PPR דרך brand, dims=null ⇒ 6 פריטים, ליבלים ללא-קוטר.
  final r1 = recommendedKitForProduct(const KitProduct(sku: 'A', brand: 'פולירול'));
  assert(r1.length == 6);
  assert(r1[0].label == 'מצמד PPR (אביזר חיבור)');
  assert(r1[0].kind == KitKind.tool);
  assert(r1[0].severity == Severity.required);
  assert(r1[2].label == 'תבנית/ראש ריתוך');
  assert(r1[4].severity == Severity.recommended);
  assert(r1[5].severity == Severity.recommended);

  // #2 — שער-PPR עם dn=40 ⇒ הקוטר נכנס לליבלים.
  final r2 = recommendedKitForProduct(
      const KitProduct(sku: 'A', brand: 'פולירול', dims: {'dn נומינלי': 40}));
  assert(r2.length == 6);
  assert(r2[0].label == 'מצמד PPR 40 (אביזר חיבור)');
  assert(r2[2].label == 'תבנית/ראש ריתוך ⌀40 מ"מ');

  // #3 — שער-PPR דרך spec.material (brand אחר) ⇒ זהה ל-#1.
  final r3 = recommendedKitForProduct(
    const KitProduct(sku: 'S1', brand: 'x'),
    verifiedSpecs: const {'S1': KitSpec(material: 'PPR-100')},
  );
  assert(r3.length == 6);
  assert(r3[0].label == 'מצמד PPR (אביזר חיבור)');

  // #4 — אין spec, brand רגיל ⇒ [] (const).
  final r4 = recommendedKitForProduct(const KitProduct(sku: 'Z', brand: 'x'));
  assert(r4.isEmpty);

  // #5 — שני קצוות-BSP ⇒ מפתח + ptfe (ptfe מנוקה-כפילות), אורך 2.
  final r5 = recommendedKitForProduct(
    const KitProduct(sku: 'B', brand: 'y'),
    verifiedSpecs: const {
      'B': KitSpec(material: 'פליז', ends: [
        KitEnd(EndType.bspMale, '1/2"'),
        KitEnd(EndType.bspFemale, '1/2"'),
      ]),
    },
  );
  assert(r5.length == 2);
  assert(r5[0].label == 'מפתח שוודי מתכוונן להברגה 1/2"');
  assert(r5[0].kind == KitKind.tool);
  assert(r5[1].label == 'סרט טפלון (PTFE)');
  assert(r5[1].kind == KitKind.sealant);

  // #6 — hdpeCompression ⇒ מפתח-חבישה עם material+size, אורך 1.
  final r6 = recommendedKitForProduct(
    const KitProduct(sku: 'C', brand: 'y'),
    verifiedSpecs: const {
      'C': KitSpec(material: 'HDPE', ends: [KitEnd(EndType.hdpeCompression, '32')]),
    },
  );
  assert(r6.length == 1);
  assert(r6[0].label == 'מפתח חבישה DN32 ל-HDPE');

  // #7 — pexPress ⇒ מכווץ PEX, אורך 1.
  final r7 = recommendedKitForProduct(
    const KitProduct(sku: 'D', brand: 'y'),
    verifiedSpecs: const {
      'D': KitSpec(material: 'PEX', ends: [KitEnd(EndType.pexPress, '16')]),
    },
  );
  assert(r7.length == 1);
  assert(r7[0].label == 'מכווץ PEX (Crimper) ל-16');

  // #8 — שער-חוליות: brand='חוליות', DN=40, קטגוריית-צינור ⇒ חותך(required)+מפתח(recommended).
  final r8 = recommendedKitForProduct(const KitProduct(
      sku: 'H1', brand: 'חוליות', dims: {'DN': 40}, categoryHe: 'צינור ביוב'));
  assert(r8.length == 2);
  assert(r8[0].label == 'חותך צינורות SmartLock');
  assert(r8[0].kind == KitKind.tool);
  assert(r8[0].severity == Severity.required);
  assert(r8[1].label == 'מפתח לאום SmartLock 32-40 (מק"ט 61040360)');
  assert(r8[1].severity == Severity.recommended);

  // #9 — שער-חוליות: DN=63, קטגוריה לא-צינור ⇒ פריט-מפתח 50-63 יחיד (אין חותך).
  final r9 = recommendedKitForProduct(const KitProduct(
      sku: 'H2', brand: 'חוליות', dims: {'DN': 63}, categoryHe: 'אביזר'));
  assert(r9.length == 1);
  assert(r9[0].label == 'מפתח לאום SmartLock 50-63 (מק"ט 61060560)');
  assert(r9[0].severity == Severity.recommended);

  print('recommendedKitForProduct OK — 9/9 contract examples proven');
}
