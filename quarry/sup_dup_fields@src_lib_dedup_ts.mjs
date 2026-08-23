/** 🪨 טיוטת-חוט (דרגת-מחצבה) · SUP_DUP_FIELDS — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dedup.ts:404-416 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const SUP_DUP_FIELDS = [
    { key: 'name', label: 'שם', get: (s) => s.name || '' },
    { key: 'phone', label: 'טלפון', get: (s) => s.phone || '' },
    { key: 'email', label: 'אימייל', get: (s) => s.email || '' },
    { key: 'idNum', label: 'ת"ז', get: (s) => s.idNum || '' },
    { key: 'city', label: 'עיר', get: (s) => s.city || '' },
    { key: 'address', label: 'כתובת', get: (s) => s.address || '' },
    { key: 'cat', label: 'קטגוריה', get: (s) => s.cat || '' },
    { key: 'forWho', label: 'ייעוד', get: (s) => s.forWho || '' },
    { key: 'notes', label: 'הערות', get: (s) => s.notes || '' },
];
/** ערך-שדה נבחר: edit גובר; אחרת pick; אחרת הרשומה הראשונה עם ערך. */
