/** חוט · next-academic-year-label — תווית שנת-הלימודים העברית **הבאה**.
 *  חוזה: next-academic-year-label.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:42-49
 *  (nextAcademicYearLabel). השכנים atNoon (פרסור-צהריים), hebPartsOfIso
 *  (חלקי-תאריך-עברי) ו-gemYear (גימטריית-שנה) הוזרקו כשקעים (חוק-1). */
export function nextAcademicYearLabel(startIso, atNoon, gemYear, hebPartsOfIso) {
  if (!startIso) return '';
  const d = atNoon(startIso);
  const yy = d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1;
  // "השנה הבאה" = הוסף שנה עברית אחת (31.12 של השנה הלועזית הבאה).
  return gemYear(hebPartsOfIso(`${yy + 1}-12-31`).year);
}
