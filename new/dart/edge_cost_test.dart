// בדיקת-אטום · edgeCost — מוכיחה בדיוק את דוגמאות edge_cost.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/edge_cost_test.dart ⇒ exit 0 + "edgeCost OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4). directMates + isFitting = ברירות-המחדל (verbatim).
import 'edge_cost.dart';

void main() {
  // מפת-ספקים + מפת-בור מוזרקות (מייצגות kVerifiedSpecs + _minBoreMmOf).
  const specs = {
    'A': SpecView(material: 'פליז', ends: [EndPart('bspMale', '1/2"')]),
    'B': SpecView(material: 'פליז', ends: [EndPart('bspFemale', '1/2"')]),
    'B2': SpecView(material: 'HDPE', ends: [EndPart('hdpeCompression', '16')]),
    'A3': SpecView(material: 'PP', ends: [EndPart('drainOpening', '50')]),
    'B3': SpecView(material: 'PVC', ends: [EndPart('drainOpening', '50')]),
  };
  final bores = {'B': 15.0, 'B2': 10.0};
  SpecView? spec(String sku) => specs[sku];
  double? bore(String sku) => bores[sku];

  // #1 — התאמה-ישירה, אותו-חומר, קטגוריית-fitting, בור≥15:
  //      10 + 0(fitting) + 0(same material) + 0(direct) + 0(bore15) = 10.
  assert(edgeCost(
        const EdgeNode(sku: 'A', categoryHe: 'אביזרי תבריג'),
        const EdgeNode(sku: 'B', categoryHe: 'אביזרי תבריג'),
        verifiedSpec: spec,
        minBoreMm: bore,
      ) ==
      10); // install_engine.dart:707(direct)+722(bore)+727(fitting)+728

  // #2 — מעבר חוצה-משפחה (פליז↔HDPE), התקן (לא-fitting), אין-מייט, בור 10:
  //      10 + 50(device) + 4(cross-family) + 2(bridged) + 5(15-10) = 71.
  assert(edgeCost(
        const EdgeNode(sku: 'A', categoryHe: 'אביזרי תבריג'),
        const EdgeNode(sku: 'B2', categoryHe: 'ברזי כיור'),
        verifiedSpec: spec,
        minBoreMm: bore,
      ) ==
      71); // install_engine.dart:695(4)+702(2)+722-725(5)+727(50)

  // #3 — מעבר בתוך-משפחת-ניקוז (PP↔PVC), fitting, התאמה-ישירה, בור null:
  //      10 + 0 + 1(drainage) + 0(direct) + 0(bore null) = 11.
  assert(edgeCost(
        const EdgeNode(sku: 'A3', categoryHe: 'צינורות PP'),
        const EdgeNode(sku: 'B3', categoryHe: 'ברכיים'),
        verifiedSpec: spec,
        minBoreMm: bore,
      ) ==
      11); // install_engine.dart:693(1)

  // #4 — שני-הצדדים ללא-ספק, יעד לא-fitting:
  //      10 + 50(device) + 0(null material) + 0(else-branch) + 0(bore null) = 60.
  assert(edgeCost(
        const EdgeNode(sku: 'X', categoryHe: ''),
        const EdgeNode(sku: 'Y', categoryHe: 'אסלות וכיורים'),
      ) ==
      60); // install_engine.dart:714(pipeBridge=0)+727(50)

  // #5 — שני-הצדדים ללא-ספק, יעד fitting:
  //      10 + 0(fitting) + 0 + 0 + 0 = 10 (מדגים החלפת deviceFiller).
  assert(edgeCost(
        const EdgeNode(sku: 'X', categoryHe: ''),
        const EdgeNode(sku: 'Y', categoryHe: 'צינורות'),
      ) ==
      10);

  // #6 — צד-אחד עם-ספק, צד-שני בלי (מעורב): material אחד null ⇒ transition 0,
  //      else-branch ⇒ pipeBridge 0, יעד לא-fitting:
  //      10 + 50 + 0 + 0 + 0 = 60.
  assert(edgeCost(
        const EdgeNode(sku: 'A', categoryHe: 'אביזרי תבריג'),
        const EdgeNode(sku: 'B6', categoryHe: 'ברזי כיור'),
        verifiedSpec: spec,
        minBoreMm: bore,
      ) ==
      60); // install_engine.dart:690(transition0)+714(pipeBridge0)

  print('edgeCost OK — 6 contract examples proven');
}
