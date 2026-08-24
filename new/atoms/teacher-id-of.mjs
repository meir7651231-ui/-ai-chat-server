/** חוט · teacher-id-of — מייל-מורה ⇒ teacherId ממפת roles.teachers (סלחני-רישיות), אחרת null.
 *  חוזה: teacher-id-of.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:660-666. אפס import פנימי. */
export function teacherIdOf(config, email) {
  const e = (email || '').trim().toLowerCase();
  const teachers = config.roles?.teachers;
  if (!e || !teachers) return null;
  for (const [k, v] of Object.entries(teachers)) if (k.trim().toLowerCase() === e) return v;
  return null;
}
