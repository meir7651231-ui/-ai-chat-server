/** 🪨 טיוטת-חוט (דרגת-מחצבה) · explodeSupporter — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/donationPartition.ts:56-80 (25 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): explodeSupporter, purposeKeyOf, byDateThenRid
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function explodeSupporter(sp) {
    return (sp.donations ?? []).map((d) => ({
        id: d.rid,
        supporterId: sp.id,
        pkey: purposeKeyOf(d),
        donation: d,
    }));
}
/**
 * מיון-תרומות דטרמיניסטי: תאריך ואז rid. יציב חוצה-מכשירים (חשוב — מסמכי-ענן
 * נמשכים ללא-סדר) ואינרטי לצרכנים: כל הצבירות/התצוגות ממיינות בעצמן, ו-first/last
 * מחושבים ב-supporterAggregates לפי min/max תאריך (לא לפי מיקום-במערך).
 */
function byDateThenRid(a, b) {
    if (a.date !== b.date)
        return a.date < b.date ? -1 : 1;
    if (a.rid !== b.rid)
        return a.rid < b.rid ? -1 : 1;
    return 0;
}
/**
 * הרכבה-חזרה (טהור): התומך-הבסיסי + התרומות ממסמכי-הענן שלו, ממוין דטרמיניסטית.
 * מסננים לפי supporterId (הגנה — מסמך זר לא ייכנס לתומך הלא-נכון). `hist` וכל שאר
 * שדות-הבסיס נשמרים כמו-שהם. אינווריאנט: קבוצת-התרומות והצבירה זהות ל-sp המקורי.
 */
