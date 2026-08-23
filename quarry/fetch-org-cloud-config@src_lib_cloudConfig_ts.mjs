/** 🪨 טיוטת-חוט (דרגת-מחצבה) · fetchOrgCloudConfig — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:96-109 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): fetchOrgCloudConfig, getDoc, cloudDb, exists, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function fetchOrgCloudConfig(slug) {
    try {
        const snap = await getDoc(doc(cloudDb(), PLATFORM_ORGS, slug));
        return snap.exists() ? snap.data() : null;
    }
    catch {
        return null;
    }
}
/**
 * האזנה חיה למסמך הארגון (onSnapshot) — הלב של "עריכה בלייב": מתג אצל
 * הבעלים ⇒ ‏cb אצל הלקוח בשניות, בלי רענון. מחזיר unsubscribe; שגיאות
 * (הרשאה/רשת) נבלעות — כשל ענן לא עוצר עבודה מקומית.
 */
