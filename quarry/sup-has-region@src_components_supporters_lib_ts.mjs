/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supHasRegion — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:295-299 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supHasRegion, allSupPhones
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supHasRegion(sp, region) {
    return allSupPhones(sp).some((r) => r.region === region);
}
/** ניקוי מערך-טלפונים לשמירה: fixPhone לכל מספר, סינון ריקים, שמירת שדות. */
