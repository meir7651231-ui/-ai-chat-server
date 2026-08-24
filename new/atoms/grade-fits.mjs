/** חוט · grade-fits — התאמת כיתה לחוג (סינון רך — מידע חסר אינו מסנן).
 *  חוזה: grade-fits.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:466-476; השכן gradeIndex
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function gradeFits(c, childGrade, gradeIndex) {
    if (!c.gradeMin && !c.gradeMax)
        return true;
    const gi = gradeIndex(childGrade);
    if (gi < 0)
        return true;
    const lo = gradeIndex(c.gradeMin);
    const hi = gradeIndex(c.gradeMax);
    if (lo >= 0 && gi < lo)
        return false;
    if (hi >= 0 && gi > hi)
        return false;
    return true;
}
