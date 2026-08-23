/** 🪨 טיוטת-חוט (דרגת-מחצבה) · blockReason — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/diary/lib.ts:97-138 (42 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): blockReason, getDay, hebParts, courseOnDate
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function blockReason(d, blockingOn = true) {
    if (!blockingOn)
        return null;
    const dow = d.getDay();
    if (dow === 6)
        return 'שבת';
    if (dow === 5)
        return 'יום שישי (שעתיים לפני שבת)';
    const hp = hebParts(d);
    const hol = HOLIDAYS[`${hp.month} ${hp.day}`];
    if (hol && FULL_HOLIDAYS.includes(hol))
        return hol;
    // צום תשעה באב נדחה: כשט' באב חל בשבת, הצום נצפה בי' באב (ראשון). ט' באב עצמו
    // נחסם כ'שבת', אך י' באב — הצום בפועל — לא נחסם ביומן (בלוח calLib הדין קיים; כאן חסר).
    if (dow === 0 && hp.month === 'Av' && hp.day === 10)
        return 'תשעה באב (נדחה)';
    if ((hp.month === 'Tishri' && hp.day >= 16 && hp.day <= 21) || (hp.month === 'Nisan' && hp.day >= 16 && hp.day <= 20))
        return 'חול המועד';
    return null;
}
/** האם הקורס פעיל בתאריך הנתון (טווח start–end, כמו במקור). */
function courseOnDate(c, iso) {
    return (!c.start || iso >= c.start) && (!c.end || iso <= c.end);
}
/**
 * בונה את משבצות היום לחדר: מ-room.from עד room.to בקפיצות של room.slot דקות.
 * 15:00–16:00 — ניקיון יומי קבוע בכל החדרים (כמו במקור). מפגשים מחוץ לשעות
 * הפעילות מתווספים בסוף כדי שרישום נוכחות תמיד יהיה נגיש.
 */
