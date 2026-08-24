/** חוט · phone-key — קודם אוטומטית (אפיון-Golden). חוזה: phone-key.contract.md */
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
