/** 🪨 טיוטת-חוט (דרגת-מחצבה) · donationSplitOn — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:63-72 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): donationSplitOn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function donationSplitOn(cfg) {
    return cfg.donationSplit === true;
}
/**
 * אכיפת-תומכים בשכבת-הנתונים (15.8, ארגוני-פלטפורמה בלבד) — off-by-default, רק
 * `supporterEnforce:true` מפורש מפעיל. כשדלוק: מסמכי-תומכים נושאים skey ועובד/ת
 * מוגבל/ת קורא/ת מסונן (Rules פר-skey). ⚠️ אכיפת-השרת עובדת רק בארגון-פלטפורמה;
 * בלקוח-שורש (cloudRoot) אין „עובד מוגבל" בשרת — enableSupEnforce חוסם שורש.
 */
