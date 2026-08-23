/** 🪨 טיוטת-חוט (דרגת-מחצבה) · payLink — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/payLink.ts:15-38 (24 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): payLink, safeHttpsUrl, encodeURIComponent, toString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function payLink(payUrl, amount, name = '') {
    const base = safeHttpsUrl(payUrl);
    if (!base)
        return null;
    const amt = String(Math.max(0, Math.round(amount * 100) / 100));
    if (base.includes('%7Bamount%7D') || base.includes('{amount}')) {
        // תבנית-מותאמת — החלפה בתוך ה-URL (גם בצורה המקודדת שה-URL parser מייצר).
        // סכום 0 ("לא-ידוע", קישור-תרומה-כללי) ⇒ שדה-ריק, עקבי עם מצב-הפרמטרים (לא Amount=0).
        return base
            .replace(/%7Bamount%7D|\{amount\}/g, amt === '0' ? '' : encodeURIComponent(amt))
            .replace(/%7Bname%7D|\{name\}/g, encodeURIComponent(name));
    }
    const u = new URL(base);
    // כיוון-יוצא נדרים-פלוס: עמוד-הסליקה שלהם קורא **Amount/ClientName** (PascalCase),
    // לא amount/name. זיהוי-מארח ⇒ מילוי-מראש שבאמת נתפס ("המערכת לוחצת על הקישור").
    if (/(^|\.)matara\.pro$/i.test(u.hostname) && /nedarimplus/i.test(u.pathname + u.search)) {
        if (amt !== '0')
            u.searchParams.set('Amount', amt);
        if (name.trim())
            u.searchParams.set('ClientName', name.trim());
        return u.toString();
    }
    if (amt !== '0')
        u.searchParams.set('amount', amt);
    if (name.trim())
        u.searchParams.set('name', name.trim());
    return u.toString();
}
