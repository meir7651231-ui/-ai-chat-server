/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supDupFieldValue — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dedup.ts:417-429 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supDupFieldValue
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supDupFieldValue(sups, def, pick, edit) {
    const edited = edit[def.key];
    if (edited != null)
        return edited;
    const idx = pick[def.key] ?? sups.findIndex((s) => def.get(s));
    return def.get(sups[idx >= 0 ? idx : 0]);
}
/** מיזוג קבוצת-תורמים לפי בחירת-שדות — טהור; sups[0] בסיס-השומר (כל הכסף נשמר). */
