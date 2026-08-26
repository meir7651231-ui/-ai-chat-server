// ⚛️ אטום-Dart (דרגת-חוזה) · lineComplianceChecklist
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:113-222
//        (‏lineComplianceChecklist; חוק-4 — התנהגות זהה בדיוק, לא-משופרת).
//        ‏שים לב: זהו אטום נפרד ומלא — לא ה-compliance.dart הגנרי (עוזר-dedup).
// טוהר: פונקציית top-level עצמאית, אפס import פנימי (רק שפה/סטנדרט).
//       ‏enum CheckSeverity (מקור:77) + מחלקת-הפלט LineCheck (מקור:79-86) verbatim
//       מקומית. הקבועים _kHotThresholdC=60 (מקור:22) ו-_kIsolationValveSkus
//       (מקור:25-29) הוטבעו כדאטה פנימית (לא הקשר/זהות/סוד).
//
// שקעים שהוזרקו (קריאה-לשכן ⇒ פרמטר-שקע · חוק-3, דיבר-3):
//   • `productMaterial(p)` (‏=kVerifiedSpecs[p.sku]?.material, מקור:116) → שקע
//     `materialOf(sku) → String?` (‏null כשאין spec).
//   • `lineIsSupply(chain)` (מקור:156, =any endSystems.contains(supply)) → שקע
//     `isSupplySku(sku) → bool` (‏האם קצות-המוצר כוללים אספקה); ה-lineIsSupply
//     מחושב מקומית כ-`chain.any((p)=>isSupplySku(p.sku))`.
//   • מחזיק-הקלט ChainPart = שלושת השדות שהגוף קורא: sku · productType? · categoryHe
//     (‏LipskeyCatalogProduct קורס למחזיק-קלט טהור; חוק-2 מינימום-הנדרש).
//
// התנהגות (מקור:115-221): מזהה את רכיבי-הבטיחות/עמידות שקו-חם/אספקה מחייב והאם
//   הם קיימים בשרשרת — ממיר סקירת-מומחה לשער-אוטומטי. הרשימה נבנית עם if-collection
//   verbatim (סדר, תנאים, תוויות, סיבות, חומרות — ביט-אחר-ביט).
//
// קלט:  chain       — רשימת ChainPart (sku · productType? · categoryHe).
//       tempC       — טמפרטורת-הקו (int, °C).
//       accessories — קבוצת-SKU של אביזרים שאושרו ידנית (בידוד/חבק/איטום).
//       materialOf  — שקע: sku → תווית-חומר (String) או null (אין spec).
//       isSupplySku — שקע: sku → האם קצות-המוצר כוללים אספקה (bool).
// פלט:  List<LineCheck> — פריטי-הצ׳קליסט הפעילים לקו הזה.

/// Severity of a compliance check failure (verbatim: install_engine.dart:73-77).
/// critical → safety/code risk · warning → durability/performance · info → good practice.
enum CheckSeverity { critical, warning, info }

/// One compliance line-item (verbatim: install_engine.dart:79-86).
class LineCheck {
  const LineCheck(this.label, this.satisfied, this.why,
      {this.severity = CheckSeverity.warning});
  final String label;
  final bool satisfied;
  final String why;
  final CheckSeverity severity;
}

/// Pure input holder — the three fields the checklist reads off each product.
class ChainPart {
  final String sku;
  final String? productType;
  final String categoryHe;
  const ChainPart(this.sku, this.categoryHe, {this.productType});
}

/// Temperature (°C) at/above which a line counts as "hot" (verbatim: install_engine.dart:22).
const _kHotThresholdC = 60;

/// Isolation ball valves — any one satisfies the shut-off requirement
/// (verbatim: install_engine.dart:25-29).
const _kIsolationValveSkus = {
  'HW-BALL-INLET-1', 'HW-BALL-INLET-40',
  'HW-BALL-1', 'HW-BALL-15', 'HW-BALL-40', 'HW-BALL-32',
  'HW-BALL-CU-40', 'HW-BALL-CU-32', 'HW-BALL-CU-25', 'HW-BALL-CU-20',
};

/// Detects the safety/durability components a hot line requires and whether the
/// current chain includes them — turning expert review into an automatic gate.
List<LineCheck> lineComplianceChecklist(
  List<ChainPart> chain,
  int tempC,
  Set<String> accessories, {
  required String? Function(String sku) materialOf,
  required bool Function(String sku) isSupplySku,
}) {
  final skus = chain.map((p) => p.sku).toSet();
  final mats =
      chain.map((p) => materialOf(p.sku)).whereType<String>().toSet();
  bool has(Set<String> ok) => skus.any(ok.contains);
  bool acc(String s) => accessories.contains(s);

  final hot = tempC >= _kHotThresholdC;
  final hasPex = mats.contains('PEX');
  final recirc = skus.contains('HW-PUMP-25') || skus.contains('HW-TEE-RECIRC');
  // Galvanic risk: copper joined to ANY other metal (brass/steel) — conservative.
  final metals = mats.where((m) => m == 'נחושת' || m == 'פליז' || m == 'פלדה');
  final dissimilar = mats.contains('נחושת') && metals.toSet().length >= 2;
  // Count BOTH synthetic and real catalog ball valves as shutoffs.
  final isolationCount = chain
      .where((p) =>
          _kIsolationValveSkus.contains(p.sku) ||
          ((p.productType == 'ברז' || p.productType == 'ברז גן') &&
              (p.categoryHe == 'ברזי מעבר' ||
                  p.categoryHe == 'ברזי ניל' ||
                  p.categoryHe == 'ברזי דלי')))
      .length;

  final hasCommercialPump = skus.contains('HW-PUMP-40');
  // Recognise BOTH synthetic hot-water SKUs AND real catalog products by
  // type/category — a "מחלק" (distribution manifold) or shower head from
  // the regular Lipskey catalog also needs TMTV anti-scald in a hot line.
  final hasManifoldOrShower = has({
        'HW-MANIFOLD-3', 'HW-MANIFOLD-4', 'HW-MANIFOLD-6',
        'HW-SHOWER-HEAD',
        'HW-TMTV-32', 'HW-TMTV-25', 'HW-TMTV-20', 'HW-TMTV-15',
      }) ||
      chain.any((p) =>
          p.productType == 'מחלק' ||
          p.productType == 'ראש מקלחת' ||
          p.productType == 'מקלח' ||
          p.categoryHe == 'מחלקים' ||
          p.categoryHe == 'ראשי מקלחת' ||
          p.categoryHe == 'מערכות אמבטיה' ||
          p.categoryHe == 'ערכות רחצה');

  // Supply-side compliance only applies to a pressurised supply line — a
  // gravity drainage line (traps + drain pipe) doesn't take an isolation valve.
  final isSupply = chain.any((p) => isSupplySku(p.sku));

  return [
    if (isSupply)
      LineCheck(
          recirc
              ? 'ברז ניתוק ×3 (כניסת דוד + אחרי משאבה + מניפולד)'
              : 'ברז ניתוק לתחזוקה',
          recirc ? isolationCount >= 3 : isolationCount >= 1,
          'בידוד אזורי לתחזוקה',
          severity: CheckSeverity.critical),
    if (recirc) ...[
      LineCheck('שסתום אל-חזור', has({'HW-CHECK-15'}),
          'מונע זרימה הפוכה בלולאה', severity: CheckSeverity.critical),
      LineCheck('שסתום מאזן / TRV', has({'HW-BALANCE-15'}),
          'איזון הלולאה', severity: CheckSeverity.critical),
      LineCheck('מפוח אוויר', has({'HW-AIRVENT'}),
          'פליטת אוויר בלולאה', severity: CheckSeverity.warning),
    ],
    if (dissimilar)
      LineCheck('רקורד דיאלקטרי', has({'HW-DIELECTRIC-15'}),
          'הפרדה גלוונית בין מתכות', severity: CheckSeverity.critical),
    if (hasPex)
      LineCheck('מפצה התפשטות PEX', has({'HW-EXP-COMP-20'}),
          'PEX מתרחב בחום', severity: CheckSeverity.warning),
    if (hot)
      LineCheck('שסתום פורק לחץ (PRV)', has({'HW-PRV-34'}),
          'מערכת חמה סגורה', severity: CheckSeverity.critical),
    if (hot)
      LineCheck('כלי התפשטות (Bladder Tank)',
          has({'HW-BTANK-35', 'HW-BTANK-18', 'HW-EXPVESSEL'}),
          'ממברנת EPDM מפרידה N₂ ממים — חובה בכל קו חם סגור',
          severity: CheckSeverity.critical),
    if (hasCommercialPump) ...[
      LineCheck('מסנן Y (הגנת משאבה)',
          has({'HW-YSTR-40', 'HW-YSTR-32', 'HW-YSTR-15'}),
          'מונע חלקיקים מלפגוע במשאבה', severity: CheckSeverity.warning),
      LineCheck('מחבר גמיש (ספיגת רעידות)',
          has({'HW-FLEX-40', 'HW-FLEX-32'}),
          'מבודד רעידות המשאבה מהצנרת', severity: CheckSeverity.warning),
    ],
    if (hasManifoldOrShower)
      LineCheck('ברז ערבוב נגד כוויה (TMTV)',
          has({'HW-TMTV-32', 'HW-TMTV-25', 'HW-TMTV-20', 'HW-TMTV-15'}),
          'מגביל את המים ל-45°C ביציאה כדי למנוע כוויה',
          severity: CheckSeverity.critical),
    if (hasCommercialPump && hasManifoldOrShower)
      LineCheck('שסתום מאזן לכל ענף (Balancing Valve)',
          has({'HW-BALANCE-25', 'HW-BALANCE-20', 'HW-BALANCE-15'}),
          'מאזן לחץ בין ענפים במערכת מסחרית', severity: CheckSeverity.warning),
    if (hasCommercialPump && hot)
      LineCheck('מעקף חום נגד חיידק לגיונלה (EN 806)',
          has({'HW-DISINFECT'}),
          'פסטור 70°C/3 דקות אחת לשבוע', severity: CheckSeverity.critical),
    if (recirc)
      LineCheck('נקודת דגימת מים (לגיונלה)',
          has({'HW-SAMPLE'}),
          'נדרש לבדיקות מים תקתיות', severity: CheckSeverity.warning),
    if (hot)
      LineCheck('בידוד תרמי', acc('HW-INSUL'),
          'הפסדי חום + סכנת כוויות', severity: CheckSeverity.warning),
    LineCheck('חבקים/תמיכת צנרת', acc('HW-CLIP'),
        'קיבוע ושיפוע', severity: CheckSeverity.info),
    LineCheck('איטום מעברים (Press/PTFE/O-ring)', acc('HW-SEALANT'),
        'אטימות כל מעבר', severity: CheckSeverity.info),
  ];
}
