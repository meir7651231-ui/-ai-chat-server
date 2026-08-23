/** 🪨 טיוטת-חוט (דרגת-מחצבה) · donationsPath — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud-diff.ts:67-74 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): donationsPath, colPath
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function donationsPath(slug, cloudRoot) {
    return colPath(slug, cloudRoot, DONATIONS_COL);
}
/**
 * מסלול-B (טהור) — מסיר את `donations` ממסמכי-התומך שב-diff (הם עוברים לאוסף-הנפרד).
 * לא מוט ציה: מחזיר diff חדש. שאר האוספים/meta/deletes ללא-שינוי. במצב-כבוי לא נקרא כלל.
 */
