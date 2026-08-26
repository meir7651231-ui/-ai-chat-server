// בדיקת-חוזה · scopeElementIds — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/scope_element_ids_test.dart
import 'scope_element_ids.dart';

// שקע-namespaceOf: החלק שלפני '/', אחרת המזהה כולו.
String _ns(String id) {
  final i = id.indexOf('/');
  return i < 0 ? id : id.substring(0, i);
}

final _ids = <String>{'cart/btn', 'cart/txt', 'home/hdr'};

Set<String> _s(String scope) => scopeElementIds(scope,
    ids: _ids,
    namespaceOf: _ns,
    all: 'all',
    screenPrefix: 'screen:',
    singlePrefix: 'element:');

void _eqSet(Set<String> got, Set<String> want, String label) {
  if (got.length != want.length || !got.containsAll(want)) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  _eqSet(_s('all'), _ids, '1 all'); n++;
  _eqSet(_s('screen:cart'), {'cart/btn', 'cart/txt'}, '2 screen cart'); n++;
  _eqSet(_s('screen:home'), {'home/hdr'}, '3 screen home'); n++;
  _eqSet(_s('screen:zzz'), <String>{}, '4 empty namespace'); n++;
  _eqSet(_s('element:cart/btn'), {'cart/btn'}, '5 single hit'); n++;
  _eqSet(_s('element:nope'), <String>{}, '6 single miss'); n++;
  _eqSet(_s('garbage'), <String>{}, '7 fail-closed'); n++;

  assert(_s('all').length == 3, 'assert-live guard');
  print('OK scopeElementIds: $n asserts passed');
}
