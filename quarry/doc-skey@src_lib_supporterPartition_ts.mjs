/** 🪨 טיוטת-חוט (דרגת-מחצבה) · docSkey — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supporterPartition.ts:42-51 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): docSkey, supKeyOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function docSkey(col, data, supKeyBySpId) {
    if (col === 'supporters')
        return supKeyOf(data);
    if (col === 'events') {
        const spId = typeof data.spId === 'string' ? data.spId : '';
        return spId ? (supKeyBySpId.get(spId) ?? SHARED_SUP_KEY) : SHARED_SUP_KEY;
    }
    return '';
}
/** מפת spId→skey מרשימת-התומכים — לגזירת מפתח-אירוע בדחיפה/מיגרציה. */
