// ⚛️ אטום-Dart · materialRank
// מוצא: buildsmart/app_flutter/lib/features/catalog_config/browse_model.dart:383-391 (חצב-בינה · מפל-מינימום · חוק-4).
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart:core); אין טיפוס-דומיין.
//   מפל: הקבוע `_kMaterialOrder` (:378-381) הוטבע verbatim.
//   פרטי-במקור: `_materialRank` → הוצא-לחוזה כ-top-level ציבורי `materialRank`.

/// סדר-תצוגת החומרים ברכבל — verbatim (browse_model.dart:378-381).
const List<String> _kMaterialOrder = [
  'PPR', 'רב-שכבתי', 'פקס', 'HDPE', 'PE', 'PVC', 'פוליאתילן',
  'נחושת', 'פליז', 'פלדה', 'נירוסטה', 'אלומיניום',
];

/// דירוג-חומר: ריק→אחרון; לא-מוכר→בין-מוכר-לחסר; אחרת אינדקס-בסדר. PURE.
int materialRank(String material) {
  if (material.isEmpty) return 1 << 20; // material-less → last
  final i = _kMaterialOrder.indexOf(material);
  return i < 0 ? 1 << 10 : i; // unknown → between known and material-less
}
