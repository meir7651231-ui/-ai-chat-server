/** 🪨 טיוטת-חוט (דרגת-מחצבה) · addOrgMember — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:255-258 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): addOrgMember, updateDoc, cloudDb, arrayUnion
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function addOrgMember(slug, email) {
    await updateDoc(doc(cloudDb(), PLATFORM_ORGS, slug), { members: arrayUnion(email.trim().toLowerCase()) });
}
