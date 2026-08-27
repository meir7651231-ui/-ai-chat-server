// ⚛️ אטום-Dart (דרגת-חוזה) · workerShortName
// מוצא: buildsmart/app_flutter/lib/data/persona_data.dart:159-161 (חצב-AST · חוק-4 — התנהגות זהה, לא-משופרת).
// טוהר: פונקציית top-level עצמאית, אפס-import (אומת ע"י פותר-המזהים).

/// Display name — `שלום, {name}` strips the trailing ` (עובד)` (§4.2).
String workerShortName(int worker, {required List<String> kWorkers}) =>
    kWorkers[worker].replaceAll(' (עובד)', '');
