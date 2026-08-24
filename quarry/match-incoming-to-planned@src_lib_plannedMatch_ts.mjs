/** 🪨 טיוטת-חוט (דרגת-מחצבה) · matchIncomingToPlanned — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/plannedMatch.ts:107-129 (23 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): matchIncomingToPlanned, nameMatches, dayDiff
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function matchIncomingToPlanned(inc, allOpen) {
    const targetCents = Math.round(inc.amount * 100);
    const incDate = (inc.at || '').slice(0, 10); // ISO
    const candidates = [];
    for (const ref of allOpen) {
        const planCents = Math.round(ref.plan.amount * 100);
        if (planCents !== targetCents)
            continue;
        if (!nameMatches(ref.name, inc.name || ''))
            continue;
        if (incDate && ref.plan.date && dayDiff(incDate, ref.plan.date) > DATE_WINDOW_DAYS)
            continue;
        // ציון-דירוג לניפוי-כפולות: תאריך-קרוב + שם-ארוך = יותר-בטוח
        const dd = incDate && ref.plan.date ? dayDiff(incDate, ref.plan.date) : 0;
        const conf = Math.max(60, 100 - dd * 10);
        candidates.push({ ...ref, incomingId: inc.id, confidence: conf });
    }
    if (candidates.length !== 1)
        return null;
    return candidates[0];
}
/**
 * שיוך-מרובה: מריץ matchIncomingToPlanned לכל תשלום-נכנס, ומחזיר רק את
 * אלה שהתאימו חד-משמעית. פלן שכבר-נבחר לתשלום-אחד מוצא מהמאגר לתשלום-הבא
 * (אחרת אותו פלן היה יכול להיתפס פעמיים בבאלק).
 */
