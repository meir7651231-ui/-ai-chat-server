/** 🪨 טיוטת-חוט (דרגת-מחצבה) · presentsInMonth — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:47-56 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): presentsInMonth
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function presentsInMonth(presents, todayIso) {
    const ym = todayIso.slice(0, 7); // YYYY-MM
    return (presents ?? []).filter((d) => typeof d === 'string' && d.slice(0, 7) === ym).length;
}
/**
 * ולידציית טווח תאריכי החוג — מחזיר הודעת שגיאה או null. תאריך סיום מוקדם
 * מתאריך התחלה גורם ל-courseActiveOn להיות false תמיד, כך שהחוג נעלם בשקט
 * מהיומן/הלוח/מפגשי-היום. נתפס בשמירה במקום להיעלם.
 */
