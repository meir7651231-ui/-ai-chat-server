/** 🪨 טיוטת-חוט (דרגת-מחצבה) · enrollStatusMeta — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/diary/lib.ts:268-276 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): enrollStatusMeta
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function enrollStatusMeta(e) {
    if (e.status === 'paused')
        return { label: 'מוקפא', bg: '#fdf1d4', c: '#9a6414' };
    if (e.status === 'ended')
        return { label: 'הסתיים', bg: '#eceae2', c: '#8b8474' };
    // ⏳ רשימת-המתנה — בלי צ'יפ הממתין/ה נראה/ית כתלמיד/ה רגיל/ה בפאנל-הנוכחות
    if (e.status === 'wait')
        return { label: 'רשימת-המתנה ⏳', bg: '#e7edf5', c: '#3a5a86' };
    return null;
}
/** צ'יפ קטן בסגנון אחיד. */
