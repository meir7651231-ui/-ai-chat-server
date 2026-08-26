// בדיקת-חוזה · pipeConnectionDn — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/pipe_connection_dn_test.dart
import 'pipe_connection_dn.dart';

class _Prod {
  final String sku;
  const _Prod(this.sku);
}

final Map<String, List<ConnEnd>> _ends = {
  'HD32': [const ConnEnd(EndType.hdpeCompression, '32')],
  'HD25': [const ConnEnd(EndType.hdpeCompression, '25')],
  // רב-קצוות: הראשון '25' לא-תואם, השני '32' תואם ⇒ '32'.
  'MULTI': [
    const ConnEnd(EndType.hdpeCompression, '25'),
    const ConnEnd(EndType.hdpeCompression, '32'),
  ],
  'BM': [const ConnEnd(EndType.bspMale, '1/2"')],
  'BF': [const ConnEnd(EndType.bspFemale, '1/2"')],
  // 'RAW' — חסר ⇒ null.
};

List<ConnEnd>? _endsOf(_Prod p) => _ends[p.sku];

String? _dn(String a, String b) =>
    pipeConnectionDn(_Prod(a), _Prod(b), endsOf: _endsOf);

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(_dn('HD32', 'HD32'), '32', '1 same DN ⇒ 32');              n++;
  _eq(_dn('HD32', 'HD25'), null, '2 different DN ⇒ null');       n++;
  _eq(_dn('BM', 'BF'), null, '3 thread (not pipe) ⇒ null');      n++;
  _eq(_dn('HD32', 'RAW'), null, '4 no spec ⇒ null');             n++;
  _eq(_dn('MULTI', 'HD32'), '32', '5 first matching pair ⇒ 32'); n++;

  assert(_dn('HD32', 'HD32') == '32', 'assert-live guard');
  print('OK pipeConnectionDn: $n asserts passed');
}
