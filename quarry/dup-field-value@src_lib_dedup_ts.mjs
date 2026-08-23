/** 🪨 טיוטת-חוט (דרגת-מחצבה) · dupFieldValue — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dedup.ts:211-223 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): dupFieldValue
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function dupFieldValue(fams, def, pick, edit) {
    const edited = edit[def.key];
    if (edited != null)
        return edited;
    const idx = pick[def.key] ?? fams.findIndex((f) => def.get(f));
    return def.get(fams[idx >= 0 ? idx : 0]);
}
/** מיזוג קבוצה לפי בחירת-שדות — טהור; fams[0] הוא בסיס השומר. */
