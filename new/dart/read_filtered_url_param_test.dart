import 'read_filtered_url_param.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){ var n=0; _eq(readFilteredUrlParam(), null, '1'); n++; print('✓ readFilteredUrlParam: $n'); }
