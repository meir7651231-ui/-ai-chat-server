/** 🪨 טיוטת-חוט (דרגת-מחצבה) · writeOrgLead — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:322-326 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): writeOrgLead, addDoc, collection, cloudDb
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function writeOrgLead(lead) {
    await addDoc(collection(cloudDb(), PLATFORM_LEADS), JSON.parse(JSON.stringify(lead)));
}
/** כל הלידים — לוח הבקרה (מיילי-על בלבד לפי Rules). */
