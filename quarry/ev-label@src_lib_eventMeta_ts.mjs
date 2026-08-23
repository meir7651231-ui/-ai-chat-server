/** 🪨 טיוטת-חוט (דרגת-מחצבה) · evLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/eventMeta.ts:19-22 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): evLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function evLabel(ev) {
    return (ev.type === 'custom' && ev.customType) || EV_META[ev.type].label;
}
