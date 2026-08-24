/** חוט · supporter-visible-for-designations — קודם אוטומטית (אפיון-Golden). חוזה: supporter-visible-for-designations.contract.md */
export function supporterVisibleForDesignations(sup, allowed) {
    if (!allowed || !allowed.length)
        return true;
    const fw = (sup.forWho ?? '').trim();
    // הכרעת-בעלים 19.8 (היפוך #8): עובד-סגור-לייעוד רואה **רק** את הייעוד שלו —
    // תורם בלי ייעוד אינו נראה לו (קודם: משותף). אכיפה-מלאה בשרת = עדכון Rules.
    if (!fw)
        return false;
    return new Set(allowed.map((s) => s.trim())).has(fw);
}
/**
 * רשימת-התורמים הגלויה לעובד/ת עם רשימת-ייעודים מותרת — נקודת-חנק אחת לכל
 * המשטחים הנגזרים/המצטברים (מבט-הנהלה, מסך-הבית, קיר-השפעה, דוחות, ייצוא).
 * ‏allowed=null ⇒ הרשימה כמו-שהיא. אחרת: רק תורמים גלויים, ובכל תורם-גלוי רק
 * התרומות בייעוד המותר (תרומה בלי ייעוד = משותפת, נשמרת). כך גם צבירה
 * (סה"כ/מונה/פודיום) לא חושפת סכומים או שמות מייעוד אסור. ה-hist (עסקאות
 * היסטוריות ללא ייעוד) נשמר — הוא ממילא "משותף" בחוזה-הראוּת.
 */
