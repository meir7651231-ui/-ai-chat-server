/** 🪨 טיוטת-חוט (דרגת-מחצבה) · readOrgSecretsMeta — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:158-167 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): readOrgSecretsMeta, getDoc, cloudDb, exists, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function readOrgSecretsMeta(slug) {
    try {
        const snap = await getDoc(doc(cloudDb(), ORG_SECRETS_META, slug));
        return snap.exists() ? snap.data() : {};
    }
    catch {
        return {};
    }
}
/** מחיקת בקשת הרשמה (אישור/דחייה בלוח הבקרה). */
