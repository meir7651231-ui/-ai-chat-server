import 'data_url_mime.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(dataUrlMime('data:image/jpeg;base64,AAA'), 'image/jpeg', '1');
  n++;
  _eq(dataUrlMime('http://x'), null, '2');
  n++;
  _eq(dataUrlMime('data:;base64,'), null, '3');
  n++;
  _eq(dataUrlMime('data:text/plain;,'), 'text/plain', '4');
  n++;
  print('✓ dataUrlMime: $n');
}
