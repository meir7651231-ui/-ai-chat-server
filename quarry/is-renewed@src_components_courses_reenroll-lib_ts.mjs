/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isRenewed — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/reenroll-lib.ts:52-80 (29 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isRenewed
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isRenewed(e) {
    return !!e.renewedToId;
}
const STATUS_LABEL = {
    active: 'פעיל',
    paused: 'מושהה',
    ended: 'הסתיים',
    wait: 'רשימת-המתנה',
};
/** "מה היה בעבר" — סיכום דטרמיניסטי פר-שיבוץ מהשדות הקיימים. */
