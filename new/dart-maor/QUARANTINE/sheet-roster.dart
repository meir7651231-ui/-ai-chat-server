// ⚛️ אטום-Dart (דרגת-חוזה) · sheetRoster — גיליון-נוכחות (roll-call) של חוג.
// מוצא: maor/src/components/courses/lib.ts:391-395 · המקור: new/atoms/sheet-roster.mjs —
//        `enrollments.filter((e) => e.courseId === courseId && e.status !== 'ended' && e.status !== 'wait')`
// חוזה: new/atoms/sheet-roster.contract.md
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart-core). חוק-4 — התנהגות זהה-ביט למקור-ה-JS.
//
// תפקיד: מסנן מכלל השיבוצים את שיבוצי-החוג הפעילים/המוקפאים — לא מי שסיימו
//        (status==='ended') ולא רשימת-ההמתנה (status==='wait'). כל סטטוס אחר —
//        כולל **חסר** (שיבוצי-עבר בלי שדה status) — נכלל.
// קלט: enrollments — מערך שיבוצים ({courseId, status?, …} — כאן List של Map) ·
//        courseId — מזהה-החוג.
// פלט: מערך-משנה **חדש** (filter ⇒ toList), הסדר המקורי נשמר, האיברים עוברים
//        בזהות-הפניה (אותם אובייקטים, לא עותקים).
//
// הערות-המרה (מקור→Dart):
// - גישת-שדה `e.courseId` של JS ⇒ `e['courseId']` על Map (מוסכמת-המדף).
// - `status !== 'ended'` על שדה **חסר**: JS undefined!=='ended' ⇒ true; Dart —
//   מפתח-חסר ב-Map מחזיר null, ו-null != 'ended' ⇒ true. זהה-התנהגות (כלל-2
//   לא נדרש: אין כאן הבחנה null↔חסר — שניהם "לא ended ולא wait" ⇒ נכללים).
// - `===` של JS על מחרוזות = השוואת-ערך ⇒ `==` של Dart על String; על אובייקטים
//   JS === זהות-הפניה ⇒ `==` של Dart על Map (ברירת-מחדל identity) — זהה.
// אין locale/תאריך/מיון/מודולו/truthiness — הכללים 1,3-13 לא רלוונטיים.

/// Roll-call roster of a course: the course's active/frozen enrollments —
/// excludes 'ended' and 'wait'; any other status, including a MISSING status
/// (legacy rows), is included. Returns a NEW list (filter), original order kept,
/// elements pass by reference identity. Verbatim behaviour of the JS source.
List<dynamic> sheetRoster(dynamic enrollments, dynamic courseId) {
  return (enrollments as List)
      .where((e) =>
          e['courseId'] == courseId &&
          e['status'] != 'ended' &&
          e['status'] != 'wait')
      .toList();
}
