/** 🪨 טיוטת-חוט (דרגת-מחצבה) · assignmentRedeemed — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:180-199 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): assignmentRedeemed, liveRedemptions, hebYearOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function assignmentRedeemed(a, componentId, holiday) {
    const live = liveRedemptions(a);
    if (!holiday)
        return live.some((r) => r.componentId === componentId);
    const year = hebYearOf(holiday.iso);
    return live.some((r) => r.componentId === componentId && r.holiday === holiday.name && !!r.date && hebYearOf(r.date) === year);
}
/* ---------- מלאי ---------- */
/**
 * הנותר במלאי לרכיב — null כשאין מעקב (stock=undefined); אחרת stock פחות
 * סך מימושי הרכיב בכל שיוכי המוצר, קטום ב-0. המלאי נצרך במימוש —
 * לא בשיוך (שיוך = הבטחה, מימוש = מסירה בפועל).
 */
