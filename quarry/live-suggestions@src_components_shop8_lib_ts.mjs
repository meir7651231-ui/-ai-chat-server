/** 🪨 טיוטת-חוט (דרגת-מחצבה) · liveSuggestions — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop8/lib.ts:140-144 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): liveSuggestions, suggestions
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function liveSuggestions(db, todayIso, config) {
    const done = db.attnDone ?? {};
    return suggestions(db, todayIso, config).filter((s) => !done[s.key]);
}
