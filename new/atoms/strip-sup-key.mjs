/** חוט · strip-sup-key — קודם אוטומטית (אפיון-Golden). חוזה: strip-sup-key.contract.md */
export function stripSupKey(data) {
    if (!('skey' in data))
        return data;
    const { skey: _s, ...rest } = data;
    void _s;
    return rest;
}
/**
 * קילוף לוג-הפעולות (`audit`) ממסמך-ה-meta (משטח #3): הלוג נושא שמות-תורמים ורוכב
 * על ה-meta המשותף שכל חבר מושך. כשהאכיפה דלוקה מקלפים אותו לפני הכתיבה לענן —
 * הלוג נשאר מקומי פר-מכשיר, ועובדת לא תלמד על תורם של אחרת דרכו. כבוי ⇒ לא נקרא.
 */
