// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · frozen — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/registry_view.dart:69-149 (81 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): elementIds, propKeysFor, actionIdsFor, allowedValues, componentTypes, unmodifiable
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  RegistryView frozen() {
    final ids = elementIds();
    final propKeys = <String, Set<String>>{};
    final allowed = <String, Map<String, Set<String>>>{};
    final actions = <String, Set<String>>{};
    for (final id in ids) {
      final pk = propKeysFor(id);
      if (pk.isNotEmpty) propKeys[id] = pk;
      final acts = actionIdsFor(id);
      if (acts.isNotEmpty) actions[id] = acts;
      final byProp = <String, Set<String>>{};
      for (final k in pk) {
        final vals = allowedValues(id, k);
        if (vals.isNotEmpty) byProp[k] = vals;
      }
      if (byProp.isNotEmpty) allowed[id] = byProp;
    }
    return FakeRegistryView.of(
      ids: ids,
      propKeys: propKeys,
      allowedValues: allowed,
      actionIds: actions,
      componentTypes: componentTypes(),
    );
  }
}

/// An in-memory [RegistryView] built from EXACTLY the sets injected — the fake that
/// lets every grounding test (steps 71+) stand up a minimal, isolated registry
/// (§6). Scaffolding only: the REAL grounding source is [ElementRegistryView]; a
/// fake can never self-certify green because it must pass the SAME
/// `registryViewContract` as the real adapter (R2-#15). All stored sets are
/// UNMODIFIABLE, so a returned set can't be mutated to widen the closed set.
class FakeRegistryView extends RegistryView {
  /// Build a fake from injected sets. [ids] is unioned with the keys of the other
  /// maps, so an id mentioned only in [propKeys]/[actionIds]/[allowedValues] is
  /// still a valid element (no half-registered ids).
  FakeRegistryView.of({
    Set<String> ids = const {},
    Map<String, Set<String>> propKeys = const {},
    Map<String, Map<String, Set<String>>> allowedValues = const {},
    Map<String, Set<String>> actionIds = const {},
    Set<String> componentTypes = const {},
  })  : _ids = Set<String>.unmodifiable(<String>{
          ...ids,
          ...propKeys.keys,
          ...allowedValues.keys,
          ...actionIds.keys,
        }),
        _propKeys = {
          for (final e in propKeys.entries)
            e.key: Set<String>.unmodifiable(e.value),
        },
        _allowedValues = {
          for (final e in allowedValues.entries)
            e.key: {
              for (final v in e.value.entries)
                v.key: Set<String>.unmodifiable(v.value),
            },
        },
        _actionIds = {
          for (final e in actionIds.entries)
            e.key: Set<String>.unmodifiable(e.value),
        },
        _componentTypes = Set<String>.unmodifiable(componentTypes);

  final Set<String> _ids;
  final Map<String, Set<String>> _propKeys;
  final Map<String, Map<String, Set<String>>> _allowedValues;
  final Map<String, Set<String>> _actionIds;
  final Set<String> _componentTypes;

  static const Set<String> _empty = <String>{};

  @override
  Set<String> elementIds() => _ids;

  @override
  Set<String> propKeysFor(String id) => _propKeys[id] ?? _empty;

  @override
