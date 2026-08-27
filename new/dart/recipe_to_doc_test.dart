import 'recipe_to_doc.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  const r = SmartProduct(
    key: 'k',
    name: 'n',
    emoji: 'e',
    cat: 'c',
    diagramTitle: 'd',
    brands: [SmartBrand(name: 'b1', tag: 't', rec: true, sku: 's1')],
    acc: [SmartAcc(name: 'a1', emoji: 'x', why: 'w', must: true)],
    stages: [SmartStage(emoji: 'z', label: 'L', sub: 'S')],
  );
  final doc = recipeToDoc(r);
  _eq(doc['key'], 'k', '1');
  n++;
  final b0 = (doc['brands'] as List).first as Map;
  _eq(b0['name'], 'b1', '2');
  n++;
  _eq(b0['sku'], 's1', '3');
  n++;
  _eq(b0.containsKey('imageAsset'), false, '4');
  n++;
  final a0 = (doc['acc'] as List).first as Map;
  _eq(a0['must'], true, '5');
  n++;
  _eq(a0.containsKey('sku'), false, '6');
  n++;
  final s0 = (doc['stages'] as List).first as Map;
  _eq(s0['isFinal'], false, '7');
  n++;
  print('✓ recipeToDoc: $n');
}
