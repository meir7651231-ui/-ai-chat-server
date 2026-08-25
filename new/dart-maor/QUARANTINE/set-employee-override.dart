// ⚛️ אטום-Dart (דרגת-חוזה) · setEmployeeOverride — קביעת כרטיס-עובד: דריסות המייל המנורמל במפת memberConfigs.
// מוצא: maor/src/components/platform/lib.ts:256-265 · המקור: new/atoms/set-employee-override.mjs —
//   export function setEmployeeOverride(org, email, override, normEmail) {
//     const e = normEmail(email);
//     return { memberConfigs: { ...org.memberConfigs, [e]: override } };
//   }
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart-core). חוק-4 — התנהגות זהה-ביט למקור-ה-JS.
//
// שקע (חוק-1): normEmail — נירמול-מייל של השכן, מוזרק כפרמטר (כתקדים approve-member).
// קלט: org (מפה עם memberConfigs?) · email · override (כרטיס-עובד; {} ריק = "רואה כמו הארגון") · normEmail.
// פלט: {'memberConfigs': Map} — מפה חדשה בהפניה; הכרטיס החדש מחליף את הקודם במלואו (לא מיזוג).
//
// הערות-המרה (מקור→Dart):
//   • {...org.memberConfigs} על undefined ⇒ פריסה-ריקה תקפה ב-JS. ב-Dart:
//     (org['memberConfigs'] as Map?) ?? const {} — חסר/null ⇒ מפה ריקה (זהה: אין undefined≠null במפת-JS כאן,
//     כי מפתח-חסר ו-null שניהם פורסים-כלום).
//   • [e]: override אחרי הפריסה ⇒ מפתח-קיים מוחלף (הערך האחרון מנצח) — זהה במילולית-מפה של Dart;
//     LinkedHashMap משמר את מקום-המפתח-הקיים ומוסיף חדש בסוף, בדיוק כסדר-מפתחות של JS.
//   • הכרטיס (override) והשכנים עוברים בזהות-הפניה — לא עותק (דוגמאות-חוזה 3–4).
//   • אי-מוטציה: org אינו משוכתב — נבנית מפה חדשה (דוגמת-חוזה 5).
//   • אין locale/תאריך/truthiness/מיון — אף כלל-המרה נוסף לא נדרש.

/// Sets an employee override card: writes [override] under the normalized
/// email in a fresh `memberConfigs` map. Verbatim behaviour of the JS source
/// `setEmployeeOverride` — full replacement, no merge; org is not mutated.
Map<String, dynamic> setEmployeeOverride(
  Map org,
  String email,
  dynamic override,
  String Function(String) normEmail,
) {
  final e = normEmail(email);
  final existing = (org['memberConfigs'] as Map?) ?? const {};
  return {
    'memberConfigs': <dynamic, dynamic>{...existing, e: override},
  };
}
