// בדיקת-אטום · configOpFromJson — מוכיחה בדיוק את דוגמאות config_op_from_json.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/config_op_from_json_test.dart ⇒ exit 0 + "configOpFromJson OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4). ה-record + השקעים כאן = רתמת-בדיקה מקומית
// שמדמה את המשפחה-הסגורה SetText·SetEmoji·… (config_store.dart) — לא אטום-שכן.
import 'config_op_from_json.dart';

// רתמה: כל וריאנט מיוצג כ-record `(tag, id, val)` — מוכיח איזה שקע נקרא ובאיזה ערך.
typedef _Op = (String tag, String id, Object? val);

_Op? _from(Object? raw) => configOpFromJson<_Op>(
      raw,
      setText: (id, t) => ('setText', id, t),
      setEmoji: (id, e) => ('setEmoji', id, e),
      setHidden: (id, h) => ('setHidden', id, h),
      setOrder: (id, o) => ('setOrder', id, o),
      setStyle: (id, s) => ('setStyle', id, s),
      setAction: (id, a) => ('setAction', id, a),
    );

// השוואת-ערך למפה (records לא משווים מפות עמוק) — לצורך #16/#17/#19.
bool _mapEq(Object? a, Map<String, dynamic> b) {
  if (a is! Map) return false;
  if (a.length != b.length) return false;
  for (final e in b.entries) {
    if (a[e.key] != e.value) return false;
  }
  return true;
}

void main() {
  // #1 — null ⇒ null (אינו Map, :78).
  assert(_from(null) == null);

  // #2 — String ⇒ null (:78).
  assert(_from('hi') == null);

  // #3 — מפה ריקה ⇒ null (id חסר, :82).
  assert(_from(<String, Object?>{}) == null);

  // #4 — id ריק ⇒ null (:82).
  assert(_from({'id': '', 'op': 'setText'}) == null);

  // #5 — id אינו String ⇒ null (:82).
  assert(_from({'id': 5, 'op': 'setText'}) == null);

  // #6 — setText עם text ⇒ ('setText','a','hi').
  assert(_from({'id': 'a', 'op': 'setText', 'text': 'hi'}) == ('setText', 'a', 'hi'));

  // #7 — setText בלי text ⇒ val null (:88).
  assert(_from({'id': 'a', 'op': 'setText'}) == ('setText', 'a', null));

  // #8 — text=5 (לא String) ⇒ val null (:88).
  assert(_from({'id': 'a', 'op': 'setText', 'text': 5}) == ('setText', 'a', null));

  // #9 — setEmoji ⇒ ('setEmoji','a','🔥').
  assert(_from({'id': 'a', 'op': 'setEmoji', 'emoji': '🔥'}) == ('setEmoji', 'a', '🔥'));

  // #10 — setHidden true.
  assert(_from({'id': 'a', 'op': 'setHidden', 'hidden': true}) == ('setHidden', 'a', true));

  // #11 — hidden='yes' (לא bool) ⇒ null (:94).
  assert(_from({'id': 'a', 'op': 'setHidden', 'hidden': 'yes'}) == ('setHidden', 'a', null));

  // #12 — setOrder int 3.
  assert(_from({'id': 'a', 'op': 'setOrder', 'order': 3}) == ('setOrder', 'a', 3));

  // #13 — order 3.9 ⇒ 3 (קיצוץ לכיוון-אפס, :97).
  assert(_from({'id': 'a', 'op': 'setOrder', 'order': 3.9}) == ('setOrder', 'a', 3));

  // #14 — order -2.9 ⇒ -2 (שלילי מקצץ ל--2, :97).
  assert(_from({'id': 'a', 'op': 'setOrder', 'order': -2.9}) == ('setOrder', 'a', -2));

  // #15 — order='3' (לא num) ⇒ null (:97).
  assert(_from({'id': 'a', 'op': 'setOrder', 'order': '3'}) == ('setOrder', 'a', null));

  // #16 — setStyle עם מפה string-keyed ⇒ אותה מפה.
  final r16 = _from({'id': 'a', 'op': 'setStyle', 'style': {'c': 1}});
  assert(r16 != null && r16.$1 == 'setStyle' && r16.$2 == 'a' && _mapEq(r16.$3, {'c': 1}));

  // #17 — setStyle עם מפתח לא-String {7:'x'} ⇒ מנורמל ל-{'7':'x'} (:100,143).
  final r17 = _from({'id': 'a', 'op': 'setStyle', 'style': {7: 'x'}});
  assert(r17 != null && r17.$1 == 'setStyle' && _mapEq(r17.$3, {'7': 'x'}));

  // #18 — setStyle בלי style ⇒ val null (:100).
  assert(_from({'id': 'a', 'op': 'setStyle'}) == ('setStyle', 'a', null));

  // #19 — setAction עם מפה ⇒ אותה מפה.
  final r19 = _from({'id': 'a', 'op': 'setAction', 'action': {'k': 'v'}});
  assert(r19 != null && r19.$1 == 'setAction' && r19.$2 == 'a' && _mapEq(r19.$3, {'k': 'v'}));

  // #20 — תג לא-מוכר ⇒ null (:104-105).
  assert(_from({'id': 'a', 'op': 'unknown'}) == null);

  // #21 — op חסר ⇒ default ⇒ null (:105).
  assert(_from({'id': 'a'}) == null);

  // #22 — תג-משפחה-נושנת addComponent ⇒ drop ⇒ null (:105).
  assert(_from({'id': 'a', 'op': 'addComponent'}) == null);

  print('configOpFromJson OK — 22/22 contract examples proven');
}
