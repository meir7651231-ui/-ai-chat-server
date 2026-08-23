/** 🪨 טיוטת-חוט (דרגת-מחצבה) · punchConfirmStep — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:572-591 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): punchConfirmStep
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function punchConfirmStep(confirmOn, armed, enrollmentId, now) {
    if (!confirmOn)
        return { fire: true, next: null };
    if (armed && armed.id === enrollmentId && now - armed.armedAt <= PUNCH_CONFIRM_MS) {
        return { fire: true, next: null };
    }
    // אין זריון / שיבוץ אחר / החלון פג — מזיינים (מחדש) את השיבוץ הנוכחי
    return { fire: false, next: { id: enrollmentId, armedAt: now } };
}
/**
 * 🎡 גלגל-החוגים · מצב-ידני (17.8) — איזה קטע נמצא מתחת למחוג-העליון בזווית-סיבוב
 * נתונה. טהור וניתן-לבדיקה. הקטעים מתחילים ב-−90° (למעלה) בכיוון-השעון; הקבוצה
 * מסובבת ב-`rot` מעלות. הקטע-מתחת-למחוג = ‏floor(((−rot) mod 360) / step) mod n.
 * (עקבי עם חישוב-המנצח של הסיבוב-האקראי: ‏rot=targetMod ⇒ מחזיר את idx המקורי.)
 */
