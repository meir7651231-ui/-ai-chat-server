/** 🪨 טיוטת-חוט (דרגת-מחצבה) · finderAxes — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/families/lib.ts:87-101 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): finderAxes, termOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function finderAxes(config) {
    return [
        ['city', 'עיר'],
        ['comm', 'קהילה'],
        ['marital', 'מצב משפחתי'],
        ['status', 'סטטוס'],
        ['cred', termOf(config, 'entity.cred', 'אמינות')],
        ['kids', 'ילדים'],
        ['enrolled', termOf(config, 'nav.courses', 'חוגים')],
        ['sefach', 'ספח מלא'],
        ['lang', 'שפה'],
    ];
}
/** ערך המשפחה בציר נתון — תוויות עבריות כמו במקור. */
