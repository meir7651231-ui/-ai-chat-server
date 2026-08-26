// בדיקת-חוזה · studioScopeTokens — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/studio_scope_tokens_test.dart
import 'studio_scope_tokens.dart';

// namespaceOf מייצג: החלק שלפני '.' הראשון; אין '.' ⇒ ''.
String _ns(String id) {
  final i = id.indexOf('.');
  return i <= 0 ? '' : id.substring(0, i);
}

Set<String> _run(List<String> ids) => studioScopeTokens(
      elementIds: () => ids,
      namespaceOf: _ns,
      scopeAll: 'scope:all',
      screenPrefix: 'scope:screen:',
    );

void _eq(Set<String> got, Set<String> want, String label) {
  if (got.length != want.length || !got.containsAll(want)) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  _eq(_run(const []), {'scope:all'}, '1 empty'); n++;
  _eq(_run(const ['home.title']), {'scope:all', 'scope:screen:home'}, '2 one'); n++;
  _eq(_run(const ['home.title', 'home.btn']),
      {'scope:all', 'scope:screen:home'}, '3 dedupe'); n++;
  _eq(_run(const ['home.a', 'cart.b']),
      {'scope:all', 'scope:screen:home', 'scope:screen:cart'}, '4 two-screens'); n++;
  _eq(_run(const ['', 'flat']), {'scope:all'}, '5 empty-ns-skipped'); n++;

  assert(_run(const []).contains('scope:all'), 'assert-live guard');

  print('OK studioScopeTokens: $n asserts passed');
}
