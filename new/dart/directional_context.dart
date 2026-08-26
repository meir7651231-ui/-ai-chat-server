// ⚛️ אטום-Dart (דרגת-חוזה) · directionalContext
// תפקיד: תיאור-מיקום עברי של פריט i בשרשרת ביחס לשכניו (בין/כניסה/יציאה/בקו) —
//        לצורך הסבר-הקשר בצ'ק-ליסט-ההתקנה.
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:181-189 (‏_directionalContext; חוק-4).
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). פרטי-במקור ⇒ public.
// אחים-שסוקטו: `nameHe` — במקור הפריטים הם `LipskeyCatalogProduct` והשם נקרא `chain[k].nameHe`;
//        הומר לשקע-פרמטר `nameOf` (חוק-3: קריאה-לשכן ⇒ פרמטר-שקע). האטום גנרי על `T`.
//        אחים-שהוטבעו: — (שאר-הקובץ, ‏lineComplianceChecklist וכו', אינו חלק מהאטום).
//
// קלט:  chain   — השרשרת (List<T>).
//       i       — אינדקס-הפריט הנוכחי (int).
//       nameOf  — שקע: מיצוי-השם-העברי מפריט (String Function(T)); במקור `p.nameHe`.
// פלט:  מחרוזת-הקשר עברית.

/// Hebrew positional context of item [i] in [chain] relative to its neighbours.
/// `nameHe` of the neighbours is injected via [nameOf] (slot). Verbatim behaviour
/// of install_engine.dart:181-189.
String directionalContext<T>(List<T> chain, int i,
    {required String Function(T) nameOf}) {
  final up = i > 0 ? nameOf(chain[i - 1]) : null;
  final down = i < chain.length - 1 ? nameOf(chain[i + 1]) : null;
  if (up != null && down != null) return 'בין "$up" ל-"$down"';
  if (down != null) return 'בכניסת הקו (לפני "$down")';
  if (up != null) return 'ביציאת הקו (אחרי "$up")';
  return 'בקו';
}
