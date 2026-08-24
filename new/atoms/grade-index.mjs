/** חוט · grade-index — אינדקס כיתה בסולם, סובלני לגרשיים ולקידומת "כיתה".
 *  חוזה: grade-index.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:456-461; הקבוע GRADE_ORDER
 *  הוזרק כשקע gradeOrder (חוק-1 — אפס import פנימי). */
export function gradeIndex(g, gradeOrder) {
    const clean = (g || '').replace(/["'׳״]/g, '').replace(/^כיתה\s*/, '').trim();
    if (!clean)
        return -1;
    return gradeOrder.indexOf(clean);
}
