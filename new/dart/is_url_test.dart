import 'is_url.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(isUrl('https://x.com/a.jpg'), true, '1'); n++;
  _eq(isUrl('http://x.com/a.jpg'), true, '2'); n++;
  _eq(isUrl('assets/lipskey/products/x.jpg'), false, '3'); n++;
  _eq(isUrl('page_03.jpg'), false, '4'); n++;
  print('✓ isUrl: $n');
}
