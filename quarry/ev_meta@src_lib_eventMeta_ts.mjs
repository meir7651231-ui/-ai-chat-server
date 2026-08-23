/** 🪨 טיוטת-חוט (דרגת-מחצבה) · EV_META — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/eventMeta.ts:7-18 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const EV_META = {
    reminder: { label: 'תזכורת', bg: '#efe7f3', c: '#7c3aed' },
    call: { label: 'טלפון', bg: '#dff0ec', c: '#0f766e' },
    wedding: { label: 'חתונה', bg: '#fdeee0', c: '#b45309' },
    memorial: { label: 'אזכרה', bg: '#eceae2', c: '#4d463c' },
    anniversary: { label: 'יום נישואים', bg: '#fbeef3', c: '#be185d' },
    bday: { label: 'יום הולדת', bg: '#fbeef3', c: '#be185d' },
    org: { label: 'אירוע', bg: '#e7edf5', c: '#3a5a86' },
    custom: { label: 'אירוע', bg: '#e7edf5', c: '#3a5a86' },
};
/** תווית אירוע — סוג 'custom' עם טקסט חופשי מציג אותו, אחרת התווית לפי הסוג. */
