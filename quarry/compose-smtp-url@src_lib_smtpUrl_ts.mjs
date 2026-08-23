/** 🪨 טיוטת-חוט (דרגת-מחצבה) · composeSmtpUrl — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/smtpUrl.ts:33-41 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): composeSmtpUrl, encodeURIComponent
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function composeSmtpUrl(email, password, host) {
    const em = email.trim();
    const pw = password.trim();
    const h = host.trim();
    if (!em || !pw || !h || em.indexOf('@') < 1)
        return null;
    const scheme = /:465$/.test(h) ? 'smtps' : 'smtp';
    return `${scheme}://${encodeURIComponent(em)}:${encodeURIComponent(pw)}@${h}`;
}
