/** 🪨 טיוטת-חוט (דרגת-מחצבה) · mergeSupporterRow — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:637-651 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): mergeSupporterRow, mergeHist, fixPhone
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function mergeSupporterRow(sp, row) {
    return {
        ...sp,
        ...(row.hist?.length ? { hist: mergeHist(sp.hist ?? [], row.hist) } : {}),
        name: row.name.trim() || sp.name,
        phone: row.phone ? fixPhone(row.phone.trim()) : sp.phone,
        email: row.email.trim() || sp.email,
        idNum: row.idNum.trim() || sp.idNum,
        address: row.address.trim() || sp.address,
        cat: row.cat.trim() || sp.cat,
        forWho: row.forWho.trim() || sp.forWho,
    };
}
/** יצירת תומכת חדשה משורת ייבוא (מונים ותרומות מתחילים מאפס). */
