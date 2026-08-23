/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isGrantableFeature — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:194-204 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isGrantableFeature
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isGrantableFeature(key) {
    return GRANTABLE_STAFF_FEATURES.has(key);
}
/**
 * הקונפיג האפקטיבי של עובד/ת = קונפיג-הארגון **בניכוי** מה שהמנהל כיבה לה
 * בכרטיס-העובד (רק הגבלה — לא מדליקה מה שהארגון כיבה). מנהל = קונפיג-הארגון כמו-שהוא.
 * זהה בסמנטיקה ל-featureOn/moduleOn (false=כבוי; חסר=יורש). טהור — לב האכיפה בממשק.
 * **חריג יחיד — GRANTABLE_STAFF_FEATURES:** עבורן `true` בכרטיס-העובד **מדליק** (הדלקה
 * פר-עובד). לכל שאר המפתחות `true` מתעלמים (הגבלה-בלבד, כמקודם).
 */
