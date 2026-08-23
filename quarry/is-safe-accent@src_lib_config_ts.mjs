/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isSafeAccent — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:866-874 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isSafeAccent
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isSafeAccent(a) {
    return (/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(a) ||
        /^(?:rgb|rgba|hsl|hsla)\([0-9.,%\s/]+\)$/i.test(a) ||
        /^[a-zA-Z]{3,20}$/.test(a));
}
/** החלת ערכת נושא + דריסת צבע הדגשה (+ סגנון-תנועה) על ה-DOM. */
