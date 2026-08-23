/** 🪨 טיוטת-חוט (דרגת-מחצבה) · phoneKey — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/callerId.ts:57-69 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): phoneKey
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function phoneKey(raw) {
    let d = (raw || '').replace(/\D/g, '');
    if (!d)
        return '';
    if (d.startsWith('00'))
        d = d.slice(2);
    if (d.startsWith('972'))
        d = d.slice(3);
    d = d.replace(/^0+/, '');
    return d;
}
/**
 * מזהה את המתקשר לפי מספרו — הראשון שמתאים לפי סדר-עדיפות: משפחה (טלפון ראשי/
 * נוסף) → בן-משפחה → תורם → מתנדב → רכז. בלי התאמה/מספר-קצר ⇒ null.
 */
