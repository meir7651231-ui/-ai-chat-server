/** 🪨 טיוטת-חוט (דרגת-מחצבה) · enrollStatusMeta — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:412-420 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): enrollStatusMeta
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function enrollStatusMeta(e) {
    if (e.status === 'paused')
        return { label: 'מוקפא', bg: '#fdf1d4', c: '#9a6414' };
    if (e.status === 'ended')
        return { label: 'הסתיים', bg: '#eceae2', c: '#8b8474' };
    // ⏳ רשימת-המתנה — קודם נפלה ל"פעיל" והטעתה (למשל בכרטיס ⚙ ניהול-שיבוץ)
    if (e.status === 'wait')
        return { label: 'רשימת-המתנה ⏳', bg: '#e7edf5', c: '#3a5a86' };
    return { label: 'פעיל', bg: '#e4f5ea', c: '#12803c' };
}
/** תווית המסלול בשורת תלמיד — כולל הקפאה/סיום, חיסורים ויתרת חוב (כמו planLabel במקור). */
