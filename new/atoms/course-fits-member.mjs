/** חוט · course-fits-member — התאמת חוג לחבר/ה (מגדר/גיל/כיתה). חוזה: course-fits-member.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:477-491; השכן gradeFits
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function courseFitsMember(c, gender, age, grade, gradeFits, T) {
  if (c.gender && c.gender !== T.k1 && gender && c.gender !== gender) return false;
  if (age != null) {
    if (c.ageMin && age < c.ageMin) return false;
    if (c.ageMax && age > c.ageMax) return false;
  }
  if (!gradeFits(c, grade)) return false;
  return true;
}
