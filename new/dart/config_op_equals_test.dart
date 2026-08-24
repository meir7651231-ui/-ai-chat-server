// בדיקת-אטום · configOpEquals — מוכיחה בדיוק את דוגמאות config_op_equals.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/config_op_equals_test.dart ⇒ exit 0 + "configOpEquals OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4). הרתמה כאן מדמה את ConfigOp/CfgStyle/CfgAction — לא אטום-שכן.
import 'config_op_equals.dart';

// ── רתמה מקומית: 6 וריאנטים סגורים כמו config_store.dart:49-150 ──────────────
sealed class _Op {
  const _Op(this.id);
  final String id;
}

class _SetText extends _Op {
  const _SetText(super.id, this.text);
  final String? text;
}

class _SetEmoji extends _Op {
  const _SetEmoji(super.id, this.emoji);
  final String? emoji;
}

class _SetHidden extends _Op {
  const _SetHidden(super.id, this.hidden);
  final bool? hidden;
}

class _SetOrder extends _Op {
  const _SetOrder(super.id, this.order);
  final int? order;
}

class _SetStyle extends _Op {
  const _SetStyle(super.id, this.style);
  final _Style? style;
}

class _SetAction extends _Op {
  const _SetAction(super.id, this.action);
  final _Action? action;
}

// payload מקונן עם value-== (כמו CfgStyle/CfgAction, config_node.dart:139-149,181-184).
class _Style {
  const _Style(this.colorToken);
  final String colorToken;
  @override
  bool operator ==(Object o) => o is _Style && o.colorToken == colorToken;
  @override
  int get hashCode => colorToken.hashCode;
}

class _Action {
  const _Action(this.kind);
  final String kind;
  @override
  bool operator ==(Object o) => o is _Action && o.kind == kind;
  @override
  int get hashCode => kind.hashCode;
}

// שקעים — הבחנת-וריאנט, id, ושדה-payload פר-וריאנט (מזקק את switch-המקור).
Object? _kind(_Op op) => op.runtimeType;
Object? _id(_Op op) => op.id;
Object? _payload(_Op op) => switch (op) {
      _SetText o => o.text,
      _SetEmoji o => o.emoji,
      _SetHidden o => o.hidden,
      _SetOrder o => o.order,
      _SetStyle o => o.style,
      _SetAction o => o.action,
    };

bool _eq(_Op a, _Op b) =>
    configOpEquals<_Op>(a, b, kindOf: _kind, idOf: _id, payloadOf: _payload);

void main() {
  // #1 — SetText זהה ⇒ true (id∧text).
  assert(_eq(const _SetText('a', 'hi'), const _SetText('a', 'hi')) == true);
  // #2 — text שונה ⇒ false.
  assert(_eq(const _SetText('a', 'hi'), const _SetText('a', 'bye')) == false);
  // #3 — id שונה ⇒ false.
  assert(_eq(const _SetText('a', 'hi'), const _SetText('b', 'hi')) == false);
  // #4 — וריאנט שונה (SetText מול SetEmoji) ⇒ false.
  assert(_eq(const _SetText('a', 'x'), const _SetEmoji('a', 'x')) == false);
  // #5 — SetOrder זהה ⇒ true.
  assert(_eq(const _SetOrder('m', 3), const _SetOrder('m', 3)) == true);
  // #6 — order שונה ⇒ false.
  assert(_eq(const _SetOrder('m', 3), const _SetOrder('m', 5)) == false);
  // #7 — SetHidden זהה ⇒ true.
  assert(_eq(const _SetHidden('h', true), const _SetHidden('h', true)) == true);
  // #8 — hidden שונה ⇒ false.
  assert(
      _eq(const _SetHidden('h', true), const _SetHidden('h', false)) == false);
  // #9 — SetEmoji זהה ⇒ true.
  assert(_eq(const _SetEmoji('e', '🔧'), const _SetEmoji('e', '🔧')) == true);
  // #10 — SetStyle: value-== של payload מקונן ⇒ true (מופעים נפרדים, שדות זהים).
  assert(_eq(const _SetStyle('s', _Style('brand')),
          const _SetStyle('s', _Style('brand'))) ==
      true);
  // #11 — colorToken שונה ⇒ false.
  assert(_eq(const _SetStyle('s', _Style('brand')),
          const _SetStyle('s', _Style('ink'))) ==
      false);
  // #12 — SetAction: value-== ⇒ true.
  assert(_eq(const _SetAction('c', _Action('noop')),
          const _SetAction('c', _Action('noop'))) ==
      true);
  // #13 — payload null==null ⇒ true.
  assert(_eq(const _SetText('a', null), const _SetText('a', null)) == true);
  // #14 — null מול value ⇒ false.
  assert(_eq(const _SetText('a', null), const _SetText('a', 'x')) == false);
  // #15 — וריאנט שונה גובר גם על id זהה ⇒ false (לא נכנס להשוואת-שדות).
  assert(_eq(const _SetOrder('m', 3), const _SetStyle('m', _Style('brand'))) ==
      false);

  print('configOpEquals OK — 15/15 contract examples proven');
}
