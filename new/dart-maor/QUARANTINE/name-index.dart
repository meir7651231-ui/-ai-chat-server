// ⚛️ אטום-Dart (דרגת-חוזה) · nameIndex — אינדקס בני-משפחה לפי מזהה (Map id⇒member) לדוחות.
// מוצא: maor/src/components/reports/lib.ts:70-75 · המקור: new/atoms/name-index.mjs —
//        `for (const m of allMembers(db)) map.set(m.id, m); return map;`
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart-core). חוק-4 — התנהגות זהה-ביט למקור-ה-JS.
//
// תפקיד: בונה Map מ-id לרשומת-החבר לחיפוש O(1) בדוחות. מזהה כפול ⇒ האחרון-
//        ברשימה מנצח (סמנטיקת Map.set של JS ≡ הצבת-אינדקס ב-Dart).
// שקע (חוק-1): allMembers(db) ⇒ מערך כל בני-המשפחה (במקור השכן useApp.allMembers
//        הוזרק כפרמטר — אפס import פנימי).
// קלט: db · allMembers. פלט: Map<id, member>.
//
// הערת-המרה (מקור→Dart): Map של JS שומר סדר-הכנסה ⇒ {} של Dart (LinkedHashMap)
// שקול. map.set(k,v) ⇒ map[k]=v (דריסה: האחרון מנצח — זהה). הערכים נשמרים
// כרפרנס (זהות, לא עותק) בדיוק כמו ב-JS. get של מפתח-חסר: undefined ב-JS ⇒
// null ב-Dart (map['x']). אין locale/תאריכים/truthiness/מוטציית-קלט.

/// Builds an id⇒member index over all family members, for O(1) lookup in
/// reports. Duplicate id: the last one in the list wins (JS Map.set semantics).
/// The sink `allMembers` is called exactly once with the injected `db`.
/// Verbatim behaviour of the JS source `nameIndex`.
dynamic nameIndex(dynamic db, dynamic allMembers) {
  final map = <dynamic, dynamic>{};
  for (final m in allMembers(db)) {
    map[m['id']] = m;
  }
  return map;
}
