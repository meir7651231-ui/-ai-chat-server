// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · addItem — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_kit.dart:159-286 (128 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): putIfAbsent, directMatesWith, pipeSharedWith, contains, toList
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  void addItem(String key, KitItem item) {
    out.putIfAbsent(key, () => item);
  }

  for (var i = 0; i < chain.length - 1; i++) {
    final a = chain[i], b = chain[i + 1];
    final sa = kVerifiedSpecs[a.sku];
    final sb = kVerifiedSpecs[b.sku];
    if (sa == null || sb == null) continue;

    // Find the joint that actually mates between a and b.
    ConnectorEnd? jointA, jointB;
    bool isDirect = false;
    for (final eA in sa.ends) {
      for (final eB in sb.ends) {
        if (eA.directMatesWith(eB)) {
          jointA = eA;
          jointB = eB;
          isDirect = true;
          break;
        }
        if (eA.pipeSharedWith(eB) && jointA == null) {
          jointA = eA;
          jointB = eB;
        }
      }
      if (isDirect) break;
    }
    if (jointA == null) continue;

    // BSP threaded joints → wrench + PTFE tape (or hemp for hot lines).
    if (jointA.type == EndType.bspMale ||
        jointA.type == EndType.bspFemale) {
      addItem('wrench-bsp-${jointA.size}',
          KitItem(
            kind: KitKind.tool,
            label: 'מפתח שוודי מתכוונן לחיבור הברגה ${jointA.size}',
            reason: 'הידוק חיבורי BSP בקו',
          ));
      addItem('ptfe',
          const KitItem(
            kind: KitKind.sealant,
            label: 'סרט טפלון (PTFE)',
            reason: 'איטום כל חיבור הברגה זכר',
          ));
    }

    // Material-gated PPR welding kit overrides the compression branch.
    if (sa.material.startsWith('PPR') && sb.material.startsWith('PPR')) {
      addItem('ppr-welder',
          const KitItem(
            kind: KitKind.tool,
            label: 'מכונת ריתוך-שקע PPR (260°C)',
            reason: 'ריתוך-שקע למצמד / ברך / מסעף PPR',
          ));
      addItem('ppr-die-${jointA.size}',
          KitItem(
            kind: KitKind.tool,
            label: 'תבנית ריתוך ⌀${jointA.size} מ"מ',
            reason: 'זוג תבניות (זכר+נקבה) לקוטר הקו',
          ));
      addItem('ppr-cutter',
          const KitItem(
            kind: KitKind.tool,
            label: 'חותך צינור PPR',
            reason: 'חיתוך ניצב לפני ריתוך',
          ));
    }
    // Compression / pipe-bridged joint → compression-nut wrench.
    else if (jointA.type == EndType.hdpeCompression) {
      final mat = sa.material;
      addItem('wrench-comp-$mat-${jointA.size}',
          KitItem(
            kind: KitKind.tool,
            label: 'מפתח חבישה DN${jointA.size} ל-$mat',
            reason: 'הידוק אום compression על צינור',
          ));
    }

    // PEX press → crimper.
    if (jointA.type == EndType.pexPress) {
      addItem('crimper-pex-${jointA.size}',
          KitItem(
            kind: KitKind.tool,
            label: 'מכווץ PEX (Crimper) ל-${jointA.size}',
            reason: 'לחיצת שרוול על צינור PEX',
          ));
    }

    // Copper press → press tool.
    if (jointA.type == EndType.copperPress) {
      addItem('press-cu-${jointA.size}',
          KitItem(
            kind: KitKind.tool,
            label: 'כלי לחיצה לנחושת ${jointA.size}',
            reason: 'לחיצת O-ring על צינור נחושת',
          ));
    }

    // Cross-family material transition needs a dielectric union (galvanic
    // separation) and a sealant suited to the meeting metals.
    final ma = sa.material, mb = sb.material;
    if (ma != mb) {
      const supplyMetal = {'נחושת', 'פליז', 'פלדה', 'נירוסטה'};
      final aMetal = supplyMetal.contains(ma);
      final bMetal = supplyMetal.contains(mb);
      if (aMetal && bMetal) {
        addItem('dielectric',
            const KitItem(
              kind: KitKind.safety,
              label: 'רקורד דיאלקטרי',
              reason: 'הפרדה גלוונית בין שתי מתכות שונות (קורוזיה)',
            ));
      }
      // Cross-material always benefits from extra thread sealant.
      addItem('hemp',
          const KitItem(
            kind: KitKind.sealant,
            label: 'חמצן (hemp) או טפלון עבה',
            reason: 'איטום מעבר חומרים מוגבר',
            severity: Severity.recommended,
          ));
    }
  }

  return out.values.toList();
}

