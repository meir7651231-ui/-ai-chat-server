/** 🪨 טיוטת-חוט (דרגת-מחצבה) · namesToTemplateLines — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:119-125 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): namesToTemplateLines
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function namesToTemplateLines(names) {
    return names
        .filter((n) => n.name.trim())
        .map((n) => ({ name: n.name.trim(), qty: +n.eyes || 0, rate: n.rate || 0 }));
}
/** שורות-תבנית → פריטים חדשים (AyinName), עם מזהים מסופק-המזהים. טהור. */
