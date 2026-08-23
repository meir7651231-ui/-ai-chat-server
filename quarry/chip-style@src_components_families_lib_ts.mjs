/** 🪨 טיוטת-חוט (דרגת-מחצבה) · chipStyle — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/families/lib.ts:208-227 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): chipStyle
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function chipStyle(bg, c) {
    return {
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: bg,
        color: c,
        whiteSpace: 'nowrap',
    };
}
/** צבע-שבב למצב-המשפחתי (הצגה בכרטיס/רשימה). ערך לא-מוכר ⇒ שבב ניטרלי. */
const MARITAL_CHIP = {
    נשואים: ['#e6f4ea', '#1e7a3a'],
    'אלמן/ה': ['#eef1f5', '#4a5568'],
    גרושים: ['#fdecec', '#b4433a'],
    פרודים: ['#fff4e5', '#a15c00'],
};
