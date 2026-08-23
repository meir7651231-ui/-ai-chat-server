/** 🪨 טיוטת-חוט (דרגת-מחצבה) · lastCollectionIso — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:26-32 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): lastCollectionIso
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function lastCollectionIso(box) {
    let last = '';
    for (const c of box.collections)
        if (c.date > last)
            last = c.date;
    return last;
}
/** דלתת הניקוד על ריקון — לפני הוספת הריקון לקופה (הרצף נמדד מול הקודם). */
