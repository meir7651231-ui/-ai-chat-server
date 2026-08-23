/** 🪨 טיוטת-חוט (דרגת-מחצבה) · mergeFamilyImport — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/familiesImport.ts:115-123 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): mergeFamilyImport
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function mergeFamilyImport(f, obj) {
    const out = { ...f };
    for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (v)
            out[k] = v;
    }
    return out;
}
