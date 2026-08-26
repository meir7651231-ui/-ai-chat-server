// בדיקת-אטום · findShortestPath — מוכיחה בדיוק את דוגמאות find_shortest_path.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/find_shortest_path_test.dart ⇒ exit 0 + "findShortestPath OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4). הגרף מוזרק דרך השקעים.
import 'find_shortest_path.dart';

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

  // #1 — from==to ⇒ [from] (install_engine.dart:559).
  assert(_skus(findShortestPath(_A, _A,
          systemsOf: sys, canConnect: (a, b) => false, neighbors: nb,
          usableConnector: usable, edgeCost: ec)) ==
      'A');

  // #2 — מערכות זרות ⇒ null (install_engine.dart:570).
  assert(findShortestPath(_A, _D,
          systemsOf: (p) => p.sku == 'A' ? {'supply'} : {'drainage'},
          canConnect: (a, b) => false, neighbors: nb,
          usableConnector: usable, edgeCost: ec) ==
      null);

  // #3 — canConnect ישיר ⇒ [from,to] בלי BFS (install_engine.dart:571).
  assert(_skus(findShortestPath(_A, _B,
          systemsOf: sys, canConnect: (a, b) => true, neighbors: nb,
          usableConnector: usable, edgeCost: ec)) ==
      'A>B');

  // #4 — BFS: canConnect=false ⇒ המסלול הזול A→C→D (סדר-ה-LIFO + דחיית-שוויון,
  //      install_engine.dart:585,602 — נתיב-B נדחה בשוויון-מחיר).
  assert(_skus(findShortestPath(_A, _D,
          systemsOf: sys, canConnect: (a, b) => false, neighbors: nb,
          usableConnector: usable, edgeCost: ec)) ==
      'A>C>D');

  // #5 — אין-מסלול תוך maxDepth ⇒ null (install_engine.dart:591,607).
  assert(findShortestPath(_A, _D,
          maxDepth: 1,
          systemsOf: sys, canConnect: (a, b) => false, neighbors: nb,
          usableConnector: usable, edgeCost: ec) ==
      null);

  print('findShortestPath OK — 5 contract examples proven');
}
