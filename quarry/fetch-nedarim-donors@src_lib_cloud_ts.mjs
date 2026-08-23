/** 🪨 טיוטת-חוט (דרגת-מחצבה) · fetchNedarimDonors — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:663-669 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): fetchNedarimDonors, getDocs, collection, requireDb, scopedCol, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function fetchNedarimDonors() {
    const snap = await getDocs(collection(requireDb(), scopedCol('nedarimDonors')));
    return snap.docs.map((d) => ({ toremId: d.id, ...d.data() }));
}
/** התשלומים הממתינים ("💰 תשלומים נכנסים"). אוסף-ריק ⇒ [] (הצלחה); כשל-קריאה אמיתי
 *  ⇒ **זורק** (ה-caller מציג 'שגיאת-חיבור' ולא 'אין תשלומים'/'הכול מסונכרן'). */
