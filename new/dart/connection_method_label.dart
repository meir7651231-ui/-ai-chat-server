// ⚛️ אטום-Dart (דרגת-חוזה) · connectionMethodLabel
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:90-109
//        (‏connectionMethodLabel; חוק-4 — התנהגות זהה בדיוק, לא-משופרת).
// טוהר: פונקציית top-level עצמאית, אפס import פנימי (רק שפה/סטנדרט).
//       ‏enum EndType + מחזיק-הקצה ConnEnd (מחזיקי-קלט טהורים) verbatim מ-
//       lipskey_verified_connections.dart:24,32-36. שתי המתודות על ConnectorEnd —
//       directMatesWith (lvc.dart:38-48) ו-pipeSharedWith (lvc.dart:50-53) — שוכפלו
//       כעוזרים-פרטיים (אטום אינו מייבא טיפוס-דומיין; חוק-1/דיבר-3).
//
// שקע שהוזרק (קריאה-לשכן ⇒ פרמטר-שקע · חוק-3, דיבר-3):
//   • `kVerifiedSpecs[a.sku]?.ends` / `[b.sku]?.ends`  (install_engine.dart:91-94)
//     — המפה-הגלובלית קורסת לשקע `endsOf(p) → List<ConnEnd>?` (‏null כשאין spec).
//   • טיפוס-המוצר מופשט לגנריקה <P>; במקור P≡LipskeyCatalogProduct.
//
// התנהגות (מקור:91-108): אחד הצדדים בלי spec ⇒ '' (מחרוזת-ריקה). אחרת סורקים
//   זוגות-קצוות; הזוג-הראשון שמתאים-ישירות ⇒ תווית לפי סוג-הקצה של a:
//     pexPress→'Press / טבעת כיווץ' · copperPress→'Press / O-ring' ·
//     bspMale/bspFemale→'תבריג + PTFE' · hdpeCompression→'אום הידוק' ·
//     drainOpening→'כיסוי ניקוז'. אם אין התאמה-ישירה אך יש שיתוף-צינור ⇒
//     'אום הידוק (compression)'. אחרת (אין זוג תואם) ⇒ '' .
//   הערה: directMatesWith לעולם אינו-מחזיר-true ל-hdpeCompression (זה שיתוף-צינור),
//   אך ה-case נשמר verbatim לשלמות-ה-switch של המקור.
//
// קלט:  a, b   — שני המוצרים המחוברים (מועברים ל-endsOf).
//       endsOf — שקע: p → רשימת-קצוות (List<ConnEnd>) או null כשאין spec.
// פלט:  String — שם-שיטת-החיבור הפיזית, או '' כשלא-ניתן-לגזור.

/// End connection type (verbatim: lipskey_verified_connections.dart:24).
enum EndType { hdpeCompression, pexPress, copperPress, bspMale, bspFemale, drainOpening }

/// Pure input holder for a connector end (verbatim fields: lvc.dart:32-36).
class ConnEnd {
  final EndType type;
  final String size;
  const ConnEnd(this.type, this.size);
}

/// `ConnectorEnd.directMatesWith` (verbatim: lvc.dart:38-48).
bool _directMates(ConnEnd a, ConnEnd b) {
  if (a.type == EndType.bspMale && b.type == EndType.bspFemale && a.size == b.size) return true;
  if (a.type == EndType.bspFemale && b.type == EndType.bspMale && a.size == b.size) return true;
  if (a.type == EndType.pexPress && b.type == EndType.pexPress && a.size == b.size) return true;
  if (a.type == EndType.copperPress && b.type == EndType.copperPress && a.size == b.size) return true;
  if (a.type == EndType.drainOpening && b.type == EndType.drainOpening && a.size == b.size) return true;
  return false;
}

/// `ConnectorEnd.pipeSharedWith` (verbatim: lvc.dart:50-53).
bool _pipeShared(ConnEnd a, ConnEnd b) =>
    a.type == EndType.hdpeCompression &&
    b.type == EndType.hdpeCompression &&
    a.size == b.size;

/// The physical join method between two mating products, derived from end types.
String connectionMethodLabel<P>(
  P a,
  P b, {
  required List<ConnEnd>? Function(P) endsOf,
}) {
  final ea = endsOf(a), eb = endsOf(b);
  if (ea == null || eb == null) return '';
  for (final eA in ea) {
    for (final eB in eb) {
      if (_directMates(eA, eB)) {
        switch (eA.type) {
          case EndType.pexPress:
            return 'Press / טבעת כיווץ';
          case EndType.copperPress:
            return 'Press / O-ring';
          case EndType.bspMale:
          case EndType.bspFemale:
            return 'תבריג + PTFE';
          case EndType.hdpeCompression:
            return 'אום הידוק';
          case EndType.drainOpening:
            return 'כיסוי ניקוז';
        }
      }
      if (_pipeShared(eA, eB)) return 'אום הידוק (compression)';
    }
  }
  return '';
}
