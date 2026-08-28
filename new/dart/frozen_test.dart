// בדיקת-חוזה · frozen — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/frozen_test.dart
import 'frozen.dart';

void _eqSet(Set<String> got, Set<String> want, String label) {
  if (got.length != want.length || !got.containsAll(want)) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // מקור חי (mutable) — כדי להוכיח יציבות-צילום (§9).
  final srcIds = <String>{'a', 'b', 'c'};
  final srcPk = <String, Set<String>>{
    'a': {'color', 'size'},
  };
  final srcAllowed = <String, Map<String, Set<String>>>{
    'a': {
      'color': {'red', 'blue'},
    },
    // פיתיון (:80): ל-b יש ערכים אך אין לו prop-keys ⇒ לא-נשאל, לא-נאסף.
    'b': {
      'color': {'green'},
    },
  };
  final srcActs = <String, Set<String>>{
    'c': {'tap'},
  };
  final srcTypes = <String>{'button'};

  final snap = frozen(
    elementIds: () => Set.of(srcIds),
    propKeysFor: (id) => srcPk[id] ?? const <String>{},
    allowedValues: (id, k) => srcAllowed[id]?[k] ?? const <String>{},
    actionIdsFor: (id) => srcActs[id] ?? const <String>{},
    componentTypes: () => Set.of(srcTypes),
  );

  _eqSet(snap.elementIds(), {'a', 'b', 'c'}, '1 elementIds'); n++;
  _eqSet(snap.propKeysFor('a'), {'color', 'size'}, '2 propKeys a'); n++;
  _eqSet(snap.propKeysFor('b'), {}, '3 propKeys b empty-not-collected'); n++;
  _eqSet(snap.allowedValues('a', 'color'), {'red', 'blue'}, '4 allowed a.color'); n++;
  _eqSet(snap.allowedValues('b', 'color'), {},
      '5 bait blocked — b has no prop-keys so never queried (:80)'); n++;
  _eqSet(snap.allowedValues('a', 'size'), {}, '6 allowed a.size empty-in-source'); n++;
  _eqSet(snap.actionIdsFor('c'), {'tap'}, '7 actions c'); n++;
  _eqSet(snap.actionIdsFor('zzz'), {}, '8 unknown id fail-closed'); n++;
  _eqSet(snap.propKeysFor('zzz'), {}, '9 unknown id fail-closed (props)'); n++;
  _eqSet(snap.componentTypes(), {'button'}, '10 componentTypes'); n++;

  // 11-14 — unmodifiable בכל הרמות (:112-133): מוטציה זורקת, הקבוצה-הסגורה לא-מתרחבת.
  for (final probe in <MapEntry<String, Set<String>>>[
    MapEntry('11 ids', snap.elementIds()),
    MapEntry('12 propKeys', snap.propKeysFor('a')),
    MapEntry('13 allowed', snap.allowedValues('a', 'color')),
    MapEntry('14 actions', snap.actionIdsFor('c')),
  ]) {
    var threw = false;
    try {
      probe.value.add('hacked');
    } on UnsupportedError {
      threw = true;
    }
    if (!threw) throw StateError('FAIL [${probe.key} unmodifiable]: add did not throw');
    n++;
  }

  // 15 — יציבות (§9, :65-68): המקור זז אחרי הצילום — הצילום לא.
  srcIds.add('d');
  srcPk['a']!.add('shape');
  srcActs['c']!.add('longPress');
  srcTypes.add('slider');
  _eqSet(snap.elementIds(), {'a', 'b', 'c'}, '15a stable ids after source mutation'); n++;
  _eqSet(snap.propKeysFor('a'), {'color', 'size'}, '15b stable propKeys'); n++;
  _eqSet(snap.actionIdsFor('c'), {'tap'}, '15c stable actions'); n++;
  _eqSet(snap.componentTypes(), {'button'}, '15d stable componentTypes'); n++;

  // 16 — הקפאה-חוזרת (הירושה במקור): שקולת-תוכן.
  final snap2 = snap.frozen();
  _eqSet(snap2.elementIds(), {'a', 'b', 'c'}, '16a refreeze ids'); n++;
  _eqSet(snap2.allowedValues('a', 'color'), {'red', 'blue'}, '16b refreeze allowed'); n++;
  _eqSet(snap2.propKeysFor('b'), {}, '16c refreeze fail-closed'); n++;

  // 17 — הכול-ריק ⇒ צילום-ריק, כל שאילתה fail-closed.
  final empty = frozen(
    elementIds: () => const <String>{},
    propKeysFor: (_) => const <String>{},
    allowedValues: (_, __) => const <String>{},
    actionIdsFor: (_) => const <String>{},
    componentTypes: () => const <String>{},
  );
  _eqSet(empty.elementIds(), {}, '17a empty ids'); n++;
  _eqSet(empty.propKeysFor('a'), {}, '17b empty props'); n++;
  _eqSet(empty.allowedValues('a', 'b'), {}, '17c empty allowed'); n++;
  _eqSet(empty.componentTypes(), {}, '17d empty types'); n++;

  // 18 — איחוד-ids ב-.of (:112-117): id שמוזכר רק במפה — עדיין element תקף.
  final union = FrozenRegistryView.of(
    propKeys: {
      'x': {'p'},
    },
    actionIds: {
      'y': {'go'},
    },
  );
  _eqSet(union.elementIds(), {'x', 'y'}, '18 .of unions map keys into ids'); n++;

  assert(snap.elementIds().contains('a'), 'assert-live guard');

  print('OK frozen: $n asserts passed');
}
