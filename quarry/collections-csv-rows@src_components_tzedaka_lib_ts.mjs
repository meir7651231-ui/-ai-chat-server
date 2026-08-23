/** 🪨 טיוטת-חוט (דרגת-מחצבה) · collectionsCsvRows — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:281-301 (21 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): collectionsCsvRows, termOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function collectionsCsvRows(db, config) {
    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    const rows = [['תאריך', 'רכז', 'קופה', T('entity.family', 'משפחה'), 'סכום', 'מבצע']];
    for (const b of db.tzBoxes) {
        const coord = db.tzCoordinators.find((c) => c.id === b.coordinatorId);
        const fam = db.families.find((f) => f.id === b.famId);
        for (const c of b.collections) {
            const camp = c.campaignId ? db.tzCampaigns.find((p) => p.id === c.campaignId) : undefined;
            rows.push([c.date, coord?.name ?? '', '#' + b.num, fam?.name ?? '', c.amount, camp?.name ?? '']);
        }
    }
    return rows;
}
/**
 * גריד חודשי לועזי/עברי עם האירועים הייעודיים בלבד — wrapper דק על הגנרי
 * המשותף ב-lib/monthGrid (חולץ באשכול חנות 3; החתימה נשמרת כמות שהיא).
 */
