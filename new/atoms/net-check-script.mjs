/** חוט · net-check-script — קודם אוטומטית (אפיון-Golden). חוזה: net-check-script.contract.md */
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
