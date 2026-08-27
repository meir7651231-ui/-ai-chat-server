import 'verified_spec_to_doc.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  const spec = VerifiedSpec(
    sku: 'X1',
    ends: [ConnectorEnd(EndType.bspMale, '1/2')],
    material: 'brass',
  );
  final doc = verifiedSpecToDoc(spec);
  _eq(doc['sku'], 'X1', '1');
  n++;
  _eq(doc['maxTempC'], 40.0, '2');
  n++;
  final ends = doc['ends'] as List;
  final e0 = ends.first as Map;
  _eq(e0['type'], 'bspMale', '3');
  n++;
  _eq(e0['size'], '1/2', '4');
  n++;
  _eq(doc.containsKey('pexType'), false, '5');
  n++;

  const spec2 = VerifiedSpec(
    sku: 'X2',
    ends: [],
    material: 'pvc',
    systemOverride: WaterSystem.drainage,
    pexType: 'PEX-B',
  );
  final doc2 = verifiedSpecToDoc(spec2);
  _eq(doc2['systemOverride'], 'drainage', '6');
  n++;
  _eq(doc2['pexType'], 'PEX-B', '7');
  n++;
  print('✓ verifiedSpecToDoc: $n');
}
