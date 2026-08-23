/** 🪨 טיוטת-חוט (דרגת-מחצבה) · donAllowedKeys — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/donationPartition.ts:34-55 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): donAllowedKeys
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function donAllowedKeys(allowed) {
    const clean = [...new Set(allowed.map((s) => s.trim()).filter(Boolean))].slice(0, 29);
    return [...clean, SHARED_PURPOSE_KEY];
}
/**
 * פירוק תרומות-התומך למסמכי-ענן (טהור). `hist` **אינו** נכלל — הוא לא-קבלה, מקונן,
 * בלי rid/ייעוד, נשאר בתוך מסמך-התומך (אינווריאנט-קדוש). התרומות לא ממוינות כאן —
 * הסדר נקבע בהרכבה-חזרה (דטרמיניסטי, חוצה-מכשירים).
 */
