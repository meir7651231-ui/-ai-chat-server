/** 🪨 טיוטת-חוט (דרגת-מחצבה) · matCostTotal — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:114-118 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): matCostTotal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function matCostTotal(a) {
    return (a.mat || []).reduce((t, m) => t + (+m.qty || 0) * (+m.cost || 0), 0);
}
/** שורות-פריטים (BOQ) → שורות-תבנית (שם·כמות·מחיר). ריקי-שם מדולגים. טהור. */
