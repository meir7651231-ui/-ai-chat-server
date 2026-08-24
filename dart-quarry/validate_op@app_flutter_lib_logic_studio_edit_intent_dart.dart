// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _validateOp — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_intent.dart:171-217 (47 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toString, configOpFromJson, matchElementId, matchPropKey, matchActionId, matchCatalogActionId
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
ConfigOp? _validateOp(Object? entry, RegistryView reg) {
  if (entry is! Map) return null; // a stray non-object array element.
  final m = entry.map((k, v) => MapEntry(k.toString(), v));

  // SHAPE (step 69): a real ConfigOp tag with a non-empty id, or null. An
  // `addComponent`/`addRule` (no P1 variant) drops here → invented component gone.
  final shape = configOpFromJson(m);
  if (shape == null) return null;

  // FIELD 1 — target must be a REAL registry id (else drop). The RESOLVED id (exact
  // or longest-contained) is carried through, mirroring assistant_intent.dart:195.
  final target = matchElementId(reg, shape.id);
  if (target == null) return null;

  // FIELD 2 — the op-kind's axis must be an EDITABLE prop of that element (else drop).
  if (matchPropKey(reg, target, _axisOf(shape)) == null) return null;

  // FIELD 3/4 — value / action per kind, grounded where the registry constrains it.
  switch (shape) {
    case SetText(:final text):
      if (!_freeValueOk(reg, target, 'text', text)) return null;
      return SetText(target, text);
    case SetEmoji(:final emoji):
      if (!_freeValueOk(reg, target, 'emoji', emoji)) return null;
      return SetEmoji(target, emoji);
    case SetHidden(:final hidden):
      return SetHidden(target, hidden); // bool — no closed set (editability gated it).
    case SetOrder(:final order):
      return SetOrder(target, order); // int — no closed set.
    case SetStyle(:final style):
      final resolved = _resolveStyle(reg, target, style);
      if (!resolved.ok) return null; // an invented style token → drop.
      return SetStyle(target, resolved.style);
    case SetAction():
      // The action id is a bare string per the grammar (edit_prompt.dart:113), which
      // `configOpFromJson` leaves as a null CfgAction — so read it from the raw map.
      final id = _actionIdOf(m);
      if (id == null) return null;
      final onElement = matchActionId(reg, target, id); // legal ON this element?
      final inCatalog = matchCatalogActionId(id); // a REAL catalog action?
      if (onElement == null || inCatalog == null) return null;
      return SetAction(target, CfgAction(kind: onElement));
  }
}

/// The registry axis name for [op]'s kind — the prop key its editability is checked
/// against (`matchPropKey`). Mirrors P1's `EditAxis` names (element_registry.dart:23).
