// ⚛️ אטום-Dart (דרגת-חוזה) · dayLabel
// מוצא: buildsmart/app_flutter/lib/services/weather.dart:61-69 (חצב-AST · חוק-4 — התנהגות זהה, לא-משופרת).
// טוהר: פונקציית top-level עצמאית, אפס-import (אומת ע"י פותר-המזהים).

String dayLabel(int i) => switch (i) {
      0 => 'היום',
      1 => 'מחר',
      2 => 'מחרתיים',
      _ => 'בעוד $i ימים',
    };
