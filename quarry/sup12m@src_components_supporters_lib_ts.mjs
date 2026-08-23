/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sup12m — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:198-211 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sup12m, setDate, getDate, getFullYear, getMonth, supLast
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function sup12m(supporters, todayIso) {
    const d = new Date(todayIso + 'T12:00:00');
    d.setDate(d.getDate() - 365);
    const p2 = (n) => String(n).padStart(2, '0');
    const cut = `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
    let n = 0;
    for (const sp of supporters) {
        const last = supLast(sp);
        if (last && last >= cut)
            n++;
    }
    return n;
}
/** צ'יפ דרגה/סטטוס קטן בסגנון אחיד. */
