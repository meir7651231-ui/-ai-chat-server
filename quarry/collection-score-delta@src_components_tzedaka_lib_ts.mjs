/** 🪨 טיוטת-חוט (דרגת-מחצבה) · collectionScoreDelta — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:33-51 (19 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): collectionScoreDelta, lastCollectionIso, getTime
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function collectionScoreDelta(box, date, amount, rules = TZ_SCORE_RULES) {
    let pts = rules.emptyPts + Math.floor(amount / rules.ilsPerPoint);
    const prev = lastCollectionIso(box);
    if (prev) {
        const days = Math.round((new Date(date + 'T12:00:00').getTime() - new Date(prev + 'T12:00:00').getTime()) / 86400000);
        if (days >= 0 && days <= rules.streakDays)
            pts += rules.streakPts;
    }
    return pts;
}
/* ---------- סכומים ---------- */
