/** 🪨 טיוטת-חוט (דרגת-מחצבה) · matchAll — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/plannedMatch.ts:130-144 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): matchAll, matchIncomingToPlanned
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function matchAll(incomings, allOpen) {
    const out = [];
    const used = new Set(); // planId שכבר-שויך בסבב-הזה
    const pool = [...allOpen];
    for (const inc of incomings) {
        const stillOpen = pool.filter((r) => !used.has(r.plan.id));
        const m = matchIncomingToPlanned(inc, stillOpen);
        if (m) {
            out.push(m);
            used.add(m.plan.id);
        }
    }
    return out;
}
