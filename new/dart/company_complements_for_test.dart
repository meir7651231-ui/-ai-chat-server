import '../dart-data/company_complements_for-terms.dart' as td_company_complements_for;
import 'company_complements_for.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  const pool = [
    LipskeyCatalogProduct(sku: 'a'),
    LipskeyCatalogProduct(sku: 'b'),
    LipskeyCatalogProduct(sku: 'c'),
  ];
  const p = LipskeyCatalogProduct(
    sku: 'root',
    dims: {'מוצרים משלימים': 'a|b|z'},
  );
  final out = companyComplementsFor(p, pool, term: (k)=>td_company_complements_for.kTerms[k]!);
  _eq(out.length, 2, '1');
  n++;
  _eq(out.first.sku, 'a', '2');
  n++;
  _eq(out.last.sku, 'b', '3');
  n++;
  const bare = LipskeyCatalogProduct(sku: 'x');
  _eq(companyComplementsFor(bare, pool, term: (k)=>td_company_complements_for.kTerms[k]!).length, 0, '4');
  n++;
  print('✓ companyComplementsFor: $n');
}
