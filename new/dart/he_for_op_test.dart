import '../dart-data/he_for_op-terms.dart' as td_he_for_op;
// בדיקת-חוזה · heForOp — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/he_for_op_test.dart
import 'he_for_op.dart';

// שקעים מייצגים (אוצר-מילים אמיתי מ-action_catalog.dart:134,161).
String? _actionHe(String kind) =>
    const {'nav.screen': 'מעבר למסך', 'cart.add': 'הוסף לסל'}[kind];

String _styleHe(String id, OpStyle? s) => s?.colorToken == null
    ? 'שינוי עיצוב: $id'
    : 'שינוי צבע: $id ← ${s!.colorToken}';

String _run(ConfigOp op) => heForOp(op, actionHe: _actionHe, styleHe: _styleHe, term: (k)=>td_he_for_op.kTerms[k]!);

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(_run(const SetText('title')), 'שינוי טקסט: title', '1 setText'); n++;
  _eq(_run(const SetEmoji('logo')), 'שינוי אמוג׳י: logo', '2 setEmoji'); n++;
  _eq(_run(const SetHidden('fab', null)), 'שינוי נראות: fab', '3 hidden-null'); n++;
  _eq(_run(const SetHidden('fab', true)), 'הסתרה: fab', '4 hidden-true'); n++;
  _eq(_run(const SetHidden('fab', false)), 'הצגה: fab', '5 hidden-false'); n++;
  _eq(_run(const SetOrder('menu', null)), 'שינוי סדר: menu', '6 order-null'); n++;
  _eq(_run(const SetOrder('menu', 3)), 'שינוי סדר: menu ← 3', '7 order-arrow'); n++;
  _eq(_run(const SetStyle('btn', OpStyle(colorToken: 'success'))),
      'שינוי צבע: btn ← success', '8 style-via-socket'); n++;
  _eq(_run(const SetStyle('btn', null)), 'שינוי עיצוב: btn', '9 style-null-through'); n++;
  _eq(_run(const SetAction('card', null)), 'ניקוי פעולה: card', '10 action-clear'); n++;
  // ‏:177 verbatim — שורת-פעולה בלי id.
  _eq(_run(const SetAction('card', OpAction('nav.screen'))),
      'פעולה: מעבר למסך', '11 action-catalog-no-id'); n++;
  _eq(_run(const SetAction('card', OpAction('zzz'))),
      'פעולה: zzz', '12 action-fallback-kind'); n++;

  assert(_run(const SetText('t')) == 'שינוי טקסט: t', 'assert-live guard');

  print('OK heForOp: $n asserts passed');
}
