/** 🪨 טיוטת-חוט (דרגת-מחצבה) · watchOrgCloudConfig — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:110-120 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): watchOrgCloudConfig, onSnapshot, cloudDb, exists, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function watchOrgCloudConfig(slug, cb) {
    return onSnapshot(doc(cloudDb(), PLATFORM_ORGS, slug), (snap) => cb(snap.exists() ? snap.data() : null), () => {
        /* אין הרשאה/רשת — נשארים על הקונפיג הנוכחי */
    });
}
/** כתיבת מסמך ארגון (לוח הבקרה — מיילי-על בלבד לפי Rules). merge=עדכון חלקי. */
