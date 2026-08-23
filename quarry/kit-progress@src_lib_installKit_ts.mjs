/** 🪨 טיוטת-חוט (דרגת-מחצבה) · kitProgress — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/installKit.ts:17-24 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): kitProgress
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function kitProgress(a) {
    const kit = a?.kit || [];
    const total = kit.length;
    const done = kit.reduce((n, k) => n + (k.done ? 1 : 0), 0);
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0, ready: total > 0 && done === total };
}
/** ערכת-ברירת-מחדל לפרויקט-חדש (הצעה; הלקוח עורך). */
