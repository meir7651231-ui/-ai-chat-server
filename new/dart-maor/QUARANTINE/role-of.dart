// ⚛️ אטום-Dart (דרגת-חוזה) · roleOf — תפקיד-משתמש מהקונפיג לפי מייל: admin ⇒ teacher ⇒ staff.
// מוצא: maor/src/lib/config.ts:650-659 · המקור: new/atoms/role-of.mjs · חוזה: role-of.contract.md
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart-core). חוק-4 — התנהגות זהה-ביט למקור-ה-JS.
// המיילים = קלט-ריצה בלבד (חוק-6 — זהות אינה אטום). טהור, סינכרוני, אפס שקעים.
//
// קלט: config — Map בצורת {adminEmails?: List<String>, roles?: {teachers?: Map<מייל,teacherId>}}
//       (אובייקט-JS ⇒ Map ב-Dart, כמוסכמת שאר האטומים) · email — String או null.
// פלט: 'admin' | 'teacher' | 'staff'.
//
// הערות-המרה (מקור→Dart):
// · ‏`(email || '')` — בחוזה email הוא string|undefined|null; שני מצבי-החסר ⇒ '' — ‏`email ?? ''`
//   מכסה את שניהם (undefined של JS ⇒ null ב-Dart). ‏`if (!e)` על מחרוזת = ריקה-בלבד ⇒ `e.isEmpty`
//   (חוק-7: truthiness מפורש).
// · ‏`config.adminEmails?.some(...)` — optional chaining: חסר ⇒ דילוג. ב-Dart: `is List` שומר
//   גם על [] (truthy ב-JS ⇒ ‏some על ריק = false ⇒ אותה תוצאה) וגם על חסר/null ⇒ דילוג.
// · ‏`teachers && Object.keys(teachers).some(...)` — ‏{} truthy עם אפס מפתחות ⇒ false; ‏`is Map`
//   על Map ריק ⇒ ‏any על ריק = false — זהה-ביט.
// · config==null עם מייל לא-ריק: JS זורק TypeError על גישת-שדה; ב-Dart הגישה `config['...']`
//   זורקת NoSuchMethodError — אותה סמנטיקת-כשל (אין ריכוך שלא-במקור).
// · אין locale/תאריכים/מיון/מודולו — חוקים 1,3,4,5,9,10,11 לא רלוונטיים כאן.

/// Derives the user's role from the org config by email: empty/missing email
/// => 'staff'; listed in adminEmails => 'admin' (checked first — beats teacher);
/// key of roles.teachers => 'teacher'; otherwise 'staff'. All comparisons are
/// case- and edge-whitespace-insensitive (trim+lowercase on both sides).
/// Verbatim behaviour of the JS source `roleOf`.
String roleOf(dynamic config, dynamic email) {
  final e = ((email ?? '') as String).trim().toLowerCase();
  if (e.isEmpty) return 'staff';
  final adminEmails = config['adminEmails'];
  if (adminEmails is List &&
      adminEmails.any((a) => (a as String).trim().toLowerCase() == e)) {
    return 'admin';
  }
  final roles = config['roles'];
  final teachers = roles is Map ? roles['teachers'] : null;
  if (teachers is Map &&
      teachers.keys.any((k) => (k as String).trim().toLowerCase() == e)) {
    return 'teacher';
  }
  return 'staff';
}
