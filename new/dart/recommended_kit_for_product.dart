// ⚛️ אטום-Dart (דרגת-חוזה) · recommendedKitForProduct
// מוצא: buildsmart/app_flutter/lib/logic/install_kit.dart:42-124
//        (‏recommendedKitForProduct; חוק-4 — התנהגות זהה בדיוק, לא-משופרת).
// טוהר: פונקציית top-level עצמאית, אפס import פנימי (רק dart:core).
//
// שקעים שהוזרקו (קריאה-לשכן ⇒ מחזיק-קלט / מפה-מוזרקת · חוק-1/3, דיבר-3):
//   • `kVerifiedSpecs[p.sku]` (install_kit.dart:43) ⇒ **שקע-פרמטר** `verifiedSpecs`
//     — מפה `Map<String, KitSpec>` מוזרקת, ברירת-מחדל ריקה (`const {}`).
//   • שדות LipskeyCatalogProduct — נקראים רק `sku`/`brand`/`dims`
//     (install_kit.dart:43,48,50) ⇒ מוחזקים ב-`KitProduct` (מחזיק-קלט טהור).
//   • שדות VerifiedSpec — נקראים רק `material`/`ends` (install_kit.dart:49,91) ⇒
//     `KitSpec`; שדות ConnectorEnd — רק `type`/`size` (install_kit.dart:92-93) ⇒ `KitEnd`.
//
// קלט:  p             — KitProduct (sku · brand · dims?).
//       verifiedSpecs — שקע: Map<String, KitSpec>. חסר-מפתח ⇒ null.
// פלט:  List<KitItem> — ערכת-התקנה מומלצת למוצר-יחיד (מנוקה-כפילויות).

/// סוג-קצה מאומת (verbatim lipskey_verified_connections.dart:24).
enum EndType { hdpeCompression, pexPress, copperPress, bspMale, bspFemale, drainOpening }

/// מחזיק-קלט טהור: רק type/size ש-recommendedKitForProduct קורא (install_kit.dart:92-93).
class KitEnd {
  final EndType type;
  final String size;
  const KitEnd(this.type, this.size);
}

/// מחזיק-קלט טהור: רק material/ends הנקראים (install_kit.dart:49,91).
class KitSpec {
  final String material;
  final List<KitEnd> ends;
  const KitSpec({required this.material, this.ends = const []});
}

/// מחזיק-קלט טהור: רק sku/brand/dims הנקראים (install_kit.dart:43,48,50).
class KitProduct {
  final String sku;
  final String brand;
  final Map<String, dynamic>? dims;
  const KitProduct({required this.sku, this.brand = '', this.dims});
}

enum KitKind { tool, sealant, safety }

enum Severity { required, recommended, optional }

/// מחזיק-פלט טהור (verbatim install_kit.dart:15-36).
class KitItem {
  const KitItem({
    required this.kind,
    required this.label,
    required this.reason,
    this.severity = Severity.required,
  });
  final KitKind kind;
  final String label;
  final String reason;
  final Severity severity;

  String get severityHe => switch (severity) {
        Severity.required => 'חובה',
        Severity.recommended => 'מומלץ',
        Severity.optional => 'אופציונלי',
      };
}

/// ערכת-התקנה למוצר-יחיד — verbatim install_kit.dart:42-124.
List<KitItem> recommendedKitForProduct(
  KitProduct p, {
  Map<String, KitSpec> verifiedSpecs = const {},
}) {
  final spec = verifiedSpecs[p.sku];
  // Material-gated PPR kit (PLAYBOOK §I). After registerPolyrollSpecs every
  // PPR product has a spec, so the gate now also accepts spec.material — both
  // paths return the welding kit (NOT a compression wrench, which would be
  // wrong for socket-fusion).
  if (p.brand == 'פולירול' || (spec?.material.startsWith('PPR') ?? false)) {
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
