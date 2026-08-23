/** 🪨 טיוטת-חוט (דרגת-מחצבה) · planWord — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:184-194 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): planWord
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function planWord(model) {
    return model === 'punch'
        ? 'כרטיסייה'
        : model === 'half_year'
            ? 'מנוי חצי-שנתי'
            : model === 'year'
                ? 'מנוי שנתי'
                : 'מנוי חודשי';
}
/** סיומת תקופת המחיר — "לחודש" / "לחצי שנה" / "לשנה" (פורט מ-pricePer). */
