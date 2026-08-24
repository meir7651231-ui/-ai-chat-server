// בדיקת-אטום · canPlace — מוכיחה בדיוק את דוגמאות can_place.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/can_place_test.dart ⇒ exit 0 + "canPlace OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4). ה-enums/המפה כאן = רתמת-בדיקה מקומית (לא אטום-שכן).
import 'can_place.dart';

// רתמה מקומית שמדמה את component_palette.dart: kComponentPalette + templateFor.
enum _Type { button, divider, missing }

enum _Kind { container, list, action, text, theme }

// המקור: כל תבנית allowedContainers = {container, list} (component_palette.dart:167,189).
const Map<_Type, Set<_Kind>> _palette = <_Type, Set<_Kind>>{
  _Type.button: {_Kind.container, _Kind.list},
  _Type.divider: {_Kind.container, _Kind.list},
  // _Type.missing מדולג בכוונה ⇒ templateFor==null ⇒ null.
};

// שקע: templateFor(type)?.allowedContainers.
Set<_Kind>? _allowedFor(_Type t) => _palette[t];

bool _place(_Type type, _Kind container) =>
    canPlace<_Type, _Kind>(type, container, allowedContainersFor: _allowedFor);

void main() {
  // #1 — button → container ⇒ true (‏{container,list}.contains(container)).
  assert(_place(_Type.button, _Kind.container) == true);

  // #2 — button → list ⇒ true.
  assert(_place(_Type.button, _Kind.list) == true);

  // #3 — button → action ⇒ false (מין-בקרה מחוץ לקבוצה — §4).
  assert(_place(_Type.button, _Kind.action) == false);

  // #4 — button → text ⇒ false (leaf מחוץ לקבוצה — §4).
  assert(_place(_Type.button, _Kind.text) == false);

  // #5 — button → theme ⇒ false (styling מחוץ לקבוצה — §4).
  assert(_place(_Type.button, _Kind.theme) == false);

  // #6 — divider → container ⇒ true.
  assert(_place(_Type.divider, _Kind.container) == true);

  // #7 — missing → container ⇒ false (allowed==null, fail-closed).
  assert(_place(_Type.missing, _Kind.container) == false);

  print('canPlace OK — 7/7 contract examples proven');
}
