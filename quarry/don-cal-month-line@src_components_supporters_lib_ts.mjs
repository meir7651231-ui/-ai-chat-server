/** 🪨 טיוטת-חוט (דרגת-מחצבה) · donCalMonthLine — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:340-359 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): donCalMonthLine, termOf, inMonth
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function donCalMonthLine(entries, inMonth, config) {
    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    let mc = 0;
    let mi = 0;
    let mu = 0;
    for (const e of entries) {
        if (!inMonth(e.date))
            continue;
        mc++;
        if (e.cur === '$')
            mu += e.amount || 0;
        else
            mi += e.amount || 0;
    }
    if (!mc)
        return 'אין ' + T('entity.donations', 'תרומות') + ' מתועדות בחודש זה';
    const sums = (mi ? '₪' + mi.toLocaleString('he-IL') : '') + (mi && mu ? ' + ' : '') + (mu ? '$' + mu.toLocaleString('he-IL') : '');
    return mc + ' ' + T('entity.donations', 'תרומות') + ' החודש · ' + (sums || 'סכומים מהקובץ ההיסטורי');
}
/* ── ייבוא תומכות מ-CSV — עדכון-או-הוספה לפי שם מנורמל (טהור, נבדק ביחידה) ── */
/** נרמול שם להשוואה — נרמול חיפוש עברי + הסרת רווחים. */
