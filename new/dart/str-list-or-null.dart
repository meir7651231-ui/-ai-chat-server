// ⚛️ אטום-Dart (דרגת-חוזה) · strListOrNull
// מוצא: buildsmart/app_flutter/lib/domain/connection_schema.dart:35-36 (חצב-AST · חוק-4 — התנהגות זהה, לא-משופרת).
// טוהר: פונקציית top-level עצמאית, אפס-import (אומת ע"י פותר-המזהים).

List<String>? strListOrNull(Object? v) =>
    v is List ? v.whereType<String>().toList() : null;
