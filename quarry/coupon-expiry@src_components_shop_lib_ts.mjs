/** 🪨 טיוטת-חוט (דרגת-מחצבה) · couponExpiry — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:221-238 (18 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): couponExpiry, setDate, getDate, isoOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function couponExpiry(a, comp) {
    if (!comp.validDays || !a.since)
        return '';
    const d = new Date(a.since + 'T12:00:00');
    d.setDate(d.getDate() + comp.validDays);
    return isoOf(d);
}
/** ימי ההתראה למתנת-חג — חג בתוך ≤30 יום בלי מימוש נכנס לרשימת הטיפול. */
