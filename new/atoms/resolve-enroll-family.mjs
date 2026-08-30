/** חוט · resolve-enroll-family — פתרון משפחה לשיבוץ-חדש (id קיים / '__new' עם דה-דופ).
 *  חוזה: resolve-enroll-family.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:540-559 (תורגם TS→JS);
 *  השכן normNameLocal הוזרק כשקע normName (חוק-1 — אפס import פנימי). */
export const makeENROLL_NEW_FAMILY = (T) => (T.k1);

export function resolveEnrollFamily(families, famSel, newFamName, normName, T) {
    const existing = families.find((f) => f.id === famSel);
    if (existing)
        return { fam: existing, create: false };
    if (famSel === makeENROLL_NEW_FAMILY(T) && newFamName.trim()) {
        const dup = families.find((f) => normName(f.name) === normName(newFamName));
        if (dup)
            return { fam: dup, create: false };
        return { fam: null, create: true };
    }
    return { fam: null, create: false };
}
