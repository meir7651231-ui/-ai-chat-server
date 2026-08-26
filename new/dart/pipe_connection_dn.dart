// ⚛️ אטום-Dart (דרגת-חוזה) · pipeConnectionDn
// תפקיד: מציאת ה-DN (מידת-הקצה המשותפת) הראשון שבו שני מוצרים מתחברים ישירות.
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:596-605
//        (‏pipeConnectionDn; חוק-4 — התנהגות זהה).
// אחים-שסוקטו/הוטבעו:
//   • `kVerifiedSpecs[a.sku]`/`[b.sku]` (const-קטלוג ענק) — במקור SKU→מפרט→קצוות.
//     **סוקט** ע"י הזרקת `endsA`/`endsB` ישירות. מפרט חסר (מקור ⇒ null) ≡ רשימה
//     ריקה כאן (הלולאה לא מוצאת ⇒ null) — שקילות-מקור.
//   • `eA.pipeSharedWith(eB)` (מתודת-קצה שכנה) ⇒ **שקע** `pipeShared` (חוק-3).
//   • `eA.size` (שדה-קצה) ⇒ **שקע** `sizeOf` (חוק-3).
//   • טיפוס-הקצה `E` ⇒ **גנרי** (חוק-1 — האטום נוגע רק ב-shared/size).
// טוהר: אפס import (dart:core בלבד).
//
// קלט:  endsA, endsB — קצוות שני המוצרים (List<E>).
//       pipeShared   — שקע: האם שני קצוות חולקים חיבור-צנרת ישיר.
//       sizeOf       — שקע: מידת-הקצה (String) של קצה.
// פלט:  String? — ה-size של קצה-A הראשון (בסדר-הקינון) שחולק חיבור עם קצה-B; אחרת null.

/// First shared-connection DN between two products, by nested end scan.
/// Verbatim behaviour of install_engine.dart:596-605: the spec lookup is
/// replaced by injecting each product's [endsA]/[endsB] (empty ⇒ no spec ⇒
/// null), and the end's `pipeSharedWith`/`size` are sockets. Returns the size
/// of the FIRST end-A (outer loop) that shares a connection with any end-B.
String? pipeConnectionDn<E>(
  List<E> endsA,
  List<E> endsB, {
  required bool Function(E a, E b) pipeShared,
  required String Function(E e) sizeOf,
}) {
  for (final eA in endsA) {
    for (final eB in endsB) {
      if (pipeShared(eA, eB)) return sizeOf(eA);
    }
  }
  return null;
}
