/** 🪨 טיוטת-חוט (דרגת-מחצבה) · deleteOrgRequest — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:168-172 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): deleteOrgRequest, deleteDoc, cloudDb
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function deleteOrgRequest(uid) {
    await deleteDoc(doc(cloudDb(), PLATFORM_REQUESTS, uid));
}
/** כתיבת בקשת הרשמה — המסמך היחיד שנרשם-חדש רשאי לכתוב (Rules v2). */
