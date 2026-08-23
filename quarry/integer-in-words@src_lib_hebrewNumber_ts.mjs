/** 🪨 טיוטת-חוט (דרגת-מחצבה) · integerInWords — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/hebrewNumber.ts:79-100 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): integerInWords, isFinite, joinHeb, words0_999, thousandWords
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function integerInWords(n) {
    if (!Number.isFinite(n) || n < 0 || n > 999_999_999 || Math.floor(n) !== n)
        return null;
    if (n === 0)
        return 'אפס';
    const millions = Math.floor(n / 1_000_000);
    const thousands = Math.floor((n % 1_000_000) / 1000);
    const rest = n % 1000;
    const groups = [];
    if (millions) {
        if (millions === 1)
            groups.push('מיליון');
        else if (millions === 2)
            groups.push('שני מיליון');
        // איבר אחד — אותו באג-דפוס כמו באלפים ("שמונה עשר ומיליון")
        else
            groups.push(joinHeb(words0_999(millions)) + ' מיליון');
    }
    if (thousands)
        groups.push(...thousandWords(thousands));
    if (rest)
        groups.push(...words0_999(rest));
    return joinHeb(groups);
}
/**
 * סכום כספי במילים: "<שקלים> שקלים ו-<אגורות> אגורות". שקל בודד → "שקל אחד".
 * מחוץ לטווח → fallback לספרות ("₪12,345.60"). currency ברירת מחדל שקלים.
 */
