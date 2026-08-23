/** 🪨 טיוטת-חוט (דרגת-מחצבה) · ENTITY_COLLECTIONS — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud-diff.ts:11-44 (34 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const ENTITY_COLLECTIONS = [
    'families',
    'courses',
    'enrollments',
    'events',
    'rooms',
    'teachers',
    'supporters',
    'tzCoordinators',
    'tzBoxes',
    'tzCampaigns',
    'tzEvents',
    'shopItems',
    'shopProducts',
    'shopStores',
    'shopCriteria',
    'shopAssignments',
    'shopEvents',
    'shopIntakes',
    'volunteers',
    'distributionDays',
    'deliveries',
    'tasks',
    'warehouse',
];
/* ---------- נתיבים פר-ארגון (CLOUD2 ענן 1) ---------- */
/**
 * נתיב אוסף בענן: ‏cloudRoot=true ⇒ האוסף בשורש הפרויקט — **ביט-זהה להיום**
 * (הגנה על הלקוח החי maor-hachesed); אחרת ⇒ `orgs/{slug}/{col}` (ארגון-פלטפורמה).
 */
