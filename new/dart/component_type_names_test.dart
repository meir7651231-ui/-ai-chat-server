// בדיקת-אטום · componentTypeNames — מוכיחה בדיוק את component_type_names.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/component_type_names_test.dart
//                ⇒ exit 0 + "componentTypeNames OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'component_type_names.dart';

void main() {
  // הפלטה-החיה (component_palette.dart:163-208) — 6 תבניות, כל השמות מובחנים.
  const live = <PaletteEntry>[
    PaletteEntry(typeName: 'button'),
    PaletteEntry(typeName: 'textBlock'),
    PaletteEntry(typeName: 'badge'),
    PaletteEntry(typeName: 'divider'),
    PaletteEntry(typeName: 'infoCard'),
    PaletteEntry(typeName: 'linkRow'),
  ];

  bool eq(Set<String> a, Set<String> b) =>
      a.length == b.length && a.containsAll(b);

  // סדר-איטרציה של Set (LinkedHashSet שומר סדר-הכנסה).
  bool orderEq(Set<String> a, List<String> b) {
    if (a.length != b.length) return false;
    var i = 0;
    for (final x in a) {
      if (x != b[i++]) return false;
    }
    return true;
  }

  // #1 — הפלטה-החיה ⇒ 6 השמות המובחנים בסדר-ההכנסה.
  final r1 = componentTypeNames(live);
  assert(eq(r1, {
    'button',
    'textBlock',
    'badge',
    'divider',
    'infoCard',
    'linkRow',
  }));
  assert(r1.length == 6);
  assert(orderEq(r1, const [
    'button',
    'textBlock',
    'badge',
    'divider',
    'infoCard',
    'linkRow',
  ])); // סדר-הכנסה נשמר.

  // #2 — פלטה ריקה ⇒ Set ריק (לא זריקה).
  final r2 = componentTypeNames(const <PaletteEntry>[]);
  assert(r2.isEmpty);
  assert(r2.length == 0);

  // #3 — פריט-יחיד ⇒ Set בגודל 1.
  final r3 = componentTypeNames(const [PaletteEntry(typeName: 'button')]);
  assert(eq(r3, {'button'}));
  assert(r3.length == 1);

  // #4 — עדשה-עוינת: שם כפול ⇒ סמנטיקת-Set מדדפת לפריט-יחיד.
  final r4 = componentTypeNames(const [
    PaletteEntry(typeName: 'badge'),
    PaletteEntry(typeName: 'badge'),
  ]);
  assert(eq(r4, {'badge'}));
  assert(r4.length == 1);

  // #5 — עדשה-עוינת: כפילות משובצת ⇒ דדופ + סדר-הכנסה של ההופעה-הראשונה.
  final r5 = componentTypeNames(const [
    PaletteEntry(typeName: 'divider'),
    PaletteEntry(typeName: 'button'),
    PaletteEntry(typeName: 'divider'),
  ]);
  assert(eq(r5, {'divider', 'button'}));
  assert(r5.length == 2);
  assert(orderEq(r5, const ['divider', 'button'])); // divider ראשון (הופעה-ראשונה).

  print('componentTypeNames OK — 5/5 contract examples proven');
}
