/** 🪨 טיוטת-חוט (דרגת-מחצבה) · receiptVerifyCode — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/receipt.ts:75-85 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): receiptVerifyCode, charCodeAt, imul, toString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function receiptVerifyCode(rid, amount, currency, date) {
    const s = rid + '|' + amount + '|' + (currency || '₪') + '|' + date.slice(0, 10);
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
    }
    const code = h.toString(36).toUpperCase().padStart(7, '0').slice(-6);
    return code.slice(0, 3) + '-' + code.slice(3);
}
