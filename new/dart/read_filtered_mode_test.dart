import 'read_filtered_mode.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }

class _FakeStore implements EdgeKvStore {
  final Map<String,String> _m;
  _FakeStore(this._m);
  @override String? read(String key) => _m[key];
  @override void write(String key, String value) => _m[key] = value;
  @override void remove(String key) => _m.remove(key);
}

void main(){
  var n=0;
  _eq(readFilteredMode(_FakeStore({'bs_filtered_mode_v1':'1'})), true, '1'); n++;
  _eq(readFilteredMode(_FakeStore({})), false, '2'); n++;
  _eq(readFilteredMode(_FakeStore({'bs_filtered_mode_v1':'0'})), false, '3'); n++;
  _eq(readFilteredMode(_FakeStore({'bs_filtered_mode_v1':'true'})), false, '4'); n++;
  print('✓ readFilteredMode: $n');
}
