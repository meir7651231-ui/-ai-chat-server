/** 🪨 טיוטת-חוט (דרגת-מחצבה) · nameMatches — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/plannedMatch.ts:54-70 (17 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): nameMatches, normName
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function nameMatches(a, b) {
    const na = normName(a);
    const nb = normName(b);
    if (!na || !nb)
        return false;
    if (na === nb)
        return true;
    const wa = new Set(na.split(' ').filter((w) => w.length >= 2));
    const wb = new Set(nb.split(' ').filter((w) => w.length >= 2));
    if (wa.size === 0 || wb.size === 0)
        return false;
    // חפיפה של-לפחות-שני-מילים (שם-פרטי+משפחה) או כל-המילים אם יש רק שם-יחיד
    let overlap = 0;
    for (const w of wa)
        if (wb.has(w))
            overlap++;
    // דורש 2-חופפות (שם-פרטי+משפחה); רק כשלשני-הצדדים שם-יחיד ⇒ די באחת (תואם-מלא)
    const need = wa.size === 1 && wb.size === 1 ? 1 : 2;
    return overlap >= need;
}
/** אוסף כל הפלנים הפתוחים בכל הישויות של ה-DB — עם שמות לצורך שיוך. */
