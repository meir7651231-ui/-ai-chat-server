// ⚛️ אטום-Dart (דרגת-חוזה) · strList
// מוצא: buildsmart/app_flutter/lib/domain/connection_schema.dart:33-34 (חצב-AST · חוק-4 — התנהגות זהה, לא-משופרת).
// טוהר: פונקציית top-level עצמאית, אפס-import (אומת ע"י פותר-המזהים).

List<String> strList(Object? v) =>
    v is List ? v.whereType<String>().toList() : const [];
