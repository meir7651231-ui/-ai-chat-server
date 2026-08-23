/** 🪨 טיוטת-חוט (דרגת-מחצבה) · chipStyle — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/diary/lib.ts:277-290 (14 שורות) · תורגם TS→JS מכונה.
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
/** שורת המידע על החדר — כמו slotLabel במקור. */
