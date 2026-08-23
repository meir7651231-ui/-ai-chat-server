/** 🪨 טיוטת-חוט (דרגת-מחצבה) · newSupporterFromRow — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:652-678 (27 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): newSupporterFromRow, fixPhone, mergeHist
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function newSupporterFromRow(id, row) {
    return {
        id,
        name: row.name.trim(),
        phone: fixPhone(row.phone.trim()),
        email: row.email.trim(),
        idNum: row.idNum.trim(),
        address: row.address.trim(),
        cat: row.cat.trim(),
        forWho: row.forWho.trim(),
        notes: '',
        count: 0,
        ils: 0,
        usd: 0,
        first: '',
        last: '',
        nextDate: '',
        donations: [],
        ...(row.hist?.length ? { hist: mergeHist([], row.hist) } : {}),
    };
}
/* ─────────── 🔁 הוראות-קבע (ROADMAP-100 ‏#2 צד-מערכת, 5.8.2026) ───────────
 * ההגדרה על התומך (Supporter.hok); הרישום-בפועל = תרומה רגילה עם HOK_CAT
 * (קבלה בסדרה הרציפה). "נרשמה החודש" = תרומה בחודש-האזרחי הנוכחי בקטגוריית
 * הו"ק **או** בסכום-ומטבע של ההוראה (תרומה חד-פעמית נוספת לא מכסה). */
