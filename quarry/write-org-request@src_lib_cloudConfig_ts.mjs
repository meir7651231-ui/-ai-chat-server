/** 🪨 טיוטת-חוט (דרגת-מחצבה) · writeOrgRequest — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:173-177 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): writeOrgRequest, setDoc, cloudDb
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function writeOrgRequest(uid, req) {
    await setDoc(doc(cloudDb(), PLATFORM_REQUESTS, uid), JSON.parse(JSON.stringify(req)));
}
/** כל הבקשות הממתינות — לוח הבקרה (מיילי-על בלבד לפי Rules). */
