import '../dart-data/style_he-terms.dart' as td_style_he;
// בדיקת-חוזה · styleHe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/style_he_test.dart
import 'style_he.dart';

// שקעים מייצגים.
List<String> _allowed(String id, String attr) =>
    (id == 'btn' && attr == 'color') ? const ['primary', 'danger', 'gray'] : const [];

String _colorHe(String token) =>
    const {'primary': 'ראשי', 'danger': 'אדום'}[token] ?? token;

String _run(String id, String? token) =>
    styleHe(id, colorToken: token, allowedValues: _allowed, colorHe: _colorHe, term: (k)=>td_style_he.kTerms[k]!);

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(_run('btn', null), 'שינוי עיצוב: btn', '1 no-token'); n++;
  _eq(_run('btn', 'primary'), 'שינוי צבע: btn ← ראשי', '2 vouched-named'); n++;
  _eq(_run('btn', 'danger'), 'שינוי צבע: btn ← אדום', '3 vouched-named'); n++;
  _eq(_run('btn', 'neon'), 'שינוי צבע: btn', '4 unvouched'); n++;
  _eq(_run('box', 'primary'), 'שינוי צבע: box', '5 empty-allowed'); n++;
  _eq(_run('btn', 'gray'), 'שינוי צבע: btn ← gray', '6 vouched-degrades-to-token'); n++;

  assert(_run('btn', null) == 'שינוי עיצוב: btn', 'assert-live guard');

  print('OK styleHe: $n asserts passed');
}
