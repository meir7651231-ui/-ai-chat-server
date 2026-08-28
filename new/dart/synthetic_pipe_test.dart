import 'synthetic_pipe.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;

  // 1) HDPE — מוצר + מפרט מלאים (install_engine.dart:1017-1039)
  final cache = <String, LipskeyCatalogProduct>{};
  final specs = <String, VerifiedSpec>{};
  final p = syntheticPipe('HDPE', '32', pipeCache: cache, verifiedSpecs: specs);
  _eq(p.sku, 'PIPE-HDPE-32', '1-sku');
  n++;
  _eq(p.nameHe, 'צינור HDPE DN32 (לפי מטר)', '2-nameHe');
  n++;
  _eq(p.nameEn, 'HDPE pipe DN32 (cut to length)', '3-nameEn');
  n++;
  _eq(p.categoryHe, 'צינורות', '4-catHe');
  n++;
  _eq(p.categoryEn, 'Pipes', '5-catEn');
  n++;
  _eq(p.categoryEmoji, '📏', '6-emoji');
  n++;
  _eq(p.page, 0, '7-page');
  n++;
  _eq(p.brand, 'AQUATEC', '8-brand');
  n++;
  final s = specs['PIPE-HDPE-32']!;
  _eq(s.material, 'HDPE', '9-mat');
  n++;
  _eq(s.maxTempC, 40.0, '10-hdpe-40');
  n++;
  _eq(s.ends.length, 2, '11-two-ends');
  n++;
  _eq(s.ends[0].type, EndType.hdpeCompression, '12-end-type');
  n++;
  _eq(s.ends[0].size, '32', '13-end-size');
  n++;
  _eq(s.ends[1].type, EndType.hdpeCompression, '14-end2-type');
  n++;
  _eq(s.ends[1].size, '32', '15-end2-size');
  n++;
  _eq(cache.length, 1, '16-cache-1');
  n++;
  _eq(specs.length, 1, '17-specs-1');
  n++;

  // 2) לא-HDPE ⇒ maxTempC=95 (‏:1028)
  final p2 = syntheticPipe('PEX', '25', pipeCache: cache, verifiedSpecs: specs);
  _eq(p2.sku, 'PIPE-PEX-25', '18-sku2');
  n++;
  _eq(specs['PIPE-PEX-25']!.maxTempC, 95.0, '19-pex-95');
  n++;
  _eq(cache.length, 2, '20-cache-2');
  n++;

  // 3) פגיעת-מטמון ⇒ אותו מופע, builder מדולג — verifiedSpecs לא נגוע (‏:1018 putIfAbsent)
  specs.remove('PIPE-HDPE-32'); // מדמה: המפרט נמחק אבל המוצר עדיין במטמון
  final p3 = syntheticPipe('HDPE', '32', pipeCache: cache, verifiedSpecs: specs);
  _eq(identical(p3, p), true, '21-identical');
  n++;
  _eq(specs.containsKey('PIPE-HDPE-32'), false, '22-builder-skipped');
  n++;

  // 4) מפרט-קיים לא נדרס (‏:1019 putIfAbsent) — cache miss אבל spec קיים
  const preSpec = VerifiedSpec(
      sku: 'PIPE-CU-15', material: 'ידני', ends: [], maxTempC: 7);
  specs['PIPE-CU-15'] = preSpec;
  final p4 = syntheticPipe('CU', '15', pipeCache: cache, verifiedSpecs: specs);
  _eq(p4.sku, 'PIPE-CU-15', '23-sku4');
  n++;
  _eq(identical(specs['PIPE-CU-15'], preSpec), true, '24-spec-not-overwritten');
  n++;

  // 5) קצה: dn עם גרש (אינץ') — אינטרפולציה ישרה
  final cache2 = <String, LipskeyCatalogProduct>{};
  final specs2 = <String, VerifiedSpec>{};
  final p5 =
      syntheticPipe('PPR', '3/4"', pipeCache: cache2, verifiedSpecs: specs2);
  _eq(p5.sku, 'PIPE-PPR-3/4"', '25-inch-sku');
  n++;
  _eq(p5.nameHe, 'צינור PPR DN3/4" (לפי מטר)', '26-inch-name');
  n++;
  _eq(specs2['PIPE-PPR-3/4"']!.maxTempC, 95.0, '27-ppr-95');
  n++;

  print('✓ syntheticPipe: $n');
}
