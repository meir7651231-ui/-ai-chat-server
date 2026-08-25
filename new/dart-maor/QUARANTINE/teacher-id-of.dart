// חוט · teacher-id-of — מייל-מורה ⇒ teacherId ממפת roles.teachers (סלחני-רישיות), אחרת null.
// חוזה: new/atoms/teacher-id-of.contract.md · מקור-JS: new/atoms/teacher-id-of.mjs (חוק-4: זהה-ביט).
// מוצא: maor/src/lib/config.ts:660-666 (courses.teacherapp). אפס-import (dart-core בלבד).
// הערות-המרה:
//   · JS: (email || '') — null/undefined/'' כולם ⇒ ''; ‏!e ⇒ מחרוזת-ריקה בלבד (אחרי trim זה עדיין
//     נבדק כ-e המנורמל, כמו במקור: ' ' ⇒ '' ⇒ null).
//   · JS: config.roles?.teachers — optional-chaining ⇒ בדיקת-Map מדורגת; !teachers ⇒ null/חסר.
//     ‏{} (מפה-ריקה) truthy ב-JS ⇒ הלולאה רצה ומחזירה null — זהה כאן.
//   · Object.entries על מפתחות-מייל (לא array-index) = סדר-הכנסה ⇒ Map ב-Dart (LinkedHashMap) זהה.
//   · trim()/toLowerCase() על מיילים — מקבילים ישירים (תקדים is-admin.dart; אין U+0085/İ במיילים).
dynamic teacherIdOf(dynamic config, dynamic email) {
  final e = ((email ?? '') as String).trim().toLowerCase();
  final roles = (config is Map) ? config['roles'] : null;
  final teachers = (roles is Map) ? roles['teachers'] : null;
  if (e.isEmpty || teachers == null) return null;
  for (final entry in (teachers as Map).entries) {
    if ((entry.key as String).trim().toLowerCase() == e) return entry.value;
  }
  return null;
}
