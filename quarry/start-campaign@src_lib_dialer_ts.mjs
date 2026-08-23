/** 🪨 טיוטת-חוט (דרגת-מחצבה) · startCampaign — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dialer.ts:25-36 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): startCampaign
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function startCampaign(name, ids, iso) {
    const seen = new Set();
    const queue = [];
    for (const id of ids) {
        if (!id || seen.has(id))
            continue;
        seen.add(id);
        queue.push(id);
    }
    return { name, startedAt: iso, queue, total: queue.length, log: [] };
}
/** המזהה הנוכחי (חזית-התור), או null כשהתור ריק (הקמפיין הסתיים). */
