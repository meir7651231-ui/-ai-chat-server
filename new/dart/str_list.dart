// ⚛️ אטום-Dart (דרגת-חוזה) · strList
// מוצא: buildsmart/app_flutter/lib/domain/connection_schema.dart:33-34 (‏_strList; חוק-4).
//        פרטי-במקור (`_`) — גולגל לאטום top-level testable, גוף verbatim (הוסר רק תחילית `_`).
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart:core). אין שכנים/const.
//
// קלט:  v — ערך-JSON גולמי כלשהו (Object?, בד"כ מ-decode).
// פלט:  אם v הוא List ⇒ רק איברי-ה-String שבו, כרשימה (whereType<String>().toList()).
//        אחרת (כולל null / לא-List) ⇒ רשימה-ריקה קבועה `const []`.

/// The `String` elements of [v] when it is a `List`, else an empty list.
/// Verbatim behaviour of connection_schema.dart:33-34.
List<String> strList(Object? v) =>
    v is List ? v.whereType<String>().toList() : const [];
