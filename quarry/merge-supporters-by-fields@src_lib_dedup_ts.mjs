/** 🪨 טיוטת-חוט (דרגת-מחצבה) · mergeSupportersByFields — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dedup.ts:430-453 (24 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): mergeSupportersByFields, mergeSupportersGroup, supDupFieldValue
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function mergeSupportersByFields(sups, pick, edit) {
    const base = mergeSupportersGroup(sups[0], sups.slice(1));
    const out = { ...base };
    for (const def of SUP_DUP_FIELDS) {
        const val = supDupFieldValue(sups, def, pick, edit);
        switch (def.key) {
            case 'name':
                out.name = val;
                break;
            case 'phone':
                out.phone = val;
                break;
            case 'email':
                out.email = val;
                break;
            case 'idNum':
                out.idNum = val;
                break;
            case 'city':
                out.city = val;
                break;
            case 'address':
                out.address = val;
                break;
            case 'cat':
                out.cat = val;
                break;
            case 'forWho':
                out.forWho = val;
                break;
            case 'notes':
                out.notes = val;
                break;
        }
    }
    return out;
}
