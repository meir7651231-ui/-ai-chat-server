/** 🪨 טיוטת-חוט (דרגת-מחצבה) · planLabelOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/diary/lib.ts:261-267 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): planLabelOf, planWord
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function planLabelOf(e) {
    return e.plan === 'punch'
        ? `כרטיסייה · יתרה ${Math.max(0, e.purchased - e.used)}/${e.purchased}`
        : planWord(e.plan);
}
/** תוויות סטטוס שיבוץ (כמו במודול הקורסים). */
