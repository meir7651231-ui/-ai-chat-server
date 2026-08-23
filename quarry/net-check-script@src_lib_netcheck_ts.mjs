/** 🪨 טיוטת-חוט (דרגת-מחצבה) · netCheckScript — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/netcheck.ts:105-115 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): netCheckScript
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function netCheckScript(results) {
    const blocked = results.filter((r) => !r.ok);
    if (!blocked.length)
        return '';
    return [
        'שלום, אני משתמש/ת במערכת ניהול לעמותה לצורכי עבודה,',
        'ואבקש לפתוח את הכתובות הבאות (כלי-עבודה, ללא תוכן גולשים):',
        ...blocked.map((r) => '• ' + r.domain),
        'תודה רבה!',
    ].join('\n');
}
