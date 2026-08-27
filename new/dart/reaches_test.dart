import 'reaches.dart';

PlainNode _node(String tech) => PlainNode(
      superCat: 's',
      classification: 'c',
      technical: tech,
      slang: 'x',
      english: 'y',
      usage: 'z',
    );

// stub-אמת: צומת שה-technical שלו 'hit' מגיע ל-2 מוצרים, אחרת ריק.
List<Object?> plainProductsFor(PlainNode n) =>
    n.technical == 'hit' ? const [1, 2] : const [];

void main() {
  assert(reaches(_node('hit'), plainProductsFor: plainProductsFor) == true);
  assert(reaches(_node('miss'), plainProductsFor: plainProductsFor) == false);
  print('reaches OK');
}
