// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · recommendedKitForProduct — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_kit.dart:42-154 (113 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toString, tryParse, contains, putIfAbsent, toList
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<KitItem> recommendedKitForProduct(LipskeyCatalogProduct p) {
  final spec = kVerifiedSpecs[p.sku];
  // Material-gated PPR kit (PLAYBOOK §I). After registerPolyrollSpecs every
  // PPR product has a spec, so the gate now also accepts spec.material — both
  // paths return the welding kit (NOT a compression wrench, which would be
  // wrong for socket-fusion).
  if (p.brand == 'פולירול' ||
      (spec?.material.startsWith('PPR') ?? false)) {
    final dn = p.dims?['dn נומינלי']?.toString() ?? '';
    final ds = dn.isEmpty ? '' : ' ⌀$dn מ"מ';
    return [
      KitItem(
        kind: KitKind.tool,
        label: 'מצמד PPR${dn.isEmpty ? '' : ' $dn'} (אביזר חיבור)',
        reason: 'מאחד שני קטעי צינור בריתוך-שקע',
      ),
      const KitItem(
        kind: KitKind.tool,
        label: 'מכונת ריתוך-שקע 260°C',
        reason: 'מחממת את הצינור ואת השקע בו-זמנית',
      ),
      KitItem(
        kind: KitKind.tool,
        label: 'תבנית/ראש ריתוך$ds',
        reason: 'זוג תבניות (זכר+נקבה) לקוטר הצינור',
      ),
      const KitItem(
        kind: KitKind.tool,
        label: 'מספריים/חותך צינור PPR',
        reason: 'חיתוך ניצב ונקי של הצינור',
      ),
      const KitItem(
        kind: KitKind.tool,
        label: 'מסיר גרדים + מטלית ניקוי',
        reason: 'ניקוי וייבוש הקצה לפני ריתוך',
        severity: Severity.recommended,
      ),
      const KitItem(
        kind: KitKind.tool,
        label: 'עט סימון עומק',
        reason: 'סימון עומק ההחדרה לשקע על הצינור',
        severity: Severity.recommended,
      ),
    ];
  }
  // Huliot SmartLock — PP drainage with snap-fit/bayonet nuts. The system is
  // intentionally tool-light (a single bayonet wrench tightens every nut), but
  // pipe segments still need a clean perpendicular cut and the field uses a
  // dedicated cutter rather than a generic saw. Size-bucket the wrench by DN.
  if (p.brand == 'חוליות') {
    final dn = double.tryParse(p.dims?['DN']?.toString() ?? '') ?? 0;
    final isPipe = p.categoryHe.contains('צינור');
    final wrenchLabel = dn <= 40
        ? 'מפתח לאום SmartLock 32-40 (מק"ט 61040360)'
        : 'מפתח לאום SmartLock 50-63 (מק"ט 61060560)';
    return [
      if (isPipe)
        const KitItem(
          kind: KitKind.tool,
          label: 'חותך צינורות SmartLock',
          reason: 'חיתוך ניצב ונקי לצינור PP במידות 32-63',
        ),
      KitItem(
        kind: KitKind.tool,
        label: wrenchLabel,
        reason: 'הידוק/שחרור אום SmartLock — מפתח ייעודי מבטיח מומנט נכון',
        severity: Severity.recommended,
      ),
    ];
  }
  if (spec == null) return const [];
  final out = <String, KitItem>{};
  void add(String key, KitItem item) => out.putIfAbsent(key, () => item);

  for (final e in spec.ends) {
    if (e.type == EndType.bspMale || e.type == EndType.bspFemale) {
      add('wrench-bsp-${e.size}', KitItem(
        kind: KitKind.tool,
        label: 'מפתח שוודי מתכוונן להברגה ${e.size}',
        reason: 'הידוק החיבור עם הקצה הזה',
      ));
      add('ptfe', const KitItem(
        kind: KitKind.sealant,
        label: 'סרט טפלון (PTFE)',
        reason: 'איטום כל חיבור הברגה זכר',
      ));
    } else if (e.type == EndType.hdpeCompression) {
      add('wrench-comp-${spec.material}-${e.size}', KitItem(
        kind: KitKind.tool,
        label: 'מפתח חבישה DN${e.size} ל-${spec.material}',
        reason: 'הידוק אום compression על צינור',
      ));
    } else if (e.type == EndType.pexPress) {
      add('crimper-pex-${e.size}', KitItem(
        kind: KitKind.tool,
        label: 'מכווץ PEX (Crimper) ל-${e.size}',
        reason: 'לחיצת שרוול על צינור PEX',
      ));
    } else if (e.type == EndType.copperPress) {
      add('press-cu-${e.size}', KitItem(
        kind: KitKind.tool,
        label: 'כלי לחיצה לנחושת ${e.size}',
        reason: 'לחיצת O-ring על צינור נחושת',
      ));
    }
  }
  return out.values.toList();
}

/// Inspect [chain] and emit a deduped kit list. The chain is the ordered
/// product sequence the plumber will install — we walk adjacent pairs and
/// classify each joint by the matching ends' types and the products'
/// materials. Same kit item across multiple joints appears once.
