// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · criticalOpen — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:976-1018 (43 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): compliance, where, toSet, contains, intersection
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  int criticalOpen(int tempC, [Set<String> accessories = const {}]) =>
      compliance(tempC, accessories)
          .where((c) => !c.satisfied && c.severity == CheckSeverity.critical)
          .length;
}

/// Auto-include EVERY safety-critical compliance item the line needs, in its
/// canonical position. The goal: zero critical items missing after build.
/// Items are INSERTED into the chain at the right spot (not appended to the
/// end), and the [accessories] Set is mutated with the tool-grade items
/// (insulation, clips, sealant) that the checklist asks the user to confirm.
///
/// Triggers covered:
///   • hot line  → ball valve, Bladder Tank, PRV, TMTV (if manifold/shower),
///                  thermal insulation
///   • recirculation loop → 2 extra ball valves (3 total), check valve,
///                          balancing valve, air vent
///   • commercial pump (HW-PUMP-40) → Y-strainer, flex coupling,
///                                     Legionella bypass (if hot)
///   • dissimilar metals (copper + brass/steel) → dielectric union at seam
///   • always → clips/support, sealant
void _autoAddCompliance(List<LipskeyCatalogProduct> items,
    Map<String, int> qty, int tempC,
    {bool loop = false, Set<String>? accessories}) {
  final skus = qty.keys.toSet();
  final hot = tempC >= _kHotThresholdC;
  final hasCommercialPump = skus.contains('HW-PUMP-40');
  // Detect manifolds & shower heads from BOTH synthetic hot-water SKUs
  // AND real Lipskey catalog products (by productType/category).
  final hasManifoldOrShower = skus.intersection({
        'HW-MANIFOLD-3', 'HW-MANIFOLD-4', 'HW-MANIFOLD-6',
        'HW-SHOWER-HEAD', 'HW-TMTV-32', 'HW-TMTV-25', 'HW-TMTV-20',
        'HW-TMTV-15',
      }).isNotEmpty ||
      items.any((p) =>
          p.productType == 'מחלק' ||
          p.productType == 'ראש מקלחת' ||
          p.productType == 'מקלח' ||
          p.categoryHe == 'מחלקים' ||
          p.categoryHe == 'ראשי מקלחת' ||
          p.categoryHe == 'מערכות אמבטיה' ||
          p.categoryHe == 'ערכות רחצה');

