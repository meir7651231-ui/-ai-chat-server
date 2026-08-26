// בדיקת-חוזה · expandScope — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/expand_scope_test.dart
import 'expand_scope.dart';

void _eq(List<String> got, List<String> want, String label) {
  if (got.length != want.length ||
      !List.generate(got.length, (i) => got[i] == want[i]).every((x) => x)) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  const ids = {'a', 'a.b', 'a.c', 'b', 'btn1', 'btn2'};
  const acts = {
    'btn1': ['tap'],
    'btn2': ['tap'],
  };
  Iterable<String> elementIds() => ids;
  Iterable<String> actionIdsFor(String id) => acts[id] ?? const <String>[];
  String? matchElementId(String raw) => ids.contains(raw) ? raw : null;
  Iterable<String> scopeElementIds(String tok) {
    switch (tok) {
      case 'ALL':
        return const ['b', 'a', 'a']; // dup+unsorted ⇒ מוכיח dedup/sort
      case 'screen:home':
        return const ['btn1', 'ghost']; // ghost לא-אמיתי ⇒ מסונן
      default:
        return const <String>[];
    }
  }

  List<String> ex(String token) => expandScope(
        token,
        elementIds: elementIds,
        actionIdsFor: actionIdsFor,
        matchElementId: matchElementId,
        scopeElementIds: scopeElementIds,
        scopeActionable: 'ACT',
        scopeEveryPrefix: 'every:',
        scopeSinglePrefix: 'one:',
        scopeAll: 'ALL',
        scopeScreenPrefix: 'screen:',
      );

  _eq(ex('ACT'), ['btn1', 'btn2'], '1 actionable'); n++;
  _eq(ex('every:a'), ['a', 'a.b', 'a.c'], '2 namespace subtree'); n++;
  _eq(ex('every:'), [], '3 empty ns'); n++;
  _eq(ex('every:   '), [], '4 ns trims to empty'); n++;
  _eq(ex('one:a.b'), ['a.b'], '5 single match'); n++;
  _eq(ex('one:zzz'), [], '6 single miss'); n++;
  _eq(ex('ALL'), ['a', 'b'], '7 all dedup+sort'); n++;
  _eq(ex('screen:home'), ['btn1'], '8 screen filters ghost'); n++;
  _eq(ex('nope'), [], '9 unknown fail-closed'); n++;

  assert(ex('nope').isEmpty, 'assert-live guard');

  print('OK expandScope: $n asserts passed');
}
