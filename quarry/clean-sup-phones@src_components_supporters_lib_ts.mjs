/** 🪨 טיוטת-חוט (דרגת-מחצבה) · cleanSupPhones — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:300-308 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): cleanSupPhones, fixPhone
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function cleanSupPhones(phones) {
    return (phones ?? [])
        .map((p) => ({ ...p, num: fixPhone((p.num || '').trim()) }))
        .filter((p) => p.num);
}
// ---------- סגולת 40 יום — תזכורות מדורגות (בקשת-שטח) ----------
/** ברירת-מחדל: דילוגי-התזכורת עד יעד-הסגולה (40). מחר → שבוע → 21 → 35 → 40 (סיום). */
