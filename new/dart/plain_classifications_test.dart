// בדיקת-אטום · plainClassifications
import 'plain_classifications.dart';

void main() {
  final nodes = <PlainNode>[
    const PlainNode(superCat: 'A', classification: 'x'),
    const PlainNode(superCat: 'A', classification: 'x'), // כפול — מסונן
    const PlainNode(superCat: 'A', classification: 'y'),
    const PlainNode(superCat: 'A', classification: 'z'), // לא-מגיע — מסונן
    const PlainNode(superCat: 'B', classification: 'w'), // superCat אחר
  ];
  List<PlainNode> allNodes() => nodes;
  bool reaches(PlainNode n) => n.classification != 'z';

  // A: x (dedup), y (z מסונן, w שייך ל-B)
  final a = plainClassifications('A', allNodes: allNodes, reaches: reaches);
  assert(a.length == 2, 'A → 2, got ${a.length}');
  assert(a[0] == 'x' && a[1] == 'y', 'A order xy, got $a');

  // B: w בלבד
  final b = plainClassifications('B', allNodes: allNodes, reaches: reaches);
  assert(b.length == 1 && b[0] == 'w', 'B → [w], got $b');

  // superCat לא-קיים → ריק
  final c = plainClassifications('Z', allNodes: allNodes, reaches: reaches);
  assert(c.isEmpty, 'Z → empty, got $c');

  print('plainClassifications OK');
}
