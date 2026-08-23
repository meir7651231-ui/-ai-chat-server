/** 🪨 טיוטת-חוט (דרגת-מחצבה) · DUP_FIELDS — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dedup.ts:189-210 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const DUP_FIELDS = [
    { key: 'name', label: 'שם משפחה', get: (f) => f.name || '' },
    { key: 'mother', label: 'שם האם', get: (f) => f.mother || '' },
    { key: 'father', label: 'שם האב', get: (f) => f.father || '' },
    { key: 'phone', label: 'טלפון', get: (f) => f.phone || '' },
    { key: 'phone2', label: 'טלפון 2', get: (f) => f.phone2 || '' },
    { key: 'email', label: 'אימייל', get: (f) => f.email || '' },
    { key: 'city', label: 'עיר', get: (f) => f.city || '' },
    { key: 'address', label: 'כתובת', get: (f) => f.address || '' },
    { key: 'motherId', label: 'ת"ז אם', get: (f) => f.motherId || '' },
    { key: 'fatherId', label: 'ת"ז אב', get: (f) => f.fatherId || '' },
    { key: 'community', label: 'קהילה', get: (f) => f.community || '' },
    { key: 'language', label: 'שפה', get: (f) => f.language || '' },
    { key: 'maritalStatus', label: 'מצב משפחתי', get: (f) => f.maritalStatus || '' },
    { key: 'status', label: 'סטטוס', get: (f) => f.status || '' },
    { key: 'kidsHome', label: 'ילדים בבית', get: (f) => (f.kidsHome == null ? '' : String(f.kidsHome)) },
    { key: 'kidsMarried', label: 'ילדים נשואים', get: (f) => (f.kidsMarried == null ? '' : String(f.kidsMarried)) },
    { key: 'createdAt', label: 'נרשמה', get: (f) => f.createdAt || '' },
    { key: 'notes', label: 'הערות', get: (f) => f.notes || '' },
];
/** ערך שדה נבחר לפי הלגאסי: edit גובר; אחרת pick; אחרת הראשונה עם ערך. */
