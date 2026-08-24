/** 🪨 טיוטת-חוט (דרגת-מחצבה) · findAllOpenPlans — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/plannedMatch.ts:71-106 (36 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): findAllOpenPlans
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function findAllOpenPlans(db) {
    const out = [];
    for (const sup of db.supporters) {
        for (const pl of sup.plannedCharges || []) {
            if (pl.chargedRid || pl.cancelledAt)
                continue;
            out.push({ entityType: 'supporter', entityId: sup.id, plan: pl, name: sup.name });
        }
    }
    for (const en of db.enrollments) {
        if (!en.plannedCharges?.length)
            continue;
        // שם: חבר-במשפחה של השיבוץ (לצורך התאמה מול name בעסקה)
        const fam = db.families.find((f) => f.members.some((m) => m.id === en.memberId));
        const mem = fam?.members.find((m) => m.id === en.memberId);
        const nm = ((mem?.first || '') + ' ' + (fam?.name || '')).trim();
        for (const pl of en.plannedCharges) {
            if (pl.chargedRid || pl.cancelledAt)
                continue;
            out.push({ entityType: 'enrollment', entityId: en.id, plan: pl, name: nm });
        }
    }
    for (const a of db.shopAssignments) {
        if (!a.plannedCharges?.length)
            continue;
        const fam = db.families.find((f) => f.id === a.famId);
        const nm = fam?.name || '';
        for (const pl of a.plannedCharges) {
            if (pl.chargedRid || pl.cancelledAt)
                continue;
            out.push({ entityType: 'shopAssignment', entityId: a.id, plan: pl, name: nm });
        }
    }
    return out;
}
/**
 * מוצא את הפלן-הפתוח שהתאים לתשלום-נכנס. `null` = אין התאמה או אמביגואי.
 * קריטריון: סכום זהה (לפי-אגורות), שם-דומה (2 מילים לפחות), תאריך ±3 ימים.
 * אמביגואי (יותר-מ-1 מועמד) ⇒ null (הכפתור-הידני יבחר).
 */
