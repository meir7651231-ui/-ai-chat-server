/** 🪨 טיוטת-חוט (דרגת-מחצבה) · fetchOrgJoinRequests — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:217-222 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): fetchOrgJoinRequests, getDocs, collection, cloudDb, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function fetchOrgJoinRequests(slug) {
    const snap = await getDocs(collection(cloudDb(), PLATFORM_ORGS, slug, 'joinRequests'));
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}
/** המנהל מוחק בקשה (אחרי אישור/דחייה). */
