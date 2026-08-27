import 'seed_pool.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  const universe = [
    LipskeyCatalogProduct(sku: 'a'),
    LipskeyCatalogProduct(sku: 'b'),
    LipskeyCatalogProduct(sku: 'c'),
  ];
  final seed = CardSeed(seedPredicate: (p) => p.sku == 'b');
  final out = seedPool(seed, universe);
  _eq(out.length, 1, '1');
  n++;
  _eq(out.first.sku, 'b', '2');
  n++;
  final all = seedPool(CardSeed(seedPredicate: (_) => true), universe);
  _eq(all.length, 3, '3');
  n++;
  print('✓ seedPool: $n');
}
