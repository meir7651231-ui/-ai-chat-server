// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · insertAt — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:1019-1036 (18 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): clamp, buildInstallation, toInt, insert
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  void insertAt(int position, Set<String> alternatives, String preferred) {
    // A compliance part is inserted BETWEEN two existing pieces; a chain with
    // fewer than 2 items has no interior slot. Guard first: otherwise
    // `clamp(1, items.length - 1)` becomes `clamp(1, 0)` (or `clamp(1, -1)`)
    // and Dart's clamp throws ArgumentError when lowerLimit > upperLimit —
    // a latent crash on `buildInstallation([oneSupplyProduct], autoCompliance: true)`.
    if (items.length < 2) return;
    if (alternatives.any(skus.contains)) return;
    final p = _skuOf(preferred);
    if (p == null) return;
    final clamped = position.clamp(1, items.length - 1).toInt();
    items.insert(clamped, p);
    qty[preferred] = 1;
    skus.add(preferred);
  }

  // Count current isolation valves — synthetic HW-BALL-* AND real catalog
  // ball valves (productType 'ברז' or 'ברז מעבר' in supply categories).
