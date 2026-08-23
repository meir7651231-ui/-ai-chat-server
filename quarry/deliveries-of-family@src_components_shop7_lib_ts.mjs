/** 🪨 טיוטת-חוט (דרגת-מחצבה) · deliveriesOfFamily — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:64-72 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): deliveriesOfFamily
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function deliveriesOfFamily(db, famId) {
    return db.deliveries.filter((d) => d.familyId === famId);
}
/**
 * מסירות פתוחות עד-היום שטרם נמסרו — למונה-הבית.
 * תיקון (19.8): גם ימי-חלוקה **שחלפו** ולא נסגרו נספרים (מסירה שלא בוצעה אתמול
 * לא נעלמת מהמונה בחצות); יום שסומן closed = ארכיון ואינו צף מחדש.
 */
