/** 🪨 טיוטת-חוט (דרגת-מחצבה) · reassembleDonations — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/donationPartition.ts:81-102 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): reassembleDonations
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function reassembleDonations(base, docs) {
    const donations = docs
        .filter((x) => x.supporterId === base.id)
        .map((x) => x.donation)
        .sort(byDateThenRid);
    return { ...base, donations };
}
/**
 * diff ברמת-אוסף-התרומות (טהור) — הצד-הדוחף של מסלול-B. בהינתן רשימות-התומכים
 * לפני/אחרי שינוי מקומי, מחשב אילו מסמכי-תרומה להעלות/למחוק. מקביל ל-diffDb אך
 * לאוסף-התרומות-הנפרד. זהות ה-doc = rid (ייחודי-גלובלי, אינווריאנט-קדוש). תרומה
 * שעברה תומך (supporterId שונה) או ששינתה ייעוד (pkey שונה) = set (התוכן שונה).
 */
