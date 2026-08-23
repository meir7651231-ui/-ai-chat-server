/** 🪨 טיוטת-חוט (דרגת-מחצבה) · writeOrgCloudDoc — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:121-125 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): writeOrgCloudDoc, setDoc, cloudDb
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function writeOrgCloudDoc(slug, data) {
    await setDoc(doc(cloudDb(), PLATFORM_ORGS, slug), JSON.parse(JSON.stringify(data)), { merge: true });
}
/** כתיבת קונפיג הארגון בשלמותו (כל מתג בלוח הבקרה ⇒ הלקוח רואה חי). */
