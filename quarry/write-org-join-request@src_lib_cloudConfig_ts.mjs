/** 🪨 טיוטת-חוט (דרגת-מחצבה) · writeOrgJoinRequest — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:212-216 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): writeOrgJoinRequest, setDoc, cloudDb
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function writeOrgJoinRequest(slug, uid, req) {
    await setDoc(doc(cloudDb(), PLATFORM_ORGS, slug, 'joinRequests', uid), JSON.parse(JSON.stringify(req)));
}
/** המנהל מושך את הבקשות הממתינות של הארגון שלו. */
