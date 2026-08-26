// בדיקת-אטום · findAlternativePaths — מוכיחה בדיוק את find_alternative_paths.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/find_alternative_paths_test.dart ⇒ exit 0 + "findAlternativePaths OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4). שלושת השכנים (shortestPath/Excluding/pathCost) מוזרקים.
import 'find_alternative_paths.dart';

const _A = AltNode(sku: 'A');
const _B = AltNode(sku: 'B');
const _C = AltNode(sku: 'C');
const _D = AltNode(sku: 'D');

String _skus(List<List<AltNode>> paths) =>
    paths.map((p) => p.map((n) => n.sku).join('>')).join('|');

void main() {
  // שקעים מבוקרים: המסלול-הראשון = A→C→D; המסלול-הנמנע-מקשת = A→B→D;
  // pathCost = (אורך-1)·10.
  List<AltNode>? sp(AltNode f, AltNode t, int md, int tc) => const [_A, _C, _D];
  List<AltNode>? spx(
          AltNode f, AltNode t, int md, int tc, Set<(String, String)> blk) =>
      blk.contains(('A', 'C')) || blk.contains(('C', 'D'))
          ? const [_A, _B, _D]
          : null;
  int pc(List<AltNode> p) => (p.length - 1) * 10;

  // #1 — k=2 ⇒ [[A,C,D],[A,B,D]] (Yen: חוסם קשת מהמסלול-הזול, install_engine.dart:471-491).
  assert(_skus(findAlternativePaths(_A, _D,
          k: 2,
          shortestPath: sp,
          shortestPathExcluding: spx,
          pathCost: pc)) ==
      'A>C>D|A>B>D');

  // #2 — k=1 ⇒ רק המסלול-הזול, בלי חלופות (install_engine.dart:467).
  assert(_skus(findAlternativePaths(_A, _D,
          k: 1, shortestPath: sp, shortestPathExcluding: spx, pathCost: pc)) ==
      'A>C>D');

  // #3 — k≤0 ⇒ [] (install_engine.dart:457).
  assert(findAlternativePaths(_A, _D,
          k: 0, shortestPath: sp, shortestPathExcluding: spx, pathCost: pc)
      .isEmpty);

  // #4 — אין מסלול-ראשון (shortestPath=null) ⇒ [] (install_engine.dart:460).
  assert(findAlternativePaths(_A, _D,
          k: 3,
          shortestPath: (f, t, md, tc) => null,
          shortestPathExcluding: spx,
          pathCost: pc)
      .isEmpty);

  // #5 — אין חלופות (Excluding מחזיר תמיד null) ⇒ נעצר עם המסלול-הזול בלבד
  //      (install_engine.dart:490 bestCandidate ריק ⇒ break), גם כש-k=3.
  assert(_skus(findAlternativePaths(_A, _D,
          k: 3,
          shortestPath: sp,
          shortestPathExcluding: (f, t, md, tc, blk) => null,
          pathCost: pc)) ==
      'A>C>D');

  print('findAlternativePaths OK — 5 contract examples proven');
}
