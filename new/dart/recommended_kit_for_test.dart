// בדיקת-אטום · recommendedKitFor — מוכיחה בדיוק את דוגמאות החוזה.
// DoD (דיבר-12): dart run --enable-asserts new/dart/recommended_kit_for_test.dart ⇒ exit 0 + "OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'recommended_kit_for.dart';

void main() {
  // #1 — שרשרת באורך 1 ⇒ [] (const).
  final r1 = recommendedKitFor(const [ChainProduct('A')]);
  assert(r1.isEmpty);

  // #2 — spec חסר לצד-אחד ⇒ הצמד מדולג ⇒ [].
  final r2 = recommendedKitFor(
    const [ChainProduct('A'), ChainProduct('B')],
    verifiedSpecs: const {
      'A': KitSpec(material: 'פליז', ends: [KitEnd(EndType.bspMale, '1/2"')]),
    },
  );
  assert(r2.isEmpty);

  // #3 — מפרק-BSP ישיר, אותו חומר ⇒ מפתח + ptfe (אורך 2).
  final r3 = recommendedKitFor(
    const [ChainProduct('A'), ChainProduct('B')],
    verifiedSpecs: const {
      'A': KitSpec(material: 'פליז', ends: [KitEnd(EndType.bspMale, '1/2"')]),
      'B': KitSpec(material: 'פליז', ends: [KitEnd(EndType.bspFemale, '1/2"')]),
    },
  );
  assert(r3.length == 2);
  assert(r3[0].label == 'מפתח שוודי מתכוונן לחיבור הברגה 1/2"');
  assert(r3[0].kind == KitKind.tool);
  assert(r3[1].label == 'סרט טפלון (PTFE)');
  assert(r3[1].kind == KitKind.sealant);

  // #4 — מעבר-מתכות (נחושת↔פלדה) ⇒ +דיאלקטרי +hemp (אורך 4).
  final r4 = recommendedKitFor(
    const [ChainProduct('A'), ChainProduct('B')],
    verifiedSpecs: const {
      'A': KitSpec(material: 'נחושת', ends: [KitEnd(EndType.bspMale, '3/4"')]),
      'B': KitSpec(material: 'פלדה', ends: [KitEnd(EndType.bspFemale, '3/4"')]),
    },
  );
  assert(r4.length == 4);
  assert(r4[0].label == 'מפתח שוודי מתכוונן לחיבור הברגה 3/4"');
  assert(r4[1].label == 'סרט טפלון (PTFE)');
  assert(r4[2].label == 'רקורד דיאלקטרי');
  assert(r4[2].kind == KitKind.safety);
  assert(r4[3].label == 'חמצן (hemp) או טפלון עבה');
  assert(r4[3].severity == Severity.recommended);

  // #5 — PPR-both על מפרק pipe-shared ⇒ ערכת-ריתוך גוברת (אורך 3).
  final r5 = recommendedKitFor(
    const [ChainProduct('A'), ChainProduct('B')],
    verifiedSpecs: const {
      'A': KitSpec(material: 'PPR', ends: [KitEnd(EndType.hdpeCompression, '40')]),
      'B': KitSpec(material: 'PPR', ends: [KitEnd(EndType.hdpeCompression, '40')]),
    },
  );
  assert(r5.length == 3);
  assert(r5[0].label == 'מכונת ריתוך-שקע PPR (260°C)');
  assert(r5[1].label == 'תבנית ריתוך ⌀40 מ"מ');
  assert(r5[2].label == 'חותך צינור PPR');

  // #6 — hdpeCompression לא-PPR ⇒ מפתח-חבישה (אורך 1).
  final r6 = recommendedKitFor(
    const [ChainProduct('A'), ChainProduct('B')],
    verifiedSpecs: const {
      'A': KitSpec(material: 'HDPE', ends: [KitEnd(EndType.hdpeCompression, '32')]),
      'B': KitSpec(material: 'HDPE', ends: [KitEnd(EndType.hdpeCompression, '32')]),
    },
  );
  assert(r6.length == 1);
  assert(r6[0].label == 'מפתח חבישה DN32 ל-HDPE');

  // #7 — pexPress ישיר ⇒ מכווץ PEX (אורך 1).
  final r7 = recommendedKitFor(
    const [ChainProduct('A'), ChainProduct('B')],
    verifiedSpecs: const {
      'A': KitSpec(material: 'PEX', ends: [KitEnd(EndType.pexPress, '16')]),
      'B': KitSpec(material: 'PEX', ends: [KitEnd(EndType.pexPress, '16')]),
    },
  );
  assert(r7.length == 1);
  assert(r7[0].label == 'מכווץ PEX (Crimper) ל-16');

  print('recommendedKitFor OK — 7/7 contract examples proven');
}
