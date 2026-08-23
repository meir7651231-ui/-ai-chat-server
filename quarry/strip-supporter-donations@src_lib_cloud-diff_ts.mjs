/** 🪨 טיוטת-חוט (דרגת-מחצבה) · stripSupporterDonations — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud-diff.ts:75-116 (42 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): stripSupporterDonations
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function stripSupporterDonations(diff) {
    return {
        ...diff,
        sets: diff.sets.map((s) => s.col === 'supporters' && s.data && typeof s.data === 'object'
            ? { ...s, data: { ...s.data, donations: [] } }
            : s),
    };
}
/** שדות ה-meta שנבדקים לשינוי (savedAt מוחרג — משתנה בכל שמירה, רעש). */
const META_KEYS = [
    'orgName',
    'orgSite',
    'orgDonate',
    'orgGoal',
    // ציד-באגים 3.8.2026 (🟡): budget (SHOP9) ו-usdRate הם סקלרים ארגוניים עריכים
    // (ליד orgGoal) שנשמטו מסנכרון-הענן ⇒ התחשבנות/מבט-הנהלה ותיוג-תורמים סטו בין מכשירים.
    'budget',
    'usdRate',
    'audit', // לוג-פעולות (#10) — רוכב על meta; חצוב-תקרה בצד-הלקוח (AUDIT_CAP)
    'notif',
    'reports',
    'ui',
    'seq',
    'receiptSeq',
    'donationSeq',
    'shopReceiptSeq',
    'attnDone',
];
/** גוף מסמך meta/org — כל שדות ה-Db שאינם אוספי ישויות (ללא v — נגזר במיגרציה). */
