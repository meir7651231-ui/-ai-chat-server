/** 🪨 טיוטת-חוט (דרגת-מחצבה) · templateLinesToNames — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:126-144 (19 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): templateLinesToNames, nextId
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function templateLinesToNames(lines, nextId) {
    return lines
        .filter((l) => (l.name || '').trim())
        .map((l, i) => ({
        id: nextId(i),
        name: l.name.trim(),
        eyes: +l.qty || 0,
        done: false,
        ...(l.rate > 0 ? { rate: l.rate } : {}),
    }));
}
/**
 * האם הכפתור-החכם מוצג בשלב הנוכחי — שלב 'new' דורש לפחות פריט אחד,
 * שלב 'eyes' דורש שנרשם מונה לפחות לאחד הפריטים, 'done' מסתיים.
 */
