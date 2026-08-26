// בדיקת-אטום · findShortestPathExcluding — מוכיחה בדיוק את find_shortest_path_excluding.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/find_shortest_path_excluding_test.dart ⇒ exit 0 + "findShortestPathExcluding OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4). הגרף מוזרק דרך השקעים.
import 'find_shortest_path_excluding.dart';

const _A = GraphNode(sku: 'A');
const _B = GraphNode(sku: 'B');
const _C = GraphNode(sku: 'C');
const _D = GraphNode(sku: 'D');

String _skus(List<GraphNode>? p) => p == null ? '∅' : p.map((e) => e.sku).join('>');

void main() {
  // גרף: A→[B,C] · B→[D] · C→[D] · D→[]. כל-הצמתים במערכת {supply}.
  Set<String> sys(GraphNode p) => {'supply'};
  List<GraphNode> nb(GraphNode t, int temp) => switch (t.sku) {
        'A' => const [_B, _C],
        'B' => const [_D],
        'C' => const [_D],
        _ => const [],
      };
  bool usable(GraphNode p) => true;
  int ec(GraphNode a, GraphNode b) => 10;

  List<GraphNode>? run(Set<(String, String)> blocked) => findShortestPathExcluding(
        _A, _D,
        maxDepth: 6, tempC: 20, blocked: blocked,
        systemsOf: sys, canConnect: (a, b) => false, neighbors: nb,
        usableConnector: usable, edgeCost: ec,
      );

  // #1 — blocked ריק ⇒ אותו מסלול כמו-החיפוש-הרגיל: A→C→D.
  assert(_skus(run({})) == 'A>C>D');

  // #2 — חסימת (A,C) ⇒ נאלץ דרך B: A→B→D (install_engine.dart:535).
  assert(_skus(run({('A', 'C')})) == 'A>B>D');

  // #3 — חסימת שתי-הקשתות-הראשונות (A,B)+(A,C) ⇒ אין-מסלול ⇒ null.
  assert(run({('A', 'B'), ('A', 'C')}) == null);

  // #4 — from==to ⇒ [from] (install_engine.dart:514).
  assert(_skus(findShortestPathExcluding(_A, _A,
          maxDepth: 6, tempC: 20, blocked: const {},
          systemsOf: sys, canConnect: (a, b) => false, neighbors: nb,
          usableConnector: usable, edgeCost: ec)) ==
      'A');

  // #5 — קיצור-הדרך הישיר (A,D) חסום ⇒ התנאי `canConnect && !blocked` נכשל
  //      (install_engine.dart:518), נופל ל-BFS ⇒ A→C→D.
  assert(_skus(findShortestPathExcluding(_A, _D,
          maxDepth: 6, tempC: 20, blocked: const {('A', 'D')},
          systemsOf: sys,
          canConnect: (a, b) => a.sku == 'A' && b.sku == 'D',
          neighbors: nb, usableConnector: usable, edgeCost: ec)) ==
      'A>C>D');

  print('findShortestPathExcluding OK — 5 contract examples proven');
}
