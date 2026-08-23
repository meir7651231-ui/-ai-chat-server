/** 🪨 טיוטת-חוט (דרגת-מחצבה) · migrateDonationsToCollection — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:201-213 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): migrateDonationsToCollection, import, donationPartitionDiff, pushDonations
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function migrateDonationsToCollection(supporters, dek) {
    const { donationPartitionDiff } = await import('./donationPartition');
    const diff = donationPartitionDiff([], supporters); // prev ריק ⇒ כל התרומות = sets
    await pushDonations(diff, dek);
    return diff.sets.length;
}
/**
 * אכיפת-תומכים · מיגרציה חד-פעמית (חלון-בעלים): כותבת-מחדש כל מסמך-תומך **עם**
 * `skey`=forWho (upsert לפי id) — התוכן ביט-זהה, רק נוסף מפתח-plaintext. אידמפוטנטית
 * ולא-הרסת (בלי skey הסינון פשוט לא מסנן). מריצים לפני הדלקת supEnforce. מחזירה
 * את מספר התומכים ש-seed להם skey. (לא נוגעת בתרומות/מונים/rid.)
 */
