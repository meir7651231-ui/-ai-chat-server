// בדיקת-חוזה · materializeChain — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/materialize_chain_test.dart
import 'materialize_chain.dart';

// שקע דטרמיניסטי: מחבר בין עוגנים שונים, אין-מחבר (null) בין זהים.
String? _pipe(String a, String b) => a == b ? null : '($a>$b)';

void _eq(List<String> got, List<String> want, String label) {
  final g = got.join('|');
  final w = want.join('|');
  if (g != w) {
    throw StateError('FAIL [$label]: got="$g" want="$w"');
  }
}

void main() {
  var n = 0;

  _eq(materializeChain(const <String>[], pipeBetween: _pipe), const [], '1 empty'); n++;
  _eq(materializeChain(const ['solo'], pipeBetween: _pipe), const ['solo'], '2 single'); n++;
  _eq(materializeChain(const ['x', 'y'], pipeBetween: _pipe),
      const ['x', '(x>y)', 'y'], '3 pair'); n++;
  _eq(materializeChain(const ['a', 'b', 'c'], pipeBetween: _pipe),
      const ['a', '(a>b)', 'b', '(b>c)', 'c'], '4 triple'); n++;
  _eq(materializeChain(const ['x', 'x'], pipeBetween: _pipe),
      const ['x', 'x'], '5 null skip'); n++;
  _eq(materializeChain(const ['a', 'a', 'b'], pipeBetween: _pipe),
      const ['a', 'a', '(a>b)', 'b'], '6 mixed skip'); n++;

  // עותק, לא אותה-רשימה (length<2 ⇒ List.of).
  final src = <String>['only'];
  final out = materializeChain(src, pipeBetween: _pipe);
  if (identical(src, out)) throw StateError('FAIL [7 copy]: same instance');
  n++;

  assert(materializeChain(const ['p', 'q'], pipeBetween: _pipe).length == 3,
      'assert-live guard');

  print('OK materializeChain: $n asserts passed');
}
