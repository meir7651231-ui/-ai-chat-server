/** 🪨 טיוטת-חוט (דרגת-מחצבה) · findMemberOrgSlugs — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:190-202 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): findMemberOrgSlugs, query, collection, cloudDb, where, getDocs
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function findMemberOrgSlugs(email) {
    try {
        const mail = email.trim().toLowerCase();
        if (!mail)
            return [];
        const q = query(collection(cloudDb(), PLATFORM_ORGS), where('members', 'array-contains', mail));
        const snap = await getDocs(q);
        return snap.docs.map((d) => d.id);
    }
    catch {
        return [];
    }
}
/** כל ארגוני הפלטפורמה — לוח הבקרה (מיילי-על בלבד לפי Rules). */
